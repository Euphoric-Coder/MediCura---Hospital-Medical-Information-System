"use client";

import PatientDashboard from "@/components/Patient/PatientDashboard";

export default function DashboardPage() {
  // Since layout already does role/auth/onboarding checks,
  // this page only needs to show the actual dashboard.
  return <PatientDashboard />;
}
