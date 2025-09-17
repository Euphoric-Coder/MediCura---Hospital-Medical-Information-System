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
  Stethoscope,
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
              Medicine Details
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
              {prescription.appointmentDate && (
                <div className="md:col-span-2">
                  <span className="text-white">From Consultation:</span>{" "}
                  {prescription.appointmentDate}
                </div>
              )}
            </div>
          </div>

          {/* Consultation Context */}
          {prescription.consultationId && (
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-16-bold lg:text-18-bold text-white">
                  Consultation Details
                </h4>
              </div>
              <div className="space-y-2 text-14-regular text-dark-700">
                <div>
                  <span className="text-white">Reason for Visit:</span>{" "}
                  {prescription.reason}
                </div>
                <div>
                  <span className="text-white">Appointment Date:</span>{" "}
                  {prescription.appointmentDate}
                </div>
              </div>
            </div>
          )}

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
                  onClick={() => onRequestRefill(prescription.i)}
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

const PatientConsultation = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock consultation prescriptions data
  const consultationPrescriptions = [
    {
      id: "cons-001",
      consultationDate: "2024-01-15",
      doctor: "Dr. Sarah Safari",
      doctorSpecialty: "General Medicine",
      appointmentType: "Regular Consultation",
      diagnosis: "Hypertension and mild anxiety",
      consultationNotes:
        "Patient presented with elevated blood pressure readings. Recommended lifestyle changes and medication management.",
      followUpDate: "2024-02-15",
      prescriptions: [
        {
          id: "rx-001",
          medication: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          prescribedBy: "Dr. Sarah Safari",
          prescribedDate: "2024-01-15",
          startDate: "2024-01-15",
          endDate: "2024-02-14",
          status: "active",
          refillsLeft: 2,
          totalRefills: 3,
          instructions:
            "Take with food in the morning. Monitor blood pressure daily.",
          sideEffects: ["Dizziness", "Dry cough", "Fatigue"],
          cost: 25.99,
          pharmacy: "MediCura Pharmacy",
          consultationId: "cons-001",
          appointmentDate: "2024-01-15",
          reason: "High blood pressure management",
        },
        {
          id: "rx-002",
          medication: "Alprazolam",
          dosage: "0.25mg",
          frequency: "As needed",
          duration: "30 days",
          prescribedBy: "Dr. Sarah Safari",
          prescribedDate: "2024-01-15",
          startDate: "2024-01-15",
          endDate: "2024-02-14",
          status: "active",
          refillsLeft: 1,
          totalRefills: 2,
          instructions:
            "Take only when experiencing anxiety. Do not exceed 2 tablets per day.",
          sideEffects: ["Drowsiness", "Dizziness", "Memory problems"],
          cost: 18.5,
          pharmacy: "MediCura Pharmacy",
          consultationId: "cons-001",
          appointmentDate: "2024-01-15",
          reason: "Anxiety management",
        },
      ],
    },
    {
      id: "cons-002",
      consultationDate: "2024-01-08",
      doctor: "Dr. Michael Chen",
      doctorSpecialty: "Cardiology",
      appointmentType: "Follow-up",
      diagnosis: "Post-cardiac event monitoring",
      consultationNotes:
        "Patient recovering well from recent cardiac event. Continue current medication regimen.",
      prescriptions: [
        {
          id: "rx-003",
          medication: "Metoprolol",
          dosage: "50mg",
          frequency: "Twice daily",
          duration: "90 days",
          prescribedBy: "Dr. Michael Chen",
          prescribedDate: "2024-01-08",
          startDate: "2024-01-08",
          endDate: "2024-04-08",
          status: "active",
          refillsLeft: 3,
          totalRefills: 5,
          instructions:
            "Take with meals. Do not stop suddenly without consulting doctor.",
          sideEffects: ["Fatigue", "Cold hands/feet", "Dizziness"],
          cost: 32.75,
          pharmacy: "MediCura Pharmacy",
          consultationId: "cons-002",
          appointmentDate: "2024-01-08",
          reason: "Cardiac monitoring and management",
        },
      ],
    },
    {
      id: "cons-003",
      consultationDate: "2023-12-20",
      doctor: "Dr. Sarah Safari",
      doctorSpecialty: "General Medicine",
      appointmentType: "Sick Visit",
      diagnosis: "Bacterial infection - completed treatment",
      consultationNotes:
        "Patient completed full course of antibiotics. Infection cleared successfully.",
      prescriptions: [
        {
          id: "rx-004",
          medication: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "10 days",
          prescribedBy: "Dr. Sarah Safari",
          prescribedDate: "2023-12-20",
          startDate: "2023-12-20",
          endDate: "2023-12-30",
          status: "completed",
          refillsLeft: 0,
          totalRefills: 0,
          instructions:
            "Take with food. Complete entire course even if feeling better.",
          sideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
          cost: 15.25,
          pharmacy: "MediCura Pharmacy",
          consultationId: "cons-003",
          appointmentDate: "2023-12-20",
          reason: "Bacterial infection treatment",
        },
      ],
    },
  ];

  // Flatten all prescriptions from consultations
  const allPrescriptions = consultationPrescriptions.flatMap(
    (consultation) => consultation.prescriptions
  );

  const filteredPrescriptions = allPrescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.medication
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.prescribedBy
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || prescription.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "discontinued":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "discontinued":
        return <X className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleDownloadPDF = (prescription) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("MediCura Medical Center", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567", 20, 50);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("PRESCRIPTION RECORD", 20, 70);

    // Patient Info
    doc.setFontSize(14);
    doc.text("Patient Information:", 20, 90);
    doc.setFontSize(12);
    doc.text("Name: John Doe", 30, 105);
    doc.text("DOB: January 15, 1990", 30, 115);
    doc.text("Patient ID: P-001", 30, 125);

    // Prescription Details
    doc.setFontSize(14);
    doc.text("Prescription Details:", 20, 145);
    doc.setFontSize(12);
    doc.text(`Medication: ${prescription.medication}`, 30, 160);
    doc.text(`Dosage: ${prescription.dosage}`, 30, 170);
    doc.text(`Frequency: ${prescription.frequency}`, 30, 180);
    doc.text(`Duration: ${prescription.duration}`, 30, 190);
    doc.text(`Prescribed by: ${prescription.prescribedBy}`, 30, 200);
    doc.text(`Date Prescribed: ${prescription.prescribedDate}`, 30, 210);

    // Instructions
    doc.setFontSize(14);
    doc.text("Instructions:", 20, 230);
    doc.setFontSize(12);
    const splitInstructions = doc.splitTextToSize(
      prescription.instructions,
      160
    );
    doc.text(splitInstructions, 30, 245);

    doc.save(
      `prescription-${prescription.medication
        .replace(/\s+/g, "-")
        .toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  const handleRequestRefill = (prescriptionId) => {
    // In a real app, this would make an API call
    alert(
      "Refill request submitted successfully! You will be notified when it's ready for pickup."
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  My Prescriptions
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Prescriptions from consultations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Search and Filter */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-600 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-500/50 border border-dark-500/50 rounded-xl text-white placeholder-dark-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-dark-500/50 border border-dark-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="discontinued">Discontinued</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Consultation Prescriptions */}
        <div className="space-y-6 lg:space-y-8">
          {consultationPrescriptions.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6"
            >
              {/* Consultation Header */}
              <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Stethoscope className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-16-bold lg:text-20-bold text-white">
                      {consultation.appointmentType}
                    </h3>
                    <p className="text-12-regular lg:text-14-regular text-green-400">
                      {consultation.consultationDate}
                    </p>
                    <p className="text-12-regular lg:text-14-regular text-dark-700">
                      {consultation.doctor} - {consultation.doctorSpecialty}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-14-regular text-dark-700">
                  <div>
                    <span className="text-white font-medium">Diagnosis:</span>{" "}
                    {consultation.diagnosis}
                  </div>
                  <div>
                    <span className="text-white font-medium">Notes:</span>{" "}
                    {consultation.consultationNotes}
                  </div>
                  {consultation.followUpDate && (
                    <div>
                      <span className="text-white font-medium">Follow-up:</span>{" "}
                      {consultation.followUpDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Prescriptions from this consultation */}
              <div className="space-y-4">
                <h4 className="text-16-bold lg:text-18-bold text-white mb-4">
                  Prescribed Medications
                </h4>
                {consultation.prescriptions
                  .filter((prescription) => {
                    const matchesSearch =
                      prescription.medication
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      prescription.prescribedBy
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    const matchesStatus =
                      selectedStatus === "all" ||
                      prescription.status === selectedStatus;
                    return matchesSearch && matchesStatus;
                  })
                  .map((prescription) => (
                    <div
                      key={prescription.id}
                      className="bg-dark-500/30 rounded-2xl p-4 lg:p-6 hover:bg-dark-500/40 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Pill className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-16-bold lg:text-18-bold text-white">
                              {prescription.medication}
                            </h3>
                            <p className="text-12-regular lg:text-14-regular text-purple-400">
                              {prescription.dosage} - {prescription.frequency}
                            </p>
                            <p className="text-12-regular lg:text-14-regular text-dark-700">
                              Duration: {prescription.duration}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`px-3 py-1 rounded-full text-12-medium border ${getStatusColor(
                                  prescription.status
                                )} flex items-center gap-1`}
                              >
                                {getStatusIcon(prescription.status)}
                                {prescription.status.charAt(0).toUpperCase() +
                                  prescription.status.slice(1)}
                              </span>
                              {prescription.status === "active" && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-12-medium">
                                  {prescription.refillsLeft} refills left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-3">
                          <button
                            onClick={() => handleViewDetails(prescription)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                          >
                            <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(prescription)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                          >
                            <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                          </button>
                          {prescription.status === "active" &&
                            prescription.refillsLeft > 0 && (
                              <button
                                onClick={() =>
                                  handleRequestRefill(prescription.id)
                                }
                                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                              >
                                <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-18-bold text-white mb-2">No medicines found</h3>
            <p className="text-14-regular text-dark-700">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 lg:mt-8 text-14-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prescription={selectedPrescription}
        onDownloadPDF={handleDownloadPDF}
        onRequestRefill={handleRequestRefill}
      />
    </div>
  );
};

export default PatientConsultation;
