"use client";

import AdminOnboarding from "@/components/Onboarding/AdministrationOnboarding";
import DoctorOnboarding from "@/components/Onboarding/DoctorOnboarding";
import PatientOnboarding from "@/components/Onboarding/PatientOnboarding";
import PharmacistOnboarding from "@/components/Onboarding/PharmacistOnboarding";
import ReceptionistOnboarding from "@/components/Onboarding/ReceptionistOnboarding";
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
      <DoctorOnboarding />
      <PharmacistOnboarding />
      <AdminOnboarding />
      <ReceptionistOnboarding />
    </div>
  );
};

export default page;
