import React, { act, useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Pill,
  FileText,
  User,
  Heart,
  Activity,
  TestTube,
  Download,
  Eye,
  Bell,
  Users,
  RefreshCcw,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/dbConfig";
import {
  Appointments,
  Consultations,
  Doctors,
  LabTests,
  Prescriptions,
} from "@/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { eq } from "drizzle-orm";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { getPatientAppointments } from "@/lib/patients/appointment";
import { set } from "date-fns";

const CancelModal = ({ isOpen, onClose, onCancel, appointment }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reason for cancellation:", reason);
    onCancel(reason);
    onClose();
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-400 border border-dark-500 rounded-3xl text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-20-bold lg:text-24-bold">
            Cancel Appointment
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-dark-700 text-14-regular lg:text-16-regular mb-6">
          Are you sure you want to cancel your appointment with{" "}
          <span className="text-white font-semibold">
            {appointment?.doctorName}
          </span>
          ?
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="shad-input-label block mb-2">
              Reason for cancellation
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ex: Urgent meeting came up"
              className="shad-textArea w-full text-white min-h-[100px] resize-none"
              rows={4}
              required
            />
          </div>

          <DialogFooter className="flex gap-4">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-3xl text-14-semibold lg:text-16-semibold transition-colors"
              >
                Keep Appointment
              </button>
            </DialogClose>
            <button
              type="submit"
              className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-3xl text-14-semibold lg:text-16-semibold transition-colors"
              disabled={!reason}
            >
              Cancel Appointment
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RescheduleModal = ({
  isOpen,
  onClose,
  onReschedule,
  appointment,
  existingAppointments,
  allAppointments,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekSchedule, setWeekSchedule] = useState([]);

  // Generate slots from doctor's availability
  const generateWeekSchedule = (weekOffset) => {
    if (!appointment?.doctor) return [];

    const { availableDays, availableHours } = appointment.doctor;

    const today = new Date();

    // Always use IST local date for comparisons
    const todayStr = today.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + weekOffset * 7);

    const schedule = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "Asia/Kolkata",
      });
      const shortDay = date.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "Asia/Kolkata",
      });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });

      // Use IST yyyy-mm-dd for database matching
      const fullDate = date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      const slots = [];
      if (availableDays.includes(dayName)) {
        const [startHour, startMinute] = availableHours.start
          .split(":")
          .map(Number);
        const [endHour, endMinute] = availableHours.end.split(":").map(Number);

        let current = new Date(date);
        current.setHours(startHour, startMinute, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMinute, 0, 0);

        while (current <= end) {
          const timeString = current.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata", // enforce IST
          });

          // Match booked appointments with strict format
          const isBooked = allAppointments.some(
            (apt) =>
              apt.doctorId === appointment.doctor.userId &&
              apt.date === fullDate &&
              apt.time.toLowerCase() === timeString.toLowerCase() &&
              apt.status === "upcoming"
          );

          // Compare with IST-safe today string
          const timePassed =
            fullDate < todayStr || (fullDate === todayStr && current < today);

          slots.push({
            time: timeString,
            available: !isBooked && !timePassed,
          });

          current.setMinutes(current.getMinutes() + 30);
        }
      }

      schedule.push({ date: dateStr, dayName: shortDay, fullDate, slots });
    }

    console.log(schedule);

    return schedule;
  };

  useEffect(() => {
    if (isOpen) {
      setWeekSchedule(generateWeekSchedule(0));
    }
  }, [isOpen, appointment]);

  const handleWeekChange = (direction) => {
    const newWeek = direction === "next" ? currentWeek + 1 : currentWeek - 1;
    setCurrentWeek(newWeek);
    setWeekSchedule(generateWeekSchedule(newWeek));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      onReschedule(selectedDate, selectedTime);
      onClose();
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-20-bold lg:text-24-bold text-white">
              Reschedule Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current Appointment Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 lg:p-6 mb-8">
            <h3 className="text-16-semibold lg:text-18-semibold text-white mb-4">
              Current Appointment
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={appointment?.doctor.avatar}
                alt={appointment?.doctor.name}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h4 className="text-14-semibold lg:text-16-semibold text-white">
                  {appointment?.doctor.name}
                </h4>
                <p className="text-14-regular text-blue-400">
                  {appointment?.doctor.speciality}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-12-regular lg:text-14-regular text-dark-700 mt-2">
                  <span>{appointment?.date}</span>
                  <span>{appointment?.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Time Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-18-bold lg:text-20-bold text-white">
                Select New Date & Time
              </h3>
              <div className="flex items-center gap-2 lg:gap-4">
                <button
                  onClick={() => handleWeekChange("prev")}
                  className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </button>
                <span className="text-12-medium lg:text-14-medium text-white px-2 text-center">
                  {currentWeek === 0
                    ? "This Week"
                    : currentWeek > 0
                      ? `${currentWeek}w ahead`
                      : `${Math.abs(currentWeek)}w ago`}
                </span>
                <button
                  onClick={() => handleWeekChange("next")}
                  className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="grid grid-cols-7 gap-1 lg:gap-2">
              {weekSchedule.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="bg-dark-400/50 rounded-xl p-2 lg:p-3"
                >
                  <div className="text-center mb-2 lg:mb-3">
                    <h4 className="text-10-semibold lg:text-12-semibold text-white">
                      {day.dayName}
                    </h4>
                    <p className="text-8-regular lg:text-10-regular text-dark-700">
                      {day.date}
                    </p>
                  </div>

                  <div className="space-y-1 max-h-32 lg:max-h-48 overflow-y-auto">
                    {day.slots.length > 0 ? (
                      day.slots.map((slot, slotIndex) => (
                        <button
                          key={slotIndex}
                          onClick={() => {
                            if (slot.available) {
                              setSelectedDate(day.fullDate);
                              setSelectedTime(slot.time);
                            }
                          }}
                          disabled={!slot.available}
                          className={`w-full p-1 rounded text-8-medium lg:text-10-medium transition-all duration-200 ${
                            selectedDate === day.fullDate &&
                            selectedTime === slot.time
                              ? "bg-blue-500 text-white border border-blue-400"
                              : slot.available
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))
                    ) : (
                      <p className="text-8-regular lg:text-10-regular text-red-400 text-center">
                        Not Available
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Reschedule Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const PatientDashboard = ({ onBookAppointment, patientData }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [futureAppt, setFutureAppt] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  useEffect(() => {
    if (!patientData?.userId) return;

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Appointments
      const { patientAppointments, allAppointments } =
        await getPatientAppointments(patientData.userId);

      setAllAppointments(allAppointments);

      // Current IST date/time
      const nowIST = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      // Keep only future appointments
      const futureAppts = patientAppointments
        .filter((appt) => new Date(appt.date) > nowIST)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setFutureAppt(futureAppts);

      // console.log(patientAppointments);
      setAppointments(patientAppointments);

      // Prescriptions
      const prescriptions = await fetchPrescriptions(patientData.userId);

      setPrescriptions(prescriptions.filter((p) => p.status === "active"));

      // Lab Results
      // const results = await db
      //   .select()
      //   .from(LabTests)
      //   .where(eq(LabTests.patientId, patientData.userId));
      // setLabs(results);

      // console.log("Dashboard data:", { patientAppointments, prescriptions });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async (patientId) => {
    const res = await fetch(
      `/api/patient-dashboard/prescriptions?patientId=${patientId}`
    );
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    return await res.json();
  };

  const refreshData = () => {
    fetchData();
  };

  const handleRescheduleAppointment = async (newDate, newTime) => {
    if (!selectedAppointment) return;

    try {
      const loading = toast.loading("Rescheduling appointment...");

      const res = await fetch("/api/patient/appointments/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          newDate,
          newTime,
        }),
      });

      toast.dismiss(loading);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to reschedule appointment");
        return;
      }

      refreshData();

      toast.success("Appointment rescheduled successfully");
    } catch (err) {
      toast.dismiss();
      console.error("Request failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCancelAppointment = async (reason) => {
    if (!selectedAppointment) return;

    try {
      const loading = toast.loading("Cancelling appointment...");

      const res = await fetch("/api/patient/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment.id,
          reason,
        }),
      });

      toast.dismiss(loading);

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to cancel appointment");
        return;
      }

      refreshData();

      toast.success("Appointment cancelled successfully");
    } catch (err) {
      toast.dismiss();
      console.error("Request failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const isFutureAppointment = (appointmentDate) => {
    if (!appointmentDate) return false;

    // Convert stored date string to Date object
    const apptDate = new Date(appointmentDate);

    // Get current IST date/time
    const nowIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    return apptDate > nowIST;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-300 transition-colors">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>

          {/* Text */}
          <p className="text-gray-800 dark:text-white text-lg">
            Loading your data...
          </p>
        </div>
      </div>
    );
  }

  const labResults = [
    {
      id: "1",
      testName: "Complete Blood Count",
      date: "2024-01-12",
      status: "completed",
      result: "Normal",
      normalRange: "Within normal limits",
      doctor: "Dr. Sarah Safari",
    },
    {
      id: "2",
      testName: "Lipid Profile",
      date: "2024-01-15",
      status: "pending",
      doctor: "Dr. Sarah Safari",
    },
    {
      id: "3",
      testName: "Thyroid Function",
      date: "2024-01-14",
      status: "in-progress",
      doctor: "Dr. Sarah Safari",
    },
  ];

  const getStatusBadge = (status, type) => {
    const baseClasses =
      "flex items-center gap-2 px-3 py-1 rounded-full text-12-medium transition-colors";

    if (type === "appointment") {
      switch (status) {
        case "upcoming":
          return (
            <div
              className={`${baseClasses} 
              bg-blue-100 border border-blue-200 text-blue-700
              dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400`}
            >
              <Calendar className="w-3 h-3" />
              <span>Upcoming</span>
            </div>
          );
        case "completed":
          return (
            <div
              className={`${baseClasses} 
              bg-green-100 border border-green-200 text-green-700
              dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400`}
            >
              <Clock className="w-3 h-3" />
              <span>Completed</span>
            </div>
          );
        case "cancelled":
          return (
            <div
              className={`${baseClasses} 
              bg-red-100 border border-red-200 text-red-700
              dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400`}
            >
              <Clock className="w-3 h-3" />
              <span>Cancelled</span>
            </div>
          );
      }
    }

    if (type === "prescription") {
      switch (status) {
        case "active":
          return (
            <div
              className={`${baseClasses} 
              bg-green-100 border border-green-200 text-green-700
              dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          );
        case "completed":
          return (
            <div
              className={`${baseClasses} 
              bg-gray-100 border border-gray-200 text-gray-700
              dark:bg-gray-500/20 dark:border-gray-500/30 dark:text-gray-400`}
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Completed</span>
            </div>
          );
      }
    }

    if (type === "lab") {
      switch (status) {
        case "completed":
          return (
            <div
              className={`${baseClasses} 
              bg-green-100 border border-green-200 text-green-700
              dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400`}
            >
              <TestTube className="w-3 h-3" />
              <span>Completed</span>
            </div>
          );
        case "pending":
          return (
            <div
              className={`${baseClasses} 
              bg-yellow-100 border border-yellow-200 text-yellow-700
              dark:bg-yellow-500/20 dark:border-yellow-500/30 dark:text-yellow-400`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending</span>
            </div>
          );
        case "in-progress":
          return (
            <div
              className={`${baseClasses} 
              bg-blue-100 border border-blue-200 text-blue-700
              dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-400`}
            >
              <Activity className="w-3 h-3" />
              <span>In Progress</span>
            </div>
          );
      }
    }

    return null;
  };

  const upcomingAppt = appointments.filter(
    (appt) => appt.status === "upcoming"
  ).length;

  const activeMeds = prescriptions.filter((p) => p.status === "active").length;

  const labResultsCount = labs.filter(
    (result) => result.status === "completed"
  ).length;

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 via-white to-white dark:from-dark-300 dark:via-dark-200 dark:to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-24-bold lg:text-36-bold text-gray-900 dark:text-white">
                  Welcome back, {patientData.name}
                </h1>
                <p className="text-14-regular lg:text-16-regular text-gray-600 dark:text-dark-700">
                  Here's your health overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button className="relative p-2 rounded-xl bg-gray-100 border border-gray-200 hover:bg-gray-200 dark:bg-dark-400/50 dark:border-dark-500/50 dark:hover:bg-dark-400/70 backdrop-blur-sm transition-all duration-300 hidden sm:block">
                <Bell className="w-5 h-5 text-gray-700 dark:text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              <button
                onClick={onBookAppointment}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                <span className="hidden sm:inline">Book Appointment</span>
                <span className="sm:hidden">Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Upcoming Appointments */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/5 backdrop-blur-sm border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 lg:p-6 shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-specialBlue-500 dark:to-specialBlue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-gray-900 dark:text-white">
                  {upcomingAppt}
                </div>
                <div className="text-12-regular lg:text-14-regular text-blue-600 dark:text-blue-400">
                  Upcoming
                </div>
              </div>
            </div>
          </div>

          {/* Active Meds */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/5 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20 rounded-2xl p-4 lg:p-6 shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-300 to-purple-400 dark:from-purple-500 dark:to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-7 lg:h-7 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-gray-900 dark:text-white">
                  {activeMeds}
                </div>
                <div className="text-12-regular lg:text-14-regular text-purple-600 dark:text-purple-400">
                  Active Meds
                </div>
              </div>
            </div>
          </div>

          {/* Lab Results */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/5 backdrop-blur-sm border border-green-200 dark:border-green-500/20 rounded-2xl p-4 lg:p-6 shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 dark:from-specialGreen-500 dark:to-specialGreen-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TestTube className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-gray-900 dark:text-white">
                  {labResultsCount}
                </div>
                <div className="text-12-regular lg:text-14-regular text-green-700 dark:text-green-400">
                  Lab Results
                </div>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-500/10 dark:to-red-600/5 backdrop-blur-sm border border-red-200 dark:border-red-500/20 rounded-2xl p-4 lg:p-6 shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 dark:from-specialRed-500 dark:to-specialRed-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-gray-900 dark:text-white">
                  98
                </div>
                <div className="text-12-regular lg:text-14-regular text-red-600 dark:text-red-400">
                  Health Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className="flex flex-col md:flex-row items-center justify-between 
  bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-400/30 dark:to-dark-300/30 
  backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 
  rounded-3xl p-4 lg:p-6 mb-8 transition-colors gap-4"
        >
          {/* Tabs */}
          <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-2 gap-2 md:flex md:gap-2">
            {[
              { id: "overview", label: "Overview", icon: Heart },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "prescriptions", label: "Prescriptions", icon: Pill },
              { id: "lab-results", label: "Lab Results", icon: TestTube },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
          text-12-medium lg:text-14-medium transition-all duration-300 whitespace-nowrap shadow-sm
          ${
            isActive
              ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md dark:from-specialBlue-500 dark:to-specialBlue-600"
              : "bg-light-200 text-dark-600 hover:bg-blue-500/10 hover:text-blue-500 dark:bg-dark-500/30 dark:text-dark-700 dark:hover:bg-dark-400/60 dark:hover:text-white"
          }`}
                >
                  <tab.icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Button
              className="btn3 w-full md:w-auto text-white shadow-md"
              onClick={() => refreshData()}
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Next Appointment */}
              <div className="overflow-auto max-h-[420px] bg-gradient-to-r from-blue-50 to-blue-100 dark:from-specialBlue-500/10 dark:to-specialBlue-600/5 backdrop-blur-xl border border-blue-200 dark:border-specialBlue-500/20 rounded-3xl p-6 lg:p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-specialBlue-500 dark:to-specialBlue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-gray-900 dark:text-white">
                    Upcoming Appointment
                  </h2>
                </div>

                {futureAppt.length > 0 ? (
                  <div className="space-y-4">
                    {futureAppt.map((appt, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-dark-400/50 rounded-2xl p-4 shadow-sm dark:shadow-none border border-gray-200 dark:border-dark-500"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <img
                            src={appt.doctor.avatar || ""}
                            alt={appt.doctor.name}
                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl object-cover"
                          />
                          <div>
                            <h3 className="text-16-bold lg:text-18-bold text-gray-900 dark:text-white">
                              {appt.doctor.name}
                            </h3>
                            <p className="text-14-regular text-blue-700 dark:text-blue-400">
                              {appt.doctor.speciality}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-14-regular text-gray-700 dark:text-dark-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span>{appt.time}</span>
                          </div>
                        </div>

                        <div className="text-12-regular text-gray-600 dark:text-dark-600">
                          <span className="font-medium">Type:</span>{" "}
                          <span className="text-gray-900 dark:text-white">
                            {appt.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-16-regular text-gray-700 dark:text-dark-700">
                      No upcoming appointments
                    </p>
                    <button
                      onClick={onBookAppointment}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 dark:bg-specialBlue-500 dark:hover:bg-specialBlue-600 text-white px-4 lg:px-6 py-2 rounded-lg text-12-medium lg:text-14-medium transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>

              {/* Health Summary */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/5 backdrop-blur-xl border border-green-200 dark:border-green-500/20 rounded-3xl p-6 lg:p-8 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 dark:from-specialGreen-500 dark:to-specialGreen-600 rounded-xl flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-gray-900 dark:text-white">
                    Health Summary
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* BP */}
                  <div className="bg-green-100 dark:bg-dark-400/50 rounded-2xl p-4 shadow-sm border border-green-200 dark:border-dark-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-14-medium text-gray-900 dark:text-white">
                        Blood Pressure
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-green-700 dark:text-green-400">
                        120/80
                      </span>
                    </div>
                    <div className="text-12-regular text-gray-600 dark:text-dark-600">
                      Normal range
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div className="bg-blue-100 dark:bg-dark-400/50 rounded-2xl p-4 shadow-sm border border-blue-200 dark:border-dark-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-14-medium text-gray-900 dark:text-white">
                        Heart Rate
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-blue-700 dark:text-blue-400">
                        72 bpm
                      </span>
                    </div>
                    <div className="text-12-regular text-gray-600 dark:text-dark-600">
                      Resting rate
                    </div>
                  </div>

                  {/* BMI */}
                  <div className="bg-yellow-100 dark:bg-dark-400/50 rounded-2xl p-4 shadow-sm border border-yellow-200 dark:border-dark-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-14-medium text-gray-900 dark:text-white">
                        BMI
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-yellow-700 dark:text-yellow-400">
                        24.5
                      </span>
                    </div>
                    <div className="text-12-regular text-gray-600 dark:text-dark-600">
                      Normal weight
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-400/30 dark:to-dark-300/30 
  backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 
  rounded-3xl p-6 lg:p-8 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-specialBlue-500 dark:to-specialBlue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-gray-900 dark:text-white">
                    Your Appointments
                  </h2>
                </div>
                <button
                  onClick={onBookAppointment}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-specialGreen-500 dark:to-specialGreen-600 dark:hover:from-green-600 dark:hover:to-green-700
      text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-14-semibold lg:text-16-semibold 
      transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Book New</span>
                  <span className="sm:hidden">Book</span>
                </button>
              </div>

              {/* Appointment List */}
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-300/50 dark:to-dark-400/30 
        backdrop-blur-sm border border-gray-200 dark:border-dark-500/50 
        rounded-2xl p-4 lg:p-6 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Doctor Info */}
                      <div className="flex items-center gap-4 lg:gap-6">
                        <img
                          src={appointment.doctor.avatar}
                          alt={appointment.doctor.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="text-16-bold lg:text-20-bold text-gray-900 dark:text-white mb-1">
                            {appointment.doctor.name}
                          </h3>
                          <p className="text-14-regular text-blue-600 dark:text-blue-400 mb-2">
                            {appointment.doctor.speciality}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-14-regular text-gray-700 dark:text-dark-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-12-regular text-gray-600 dark:text-dark-600">
                              Type:{" "}
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {appointment.type}
                            </span>
                          </div>

                          {/* Status */}
                          <div
                            className={`mt-2 rounded-lg px-3 py-2 inline-block ${
                              appointment.status === "cancelled"
                                ? "bg-red-100 border border-red-300 text-red-600 dark:bg-red-500/20 dark:border-red-500/40 dark:text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                : "bg-gray-100 text-gray-600 dark:bg-dark-500/30 dark:text-dark-600"
                            }`}
                          >
                            <p className="text-10-regular lg:text-12-regular">
                              <span
                                className={
                                  appointment.status === "cancelled"
                                    ? "text-red-600 dark:text-red-300"
                                    : "text-gray-900 dark:text-white"
                                }
                              >
                                {appointment.status === "cancelled" &&
                                  "Cancellation"}{" "}
                                Reason:
                              </span>{" "}
                              {appointment.reason}
                            </p>
                          </div>

                          {/* Notes */}
                          {appointment.notes &&
                            appointment.status !== "cancelled" && (
                              <div className="bg-blue-100 dark:bg-blue-500/20 rounded-lg px-3 py-2 inline-block ml-2">
                                <p className="text-10-regular lg:text-12-regular text-blue-600 dark:text-blue-400">
                                  <span className="text-gray-900 dark:text-white">
                                    Notes:
                                  </span>{" "}
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
                        {getStatusBadge(appointment.status, "appointment")}
                        {appointment.status === "upcoming" && (
                          <div className="flex gap-2 flex-wrap">
                            <button
                              className="text-12-medium lg:text-14-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 lg:px-4 py-2 border border-blue-300 dark:border-blue-500/30 rounded-lg bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors"
                              onClick={() => {
                                setShowRescheduleModal(true);
                                setSelectedAppointment(appointment);
                              }}
                            >
                              Reschedule
                            </button>
                            <button
                              className="text-12-medium lg:text-14-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 lg:px-4 py-2 border border-red-300 dark:border-red-500/30 rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                              onClick={() => {
                                setShowCancelModal(true);
                                setSelectedAppointment(appointment);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-400/30 dark:to-dark-300/30 
  backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 
  rounded-3xl p-6 lg:p-8 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-500 dark:to-purple-600">
                  <Pill className="w-5 h-5 text-purple-700 dark:text-white" />
                </div>

                <h2 className="text-20-bold lg:text-24-bold text-gray-900 dark:text-white">
                  Active Prescriptions
                </h2>
              </div>

              {/* Prescription Cards */}
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-300/50 dark:to-dark-400/30 
        backdrop-blur-sm border border-gray-200 dark:border-dark-500/50 
        rounded-2xl p-4 lg:p-6 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Side */}
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-600 rounded-2xl flex items-center justify-center">
                          <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-16-bold lg:text-20-bold text-gray-900 dark:text-white mb-1">
                            {prescription.medication}
                          </h3>
                          <p className="text-14-regular text-purple-700 dark:text-purple-400 mb-2">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-14-regular text-gray-700 dark:text-dark-700">
                            <div>
                              <span className="text-gray-900 dark:text-white">
                                Prescribed by:
                              </span>{" "}
                              {prescription.doctorName}
                            </div>
                            <div>
                              <span className="text-gray-900 dark:text-white">
                                Date:
                              </span>{" "}
                              {prescription.appointmentDate}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-12-regular text-gray-600 dark:text-dark-600">
                              Refills remaining:{" "}
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {prescription.refills}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
                        {getStatusBadge(prescription.status, "prescription")}
                        {prescription.refills > 0 && (
                          <button
                            className="text-12-medium lg:text-14-medium 
                text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 
                px-3 lg:px-4 py-2 border border-green-300 dark:border-green-500/30 
                rounded-lg bg-green-100 hover:bg-green-200 
                dark:bg-green-500/10 dark:hover:bg-green-500/20 
                transition-colors"
                          >
                            Request Refill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "lab-results" && (
            <div
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-400/30 dark:to-dark-300/30 
  backdrop-blur-xl border border-gray-200 dark:border-dark-500/50 
  rounded-3xl p-6 lg:p-8 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 dark:from-specialGreen-500 dark:to-specialGreen-600 rounded-xl flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-20-bold lg:text-24-bold text-gray-900 dark:text-white">
                  Lab Results
                </h2>
              </div>

              {/* Lab Results Cards */}
              <div className="space-y-4">
                {labResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-300/50 dark:to-dark-400/30 
        backdrop-blur-sm border border-gray-200 dark:border-dark-500/50 
        rounded-2xl p-4 lg:p-6 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 dark:from-specialGreen-500 dark:to-specialBlue-600 rounded-2xl flex items-center justify-center">
                          <TestTube className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-16-bold lg:text-20-bold text-gray-900 dark:text-white mb-1">
                            {result.testName}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-14-regular text-gray-700 dark:text-dark-700 mb-2">
                            <div>
                              <span className="text-gray-900 dark:text-white">
                                Date:
                              </span>{" "}
                              {result.date}
                            </div>
                            <div>
                              <span className="text-gray-900 dark:text-white">
                                Ordered by:
                              </span>{" "}
                              {result.doctor}
                            </div>
                          </div>
                          {result.result && (
                            <div className="bg-green-100 dark:bg-green-500/20 rounded-lg px-3 py-2 inline-block">
                              <span className="text-12-regular text-green-700 dark:text-green-400">
                                Result: {result.result} ({result.normalRange})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
                        {getStatusBadge(result.status, "lab")}
                        {result.status === "completed" && (
                          <div className="flex gap-2">
                            {/* View Button */}
                            <button
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 
                  dark:bg-gradient-to-r dark:from-blue-500 dark:to-blue-600 
                  dark:hover:from-blue-600 dark:hover:to-blue-700 
                  dark:text-white p-2 rounded-lg transition-all duration-300 
                  shadow-sm dark:shadow-lg dark:hover:shadow-blue-500/25"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Download Button */}
                            <button
                              className="bg-green-100 hover:bg-green-200 text-green-700 
                  dark:bg-gradient-to-r dark:from-green-500 dark:to-green-600 
                  dark:hover:from-green-600 dark:hover:to-green-700 
                  dark:text-white p-2 rounded-lg transition-all duration-300 
                  shadow-sm dark:shadow-lg dark:hover:shadow-green-500/25"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancel={handleCancelAppointment}
        appointment={selectedAppointment}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onReschedule={handleRescheduleAppointment}
        appointment={selectedAppointment}
        existingAppointments={appointments}
        allAppointments={allAppointments}
      />
    </div>
  );
};

export default PatientDashboard;
