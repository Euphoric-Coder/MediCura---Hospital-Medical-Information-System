import React, { useState } from "react";
import {
  Plus,
  Pill,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
} from "lucide-react";
import jsPDF from "jspdf";

const PrescriptionDetailsModal = ({
  isOpen,
  onClose,
  prescription,
  onDownloadPDF,
  onRequestRefill,
}) => {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-20-bold lg:text-24-bold text-white">
              Prescription Details
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Prescription Header */}
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-18-bold lg:text-20-bold text-white">
                  {prescription.medication}
                </h3>
                <p className="text-14-regular text-purple-400">
                  {prescription.dosage} - {prescription.frequency}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-14-regular text-dark-700">
              <div>
                <span className="text-white">Duration:</span>{" "}
                {prescription.duration}
              </div>
              <div>
                <span className="text-white">Prescribed by:</span>{" "}
                {prescription.prescribedBy}
              </div>
              <div>
                <span className="text-white">Start Date:</span>{" "}
                {prescription.startDate}
              </div>
              <div>
                <span className="text-white">End Date:</span>{" "}
                {prescription.endDate}
              </div>
            </div>
          </div>

          {/* Refill Information */}
          <div className="bg-dark-500/30 rounded-2xl p-6 mb-6">
            <h4 className="text-16-bold lg:text-18-bold text-white mb-4">
              Refill Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-14-regular text-dark-700">
              <div>
                <span className="text-white">Refills Left:</span>{" "}
                {prescription.refillsLeft}
              </div>
              <div>
                <span className="text-white">Total Refills:</span>{" "}
                {prescription.totalRefills}
              </div>
              <div>
                <span className="text-white">Cost:</span> $
                {prescription.cost.toFixed(2)}
              </div>
              {prescription.lastRefillDate && (
                <div>
                  <span className="text-white">Last Refill:</span>{" "}
                  {prescription.lastRefillDate}
                </div>
              )}
              {prescription.nextRefillDate && (
                <div>
                  <span className="text-white">Next Refill:</span>{" "}
                  {prescription.nextRefillDate}
                </div>
              )}
              <div>
                <span className="text-white">Pharmacy:</span>{" "}
                {prescription.pharmacy}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 rounded-2xl p-6 mb-6">
            <h4 className="text-16-bold lg:text-18-bold text-white mb-4">
              Instructions
            </h4>
            <p className="text-14-regular text-blue-300">
              {prescription.instructions}
            </p>
          </div>

          {/* Side Effects */}
          {prescription.sideEffects.length > 0 && (
            <div className="bg-red-500/10 rounded-2xl p-6 mb-6">
              <h4 className="text-16-bold lg:text-18-bold text-white mb-4">
                Possible Side Effects
              </h4>
              <div className="flex flex-wrap gap-2">
                {prescription.sideEffects.map((effect, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-12-medium text-red-400"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onDownloadPDF(prescription)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>

            {prescription.status === "active" &&
              prescription.refillsLeft > 0 && (
                <button
                  onClick={() => onRequestRefill(prescription.id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Request Refill
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientMedication = ({ onBack }) => {
  const [prescriptions] = useState([
    {
      id: "1",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "90 days",
      prescribedBy: "Dr. Sarah Safari",
      prescribedDate: "2024-01-10",
      startDate: "2024-01-10",
      endDate: "2024-04-10",
      status: "active",
      refillsLeft: 2,
      totalRefills: 3,
      instructions:
        "Take with food in the morning. Monitor blood pressure regularly. Avoid potassium supplements.",
      sideEffects: ["Dizziness", "Dry cough", "Fatigue", "Headache"],
      cost: 25.5,
      pharmacy: "CVS Pharmacy - Main Street",
      lastRefillDate: "2024-01-10",
      nextRefillDate: "2024-02-10",
    },
    {
      id: "2",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "90 days",
      prescribedBy: "Dr. Sarah Safari",
      prescribedDate: "2024-01-10",
      startDate: "2024-01-10",
      endDate: "2024-04-10",
      status: "active",
      refillsLeft: 1,
      totalRefills: 2,
      instructions:
        "Take with meals to reduce stomach upset. Monitor blood sugar levels. Stay hydrated.",
      sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
      cost: 15.75,
      pharmacy: "Walgreens - Downtown",
      lastRefillDate: "2024-01-15",
      nextRefillDate: "2024-02-15",
    },
    {
      id: "3",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      duration: "7 days",
      prescribedBy: "Dr. Ava Williams",
      prescribedDate: "2023-12-20",
      startDate: "2023-12-20",
      endDate: "2023-12-27",
      status: "completed",
      refillsLeft: 0,
      totalRefills: 0,
      instructions:
        "Complete the full course even if feeling better. Take with water.",
      sideEffects: ["Nausea", "Diarrhea", "Rash"],
      cost: 12.0,
      pharmacy: "CVS Pharmacy - Main Street",
    },
    {
      id: "4",
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "30 days",
      prescribedBy: "Dr. Adam Smith",
      prescribedDate: "2024-01-05",
      startDate: "2024-01-05",
      endDate: "2024-02-05",
      status: "discontinued",
      refillsLeft: 0,
      totalRefills: 1,
      instructions:
        "Take with food. Do not exceed 3 doses per day. Discontinue if stomach upset occurs.",
      sideEffects: ["Stomach upset", "Heartburn", "Dizziness"],
      cost: 8.5,
      pharmacy: "Walgreens - Downtown",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.medication
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.prescribedBy
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || prescription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-green-400">
              Active
            </span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">
              Completed
            </span>
          </div>
        );
      case "discontinued":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <X className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">
              Discontinued
            </span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">
              Pending
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const generatePrescriptionPDF = (prescription) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("MediCura Medical Center", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567 | Email: info@medicura.com", 20, 50);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("PRESCRIPTION DETAILS", 20, 70);

    // Patient Information
    doc.setFontSize(14);
    doc.text("Patient Information:", 20, 90);
    doc.setFontSize(12);
    doc.text("Patient: John Smith", 30, 105);
    doc.text("Patient ID: P001", 30, 115);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, 125);

    // Prescription Details
    doc.setFontSize(14);
    doc.text("Prescription Details:", 20, 145);
    doc.setFontSize(12);
    doc.text(`Medication: ${prescription.medication}`, 30, 160);
    doc.text(`Dosage: ${prescription.dosage}`, 30, 170);
    doc.text(`Frequency: ${prescription.frequency}`, 30, 180);
    doc.text(`Duration: ${prescription.duration}`, 30, 190);
    doc.text(`Prescribed by: ${prescription.prescribedBy}`, 30, 200);
    doc.text(`Prescribed Date: ${prescription.prescribedDate}`, 30, 210);
    doc.text(`Start Date: ${prescription.startDate}`, 30, 220);
    doc.text(`End Date: ${prescription.endDate}`, 30, 230);

    // Refill Information
    doc.setFontSize(14);
    doc.text("Refill Information:", 20, 250);
    doc.setFontSize(12);
    doc.text(`Refills Remaining: ${prescription.refillsLeft}`, 30, 265);
    doc.text(`Total Refills: ${prescription.totalRefills}`, 30, 275);
    doc.text(`Cost: $${prescription.cost.toFixed(2)}`, 30, 285);
    doc.text(`Pharmacy: ${prescription.pharmacy}`, 30, 295);

    // Instructions
    doc.setFontSize(14);
    doc.text("Instructions:", 20, 315);
    doc.setFontSize(12);
    const instructionLines = doc.splitTextToSize(
      prescription.instructions,
      160
    );
    doc.text(instructionLines, 30, 330);

    // Side Effects
    if (prescription.sideEffects.length > 0) {
      doc.setFontSize(14);
      doc.text("Possible Side Effects:", 20, 360);
      doc.setFontSize(12);
      prescription.sideEffects.forEach((effect, index) => {
        doc.text(`• ${effect}`, 30, 375 + index * 10);
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This prescription is valid only when prescribed by an authorized healthcare provider.",
      20,
      280
    );
    doc.text(
      "For questions about this prescription, contact your healthcare provider.",
      20,
      290
    );

    // Save the PDF
    doc.save(
      `prescription-${prescription.medication
        .toLowerCase()
        .replace(/\s+/g, "-")}-${prescription.id}.pdf`
    );
  };

  const handleDownloadPDF = (prescription) => {
    generatePrescriptionPDF(prescription);
    setMessage(`PDF downloaded for ${prescription.medication}`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const handleRequestRefill = (prescriptionId) => {
    const prescription = prescriptions.find((p) => p.id === prescriptionId);
    setMessage(`Refill request submitted for ${prescription?.medication}`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const activeCount = prescriptions.filter((p) => p.status === "active").length;
  const completedCount = prescriptions.filter(
    (p) => p.status === "completed"
  ).length;
  const pendingRefills = prescriptions.filter(
    (p) => p.status === "active" && p.refillsLeft > 0
  ).length;
  const totalCost = prescriptions
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.cost, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  My Medicines
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Manage your medications
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-6 lg:mb-8 ${
                messageType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">
                {message}
              </span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Pill className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {activeCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    Active
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
                    {completedCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <RefreshCw className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {pendingRefills}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">
                    Refillable
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Download className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    ${totalCost.toFixed(0)}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">
                    Monthly Cost
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search medications or doctors..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="discontinued">Discontinued</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Pill className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-20-bold lg:text-24-bold text-white">
                Your Medications
              </h2>
            </div>

            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>

                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">
                            {prescription.medication}
                          </h3>
                          {getStatusBadge(prescription.status)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Dosage:</span>{" "}
                            {prescription.dosage}
                          </div>
                          <div>
                            <span className="text-white">Frequency:</span>{" "}
                            {prescription.frequency}
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-white">Duration:</span>{" "}
                            {prescription.duration}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Prescribed by:</span>{" "}
                            {prescription.prescribedBy}
                          </div>
                          <div>
                            <span className="text-white">Date:</span>{" "}
                            {prescription.prescribedDate}
                          </div>
                        </div>

                        {prescription.status === "active" && (
                          <div className="bg-green-500/20 rounded-lg px-3 py-2 inline-block">
                            <p className="text-10-regular lg:text-12-regular text-green-400">
                              <span className="text-white">Refills left:</span>{" "}
                              {prescription.refillsLeft} |
                              <span className="text-white"> Cost:</span> $
                              {prescription.cost.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        <button
                          onClick={() => handleDownloadPDF(prescription)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>

                      {prescription.status === "active" &&
                        prescription.refillsLeft > 0 && (
                          <button
                            onClick={() => handleRequestRefill(prescription.id)}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Refill</span>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-purple-500/20">
                  <Pill className="w-8 h-8 lg:w-12 lg:h-12 text-purple-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No prescriptions found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No prescriptions match your search criteria. Try adjusting
                  your filters.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mt-6 lg:mt-8 text-14-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        prescription={selectedPrescription}
        onDownloadPDF={handleDownloadPDF}
        onRequestRefill={handleRequestRefill}
      />
    </>
  );
};

export default PatientMedication;
