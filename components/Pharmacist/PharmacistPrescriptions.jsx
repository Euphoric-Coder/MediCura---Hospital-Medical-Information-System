import React, { useEffect, useState } from "react";
import {
  Plus,
  Pill,
  Search,
  Check,
  X,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Phone,
  ChevronDown,
} from "lucide-react";
import jsPDF from "jspdf";
import { db } from "@/lib/dbConfig";
import { Consultations, Doctors, Patients, Prescriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import FormInput from "../FormUI/FormInput";

const PrescriptionDetailsModal = ({
  isOpen,
  onClose,
  prescription,
  onUpdateStatus,
  onDownloadPDF,
}) => {
  // const [notes, setNotes] = useState("");

  if (!isOpen || !prescription) return null;

  const handleStatusUpdate = (status) => {
    onUpdateStatus(prescription.id, status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              Prescription Review
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Prescription Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-16-bold sm:text-18-bold lg:text-20-bold text-white">
                  {prescription.medication}
                </h3>
                <p className="text-12-regular sm:text-14-regular text-blue-400">
                  {prescription.dosage} - {prescription.frequency}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-12-regular sm:text-14-regular text-dark-700">
              <div>
                <span className="text-white">Patient:</span>{" "}
                {prescription.patientName}
              </div>
              <div>
                <span className="text-white">Patient ID:</span>{" "}
                {prescription.patientId}
              </div>
              <div>
                <span className="text-white">Prescribed by:</span>{" "}
                {prescription.prescribedBy}
              </div>
              <div>
                <span className="text-white">Date:</span>{" "}
                {prescription.prescribedDate}
              </div>
              <div>
                <span className="text-white">Duration:</span>{" "}
                {prescription.duration}
              </div>
              <div>
                <span className="text-white">Refills:</span>{" "}
                {prescription.refills}
              </div>
            </div>
          </div>

          {/* Instructions & Clinical Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Instructions */}
            <div className="bg-green-500/10 rounded-2xl p-4 sm:p-6">
              <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
                Instructions
              </h4>
              <p className="text-12-regular sm:text-14-regular text-green-300">
                {prescription.instructions}
              </p>

              {/* Chief Complaint */}
              {prescription.chiefComplaint && (
                <div className="mt-4">
                  <h5 className="text-12-bold sm:text-14-bold text-white mb-2">
                    Chief Complaint
                  </h5>
                  <ul className="list-disc list-inside text-12-regular sm:text-14-regular text-green-300 space-y-1">
                    {Array.isArray(prescription.chiefComplaint) ? (
                      prescription.chiefComplaint.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))
                    ) : (
                      <li>{prescription.chiefComplaint}</li>
                    )}
                  </ul>
                </div>
              )}

              {/* HPI / History of Present Illness */}
              {prescription.historyOfPresentIllness && (
                <div className="mt-4">
                  <h5 className="text-12-bold sm:text-14-bold text-white mb-2">
                    History of Present Illness
                  </h5>
                  <ul className="list-disc list-inside text-12-regular sm:text-14-regular text-green-300 space-y-1">
                    {Array.isArray(prescription.historyOfPresentIllness) ? (
                      prescription.historyOfPresentIllness.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))
                    ) : (
                      <li>{prescription.historyOfPresentIllness}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Allergies */}
            <div className="bg-pink-500/10 rounded-2xl p-4 sm:p-6">
              <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
                Allergies
              </h4>
              {prescription.allergies && prescription.allergies.length > 0 ? (
                <ul className="list-disc list-inside text-12-regular sm:text-14-regular text-pink-300 space-y-1">
                  {prescription.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-12-regular sm:text-14-regular text-pink-300">
                  None reported
                </p>
              )}
            </div>
          </div>

          {/* Drug Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Side Effects */}
            {prescription.sideEffects.length > 0 ? (
              <div className="bg-yellow-500/10 rounded-2xl p-4 sm:p-6">
                <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
                  Side Effects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prescription.sideEffects.map((effect, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-10-medium sm:text-12-medium text-yellow-400"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 rounded-2xl p-4 sm:p-6">
                <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
                  Side Effects
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-10-medium sm:text-12-medium text-yellow-400">
                    None
                  </span>
                </div>
              </div>
            )}

            {/* Drug Interactions */}
            {prescription.interactions.length > 0 ? (
              <div className="bg-red-500/10 rounded-2xl p-4 sm:p-6">
                <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
                  Drug Interactions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prescription.interactions.map((interaction, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium sm:text-12-medium text-red-400"
                    >
                      {interaction}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 rounded-2xl p-4 sm:p-6">
                <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
                  Drug Interactions
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium sm:text-12-medium text-red-400">
                    None
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pharmacist Notes */}
          <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
            <h4 className="text-14-bold sm:text-16-bold text-white mb-3">
              Pharmacist Notes
            </h4>
            <textarea
              value={prescription.pharmacistNotes || "NA"}
              placeholder="Add any notes about this prescription..."
              className="p-2 rounded-3xl shad-textArea w-full text-white min-h-[100px] resize-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {prescription.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("verified")}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Verify Prescription
                </button>
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  Reject
                </button>
              </>
            )}

            {prescription.status === "verified" && (
              <button
                onClick={() => handleStatusUpdate("dispensed")}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Dispense Medication
              </button>
            )}

            <button
              onClick={() => onDownloadPDF(prescription)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={prescription.status === "dispensed" ? false : true}
            >
              <Download className="w-5 h-5" />
              {prescription.status === "dispensed"
                ? "Download Dispensed Prescription"
                : "Not Yet Dispensed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyPrescriptionModal = ({ prescription, onVerify }) => {
  const [open, setOpen] = useState(false);

  if (!prescription) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                     text-white px-3 py-2 rounded-lg text-sm shadow-lg"
        >
          Verify Prescription
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-[95vw] sm:max-w-md md:max-w-2xl lg:max-w-4xl 
          max-h-[90vh] overflow-y-auto 
          bg-dark-400 border border-blue-500 rounded-3xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-white">Verify Prescription</DialogTitle>
          <DialogDescription className="text-dark-600">
            Review all patient and prescription details before verifying.
          </DialogDescription>
        </DialogHeader>

        {/* Patient & Prescription Details */}
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-dark-600">
            <p>
              <span className="text-white">Patient:</span>{" "}
              {prescription.patientName} ({prescription.patientId})
            </p>
            <p>
              <span className="text-white">Phone:</span>{" "}
              {prescription.patientPhone}
            </p>
            <p>
              <span className="text-white">Prescribed By:</span>{" "}
              {prescription.prescribedBy}
            </p>
            <p>
              <span className="text-white">Date:</span>{" "}
              {prescription.prescribedDate}
            </p>
          </div>

          <div className="bg-dark-500/30 rounded-lg p-3">
            <h4 className="text-white text-sm mb-2">Medication</h4>
            <p className="text-dark-600">
              {prescription.medication} ({prescription.dosage},{" "}
              {prescription.frequency}) — {prescription.duration}
            </p>
          </div>

          {/* Allergies */}
          {Array.isArray(prescription.allergies) &&
          prescription.allergies.length > 0 ? (
            <div className="bg-yellow-500/10 rounded-lg p-3">
              <h4 className="text-yellow-400 text-sm mb-2">Allergies</h4>
              <ul className="list-disc pl-5 text-yellow-300 text-sm">
                {prescription.allergies.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-500/10 rounded-lg p-3">
              <h4 className="text-green-400 text-sm">No reported allergies</h4>
            </div>
          )}

          {/* Consultation Details */}
          <div className="bg-blue-500/10 rounded-lg p-3 space-y-3">
            <h4 className="text-blue-400 text-sm mb-2">Consultation Details</h4>
            {[
              "chiefComplaint",
              "historyOfPresentIllness",
              "physicalExamination",
              "assessment",
              "followUpInstructions",
            ].map(
              (field) =>
                Array.isArray(prescription[field]) &&
                prescription[field].length > 0 && (
                  <div key={field}>
                    <p className="text-white text-sm capitalize mb-1">
                      {field.replace(/([A-Z])/g, " $1")}:
                    </p>
                    <ul className="list-disc pl-5 text-dark-600 text-sm">
                      {prescription[field].map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onVerify(prescription.id);
              setOpen(false);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg"
          >
            Confirm Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DiscontinuePrescriptionModal = ({ prescription, onDiscontinue }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!prescription) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setReason("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     text-white px-3 py-2 rounded-lg text-sm shadow-lg"
        >
          Advise Discontinue
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-dark-400 border border-red-500 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            Advise Discontinue Prescription
          </DialogTitle>
          <DialogDescription className="text-dark-600">
            Provide reasoning for discontinuing this prescription.
          </DialogDescription>
        </DialogHeader>

        {/* Patient + Prescription Context */}
        <div className="space-y-2 text-sm text-dark-700 mb-4">
          <p>
            <span className="text-white">Patient:</span>{" "}
            {prescription.patientName} ({prescription.patientId})
          </p>
          <p>
            <span className="text-white">Medication:</span>{" "}
            {prescription.medication} ({prescription.dosage},{" "}
            {prescription.frequency})
          </p>
          <p>
            <span className="text-white">Prescribed By:</span>{" "}
            {prescription.prescribedBy}
          </p>
        </div>

        {/* Reason Textarea */}
        <div className="mb-4">
          <label className="text-white text-sm mb-2 block">
            Reason for discontinuation:
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Patient allergic to prescribed medicine, interaction risk with existing medication..."
            className="shad-textArea text-white"
            rows={4}
          />
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setReason("");
            }}
            className="bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!reason.trim()) return;
              onDiscontinue(prescription.id, reason.trim());
              setOpen(false);
              setReason("");
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!reason.trim()}
          >
            Confirm Discontinue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DispensePrescriptionModal = ({
  prescription,
  onAction,
  pharmacistId,
}) => {
  const [open, setOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [notes, setNotes] = useState("");

  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);

  // Editable state for prescription fields
  const [form, setForm] = useState({
    medication: "",
    cost: "",
    medicineValidity: "",
    dispensedDuration: "",
    refillsRemaining: "0",
    quantity: "0",
    nextRefillDate: "",
    lastDispensedDate: "",
    sideEffects: [],
    interaction: [],
  });

  const [firstTime, setFirstTime] = useState(false);

  // Temp values for sideEffect / interaction input
  const [sideEffectInput, setSideEffectInput] = useState("");
  const [interactionInput, setInteractionInput] = useState("");

  const fetchMedicines = async () => {
    try {
      const res = await fetch("/api/medicines");
      if (!res.ok) throw new Error("Failed to fetch medicines");
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      toast.error("Unable to load medicines");
    }
  };

  useEffect(() => {
    if (open && prescription) {
      fetchMedicines();
    }
  }, [open, prescription]);

  if (!prescription) return null;

  const handleClose = () => {
    setOpen(false);
    setNotes("");
  };

  const handleAction = (e, status) => {
    e.preventDefault();
    if (status === "pending" && !notes.trim()) {
      toast.error("Notes are required when marking as Pending");
      return;
    }

    const forDispense = {
      quantity: parseInt(form.quantity),
      unitPrice: parseInt(form.cost),
      pharmacistId,
      medication: form.medication,
    };

    const forPrescription = {
      refillsRemaining: parseInt(form.refillsRemaining),
      nextRefillDate: form.nextRefillDate,
      lastDispensedDate: form.lastDispensedDate,
      dispensedDuration: form.dispensedDuration,
      medicineValidity: form.medicineValidity,
      sideEffects: form.sideEffects,
      interaction: form.interaction,
      cost: parseInt(form.cost),
      pharmacistNotes: notes,
    };

    onAction(prescription.id, forDispense, forPrescription, form.medicationId);

    setNotes("");
    setForm({
      medicationId: "",
      medication: "",
      cost: "",
      medicineValidity: "",
      dispensedDuration: "",
      refillsRemaining: "0",
      quantity: "0",
      nextRefillDate: "",
      lastDispensedDate: "",
      sideEffects: [],
      interaction: [],
    });
    setFirstTime(false);

    handleClose();
  };

  const handleAddItem = (field, value) => {
    if (!value.trim()) return;
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
    if (field === "sideEffects") setSideEffectInput("");
    if (field === "interaction") setInteractionInput("");
  };

  const handleRemoveItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setNotes("");
          setForm({
            medication: "",
            cost: "",
            medicineValidity: "",
            dispensedDuration: "",
            refillsRemaining: "0",
            quantity: "0",
            nextRefillDate: "",
            lastDispensedDate: "",
            sideEffects: [],
            interaction: [],
          });
          setFirstTime(false);
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                     text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium 
                     transition-all duration-300 shadow-lg hover:shadow-green-500/25"
        >
          Dispense
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg md:max-w-3xl bg-dark-400 border border-green-600 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Dispense Medication</DialogTitle>
          <DialogDescription className="text-dark-600">
            Update prescription details before dispensing.
          </DialogDescription>
        </DialogHeader>

        {/* Editable Prescription Form */}
        <div className="space-y-4 py-4">
          {/* Current Prescribed Medicine Info */}
          <div className="mb-6 p-4 rounded-xl bg-dark-500/40 border border-dark-600">
            <h4 className="text-white text-sm font-semibold mb-2">
              Prescribed Medicine
            </h4>
            <p className="text-dark-600 text-sm">
              <span className="text-white">Name:</span>{" "}
              {prescription?.medication}
            </p>
            <p className="text-dark-600 text-sm">
              <span className="text-white">Dosage:</span> {prescription?.dosage}
              {prescription?.frequency ? ` — ${prescription.frequency}` : ""}
            </p>
            <p className="text-dark-600 text-sm">
              <span className="text-white">Duration:</span>{" "}
              {prescription?.duration}
            </p>
          </div>

          {/* Dropdown for Medicines */}
          <div className="mb-4">
            <label className="shad-input-label block mb-2">
              Select Dispensed Medicine
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMedicineDropdown(!showMedicineDropdown)}
                className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
              >
                <span className="text-white">
                  {form.medication || "Select Medicine"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-dark-600 transition-transform ${
                    showMedicineDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Medicine Dropdown */}
              {showMedicineDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                  <div className="p-3 border-b border-dark-500">
                    <span className="text-14-medium text-dark-700">
                      Available Medicines
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {medicines.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            medicationId: m.id,
                            medication: m.name,
                            cost: m.unitPrice || "",
                            medicineValidity: m.expiryDate || "",
                          }));
                          setShowMedicineDropdown(false);
                        }}
                        className="w-full p-4 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                      >
                        <span className="text-16-medium text-white">
                          {m.name}
                        </span>
                        {form.medication === m.name && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Auto-filled Cost */}
          <div>
            <label className="text-white text-sm mb-2 block">Cost</label>
            <input
              type="text"
              value={form.cost || ""}
              readOnly
              className="w-full px-3 py-2 rounded-lg bg-dark-300 border border-dark-500 text-white font-bold 
               placeholder-dark-600 outline-none cursor-not-allowed"
            />
          </div>

          {/* Auto-filled Medicine Validity */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Medicine Validity
            </label>
            <input
              type="text"
              value={form.medicineValidity || ""}
              readOnly
              className="w-full px-3 py-2 rounded-lg bg-dark-300 border border-dark-500 text-white font-bold 
               placeholder-dark-600 outline-none cursor-not-allowed"
            />
          </div>

          <FormInput
            label="Dispensed Duration"
            type="text"
            value={form.dispensedDuration}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                dispensedDuration: e.target.value,
              }))
            }
          />

          <FormInput
            label="Refills Remaining"
            type="number"
            value={form.refillsRemaining}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                refillsRemaining: e.target.value,
              }))
            }
          />

          <FormInput
            label="Quantity (for Inventory Management)"
            type="number"
            value={form.quantity}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                quantity: e.target.value,
              }))
            }
          />

          <FormInput
            label="Next Refill Date"
            type="date"
            value={form.nextRefillDate}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                nextRefillDate: e.target.value,
              }))
            }
          />

          <FormInput
            label="Last Dispensed Date"
            type="date"
            value={form.lastDispensedDate}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                lastDispensedDate: e.target.value,
              }))
            }
            disabled={firstTime}
          />

          {/* First Time Checkbox */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="firstTime"
              checked={form.firstTime}
              onChange={(e) => setFirstTime(e.target.checked)}
              className="w-4 h-4 accent-green-500 cursor-pointer"
            />
            <label
              htmlFor="firstTime"
              className="text-sm text-white cursor-pointer"
            >
              First Time Dispense
            </label>
          </div>

          {/* Side Effects */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Side Effects
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={sideEffectInput}
                onChange={(e) => setSideEffectInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-dark-300 border border-dark-600 text-white 
                 placeholder-dark-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                placeholder="Add side effect"
              />
              <Button
                size="sm"
                onClick={() => handleAddItem("sideEffects", sideEffectInput)}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.sideEffects.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 flex items-center gap-2"
                >
                  {s}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem("sideEffects", i)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Interactions */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Drug Interactions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interactionInput}
                onChange={(e) => setInteractionInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-dark-300 border border-dark-600 text-white 
                 placeholder-dark-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                placeholder="Add interaction"
              />
              <Button
                size="sm"
                onClick={() => handleAddItem("interaction", interactionInput)}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.interaction.map((i, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 flex items-center gap-2"
                >
                  {i}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveItem("interaction", idx)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Pharmacist Notes */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Pharmacist Notes{" "}
              <span className="text-green-400">
                (Optional for Dispense, Required for Pending)
              </span>
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter pharmacist notes..."
              className="shad-textArea text-white"
              rows={4}
            />
          </div>
        </div>

        {/* Actions */}
        <DialogFooter className="w-full flex justify-end gap-3">
          <DialogClose
            variant="secondary"
            onClick={handleClose}
            className="w-full p-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-3xl"
          >
            Cancel
          </DialogClose>
          <Button
            onClick={(e) => handleAction(e, "pending")}
            disabled={!notes.trim()}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark Pending
          </Button>
          <Button
            onClick={(e) => handleAction(e, "dispensed")}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-3xl"
          >
            Confirm Dispense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PharmacistPrescriptions = ({ onBack, pharmacistData }) => {
  const [prescriptions, setPrescriptions] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    getPharmacistPrescriptions();
  }, []);

  const getPharmacistPrescriptions = async () => {
    const rows = await db
      .select({
        id: Prescriptions.id,
        medication: Prescriptions.medication,
        dosage: Prescriptions.dosage,
        frequency: Prescriptions.frequency,
        duration: Prescriptions.duration,
        status: Prescriptions.status,
        instructions: Prescriptions.instructions,
        cost: Prescriptions.cost,
        refills: Prescriptions.refillsRemaining,
        prescribedDate: Prescriptions.createdAt,
        chiefComplaint: Consultations.chiefComplaint,
        historyOfPresentIllness: Consultations.historyOfPresentIllness,
        physicalExamination: Consultations.physicalExamination,
        assessment: Consultations.assessment,
        followUpInstructions: Consultations.followUpInstructions,
        sideEffects: Prescriptions.sideEffects,
        interactions: Prescriptions.interaction,
        pharmacistNotes: Prescriptions.pharmacistNotes,

        patientId: Patients.userId,
        patientName: Patients.name,
        patientPhone: Patients.phone,
        allergies: Patients.allergies,

        doctorName: Doctors.name,
      })
      .from(Prescriptions)
      .leftJoin(
        Consultations,
        eq(Prescriptions.consultationId, Consultations.id)
      )
      .leftJoin(Patients, eq(Consultations.patientId, Patients.userId))
      .leftJoin(Doctors, eq(Consultations.doctorId, Doctors.userId));

    const data = rows.map((row) => ({
      id: row.id,
      patientName: row.patientName,
      patientId: row.patientId,
      patientPhone: row.patientPhone,
      allergies: row.allergies,
      medication: row.medication,
      dosage: row.dosage,
      frequency: row.frequency,
      duration: row.duration,
      prescribedBy: row.doctorName,
      prescribedDate: row.prescribedDate?.toISOString().split("T")[0] ?? "",
      status: row.status,
      chiefComplaint: row.chiefComplaint,
      historyOfPresentIllness: row.historyOfPresentIllness,
      physicalExamination: row.physicalExamination,
      assessment: row.assessment,
      followUpInstructions: row.followUpInstructions,
      instructions: row.instructions,
      refills: row.refills || 0,
      cost: row.cost || 0,
      sideEffects: row.sideEffects || [],
      interactions: row.interactions || [],
      pharmacistNotes: row.pharmacistNotes,
      reason: "", // can hydrate from Consultation.assessment or plan
    }));

    setPrescriptions(data);
    // Format for frontend
    console.log(data);
  };

  const refreshPrescriptions = () => {
    getPharmacistPrescriptions();
  };

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.medication
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || prescription.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const generatePrescriptionPDF = (prescription) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("MediCura Pharmacy", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567 | Email: pharmacy@medicura.com", 20, 50);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("PRESCRIPTION DISPENSING RECORD", 20, 70);

    // Pharmacist Information
    doc.setFontSize(14);
    doc.text("Dispensing Pharmacist:", 20, 90);
    doc.setFontSize(12);
    doc.text("PharmD. Michael Chen", 30, 105);
    doc.text("License: RPH123456", 30, 115);
    doc.text(`Dispensed Date: ${new Date().toLocaleDateString()}`, 30, 125);

    // Patient Information
    doc.setFontSize(14);
    doc.text("Patient Information:", 20, 145);
    doc.setFontSize(12);
    doc.text(`Patient: ${prescription.patientName}`, 30, 160);
    doc.text(`Patient ID: ${prescription.patientId}`, 30, 170);
    doc.text(`Phone: ${prescription.patientPhone}`, 30, 180);

    // Prescription Details
    doc.setFontSize(14);
    doc.text("Prescription Details:", 20, 200);
    doc.setFontSize(12);
    doc.text(`Medication: ${prescription.medication}`, 30, 215);
    doc.text(`Dosage: ${prescription.dosage}`, 30, 225);
    doc.text(`Frequency: ${prescription.frequency}`, 30, 235);
    doc.text(`Duration: ${prescription.duration}`, 30, 245);
    doc.text(`Refills: ${prescription.refills}`, 30, 255);
    doc.text(`Prescribed by: ${prescription.prescribedBy}`, 30, 265);
    doc.text(`Cost: $${prescription.cost.toFixed(2)}`, 30, 275);

    // Instructions
    doc.setFontSize(14);
    doc.text("Instructions:", 20, 295);
    doc.setFontSize(12);
    const instructionLines = doc.splitTextToSize(
      prescription.instructions,
      160
    );
    doc.text(instructionLines, 30, 310);

    doc.save(
      `prescription-dispensed-${prescription.medication
        .toLowerCase()
        .replace(/\s+/g, "-")}-${prescription.id}.pdf`
    );
  };

  const handleUpdateStatus = async (prescriptionId, status, notes) => {
    const prescription = prescriptions.find((p) => p.id === prescriptionId);

    const toastId = toast.loading(
      `Updating status for "${prescription?.medication}"...`
    );

    try {
      const res = await fetch("/api/prescription-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId,
          status,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update prescription status");
      }

      let message = "";
      switch (status) {
        case "verified":
          message = `Medicine "${prescription?.medication}" verified for ${prescription?.patientName}`;
          break;
        case "pending":
          message = `Medicine "${prescription?.medication}" marked as pending for ${prescription?.patientName}`;
          break;
        case "advised-discontinued":
          message = `Prescription advised to discontinue for ${prescription?.patientName}`;
          break;
        default:
          message = `Prescription status updated`;
      }

      if (status === "advised-discontinued") {
        toast.error(message, { id: toastId });
      } else {
        toast.success(message, { id: toastId });
      }

      refreshPrescriptions();
      setMessage(message);
      setMessageType(status === "advised-discontinued" ? "error" : "success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error("Error updating prescription:", error);

      // 🔹 Update toast to error
      toast.error("Failed to update prescription status", { id: toastId });
    }
  };

  const handleDispenseMedicine = async (
    id,
    dispenseData,
    prescriptionData,
    medicineId
  ) => {
    try {
      const load = toast.loading("Dispensing Medicine...");

      console.log({
        medicineId: medicineId,
        pharmacistId: id,
        dispenseData,
        prescriptionData,
      });

      const updatedPrescriptionData = { ...prescriptionData, status: "active" };

      const res = await fetch(`/api/medicines/${medicineId}/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dispenseData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to dispense medicine");
      }

      if (prescriptionData) {
        await db
          .update(Prescriptions)
          .set(updatedPrescriptionData)
          .where(eq(Prescriptions.id, id));
      }

      toast.dismiss(load);

      refreshPrescriptions();

      toast.success(
        `Medicine ${dispenseData.medication} dispensed successfully!`
      );

      setMessage(`Medicine ${dispenseData.medication} dispensed successfully!`);
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      toast.error("Failed to dispense medicine", error);
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
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

  const getStatusBadge = (status, priority) => {
    const baseClasses =
      "flex items-center gap-2 px-3 py-1 rounded-full text-10-medium sm:text-12-medium";

    switch (status) {
      case "pending":
        return (
          <div
            className={`${baseClasses} ${
              priority === "urgent"
                ? "bg-red-500/20 border border-red-500/30"
                : "bg-yellow-500/20 border border-yellow-500/30"
            }`}
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

      case "ordered":
        return (
          <div
            className={`${baseClasses} bg-purple-500/20 border border-purple-500/30 text-purple-400`}
          >
            <Clock className="w-3 h-3" />
            <span>Ordered</span>
          </div>
        );

      case "active":
        return (
          <div
            className={`${baseClasses} bg-cyan-500/20 border border-cyan-500/30 text-cyan-400`}
          >
            <CheckCircle className="w-3 h-3" />
            <span className="">Active</span>
          </div>
        );

      case "verified":
        return (
          <div
            className={`${baseClasses} bg-blue-500/20 border border-blue-500/30 text-blue-400`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>Verified</span>
          </div>
        );

      case "dispensed":
        return (
          <div
            className={`${baseClasses} bg-green-500/20 border border-green-500/30 text-green-400`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>Dispensed</span>
          </div>
        );

      case "advised-discontinued":
        return (
          <div
            className={`${baseClasses} bg-orange-500/20 border border-orange-500/30 text-orange-400`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Advised Discontinued</span>
          </div>
        );

      default:
        return null;
    }
  };

  const getActionButtons = (prescription) => {
    switch (prescription.status) {
      case "ordered":
        return (
          <div className="flex gap-2">
            <VerifyPrescriptionModal
              prescription={prescription}
              onVerify={(id) => handleUpdateStatus(id, "verified")}
            />
            <DiscontinuePrescriptionModal
              prescription={prescription}
              onDiscontinue={(id, reason) =>
                handleUpdateStatus(id, "advised-discontinued", reason)
              }
            />
          </div>
        );
      case "verified":
        return (
          <DispensePrescriptionModal
            prescription={prescription}
            onAction={(id, dispenseData, prescriptionData, medicineId) => {
              console.log("Prescription Id: ", id);
              console.log(
                "Dispense data:",
                dispenseData,
                "Prescription data:",
                prescriptionData
              );
              console.log("Medicine Id:", medicineId);
              handleDispenseMedicine(
                id,
                dispenseData,
                prescriptionData,
                medicineId
              );
            }}
            pharmacistId={pharmacistData.userId}
          />
        );
      case "dispensed":
        return (
          <div className="text-12-medium lg:text-14-medium text-green-400 px-3 lg:px-4 py-2">
            Completed
          </div>
        );
      case "rejected":
        return (
          <div className="text-12-medium lg:text-14-medium text-red-400 px-3 lg:px-4 py-2">
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

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
    (p) => p.priority === "urgent" && p.status === "pending"
  ).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  Prescription Management
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Verify and dispense medications
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
                  placeholder="Search by patient name, medication, or ID..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {[
                  "all",
                  "active",
                  "ordered",
                  "pending",
                  "verified",
                  "dispensed",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 ${
                      statusFilter === status
                        ? "bg-blue-500 text-white"
                        : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Pill className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Prescriptions
              </h2>
            </div>

            <div className="space-y-4">
              {filteredPrescriptions
                .filter(
                  (prescription) =>
                    prescription.status !== "discontinued" &&
                    prescription.status !== "request-cancellation"
                )
                .map((prescription) => (
                  <div
                    key={prescription.id}
                    className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Pill className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                        </div>

                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <h3 className="text-16-bold lg:text-20-bold text-white">
                              {prescription.medication}
                            </h3>
                            {getStatusBadge(
                              prescription.status,
                              prescription.priority
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                            <div>
                              <span className="text-white">Patient:</span>{" "}
                              {prescription.patientName} (
                              {prescription.patientId})
                            </div>
                            <div>
                              <span className="text-white">Dosage:</span>{" "}
                              {prescription.dosage}
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
                            <div>
                              <span className="text-white">Cost:</span> $
                              {prescription.cost}
                            </div>
                          </div>

                          <div className="bg-dark-500/30 rounded-lg px-3 py-2">
                            <p className="text-10-regular lg:text-12-regular text-dark-600">
                              <span className="text-white">Instructions:</span>{" "}
                              {prescription.instructions}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-row flex-col lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(prescription)}
                            className="flex gap-1 items-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <button className="flex gap-1 items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                            <Phone className="w-4 h-4" /> Phone
                          </button>
                        </div>
                        {getActionButtons(prescription)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <Pill className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No prescriptions found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No prescriptions match your current search criteria. Try
                  adjusting your filters.
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
        onUpdateStatus={handleUpdateStatus}
        onDownloadPDF={handleDownloadPDF}
      />
    </>
  );
};

export default PharmacistPrescriptions;
