import React, { useState } from "react";
import PharmacistSidebar from "./PharmacistSidebar";
import PharmacistDashboard from "./PharmacistDashboard";
import PharmacistPrescriptions from "./PharmacistPrescriptions";
import PharmacistInventory from "./PharmacistInventory";
import PharmacistBilling from "./PharmacistBilling";
import PharmacistPatients from "./PharmacistPatients";
import PharmacistReports from "./PharmacistReports";
import PharmacistDrugInteractions from "./PharmacistDrugInteractions";
import { Plus, Menu } from "lucide-react";

const PharmacistDashboardWithSidebar = ({ onLogout }) => {
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
        return <PharmacistDashboard onLogout={onLogout} />;
      case "prescriptions":
        return (
          <PharmacistPrescriptions onBack={() => setCurrentPage("dashboard")} />
        );
      case "inventory":
        return (
          <PharmacistInventory onBack={() => setCurrentPage("dashboard")} />
        );
      case "billing":
        return <PharmacistBilling onBack={() => setCurrentPage("dashboard")} />;
      case "patients":
        return (
          <PharmacistPatients onBack={() => setCurrentPage("dashboard")} />
        );
      case "reports":
        return <PharmacistReports onBack={() => setCurrentPage("dashboard")} />;
      case "drug-interactions":
        return (
          <PharmacistDrugInteractions
            onBack={() => setCurrentPage("dashboard")}
          />
        );
      case "urgent-prescriptions":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-red-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-red-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Urgent Prescriptions
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Priority prescriptions requiring immediate attention will be
                displayed here.
              </p>
            </div>
          </div>
        );
      case "low-stock":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-yellow-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-yellow-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Low Stock Alerts
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Medications running low on stock will be displayed here with
                reorder suggestions.
              </p>
            </div>
          </div>
        );
      case "daily-sales":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Daily Sales Report
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Today's sales summary and revenue breakdown will be displayed
                here.
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
                Pharmacy preferences and system settings will be available here.
              </p>
            </div>
          </div>
        );
      default:
        return <PharmacistDashboard onLogout={onLogout} />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-300">
      {/* Sidebar */}
      <PharmacistSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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

export default PharmacistDashboardWithSidebar;
