import React, { useState } from "react";
import ReceptionistSidebar from "./ReceptionistSidebar";
import ReceptionistDashboard from "./ReceptionistDashboard";
import ReceptionistPatientRegistration from "./ReceptionistPatientRegistration";
import ReceptionistAppointments from "./ReceptionistAppointments";
import ReceptionistCheckIn from "./ReceptionistCheckIn";
import ReceptionistPatients from "./ReceptionistPatients";
import ReceptionistBilling from "./ReceptionistBilling";
import ReceptionistInsurance from "./ReceptionistInsurance";
import ReceptionistReports from "./ReceptionistReports";
import { Plus, Menu } from "lucide-react";

const ReceptionistDashboardWithSidebar = ({ receptionistData }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <ReceptionistDashboard />;
      case "patient-registration":
        return (
          <ReceptionistPatientRegistration
            onBack={() => setCurrentPage("dashboard")}
          />
        );
      case "appointments":
        return (
          <ReceptionistAppointments
            onBack={() => setCurrentPage("dashboard")}
          />
        );
      case "check-in":
        return (
          <ReceptionistCheckIn onBack={() => setCurrentPage("dashboard")} />
        );
      case "patients":
        return (
          <ReceptionistPatients onBack={() => setCurrentPage("dashboard")} />
        );
      case "billing":
        return (
          <ReceptionistBilling onBack={() => setCurrentPage("dashboard")} />
        );
      case "insurance":
        return (
          <ReceptionistInsurance onBack={() => setCurrentPage("dashboard")} />
        );
      case "reports":
        return (
          <ReceptionistReports onBack={() => setCurrentPage("dashboard")} />
        );
      case "emergency-calls":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-red-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-red-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Emergency Call Management
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Emergency call handling protocols and quick access to emergency
                contacts will be available here.
              </p>
            </div>
          </div>
        );
      case "waiting-patients":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-yellow-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-yellow-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Waiting Room Management
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Real-time waiting room status and patient queue management will
                be displayed here.
              </p>
            </div>
          </div>
        );
      case "daily-summary":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Daily Summary
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Comprehensive daily statistics and performance summary will be
                available here.
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-gray-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Settings
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Reception desk preferences and system settings will be available
                here.
              </p>
            </div>
          </div>
        );
      default:
        return <ReceptionistDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-300">
      {/* Sidebar */}
      <ReceptionistSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        receptionistData={receptionistData}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-dark-400/50 hover:bg-dark-400/70 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-18-bold text-white">MediCura</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <div className="h-full overflow-y-auto">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default ReceptionistDashboardWithSidebar;
