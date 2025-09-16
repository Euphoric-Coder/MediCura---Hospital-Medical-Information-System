import React, { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminStaffManagement from "./AdminStaffManagement";
import AdminPatientOversight from "./AdminPatientOversight";
import AdminInventoryTracking from "./AdminInventoryTracking";
import AdminBillingFinance from "./AdminBillingFinance";
import AdminReportsAnalytics from "./AdminReportsAnalytics";

const AdminDashboardWithSidebar = ({
  onLogout,
}) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard onLogout={onLogout} />;
      case "staff-management":
        return (
          <AdminStaffManagement onBack={() => setCurrentPage("dashboard")} />
        );
      case "patient-oversight":
        return (
          <AdminPatientOversight onBack={() => setCurrentPage("dashboard")} />
        );
      case "inventory-tracking":
        return (
          <AdminInventoryTracking onBack={() => setCurrentPage("dashboard")} />
        );
      case "billing-finance":
        return (
          <AdminBillingFinance onBack={() => setCurrentPage("dashboard")} />
        );
      case "reports-analytics":
        return (
          <AdminReportsAnalytics onBack={() => setCurrentPage("dashboard")} />
        );
      case "user-management":
        return (
          <AdminStaffManagement onBack={() => setCurrentPage("dashboard")} />
        );
      case "emergency-alerts":
        return <AdminDashboard onLogout={onLogout} />;
      case "staff-requests":
        return (
          <AdminStaffManagement onBack={() => setCurrentPage("dashboard")} />
        );
      case "system-health":
        return (
          <AdminReportsAnalytics onBack={() => setCurrentPage("dashboard")} />
        );
      case "settings":
        return <AdminDashboard onLogout={onLogout} />;
      default:
        return <AdminDashboard onLogout={onLogout} />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-300">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-dark-400/80 backdrop-blur-sm border border-dark-500/50 text-white hover:bg-dark-400 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 overflow-auto">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default AdminDashboardWithSidebar;
