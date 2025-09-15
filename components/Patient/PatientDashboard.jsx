import React, { useEffect, useState } from "react";
import {
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  User,
  X,
  Heart,
  Activity,
  Stethoscope,
  MapPin,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Users } from "@/lib/schema";
import { eq } from "drizzle-orm";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-400 border border-dark-500 rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-24-bold text-white">Cancel Appointment</h2>
          <button
            onClick={onClose}
            className="text-dark-600 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-14-regular text-dark-700 mb-8">
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

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors"
          >
            Cancel appointment
          </button>
        </form>
      </div>
    </div>
  );
};

const PatientDashboard = ({ name, email, onBookAppointment }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    {
      id: "1",
      date: "Jan 15, 2024",
      time: "10:00 AM",
      status: "scheduled",
      doctor: {
        name: "Dr. Sarah Safari",
        avatar:
          "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        specialty: "General Medicine",
      },
      reason: "Annual check-up",
    },
    {
      id: "2",
      date: "Jan 20, 2024",
      time: "2:30 PM",
      status: "pending",
      doctor: {
        name: "Dr. Ava Williams",
        avatar:
          "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        specialty: "Cardiology",
      },
      reason: "Heart consultation",
    },
    {
      id: "3",
      date: "Jan 10, 2024",
      time: "9:00 AM",
      status: "cancelled",
      doctor: {
        name: "Dr. Adam Smith",
        avatar:
          "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        specialty: "Pediatrics",
      },
      reason: "Routine examination",
    },
  ];

  const scheduledCount = appointments.filter(
    (apt) => apt.status === "scheduled"
  ).length;
  const pendingCount = appointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const cancelledCount = appointments.filter(
    (apt) => apt.status === "cancelled"
  ).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-green-400">Scheduled</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-blue-400">Pending</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-12-medium text-red-400">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleCancel = (reason) => {
    console.log("Cancelling appointment:", reason);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const userName = session?.user?.name || "Patient";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-24-bold text-white">MediCura</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={onBookAppointment}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                >
                  Book Appointment
                </button>
                {/* Profile */}
                <div
                  onClick={() => router.push("/profile")}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer"
                  title="Go to profile"
                >
                  <span className="text-white font-bold">{userInitial}</span>
                </div>

                {/* Sign Out */}
                <button
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-14-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-36-bold text-white">
                  Welcome back, {userName}
                </h1>
                <p className="text-16-regular text-dark-700">
                  Here's an overview of your health journey
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">
                    {scheduledCount}
                  </div>
                  <div className="text-14-regular text-green-400">
                    Scheduled appointments
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">{pendingCount}</div>
                  <div className="text-14-regular text-blue-400">
                    Pending appointments
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">
                    {cancelledCount}
                  </div>
                  <div className="text-14-regular text-red-400">
                    Cancelled appointments
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-dark-400/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">Your Appointments</h2>
              </div>
              <button
                onClick={onBookAppointment}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Book New Appointment
              </button>
            </div>

            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-6 hover:border-dark-500/80 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src={appointment.doctor.avatar}
                          alt={appointment.doctor.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-dark-500/50 group-hover:border-green-500/50 transition-all duration-300"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center border-2 border-dark-400">
                          <Stethoscope className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-20-bold text-white mb-1">
                            {appointment.doctor.name}
                          </h3>
                          <p className="text-14-regular text-green-400 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            {appointment.doctor.specialty}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <div className="bg-dark-500/30 rounded-lg px-3 py-2 inline-block">
                          <p className="text-12-regular text-dark-600">
                            Reason:{" "}
                            <span className="text-white">
                              {appointment.reason}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      {getStatusBadge(appointment.status)}

                      {appointment.status !== "cancelled" && (
                        <div className="flex gap-3">
                          {appointment.status === "pending" && (
                            <button className="text-14-medium text-green-400 hover:text-green-300 transition-colors px-4 py-2 border border-green-500/30 hover:border-green-500/50 rounded-lg bg-green-500/10 hover:bg-green-500/20">
                              Reschedule
                            </button>
                          )}
                          <button
                            onClick={() => handleCancelClick(appointment)}
                            className="text-14-medium text-red-400 hover:text-red-300 transition-colors px-4 py-2 border border-red-500/30 hover:border-red-500/50 rounded-lg bg-red-500/10 hover:bg-red-500/20"
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

            {appointments.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                  <Calendar className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-24-bold text-white mb-4">
                  No appointments yet
                </h3>
                <p className="text-16-regular text-dark-700 mb-8 max-w-md mx-auto">
                  Start your health journey by booking your first appointment
                  with our expert healthcare providers
                </p>
                <button
                  onClick={onBookAppointment}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                >
                  Book Your First Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancel={handleCancel}
        appointment={selectedAppointment}
      />
    </>
  );
};

export default PatientDashboard;
