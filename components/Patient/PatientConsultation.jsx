import React, { useEffect, useState } from "react";
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
  NotepadTextDashed,
  Check,
  AlarmClock,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  Appointments,
  Consultations,
  Doctors,
  Prescriptions,
} from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/dbConfig";
import { format, set } from "date-fns";

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
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientConsultation = ({ onBack, patientData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultationPrescriptions, setConsultationPrescriptions] = useState(
    []
  );

  useEffect(() => {
    fetchConsultationsWithPrescriptions(patientData.userId);
  }, [patientData]);

  const updateMedicineStatus = async (id) => {
    try {
      const updateStatus = await db
        .update(Prescriptions)
        .set({
          status: "ordered",
          updatedAt: new Date(),
        })
        .where(eq(Prescriptions.id, id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConsultationsWithPrescriptions = async (patientId) => {
    try {
      // Fetch consultations + doctor + appointment
      const consultations = await db
        .select({
          id: Consultations.id,
          consultationDate: Consultations.createdAt,
          chiefComplaint: Consultations.chiefComplaint,
          historyOfPresentIllness: Consultations.historyOfPresentIllness,
          physicalExamination: Consultations.physicalExamination,
          followUpInstructions: Consultations.followUpInstructions,
          consultationNotes: Consultations.plan,
          diagnosis: Consultations.assessment,
          followUpDate: Consultations.nextAppointment,

          doctor: Doctors.name,
          doctorSpecialty: Doctors.speciality,

          appointmentType: Appointments.type,
          appointmentDate: Appointments.date,
          reason: Appointments.reason,
        })
        .from(Consultations)
        .innerJoin(Doctors, eq(Consultations.doctorId, Doctors.userId))
        .leftJoin(
          Appointments,
          eq(Consultations.appointmentId, Appointments.id)
        )
        .where(eq(Consultations.patientId, patientId));

      if (!consultations.length) return [];

      // Collect consultation IDs
      const consultationIds = consultations.map((c) => c.id);

      // Fetch prescriptions for these consultations
      const prescriptions = await db
        .select()
        .from(Prescriptions)
        .where(inArray(Prescriptions.consultationId, consultationIds));

      const data = consultations.map((c) => ({
        id: c.id,
        consultationDate: c.consultationDate.toString(),
        doctor: c.doctor,
        doctorSpecialty: c.doctorSpecialty,
        appointmentType: c.appointmentType,
        diagnosis: c.diagnosis,
        chiefComplaint: c.chiefComplaint,
        historyOfPresentIllness: c.historyOfPresentIllness,
        physicalExamination: c.physicalExamination,
        followUpInstructions: c.followUpInstructions,
        consultationNotes: c.consultationNotes,
        followUpDate: c.followUpDate,
        prescriptions: prescriptions
          .filter((p) => p.consultationId === c.id)
          .map((p) => ({
            id: p.id,
            medication: p.medication,
            dosage: p.dosage,
            frequency: p.frequency,
            duration: p.duration,
            prescribedBy: c.doctor,
            prescribedDate: c.consultationDate
              ? new Date(c.consultationDate).toLocaleDateString()
              : null,
            startDate: p.startDate
              ? new Date(p.startDate).toLocaleDateString()
              : c.consultationDate
              ? new Date(c.consultationDate).toLocaleDateString()
              : null,
            endDate: p.endDate
              ? new Date(p.endDate).toLocaleDateString()
              : null,
            status: p.status,
            instructions: p.instructions,
            sideEffects: p.sideEffects ?? [],
            cost: p.cost ?? 0,
            consultationId: p.consultationId,
            appointmentDate: c.appointmentDate
              ? new Date(c.appointmentDate).toLocaleDateString()
              : null,
            reason: c.reason,
          })),
      }));

      console.log(data);

      setConsultationPrescriptions(data);

      // setConsultationPrescriptions(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      return [];
    }
  };

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
      case "ordered":
        return <AlarmClock className="w-4 h-4" />;
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
                      {format(consultation.consultationDate, "PPP")}
                    </p>
                    <p className="text-12-regular lg:text-14-regular text-dark-700">
                      {consultation.doctor} - {consultation.doctorSpecialty}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-14-regular text-dark-700">
                  <div>
                    <span className="text-white font-medium">
                      Chief Complaint:
                    </span>
                    {Array.isArray(consultation.chiefComplaint) &&
                    consultation.chiefComplaint.length > 0 ? (
                      <ul className="list-disc list-inside text-white mt-1 space-y-1">
                        {consultation.chiefComplaint.map((item, index) => (
                          <li
                            key={index}
                            className="text-14-regular text-dark-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-dark-700">
                        No Chief Complaint provided
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-white font-medium">
                      History of Present Illness:
                    </span>
                    {Array.isArray(consultation.historyOfPresentIllness) &&
                    consultation.historyOfPresentIllness.length > 0 ? (
                      <ul className="list-disc list-inside text-white mt-1 space-y-1">
                        {consultation.historyOfPresentIllness.map(
                          (item, index) => (
                            <li
                              key={index}
                              className="text-14-regular text-dark-700"
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-dark-700">
                        No History of Present Illness provided
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-white font-medium">
                      Physical Examination:
                    </span>
                    {Array.isArray(consultation.physicalExamination) &&
                    consultation.physicalExamination.length > 0 ? (
                      <ul className="list-disc list-inside text-white mt-1 space-y-1">
                        {consultation.physicalExamination.map((item, index) => (
                          <li
                            key={index}
                            className="text-14-regular text-dark-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-dark-700">
                        No Physical Examination provided
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-white font-medium">Diagnosis:</span>
                    {Array.isArray(consultation.diagnosis) &&
                    consultation.diagnosis.length > 0 ? (
                      <ul className="list-disc list-inside text-white mt-1 space-y-1">
                        {consultation.diagnosis.map((item, index) => (
                          <li
                            key={index}
                            className="text-14-regular text-dark-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-dark-700">No diagnosis provided</p>
                    )}
                  </div>

                  <div>
                    <span className="text-white font-medium">
                      Consultation Notes:
                    </span>
                    {Array.isArray(consultation.consultationNotes) &&
                    consultation.consultationNotes.length > 0 ? (
                      <ul className="list-disc list-inside text-white mt-1 space-y-1">
                        {consultation.consultationNotes.map((item, index) => (
                          <li
                            key={index}
                            className="text-14-regular text-dark-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-dark-700">
                        No Consultation Notes provided
                      </p>
                    )}
                  </div>

                  {consultation.followUpDate && (
                    <div>
                      <span className="text-white font-medium">
                        Expected Follow-up Date:
                      </span>{" "}
                      {format(consultation.followUpDate, "PPP")}
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
                            </div>
                          </div>
                        </div>

                        {prescription.status === "recommended" && (
                          <button
                            onClick={() =>
                              updateMedicineStatus(prescription.id)
                            }
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                          >
                            <Check className="w-4 h-4 lg:w-5 lg:h-5" />
                            Order
                          </button>
                        )}

                        {prescription.status === "active" && (
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
                          </div>
                        )}
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
              <NotepadTextDashed className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-18-bold text-white mb-2">
              No Prescription found
            </h3>
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
      />
    </div>
  );
};

export default PatientConsultation;
