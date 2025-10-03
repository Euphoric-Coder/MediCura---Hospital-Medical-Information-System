"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  NotebookTabs,
  User,
  Settings,
  LogOut,
  Heart,
  X,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { ModeToggle } from "../ThemeButton";

const PatientSidebar = ({ isOpen = true, onToggle }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const userName = session?.user?.name;
  const userId = session?.user?.id;

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/patient/dashboard",
      description: "Overview & Health Summary",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      href: "/patient/dashboard/appointments",
      description: "Book & Manage Appointments",
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: NotebookTabs,
      href: "/patient/dashboard/prescriptions",
      description: "Consultation Details",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/patient/dashboard/profile",
      description: "Personal Information",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 xl:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed xl:static inset-y-0 left-0 z-50 
          w-80 xl:w-96 
          h-screen bg-gradient-to-b from-white to-gray-100 
          dark:from-dark-200 dark:to-dark-300
          border-r border-gray-200 dark:border-dark-500/50 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 xl:p-6 border-b border-gray-200 dark:border-dark-500/50">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-16-bold xl:text-20-bold text-gray-900 dark:text-white">
                  Patient Portal
                </h2>
                <p className="text-10-regular xl:text-12-regular text-gray-500 dark:text-dark-700">
                  Your Health Dashboard
                </p>
              </div>
            </div>
            <ModeToggle />
          </div>

          {/* Patient Info */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-14-semibold xl:text-16-semibold text-gray-900 dark:text-white">
                  {userName}
                </h3>
                <p className="flex items-center gap-1 text-xs xl:text-sm text-green-600 dark:text-green-400">
                  Patient ID:
                  <span className="text-[9px] md:text-[11px]">{userId}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3 xl:p-4">
          <div className="space-y-2">
            <div className="text-10-semibold xl:text-12-semibold text-gray-500 dark:text-dark-600 uppercase tracking-wider px-3 py-2">
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
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                      : "text-gray-700 dark:text-dark-700 hover:bg-gray-200 dark:hover:bg-dark-400/50 hover:text-gray-900 dark:hover:text-white"
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
        </div>

        {/* Footer Actions */}
        <div className="p-3 xl:p-4 border-t border-gray-200 dark:border-dark-500/50 space-y-2">
          <Link
            href="/patient/dashboard/settings"
            onClick={onToggle}
            className="w-full flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-left transition-all duration-300 group text-gray-700 dark:text-dark-700 hover:bg-gray-200 dark:hover:bg-dark-400/50 hover:text-gray-900 dark:hover:text-white"
          >
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gray-200 dark:bg-dark-400/50 rounded-xl flex items-center justify-center group-hover:bg-gray-300 dark:group-hover:bg-dark-400/70 transition-all duration-300">
              <Settings className="w-4 h-4 xl:w-5 xl:h-5 text-gray-500 dark:text-dark-600 group-hover:text-gray-900 dark:group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="text-12-semibold xl:text-14-semibold group-hover:text-gray-900 dark:group-hover:text-white">
                Settings
              </div>
              <div className="text-10-regular xl:text-12-regular text-gray-500 dark:text-dark-600 hidden sm:block">
                App Preferences
              </div>
            </div>
          </Link>

          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/sign-in" })}
            className="w-full flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-2.5 xl:py-3 rounded-xl text-left transition-all duration-300 group text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
          >
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-all duration-300">
              <LogOut className="w-4 h-4 xl:w-5 xl:h-5 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300" />
            </div>
            <div className="flex-1">
              <div className="text-12-semibold xl:text-14-semibold">
                Sign Out
              </div>
              <div className="text-10-regular xl:text-12-regular text-red-500 dark:text-red-400/70 hidden sm:block">
                Exit Patient Portal
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientSidebar;
