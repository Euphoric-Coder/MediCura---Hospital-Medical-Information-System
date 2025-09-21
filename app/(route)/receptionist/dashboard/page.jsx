"use client";

import { useEffect, useState } from "react";
import PatientDashboardWithSidebar from "@/components/Patient/PatientDashboardWithSidebar";
import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import { useSession } from "next-auth/react";
import { db } from "@/lib/dbConfig";
import { Receptionists, Users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import LoginRedirect from "@/components/Onboarding/LoginRedirect";
import PharmacistDashboardWithSidebar from "@/components/Pharmacist/PharmacistDashboardWithSidebar";
import ReceptionistDashboardWithSidebar from "@/components/Receptionist/ReceptionistDashboardWithSidebar";

export default function PatientPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Extract user details from session
  const userName = session?.user?.name;
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [receptionistData, setReceptionistData] = useState([]);
  const [onboardingStatus, setOnboardingStatus] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!userId || !userEmail) return;

      try {
        const data = await db
          .select()
          .from(Users)
          .where(eq(Users.email, userEmail));

        if (data.length > 0) {
          setRole(data[0].role);

          const receptionist = await db
            .select()
            .from(Receptionists)
            .where(eq(Receptionists.userId, userId));

          if (receptionist.length > 0) {
            console.log("Pharmacist data:", receptionist[0]);
            setReceptionistData(receptionist[0]);
            setOnboardingStatus(receptionist[0].hasOnboarded);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") checkOnboardingStatus();

    // Timeout fallback → after 4s stop loading if unauthenticated
    const timer = setTimeout(() => {
      if (status === "unauthenticated") {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userId, userEmail, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg animate-pulse">
            Loading Receptionist Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (onboardingStatus === false) {
    return <OnboardingRedirect userType={role} name={userName} />;
  }

  if (status === "unauthenticated") {
    return <LoginRedirect />;
  }

  if (role !== "receptionist") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 p-6">
        <div className="bg-dark-400/70 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <h2 className="text-24-bold text-white mb-4">Access Denied</h2>
          <p className="text-dark-600 text-16-regular mb-6">
            Hello <span className="text-white">{userName || "User"}</span>, you
            don’t have access to the Receptionist Dashboard. Please proceed to
            your <span className="text-green-400">{role}</span> dashboard.
          </p>
          <button
            onClick={() => router.push(`/${role}/dashboard`)}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            Go to {role} Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return <ReceptionistDashboardWithSidebar receptionistData={receptionistData} />;
}
