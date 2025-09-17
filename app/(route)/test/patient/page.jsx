"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PatientDashboard from "@/components/Patient/PatientDashboard";
import OnboardingRedirect from "@/components/Onboarding/OnboardingRedirect";
import PatientDashboardWithSidebar from "@/components/Patient/PatientDashboardWithSidebar";

export default function PatientPage() {
  // const { data: session, status } = useSession();
  // const user = session?.user;
  // const [onboardingStatus, setOnboardingStatus] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!user?.email) {
  //     setLoading(false);
  //     return;
  //   }

  //   const checkOnboarding = async () => {
  //     try {
  //       const res = await fetch("/api/onboarding-check", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email: user.email }),
  //       });

  //       const data = await res.json();
  //       setOnboardingStatus(data?.hasOnboarded);
  //     } catch (err) {
  //       console.error("Error checking onboarding:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkOnboarding();
  // }, [user?.email]);

  // // 🟢 Extended Loading: wait until user.name and onboardingStatus are ready
  // if (
  //   status === "loading" ||
  //   loading ||
  //   !user?.email ||
  //   (status === "authenticated" && !user?.name)
  // ) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-white">
  //       Loading your account...
  //     </div>
  //   );
  // }

  // // 🔹 Case 2: User not logged in
  // if (status === "unauthenticated") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-white">
  //       Please sign in to continue.
  //     </div>
  //   );
  // }

  // // 🔹 Case 3: Authenticated but NOT onboarded
  // if (status === "authenticated" && !onboardingStatus) {
  //   return <OnboardingRedirect userType="patient" name={user.name} />;
  // }

  // 🔹 Case 4: Authenticated + onboarded
  // return <PatientDashboard email={user.email} name={user.name} />;
  return <PatientDashboardWithSidebar />
}
