"use client";

import { usePatient } from "@/contexts/PatientContext";
import PatientBookAppointment from "@/components/Patient/PatientBookAppointment";

export default function AppointmentsPage() {
  const { patientData } = usePatient();

  return <PatientBookAppointment patientData={patientData} />;
}
