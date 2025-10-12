"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import LoginRedirect from "@/components/Onboarding/LoginRedirect";
import PatientSidebar from "@/components/Patient/PatientSidebar";
import { Menu, Plus, ArrowRight, ShieldAlert } from "lucide-react";
import { PatientProvider } from "@/contexts/PatientContext";
import { ModeToggle } from "@/components/ThemeButton";
import { getPatientData, getUserRole } from "@/lib/patients/onboarding";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userName = session?.user?.name;
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const refreshPatientData = useCallback(async () => {
    if (!userId || !userEmail) return;

    try {
      const data = await getUserRole(userEmail);

      if (data.length > 0) {
        setRole(data[0].role);

        const patient = await getPatientData(userId);

        if (patient.length > 0) {
          setPatientData(patient[0]);
          setOnboardingStatus(patient[0].hasOnboarded);
        } else {
          setOnboardingStatus(false);
        }
      }
    } catch (error) {
      console.error("Error refreshing patient data:", error);
    }
  }, [userId, userEmail]);

  // Initial load
  useEffect(() => {
    if (status === "authenticated") {
      refreshPatientData().finally(() => setLoading(false));
    }

    const timer = setTimeout(() => {
      if (status === "unauthenticated") setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [status, refreshPatientData]);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-300 transition-colors">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>

          {/* Text */}
          <p className="text-gray-800 dark:text-white text-lg">
            Loading Patient Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Redirect unauthenticated
  if (status === "unauthenticated") return <LoginRedirect />;

  // 🔹 Force onboarding first
  if (onboardingStatus === false)
    return <OnboardingRedirect userType={role} name={userName} />;

  // 🔹 Role mismatch
  if (role !== "patient") {
    return (
      <div
        className="min-h-screen flex items-center justify-center 
  bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 
  dark:from-dark-300 dark:via-dark-200 dark:to-dark-400 p-6 transition-colors"
      >
        <div
          className="bg-white border border-red-200 rounded-3xl p-8 max-w-md w-full text-center shadow-lg 
    dark:bg-dark-400/70 dark:border-red-500/30"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center 
        bg-red-100 border border-red-200 
        dark:bg-red-500/20 dark:border-red-500/30"
            >
              <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-gray-900 dark:text-white mb-4">Access Denied</h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-dark-600 text-16-regular mb-6">
            Hello{" "}
            <span className="text-gray-900 dark:text-white">
              {userName || "User"}
            </span>
            , you don’t have access to the Patient Dashboard. Please proceed to
            your{" "}
            <span className="text-green-600 dark:text-green-400">{role}</span>{" "}
            dashboard.
          </p>

          {/* Button */}
          <button
            onClick={() => router.push(`/${role}/dashboard`)}
            className="flex items-center justify-center gap-2 w-full 
        bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-green-500/25
        dark:bg-gradient-to-r dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700"
          >
            Go to {role} Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <PatientProvider
      value={{ patientData, role, userName, refreshPatientData }}
    >
      <div className="flex h-screen bg-white dark:bg-dark-300">
        {/* Sidebar */}
        <PatientSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative">
          {/* Mobile Header */}
          <div className="xl:hidden bg-white/80 dark:bg-dark-200/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-500/50 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Sidebar toggle */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-dark-600/50 dark:hover:bg-dark-400/70 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
              </button>

              {/* Logo */}
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center 
        bg-gradient-to-r from-green-300 to-green-400 
        dark:from-green-500 dark:to-green-600"
                >
                  <Plus className="w-4 h-4 text-green-800 dark:text-white" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  MediCura
                </span>
              </div>

              {/* Spacer */}
              <div className="w-10">
                <ModeToggle />
              </div>
            </div>
          </div>

          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </PatientProvider>
  );
}
