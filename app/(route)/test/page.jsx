"use client";

import HospitalInventory from "@/components/Admin/HospitalInventory";
import ReportsDashboard from "@/components/Admin/ReportsDashboard";
import UserManagement from "@/components/Admin/UserManagement";
import ConsultationForm from "@/components/Doctor/Consultation";
import PatientRecordViewer from "@/components/Doctor/PatientRecordViewer";
import VoiceToTextNote from "@/components/Doctor/VoiceToTextNote";
import PatientProfile from "@/components/Patient/PatientProfile";
import PatientDashboard from "@/components/Patient/PatientDashboard";
import InventoryManager from "@/components/Pharmacist/InventoryManager";
import PharmacyBilling from "@/components/Pharmacist/PharmacyBilling";
import PrescriptionList from "@/components/Pharmacist/PrescriptionList";
import AppointmentScheduler from "@/components/Receptionist/AppointmentScheduler";
import PatientCheckIn from "@/components/Receptionist/PatientCheckIn";
import PatientRegistration from "@/components/Receptionist/PatientRegistration";
import React from "react";
import BillingHistory from "@/components/Patient/BillingHistory";

const page = () => {
  return (
    <div>
      {/* <PatientProfile /> */}
      {/* <PatientRegistration /> */}
      {/* <AppointmentScheduler /> */}
      {/* <PatientCheckIn /> */}
      {/* <PatientRecordViewer /> */}
      {/* <ConsultationForm /> */}
      {/* <VoiceToTextNote /> */}
      {/* <PrescriptionList /> */}
      {/* <InventoryManager /> */}
      {/* <UserManagement /> */}
      {/* <HospitalInventory /> */}
      {/* <ReportsDashboard /> */}
      {/* <PatientDashboard /> */}
      <BillingHistory />
    </div>
  );
};

export default page;
