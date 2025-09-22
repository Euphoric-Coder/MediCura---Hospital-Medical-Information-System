import React, { useEffect, useState } from "react";
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
  Check,
  ChevronDown,
} from "lucide-react";
import { db } from "@/lib/dbConfig";
import { Patients } from "@/lib/schema";
import { Button } from "../ui/button";
import { set } from "date-fns";
import ReceptionistBookManageAppointment from "./ReceptionistBookManageAppointment";

const ReceptionistAppointments = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [allPatients, setAllPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllPatients();

    fetchIndividualPatientData();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const data = await db.select().from(Patients);
      console.log(data);
      setAllPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchIndividualPatientData = async (
    id = "f4e9e1a8-c823-422a-b8f3-103640a99943"
  ) => {
    try {
      // If all patients already fetched, just filter from state
      if (allPatients.length > 0) {
        const patient = allPatients.find((p) => p.userId === id);
        if (patient) {
          console.log(patient);
          setSelectedPatient(patient);
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
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

          {/* Appointments List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Book/Manage Appointments for{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
              </h2>
            </div>

            <Button onClick={() => setSelectedPatient(null)}>
              Clear Patient
            </Button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPatientDropdown(!showPatientDropdown)}
                className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-dark-600" />
                  {selectedPatient ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedPatient.avatar || "/default-avatar.png"}
                        alt={selectedPatient.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-white">{selectedPatient.name}</div>
                        <div className="text-12-regular text-dark-600">
                          {selectedPatient.occupation}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-dark-600">Select a patient</span>
                  )}
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-dark-600 transition-transform ${
                    showPatientDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Patient Dropdown */}
              {showPatientDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                  <div className="p-3 border-b border-dark-500">
                    <span className="text-14-medium text-dark-700">
                      Patients
                    </span>
                  </div>

                  {/* Search bar */}
                  <div className="p-3 border-b border-dark-500">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-600" />
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shad-input w-full pl-10 text-white bg-dark-300 border border-dark-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Patient list */}
                  <div className="max-h-60 overflow-y-auto">
                    {allPatients
                      .filter((p) =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((patient) => (
                        <button
                          key={patient.userId}
                          type="button"
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowPatientDropdown(false);
                            fetchIndividualPatientData(patient.userId);
                          }}
                          className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                        >
                          <img
                            src={patient.avatar || "/default-avatar.png"}
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-16-medium text-white">
                              {patient.name}
                            </div>
                            <div className="text-12-regular text-dark-600">
                              {patient.occupation}
                            </div>
                          </div>
                          {selectedPatient?.userId === patient.userId && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {selectedPatient && (
              <div className="mt-6 lg:mt-8">
                <ReceptionistBookManageAppointment
                  patientData={selectedPatient}
                  message={message}
                  setMessage={setMessage}
                  setMessageType={setMessageType}
                />
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
    </>
  );
};

export default ReceptionistAppointments;
