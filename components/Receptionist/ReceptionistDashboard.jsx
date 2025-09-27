import React, { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  User,
  Phone,
  Calendar,
  AlertTriangle,
  Search,
  Edit,
  X,
  CircleX,
  RefreshCcw,
  Headphones,
  Bell,
} from "lucide-react";
import { db } from "@/lib/dbConfig";
import { Appointments, Doctors, Patients } from "@/lib/schema";
import { and, eq, notInArray } from "drizzle-orm";
import { toast } from "sonner";
import { Button } from "../ui/button";

const ReceptionistDashboard = ({ onBack }) => {
  const [patients, setPatients] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetches patients + appointments + doctors
  const fetchAppointments = async () => {
    try {
      // Get current date in IST, formatted as yyyy-mm-dd
      const todayIST = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      const data = await db
        .select({
          id: Appointments.id,
          workflow: Appointments.workflow,
          type: Appointments.type,
          reason: Appointments.notes,
          appointmentTime: Appointments.time,
          arrivalTime: Appointments.arrivalTime,
          patientName: Patients.name,
          patientPhone: Patients.phone,
          patientAvatar: Patients.avatar,
          doctorName: Doctors.name,
        })
        .from(Appointments)
        .leftJoin(Patients, eq(Appointments.patientId, Patients.userId))
        .leftJoin(Doctors, eq(Appointments.doctorId, Doctors.userId))
        .where(
          and(
            eq(Appointments.date, todayIST),
            notInArray(Appointments.status, ["cancelled", "no-show"]),
            notInArray(Appointments.workflow, ["cancelled", "no-show"])
          )
        );

      const mapped = data.map((row) => ({
        id: row.id,
        name: row.patientName,
        phone: row.patientPhone,
        avatar: row.patientAvatar,
        doctor: row.doctorName,
        type: row.type,
        reason: row.reason,
        appointmentTime: row.appointmentTime,
        arrivalTime: row.arrivalTime?.toUpperCase(), // can later update dynamically
        status: row.workflow, // 👈 status comes from workflow
      }));

      console.log(mapped);

      setPatients(mapped);

      // setPatients(mapped);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const refreshAppointments = () => {
    fetchAppointments();
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (appointmentId, newStatus, name) => {
    const loading = toast.loading("Updating status...");

    await db
      .update(Appointments)
      .set({ workflow: newStatus })
      .where(eq(Appointments.id, appointmentId));

    console.log("Appointment ID:", appointmentId);
    console.log("New Status:", newStatus);
    let statusMessage = "";

    switch (newStatus) {
      case "arrived":
        statusMessage = `${name} marked as arrived`;
        break;
      case "checked-in":
        statusMessage = `${name} checked in successfully`;
        break;
      case "in-consultation":
        statusMessage = `${name} sent to consultation`;
        break;
      case "completed":
        statusMessage = `${name} consultation completed`;
        break;
    }

    toast.dismiss(loading);

    refreshAppointments();

    toast.success(statusMessage);
    setMessage(statusMessage);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const getStatusBadge = (status, waitTime) => {
    const isLongWait = waitTime && waitTime > 30;

    switch (status) {
      case "scheduled":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span className="text-10-medium sm:text-12-medium text-cyan-400">
              Scheduled
            </span>
          </div>
        );
      case "waiting":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">
              Waiting
            </span>
          </div>
        );
      case "arrived":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium">Arrived</span>
          </div>
        );
      case "checked-in":
        return (
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse bg-green-500`}
            ></div>
            <span className={`text-10-medium sm:text-12-medium text-green-400`}>
              Checked In
            </span>
          </div>
        );
      case "in-consultation":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-purple-400">
              In Consultation
            </span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-400">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium">Completed</span>
          </div>
        );
      case "no-show":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <CircleX className="w-3 h-3 text-red-400" />
            <span className="text-10-medium sm:text-12-medium text-red-400">
              No Show
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButton = (patient) => {
    switch (patient.status) {
      case "scheduled":
        return (
          <button
            onClick={() =>
              handleStatusUpdate(patient.id, "no-show", patient.name)
            }
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
          >
            Mark No Show
          </button>
        );
      case "waiting":
        return (
          <button
            onClick={() =>
              handleStatusUpdate(patient.id, "arrived", patient.name)
            }
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Mark Arrived
          </button>
        );
      case "arrived":
        return (
          <button
            onClick={() =>
              handleStatusUpdate(patient.id, "checked-in", patient.name)
            }
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            Check In
          </button>
        );
      case "checked-in":
        return (
          <button
            onClick={() =>
              handleStatusUpdate(patient.id, "in-consultation", patient.name)
            }
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Send to Doctor
          </button>
        );
      case "in-consultation":
        return (
          <div className="text-12-medium lg:text-14-medium text-purple-400 px-3 lg:px-4 py-2">
            With Doctor
          </div>
        );
      case "completed":
        return (
          <div className="text-12-medium lg:text-14-medium text-gray-400 px-3 lg:px-4 py-2">
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  const waitingCount = patients.filter((p) => p.status === "waiting").length;
  const arrivedCount = patients.filter((p) => p.status === "arrived").length;
  const checkedInCount = patients.filter(
    (p) => p.status === "checked-in"
  ).length;
  const inConsultationCount = patients.filter(
    (p) => p.status === "in-consultation"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-24-bold lg:text-36-bold text-white">
                Good morning, Emily
              </h1>
              <p className="text-14-regular lg:text-16-regular text-dark-700">
                Ready to assist patients today
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="relative p-2 lg:p-3 rounded-xl bg-dark-400/50 backdrop-blur-sm border border-dark-500/50 hover:bg-dark-400/70 transition-all duration-300">
              <Bell className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
            <div className="bg-dark-400/50 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-xl border border-dark-500/50">
              <span className="text-12-medium lg:text-14-medium text-white">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
              </span>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
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

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {arrivedCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-blue-400">
                  Arrived
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {checkedInCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-green-400">
                  Checked In
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
                  {inConsultationCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-purple-400">
                  In Consultation
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
                placeholder="Search patients..."
                className="shad-input pl-10 w-full text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="shad-select-trigger text-white w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="arrived">Arrived</option>
              <option value="checked-in">Checked In</option>
              <option value="in-consultation">In Consultation</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Patient Check-In List */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Patient Check-Ins
              </h2>
            </div>
            <div>
              <Button onClick={() => refreshAppointments()} className="btn2">
                <RefreshCcw /> Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
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
                          {patient.name}
                        </h3>
                        {getStatusBadge(patient.status, patient.waitTime)}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>Appointment: {patient.appointmentTime}</span>
                        </div>
                        {patient.arrivalTime && (
                          <div>
                            <span className="text-white">Arrived:</span>{" "}
                            {patient.arrivalTime}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                        <div>
                          <span className="text-white">Doctor:</span>{" "}
                          {patient.doctor}
                        </div>
                        <div>
                          <span className="text-white">Type:</span>{" "}
                          {patient.type}
                        </div>
                      </div>

                      <div className="bg-purple-500/20 rounded-lg px-3 py-2">
                        <p className="text-10-regular lg:text-12-regular text-purple-400">
                          <span className="text-white">Reason:</span>{" "}
                          {patient.reason}
                        </p>
                      </div>

                      {/* Todo: add insurance verification */}
                      {/* <div className="flex items-center gap-4">
                        {patient.isNewPatient && (
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-10-medium text-blue-400">
                            New Patient
                          </span>
                        )}
                        {!patient.insuranceVerified && (
                          <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium text-red-400">
                            Insurance Pending
                          </span>
                        )}
                      </div> */}
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
                    {getActionButton(patient)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 lg:py-20">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                <CheckCircle className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                No patients found
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                No patients match your search criteria or all patients have been
                processed.
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
  );
};

export default ReceptionistDashboard;
