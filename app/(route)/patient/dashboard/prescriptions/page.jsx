"use client";

import { usePatient } from "@/contexts/PatientContext";
import PatientConsultation from "@/components/Patient/PatientConsultation";

export default function PrescriptionsPage() {
  const { patientData } = usePatient();

  return <PatientConsultation patientData={patientData} />;
}
