"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, Plus, ArrowRight, ShieldAlert } from "lucide-react";

import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import LoginRedirect from "@/components/Onboarding/LoginRedirect";
import DoctorSidebar from "@/components/Doctor/DoctorSidebar";
import { DoctorProvider } from "@/contexts/DoctorContext";
import { ModeToggle } from "@/components/ThemeButton";

import { getDoctorData, getUserRole } from "@/lib/doctors/onboarding";

export default function DoctorDashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userName = session?.user?.name;
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const refreshDoctorData = useCallback(async () => {
    if (!userId || !userEmail) return;

    try {
      const data = await getUserRole(userEmail);

      if (data.length > 0) {
        setRole(data[0].role);

        const doctor = await getDoctorData(userId);

        if (doctor.length > 0) {
          setDoctorData(doctor[0]);
          setOnboardingStatus(doctor[0].hasOnboarded);
        } else {
          setOnboardingStatus(false);
        }
      }
    } catch (error) {
      console.error("Error refreshing doctor data:", error);
    }
  }, [userId, userEmail]);

  // Initial load
  useEffect(() => {
    if (status === "authenticated") {
      refreshDoctorData().finally(() => setLoading(false));
    }

    const timer = setTimeout(() => {
      if (status === "unauthenticated") setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [status, refreshDoctorData]);

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-[#0a0f1c] transition-colors">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-slate-800 dark:text-white text-18-bold">
            Loading your setup...
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Not logged in
  if (status === "unauthenticated") return <LoginRedirect />;

  // 🔹 Must onboard first
  if (onboardingStatus === false)
    return <OnboardingRedirect userType={role} name={userName} />;

  // 🔹 Wrong role
  if (role !== "doctor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-dark-300 dark:via-dark-200 dark:to-dark-400 p-6 transition-colors">
        <div className="bg-white border border-red-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg dark:bg-dark-400/70 dark:border-red-500/30">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-red-100 border border-red-200 dark:bg-red-500/20 dark:border-red-500/30">
              <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h2 className="text-gray-900 dark:text-white mb-4">Access Denied</h2>

          <p className="text-gray-600 dark:text-dark-600 text-16-regular mb-6">
            Hello{" "}
            <span className="text-gray-900 dark:text-white">
              {userName || "User"}
            </span>
            , you don’t have access to the Doctor Dashboard. Please proceed to
            your{" "}
            <span className="text-green-600 dark:text-green-400">{role}</span>{" "}
            dashboard.
          </p>

          <button
            onClick={() => router.push(`/${role}/dashboard`)}
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-green-500/25 dark:bg-gradient-to-r dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700"
          >
            Go to {role} Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <DoctorProvider value={{ doctorData, role, userName, refreshDoctorData }}>
      <div className="flex h-screen bg-slate-50/50 dark:bg-[#0a0f1c]">
        {/* Sidebar */}
        <DoctorSidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          doctorData={doctorData}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative custom-scrollbar">
          {/* Mobile Header */}
          <div className="xl:hidden bg-white/70 dark:bg-[#0a0f1c]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-30 transition-colors">
            <div className="flex items-center justify-between px-5 py-3.5">
              <button
                onClick={toggleSidebar}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-900 dark:text-white text-16-bold tracking-tight">
                  MediCura
                </span>
              </div>

              <div className="w-10">
                <ModeToggle />
              </div>
            </div>
          </div>

          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </DoctorProvider>
  );
}
