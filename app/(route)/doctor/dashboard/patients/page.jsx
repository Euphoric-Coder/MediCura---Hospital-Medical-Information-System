"use client";

import { useDoctor } from "@/contexts/DoctorContext";
import React from "react";

const page = () => {
  const { doctorData } = useDoctor();

  return <div>page</div>;
};

export default page;
