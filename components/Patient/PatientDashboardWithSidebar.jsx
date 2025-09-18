"use client";
import React, { useState, useEffect } from "react";
import PatientSidebar from "./PatientSidebar";
import PatientDashboard from "./PatientDashboard";
import PatientProfile from "./PatientProfile";
import BillingHistory from "./BillingHistory";
import PatientBookAppointment from "./PatientBookAppointment";
import { Plus, Menu } from "lucide-react";
import PatientLabResults from "./PatientLabResults";
import PatientMedicalRecords from "./PatientMedicalRecords";
import PatientConsultation from "./PatientConsultation";
import PatientMedication from "./PatientMedication";

const PatientDashboardWithSidebar = ({ onBookAppointment, patientData }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleGoToProfile = () => {
    setCurrentPage("profile");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <PatientDashboard
            onBookAppointment={onBookAppointment}
            onGoToProfile={handleGoToProfile}
          />
        );
      case "profile":
        return <PatientProfile onBack={() => setCurrentPage("dashboard")} />;
      case "billing":
        return <BillingHistory onBack={() => setCurrentPage("dashboard")} />;
      case "appointments":
        return (
          <PatientBookAppointment
            onBack={() => setCurrentPage("dashboard")}
            patientData={patientData}
          />
        );
      case "prescriptions":
        return (
          <PatientConsultation
            patientData={patientData}
            onBack={() => setCurrentPage("dashboard")}
          />
        );
      case "medication":
        return <PatientMedication />;
      case "lab-results":
        return <PatientLabResults />;
      case "medical-records":
        return <PatientMedicalRecords />;
      // ... keep your existing emergency, health-tips, vitals, settings etc.
      default:
        return (
          <PatientDashboard
            onBookAppointment={onBookAppointment}
            onGoToProfile={handleGoToProfile}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-dark-300">
      {/* Sidebar */}
      <PatientSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex-1 overflow-hidden relative">
          {/* Mobile Header */}
          <div className="lg:hidden bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-dark-400/50 hover:bg-dark-400/70 transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span className="text-18-bold text-white">MediCura</span>
              </div>
              <div className="w-10"></div>
            </div>
          </div>

          <div className="h-full overflow-y-auto">{renderCurrentPage()}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardWithSidebar;
