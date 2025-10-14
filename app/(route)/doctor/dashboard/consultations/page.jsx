"use client";

import DoctorConsultations from "@/components/Doctor/DoctorConsultations";
import { useDoctor } from "@/contexts/DoctorContext";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const { doctorData } = useDoctor();

  return (
    <DoctorConsultations onBack={() => router.back()} doctorData={doctorData} />
  );
};

export default page;
