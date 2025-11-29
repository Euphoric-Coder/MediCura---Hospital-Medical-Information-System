"use client";

import DoctorPatients from "@/components/Doctor/DoctorPatients";
import { useDoctor } from "@/contexts/DoctorContext";
import React from "react";

const page = () => {
  const { doctorData } = useDoctor();

  return (
    <div>
      <DoctorPatients />
    </div>
  );
};

export default page;
