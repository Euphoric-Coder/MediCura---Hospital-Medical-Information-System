"use client";

import OnboardingPage from "@/components/Onboarding/Onboarding";
import PatientOnboarding from "@/components/Onboarding/PatientOnboarding";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const onBack = () => {
    // Handle back action
    router.back();
  };
  const onComplete = () => {};

  return (
    <div>
      <PatientOnboarding
        email={user?.email}
        name={user?.name}
        onBack={onBack}
        onComplete={onComplete}
      />
    </div>
  );
};

export default page;
