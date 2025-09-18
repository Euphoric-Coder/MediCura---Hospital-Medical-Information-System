import React, { useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import DoctorDashboard from "./DoctorDashboard";
import DoctorAppointments from "./DoctorAppointments";
import DoctorPatients from "./DoctorPatients";
import DoctorConsultations from "./DoctorConsultations";
import DoctorPrescriptions from "./DoctorPrescriptions";
import DoctorLabOrders from "./DoctorLabOrders";
import DoctorAdmissions from "./DoctorAdmissions";
import DoctorReports from "./DoctorReports";
import DoctorAvailability from "./DoctorAvailability";
import DoctorConsultationFee from "./DoctorConsultationFee";
import { Plus, Menu } from "lucide-react";

const DoctorDashboardWithSidebar = ({ doctorData }) => {
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
        return <DoctorDashboard />;
      case "appointments":
        return (
          <DoctorAppointments
            onBack={() => setCurrentPage("dashboard")}
            doctorData={doctorData}
          />
        );
      case "patients":
        return <DoctorPatients onBack={() => setCurrentPage("dashboard")} />;
      case "consultations":
        return (
          <DoctorConsultations onBack={() => setCurrentPage("dashboard")} />
        );
      case "prescriptions":
        return (
          <DoctorPrescriptions onBack={() => setCurrentPage("dashboard")} />
        );
      case "lab-orders":
        return <DoctorLabOrders onBack={() => setCurrentPage("dashboard")} />;
      case "admissions":
        return <DoctorAdmissions onBack={() => setCurrentPage("dashboard")} />;
      case "reports":
        return <DoctorReports onBack={() => setCurrentPage("dashboard")} />;
      case "availability":
        return (
          <DoctorAvailability onBack={() => setCurrentPage("dashboard")} />
        );
      case "consultation-fee":
        return (
          <DoctorConsultationFee onBack={() => setCurrentPage("dashboard")} />
        );
      case "emergency-patients":
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-red-500/20">
                <Plus className="w-8 h-8 lg:w-12 lg:h-12 text-red-400" />
              </div>
              <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                Emergency Patients
              </h3>
              <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                Critical patient alerts and emergency cases will be displayed
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
                Practice preferences and account settings will be available
                here.
              </p>
            </div>
          </div>
        );
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-300">
      {/* Sidebar */}
      <DoctorSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        doctorData={doctorData}
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
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

export default DoctorDashboardWithSidebar;
