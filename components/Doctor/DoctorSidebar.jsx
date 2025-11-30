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
import { ModeToggle } from "../ThemeButton";
import { usePathname } from "next/navigation";

const DoctorSidebar = ({
  currentPage,
  onNavigate,
  isOpen = true,
  onToggle,
  doctorData,
}) => {
  const pathname = usePathname();

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
    // If you want these menu items back as top-level instead of Quick Actions, just uncomment:
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
      color: "from-rose-500 to-rose-600",
      description: "Critical Patient Alerts",
    },
    {
      id: "availability",
      label: "Set Availability",
      icon: Clock,
      color: "from-sky-500 to-sky-600",
      description: "Manage Schedule",
    },
    {
      id: "consultation-fee",
      label: "Consultation Fee",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      description: "Update Pricing",
    },
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    // Close sidebar on mobile after navigation
    if (onToggle && typeof window !== "undefined" && window.innerWidth < 1024) {
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
        h-screen 
        bg-gradient-to-b from-slate-100 via-white to-slate-50 
        dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
        border-r border-slate-200 dark:border-slate-700 
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile Close Button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors lg:hidden z-10"
          >
            <X className="w-5 h-5 text-slate-700 dark:text-slate-100" />
          </button>
        )}

        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-16-bold lg:text-20-bold text-slate-900 dark:text-white">
                  Doctor Portal
                </h2>
                <p className="text-10-regular lg:text-12-regular text-slate-500 dark:text-slate-400">
                  Medical Practice Dashboard
                </p>
              </div>
            </div>
            <ModeToggle />
          </div>

          {/* Doctor Info */}
          <div className="bg-gradient-to-r from-emerald-50/80 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-sky-500 to-violet-600 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-14-semibold lg:text-16-semibold text-slate-900 dark:text-white">
                  {doctorData.name}
                </h3>
                <p className="text-10-regular lg:text-12-regular text-emerald-700 dark:text-emerald-400">
                  {doctorData.speciality}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          <div className="space-y-2">
            <div className="text-10-semibold lg:text-12-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
              Main Menu
            </div>

            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onToggle}
                  className={`w-full flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-left transition-all duration-300 group ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-green-600 dark:from-specialGreen-500 dark:to-specialGreen-600 text-white shadow-lg shadow-green-500/25"
                      : "text-gray-700 dark:text-dark-700 hover:bg-gray-200 dark:hover:bg-dark-500/50 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div
                    className={`w-8 h-8 xl:w-10 xl:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-200 dark:bg-dark-400/50 group-hover:bg-gray-300 dark:group-hover:bg-dark-400/70"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 xl:w-5 xl:h-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-500 dark:text-dark-600 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-12-semibold xl:text-14-semibold ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 dark:text-dark-700 group-hover:text-gray-900 dark:group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-10-regular xl:text-12-regular hidden sm:block ${
                        isActive
                          ? "text-white/70"
                          : "text-gray-500 dark:text-dark-600 group-hover:text-gray-700 dark:group-hover:text-dark-600"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <div className="text-10-semibold lg:text-12-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-2">
              Quick Actions
            </div>

            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleNavigate(action.id)}
                className="
                  w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 
                  rounded-xl text-left transition-all duration-300 group
                  text-slate-700 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800/70
                  hover:text-slate-900 dark:hover:text-white
                "
              >
                <div
                  className={`
                    w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shadow-lg
                    bg-gradient-to-r ${action.color}
                  `}
                >
                  <action.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-12-semibold lg:text-14-semibold group-hover:text-slate-900 dark:group-hover:text-white">
                    {action.label}
                  </div>
                  <div className="text-10-regular lg:text-12-regular text-slate-500 dark:text-slate-400 hidden sm:block">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 lg:p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            onClick={() => handleNavigate("settings")}
            className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all duration-300 group text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-all duration-300">
              <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="text-12-semibold lg:text-14-semibold group-hover:text-slate-900 dark:group-hover:text-white">
                Settings
              </div>
              <div className="text-10-regular lg:text-12-regular text-slate-500 dark:text-slate-400 hidden sm:block">
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
            className="w-full flex items-center gap-3 lg:gap-4 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-left transition-all duration-300 group text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60 transition-all duration-300">
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300" />
            </div>
            <div className="flex-1">
              <div className="text-12-semibold lg:text-14-semibold">
                Sign Out
              </div>
              <div className="text-10-regular lg:text-12-regular text-rose-500 dark:text-rose-400/70 hidden sm:block">
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
