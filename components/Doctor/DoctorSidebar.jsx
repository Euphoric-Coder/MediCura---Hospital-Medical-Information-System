import React from "react";
import {
  Home,
  Calendar,
  Users,
  FileText,
  Clock,
  DollarSign,
  Settings,
  LogOut,
  Stethoscope,
  Heart,
  X,
  User,
  Sparkles
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
      description: "Weekly Schedule",
    },
    {
      id: "patients",
      label: "My Patients",
      icon: Users,
      href: "/doctor/dashboard/patients",
      description: "Patient Records",
    },
    {
      id: "consultations",
      label: "Consultations",
      icon: FileText,
      href: "/doctor/dashboard/consultations",
      description: "Notes & Prescriptions",
    },
  ];

  const quickActions = [
    {
      id: "emergency-patients",
      label: "Emergency List",
      icon: Heart,
      color: "from-rose-500 to-red-600",
      shadow: "shadow-rose-500/20",
    },
    {
      id: "availability",
      label: "Availability",
      icon: Clock,
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20",
    },
    {
      id: "consultation-fee",
      label: "Update Fees",
      icon: DollarSign,
      color: "from-emerald-400 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
  ];

  const handleNavigate = (page) => {
    onNavigate(page);
    if (onToggle && typeof window !== "undefined" && window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-80 lg:w-80 xl:w-[22rem]
        h-screen
        bg-white/70 dark:bg-[#0a0f1c]/80 backdrop-blur-2xl
        border-r border-slate-200 dark:border-slate-800/60
        flex flex-col shadow-2xl lg:shadow-none
        transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Mobile Close Button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors lg:hidden z-50"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        )}

        {/* Header Area */}
        <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800/60 relative z-10">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-11-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Premium</span>
                </div>
                <h2 className="text-18-bold text-slate-900 dark:text-white leading-tight">
                  MediCura
                </h2>
              </div>
            </div>
            <ModeToggle />
          </div>

          {/* Doctor Info Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 backdrop-blur-md rounded-[1.25rem] p-4 border border-slate-200/80 dark:border-slate-700/50 group">
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white/40 dark:from-white/5 to-transparent skew-x-12 translate-x-10 group-hover:-translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-15-bold text-slate-900 dark:text-white truncate">
                  {doctorData?.name || "Dr. Safari"}
                </h3>
                <p className="text-12-medium text-blue-600 dark:text-blue-400 truncate mt-0.5">
                  {doctorData?.speciality || "Chief Medical Officer"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6 relative z-10 custom-scrollbar">
          
          {/* Main Links */}
          <div className="space-y-1.5 mb-8">
            <div className="px-3 mb-3">
              <span className="text-11-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Main Menu</span>
            </div>

            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onToggle}
                  className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-md shadow-blue-500/20"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {/* Subtle active state sweeping gradient */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  )}

                  <div
                    className={`relative z-10 w-10 h-10 rounded-[0.8rem] flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white/20 dark:bg-black/20 text-white shadow-inner"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:shadow-sm"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="relative z-10 flex-1">
                    <div
                      className={`text-14-bold transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div
                      className={`text-11-medium mt-0.5 hidden xl:block transition-colors ${
                        isActive
                          ? "text-blue-100 dark:text-blue-100/70"
                          : "text-slate-500 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400"
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
          <div className="space-y-2">
            <div className="px-3 mb-3">
              <span className="text-11-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Quick Actions</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleNavigate(action.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left bg-transparent border border-transparent hover:bg-white hover:border-slate-200 dark:hover:bg-slate-800/60 dark:hover:border-slate-700 transition-all duration-300 group hover:shadow-sm"
                >
                  <div
                    className={`w-9 h-9 rounded-[0.8rem] flex items-center justify-center bg-gradient-to-r opacity-90 group-hover:opacity-100 transition-all shadow-sm ${action.color} ${action.shadow}`}
                  >
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-14-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 lg:p-6 border-t border-slate-200 dark:border-slate-800/60 space-y-2 bg-slate-50/50 dark:bg-slate-900/30 relative z-10 rounded-br-3xl">
          <button
            onClick={() => handleNavigate("settings")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-300 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-[0.8rem] flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <div className="text-14-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Settings
              </div>
              <div className="text-11-medium hidden xl:block text-slate-500 dark:text-slate-500 mt-0.5">
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
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-300 group hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
          >
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-[0.8rem] flex items-center justify-center group-hover:bg-rose-500/10 dark:group-hover:bg-rose-500/20 transition-colors">
              <LogOut className="w-5 h-5 text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1">
              <div className="text-14-bold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Sign Out
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
