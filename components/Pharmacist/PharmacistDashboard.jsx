import React, { useEffect, useState } from "react";
import {
  Plus,
  Pill,
  Package,
  Receipt,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Bell,
  User,
  Phone,
  Eye,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

const PatientDetailsModal = ({ patient }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Open modal whenever a new patient is passed
  useEffect(() => {
    if (patient) setIsOpen(true);
  }, [patient]);

  const closeModal = () => setIsOpen(false);

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-300 rounded-2xl p-6 w-full max-w-lg shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Patient Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-18-bold text-white">
              {patient.name}{" "}
              <span className="text-dark-600 text-12-regular">
                ({patient.id})
              </span>
            </h2>
            <p className="text-12-regular text-dark-600">
              DOB: {patient.dateOfBirth}
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <h3 className="text-14-bold text-white mb-2">Contact</h3>
          <p className="text-12-regular text-dark-600 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            {patient.phone || "N/A"}
          </p>
          <p className="text-12-regular text-dark-600">
            Address: {patient.address || "N/A"}
          </p>
        </div>

        {/* Prescription Info */}
        {patient.prescription && (
          <div>
            <h3 className="text-14-bold text-white mb-2">Prescription</h3>
            <p className="text-12-regular text-dark-600">
              Medication: {patient.prescription.medication}
            </p>
            <p className="text-12-regular text-dark-600">
              Dosage: {patient.prescription.dosage || "N/A"}
            </p>
            <p className="text-12-regular text-dark-600">
              Prescribed By: {patient.prescription.prescribedBy}
            </p>
            <p className="text-12-regular text-dark-600">
              Date:{" "}
              {new Date(patient.prescription.createdAt).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "short", year: "numeric" }
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PharmacistDashboard = ({ onLogout }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Fetch prescriptions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presRes, invRes] = await Promise.all([
          fetch("/api/pharmacist-dashboard/prescriptions"),
          fetch("/api/pharmacist-dashboard/medicines"),
        ]);

        const [presData, invData] = await Promise.all([
          presRes.json(),
          invRes.json(),
        ]);

        console.log(presData);
        console.log(invData);

        setPrescriptions(presData);
        setInventoryAlerts(invData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status, priority) => {
    const baseClasses =
      "flex items-center gap-2 px-3 py-1 rounded-full text-10-medium sm:text-12-medium";

    switch (status) {
      case "pending":
        return (
          <div
            className={`${baseClasses} ${priority === "urgent" ? "bg-red-500/20 border border-red-500/30" : "bg-yellow-500/20 border border-yellow-500/30"}`}
          >
            <Clock className="w-3 h-3" />
            <span
              className={
                priority === "urgent" ? "text-red-400" : "text-yellow-400"
              }
            >
              {priority === "urgent" ? "Urgent Pending" : "Pending"}
            </span>
          </div>
        );
      case "verified":
        return (
          <div
            className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}
          >
            <CheckCircle className="w-3 h-3" />
            <span className="text-blue-400">Verified</span>
          </div>
        );
      case "dispensed":
        return (
          <div
            className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
          >
            <CheckCircle className="w-3 h-3" />
            <span className="text-green-400">Dispensed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getAlertBadge = (alertType) => {
    switch (alertType) {
      case "low-stock":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">
              Expiring Soon
            </span>
          </div>
        );
      case "expired":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">
              Expired
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  // Counts
  const pendingCount = prescriptions.filter(
    (p) => p.status === "pending"
  ).length;
  const verifiedCount = prescriptions.filter(
    (p) => p.status === "verified"
  ).length;
  const dispensedCount = prescriptions.filter(
    (p) => p.status === "dispensed"
  ).length;
  const urgentCount = prescriptions.filter(
    (p) => p.priority === "urgent"
  ).length;
  const lowStockCount = inventoryAlerts.filter(
    (a) => a.alertType === "low-stock"
  ).length;
  const expiringCount = inventoryAlerts.filter(
    (a) => a.alertType === "expiring-soon"
  ).length;

  const handleViewPrescription = async (prescription) => {
    try {
      // const res = await fetch(
      //   `/api/pharmacist-dashboard/patients/${prescription.patientId}`
      // );
      // if (!res.ok) throw new Error("Failed to fetch patient details");

      // const patientData = await res.json();
      // setSelectedPatient({ ...patientData, prescription });

      setSelectedPatient(prescription);
      // setShowPrescriptionModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Pill className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-24-bold lg:text-36-bold text-white">
                  Good morning, {session?.user?.name}
                </h1>
                <p className="text-14-regular lg:text-16-regular text-dark-700">
                  Ready to serve patients today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* <button className="relative p-2 lg:p-3 rounded-xl bg-dark-400/50 backdrop-blur-sm border border-dark-500/50 hover:bg-dark-400/70 transition-all duration-300">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button> */}
              <div className="bg-dark-400/50 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-xl border border-dark-500/50">
                <span className="text-12-medium lg:text-14-medium text-white">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {pendingCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-yellow-400">
                  Pending
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {verifiedCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-blue-400">
                  Verified
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {dispensedCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-green-400">
                  Dispensed
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">
                  {urgentCount}
                </div>
                <div className="text-10-regular lg:text-14-regular text-red-400">
                  Urgent
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Today's Priority Tasks */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Pending Prescriptions */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            {/* Header with Go To Prescriptions */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Pill className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">
                  Pending Prescriptions
                </h2>
              </div>

              <button
                onClick={() => router.push("/pharmacist/prescriptions")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-5 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                Go to Prescriptions
              </button>
            </div>

            {/* List */}
            <div className="space-y-3 lg:space-y-4 max-h-96 overflow-y-auto">
              {prescriptions
                .filter((p) => p.status === "pending")
                .map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-14-bold lg:text-16-bold text-white">
                              {prescription.patientName}{" "}
                              <span className="text-dark-600 text-10-regular">
                                ({prescription.patientId})
                              </span>
                            </h3>
                            {getStatusBadge(
                              prescription.status,
                              prescription.priority
                            )}
                          </div>

                          <div className="text-12-regular lg:text-14-regular text-blue-400 mb-1">
                            {prescription.medication}
                            {prescription.dosage
                              ? ` - ${prescription.dosage}`
                              : ""}
                          </div>

                          <div className="text-10-regular lg:text-12-regular text-dark-700">
                            Prescribed by:{" "}
                            <span className="text-white">
                              {prescription.prescribedBy}
                            </span>{" "}
                            on{" "}
                            {new Date(
                              prescription.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>

                          {prescription.medicineName && (
                            <div className="text-10-regular lg:text-12-regular text-dark-600">
                              Medicine:{" "}
                              <span className="text-white">
                                {prescription.medicineName}
                              </span>{" "}
                              (Stock: {prescription.medicineStock ?? "N/A"})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Only View button remains */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewPrescription(prescription)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {prescriptions.filter((p) => p.status === "pending").length ===
                0 && (
                <div className="text-center py-8 lg:py-12">
                  <Pill className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-16-bold lg:text-20-bold text-white mb-2">
                    All caught up!
                  </h3>
                  <p className="text-14-regular text-dark-700">
                    No pending prescriptions to review.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">
                  Inventory Alerts
                </h2>
              </div>
              <span className="text-12-regular lg:text-14-regular text-dark-700">
                {inventoryAlerts.length} alerts
              </span>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {inventoryAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-14-bold lg:text-16-bold text-white mb-1">
                          {alert.medication}
                        </h3>
                        <div className="text-12-regular lg:text-14-regular text-dark-700">
                          Stock: {alert.currentStock} (Min: {alert.minLevel})
                        </div>
                        <div className="text-10-regular lg:text-12-regular text-dark-600">
                          Expires: {alert.expiryDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      {getAlertBadge(alert.alertType)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {inventoryAlerts.length === 0 && (
              <div className="text-center py-8 lg:py-12">
                <Package className="w-12 h-12 lg:w-16 lg:h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-16-bold lg:text-20-bold text-white mb-2">
                  Inventory looks good!
                </h3>
                <p className="text-14-regular text-dark-700">
                  No inventory alerts at this time.
                </p>
              </div>
            )}
          </div>
        </div>
        Daily Summary
        {/* <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h2 className="text-18-bold lg:text-24-bold text-white">
              Today's Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">
                  Prescriptions
                </span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">
                24
              </div>
              <div className="text-12-regular text-blue-400">
                Processed today
              </div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">
                  Revenue
                </span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">
                $1,250
              </div>
              <div className="text-12-regular text-green-400">
                Today's sales
              </div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">
                  Patients
                </span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">
                18
              </div>
              <div className="text-12-regular text-purple-400">
                Served today
              </div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">
                  Alerts
                </span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">
                {lowStockCount + expiringCount}
              </div>
              <div className="text-12-regular text-red-400">
                Inventory issues
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Patient Modal */}
      <PatientDetailsModal patient={selectedPatient} />
    </div>
  );
};

export default PharmacistDashboard;
