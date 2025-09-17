"use client";

import { useEffect, useState } from "react";
import PatientDashboard from "@/components/Patient/PatientDashboard";
import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import PatientDashboardWithSidebar from "@/components/Patient/PatientDashboardWithSidebar";
import { useSession, signOut } from "next-auth/react";
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
  const [userData, setUserData] = useState([]);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const CheckOnboardingStatus = async () => {
      if (!userId) return;
      console.log("user id:", userId);
      const data = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail));
      console.log(data[0].role);

      if (data.length > 0) {
        const patient = await db
          .select()
          .from(Patients)
          .where(eq(Patients.userId, userId));

        console.log(patient);
      }
    };
    CheckOnboardingStatus();
    // Simulate loading delay
    // setTimeout(() => {
    //   setLoading(false);
    // }, 1000);
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your account...
      </div>
      // <OnboardingRedirect userType="patient" name={"Sagnik Dey"} />
    );
  }
  return <PatientDashboardWithSidebar />;
}
