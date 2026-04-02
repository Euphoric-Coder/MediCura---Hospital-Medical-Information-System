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
  Check,
  Activity,
  Sparkles,
  ArrowUpRight
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
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
              Set Availability
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-16-bold text-slate-900 dark:text-white mb-1">
              Date: {selectedDate}
            </h3>
            <p className="text-14-regular text-slate-500 dark:text-slate-400">
              Click time slots below to toggle your availability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => toggleSlotAvailability(index)}
                className={`p-3 rounded-xl text-13-medium lg:text-14-medium transition-all duration-200 border ${
                  slot.available
                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
                    : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3.5 px-4 rounded-xl text-14-semibold lg:text-15-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white py-3.5 px-4 rounded-xl text-14-semibold lg:text-15-semibold transition-all duration-300 shadow-lg shadow-emerald-500/20"
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
    return "bg-red-50 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30 dark:hover:bg-red-500/20";
  }

  switch (status) {
    case "scheduled":
      return "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30 dark:hover:bg-blue-500/20";
    case "waiting":
      return "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/30 dark:hover:bg-orange-500/20";
    case "arrived":
      return "bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-500/30 dark:hover:bg-yellow-500/20";
    case "checked-in":
      return "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/30 dark:hover:bg-teal-500/20";
    case "in-consultation":
      return "bg-green-50 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/30 dark:hover:bg-green-500/20";
    case "completed":
      return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30 dark:hover:bg-slate-500/20";
    case "cancelled":
      return "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30 dark:hover:bg-rose-500/20";
    case "no-show":
      return "bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/30 dark:hover:bg-pink-500/20";
    default:
      return "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30 dark:hover:bg-indigo-500/20";
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
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating gradient orb */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none ${type === 'phone' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>

        {/* Icon */}
        <div className="flex justify-center mb-6 relative z-10">
          <div
            className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg transform rotate-3 ${
              type === "phone"
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30"
                : "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30"
            }`}
          >
            {type === "phone" ? (
              <Phone className="w-8 h-8 text-white -rotate-3" />
            ) : (
              <Mail className="w-8 h-8 text-white -rotate-3" />
            )}
          </div>
        </div>

        {/* Content */}
        <h2 className="text-20-bold text-center text-slate-900 dark:text-white mb-2 relative z-10">
          {type === "phone" ? "Patient Phone" : "Patient Email"}
        </h2>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-8 relative z-10">
          <p className="text-center text-slate-700 dark:text-slate-300 text-16-medium lg:text-18-medium break-words font-mono tracking-tight">
            {value}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 relative z-10">
          {type === "phone" ? (
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3.5 rounded-xl text-15-semibold transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" /> Copy Number
                </>
              )}
            </button>
          ) : (
            <a
              href={`mailto:${value}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3.5 rounded-xl text-15-semibold transition-all duration-300 shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Mail className="w-5 h-5" /> Send Mail
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentGrid = ({ day }) => {
  return (
    <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto pr-1 custom-scrollbar">
      {day.slots.filter((slot) => slot.appointment).length > 0 ? (
        day.slots
          .filter((slot) => slot.appointment)
          .map((slot, slotIndex) => (
            <HoverCard key={slotIndex}>
              <HoverCardTrigger asChild>
                <div
                  className={`p-2.5 lg:p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${getSlotClasses(
                    slot.appointment?.workflow,
                    slot.appointment?.isUrgent
                  )} hover:scale-[1.02]`}
                >
                  <div className="text-center">
                    <div className="text-13-bold lg:text-14-bold mb-0.5">
                      {slot.time}
                    </div>
                    <div className="text-11-medium lg:text-12-medium opacity-90 truncate mb-1">
                      {slot.appointment?.patient.name}
                    </div>
                    <div className="text-[10px] lg:text-11-medium opacity-70 truncate px-2 py-0.5 bg-white/40 dark:bg-black/20 rounded-md inline-block">
                      {slot.appointment?.type}
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>

              <HoverCardContent
                className="w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl overflow-hidden"
                side="top"
                align="center"
              >
                {/* Decorative header gradient */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 absolute top-0 left-0"></div>
                <div className="flex gap-4 p-1 pt-3">
                  <div className="relative">
                    <img
                      src={slot.appointment?.patient.avatar || "/placeholder.png"}
                      alt={slot.appointment?.patient.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                    />
                    {slot.appointment?.isUrgent && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-bounce"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 dark:text-white text-15-bold mb-0.5">
                      {slot.appointment?.patient.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-12-medium mb-2">
                      {slot.appointment?.patient.gender},{" "}
                      {slot.appointment?.patient.dateOfBirth &&
                        new Date().getFullYear() -
                          new Date(
                            slot.appointment?.patient.dateOfBirth
                          ).getFullYear()}{" "}
                      yrs
                    </p>
                    <div className="space-y-1.5">
                      <p className="flex gap-2 items-center text-slate-600 dark:text-slate-300 text-12-regular bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <Mail className="w-3.5 h-3.5 text-blue-500" /> <span className="truncate">{slot.appointment?.patient.email}</span>
                      </p>
                      <p className="flex gap-2 items-center text-slate-600 dark:text-slate-300 text-12-regular bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" /> {slot.appointment?.patient.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-13-regular text-slate-600 w-full space-y-2">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="text-slate-900 dark:text-white font-semibold">Reason:</span>{" "}
                      {slot.appointment?.reason || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-1 pb-1">
                    <span className="text-12-medium text-slate-500 dark:text-slate-400">Workflow Status</span>
                    <span className="text-12-bold text-indigo-600 dark:text-indigo-400 capitalize px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-md">
                      {slot.appointment?.workflow}
                    </span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))
      ) : (
        <div className="text-center py-6 lg:py-10 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50 h-full min-h-[140px]">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-12-medium text-slate-500 dark:text-slate-400">
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    const hourStr = hour12.toString().padStart(2, "0"); 
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

      const fullDate = date.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      const slots = [];
      for (let hour = 9; hour < 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotTime = formatTime(hour, minute); 

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

  const getStatusBadge = (status, isUrgent) => {
    const baseClasses =
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-11-medium sm:text-12-medium backdrop-blur-md border shadow-sm transition-all";

    if (isUrgent) {
      return (
        <div className={`${baseClasses} bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20`}>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span>Urgent</span>
        </div>
      );
    }

    switch (status) {
      case "scheduled":
        return (
          <div className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20`}>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Scheduled</span>
          </div>
        );
      case "waiting":
        return (
          <div className={`${baseClasses} bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20`}>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
            <span>Waiting</span>
          </div>
        );
      case "in-progress":
      case "in-consultation":
        return (
          <div className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20`}>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>In Consultation</span>
          </div>
        );
      case "completed":
        return (
          <div className={`${baseClasses} bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20`}>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            <span>Completed</span>
          </div>
        );
      case "cancelled":
        return (
          <div className={`${baseClasses} bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20`}>
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span>Cancelled</span>
          </div>
        );
      case "checked-in":
        return (
          <div className={`${baseClasses} bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20`}>
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
            <span>Checked In</span>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20`}>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            <span className="capitalize">{status}</span>
          </div>
        );
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

  return (
    <>
      <div className={`min-h-screen bg-slate-50/50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-50 font-sans transition-all duration-700 ease-in-out pb-20 overflow-x-hidden ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-14">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                  <Calendar className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                </div>
              </div>
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-12-medium text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Schedule Management</span>
                </div>
                <h1 className="text-28-bold lg:text-40-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white">
                  Appointments
                </h1>
                <p className="text-15-regular lg:text-16-regular text-slate-500 dark:text-slate-400 mt-1">
                  View and manage your upcoming schedule.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
              <button 
                onClick={onBack}
                className="bg-white dark:bg-slate-900/40 backdrop-blur-xl px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-md hover:shadow-lg transition-all z-10 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md mb-8 animate-in slide-in-from-top-4 fade-in duration-500 shadow-sm ${
                messageType === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400"
                  : "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-medium lg:text-15-medium">
                {message}
              </span>
            </div>
          )}

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            {[
              { label: "Scheduled", value: scheduledCount, icon: Calendar, color: "blue" },
              { label: "Completed", value: completedCount, icon: CheckCircle, color: "emerald" },
              { label: "Waiting", value: waitingCount, icon: Clock, color: "amber" },
              { label: "Cancelled", value: cancelledCount, icon: AlertTriangle, color: "rose" },
            ].map((stat, i) => (
              <div key={i} className="group relative z-10">
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-md group-hover:shadow-lg transition-all duration-500"></div>
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-5 lg:p-7 flex items-start justify-between">
                  <div>
                    <div className="text-32-bold lg:text-40-bold tracking-tight text-slate-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className={`text-13-medium transition-colors duration-300 ${
                      stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                      stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                  
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 dark:bg-${stat.color}-500/10 border border-${stat.color}-200 dark:border-${stat.color}-500/20 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    <stat.icon className={`w-6 h-6 lg:w-7 lg:h-7 text-${stat.color}-600 dark:text-${stat.color}-400 drop-shadow-sm`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar View Area */}
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 mb-10">
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-none"></div>
            
            <div className="relative p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
                    Weekly Overview
                  </h2>
                </div>
                
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-sm">
                  <button
                    onClick={() => handleWeekChange("prev")}
                    className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-40 lg:w-48 text-center">
                    <span className="text-14-bold text-slate-800 dark:text-slate-200">
                      {currentWeek === 0
                        ? "This Week"
                        : currentWeek > 0
                          ? `${currentWeek} Week${currentWeek > 1 ? "s" : ""} Ahead`
                          : `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? "s" : ""} Ago`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleWeekChange("next")}
                    className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-5">
                {weekSchedule.map((day, dayIndex) => {
                  const isToday = currentWeek === 0 && new Date().getDay() === (dayIndex + 1) % 7 && dayIndex < 6;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`bg-white dark:bg-slate-800/40 rounded-3xl p-4 border transition-all duration-300 shadow-sm ${
                        isToday ? "border-blue-400 dark:border-blue-500/50 ring-1 ring-blue-400 dark:ring-blue-500/50 scale-[1.02] shadow-md shadow-blue-500/10" : "border-slate-200 dark:border-slate-700/50"
                      }`}
                    >
                      <div className="text-center mb-5 pb-4 border-b border-slate-100 dark:border-slate-700/50 relative">
                        {isToday && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                        <h3 className={`text-15-bold lg:text-16-bold mb-1 ${isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
                          {day.dayName}
                        </h3>
                        <p className="text-12-medium text-slate-500 dark:text-slate-400">
                          {day.date}
                        </p>
                        <button
                          onClick={() => handleSetAvailability(day.fullDate)}
                          className="mt-3 text-11-semibold lg:text-12-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-500/20 w-fit mx-auto"
                        >
                          Set Availability
                        </button>
                      </div>

                      <AppointmentGrid day={day} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Appointment List Area */}
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-none"></div>
            
            <div className="relative p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
                      Appointment Directory
                    </h2>
                    <p className="text-13-regular text-slate-500 dark:text-slate-400 mt-1">
                      Manage all detailed patient appointments.
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search patients..."
                      className="pl-10 w-full sm:w-56 bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white text-13-medium lg:text-14-medium border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm outline-none"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="w-4 h-4 text-slate-400" />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 appearance-none bg-white dark:bg-[#0a0f1c] text-slate-900 dark:text-white w-full sm:w-40 text-13-medium lg:text-14-medium border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm outline-none cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="waiting">Waiting</option>
                      <option value="in-progress">In Progress</option>
                      <option value="checked-in">Checked In</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="group bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-3xl p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-xl relative overflow-hidden"
                  >
                    {/* Left Accent Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                      appointment.isUrgent ? 'bg-red-500' : 'bg-transparent group-hover:bg-blue-500'
                    }`}></div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pl-2">
                      <div className="flex items-start lg:items-center gap-4 lg:gap-6 flex-1">
                        <div className="relative">
                          <img
                            src={appointment.patient.avatar || "/placeholder.png"}
                            alt={appointment.patient.name}
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
                          />
                          {appointment.isUrgent && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-bounce"></div>
                          )}
                        </div>

                        <div className="space-y-3 min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
                            <h3 className="text-16-bold xl:text-18-bold text-slate-900 dark:text-white truncate">
                              {appointment.patient.name}
                            </h3>
                            {getStatusBadge(
                              appointment.workflow,
                              appointment.isUrgent
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-13-medium lg:text-14-medium text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-slate-800 dark:text-slate-300 font-medium">{format(appointment.date, "PPP")}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                              <Clock className="w-4 h-4 text-purple-500" />
                              <span className="text-slate-800 dark:text-slate-300 font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 opacity-70" />
                              <span className="text-slate-700 dark:text-slate-300">{appointment.type}</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                              <User className="w-4 h-4 opacity-70" />
                              <span className="text-slate-700 dark:text-slate-300">{calculateAge(appointment.patient.dateOfBirth)} yrs</span>
                            </div>
                          </div>

                          {appointment.reason && (
                            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800/80 inline-block w-full sm:w-auto">
                              <p className="text-12-medium lg:text-13-medium text-slate-600 dark:text-slate-400">
                                <span className="text-slate-900 dark:text-white font-semibold">Reason:</span>{" "}
                                {appointment.reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row items-center lg:flex-col justify-start lg:justify-end gap-3 flex-shrink-0 ml-16 lg:ml-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 pt-4 lg:pt-0">
                        <button
                          onClick={() =>
                            openContactModal("phone", appointment.patient.phone)
                          }
                          className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-slate-500 lg:w-full"
                        >
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span className="text-13-semibold">Call Patient</span>
                        </button>

                        <button
                          onClick={() =>
                            openContactModal("email", appointment.patient.email)
                          }
                          className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-slate-500 lg:w-full"
                        >
                          <Mail className="w-4 h-4 text-emerald-500" />
                          <span className="text-13-semibold">Email Patient</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12 lg:py-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mt-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                  <div className="w-20 h-20 bg-blue-100/50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-blue-200 dark:border-blue-500/20 shadow-inner">
                    <Search className="w-10 h-10 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                  </div>
                  <h3 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white mb-2">
                    No appointments found
                  </h3>
                  <p className="text-14-medium lg:text-16-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    We couldn't find any appointments matching your filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
