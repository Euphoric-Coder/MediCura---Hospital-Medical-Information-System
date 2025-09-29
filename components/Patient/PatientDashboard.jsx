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
} from "lucide-react";
import { db } from "@/lib/dbConfig";
import {
  Appointments,
  Consultations,
  Doctors,
  LabTests,
  Prescriptions,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Button } from "../ui/button";

const PatientDashboard = ({ onBookAppointment, patientData }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // console.log(patientData);

  const [appointments, setAppointments] = useState([]);
  const [futureAppt, setFutureAppt] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientData?.userId) return;

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("Patient Data: ", patientData);
      // Appointments
      const appts = await db
        .select({
          id: Appointments.id,
          date: Appointments.date,
          time: Appointments.time,
          type: Appointments.type,
          status: Appointments.status,
          doctorId: Appointments.doctorId,

          doctorName: Doctors.name,
          doctorSpeciality: Doctors.speciality,
          doctorAvatar: Doctors.avatar,
        })
        .from(Appointments)
        .innerJoin(Doctors, eq(Appointments.doctorId, Doctors.userId))
        .where(eq(Appointments.patientId, patientData.userId));

      // Current IST date/time
      const nowIST = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      // Keep only future appointments
      const futureAppts = appts
        .filter((appt) => new Date(appt.date) > nowIST)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setFutureAppt(futureAppts);

      console.log("Future Appointments: ", futureAppts);

      // console.log(appts);
      setAppointments(appts);

      // Prescriptions
      const prescriptions = await db
        .select({
          id: Prescriptions.id,
          medication: Prescriptions.medication,
          dosage: Prescriptions.dosage,
          frequency: Prescriptions.frequency,
          duration: Prescriptions.duration,
          status: Prescriptions.status,
          refills: Prescriptions.refillsRemaining,

          consultationId: Consultations.id,
          consultationDate: Consultations.createdAt,

          doctorId: Doctors.userId,
          doctorName: Doctors.name,
          doctorSpeciality: Doctors.speciality,

          appointmentId: Appointments.id,
          appointmentDate: Appointments.date,
          appointmentTime: Appointments.time,
          appointmentType: Appointments.type,
        })
        .from(Prescriptions)
        .innerJoin(
          Consultations,
          eq(Prescriptions.consultationId, Consultations.id)
        )
        .leftJoin(
          Appointments,
          eq(Consultations.appointmentId, Appointments.id)
        )
        .innerJoin(Doctors, eq(Consultations.doctorId, Doctors.userId))
        .where(eq(Consultations.patientId, patientData.userId));

      setPrescriptions(prescriptions.filter((p) => p.status === "active"));

      // Lab Results
      // const results = await db
      //   .select()
      //   .from(LabTests)
      //   .where(eq(LabTests.patientId, patientData.userId));
      // setLabs(results);

      // console.log("Dashboard data:", { appts, prescriptions });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchData();
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
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading your dashboard…
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
      "flex items-center gap-2 px-3 py-1 rounded-full text-12-medium";

    if (type === "appointment") {
      switch (status) {
        case "upcoming":
          return (
            <div
              className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}
            >
              <Calendar className="w-3 h-3" />
              <span className="text-blue-400">Upcoming</span>
            </div>
          );
        case "completed":
          return (
            <div
              className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
            >
              <Clock className="w-3 h-3" />
              <span className="text-green-400">Completed</span>
            </div>
          );
        case "cancelled":
          return (
            <div
              className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
            >
              <Clock className="w-3 h-3" />
              <span className="text-red-400">Cancelled</span>
            </div>
          );
      }
    }

    if (type === "prescription") {
      switch (status) {
        case "active":
          return (
            <div
              className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400">Active</span>
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
      }
    }

    if (type === "lab") {
      switch (status) {
        case "completed":
          return (
            <div
              className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
            >
              <TestTube className="w-3 h-3" />
              <span className="text-green-400">Completed</span>
            </div>
          );
        case "pending":
          return (
            <div
              className={`${baseClasses} bg-yellow-500/20 border border-yellow-500/30`}
            >
              <Clock className="w-3 h-3" />
              <span className="text-yellow-400">Pending</span>
            </div>
          );
        case "in-progress":
          return (
            <div
              className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}
            >
              <Activity className="w-3 h-3" />
              <span className="text-blue-400">In Progress</span>
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
    <div className="h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-24-bold lg:text-36-bold text-white">
                  Welcome back, {patientData.name}
                </h1>
                <p className="text-14-regular lg:text-16-regular text-dark-700">
                  Here's your health overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button className="relative p-2 rounded-xl bg-dark-400/50 backdrop-blur-sm border border-dark-500/50 hover:bg-dark-400/70 transition-all duration-300 hidden sm:block">
                <Bell className="w-5 h-5 text-white" />
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
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {upcomingAppt}
                </div>
                <div className="text-12-regular lg:text-14-regular text-blue-400">
                  Upcoming
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {activeMeds}
                </div>
                <div className="text-12-regular lg:text-14-regular text-purple-400">
                  Active Meds
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TestTube className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {labResultsCount}
                </div>
                <div className="text-12-regular lg:text-14-regular text-green-400">
                  Lab Results
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  98
                </div>
                <div className="text-12-regular lg:text-14-regular text-red-400">
                  Health Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-8">
          <div className="flex gap-1 lg:gap-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Heart },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "prescriptions", label: "Prescriptions", icon: Pill },
              { id: "lab-results", label: "Lab Results", icon: TestTube },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <Button className="btn3" onClick={() => refreshData()}>
            <RefreshCcw />
            Refresh Data
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Next Appointment */}
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-white">
                    Next Appointment
                  </h2>
                </div>

                {appointments.length > 0 ? (
                  <div className="bg-dark-400/50 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={appointments[0].doctorAvatar || ""}
                        alt={appointments[0].doctorName}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                      />
                      <div>
                        <h3 className="text-16-bold lg:text-18-bold text-white">
                          {appointments[0].doctorName}
                        </h3>
                        <p className="text-14-regular text-blue-400">
                          {appointments[0].doctorSpeciality}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6 text-14-regular text-dark-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>{appointments[0].date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>{appointments[0].time}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-12-regular text-dark-600">
                        Type:{" "}
                      </span>
                      <span className="text-white">{appointments[0].type}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-16-regular text-dark-700">
                      No upcoming appointments
                    </p>
                    <button
                      onClick={onBookAppointment}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 lg:px-6 py-2 rounded-lg text-12-medium lg:text-14-medium transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>

              {/* Health Summary */}
              <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-white">
                    Health Summary
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-dark-400/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-14-medium text-white">
                        Blood Pressure
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-green-400">
                        120/80
                      </span>
                    </div>
                    <div className="text-12-regular text-dark-600">
                      Normal range
                    </div>
                  </div>

                  <div className="bg-dark-400/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-14-medium text-white">
                        Heart Rate
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-blue-400">
                        72 bpm
                      </span>
                    </div>
                    <div className="text-12-regular text-dark-600">
                      Resting rate
                    </div>
                  </div>

                  <div className="bg-dark-400/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-14-medium text-white">BMI</span>
                      <span className="text-14-semibold lg:text-16-semibold text-yellow-400">
                        24.5
                      </span>
                    </div>
                    <div className="text-12-regular text-dark-600">
                      Normal weight
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-20-bold lg:text-24-bold text-white">
                    Your Appointments
                  </h2>
                </div>
                <button
                  onClick={onBookAppointment}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Book New</span>
                  <span className="sm:hidden">Book</span>
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <img
                          src={appointment.doctorAvatar}
                          alt={appointment.doctorName}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="text-16-bold lg:text-20-bold text-white mb-1">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-14-regular text-blue-400 mb-2">
                            {appointment.doctorSpeciality}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-14-regular text-dark-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-12-regular text-dark-600">
                              Type:{" "}
                            </span>
                            <span className="text-white">
                              {appointment.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
                        {getStatusBadge(appointment.status, "appointment")}
                        <div className="flex gap-2 flex-wrap">
                          <button className="text-12-medium lg:text-14-medium text-blue-400 hover:text-blue-300 px-3 lg:px-4 py-2 border border-blue-500/30 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                            Reschedule
                          </button>
                          <button className="text-12-medium lg:text-14-medium text-red-400 hover:text-red-300 px-3 lg:px-4 py-2 border border-red-500/30 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-20-bold lg:text-24-bold text-white">
                  Active Prescriptions
                </h2>
              </div>

              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                          <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-16-bold lg:text-20-bold text-white mb-1">
                            {prescription.medication}
                          </h3>
                          <p className="text-14-regular text-purple-400 mb-2">
                            {prescription.dosage} - {prescription.frequency}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-14-regular text-dark-700">
                            <div>
                              <span className="text-white">Prescribed by:</span>{" "}
                              {prescription.doctorName}
                            </div>
                            <div>
                              <span className="text-white">Date:</span>{" "}
                              {prescription.appointmentDate}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-12-regular text-dark-600">
                              Refills remaining:{" "}
                            </span>
                            <span className="text-white">
                              {prescription.refills}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
                        {getStatusBadge(prescription.status, "prescription")}
                        {prescription.refills > 0 && (
                          <button className="text-12-medium lg:text-14-medium text-green-400 hover:text-green-300 px-3 lg:px-4 py-2 border border-green-500/30 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors">
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
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <TestTube className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-20-bold lg:text-24-bold text-white">
                  Lab Results
                </h2>
              </div>

              <div className="space-y-4">
                {labResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                          <TestTube className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-16-bold lg:text-20-bold text-white mb-1">
                            {result.testName}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-14-regular text-dark-700 mb-2">
                            <div>
                              <span className="text-white">Date:</span>{" "}
                              {result.date}
                            </div>
                            <div>
                              <span className="text-white">Ordered by:</span>{" "}
                              {result.doctor}
                            </div>
                          </div>
                          {result.result && (
                            <div className="bg-green-500/20 rounded-lg px-3 py-2 inline-block">
                              <span className="text-12-regular text-green-400">
                                Result: {result.result} ({result.normalRange})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col items-start lg:items-end gap-3">
                        {getStatusBadge(result.status, "lab")}
                        {result.status === "completed" && (
                          <div className="flex gap-2">
                            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
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
    </div>
  );
};

export default PatientDashboard;
