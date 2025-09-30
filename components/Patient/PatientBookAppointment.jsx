import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  User,
  Search,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  MapPin,
  Phone,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { db } from "@/lib/dbConfig";
import { Appointments, Doctors } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { toast } from "sonner";

const CancelModal = ({ isOpen, onClose, onCancel, appointment }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCancel(reason);
    onClose();
    setReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-md">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-20-bold lg:text-24-bold text-white">
              Cancel Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-14-regular lg:text-16-regular text-dark-700 mb-8">
            Are you sure you want to cancel your appointment with{" "}
            {appointment?.doctor.name}?
          </p>

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

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                Keep Appointment
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-700 hover:bg-red-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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

const appointmentTypes = [
  "Consultation",
  "Follow-up",
  "Check-up",
  "Emergency",
  "Therapy Session",
  "Surgery",
];

const PatientBookAppointment = ({ onBack, patientData }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("book");
  const [step, setStep] = useState("select-doctor");
  const [appointmentType, setAppointmentType] = useState("Consultation");
  const [showAppointmentTypeDropdown, setShowAppointmentTypeDropdown] =
    useState(false);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [appointmentReason, setAppointmentReason] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await db.select().from(Doctors);
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await db
        .select()
        .from(Appointments)
        .where(eq(Appointments.patientId, patientData.userId))
        .orderBy(desc(Appointments.date));

      const all = await db.select().from(Appointments);
      setExistingAppointments(data);

      console.log(data);
      setAllAppointments(all);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const refreshAppointment = async () => {
    await fetchAppointments();
  };

  // Generate week schedule for selected doctor
  const generateWeekSchedule = (doctor, weekOffset = 0) => {
    const today = new Date();

    // Consistent IST date string for today
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

      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });

      // Use IST yyyy-mm-dd instead of UTC ISO string
      const fullDate = date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      let slots = [];

      if (doctor.availableDays?.includes(dayName) && doctor.availableHours) {
        const startStr = doctor.availableHours.start;
        const endStr = doctor.availableHours.end;
        if (!startStr || !endStr) return schedule;

        const [startHour, startMinute] = startStr.split(":").map(Number);
        const [endHour, endMinute] = endStr.split(":").map(Number);

        const startTime = new Date(date);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(endHour, endMinute, 0, 0);

        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
          const timeStr = currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          });

          // strict match for booked appointment
          const isBooked = allAppointments.some(
            (apt) =>
              apt.doctorId === doctor.userId &&
              apt.date === fullDate &&
              apt.time.toLowerCase() === timeStr.toLowerCase() &&
              apt.status === "upcoming"
          );

          console.log(
            isBooked && `Booked on ${fullDate} at ${timeStr} for ${doctor.name}`
          );

          // Consistent IST-based time check
          const timePassed =
            fullDate < todayStr || // past date
            (fullDate === todayStr && currentTime < today);

          slots.push({
            time: timeStr,
            available: !isBooked && !timePassed,
          });

          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
      }

      schedule.push({ date: dateStr, dayName, fullDate, slots });
    }

    console.log(schedule);

    return schedule;
  };

  const [weekSchedule, setWeekSchedule] = useState([]);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === "all" || doctor.speciality === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = [
    "all",
    ...Array.from(new Set(doctors.map((d) => d.speciality))),
  ];

  const patientAlreadyAppointed = (date, doctorId) => {
    // Check if the patient has any appointment on the given date
    return existingAppointments.some(
      (apt) =>
        apt.date === date &&
        apt.status === "upcoming" &&
        apt.doctorId === doctorId
    );
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setWeekSchedule(generateWeekSchedule(doctor, 0));
    setStep("select-time");
  };

  const handleTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep("confirm");
  };

  const handleWeekChange = (direction, doctor) => {
    const newWeek = direction === "next" ? currentWeek + 1 : currentWeek - 1;
    setCurrentWeek(newWeek);
    setWeekSchedule(generateWeekSchedule(doctor, newWeek));
  };

  const handleConfirmBooking = async () => {
    const loading = toast.loading("Booking appointment...");

    const appointmentData = {
      patientId: patientData.userId,

      doctorId: selectedDoctor.userId,

      patient: patientData,
      doctor: selectedDoctor,

      date: selectedDate,
      time: selectedTime,
      reason: appointmentReason,
      notes: additionalNotes,

      status: "upcoming",

      type: appointmentType,
    };

    const bookAppointment = await db
      .insert(Appointments)
      .values(appointmentData);

    refreshAppointment();

    console.log("Booking appointment:", appointmentData);

    toast.dismiss(loading);
    toast.success(
      `Appointment with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime} booked successfully`
    );

    setMessage("Appointment booked successfully!");
    setMessageType("success");

    // Reset form
    setStep("select-doctor");
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setAppointmentReason("");
    setAdditionalNotes("");
    setActiveTab("manage");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
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

      refreshAppointment();

      toast.success("Appointment cancelled successfully");

      setMessage(
        `Appointment with ${selectedAppointment.doctorName || "Doctor"} cancelled successfully`
      );
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      toast.dismiss();
      console.error("Request failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
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

      refreshAppointment?.();

      toast.success("Appointment rescheduled successfully");

      setMessage(
        `Appointment with ${selectedAppointment.doctorName || "Doctor"} rescheduled successfully`
      );
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      toast.dismiss();
      console.error("Request failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };


  const handleMarkAsWaiting = async (appointment) => {
    try {
      const loading = toast.loading("Marking as waiting...");

      // Fetches IST time in hh:mm AM/PM
      const istTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      await db
        .update(Appointments)
        .set({
          workflow: "waiting",
          arrivalTime: istTime,
          updatedAt: new Date(),
        })
        .where(eq(Appointments.id, appointment.id));

      refreshAppointment(); // reload appointment list

      toast.dismiss(loading);
      setMessage(
        `Appointment with ${appointment.doctor.name} marked as waiting in the lobby`
      );
      setMessageType("success");

      toast.success("Appointment marked as waiting");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error("Error marking waiting:", error);
      setMessage("Failed to mark patient as waiting");
      setMessageType("error");
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  // Utility: check if appointment is today in IST
  const isTodayIST = (date) => {
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    return date === todayIST;
  };

  const getStatusBadge = (status, workflow, date) => {
    // Convert today's date to IST yyyy-mm-dd
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // Scheduled for today
    if (workflow === "scheduled" && date === todayIST) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-10-medium lg:text-12-medium text-cyan-400">
            Today
          </span>
        </div>
      );
    }

    // Workflow states
    switch (workflow) {
      case "waiting":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3 text-yellow-400" />
            <span className="text-10-medium lg:text-12-medium text-yellow-400">
              Waiting in Lobby
            </span>
          </div>
        );

      case "arrived":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <CheckCircle className="w-3 h-3 text-blue-400" />
            <span className="text-10-medium lg:text-12-medium text-blue-400">
              Arrived
            </span>
          </div>
        );

      case "checked-in":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium lg:text-12-medium text-green-400">
              Checked In
            </span>
          </div>
        );

      case "in-consultation":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium lg:text-12-medium text-purple-400">
              In Consultation
            </span>
          </div>
        );

      case "no-show":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <X className="w-3 h-3 text-red-400" />
            <span className="text-10-medium lg:text-12-medium text-red-400">
              No Show
            </span>
          </div>
        );
    }

    // Appointment status (fallback)
    switch (status) {
      case "upcoming":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium lg:text-12-medium text-blue-400">
              Upcoming
            </span>
          </div>
        );

      case "completed":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-10-medium lg:text-12-medium text-green-400">
              Completed
            </span>
          </div>
        );

      case "cancelled":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <X className="w-3 h-3 text-red-400" />
            <span className="text-10-medium lg:text-12-medium text-red-400">
              Cancelled
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-500"
        }`}
      >
        ★
      </span>
    ));
  };

  // If still loading → show loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-20-bold lg:text-36-bold text-white">
                Appointments
              </h1>
              <p className="text-12-regular lg:text-16-regular text-dark-700">
                Book and manage your healthcare visits
              </p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-3 lg:p-4 rounded-xl border backdrop-blur-sm mb-6 ${
                messageType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">
                {message}
              </span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("book")}
                className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 ${
                  activeTab === "book"
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                    : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Book New</span>
                <span className="sm:hidden">Book</span>
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 ${
                  activeTab === "manage"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Manage Appointments</span>
                <span className="sm:hidden">Manage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Book New Appointment Tab */}
        {activeTab === "book" && (
          <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center gap-2 lg:gap-4 mb-8 overflow-x-auto">
              <div
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl ${
                  step === "select-doctor"
                    ? "bg-green-500 text-white"
                    : "bg-dark-400/50 text-dark-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-10-medium lg:text-14-medium whitespace-nowrap">
                  <span className="hidden sm:inline">Select Doctor</span>
                  <span className="sm:hidden">Doctor</span>
                </span>
              </div>
              <div className="w-4 lg:w-8 h-0.5 bg-dark-500 flex-shrink-0"></div>
              <div
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl ${
                  step === "select-time"
                    ? "bg-green-500 text-white"
                    : "bg-dark-400/50 text-dark-700"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-10-medium lg:text-14-medium whitespace-nowrap">
                  <span className="hidden sm:inline">Select Time</span>
                  <span className="sm:hidden">Time</span>
                </span>
              </div>
              <div className="w-4 lg:w-8 h-0.5 bg-dark-500 flex-shrink-0"></div>
              <div
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl ${
                  step === "confirm"
                    ? "bg-green-500 text-white"
                    : "bg-dark-400/50 text-dark-700"
                }`}
              >
                <Check className="w-4 h-4" />
                <span className="text-10-medium lg:text-14-medium whitespace-nowrap">
                  Confirm
                </span>
              </div>
            </div>

            {/* Step 1: Select Doctor */}
            {step === "select-doctor" && (
              <>
                {/* Filters */}
                <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-dark-600" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search doctors by name or speciality..."
                        className="shad-input pl-10 w-full text-white"
                      />
                    </div>
                    <select
                      value={specialtyFilter}
                      onChange={(e) => setSpecialtyFilter(e.target.value)}
                      className="shad-select-trigger text-white"
                    >
                      {specialties.map((speciality) => (
                        <option key={speciality} value={speciality}>
                          {speciality === "all"
                            ? "All Specialties"
                            : speciality}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Doctor List */}
                <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-20-bold lg:text-24-bold text-white">
                      Available Doctors
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.userId}
                        className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={doctor.avatar}
                              alt={doctor.name}
                              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover border-2 border-dark-500/50 group-hover:border-green-500/50 transition-all duration-300"
                            />
                            <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center border-2 border-dark-400">
                              <Stethoscope className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-16-bold lg:text-20-bold text-white group-hover:text-green-400 transition-colors">
                                {doctor.name}
                              </h3>
                              <p className="text-14-regular text-blue-400">
                                {doctor.speciality}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {renderStars(doctor.rating)}
                              <span className="text-14-medium text-white ml-2">
                                {doctor.rating}
                              </span>
                              <span className="text-12-regular text-dark-600">
                                ({doctor.yearsOfExperience} yearsOfExperience)
                              </span>
                            </div>

                            <div className="space-y-2 text-12-regular lg:text-14-regular text-dark-700">
                              <div className="items-center gap-2 hidden sm:flex">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span>{doctor.phone}</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="bg-green-500/20 rounded-lg px-3 py-2">
                                <span className="text-12-medium lg:text-14-medium text-green-400">
                                  <span className="hidden sm:inline">
                                    ₹{doctor.consultationFee} consultation
                                  </span>
                                  <span className="sm:hidden">
                                    ₹{doctor.consultationFee}
                                  </span>
                                </span>
                              </div>
                              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 opacity-0 group-hover:opacity-100">
                                <span className="hidden sm:inline">
                                  Select Doctor
                                </span>
                                <span className="sm:hidden">Select</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Select Time */}
            {step === "select-time" && selectedDoctor && (
              <>
                {/* Selected Doctor Info */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-16-bold lg:text-20-bold text-white">
                        {selectedDoctor.name}
                      </h3>
                      <p className="text-14-regular text-green-400">
                        {selectedDoctor.speciality}
                      </p>
                      <p className="text-12-regular lg:text-14-regular text-dark-700 hidden sm:block">
                        {selectedDoctor.location}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep("select-doctor")}
                      className="text-12-medium lg:text-14-medium text-green-400 hover:text-green-300 px-3 lg:px-4 py-2 border border-green-500/30 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                    >
                      <span className="hidden sm:inline">Change Doctor</span>
                      <span className="sm:hidden">Change</span>
                    </button>
                  </div>
                </div>

                {/* Calendar */}
                <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-20-bold lg:text-24-bold text-white">
                      Select Date & Time
                    </h2>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleWeekChange("prev", selectedDoctor)}
                        className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors disabled:opacity-50"
                        disabled={currentWeek === 0}
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <span className="text-14-medium lg:text-16-medium text-white px-2 lg:px-4 text-center">
                        {currentWeek === 0
                          ? "This Week"
                          : `${currentWeek} Week${
                              currentWeek > 1 ? "s" : ""
                            } Ahead`}
                      </span>
                      <button
                        onClick={() => handleWeekChange("next", selectedDoctor)}
                        className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 lg:gap-4">
                    {weekSchedule.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="bg-dark-400/50 rounded-xl lg:rounded-2xl p-2 lg:p-4"
                      >
                        <div className="text-center mb-4">
                          <h3 className="text-10-semibold lg:text-16-semibold text-white">
                            {day.dayName}
                          </h3>
                          <p className="text-8-regular lg:text-14-regular text-dark-700">
                            {day.date}
                          </p>
                        </div>

                        <div className="space-y-1 lg:space-y-2 max-h-48 lg:max-h-96 overflow-y-auto">
                          {day.slots.length > 0 ? (
                            day.slots.map((slot, slotIndex) => {
                              const patientHasAppointment =
                                patientAlreadyAppointed(
                                  day.fullDate,
                                  selectedDoctor.userId
                                );

                              return (
                                <button
                                  key={slotIndex}
                                  onClick={() =>
                                    !patientHasAppointment &&
                                    slot.available &&
                                    handleTimeSelect(day.fullDate, slot.time)
                                  }
                                  disabled={
                                    !slot.available || patientHasAppointment
                                  }
                                  className={`w-full p-2 rounded border transition-colors
                  ${
                    patientHasAppointment
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 cursor-not-allowed"
                      : slot.available
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30 cursor-not-allowed"
                  }`}
                                  title={
                                    patientHasAppointment
                                      ? `You already have an appointment on this date`
                                      : !slot.available
                                        ? "Slot unavailable"
                                        : "Select this slot"
                                  }
                                >
                                  {slot.time}
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-center text-red-400 text-sm">
                              Not Available
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Confirm Booking */}
            {step === "confirm" && selectedDoctor && (
              <>
                {/* Appointment Summary */}
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-20-bold lg:text-24-bold text-white">
                      Confirm Appointment
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Doctor Info */}
                    <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
                      <h3 className="text-16-bold lg:text-18-bold text-white mb-4">
                        Doctor Information
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={selectedDoctor.avatar}
                          alt={selectedDoctor.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                        />
                        <div>
                          <h4 className="text-14-semibold lg:text-16-semibold text-white">
                            {selectedDoctor.name}
                          </h4>
                          <p className="text-14-regular text-blue-400">
                            {selectedDoctor.speciality}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(selectedDoctor.rating)}
                            <span className="text-12-regular text-white ml-1">
                              {selectedDoctor.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-12-regular lg:text-14-regular text-dark-700">
                        <div className="items-center gap-2 hidden sm:flex">
                          <Phone className="w-4 h-4 text-blue-400" />
                          <span>{selectedDoctor.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
                      <h3 className="text-16-bold lg:text-18-bold text-white mb-4">
                        Appointment Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-14-semibold lg:text-16-semibold text-white">
                              {new Date(selectedDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-14-regular text-dark-700">
                              Date
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Clock className="w-5 h-5 text-purple-400" />
                          <div>
                            <div className="text-14-semibold lg:text-16-semibold text-white">
                              {selectedTime}
                            </div>
                            <div className="text-14-regular text-dark-700">
                              Time
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-500/20 rounded-lg px-4 py-3">
                          <div className="text-14-semibold lg:text-16-semibold text-green-400">
                            Consultation Fee: ₹{selectedDoctor.consultationFee}
                          </div>
                          <div className="text-12-regular text-green-300">
                            Payment due after service
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details Form */}
                <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8">
                  <h2 className="text-20-bold lg:text-24-bold text-white mb-6">
                    Appointment Information
                  </h2>

                  <div className="space-y-6">
                    <div className="mt-6">
                      <label className="shad-input-label block mb-2">
                        Appointment Type
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setShowAppointmentTypeDropdown(
                              !showAppointmentTypeDropdown
                            )
                          }
                          onBlur={
                            () =>
                              setTimeout(() => {
                                setShowAppointmentTypeDropdown(false);
                              }, 150) // delay in ms (100–200ms usually works well)
                          }
                          className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                        >
                          <span className="text-white">{appointmentType}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-dark-600 transition-transform ${
                              showAppointmentTypeDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {showAppointmentTypeDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden">
                            <div className="p-3 border-b border-dark-500">
                              <span className="text-14-medium text-dark-700">
                                Select Appointment Type
                              </span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {appointmentTypes.map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    setAppointmentType(type);
                                    setShowAppointmentTypeDropdown(false);
                                  }}
                                  className="w-full p-4 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                                >
                                  <span className="text-16-medium text-white">
                                    {type}
                                  </span>
                                  {appointmentType === type && (
                                    <Check className="w-5 h-5 text-green-500" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="shad-input-label block mb-2">
                        Reason for appointment *
                      </label>
                      <textarea
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        placeholder="Please describe the reason for your visit (e.g., annual check-up, follow-up, specific symptoms)"
                        className="shad-textArea w-full text-white min-h-[100px] resize-none"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="shad-input-label block mb-2">
                        Additional notes (optional)
                      </label>
                      <textarea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Any additional information you'd like the doctor to know (e.g., preferred appointment time, specific concerns)"
                        className="shad-textArea w-full text-white min-h-[80px] resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setStep("select-time")}
                    className="flex items-center gap-2 text-16-regular text-dark-600 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      Back to Time Selection
                    </span>
                    <span className="sm:hidden">Back</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleConfirmBooking();
                    }}
                    disabled={!appointmentReason.trim()}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 w-full sm:w-auto"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Manage Appointments Tab */}
        {activeTab === "manage" && (
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Your Appointments
              </h2>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {existingAppointments.map((appointment) => {
                const appointmentToday = isTodayIST(appointment.date);

                return (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="relative">
                          <img
                            src={
                              appointment?.doctor?.avatar ||
                              "/doctor-avatar.jpg"
                            }
                            alt={appointment.doctor.name}
                            className="w-12 h-12 lg:w-20 lg:h-20 rounded-2xl object-cover border-2 border-dark-500/50"
                          />
                          <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center border-2 border-dark-400">
                            <Stethoscope className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          </div>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div>
                            <h3 className="text-16-bold lg:text-20-bold text-white mb-1">
                              {appointment.doctor.name}
                            </h3>
                            <p className="text-12-regular lg:text-14-regular text-green-400">
                              {appointment.doctor.speciality}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>

                          <div
                            className={`rounded-lg px-3 py-2 inline-block ${
                              appointment.status === "cancelled"
                                ? "bg-red-500/20 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                : "bg-dark-500/30"
                            }`}
                          >
                            <p
                              className={`text-10-regular lg:text-12-regular ${
                                appointment.status === "cancelled"
                                  ? "text-red-400"
                                  : "text-dark-600"
                              }`}
                            >
                              <span
                                className={
                                  appointment.status === "cancelled"
                                    ? "text-red-300"
                                    : "text-white"
                                }
                              >
                                {appointment.status === "cancelled" &&
                                  "Cancellation"}{" "}
                                Reason:
                              </span>{" "}
                              {appointment.reason}
                            </p>
                          </div>

                          {appointment.notes &&
                            appointment.status !== "cancelled" && (
                              <div className="bg-blue-500/20 rounded-lg px-3 py-2 inline-block ml-2">
                                <p className="text-10-regular lg:text-12-regular text-blue-400">
                                  <span className="text-white">Notes:</span>{" "}
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-col items-start lg:items-end gap-3 lg:gap-4">
                        {getStatusBadge(
                          appointment.status,
                          appointment.workflow,
                          appointment.date
                        )}

                        {appointment.status === "upcoming" &&
                          !appointmentToday &&
                          appointment.workflow !== "waiting" && (
                            <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                              <button
                                onClick={() =>
                                  handleRescheduleClick(appointment)
                                }
                                className="flex-1 lg:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-10-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                              >
                                <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">
                                  Reschedule
                                </span>
                                <span className="sm:hidden">Edit</span>
                              </button>
                              <button
                                onClick={() => handleCancelClick(appointment)}
                                className="flex-1 lg:flex-none bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 lg:px-4 py-2 rounded-lg text-10-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
                              >
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">Cancel</span>
                                <span className="sm:hidden">Cancel</span>
                              </button>
                            </div>
                          )}

                        {appointmentToday &&
                          appointment.workflow !== "waiting" &&
                          appointment.status !== "cancelled" && (
                            <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                              {/* Reschedule Button */}
                              <button
                                onClick={() =>
                                  handleRescheduleClick(appointment)
                                }
                                className="flex-1 lg:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-10-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                              >
                                <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">
                                  Reschedule
                                </span>
                                <span className="sm:hidden">Edit</span>
                              </button>

                              {/* Mark as Waiting Button */}
                              <button
                                onClick={() => handleMarkAsWaiting(appointment)}
                                className="flex-1 lg:flex-none bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 lg:px-4 py-2 rounded-lg text-10-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2"
                              >
                                <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">
                                  Mark Waiting
                                </span>
                                <span className="sm:hidden">Wait</span>
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {existingAppointments.filter((apt) => apt.status === "upcoming")
              .length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-18-bold lg:text-24-bold text-white mb-4">
                  No upcoming appointments
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto mb-6 lg:mb-8">
                  You don't have any upcoming appointments. Book your next visit
                  with our healthcare providers.
                </p>
                <button
                  onClick={() => setActiveTab("book")}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  Book Your First Appointment
                </button>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 lg:mt-8 text-12-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
        >
          <span className="hidden sm:inline">← Back to Dashboard</span>
          <span className="sm:hidden">← Back</span>
        </button>
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
        existingAppointments={existingAppointments}
        allAppointments={allAppointments}
      />
    </div>
  );
};

export default PatientBookAppointment;
