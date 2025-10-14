import React from "react";
import {
  Home,
  Calendar,
  Users,
  FileText,
  Pill,
  TestTube,
  Bed,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Stethoscope,
  Activity,
  Heart,
  Menu,
  X,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const DoctorSidebar = ({
  currentPage,
  onNavigate,
  isOpen = true,
  onToggle,
  doctorData,
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/doctor/dashboard",
      description: "Overview & Today’s Schedule",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      href: "/doctor/dashboard/appointments",
      description: "Weekly Schedule & Availability",
    },
    {
      id: "patients",
      label: "My Patients",
      icon: Users,
      href: "/doctor/dashboard/patients",
      description: "Patient List & Records",
    },
    {
      id: "consultations",
      label: "Consultations",
      icon: FileText,
      href: "/doctor/dashboard/consultations",
      description: "Write Notes & Prescriptions",
    },
    // {
    //   id: "availability",
    //   label: "Availability",
    //   icon: Clock,
    //   href: "/doctor/dashboard/availability",
    //   description: "Set Consultation Hours",
    // },
    // {
    //   id: "consultation-fee",
    //   label: "Consultation Fee",
    //   icon: DollarSign,
    //   href: "/doctor/dashboard/consultation-fee",
    //   description: "Update Pricing",
    // },
  ];

  const quickActions = [
    {
      id: "emergency-patients",
      label: "Emergency Patients",
      icon: Heart,
      color: "bg-red-500",
      description: "Critical Patient Alerts",
    },
    {
      id: "availability",
      label: "Set Availability",
      icon: Clock,
      color: "bg-blue-500",
      description: "Manage Schedule",
    },
    {
      id: "consultation-fee",
      label: "Consultation Fee",
      icon: DollarSign,
      color: "bg-green-500",
      description: "Update Pricing",
    },
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    // Close sidebar on mobile after navigation
    if (onToggle && window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-80 lg:w-80 xl:w-96 
        h-screen bg-gradient-to-b from-dark-200 to-dark-300 
        border-r border-dark-500/50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 p-2 rounded-xl bg-dark-400/50 hover:bg-dark-400/70 transition-colors lg:hidden z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-dark-500/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-16-bold lg:text-20-bold text-white">
                Doctor Portal
              </h2>
              <p className="text-10-regular lg:text-12-regular text-dark-700">
                Medical Practice Dashboard
              </p>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-14-semibold lg:text-16-semibold text-white">
                  {doctorData.name}
                </h3>
                <p className="text-10-regular lg:text-12-regular text-green-400">
                  {doctorData.speciality}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          <div className="space-y-2">
            <div className="text-10-semibold lg:text-12-semibold text-dark-600 uppercase tracking-wider px-3 py-2">
              Main Menu
            </div>

            {menuItems.map((item) => (
              <Link
                href={`${item.href}`}
                key={item.id}
                className={`w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all duration-300 group ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                    : "text-dark-700 hover:bg-dark-400/50 hover:text-white"
                }`}
                onClick={() => onToggle()}
              >
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    currentPage === item.id
                      ? "bg-white/20"
                      : "bg-dark-400/50 group-hover:bg-dark-400/70"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${
                      currentPage === item.id
                        ? "text-white"
                        : "text-dark-600 group-hover:text-white"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`text-12-semibold lg:text-14-semibold ${
                      currentPage === item.id
                        ? "text-white"
                        : "group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-10-regular lg:text-12-regular hidden sm:block ${
                      currentPage === item.id
                        ? "text-white/70"
                        : "text-dark-600 group-hover:text-dark-600"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* TODO: Add Quick Actions */}
          {/* Quick Actions */}
          {/* <div className="mt-8 space-y-2">
            <div className="text-10-semibold lg:text-12-semibold text-dark-600 uppercase tracking-wider px-3 py-2">
              Quick Actions
            </div>

            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleNavigate(action.id)}
                className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all duration-300 group text-dark-700 hover:bg-dark-400/50 hover:text-white"
              >
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 ${action.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <action.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-12-semibold lg:text-14-semibold group-hover:text-white">
                    {action.label}
                  </div>
                  <div className="text-10-regular lg:text-12-regular text-dark-600 group-hover:text-dark-600 hidden sm:block">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div> */}
        </div>

        {/* Footer Actions */}
        <div className="p-3 lg:p-4 border-t border-dark-500/50 space-y-2">
          <button
            onClick={() => handleNavigate("settings")}
            className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all duration-300 group text-dark-700 hover:bg-dark-400/50 hover:text-white"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-dark-400/50 rounded-xl flex items-center justify-center group-hover:bg-dark-400/70 transition-all duration-300">
              <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-dark-600 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="text-12-semibold lg:text-14-semibold group-hover:text-white">
                Settings
              </div>
              <div className="text-10-regular lg:text-12-regular text-dark-600 group-hover:text-dark-600 hidden sm:block">
                Practice Preferences
              </div>
            </div>
          </button>

          <button
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: "/sign-in",
              })
            }
            className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all duration-300 group text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-300">
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 group-hover:text-red-300" />
            </div>
            <div className="flex-1">
              <div className="text-12-semibold lg:text-14-semibold">
                Sign Out
              </div>
              <div className="text-10-regular lg:text-12-regular text-red-400/70 hidden sm:block">
                Exit Doctor Portal
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
