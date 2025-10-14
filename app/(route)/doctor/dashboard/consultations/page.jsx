"use client";

import { useDoctor } from "@/contexts/DoctorContext";
import React from "react";

const page = () => {
  const { doctorData } = useDoctor();
  console.log("Doctor Data in Page:", doctorData);

  return <div>page</div>;
};

export default page;
