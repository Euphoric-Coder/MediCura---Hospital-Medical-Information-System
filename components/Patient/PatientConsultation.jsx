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
  CircleX,
  AlertCircle,
  Circle,
  ArrowLeft,
  Expand,
} from "lucide-react";
import { BiCollapse } from "react-icons/bi";
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
import { Button } from "../ui/button";
import { toast } from "sonner";

const PrescriptionDetailsModal = ({
  isOpen,
  onClose,
  prescription,
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

          <div className="flex justify-end mb-3 gap-3">
            <span
              className={`px-3 py-1 rounded-full text-12-medium border ${getStatusColor(
                prescription.status
              )} flex items-center gap-1`}
            >
              {getStatusIcon(prescription.status)}
            </span>
            <button
              // onClick={() => onDownloadPDF(prescription)}
              disabled={!prescription.billGenerated}
              className={`bg-gradient-to-r from-green-500 to-green-600 
              hover:from-green-600 hover:to-green-700 
              text-white py-3 px-4 rounded-3xl 
              text-14-semibold lg:text-16-semibold 
              transition-all duration-300 shadow-lg 
              hover:shadow-green-500/25 flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600`}
            >
              <Download className="w-5 h-5" />
              {prescription.billGenerated
                ? "Download Bill"
                : " Bill Not Generated"}
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
                  {prescription.medication || "N/A"}
                </h3>
                <p className="text-14-regular text-purple-400">
                  {prescription.dosage || "N/A"} -{" "}
                  {prescription.frequency || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-14-regular text-dark-700">
              <div>
                <span className="text-white">Duration:</span>{" "}
                {prescription.duration || "N/A"}
              </div>
              <div>
                <span className="text-white">Prescribed by:</span>{" "}
                {prescription.prescribedBy || "N/A"}
              </div>
              <div>
                <span className="text-white">Start Date:</span>{" "}
                {prescription.startDate
                  ? format(prescription.startDate, "PPP")
                  : "NA"}
              </div>
              <div>
                <span className="text-white">End Date:</span>{" "}
                {prescription.endDate
                  ? format(prescription.endDate, "PPP")
                  : "NA"}
              </div>
              {prescription.appointmentDate && (
                <div className="md:col-span-2">
                  <span className="text-white">From Consultation:</span>{" "}
                  {prescription.appointmentDate
                    ? format(prescription.appointmentDate, "PPP")
                    : "NA"}
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
                  {prescription.reason || "N/A"}
                </div>
                <div>
                  <span className="text-white">Appointment Date:</span>{" "}
                  {prescription.appointmentDate
                    ? format(prescription.appointmentDate, "PPP")
                    : "NA"}
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
              {prescription.instructions || "N/A"}
            </p>
          </div>

          {/* Side Effects */}
          {prescription.sideEffects.length > 0 ? (
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
          ) : (
            <div className="bg-red-500/10 rounded-2xl p-6 mb-6">
              <h4 className="text-16-bold lg:text-18-bold text-white mb-4">
                Possible Side Effects
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-12-medium text-red-400">
                  No Side Effects
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30";

    case "completed":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";

    case "discontinued-doctor":
    case "discontinued":
      return "bg-red-500/20 text-red-400 border-red-500/30";

    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";

    case "ordered":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";

    case "verified":
      return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";

    case "recommended":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";

    case "request-cancellation":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";

    case "request-refill":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";

    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "active":
      return (
        <p className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 animate-pulse text-green-400" />
          Active
        </p>
      );

    case "completed":
      return (
        <p className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-gray-400" />
          Course Completed
        </p>
      );

    case "discontinued-doctor":
    case "discontinued":
      return (
        <p className="flex items-center gap-2">
          <CircleX className="w-4 h-4 text-red-400 animate-pulse" />
          Discontinued
        </p>
      );

    case "advised-discontinued":
      return (
        <p className="flex items-center gap-2">
          <X className="w-4 h-4 text-orange-400 animate-pulse" />
          Advised Discontinued
        </p>
      );

    case "pending":
      return (
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-400 animate-ping" />
          Yet to be Dispensed By Pharmacist
        </p>
      );

    case "verified":
      return (
        <p className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-indigo-400 animate-bounce" />
          Verified By Pharmacist - Pending Dispense
        </p>
      );

    case "ordered":
      return (
        <p className="flex items-center gap-2">
          <AlarmClock className="w-4 h-4 text-blue-400 animate-bounce" />
          Ordered: Pending Approval
        </p>
      );

    case "recommended":
      return (
        <p className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-purple-400 animate-pulse" />
          Recommended By Doctor
        </p>
      );

    case "request-cancellation":
      return (
        <p className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-400 animate-pulse" />
          Requested Cancellation To Doctor
        </p>
      );

    case "request-refill":
      return (
        <p className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
          Refill Requested
        </p>
      );

    default:
      return (
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 animate-pulse" />
          Processing
        </p>
      );
  }
};

const PatientConsultation = ({ onBack, patientData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultationPrescriptions, setConsultationPrescriptions] = useState(
    []
  );
  const [loading, setLoading] = useState(true);

  // Collapse state for each consultation
  const [collapsed, setCollapsed] = useState({});

  // Collapse state for all consultations
  const [allCollapsed, setAllCollapsed] = useState(false);

  // State for expanded prescription
  const [expandedPrescription, setExpandedPrescription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchConsultationsWithPrescriptions(patientData.userId);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchData();
  }, []);

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
          doctorId: Doctors.userId,
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
        doctorId: c.doctorId,
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
            doctorId: c.doctorId,
            prescribedBy: c.doctor,
            prescribedDate: c.consultationDate
              ? c.consultationDate.toString()
              : null,
            startDate: p.startDate,
            endDate: p.endDate
              ? new Date(p.endDate).toLocaleDateString()
              : null,
            status: p.status,
            instructions: p.instructions,
            sideEffects: p.sideEffects ?? [],
            billGenerated: p.billGenerated,
            cost: p.cost ?? 0,
            pharmacistNotes: p.pharmacistNotes,
            dispensedDuration: p.dispensedDuration,
            nextRefillDate: p.nextRefillDate,
            lastDispensedDate: p.lastDispensedDate,
            refillsRemaining: p.refillsRemaining,
            medicineValidity: p.medicineValidity,
            interaction: p.interaction ?? [],
            consultationId: p.consultationId,
            appointmentDate: c.appointmentDate ? c.appointmentDate : null,
            reason: c.reason,
          })),
      }));

      setConsultationPrescriptions(data);

      // setConsultationPrescriptions(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      return [];
    }
  };

  const orderMedicine = async (id, name) => {
    try {
      const load = toast.loading(`Ordering ${name}...`);
      const updateStatus = await db
        .update(Prescriptions)
        .set({
          status: "ordered",
          updatedAt: new Date(),
        })
        .where(eq(Prescriptions.id, id));

      refreshPrescriptions();

      toast.dismiss(load);
      toast.success(`${name} ordered successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  const requestCancellation = async (id, name) => {
    try {
      const load = toast.loading(`Requesting cancellation for ${name}...`);
      const updateStatus = await db
        .update(Prescriptions)
        .set({
          status: "request-cancellation",
          updatedAt: new Date(),
        })
        .where(eq(Prescriptions.id, id));

      refreshPrescriptions();

      toast.dismiss(load);
      toast.success(`Cancellation request sent for ${name}`);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePrescriptionStatus = async (id, newStatus) => {
    try {
      const load = toast.loading("Updating prescription status...");

      await db
        .update(Prescriptions)
        .set({
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(Prescriptions.id, id));

      toast.dismiss(load);
      toast.success(`Prescription status updated to "${newStatus}"`);

      // Refresh UI after update
      refreshPrescriptions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update prescription status");
    }
  };

  const acceptDiscontinuation = async (prescription) => {
    try {
      const load = toast.loading("Accepting discontinuation...");
      const res = await db
        .update(Prescriptions)
        .set({
          status: "discontinued",
          updatedAt: new Date(),
        })
        .where(eq(Prescriptions.id, prescription.id));

      toast.dismiss(load);
      toast.success("Discontinuation accepted");
      refreshPrescriptions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to accept discontinuation");
    }
  };

  const rejectDiscontinuation = async (prescription) => {
    try {
      const load = toast.loading("Accepting discontinuation...");
      const res = await db
        .update(Prescriptions)
        .set({
          status: "ordered",
          updatedAt: new Date(),
        })
        .where(eq(Prescriptions.id, prescription.id));

      toast.dismiss(load);
      toast.success("Discontinuation accepted");
      refreshPrescriptions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to accept discontinuation");
    }
  };

  const refreshPrescriptions = () => {
    fetchConsultationsWithPrescriptions(patientData.userId);
  };

  // Flatten all prescriptions from consultations
  const allPrescriptions = consultationPrescriptions.flatMap(
    (consultation) => consultation.prescriptions
  );

  // const filteredPrescriptions = allPrescriptions.filter((prescription) => {
  //   const matchesSearch =
  //     prescription.medication
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase()) ||
  //     prescription.prescribedBy
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());
  //   const matchesStatus =
  //     selectedStatus === "all" || prescription.status === selectedStatus;
  //   return matchesSearch && matchesStatus;
  // });

  const updateFilter = (consultationId, field, value) => {
    setFilters((prev) => ({
      ...prev,
      [consultationId]: {
        ...(prev[consultationId] || { search: "", status: "all" }),
        [field]: value,
      },
    }));
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const downloadDoctorPrescription = (consultation, patientData) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 30;

    // 🔹 Adds a wrapped text block (auto page-break if needed)
    const addWrappedText = (
      text,
      x = 20,
      gap = 8,
      fontSize = 12,
      color = [40, 40, 40],
      maxWidth = 170
    ) => {
      if (!text) return;
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);

      const splitText = doc.splitTextToSize(text, maxWidth);
      splitText.forEach((line) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = 30;
        }
        doc.text(line, x, yPos);
        yPos += gap;
      });
    };

    // 🔹 Adds a section with bullets (handles arrays safely)
    const addBulletList = (title, items, x = 30) => {
      if (!Array.isArray(items) || items.length === 0) return;

      addWrappedText(title, 20, 10, 13, [30, 30, 30]);
      items.forEach((item) => {
        if (typeof item === "string") {
          addWrappedText(`• ${item}`, x, 8, 12, [60, 60, 60], 160);
        } else {
          addWrappedText(
            `• ${JSON.stringify(item)}`,
            x,
            8,
            12,
            [60, 60, 60],
            160
          );
        }
      });
      yPos += 5;
    };

    // ---------------- HEADER ----------------
    doc.setFontSize(20);
    doc.text("MediCura Medical Center", 20, yPos);
    yPos += 10;
    addWrappedText(
      "123 Healthcare Drive, Medical City, MC 12345",
      20,
      8,
      12,
      [100, 100, 100]
    );
    addWrappedText("Phone: (+91) 9878324512", 20, 8, 12, [100, 100, 100]);

    yPos += 10;
    addWrappedText("CONSULTATION RECORD", 20, 12, 16);

    // ---------------- PATIENT INFO ----------------
    yPos += 10;
    addWrappedText("Patient Information:", 20, 12, 14);
    addWrappedText(`Name: ${patientData?.name ?? "NA"}`, 30);
    addWrappedText(
      `DOB: ${format(patientData?.dateOfBirth, "PPP") ?? "NA"}`,
      30
    );
    addWrappedText(`Patient ID: ${patientData?.userId ?? "NA"}`, 30);

    // ---------------- CONSULTATION INFO ----------------
    yPos += 10;
    addWrappedText("Consultation Details:", 20, 12, 14);
    addWrappedText(
      `Doctor: ${consultation.doctor} (${consultation.doctorSpecialty})`,
      30
    );
    addWrappedText(
      `Date: ${
        consultation.consultationDate
          ? new Date(consultation.consultationDate).toLocaleDateString()
          : "NA"
      }`,
      30
    );

    addBulletList("Chief Complaint:", consultation.chiefComplaint);
    addBulletList(
      "History of Present Illness:",
      consultation.historyOfPresentIllness
    );
    addBulletList("Physical Examination:", consultation.physicalExamination);
    addBulletList("Diagnosis:", consultation.diagnosis);
    addBulletList("Consultation Notes:", consultation.consultationNotes);

    if (consultation.followUpDate) {
      addWrappedText(
        `Expected Follow-up Date: ${new Date(
          consultation.followUpDate
        ).toLocaleDateString()}`,
        30
      );
    }

    // ---------------- PRESCRIPTIONS ----------------
    yPos += 5;
    addWrappedText("Prescriptions:", 20, 12, 14);

    consultation.prescriptions.forEach((p, index) => {
      addWrappedText(`${index + 1}. ${p.medication}`, 30, 10, 12, [30, 30, 30]);
      addWrappedText(`   Dosage: ${p.dosage}`, 35);
      addWrappedText(`   Frequency: ${p.frequency}`, 35);
      addWrappedText(`   Duration: ${p.duration}`, 35);
      addWrappedText(`   Prescribed by: ${p.prescribedBy}`, 35);

      if (p.instructions) {
        addWrappedText("   Instructions:", 35);
        addWrappedText(p.instructions, 40, 8, 11, [80, 80, 80], 150);
      }

      if (Array.isArray(p.sideEffects) && p.sideEffects.length) {
        addWrappedText("   Possible Side Effects:", 35);
        p.sideEffects.forEach((effect) => {
          addWrappedText(`• ${effect}`, 40, 8, 11, [200, 50, 50], 150);
        });
      }

      yPos += 5;
    });

    // ---------------- FOOTER ----------------
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 30;
    }
    yPos += 10;
    addWrappedText(
      "---- End of Consultation Record ----",
      70,
      10,
      12,
      [120, 120, 120]
    );

    doc.save(`consultation-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCollapseAll = () => {
    const newState = !allCollapsed;
    setAllCollapsed(newState);

    const newMap = {};
    consultationPrescriptions.forEach((c) => (newMap[c.id] = newState));
    setCollapsed(newMap);
  };

  const togglePrescriptionExpand = (id) => {
    setExpandedPrescription((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-bold">
            Loading your prescriptions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <Pill className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>

              <div>
                <span className="text-[20px] lg:text-[24px] font-bold text-slate-900 dark:text-white">
                  My Prescriptions
                </span>
                <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">
                  Prescriptions from consultations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="flex justify-end gap-2 mb-4">
          <Button
            onClick={toggleCollapseAll}
            className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl px-4 py-2 flex items-center gap-2 transition"
          >
            {allCollapsed ? "Expand All" : "Collapse All"}
          </Button>

          <Button
            onClick={() => refreshPrescriptions(patientData.userId)}
            className="btn2"
          >
            <RefreshCw />
            Refresh
          </Button>
        </div>

        {consultationPrescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-emerald-400 via-violet-500 to-blue-500 opacity-20 animate-pulse rounded-full w-48 h-48 mx-auto"></div>
              <div className="relative flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-500 to-violet-600 rounded-3xl shadow-lg ring-2 ring-white/20 dark:ring-slate-800/50">
                <NotepadTextDashed className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-slate-900 dark:text-white">
              No Consultations Found
            </h2>
            <p className="max-w-lg text-slate-600 dark:text-slate-400 text-sm lg:text-base mb-6">
              You don’t have any past consultations or prescriptions yet.
              <br />
              Once you meet with a doctor, your prescribed medicines and reports
              will appear here.
            </p>

            <Button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            {consultationPrescriptions.map((consultation) => {
              const { search = "", status = "all" } =
                filters[consultation.id] || {};

              const filteredPrescriptions = consultation.prescriptions.filter(
                (p) => {
                  const matchesSearch =
                    p.medication.toLowerCase().includes(search.toLowerCase()) ||
                    p.prescribedBy.toLowerCase().includes(search.toLowerCase());

                  const matchesStatus = status === "all" || p.status === status;

                  return matchesSearch && matchesStatus;
                }
              );

              return (
                <div
                  key={consultation.id}
                  className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-4 lg:p-6 shadow-sm"
                >
                  {/* Consultation Header */}
                  <div
                    className="
    bg-gradient-to-r
    from-emerald-50/90 to-emerald-100/70
    dark:from-emerald-900/30 dark:to-emerald-800/20
    backdrop-blur-sm
    border border-emerald-200 dark:border-emerald-700
    rounded-2xl p-4 lg:p-6 mb-6
    shadow-sm
  "
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="
          w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shadow-lg
          bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
        "
                        >
                          <Stethoscope className="w-6 h-6 lg:w-8 lg:h-8" />
                        </div>
                        <div>
                          <h3 className="text-base lg:text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                            {consultation.appointmentType}
                          </h3>
                          <p className="text-xs lg:text-sm text-emerald-700 dark:text-emerald-300">
                            {format(consultation.consultationDate, "PPP")}
                          </p>
                          <p className="text-xs lg:text-sm text-emerald-800/80 dark:text-emerald-200/80">
                            {consultation.doctor} -{" "}
                            {consultation.doctorSpecialty}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() =>
                            downloadDoctorPrescription(
                              consultation,
                              patientData
                            )
                          }
                          className="
          flex-1 inline-flex items-center justify-center gap-2
          bg-gradient-to-r from-emerald-500 to-emerald-600
          hover:from-emerald-600 hover:to-emerald-700
          text-white py-3 px-4 rounded-3xl
          text-sm lg:text-base font-semibold
          transition-all duration-300 shadow-lg hover:shadow-emerald-500/25
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2
        "
                        >
                          <Download className="w-5 h-5" />
                          Download PDF
                        </button>

                        <button
                          onClick={() => toggleCollapse(consultation.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border dark:border-slate-700 text-xs font-medium
             text-emerald-800 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-900/30
             hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-all"
                        >
                          {collapsed[consultation.id] ? (
                            <Expand className="w-5 h-5" />
                          ) : (
                            <BiCollapse className="w-6 h-6" />
                          )}
                          {collapsed[consultation.id] ? "Expand" : "Collapse"}
                        </button>
                      </div>
                    </div>

                    {!collapsed[consultation.id] ? (
                      <>
                        <div className="space-y-3 text-sm lg:text-base">
                          {/* Chief Complaint */}
                          <div>
                            <span className="text-emerald-900 dark:text-emerald-100 font-medium">
                              Chief Complaint:
                            </span>
                            {Array.isArray(consultation.chiefComplaint) &&
                            consultation.chiefComplaint.length > 0 ? (
                              <ul
                                className="
            list-disc list-inside mt-1 space-y-1
            text-emerald-900/90 dark:text-emerald-100/90
            marker:text-emerald-500 dark:marker:text-emerald-400
          "
                              >
                                {consultation.chiefComplaint.map(
                                  (item, index) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-emerald-800/80 dark:text-emerald-200/80">
                                No Chief Complaint provided
                              </p>
                            )}
                          </div>

                          {/* History of Present Illness */}
                          <div>
                            <span className="text-emerald-900 dark:text-emerald-100 font-medium">
                              History of Present Illness:
                            </span>
                            {Array.isArray(
                              consultation.historyOfPresentIllness
                            ) &&
                            consultation.historyOfPresentIllness.length > 0 ? (
                              <ul
                                className="
            list-disc list-inside mt-1 space-y-1
            text-emerald-900/90 dark:text-emerald-100/90
            marker:text-emerald-500 dark:marker:text-emerald-400
          "
                              >
                                {consultation.historyOfPresentIllness.map(
                                  (item, index) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-emerald-800/80 dark:text-emerald-200/80">
                                No History of Present Illness provided
                              </p>
                            )}
                          </div>

                          {/* Physical Examination */}
                          <div>
                            <span className="text-emerald-900 dark:text-emerald-100 font-medium">
                              Physical Examination:
                            </span>
                            {Array.isArray(consultation.physicalExamination) &&
                            consultation.physicalExamination.length > 0 ? (
                              <ul
                                className="
            list-disc list-inside mt-1 space-y-1
            text-emerald-900/90 dark:text-emerald-100/90
            marker:text-emerald-500 dark:marker:text-emerald-400
          "
                              >
                                {consultation.physicalExamination.map(
                                  (item, index) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-emerald-800/80 dark:text-emerald-200/80">
                                No Physical Examination provided
                              </p>
                            )}
                          </div>

                          {/* Diagnosis */}
                          <div>
                            <span className="text-emerald-900 dark:text-emerald-100 font-medium">
                              Diagnosis:
                            </span>
                            {Array.isArray(consultation.diagnosis) &&
                            consultation.diagnosis.length > 0 ? (
                              <ul
                                className="
            list-disc list-inside mt-1 space-y-1
            text-emerald-900/90 dark:text-emerald-100/90
            marker:text-emerald-500 dark:marker:text-emerald-400
          "
                              >
                                {consultation.diagnosis.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-emerald-800/80 dark:text-emerald-200/80">
                                No diagnosis provided
                              </p>
                            )}
                          </div>

                          {/* Consultation Notes */}
                          <div>
                            <span className="text-emerald-900 dark:text-emerald-100 font-medium">
                              Consultation Notes:
                            </span>
                            {Array.isArray(consultation.consultationNotes) &&
                            consultation.consultationNotes.length > 0 ? (
                              <ul
                                className="
            list-disc list-inside mt-1 space-y-1
            text-emerald-900/90 dark:text-emerald-100/90
            marker:text-emerald-500 dark:marker:text-emerald-400
          "
                              >
                                {consultation.consultationNotes.map(
                                  (item, index) => (
                                    <li key={index}>{item}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-emerald-800/80 dark:text-emerald-200/80">
                                No Consultation Notes provided
                              </p>
                            )}
                          </div>

                          {/* Follow-up */}
                          {consultation.followUpDate && (
                            <div className="text-emerald-900/90 dark:text-emerald-100/90">
                              <span className="text-emerald-900 dark:text-emerald-100 font-medium">
                                Expected Follow-up Date:
                              </span>{" "}
                              {format(consultation.followUpDate, "PPP")}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div
                        className="mt-4 bg-emerald-50/50 dark:bg-emerald-900/20 
    border border-emerald-200 dark:border-emerald-700 
    rounded-xl p-4 text-sm text-emerald-800 dark:text-emerald-200 space-y-2"
                      >
                        <p>
                          <span className="font-semibold">Diagnosis:</span>{" "}
                          {consultation.diagnosis?.[0] || "Not specified"}
                          {consultation.diagnosis?.length > 1 && " + more"}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Prescription Count:
                          </span>{" "}
                          {consultation.prescriptions?.length}
                        </p>

                        {consultation.followUpDate && (
                          <p>
                            <span className="font-semibold">Follow-up:</span>{" "}
                            {format(consultation.followUpDate, "PPP")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {!collapsed[consultation.id] && (
                    <>
                      {/* Search and Filter */}
                      <div
                        className="
    bg-white/80 dark:bg-slate-900/60
    backdrop-blur-xl
    border border-slate-200 dark:border-slate-700
    rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-sm
  "
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Search */}
                          <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search medicines or doctors..."
                              value={search}
                              onChange={(e) =>
                                updateFilter(
                                  consultation.id,
                                  "search",
                                  e.target.value
                                )
                              }
                              className="
          w-full pl-12 pr-4 py-3
          rounded-3xl
          bg-white/70 dark:bg-slate-800/70
          border border-slate-300 dark:border-slate-700
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500
          transition-all duration-300
        "
                            />
                          </div>

                          {/* Status filter */}
                          <select
                            value={status}
                            onChange={(e) =>
                              updateFilter(
                                consultation.id,
                                "status",
                                e.target.value
                              )
                            }
                            className="
        px-4 py-3
        rounded-xl
        bg-white/70 dark:bg-slate-800/70
        border border-slate-300 dark:border-slate-700
        text-slate-900 dark:text-slate-100
        focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500
        transition-all duration-300
      "
                          >
                            <option
                              className="bg-white dark:bg-slate-800"
                              value="all"
                            >
                              All Status
                            </option>
                            <option
                              className="bg-white dark:bg-slate-800"
                              value="active"
                            >
                              Active
                            </option>
                            <option
                              className="bg-white dark:bg-slate-800"
                              value="completed"
                            >
                              Completed
                            </option>
                            <option
                              className="bg-white dark:bg-slate-800"
                              value="discontinued"
                            >
                              Discontinued
                            </option>
                            <option
                              className="bg-white dark:bg-slate-800"
                              value="pending"
                            >
                              Pending
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Prescriptions from this consultation */}
                      <div className="space-y-4">
                        <h4 className="text-[16px] lg:text-[18px] font-bold text-slate-900 dark:text-white mb-4">
                          Prescribed Medications
                        </h4>

                        <button
                          onClick={() =>
                            togglePrescriptionExpand(consultation.id)
                          }
                        >
                          {expandedPrescription === consultation.id
                            ? "Collapse"
                            : "Expand"}
                        </button>

                        {filteredPrescriptions.map((prescription) => (
                          <div
                            key={prescription.id}
                            className="
        rounded-2xl p-4 lg:p-6 transition-all duration-300
        bg-white/80 dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-700
        hover:bg-slate-50 dark:hover:bg-slate-800/70
      "
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div
                                  className="
              w-12 h-12 lg:w-16 lg:h-16 rounded-2xl
              flex items-center justify-center shadow-lg
              bg-gradient-to-r from-violet-500 to-violet-600 text-white
            "
                                >
                                  <Pill className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>

                                <div>
                                  <h3 className="text-[16px] lg:text-[18px] font-bold text-slate-900 dark:text-white">
                                    {prescription.medication}
                                  </h3>
                                  <p className="text-xs lg:text-sm text-violet-700 dark:text-violet-300">
                                    {prescription.dosage} -{" "}
                                    {prescription.frequency}
                                  </p>
                                  <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">
                                    Duration: {prescription.duration}
                                  </p>

                                  <div className="flex items-center gap-2 mt-2">
                                    <span
                                      className={[
                                        "px-3 py-1 rounded-full text-[12px] font-medium border",
                                        // Base neutral so your getStatusColor can focus on color accents
                                        "bg-white/70 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700",
                                        getStatusColor(prescription.status), // keep your color util
                                        "flex items-center gap-1",
                                      ].join(" ")}
                                    >
                                      {getStatusIcon(prescription.status)}
                                    </span>
                                  </div>

                                  {/* Active details */}
                                  {prescription.status === "active" && (
                                    <div
                                      className="
                  mt-4 rounded-2xl p-4 lg:p-6
                  bg-violet-50/70 dark:bg-violet-900/20
                  border border-violet-200 dark:border-violet-700
                "
                                    >
                                      <h4 className="text-sm lg:text-base font-semibold text-violet-700 dark:text-violet-300 mb-4">
                                        Prescription Details
                                      </h4>

                                      <div
                                        className="
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
                    text-xs lg:text-sm text-slate-600 dark:text-slate-300
                  "
                                      >
                                        <div className="flex flex-col">
                                          <span className="text-slate-900 dark:text-white">
                                            Cost
                                          </span>
                                          <span className="text-violet-700 dark:text-violet-300">
                                            ₹{prescription.cost || "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-slate-900 dark:text-white">
                                            Dispensed Duration
                                          </span>
                                          <span className="text-violet-700 dark:text-violet-300">
                                            {prescription.dispensedDuration ||
                                              "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-slate-900 dark:text-white">
                                            Next Refill Date
                                          </span>
                                          <span className="text-violet-700 dark:text-violet-300">
                                            {prescription.nextRefillDate ||
                                              "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-slate-900 dark:text-white">
                                            Last Dispensed
                                          </span>
                                          <span className="text-violet-700 dark:text-violet-300">
                                            {prescription.lastDispensedDate ||
                                              "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-slate-900 dark:text-white">
                                            Refills Remaining
                                          </span>
                                          <span
                                            className={
                                              prescription.refillsRemaining ===
                                              0
                                                ? "text-rose-600 dark:text-rose-400 font-semibold"
                                                : "text-violet-700 dark:text-violet-300"
                                            }
                                          >
                                            {prescription.refillsRemaining ?? 0}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Pending */}
                                  {prescription.status === "pending" && (
                                    <div
                                      className="
                  mt-3 rounded-xl p-3
                  bg-amber-50/80 dark:bg-amber-900/20
                  border border-amber-200 dark:border-amber-700
                  text-xs lg:text-sm text-amber-800 dark:text-amber-300
                "
                                    >
                                      <p>
                                        <span className="font-medium">
                                          Pending Reason:
                                        </span>{" "}
                                        {prescription.pharmacistNotes ||
                                          "No reason provided"}
                                      </p>
                                    </div>
                                  )}

                                  {/* Advised Discontinued */}
                                  {prescription.status ===
                                    "advised-discontinued" && (
                                    <div
                                      className="
                  mt-3 rounded-xl p-3
                  bg-rose-50/80 dark:bg-rose-900/20
                  border border-rose-200 dark:border-rose-700
                  text-xs lg:text-sm text-rose-800 dark:text-rose-300
                "
                                    >
                                      <p>
                                        <span className="font-medium">
                                          Discontinuation Advise Reason:
                                        </span>{" "}
                                        {prescription.pharmacistNotes ||
                                          "No reason provided"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleViewDetails(prescription)
                                  }
                                  className="
              p-2 lg:p-3 rounded-xl text-[12px] lg:text-[14px] font-medium
              bg-gradient-to-r from-sky-600 to-sky-700
              hover:from-sky-700 hover:to-sky-800
              text-white transition-all duration-300
              shadow-lg hover:shadow-sky-500/25
            "
                                >
                                  <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                                </button>

                                {/* Request Refill */}
                                {(() => {
                                  const todayIST =
                                    new Date().toLocaleDateString("en-CA", {
                                      timeZone: "Asia/Kolkata",
                                    });

                                  if (
                                    prescription.refillsRemaining > 0 &&
                                    prescription.nextRefillDate === todayIST &&
                                    prescription.status !== "request-refill"
                                  ) {
                                    return (
                                      <div className="flex justify-end">
                                        <button
                                          onClick={() =>
                                            updatePrescriptionStatus(
                                              prescription.id,
                                              "request-refill"
                                            )
                                          }
                                          className="
                      px-4 py-2 lg:px-6 lg:py-3 rounded-xl text-[12px] lg:text-[14px] font-medium
                      bg-gradient-to-r from-sky-600 to-sky-700
                      hover:from-sky-700 hover:to-sky-800
                      text-white transition-all duration-300
                      shadow-lg hover:shadow-sky-500/25
                      flex items-center gap-2
                    "
                                        >
                                          <RefreshCw className="w-4 h-4" />
                                          Request Refill
                                        </button>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}

                                {/* Recommended */}
                                {prescription.status === "recommended" && (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() =>
                                        orderMedicine(
                                          prescription.id,
                                          prescription.medication
                                        )
                                      }
                                      className="
                  flex items-center gap-2
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  hover:from-emerald-600 hover:to-emerald-700
                  text-white px-3 py-2 rounded-lg shadow-md
                  transition-all duration-300
                "
                                    >
                                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                                      Order Medicine
                                    </Button>

                                    <Button
                                      onClick={() =>
                                        requestCancellation(prescription.id)
                                      }
                                      className="
                  flex items-center gap-2
                  bg-gradient-to-r from-rose-500 to-rose-600
                  hover:from-rose-600 hover:to-rose-700
                  text-white px-3 py-2 rounded-lg shadow-md
                  transition-all duration-300
                "
                                    >
                                      <CircleX className="w-4 h-4 lg:w-5 lg:h-5" />
                                      Cancel Medicine
                                    </Button>
                                  </div>
                                )}

                                {/* Active quick actions (example: download) */}
                                {prescription.status === "active" && (
                                  <div className="flex items-center gap-2 lg:gap-3">
                                    <button
                                      className="
                  p-2 lg:p-3 rounded-xl
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  hover:from-emerald-600 hover:to-emerald-700
                  text-white transition-all duration-300
                  shadow-lg hover:shadow-emerald-500/25
                "
                                    >
                                      <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* No Results */}
                      {filteredPrescriptions.length === 0 && (
                        <div className="text-center py-12">
                          <div
                            className="
        w-16 h-16 rounded-2xl mx-auto mb-4
        flex items-center justify-center
        bg-gradient-to-r from-violet-500 to-violet-600 text-white
        shadow-lg ring-1 ring-black/5 dark:ring-white/10
      "
                          >
                            <NotepadTextDashed className="w-8 h-8" />
                          </div>

                          <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-2">
                            No Prescription found
                          </h3>

                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
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
        // onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );
};

export default PatientConsultation;
