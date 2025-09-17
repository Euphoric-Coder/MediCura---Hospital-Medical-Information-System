import React, { useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  AlertTriangle,
  Phone,
  Edit,
  X,
  Save,
} from "lucide-react";

const doctors = [
  { id: "1", name: "Dr. Sarah Safari", speciality: "General Medicine" },
  { id: "2", name: "Dr. Ava Williams", speciality: "Cardiology" },
  { id: "3", name: "Dr. Adam Smith", speciality: "Pediatrics" },
];

const appointmentTypes = [
  "Consultation",
  "Follow-up",
  "Check-up",
  "Emergency",
  "Procedure",
  "Vaccination",
];

const NewAppointmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    patientPhone: "",
    doctor: "",
    date: "",
    time: "",
    type: "",
    reason: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointmentData);
    setAppointmentData({
      patientName: "",
      patientPhone: "",
      doctor: "",
      date: "",
      time: "",
      type: "",
      reason: "",
      notes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              Schedule New Appointment
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="shad-input-label block mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={appointmentData.patientName}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      patientName: e.target.value,
                    }))
                  }
                  placeholder="John Smith"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={appointmentData.patientPhone}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      patientPhone: e.target.value,
                    }))
                  }
                  placeholder="+1 (555) 123-4567"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Doctor *</label>
                <select
                  value={appointmentData.doctor}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      doctor: e.target.value,
                    }))
                  }
                  className="shad-select-trigger w-full text-white"
                  required
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name} - {doctor.speciality}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Appointment Type *
                </label>
                <select
                  value={appointmentData.type}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="shad-select-trigger w-full text-white"
                  required
                >
                  <option value="">Select type</option>
                  {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Date *</label>
                <input
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Time *</label>
                <input
                  type="time"
                  value={appointmentData.time}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="shad-input-label block mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  value={appointmentData.reason}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Annual check-up, follow-up visit, etc."
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="shad-input-label block mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={appointmentData.notes}
                  onChange={(e) =>
                    setAppointmentData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Any special instructions or notes..."
                  className="shad-textArea w-full text-white min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ReceptionistAppointments = ({ onBack }) => {
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P001",
      patientPhone: "+1 (555) 123-4567",
      date: "2024-01-25",
      time: "09:00",
      doctor: "Dr. Sarah Safari",
      type: "Consultation",
      status: "scheduled",
      reason: "Annual check-up",
      isNewPatient: false,
      insuranceVerified: true,
    },
    {
      id: "2",
      patientName: "Emily Johnson",
      patientId: "P002",
      patientPhone: "+1 (555) 234-5678",
      date: "2024-01-25",
      time: "09:30",
      doctor: "Dr. Ava Williams",
      type: "Follow-up",
      status: "confirmed",
      reason: "Heart consultation follow-up",
      isNewPatient: false,
      insuranceVerified: true,
    },
    {
      id: "3",
      patientName: "Michael Brown",
      patientId: "P003",
      patientPhone: "+1 (555) 345-6789",
      date: "2024-01-25",
      time: "10:00",
      doctor: "Dr. Adam Smith",
      type: "Consultation",
      status: "scheduled",
      reason: "New patient consultation",
      isNewPatient: true,
      insuranceVerified: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = appointment.date === selectedDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleNewAppointment = (appointmentData) => {
    const newAppointment = {
      id: (appointments.length + 1).toString(),
      patientName: appointmentData.patientName,
      patientId: `P${String(appointments.length + 1).padStart(3, "0")}`,
      patientPhone: appointmentData.patientPhone,
      date: appointmentData.date,
      time: appointmentData.time,
      doctor: appointmentData.doctor,
      type: appointmentData.type,
      status: "scheduled",
      reason: appointmentData.reason,
      isNewPatient: true,
      insuranceVerified: false,
      notes: appointmentData.notes,
    };

    setAppointments((prev) => [...prev, newAppointment]);
    setMessage(`Appointment scheduled for ${appointmentData.patientName}`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );

    const appointment = appointments.find((a) => a.id === appointmentId);
    setMessage(`Appointment ${newStatus} for ${appointment?.patientName}`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Calendar className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">
              Scheduled
            </span>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">
              Confirmed
            </span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <X className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">
              Cancelled
            </span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-gray-400">
              Completed
            </span>
          </div>
        );
      case "no-show":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">
              No Show
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const scheduledCount = appointments.filter(
    (a) => a.status === "scheduled"
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const newPatientCount = appointments.filter((a) => a.isNewPatient).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">
                    Appointment Management
                  </span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">
                    Schedule and manage appointments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewAppointmentModal(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">New Appointment</span>
              </button>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
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
                    {confirmedCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    Confirmed
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {completedCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {newPatientCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">
                    New Patients
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search appointments..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="shad-input text-white w-full sm:w-auto"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Appointments for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>

                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">
                            {appointment.patientName}
                          </h3>
                          {getStatusBadge(appointment.status)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span className="text-white">Doctor:</span>{" "}
                            {appointment.doctor}
                          </div>
                          <div>
                            <span className="text-white">Type:</span>{" "}
                            {appointment.type}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Patient ID:</span>{" "}
                            {appointment.patientId}
                          </div>
                          <div>
                            <span className="text-white">Phone:</span>{" "}
                            {appointment.patientPhone}
                          </div>
                        </div>

                        <div className="bg-purple-500/20 rounded-lg px-3 py-2">
                          <p className="text-10-regular lg:text-12-regular text-purple-400">
                            <span className="text-white">Reason:</span>{" "}
                            {appointment.reason}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          {appointment.isNewPatient && (
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-10-medium text-blue-400">
                              New Patient
                            </span>
                          )}
                          {!appointment.insuranceVerified && (
                            <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium text-red-400">
                              Insurance Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      {appointment.status === "scheduled" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "confirmed")
                          }
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-purple-500/20">
                  <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-purple-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No appointments found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No appointments match your search criteria for the selected
                  date.
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

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSubmit={handleNewAppointment}
      />
    </>
  );
};

export default ReceptionistAppointments;
