import React, { useState } from "react";
import PatientSidebar from "./PatientSidebar";
import PatientDashboard from "./PatientDashboard";
import PatientProfile from "./PatientProfile";
import BillingHistory from "./BillingHistory";
import { Plus } from "lucide-react";
import PatientBookAppointment from "./PatientBookAppointment";

const PatientDashboardWithSidebar = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleGoToProfile = () => {
    setCurrentPage("profile");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <PatientDashboard
            onLogout={onLogout}
            onGoToProfile={handleGoToProfile}
          />
        );
      case "profile":
        return <PatientProfile onBack={() => setCurrentPage("dashboard")} />;
      case "billing":
        return <BillingHistory onBack={() => setCurrentPage("dashboard")} />;
      case "appointments":
        return <PatientBookAppointment />;
      case "prescriptions":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
                <Plus className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Prescriptions Coming Soon
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Your prescription management interface will be available here
                soon.
              </p>
            </div>
          </div>
        );
      case "lab-results":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <Plus className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Lab Results Coming Soon
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Your lab results and diagnostic reports will be displayed here.
              </p>
            </div>
          </div>
        );
      case "medical-records":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <Plus className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Medical Records Coming Soon
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Your complete medical history and documents will be available
                here.
              </p>
            </div>
          </div>
        );
      case "emergency":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                <Plus className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Emergency Services
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto mb-8">
                In case of emergency, call 911 immediately or contact your
                healthcare provider.
              </p>
              <div className="space-y-4">
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                  Call 911
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                  Contact Primary Care
                </button>
              </div>
            </div>
          </div>
        );
      case "health-tips":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-pink-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-pink-500/20">
                <Plus className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Health Tips Coming Soon
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Personalized health tips and wellness recommendations will be
                available here.
              </p>
            </div>
          </div>
        );
      case "vitals":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <Plus className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Vitals Tracking Coming Soon
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Track your blood pressure, heart rate, weight, and other vital
                signs here.
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-500/20">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">
                Settings Coming Soon
              </h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                App preferences, notification settings, and privacy controls
                will be available here.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <PatientDashboard
            onLogout={onLogout}
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
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderCurrentPage()}</div>
    </div>
  );
};

export default PatientDashboardWithSidebar;
