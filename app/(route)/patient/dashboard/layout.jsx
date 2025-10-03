"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/dbConfig";
import { Patients, Users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import LoginRedirect from "@/components/Onboarding/LoginRedirect";
import PatientSidebar from "@/components/Patient/PatientSidebar";
import { Menu, Plus, ArrowRight, ShieldAlert } from "lucide-react";
import { PatientProvider } from "@/contexts/PatientContext";

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
      const data = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail));

      if (data.length > 0) {
        setRole(data[0].role);

        const patient = await db
          .select()
          .from(Patients)
          .where(eq(Patients.userId, userId));

        if (patient.length > 0) {
          setPatientData(patient[0]);
          setOnboardingStatus(patient[0].hasOnboarded);
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
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading Patient Dashboard...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 p-6">
        <div className="bg-dark-400/70 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <h2 className="text-white mb-4">Access Denied</h2>
          <p className="text-dark-600 text-16-regular mb-6">
            Hello <span className="text-white">{userName || "User"}</span>, you
            don’t have access to the Patient Dashboard. Please proceed to your{" "}
            <span className="text-green-400">{role}</span> dashboard.
          </p>
          <button
            onClick={() => router.push(`/${role}/dashboard`)}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25"
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
      <div className="flex h-screen bg-dark-300">
        {/* Sidebar */}
        <PatientSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 overflow-auto relative">
          {/* Mobile Header */}
          <div className="xl:hidden bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-30">
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
                <span className="text-white">MediCura</span>
              </div>
              <div className="w-10"></div>
            </div>
          </div>

          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </PatientProvider>
  );
}
