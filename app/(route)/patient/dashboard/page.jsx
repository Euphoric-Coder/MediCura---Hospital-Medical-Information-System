"use client";

import PatientDashboard from "@/components/Patient/PatientDashboard";
import { usePatient } from "@/contexts/PatientContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { patientData } = usePatient();
  const router = useRouter();

  return (
    <PatientDashboard
      onBookAppointment={() => router.push("/patient/dashboard/appointments")}
      patientData={patientData}
    />
  );
}
