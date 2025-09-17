"use client";

import { useEffect, useState } from "react";
import PatientDashboardWithSidebar from "@/components/Patient/PatientDashboardWithSidebar";
import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import { useSession } from "next-auth/react";
import { db } from "@/lib/dbConfig";
import { Patients, Users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default function PatientPage() {
  const { data: session } = useSession();

  // Extract user details from session
  const userName = session?.user?.name;
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [patientData, setPatientData] = useState([]);
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

          const patient = await db
            .select()
            .from(Patients)
            .where(eq(Patients.userId, userId));

          if (patient.length > 0) {
            setPatientData(patient);
            setOnboardingStatus(patient[0].hasOnboarded);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [userId, userEmail]);

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

  if (onboardingStatus === false) {
    return <OnboardingRedirect userType={role} name={userName} />;
  }

  return <PatientDashboardWithSidebar />;
}
