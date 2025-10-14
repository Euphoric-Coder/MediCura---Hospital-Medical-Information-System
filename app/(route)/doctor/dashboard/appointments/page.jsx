"use client";

import DoctorAppointments from "@/components/Doctor/DoctorAppointments";
import { useDoctor } from "@/contexts/DoctorContext";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const { doctorData } = useDoctor();

  return (
    <DoctorAppointments onBack={() => router.back()} doctorData={doctorData} />
  );
};

export default page;
