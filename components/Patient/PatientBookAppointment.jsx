import React, { useEffect, useRef, useState } from "react";
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
  CheckCircle,
  X,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { db } from "@/lib/dbConfig";
import { Appointments, Doctors, Patients } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { toast } from "sonner";
import { getDoctor, getPatientAppointments } from "@/lib/patients/appointment";
import { Button } from "../ui/button";

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

  const contentRef = useRef(null);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // allows opening
        if (open) return;

        // Allow only if triggered from INSIDE dialog (X button or your buttons)
        const active = document.activeElement;

        // Close only if focus is inside dialog content
        if (contentRef.current?.contains(active)) {
          onClose();
        }
      }}
    >
      <DialogContent
        ref={contentRef}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="
    rounded-3xl 
    bg-white text-slate-900 border border-slate-200 
    dark:bg-slate-950 dark:text-white dark:border-dark-500
    p-6 lg:p-8
  "
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle className="text-24-bold lg:text-28-bold">
            Cancel Appointment
          </DialogTitle>
        </DialogHeader>

        {/* Alert Box for Warning */}
        <Alert
          variant="destructive"
          className="
      border-2 border-red-300 bg-red-50 text-red-700
      dark:border-red-600 dark:bg-red-900/20 dark:text-red-300
      rounded-2xl mb-6 p-4
    "
        >
          <AlertTriangle className="h-5 w-5 dark:text-red-400" />
          <AlertTitle className="text-[16px] lg:text-[18px] font-semibold">
            Are you sure?
          </AlertTitle>
          <AlertDescription className="text-[14px] lg:text-[16px] mt-1">
            You are cancelling your appointment with{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {appointment?.doctorName}
            </span>
            . This action cannot be undone.
          </AlertDescription>
        </Alert>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason Input */}
          <div>
            <label
              className="
          block mb-2 
          text-[15px] lg:text-[16px] font-semibold
          text-slate-800 dark:text-slate-200
        "
            >
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

          {/* Buttons */}
          <DialogFooter className="flex gap-4">
            {/* Keep Appointment */}
            <button
              type="button"
              onClick={onClose}
              className="
          flex-1 rounded-3xl py-3 px-4 
          text-14-semibold lg:text-16-semibold 
          bg-gray-200 hover:bg-gray-300 text-slate-900 
          dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white
          transition-colors
        "
            >
              Keep Appointment
            </button>

            {/* Confirm Cancellation */}
            <button
              type="submit"
              disabled={!reason}
              className="
          flex-1 rounded-3xl py-3 px-4 
          text-14-semibold lg:text-16-semibold 
          bg-red-600 hover:bg-red-700 text-white
          disabled:opacity-50 disabled:hover:bg-red-600 disabled:cursor-not-allowed
          dark:bg-red-700 dark:hover:bg-red-600
          dark:disabled:hover:bg-red-700
          transition-colors
        "
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="
      w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl
      bg-white border border-slate-200 
      dark:bg-slate-950 dark:border-dark-500
    "
      >
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
              Reschedule Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 dark:text-dark-600 dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Current Appointment Info */}
          <div
            className="
          rounded-2xl p-4 lg:p-6 mb-8
          bg-blue-50 border border-blue-200 
          dark:bg-blue-500/10 dark:border-blue-500/30
        "
          >
            <h3 className="text-16-semibold lg:text-18-semibold text-slate-900 dark:text-white mb-4">
              Current Appointment
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={appointment?.doctor.avatar}
                alt={appointment?.doctor.name}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
              />

              <div className="flex-1">
                <h4 className="text-14-semibold lg:text-16-semibold text-slate-900 dark:text-white">
                  {appointment?.doctor.name}
                </h4>

                <p className="text-14-regular text-blue-600 dark:text-blue-400">
                  {appointment?.doctor.speciality}
                </p>

                <div
                  className="
                flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2
                text-12-regular lg:text-14-regular 
                text-slate-700 dark:text-dark-700
              "
                >
                  <span>{appointment?.date}</span>
                  <span>{appointment?.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Time Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-18-bold lg:text-20-bold text-slate-900 dark:text-white">
                Select New Date & Time
              </h3>

              <div className="flex items-center gap-2 lg:gap-4">
                <button
                  onClick={() => handleWeekChange("prev")}
                  className="
                p-2 rounded-xl border transition-colors
                bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-900
                dark:bg-dark-400 dark:hover:bg-dark-300 dark:border-dark-500 dark:text-white
              "
                >
                  <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>

                <span className="text-12-medium lg:text-14-medium text-slate-800 dark:text-white px-2 text-center">
                  {currentWeek === 0
                    ? "This Week"
                    : currentWeek > 0
                      ? `${currentWeek}w ahead`
                      : `${Math.abs(currentWeek)}w ago`}
                </span>

                <button
                  onClick={() => handleWeekChange("next")}
                  className="
                p-2 rounded-xl border transition-colors
                bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-900
                dark:bg-dark-400 dark:hover:bg-dark-300 dark:border-dark-500 dark:text-white
              "
                >
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-3">
              {weekSchedule.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="
                rounded-xl p-2 lg:p-3 transition-colors
                bg-gray-50 border border-gray-200 
                dark:bg-dark-400/50 dark:border-dark-500/50
              "
                >
                  {/* Header */}
                  <div className="text-center mb-2 lg:mb-3">
                    <h4 className="text-10-semibold lg:text-12-semibold text-gray-900 dark:text-white">
                      {day.dayName}
                    </h4>
                    <p className="text-8-regular lg:text-10-regular text-gray-600 dark:text-dark-700">
                      {day.date}
                    </p>
                  </div>

                  {/* Slots */}
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
                          className={`
                        w-full p-1 rounded border transition-all duration-200
                        text-[10px] sm:text-xs lg:text-sm
                        ${
                          selectedDate === day.fullDate &&
                          selectedTime === slot.time
                            ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                            : slot.available
                              ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/30"
                              : "bg-red-100 text-red-600 border-red-300 cursor-not-allowed dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
                        }
                      `}
                        >
                          {slot.time}
                        </button>
                      ))
                    ) : (
                      <p className="text-8-regular lg:text-10-regular text-red-600 dark:text-red-400 text-center">
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
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="
            flex-1 py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold 
            bg-gray-200 text-slate-900 hover:bg-gray-300
            dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500
            transition-colors
          "
            >
              Cancel
            </button>

            {/* Reschedule Button */}
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="
            flex-1 py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold 
            bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
            text-white
            disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
            transition-all duration-300 shadow-lg hover:shadow-blue-500/25
          "
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
  console.log(patientData);
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
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { patientAppointments, allAppointments } =
        await getPatientAppointments(patientData.userId);

      setExistingAppointments(patientAppointments);

      setAllAppointments(allAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const doctor = await getDoctor();
      console.log("Doctor Data: ", doctor);
      setDoctors(doctor);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAppointment = async () => {
    await fetchAppointments();
  };

  const refreshDoctorAppointments = async () => {
    const loading = toast.loading("Refreshing doctor data... Please wait...");

    await fetchDoctors();
    await fetchAppointments();
    toast.dismiss(loading);

    setStep("select-doctor");

    toast.success("Doctor data refreshed successfully");
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
    console.log("Already Present :", doctorId, date);
    console.log(
      existingAppointments.some(
        (apt) =>
          apt.date === date &&
          apt.status === "upcoming" &&
          apt.doctorId === doctorId
      )
    );
    console.log(existingAppointments[0]);
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

      refreshAppointment();

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

  const StepHeader = ({
    step = "select-doctor",
    refreshDoctorAppointments,
  }) => {
    const steps = [
      {
        key: "select-doctor",
        label: "Select Doctor",
        short: "Doctor",
        Icon: User,
      },
      {
        key: "select-time",
        label: "Select Time",
        short: "Time",
        Icon: Calendar,
      },
      {
        key: "confirm",
        label: "Confirm",
        short: "Confirm",
        Icon: Check,
      },
    ];

    const activeIndex = Math.max(
      0,
      steps.findIndex((s) => s.key === step)
    );

    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Progress Steps */}
        <div className="w-full md:w-auto flex items-center gap-2 lg:gap-4 mb-2 md:mb-0 overflow-x-auto no-scrollbar">
          {steps.map((s, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = idx < activeIndex;
            const isPending = idx > activeIndex;

            return (
              <div key={s.key} className="flex items-center flex-shrink-0">
                {/* Step pill with FULL border (no ring, no side-only) */}
                <div
                  className={[
                    "flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl transition-colors shadow-sm",
                    "border", // <-- full border always
                    isActive && "bg-emerald-500 text-white border-emerald-600",
                    isCompleted &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/30",
                    isPending &&
                      "bg-white/80 text-slate-600 border-slate-300 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700",
                  ].join(" ")}
                >
                  <s.Icon
                    className={[
                      "w-4 h-4",
                      isPending && "text-slate-500 dark:text-slate-400",
                      isCompleted && "text-emerald-600 dark:text-emerald-300",
                      isActive && "text-white",
                    ].join(" ")}
                  />
                  <span className="text-xs lg:text-sm font-medium whitespace-nowrap">
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.short}</span>
                  </span>
                </div>

                {/* Connector (no borders here, just a background bar) */}
                {idx < steps.length - 1 && (
                  <div
                    className={[
                      "mx-2 lg:mx-4 w-6 lg:w-10 h-0.5 flex-shrink-0 rounded",
                      isCompleted
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : "bg-slate-200 dark:bg-slate-700",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Refresh Button with FULL border */}
        <Button className="btn3" onClick={() => refreshDoctorAppointments?.()}>
          <RefreshCcw className="w-5 h-5" />
          Refresh Doctor Data
        </Button>
      </div>
    );
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

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 
          dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors"
      >
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>

          {/* Text */}
          <p className="text-gray-800 dark:text-white text-lg">
            Loading your Appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center shadow-lg
                    bg-gradient-to-r from-green-500 to-green-600"
            >
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              {/* Use neutral text tokens for light/dark */}
              <h1 className="text-[20px] lg:text-[36px] font-bold text-slate-900 dark:text-white">
                Appointments
              </h1>
              <p className="text-xs lg:text-base text-slate-600 dark:text-slate-400">
                Book and manage your healthcare visits
              </p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              role={messageType === "success" ? "status" : "alert"}
              aria-live="polite"
              className={[
                // layout
                "flex items-center gap-3 p-3 lg:p-4 rounded-xl mb-6 backdrop-blur-sm",
                // full border (no side-only)
                "border",
                // base light/dark surface
                "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700",
                // variant overlays
                messageType === "success"
                  ? "shadow-[inset_0_0_0_9999px_rgba(16,185,129,0.08)] border-emerald-300/40 dark:border-emerald-400/30"
                  : "shadow-[inset_0_0_0_9999px_rgba(239,68,68,0.08)] border-rose-300/40 dark:border-rose-400/30",
              ].join(" ")}
            >
              {messageType === "success" ? (
                <CheckCircle
                  className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 text-rose-600 dark:text-rose-400"
                  aria-hidden="true"
                />
              )}

              <span
                className={[
                  "text-sm lg:text-base",
                  "text-slate-800 dark:text-slate-100",
                  messageType === "success"
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-rose-700 dark:text-rose-300",
                ].join(" ")}
              >
                {message}
              </span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-4 lg:p-6 mb-8 shadow-sm">
            <div className="flex gap-2">
              {/* Book New */}
              <button
                onClick={() => setActiveTab("book")}
                aria-pressed={activeTab === "book"}
                className={[
                  // layout
                  "flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-xs lg:text-sm font-medium",
                  "transition-all duration-300",
                  // full border always (no side-only)
                  "border",
                  // states
                  activeTab === "book"
                    ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/25"
                    : "bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white",
                  // accessible focus without weird side lines
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2",
                ].join(" ")}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Book New</span>
                <span className="sm:hidden">Book</span>
              </button>

              {/* Manage Appointments */}
              <button
                onClick={() => setActiveTab("manage")}
                aria-pressed={activeTab === "manage"}
                className={[
                  // layout
                  "flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-xs lg:text-sm font-medium",
                  "transition-all duration-300",
                  // full border always
                  "border",
                  // states
                  activeTab === "manage"
                    ? "bg-sky-600 text-white border-sky-700 shadow-lg shadow-sky-500/25"
                    : "bg-white/80 text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white",
                  // focus style
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 focus-visible:outline-offset-2",
                ].join(" ")}
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
            <StepHeader
              step={step}
              refreshDoctorAppointments={refreshDoctorAppointments}
            />

            {/* Step 1: Select Doctor */}
            {step === "select-doctor" && (
              <>
                {/* Filters */}
                <div className="bg-white/80 dark:bg-slate-900/60 border-2 border-green-200 dark:border-green-700 rounded-3xl p-4 lg:p-6 shadow-sm ">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>

                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search doctors by name or speciality..."
                        className="w-full pl-10 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 transition-colors py-2.5"
                      />
                    </div>

                    {/* Specialty filter */}
                    <div className="relative w-full md:w-64">
                      <button
                        type="button"
                        onClick={() =>
                          setShowSpecialtyDropdown(!showSpecialtyDropdown)
                        }
                        onBlur={() =>
                          setTimeout(() => {
                            setShowSpecialtyDropdown(false);
                          }, 150)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl
               bg-white/70 dark:bg-slate-800/70
               border border-slate-300 dark:border-slate-700
               text-slate-900 dark:text-slate-100
               hover:border-green-500 focus:border-green-500
               focus:outline-none focus:ring-2 focus:ring-green-500/60
               transition-all"
                      >
                        <span className="text-sm capitalize">
                          {specialtyFilter === "all"
                            ? "All Specialties"
                            : specialtyFilter.replace("_", " ")}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform text-slate-600 dark:text-slate-300 ${
                            showSpecialtyDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showSpecialtyDropdown && (
                        <div
                          className="absolute left-0 right-0 mt-2 rounded-xl shadow-xl z-20 overflow-hidden
                 bg-white/95 dark:bg-slate-900/90
                 border border-slate-300 dark:border-slate-700
                 backdrop-blur-md"
                        >
                          <div className="max-h-60 overflow-y-auto py-1">
                            {specialties.map((speciality) => (
                              <button
                                key={speciality}
                                type="button"
                                onClick={() => {
                                  setSpecialtyFilter(speciality);
                                  setShowSpecialtyDropdown(false);
                                }}
                                className={`
              w-full px-4 py-3 flex items-center justify-between text-sm capitalize
              text-slate-900 dark:text-slate-100
              transition-colors
              hover:bg-blue-50 dark:hover:bg-slate-800/80
              ${
                specialtyFilter === speciality
                  ? "bg-blue-100/60 dark:bg-blue-900/30"
                  : ""
              }
            `}
                              >
                                {speciality === "all"
                                  ? "All Specialties"
                                  : speciality}

                                {specialtyFilter === speciality && (
                                  <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Doctor List */}
                <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-6 lg:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-1 ring-black/5 dark:ring-white/10">
                      <Stethoscope className="w-5 h-5" />
                    </div>

                    {/* If you already have utilities like text-20-bold / text-24-bold, keep them. 
       Otherwise, this fallback uses Tailwind sizes */}
                    <h2
                      className="text-[20px] lg:text-[24px] font-bold text-slate-900 dark:text-white
    "
                    >
                      Available Doctors
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.userId}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${doctor.name}, ${doctor.speciality}`}
                        onClick={() => handleDoctorSelect?.(doctor)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleDoctorSelect?.(doctor);
                        }}
                        className="
            group relative cursor-pointer transition-all duration-300
            rounded-2xl p-4 lg:p-6 backdrop-blur
            border
            bg-white/80 border-slate-200 hover:border-emerald-500/60
            shadow-sm hover:shadow-md
            dark:bg-slate-800/70 dark:border-slate-700 dark:hover:border-emerald-400/50
          "
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar + badge */}
                          <div className="relative shrink-0">
                            <img
                              src={doctor.avatar}
                              alt={doctor.name}
                              className="
                  w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover
                  border-2 transition-all duration-300
                  border-slate-200 group-hover:border-emerald-500/60
                  dark:border-slate-700 dark:group-hover:border-emerald-400/60
                "
                            />
                            <div
                              className="
                  absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2
                  w-6 h-6 lg:w-8 lg:h-8 rounded-full
                  flex items-center justify-center
                  border-2
                  bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
                  border-white dark:border-slate-800
                "
                              aria-hidden="true"
                            >
                              <Stethoscope className="w-3 h-3 lg:w-4 lg:h-4" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="truncate">
                              <h3
                                className="
                    text-lg lg:text-xl font-semibold truncate
                    text-slate-900 group-hover:text-emerald-600
                    dark:text-white dark:group-hover:text-emerald-400
                  "
                                title={doctor.name}
                              >
                                {doctor.name}
                              </h3>
                              <p
                                className="
                    text-sm lg:text-base truncate
                    text-sky-700 dark:text-sky-400
                  "
                                title={doctor.speciality}
                              >
                                {doctor.speciality}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {renderStars(doctor.rating)}
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {doctor.rating}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({doctor.yearsOfExperience} yrs)
                              </span>
                            </div>

                            {/* Contact (hidden on very small screens) */}
                            <div className="space-y-2 text-xs lg:text-sm text-slate-600 dark:text-slate-300">
                              {doctor.phone ? (
                                <div className="hidden sm:flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                  <span className="truncate">
                                    {doctor.phone}
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            {/* Fee + CTA */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div
                                className="
                    rounded-lg px-3 py-2
                    bg-emerald-50 text-emerald-700
                    dark:bg-emerald-500/15 dark:text-emerald-300
                  "
                              >
                                <span className="text-sm lg:text-base font-medium">
                                  <span className="hidden sm:inline">
                                    ₹{doctor.consultationFee} consultation
                                  </span>
                                  <span className="sm:hidden">
                                    ₹{doctor.consultationFee}
                                  </span>
                                </span>
                              </div>

                              <button
                                type="button"
                                className="
                    w-full sm:w-auto
                    bg-gradient-to-r from-emerald-500 to-emerald-600
                    hover:from-emerald-600 hover:to-emerald-700
                    text-white px-4 lg:px-6 py-2 rounded-xl
                    text-sm lg:text-base font-medium
                    transition-all duration-300 shadow-lg hover:shadow-emerald-500/25
                    sm:opacity-0 sm:group-hover:opacity-100
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-2
                    dark:focus:ring-offset-slate-900
                  "
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDoctorSelect?.(doctor);
                                }}
                              >
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
                <div
                  className="
    border border-green-400 rounded-3xl p-4 lg:p-6 shadow-sm bg-gradient-to-r from-green-100 to-white dark:bg-gradient-to-r dark:from-green-500/10 dark:to-green-600/5 dark:border-green-500/30 dark:shadow-none
  "
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h3
                        className="
          text-16-bold lg:text-20-bold text-slate-900 
          dark:text-white
        "
                      >
                        {selectedDoctor.name}
                      </h3>

                      <p
                        className="
          text-14-regular text-green-700 
          dark:text-green-400
        "
                      >
                        {selectedDoctor.speciality}
                      </p>

                      <p
                        className="
          text-12-regular lg:text-14-regular hidden sm:block 
          text-slate-600 
          dark:text-dark-700
        "
                      >
                        {selectedDoctor.location}
                      </p>
                    </div>

                    <button
                      onClick={() => setStep("select-doctor")}
                      className="
        text-green-700 border border-green-400/50 
        bg-green-100 hover:bg-green-200
        dark:text-green-300 dark:bg-green-500/10
        dark:border-green-500/40 dark:hover:bg-green-500/20

        transition-colors
        text-12-medium lg:text-14-medium rounded-lg
        px-3 lg:px-4 py-2
      "
                    >
                      <span className="hidden sm:inline">Change Doctor</span>
                      <span className="sm:hidden">Change</span>
                    </button>
                  </div>
                </div>

                {/* Calendar */}
                <div
                  className="
    bg-gradient-to-r from-white to-slate-50
    border border-slate-200
    rounded-3xl p-6 lg:p-8 shadow-sm
    dark:bg-gradient-to-r dark:from-dark-400/30 dark:to-dark-300/30
    dark:border-dark-500/50 dark:shadow-none
  "
                >
                  <div className="flex items-center justify-end gap-4 mb-6">
                    {/* Prev Button */}
                    <button
                      onClick={() => handleWeekChange("prev", selectedDoctor)}
                      disabled={currentWeek === 0}
                      className="
          p-2 rounded-xl border transition-colors disabled:opacity-0
          bg-slate-100 hover:bg-slate-200 border-slate-300
          dark:bg-dark-400 dark:hover:bg-dark-300 dark:border-dark-500
        "
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-900 dark:text-white" />
                    </button>

                    <span
                      className="
          text-14-medium lg:text-16-medium text-slate-800 
          dark:text-white
        "
                    >
                      {currentWeek === 0
                        ? "This Week"
                        : `${currentWeek} Week${currentWeek > 1 ? "s" : ""} Ahead`}
                    </span>

                    {/* Next Button */}
                    <button
                      onClick={() => handleWeekChange("next", selectedDoctor)}
                      className="
          p-2 rounded-xl border transition-colors
          bg-slate-100 hover:bg-slate-200 border-slate-300
          dark:bg-dark-400 dark:hover:bg-dark-300 dark:border-dark-500
        "
                    >
                      <ChevronRight className="w-5 h-5 text-slate-900 dark:text-white" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-4">
                    {weekSchedule.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="bg-gray-50 dark:bg-dark-400/50 border border-gray-200 dark:border-dark-500/50 
                 rounded-xl lg:rounded-2xl p-2 lg:p-4 transition-colors"
                      >
                        {/* Header */}
                        <div className="text-center mb-4">
                          <h3 className="text-12-semibold lg:text-16-semibold text-gray-900 dark:text-white">
                            {day.dayName}
                          </h3>
                          <p className="text-10-regular lg:text-14-regular text-gray-600 dark:text-dark-700">
                            {day.date}
                          </p>
                        </div>

                        {/* Slots */}
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
                                  className={`w-full p-2 rounded border text-xs sm:text-sm lg:text-base transition-colors
                  ${
                    patientHasAppointment
                      ? "bg-yellow-100 text-yellow-600 border-yellow-300 cursor-not-allowed dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30"
                      : slot.available
                        ? "bg-green-100 text-green-600 border-green-300 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30 dark:hover:bg-green-500/30"
                        : "bg-red-100 text-red-600 border-red-300 cursor-not-allowed dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
                  }`}
                                  title={
                                    patientHasAppointment
                                      ? "You already have an appointment on this date"
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
                            <p className="text-center text-red-600 dark:text-red-400 text-xs sm:text-sm">
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
                <div
                  className="
    bg-gradient-to-r from-blue-50 to-blue-100/50
    border border-blue-200 shadow-sm
    dark:bg-gradient-to-r dark:from-blue-500/10 dark:to-blue-600/5
    dark:border-blue-500/20
    backdrop-blur-xl rounded-3xl p-6 lg:p-8
  "
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="
        w-10 h-10 flex items-center justify-center rounded-xl
        bg-gradient-to-r from-blue-500 to-blue-600
      "
                    >
                      <Check className="w-5 h-5 text-white" />
                    </div>

                    <h2
                      className="
        text-20-bold lg:text-24-bold
        text-slate-900
        dark:text-white
      "
                    >
                      Confirm Appointment
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Doctor Info */}
                    <div
                      className="
        bg-white border border-slate-200
        dark:bg-dark-400/50 dark:border-dark-500/50
        rounded-2xl p-4 lg:p-6 transition-colors
      "
                    >
                      <h3 className="text-16-bold lg:text-18-bold text-slate-900 dark:text-white mb-4">
                        Doctor Information
                      </h3>

                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={selectedDoctor.avatar}
                          alt={selectedDoctor.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                        />
                        <div>
                          <h4 className="text-14-semibold lg:text-16-semibold text-slate-900 dark:text-white">
                            {selectedDoctor.name}
                          </h4>
                          <p className="text-14-regular text-blue-600 dark:text-blue-400">
                            {selectedDoctor.speciality}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(selectedDoctor.rating)}
                            <span className="text-12-regular text-slate-700 dark:text-white ml-1">
                              {selectedDoctor.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-12-regular lg:text-14-regular">
                        <div className="items-center gap-2 hidden sm:flex text-slate-700 dark:text-dark-700">
                          <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span>{selectedDoctor.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div
                      className="
        bg-white border border-slate-200
        dark:bg-dark-400/50 dark:border-dark-500/50
        rounded-2xl p-4 lg:p-6 transition-colors
      "
                    >
                      <h3 className="text-16-bold lg:text-18-bold text-slate-900 dark:text-white mb-4">
                        Appointment Details
                      </h3>

                      <div className="space-y-4">
                        {/* Date */}
                        <div className="flex items-center gap-4">
                          <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <div>
                            <div className="text-14-semibold lg:text-16-semibold text-slate-900 dark:text-white">
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
                            <div className="text-14-regular text-slate-600 dark:text-dark-700">
                              Date
                            </div>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-4">
                          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <div>
                            <div className="text-14-semibold lg:text-16-semibold text-slate-900 dark:text-white">
                              {selectedTime}
                            </div>
                            <div className="text-14-regular text-slate-600 dark:text-dark-700">
                              Time
                            </div>
                          </div>
                        </div>

                        {/* Fee */}
                        <div
                          className="
            bg-green-100 text-green-700 border border-green-300
            dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30
            rounded-lg px-4 py-3
          "
                        >
                          <div className="text-14-semibold lg:text-16-semibold">
                            Consultation Fee: ₹{selectedDoctor.consultationFee}
                          </div>
                          <div className="text-12-regular dark:text-green-300">
                            Payment due after service
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details Form */}
                <div
                  className="
   from-slate-50 to-slate-100/60
    border border-slate-200 shadow-sm
    dark:bg-gradient-to-r dark:from-dark-400/30 dark:to-dark-300/30
    dark:border-dark-500/50
    backdrop-blur-xl rounded-3xl p-6 lg:p-8
    relative z-0
  "
                >
                  <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white mb-6">
                    Appointment Information
                  </h2>

                  <div className="space-y-6">
                    {/* Appointment Type Dropdown */}
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
                          onBlur={() =>
                            setTimeout(() => {
                              setShowAppointmentTypeDropdown(false);
                            }, 150)
                          }
                          className="
            w-full bg-white border border-slate-300 text-slate-900
            hover:border-green-500
            dark:bg-slate-900 dark:border-dark-600 dark:text-white
            dark:hover:border-green-500
            rounded-lg px-4 py-3 text-left flex items-center justify-between
            transition-colors
          "
                        >
                          <span>{appointmentType}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-600 dark:text-dark-600 transition-transform ${
                              showAppointmentTypeDropdown ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown */}
                        {showAppointmentTypeDropdown && (
                          <div
                            className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-white border border-slate-300 text-slate-900 shadow-xl
              dark:bg-slate-900 dark:border-dark-600 dark:text-white
              rounded-lg overflow-hidden
            "
                          >
                            <div
                              className="
                p-3 border-b
                border-slate-300 text-slate-700
                dark:border-dark-500 dark:text-dark-700
              "
                            >
                              <span className="text-14-medium">
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
                                  className="
                    w-full p-4 flex items-center justify-between text-left
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                    transition-colors
                  "
                                >
                                  <span className="text-16-medium">{type}</span>
                                  {appointmentType === type && (
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="shad-input-label block mb-2">
                        Reason for appointment *
                      </label>
                      <textarea
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        placeholder="Describe reason for visit"
                        required
                        className="
          shad-textArea resize-none min-h-[100px] w-full
          text-slate-900 dark:text-white
        "
                      />
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="shad-input-label block mb-2">
                        Additional notes (optional)
                      </label>
                      <textarea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Add any helpful details"
                        className="
          shad-textArea resize-none min-h-[80px] w-full
          text-slate-900 dark:text-white
        "
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
                    className={`w-full sm:w-auto
    px-6 lg:px-8 py-3 lg:py-4 rounded-xl
    text-14-semibold lg:text-16-semibold
    transition-all duration-300 shadow-lg
    bg-gradient-to-r from-green-500 to-green-600
    hover:from-green-600 hover:to-green-700
    text-white
    disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500
    dark:from-emerald-500 dark:to-emerald-600
    dark:hover:from-emerald-600 dark:hover:to-emerald-700
    dark:text-white
    dark:disabled:from-dark-600 dark:disabled:to-dark-700 dark:disabled:text-dark-400
    disabled:cursor-not-allowed
    hover:shadow-green-500/25 dark:hover:shadow-emerald-500/25
  `}
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
          <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-4 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6 lg:mb-8">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-sky-500 to-sky-600 text-white ring-1 ring-black/5 dark:ring-white/10">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <h2 className="text-[18px] lg:text-[24px] font-bold text-slate-900 dark:text-white">
                  Your Appointments
                </h2>
              </div>
              <Button
                className="btn3"
                onClick={() => {
                  refreshAppointment();
                }}
              >
                <RefreshCcw className="w-5 h-5" />
                Refresh Appointment
              </Button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {existingAppointments.map((appointment) => {
                const appointmentToday = isTodayIST(appointment.date);

                return (
                  <div
                    key={appointment.id}
                    className="bg-sky-50 dark:bg-slate-950/60 backdrop-blur-sm border-2 border-blue-200 dark:border-slate-600 rounded-2xl p-4 lg:p-6 hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Doctor + meta */}
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="relative">
                          <img
                            src={
                              appointment?.doctor?.avatar ||
                              "/doctor-avatar.jpg"
                            }
                            alt={appointment.doctor.name}
                            className="w-12 h-12 lg:w-20 lg:h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700"
                          />
                          <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                            <Stethoscope className="w-3 h-3 lg:w-4 lg:h-4" />
                          </div>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div>
                            <h3 className="text-base lg:text-xl font-semibold text-sky-900 dark:text-white mb-1">
                              {appointment.doctor.name}
                            </h3>
                            <p className="text-xs font-bold lg:text-sm text-emerald-700 dark:text-emerald-300">
                              {appointment.doctor.speciality}
                            </p>
                          </div>

                          {/* Date + Time */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-xs lg:text-sm">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                              <span className="font-bold">
                                {appointment.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                              <span className="font-bold">
                                {appointment.time}
                              </span>
                            </div>
                          </div>

                          {/* Reason / Notes */}
                          <div
                            className={[
                              "rounded-lg px-3 py-2 inline-block border",
                              appointment.status === "cancelled"
                                ? "bg-rose-50/70 dark:bg-rose-900/20 border-2 border-rose-300/60 dark:border-rose-400/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                                : "bg-slate-50/70 dark:bg-slate-800/50 border-2 border-gray-400 dark:border-slate-600 shadow-gray-300 dark:shadow-gray-700 shadow-md",
                            ].join(" ")}
                          >
                            <p
                              className={[
                                "text-[11px] font-bold lg:text-xs",
                                appointment.status === "cancelled"
                                  ? "text-rose-700 dark:text-rose-300"
                                  : "text-slate-600 dark:text-slate-300",
                              ].join(" ")}
                            >
                              <span
                                className={
                                  appointment.status === "cancelled"
                                    ? "text-rose-800 dark:text-rose-200 font-extrabold text-[12.5px]"
                                    : "text-slate-800 dark:text-slate-200 font-extrabold text-[12.5px]"
                                }
                              >
                                {appointment.status === "cancelled" &&
                                  "Cancellation "}
                                Reason:
                              </span>{" "}
                              {appointment.reason}
                            </p>
                          </div>

                          {appointment.notes &&
                            appointment.status !== "cancelled" && (
                              <div className="bg-sky-50/70 dark:bg-sky-900/20 border-2 border-sky-400 dark:border-sky-700 shadow-md shadow-sky-300 dark:shadow-sky-700 rounded-lg px-3 py-2 inline-block ml-0 sm:ml-2">
                                <p className="text-[11px] font-bold lg:text-xs text-sky-800 dark:text-sky-300">
                                  <span className="text-sky-900 text-[12.5px] dark:text-sky-200 font-extrabold">
                                    Notes:
                                  </span>{" "}
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Right: Status + Actions */}
                      <div className="flex flex-col items-start lg:items-end gap-3 lg:gap-4">
                        {getStatusBadge(
                          appointment.status,
                          appointment.workflow,
                          appointment.date
                        )}

                        {/* Upcoming (not today, not waiting) */}
                        {appointment.status === "upcoming" &&
                          !appointmentToday &&
                          appointment.workflow !== "waiting" && (
                            <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                              <button
                                onClick={() =>
                                  handleRescheduleClick(appointment)
                                }
                                className="
                                flex-1 lg:flex-none
                                text-white
                                px-3 lg:px-4 py-2
                                rounded-lg text-[11px] lg:text-sm font-medium
                                transition-all duration-300
                                flex items-center justify-center gap-2
                                bg-gradient-to-r from-sky-600 to-sky-800
                                hover:from-sky-700 hover:to-sky-800
                                shadow-lg hover:shadow-sky-500/25
                                dark:from-sky-700 dark:to-sky-500
                                dark:hover:from-sky-600 dark:hover:to-sky-700
                                dark:shadow-sky-500/20 dark:hover:shadow-sky-500/40"
                              >
                                <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">
                                  Reschedule
                                </span>
                                <span className="sm:hidden">Edit</span>
                              </button>

                              <button
                                onClick={() => handleCancelClick(appointment)}
                                className="
                                flex-1 lg:flex-none
                                text-white
                                px-3 lg:px-4 py-2
                                rounded-lg text-[11px] lg:text-sm font-medium
                                transition-all duration-300
                                flex items-center justify-center gap-2
                                bg-gradient-to-r from-rose-500 to-rose-600
                                hover:from-rose-600 hover:to-rose-700
                                shadow-lg hover:shadow-rose-500/25
                                dark:from-rose-500 dark:to-rose-600
                                dark:hover:from-rose-500 dark:hover:to-rose-700
                                dark:shadow-rose-500/20 dark:hover:shadow-rose-500/40"
                              >
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">Cancel</span>
                                <span className="sm:hidden">Cancel</span>
                              </button>
                            </div>
                          )}

                        {/* Today (not waiting/cancelled) */}
                        {appointmentToday &&
                          appointment.workflow !== "waiting" &&
                          appointment.status !== "cancelled" && (
                            <div className="flex flex-row lg:flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                              {/* Reschedule */}
                              <button
                                onClick={() =>
                                  handleRescheduleClick(appointment)
                                }
                                className="flex-1 lg:flex-none bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-3 lg:px-4 py-2 rounded-lg text-[11px] lg:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2"
                              >
                                <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">
                                  Reschedule
                                </span>
                                <span className="sm:hidden">Edit</span>
                              </button>

                              {/* Mark as Waiting */}
                              <button
                                onClick={() => handleMarkAsWaiting(appointment)}
                                className="flex-1 lg:flex-none bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 lg:px-4 py-2 rounded-lg text-[11px] lg:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
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
                <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-3xl mx-auto mb-6 lg:mb-8 flex items-center justify-center bg-gradient-to-r from-sky-500/15 to-sky-600/15 border border-sky-400/30 dark:from-sky-500/20 dark:to-sky-600/20 dark:border-sky-400/25">
                  <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-sky-600 dark:text-sky-300" />
                </div>

                <h3 className="text-[18px] lg:text-[24px] font-bold text-slate-900 dark:text-white mb-4">
                  No upcoming appointments
                </h3>

                <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 lg:mb-8">
                  You don't have any upcoming appointments. Book your next visit
                  with our healthcare providers.
                </p>

                <button
                  onClick={() => setActiveTab("book")}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
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
          className="
    mt-6 lg:mt-8
    text-12-regular lg:text-16-regular
    transition-colors
    text-gray-600 hover:text-gray-900
    dark:text-dark-600 dark:hover:text-white
  "
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
