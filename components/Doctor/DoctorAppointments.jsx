import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Users,
  Copy,
} from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Appointments, Patients } from "@/lib/schema";
import { db } from "@/lib/dbConfig";
import { desc, eq } from "drizzle-orm";
import { format } from "date-fns";
import { calculateAge } from "@/lib/utils";

const AvailabilityModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSaveAvailability,
}) => {
  const [timeSlots, setTimeSlots] = useState(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push({ time, available: true });
      }
    }
    return slots;
  });

  const toggleSlotAvailability = (index) => {
    setTimeSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  const handleSave = () => {
    onSaveAvailability(selectedDate, timeSlots);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              Set Availability
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-16-bold text-white mb-2">
              Date: {selectedDate}
            </h3>
            <p className="text-14-regular text-dark-700">
              Click time slots to toggle availability
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => toggleSlotAvailability(index)}
                className={`p-2 lg:p-3 rounded-lg text-12-medium lg:text-14-medium transition-all duration-200 ${
                  slot.available
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to Weekly Schedule Color
const getSlotClasses = (status, isUrgent) => {
  if (isUrgent) {
    return "bg-red-500/20 border border-red-500/40 hover:bg-red-500/30";
  }

  switch (status) {
    case "scheduled":
      return "bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30";
    case "waiting":
      return "bg-orange-500/20 border border-orange-500/30 hover:bg-orange-500/30";
    case "arrived":
      return "bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30";
    case "checked-in":
      return "bg-teal-500/20 border border-teal-500/30 hover:bg-teal-500/30";
    case "in-consultation":
      return "bg-green-500/20 border border-green-500/30 hover:bg-green-500/30";
    case "completed":
      return "bg-gray-500/20 border border-gray-500/30 hover:bg-gray-500/30";
    case "cancelled":
      return "bg-red-500/20 border border-red-500/30 hover:bg-red-500/30";
    case "no-show":
      return "bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/30";
    default:
      return "bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30";
  }
};

const PatientContactModal = ({ type, value, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-dark-400/90 to-dark-300/90 border border-dark-500/50 rounded-3xl p-6 w-full max-w-sm shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-dark-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              type === "phone"
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : "bg-gradient-to-r from-green-500 to-green-600"
            }`}
          >
            {type === "phone" ? (
              <Phone className="w-8 h-8 text-white" />
            ) : (
              <Mail className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <h2 className="text-20-bold text-center text-white mb-4">
          {type === "phone" ? "Patient Phone" : "Patient Email"}
        </h2>

        <p className="text-center text-dark-600 text-lg mb-6 break-words">
          {value}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {type === "phone" ? (
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Number
                </>
              )}
            </button>
          ) : (
            <a
              href={`mailto:${value}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              <Mail className="w-4 h-4" /> Send Mail
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentGrid = ({ day }) => {
  return (
    <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
      {day.slots.filter((slot) => slot.appointment).length > 0 ? (
        day.slots
          .filter((slot) => slot.appointment)
          .map((slot, slotIndex) => (
            <HoverCard key={slotIndex}>
              <HoverCardTrigger asChild>
                <div
                  className={`p-2 lg:p-3 rounded-lg border transition-all duration-200 cursor-pointer ${getSlotClasses(
                    slot.appointment?.workflow,
                    slot.appointment?.isUrgent
                  )}`}
                >
                  <div className="text-center">
                    <div className="text-12-medium lg:text-14-medium text-white">
                      {slot.time}
                    </div>
                    <div className="text-10-regular lg:text-12-regular text-white/70 truncate mt-1">
                      {slot.appointment?.patient.name}
                    </div>
                    <div className="text-10-regular text-white/50 truncate">
                      {slot.appointment?.type}
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>

              <HoverCardContent
                className="w-80 bg-dark-400 border border-dark-500 rounded-xl shadow-lg"
                side="top"
              >
                <div className="flex gap-4">
                  <img
                    src={slot.appointment?.patient.avatar || "/placeholder.png"}
                    alt={slot.appointment?.patient.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-white text-14-semibold">
                      {slot.appointment?.patient.name}
                    </h3>
                    <p className="text-dark-600 text-12-regular">
                      {slot.appointment?.patient.gender},{" "}
                      {slot.appointment?.patient.dateOfBirth &&
                        new Date().getFullYear() -
                          new Date(
                            slot.appointment?.patient.dateOfBirth
                          ).getFullYear()}{" "}
                      yrs
                    </p>
                    <p className="flex gap-1 items-center text-dark-600 text-12-regular">
                      <Mail /> {slot.appointment?.patient.email}
                    </p>
                    <p className="flex gap-1 items-center text-dark-600 text-12-regular">
                      <Phone /> {slot.appointment?.patient.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-3 border-t border-dark-600 pt-2 text-12-regular text-dark-700">
                  <p>
                    <span className="text-white">Reason:</span>{" "}
                    {slot.appointment?.reason || "N/A"}
                  </p>
                  <p>
                    <span className="text-white">Workflow:</span>{" "}
                    {slot.appointment?.workflow}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))
      ) : (
        <div className="text-center py-4 lg:py-8">
          <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-dark-600 mx-auto mb-2" />
          <p className="text-10-regular lg:text-12-regular text-dark-600">
            No appointments
          </p>
        </div>
      )}
    </div>
  );
};

const DoctorAppointments = ({ onBack, doctorData }) => {
  const [modalType, setModalType] = useState(null);
  const [contactModal, setContactModal] = useState({
    isOpen: false,
    type: null,
    value: "",
  });

  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Open modal for a specific appointment
  const openContactModal = (type, value) => {
    setContactModal({ isOpen: true, type, value });
  };

  // Close modal
  const closeContactModal = () => {
    setContactModal({ isOpen: false, type: null, value: "" });
  };

  const fetchAppointments = async () => {
    try {
      const data = await db
        .select({
          id: Appointments.id,
          date: Appointments.date,
          time: Appointments.time,
          reason: Appointments.reason,
          status: Appointments.status,
          workflow: Appointments.workflow,
          type: Appointments.type,
          bookingDate: Appointments.bookingDate,
          updatedAt: Appointments.updatedAt,

          // patient data
          patient: {
            userId: Patients.userId,
            avatar: Patients.avatar,
            name: Patients.name,
            email: Patients.email,
            phone: Patients.phone,
            gender: Patients.gender,
            address: Patients.address,
            dateOfBirth: Patients.dateOfBirth,
            emergencyContactName: Patients.emergencyContactName,
            emergencyPhone: Patients.emergencyPhone,
            allergies: Patients.allergies,
            currentMedications: Patients.currentMedications,
            familyMedicalHistory: Patients.familyMedicalHistory,
            pastMedicalHistory: Patients.pastMedicalHistory,
          },
        })
        .from(Appointments)
        .innerJoin(Patients, eq(Appointments.patientId, Patients.userId))
        .where(eq(Appointments.doctorId, doctorData.userId))
        .orderBy(desc(Appointments.date));

      // console.log("Appointments with patient data:", data);
      setAllAppointments(data);

      return data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };

  const formatTime = (hour, minute) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const hourStr = hour12.toString().padStart(2, "0"); // <-- ensures 09, 01, etc.
    const minuteStr = minute.toString().padStart(2, "0");
    return `${hourStr}:${minuteStr} ${ampm}`;
  };

  const generateWeekSchedule = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

    const schedule = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Use IST local date (yyyy-mm-dd) instead of toISOString()
      // Fixes 1-day shift issue caused by UTC conversion
      const fullDate = date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      const slots = [];
      for (let hour = 9; hour < 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotTime = formatTime(hour, minute); // e.g. "10:30 AM"

          // Look up matching appointment
          const appointment = allAppointments.find(
            (apt) =>
              apt.date === fullDate &&
              apt.time.toLowerCase() === slotTime.toLowerCase()
          );

          if (appointment) {
            slots.push({
              time: slotTime,
              available: false,
              appointment,
            });
          } else {
            slots.push({
              time: slotTime,
              available: true,
            });
          }
        }
      }

      schedule.push({
        date: dateStr,
        dayName,
        fullDate,
        slots,
      });
    }

    return schedule;
  };

  // Update weekSchedule whenever appointments/currentWeek change
  useEffect(() => {
    setWeekSchedule(generateWeekSchedule(currentWeek));
  }, [allAppointments, currentWeek]);

  const [weekSchedule, setWeekSchedule] = useState(generateWeekSchedule(0));

  const handleWeekChange = (direction) => {
    const newWeek = direction === "next" ? currentWeek + 1 : currentWeek - 1;
    setCurrentWeek(newWeek);
    setWeekSchedule(generateWeekSchedule(newWeek));
  };

  const handleSetAvailability = (date) => {
    setSelectedDate(date);
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = (date, slots) => {
    setMessage(`Availability updated for ${date}`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // Function to get status badge
  const getStatusBadge = (status, isUrgent) => {
    const baseClasses =
      "flex items-center gap-1 px-2 py-1 rounded-full text-10-medium sm:text-12-medium";

    if (isUrgent) {
      return (
        <div
          className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400">Urgent</span>
        </div>
      );
    }

    switch (status) {
      case "scheduled":
        return (
          <div
            className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-400">Scheduled</span>
          </div>
        );

      case "waiting":
        return (
          <div
            className={`${baseClasses} bg-orange-500/20 border border-orange-500/30`}
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400">Waiting</span>
          </div>
        );

      case "arrived":
        return (
          <div
            className={`${baseClasses} bg-yellow-500/20 border border-yellow-500/30`}
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-400">Arrived</span>
          </div>
        );

      case "checked-in":
        return (
          <div
            className={`${baseClasses} bg-teal-500/20 border border-teal-500/30`}
          >
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-teal-400">Checked-In</span>
          </div>
        );

      case "in-consultation":
        return (
          <div
            className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400">In Consultation</span>
          </div>
        );

      case "completed":
        return (
          <div
            className={`${baseClasses} bg-gray-500/20 border border-gray-500/30`}
          >
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-gray-400">Completed</span>
          </div>
        );

      case "cancelled":
        return (
          <div
            className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-400">Cancelled</span>
          </div>
        );

      case "no-show":
        return (
          <div
            className={`${baseClasses} bg-pink-500/20 border border-pink-500/30`}
          >
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span className="text-pink-400">No Show</span>
          </div>
        );

      default:
        return null;
    }
  };

  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.workflow === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const scheduledCount = allAppointments.filter(
    (apt) => apt.workflow === "scheduled"
  ).length;
  const completedCount = allAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;
  const waitingCount = allAppointments.filter(
    (apt) => apt.workflow === "waiting"
  ).length;
  const cancelledCount = allAppointments.filter(
    (apt) => apt.status === "cancelled"
  ).length;
  const totalRevenue = allAppointments
    .filter((apt) => apt.status === "completed")
    .reduce((sum, apt) => sum + apt.consultationFee, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  Appointment Schedule
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Manage your weekly schedule
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-6 lg:mb-8 ${
                messageType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">
                {message}
              </span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {scheduledCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">
                    Scheduled
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {completedCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {waitingCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">
                    Waiting
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {cancelledCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">
                    Cancelled
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Weekly Schedule
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleWeekChange("prev")}
                  className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <span className="text-14-medium lg:text-16-medium text-white px-4">
                  {currentWeek === 0
                    ? "This Week"
                    : currentWeek > 0
                    ? `${currentWeek} Week${currentWeek > 1 ? "s" : ""} Ahead`
                    : `${Math.abs(currentWeek)} Week${
                        Math.abs(currentWeek) > 1 ? "s" : ""
                      } Ago`}
                </span>
                <button
                  onClick={() => handleWeekChange("next")}
                  className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {weekSchedule.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="bg-dark-400/50 rounded-2xl p-3 lg:p-4"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-14-semibold lg:text-16-semibold text-white">
                      {day.dayName}
                    </h3>
                    <p className="text-12-regular lg:text-14-regular text-dark-700">
                      {day.date}
                    </p>
                    <button
                      onClick={() => handleSetAvailability(day.date)}
                      className="mt-2 text-10-regular lg:text-12-regular text-green-400 hover:text-green-300 transition-colors"
                    >
                      Set Availability
                    </button>
                  </div>

                  {/* <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
                    {day.slots.filter((slot) => slot.appointment).length > 0 ? (
                      day.slots
                        .filter((slot) => slot.appointment)
                        .map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className={`p-2 lg:p-3 rounded-lg border transition-all duration-200 cursor-pointer ${getSlotClasses(
                              slot.appointment?.workflow,
                              slot.appointment?.isUrgent
                            )}`}
                          >
                            <div className="text-center">
                              <div className="text-12-medium lg:text-14-medium text-white">
                                {slot.time}
                              </div>
                              <div className="text-10-regular lg:text-12-regular text-white/70 truncate mt-1">
                                {slot.appointment?.patient.name}
                              </div>
                              <div className="text-10-regular text-white/50 truncate">
                                {slot.appointment?.type}
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4 lg:py-8">
                        <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-dark-600 mx-auto mb-2" />
                        <p className="text-10-regular lg:text-12-regular text-dark-600">
                          No appointments
                        </p>
                      </div>
                    )}
                  </div> */}
                  <AppointmentGrid day={day} />
                </div>
              ))}
            </div>
          </div>

          {/* Appointment List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">
                  All Appointments
                </h2>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patients..."
                    className="shad-input pl-10 w-full sm:w-48 text-white text-12-regular lg:text-14-regular"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shad-select-trigger text-white w-full sm:w-auto text-12-regular lg:text-14-regular"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <img
                        src={appointment.patient.avatar}
                        alt={appointment.patient.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-dark-500/50 flex-shrink-0"
                      />

                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">
                            {appointment.patient.name}
                          </h3>
                          {getStatusBadge(
                            appointment.workflow,
                            appointment.isUrgent
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                            <span>{format(appointment.date, "PPP")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-purple-400" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span className="text-white">Type:</span>{" "}
                            {appointment.type}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Age:</span>{" "}
                            {calculateAge(appointment.patient.dateOfBirth)}{" "}
                            Years
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-white">ID:</span>{" "}
                            {appointment.patient.userId}
                          </div>
                        </div>

                        <div className="bg-dark-500/30 rounded-lg px-3 py-2">
                          <p className="text-10-regular lg:text-12-regular text-dark-600">
                            <span className="text-white">Reason:</span>{" "}
                            {appointment.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        {/* Phone Button */}
                        <button
                          onClick={() =>
                            openContactModal("phone", appointment.patient.phone)
                          }
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        {/* Email Button */}
                        <button
                          onClick={() =>
                            openContactModal("email", appointment.patient.email)
                          }
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No appointments found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No appointments match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mt-6 lg:mt-8 text-14-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        selectedDate={selectedDate || ""}
        onSaveAvailability={handleSaveAvailability}
      />
      <PatientContactModal
        type={contactModal.type}
        value={contactModal.value}
        isOpen={contactModal.isOpen}
        onClose={closeContactModal}
      />
    </>
  );
};

export default DoctorAppointments;
