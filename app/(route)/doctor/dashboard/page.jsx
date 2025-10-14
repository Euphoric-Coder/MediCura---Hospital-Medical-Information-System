"use client";

import DoctorDashboard from "@/components/Doctor/DoctorDashboard";
import { useDoctor } from "@/contexts/DoctorContext";
import { useRouter } from "next/navigation";

export default function DoctorDashboardPage() {
  const { doctorData } = useDoctor();
  const router = useRouter();

  return (
    <DoctorDashboard
      onViewAppointments={() => router.push("/doctor/dashboard/appointments")}
      doctorData={doctorData}
    />
  );
}
