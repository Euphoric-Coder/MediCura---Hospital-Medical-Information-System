import React, { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  Stethoscope,
  Pill,
  TestTube,
  Bed,
  Save,
  Mic,
  MicOff,
  User,
  Calendar,
  Clock,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown,
  Check,
  RefreshCcw,
} from "lucide-react";
import { db } from "@/lib/dbConfig";
import {
  Appointments,
  Consultations,
  LabTests,
  Patients,
  Prescriptions,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Button } from "../ui/button";

const admissionTypes = [
  "General Ward",
  "ICU",
  "CCU (Cardiac Care Unit)",
  "Emergency Department",
  "Surgery",
  "Maternity Ward",
  "Pediatric Ward",
  "Psychiatric Unit",
];

const DynamicListSection = ({
  field,
  label,
  placeholder,
  consultationData,
  handleInputChange,
  color = "blue",
}) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      handleInputChange(field, [
        ...(consultationData[field] || []),
        newItem.trim(),
      ]);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    const updated = consultationData[field].filter((_, i) => i !== index);
    handleInputChange(field, updated);
  };

  // Map of colors → Tailwind classes
  const colorMap = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    teal: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };

  const appliedClasses = colorMap[color] || colorMap.blue;

  return (
    <div className="mt-8">
      <label className="shad-input-label block mb-2">{label}</label>
      <div className="space-y-3">
        {/* Existing Items */}
        {consultationData[field]?.length > 0 && (
          <div className="space-y-2">
            {consultationData[field].map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg p-3 ${appliedClasses}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${appliedClasses
                      .split(" ")[0]
                      .replace("/10", "")}`}
                  ></div>
                  <span className="text-14-regular text-white">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Item */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder={placeholder}
            className="shad-input flex-1 text-white"
          />
          <button
            type="button"
            onClick={addItem}
            className={`px-4 py-2 rounded-lg text-14-medium transition-colors ${
              color === "blue"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : color === "green"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : color === "yellow"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : color === "purple"
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : color === "red"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : color === "teal"
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const MedicineDropdown = ({ selectedMedicine, setSelectedMedicine }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([
    "Paracetamol 500mg",
    "Ibuprofen 400mg",
    "Amoxicillin 500mg",
    "Azithromycin 250mg",
    "Multivitamin Tablet",
  ]);

  // Filter medicines by search input
  const filteredMedicines = medicines.filter((med) =>
    med.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDropdown(false);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      e.preventDefault();
      if (!medicines.includes(search)) {
        setMedicines([...medicines, search]);
      }
      setSelectedMedicine(search);
      setShowDropdown(false);
      setSearch("");
    }
  };

  return (
    <div className="relative w-full">
      <label className="shad-input-label block mb-2">Medicine Name</label>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-purple-500 transition-colors"
      >
        <span className="text-white">
          {selectedMedicine || "Select or search medicine"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-dark-600 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-dark-500">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or type to add..."
              className="w-full bg-dark-300 border border-dark-500 rounded-lg px-3 py-2 text-white placeholder-dark-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Medicine Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <button
                  key={medicine}
                  type="button"
                  onClick={() => handleSelect(medicine)}
                  className="w-full p-3 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                >
                  <span className="text-16-medium text-white">{medicine}</span>
                  {selectedMedicine === medicine && (
                    <Check className="w-5 h-5 text-purple-500" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-14-regular text-dark-600">
                Press <span className="text-white font-medium">Enter</span> to
                add “{search}”
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LabTestsSection = ({ consultationData, setConsultationData }) => {
  const [labTests, setLabTests] = useState([
    // Hematology
    { id: "1", name: "CBC", category: "Hematology" },
    { id: "2", name: "Hemoglobin", category: "Hematology" },
    { id: "3", name: "Hematocrit (PCV)", category: "Hematology" },
    { id: "4", name: "Platelet Count", category: "Hematology" },
    { id: "5", name: "Peripheral Smear", category: "Hematology" },

    // Chemistry
    { id: "6", name: "Blood Sugar (Fasting)", category: "Chemistry" },
    { id: "7", name: "Blood Sugar (PP)", category: "Chemistry" },
    { id: "8", name: "Blood Sugar (Random)", category: "Chemistry" },
    { id: "9", name: "HbA1c", category: "Chemistry" },
    { id: "10", name: "Lipid Profile", category: "Chemistry" },
    { id: "11", name: "Liver Function Test (LFT)", category: "Chemistry" },
    { id: "12", name: "Kidney Function Test (KFT)", category: "Chemistry" },
    { id: "13", name: "Uric Acid", category: "Chemistry" },
    { id: "14", name: "Serum Calcium", category: "Chemistry" },
    { id: "15", name: "Serum Electrolytes (Na, K, Cl)", category: "Chemistry" },

    // Radiology
    { id: "16", name: "X-Ray Chest", category: "Radiology" },
    { id: "17", name: "X-Ray Abdomen", category: "Radiology" },
    { id: "18", name: "X-Ray Spine", category: "Radiology" },
    { id: "19", name: "Ultrasound Abdomen", category: "Radiology" },
    { id: "20", name: "Ultrasound Pelvis", category: "Radiology" },
    { id: "21", name: "CT Brain", category: "Radiology" },
    { id: "22", name: "MRI Brain", category: "Radiology" },
    { id: "23", name: "Mammography", category: "Radiology" },
    { id: "24", name: "Echocardiography", category: "Radiology" },

    // Cardiology
    { id: "25", name: "ECG", category: "Cardiology" },
    { id: "26", name: "TMT (Stress Test)", category: "Cardiology" },
    { id: "27", name: "Holter Monitoring", category: "Cardiology" },
    {
      id: "28",
      name: "Cardiac Enzymes (CK-MB, Troponin)",
      category: "Cardiology",
    },

    // Microbiology
    { id: "29", name: "Urine Routine & Microscopy", category: "Microbiology" },
    { id: "30", name: "Urine Culture & Sensitivity", category: "Microbiology" },
    { id: "31", name: "Blood Culture & Sensitivity", category: "Microbiology" },
    {
      id: "32",
      name: "Sputum Culture & Sensitivity",
      category: "Microbiology",
    },
    { id: "33", name: "Stool Routine & Culture", category: "Microbiology" },

    // Immunology & Serology
    { id: "34", name: "HIV Test", category: "Immunology" },
    {
      id: "35",
      name: "Hepatitis B Surface Antigen (HBsAg)",
      category: "Immunology",
    },
    { id: "36", name: "Hepatitis C Antibody", category: "Immunology" },
    { id: "37", name: "Widal Test (Typhoid)", category: "Immunology" },
    { id: "38", name: "Dengue NS1 Antigen", category: "Immunology" },
    { id: "39", name: "Dengue IgM/IgG", category: "Immunology" },
    { id: "40", name: "Malaria Antigen Test", category: "Immunology" },

    // Endocrinology & Hormones
    {
      id: "41",
      name: "Thyroid Profile (T3, T4, TSH)",
      category: "Endocrinology",
    },
    { id: "42", name: "Prolactin", category: "Endocrinology" },
    { id: "43", name: "Cortisol", category: "Endocrinology" },
    {
      id: "44",
      name: "FSH (Follicle Stimulating Hormone)",
      category: "Endocrinology",
    },
    { id: "45", name: "LH (Luteinizing Hormone)", category: "Endocrinology" },
    { id: "46", name: "Testosterone", category: "Endocrinology" },
    { id: "47", name: "Estrogen", category: "Endocrinology" },
    { id: "48", name: "Progesterone", category: "Endocrinology" },

    // Miscellaneous
    { id: "49", name: "Vitamin D", category: "General" },
    { id: "50", name: "Vitamin B12", category: "General" },
  ]);

  const [newTestName, setNewTestName] = useState("");
  const [newTestCategory, setNewTestCategory] = useState("General");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    "Hematology",
    "Chemistry",
    "Radiology",
    "Cardiology",
    "General",
  ];

  // ✅ Toggle test selection (store full object, not just id)
  const handleLabTestToggle = (test) => {
    setConsultationData((prev) => {
      const exists = prev.labTests.find((t) => t.id === test.id);
      return {
        ...prev,
        labTests: exists
          ? prev.labTests.filter((t) => t.id !== test.id)
          : [...prev.labTests, test],
      };
    });
  };

  // ✅ Add a new test
  const handleAddLabTest = () => {
    if (!newTestName.trim()) return;
    const newTest = {
      id: Date.now().toString(),
      name: newTestName.trim(),
      category: newTestCategory,
    };
    setLabTests((prev) => [...prev, newTest]); // add to available list
    setConsultationData((prev) => ({
      ...prev,
      labTests: [...prev.labTests, newTest], // store full object
    }));
    setNewTestName("");
  };

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <TestTube className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-16-bold lg:text-18-bold text-white">
          Order Lab Tests
        </h3>
      </div>

      {/* Search + Add Test */}
      <div className="flex items-center justify-center flex-col gap-4 mb-3">
        <input
          type="text"
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddLabTest();
            }
          }}
          placeholder="Search or add new test..."
          className="w-full shad-input p-3 rounded-xl flex-1 text-white"
        />
        {/* Category Dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full bg-dark-400 border border-dark-500 rounded-lg px-3 py-2 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
          >
            <span>{newTestCategory}</span>
            <ChevronDown
              className={`w-4 h-4 text-dark-600 transition-transform ${
                showCategoryDropdown ? "rotate-180" : ""
              }`}
            />
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setNewTestCategory(cat);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full px-3 py-2 flex items-center justify-between hover:bg-dark-500 text-white"
                >
                  <span>{cat}</span>
                  {newTestCategory === cat && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddLabTest}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      {/* List of Available Lab Tests */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {labTests.map((test) => {
          const isSelected = consultationData.labTests.some(
            (t) => t.id === test.id
          );
          return (
            <label
              key={test.id}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-500/10 transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleLabTestToggle(test)}
                className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
              />
              <div className="flex-1 min-w-0">
                <div className="text-12-medium lg:text-14-medium text-white">
                  {test.name}
                </div>
                <div className="text-10-regular lg:text-12-regular text-green-400">
                  {test.category}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Selected Tests */}
      {consultationData.labTests.length > 0 && (
        <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
          <div className="text-10-medium lg:text-12-medium text-green-400">
            Selected Tests:
          </div>
          <ul className="list-disc list-inside text-12-regular text-white mt-2">
            {consultationData.labTests.map((t) => (
              <li key={t.id}>
                {t.name} <span className="text-green-400">({t.category})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const DoctorConsultations = ({ onBack, doctorData }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationData, setConsultationData] = useState({
    patientId: "",
    chiefComplaint: [],
    historyOfPresentIllness: [],
    physicalExamination: [],
    assessment: [],
    plan: [],
    prescriptions: [],
    labTests: [],
    admissionRequired: false,
    admissionType: "",
    admissionReason: "",
    followUpInstructions: [],
    nextAppointment: "",
  });

  const [newPrescription, setNewPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Mock patients for today's consultations
  const todayPatients = [
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      reason: "Annual check-up",
      appointmentTime: "10:00 AM",
    },
    {
      id: "P002",
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      reason: "Follow-up visit",
      appointmentTime: "11:30 AM",
    },
    {
      id: "P003",
      name: "Michael Brown",
      age: 67,
      gender: "Male",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      reason: "Chest pain evaluation",
      appointmentTime: "2:00 PM",
    },
  ];

  const fetchPatients = async () => {
    try {
      const todayStr = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

      const data = await db
        .select({
          id: Appointments.id,
          date: Appointments.date,
          time: Appointments.time,
          reason: Appointments.reason,
          status: Appointments.status,
          workflow: Appointments.workflow,
          type: Appointments.type,
          bookingDate: Appointments.bookingDate,
          updatedAt: Appointments.updatedAt,
          notes: Appointments.notes,

          // patient data
          patient: {
            userId: Patients.userId,
            avatar: Patients.avatar,
            name: Patients.name,
            email: Patients.email,
            phone: Patients.phone,
            gender: Patients.gender,
            address: Patients.address,
            dateOfBirth: Patients.dateOfBirth,
            emergencyContactName: Patients.emergencyContactName,
            emergencyPhone: Patients.emergencyPhone,
            allergies: Patients.allergies,
            currentMedications: Patients.currentMedications,
            familyMedicalHistory: Patients.familyMedicalHistory,
            pastMedicalHistory: Patients.pastMedicalHistory,
          },
        })
        .from(Appointments)
        .innerJoin(Patients, eq(Appointments.patientId, Patients.userId))
        .where(eq(Appointments.doctorId, doctorData.userId))
        .where(eq(Appointments.date, todayStr));

      // Map into simplified array for UI
      const mappedPatients = data.map((apt) => {
        let age = "";
        if (apt.patient.dateOfBirth) {
          const dob = new Date(apt.patient.dateOfBirth);
          const diff = Date.now() - dob.getTime();
          age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        return {
          id: apt.patient.userId,
          name: apt.patient.name,
          age,
          gender: apt.patient.gender,
          avatar: apt.patient.avatar,
          reason: apt.reason,
          notes: apt.notes,
          workflow: apt.workflow,
          appointmentTime: apt.time,
          appointmentId: apt.id,
        };
      });

      console.log("Mapped patients for UI:", mappedPatients);
      setPatients(mappedPatients);
      return mappedPatients;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };

  const refreshPatientAppointment = async (appointmentId) => {
    try {
      const updatedPatients = await fetchPatients();

      if (appointmentId) {
        // console.log("Refresh Id: ", appointmentId);
        const updatedPatient = updatedPatients.find(
          (p) => p.appointmentId === appointmentId
        );
        if (updatedPatient) {
          setSelectedPatient(updatedPatient);
        }
      }
    } catch (error) {
      console.error("Error refreshing patient appointment:", error);
    }
  };

  const getStatusTracker = (workflow, patientName) => {
    const steps = [
      { key: "scheduled", label: "Scheduled" },
      { key: "waiting", label: "Waiting" },
      { key: "arrived", label: "Arrived" },
      { key: "checked-in", label: "Checked In" },
      { key: "completed", label: "Completed" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === workflow);

    return (
      <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
        <div className="text-center py-12 lg:py-20">
          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
            <Clock className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
          </div>
          <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
            Appointment Status
          </h3>
          <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto mb-8">
            Tracking status for{" "}
            <span className="text-white font-semibold">{patientName}</span>’s
            appointment.
          </p>

          {/* Status Tracker */}
          <div className="flex justify-center gap-4 lg:gap-8 flex-wrap">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;

              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center ${
                    isActive
                      ? "text-green-400"
                      : isCompleted
                      ? "text-green-500"
                      : "text-dark-600"
                  }`}
                >
                  {/* Step Circle */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                      isActive
                        ? "border-green-400 bg-green-500/20 animate-pulse"
                        : isCompleted
                        ? "border-green-500 bg-green-500/20"
                        : "border-dark-500 bg-dark-500/20"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : isActive ? (
                      <Clock className="w-5 h-5 text-green-400 animate-pulse" />
                    ) : (
                      <Clock className="w-5 h-5 text-dark-600" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="mt-2 text-12-medium">{step.label}</span>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden lg:block h-1 w-12 my-2 ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                          ? "bg-green-400 animate-pulse"
                          : "bg-dark-500/50"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setConsultationData((prev) => ({
      ...prev,
      patientId: patient.id,
    }));
  };

  const handleInputChange = (field, value) => {
    setConsultationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      setConsultationData((prev) => ({
        ...prev,
        prescriptions: [...prev.prescriptions, newPrescription],
      }));
      setNewPrescription({
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      });
    }
  };

  const handleRemovePrescription = (index) => {
    setConsultationData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
  };

  const handleSaveConsultation = async () => {
    setIsSaving(true);
    try {
      const consultation = await db
        .insert(Consultations)
        .values({
          doctorId: doctorData.userId,
          patientId: consultationData.patientId,
          appointmentId: selectedPatient.appointmentId || null,

          chiefComplaint: consultationData.chiefComplaint,
          historyOfPresentIllness: consultationData.historyOfPresentIllness,
          physicalExamination: consultationData.physicalExamination,
          assessment: consultationData.assessment,
          plan: consultationData.plan,

          admissionRequired: consultationData.admissionRequired,
          admissionType: consultationData.admissionType,
          admissionReason: consultationData.admissionReason,

          followUpInstructions: consultationData.followUpInstructions,
          nextAppointment: consultationData.nextAppointment || null,
        })
        .returning({ id: Consultations.id });

      const consultationId = consultation[0].id;

      if (consultationData.prescriptions.length > 0) {
        await db.insert(Prescriptions).values(
          consultationData.prescriptions.map((pres) => ({
            consultationId,
            medication: pres.medication,
            dosage: pres.dosage,
            frequency: pres.frequency,
            duration: pres.duration,
            instructions: pres.instructions,
          }))
        );
      }

      if (consultationData.labTests.length > 0) {
        await db.insert(LabTests).values(
          consultationData.labTests.map((test) => ({
            consultationId,
            testName: test.name,
            category: test.category,
          }))
        );
      }

      const appointment = await db
        .update(Appointments)
        .set({
          status: "completed",
          workflow: "completed",
          updatedAt: new Date(),
        })
        .where(eq(Appointments.id, selectedPatient.appointmentId));

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage("Consultation saved successfully");
      setMessageType("success");

      // Reset form
      setConsultationData({
        patientId: "",
        chiefComplaint: "",
        historyOfPresentIllness: "",
        physicalExamination: "",
        assessment: "",
        plan: "",
        prescriptions: [],
        labTests: [],
        admissionRequired: false,
        admissionType: "",
        admissionReason: "",
        followUpInstructions: "",
        nextAppointment: "",
      });
      setSelectedPatient(null);
    } catch (error) {
      setMessage("Error saving consultation");
      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to get status badge
  const getStatusBadge = (status, isUrgent) => {
    const baseClasses =
      "flex items-center gap-1 px-2 py-1 rounded-full text-10-medium sm:text-12-medium";

    if (isUrgent) {
      return (
        <div
          className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400">Urgent</span>
        </div>
      );
    }

    switch (status) {
      case "scheduled":
        return (
          <div
            className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-400">Scheduled</span>
          </div>
        );

      case "waiting":
        return (
          <div
            className={`${baseClasses} bg-orange-500/20 border border-orange-500/30`}
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400">Waiting</span>
          </div>
        );

      case "arrived":
        return (
          <div
            className={`${baseClasses} bg-yellow-500/20 border border-yellow-500/30`}
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-400">Arrived</span>
          </div>
        );

      case "checked-in":
        return (
          <div
            className={`${baseClasses} bg-teal-500/20 border border-teal-500/30`}
          >
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-teal-400">Checked-In</span>
          </div>
        );

      case "in-consultation":
        return (
          <div
            className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400">In Consultation</span>
          </div>
        );

      case "completed":
        return (
          <div
            className={`${baseClasses} bg-gray-500/20 border border-gray-500/30`}
          >
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-gray-400">Completed</span>
          </div>
        );

      case "cancelled":
        return (
          <div
            className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-400">Cancelled</span>
          </div>
        );

      case "no-show":
        return (
          <div
            className={`${baseClasses} bg-pink-500/20 border border-pink-500/30`}
          >
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span className="text-pink-400">No Show</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <span className="text-20-bold lg:text-24-bold text-white">
                Patient Consultations
              </span>
              <p className="text-12-regular lg:text-14-regular text-dark-700">
                Write consultation notes and prescriptions
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h2 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Today's Patients
              </h2>

              <div className="space-y-3">
                {patients
                  .filter(
                    (patient) =>
                      patient.workflow !== "cancelled" &&
                      patient.workflow !== "no-show"
                  )
                  .map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className={`w-full p-3 lg:p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedPatient?.id === patient.id
                          ? "border-green-500 bg-green-500/10"
                          : "border-dark-500 hover:border-dark-400 bg-dark-400/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-14-semibold lg:text-16-semibold text-white truncate">
                            {patient.name}
                          </h3>
                          <p className="text-12-regular text-dark-700">
                            {patient.appointmentTime}
                          </p>
                          <p className="text-10-regular lg:text-12-regular text-dark-600 truncate">
                            {patient.reason}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="lg:col-span-3">
            {selectedPatient ? (
              <div className="space-y-6 lg:space-y-8">
                {/* Patient Header */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl object-cover border-2 border-dark-500/50"
                    />
                    <div>
                      <h1 className="text-20-bold lg:text-32-bold text-white mb-2 flex items-center gap-3">
                        {selectedPatient.name}
                        {getStatusBadge(
                          selectedPatient.workflow,
                          selectedPatient.isUrgent
                        )}
                      </h1>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-14-regular lg:text-16-regular text-dark-700">
                        <span>
                          {selectedPatient.age} years, {selectedPatient.gender}
                        </span>
                        <span>Today's Consultation</span>
                        <span>{selectedPatient.appointmentTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  <Button
                    className="w-full md:w-auto btn2"
                    onClick={() =>
                      refreshPatientAppointment(selectedPatient.appointmentId)
                    }
                  >
                    <RefreshCcw />
                    Refresh Status
                  </Button>
                </div>

                {selectedPatient &&
                  selectedPatient.workflow !== "in-consultation" &&
                  getStatusTracker(
                    selectedPatient.workflow,
                    selectedPatient.name
                  )}

                {/* Made Consultation Form Visible Only for In-Consultation */}
                {selectedPatient.workflow === "in-consultation" && (
                  <div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                      {/* Main Consultation Form */}
                      <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        {/* Clinical Notes */}
                        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
                          <div className="flex items-center gap-3 mb-6 lg:mb-8">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                              <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                            </div>
                            <h2 className="text-18-bold lg:text-24-bold text-white">
                              Clinical Notes
                            </h2>
                          </div>

                          <div className="space-y-6">
                            {/* Chief Complaint */}
                            <DynamicListSection
                              field="chiefComplaint"
                              label="Chief Complaint"
                              placeholder="ex: Severe headache since morning"
                              consultationData={consultationData}
                              handleInputChange={handleInputChange}
                              color="blue"
                            />

                            {/* History of Present Illness */}
                            <DynamicListSection
                              field="historyOfPresentIllness"
                              label="History of Present Illness"
                              placeholder="ex: Symptoms started 2 weeks ago"
                              consultationData={consultationData}
                              handleInputChange={handleInputChange}
                              color="green"
                            />

                            {/* Physical Examination */}
                            <DynamicListSection
                              field="physicalExamination"
                              label="Physical Examination"
                              placeholder="ex: Elevated heart rate observed"
                              consultationData={consultationData}
                              handleInputChange={handleInputChange}
                              color="yellow"
                            />

                            {/* Assessment */}
                            <DynamicListSection
                              field="assessment"
                              label="Assessment & Diagnosis"
                              placeholder="ex: Hypertension"
                              consultationData={consultationData}
                              handleInputChange={handleInputChange}
                              color="purple"
                            />

                            {/* Treatment Plan */}
                            <DynamicListSection
                              field="plan"
                              label="Treatment Plan"
                              placeholder="ex: Start antihypertensive medication"
                              consultationData={consultationData}
                              handleInputChange={handleInputChange}
                              color="teal"
                            />

                            {/* Follow-up Instructions */}
                            <DynamicListSection
                              field="followUpInstructions"
                              label="Follow-up Instructions"
                              placeholder="ex: Monitor BP daily, reduce salt, follow up in 2 weeks"
                              consultationData={consultationData}
                              handleInputChange={handleInputChange}
                              color="orange"
                            />

                            {/* Next Appointment */}
                            <div>
                              <label className="shad-input-label block mb-2">
                                Next Appointment
                              </label>
                              <input
                                type="date"
                                value={consultationData.nextAppointment}
                                onChange={(e) =>
                                  handleInputChange(
                                    "nextAppointment",
                                    e.target.value
                                  )
                                }
                                className="shad-input w-full text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Side Panel */}
                      <div className="space-y-6 lg:space-y-8">
                        {/* Prescriptions */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
                          <div className="flex items-center gap-3 mb-4 lg:mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Pill className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-16-bold lg:text-18-bold text-white">
                              Prescriptions
                            </h3>
                          </div>

                          {/* Add New Prescription */}
                          <div className="space-y-3 mb-4">
                            {/* Medication Dropdown */}
                            <MedicineDropdown
                              selectedMedicine={newPrescription.medication}
                              setSelectedMedicine={(value) =>
                                setNewPrescription((prev) => ({
                                  ...prev,
                                  medication: value,
                                }))
                              }
                            />

                            {/* Dosage & Frequency */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="shad-input-label block mb-1">
                                  Dosage
                                </label>
                                <input
                                  type="text"
                                  value={newPrescription.dosage}
                                  onChange={(e) =>
                                    setNewPrescription((prev) => ({
                                      ...prev,
                                      dosage: e.target.value,
                                    }))
                                  }
                                  placeholder="Ex: 500mg"
                                  className="shad-input w-full text-white text-10-regular lg:text-12-regular"
                                />
                              </div>
                              <div>
                                <label className="shad-input-label block mb-1">
                                  Frequency
                                </label>
                                <input
                                  type="text"
                                  value={newPrescription.frequency}
                                  onChange={(e) =>
                                    setNewPrescription((prev) => ({
                                      ...prev,
                                      frequency: e.target.value,
                                    }))
                                  }
                                  placeholder="Ex: 2 times a day"
                                  className="shad-input w-full text-white text-10-regular lg:text-12-regular"
                                />
                              </div>
                            </div>

                            {/* Duration */}
                            <div>
                              <label className="shad-input-label block mb-1">
                                Duration
                              </label>
                              <input
                                type="text"
                                value={newPrescription.duration}
                                onChange={(e) =>
                                  setNewPrescription((prev) => ({
                                    ...prev,
                                    duration: e.target.value,
                                  }))
                                }
                                placeholder="Ex: 5 days"
                                className="shad-input w-full text-white text-12-regular lg:text-14-regular"
                              />
                            </div>

                            {/* Instructions */}
                            <div>
                              <label className="shad-input-label block mb-1">
                                Special Instructions
                              </label>
                              <textarea
                                value={newPrescription.instructions}
                                onChange={(e) =>
                                  setNewPrescription((prev) => ({
                                    ...prev,
                                    instructions: e.target.value,
                                  }))
                                }
                                placeholder="Ex: Take after meals"
                                className="shad-textArea w-full text-white min-h-[60px] resize-none text-10-regular lg:text-12-regular"
                                rows={2}
                              />
                            </div>

                            {/* Add Button */}
                            <button
                              onClick={handleAddPrescription}
                              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-12-medium lg:text-14-medium transition-colors"
                            >
                              Add Prescription
                            </button>
                          </div>

                          {/* Prescription List */}
                          <div className="space-y-3">
                            {consultationData.prescriptions.map(
                              (prescription, index) => (
                                <div
                                  key={index}
                                  className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-14-medium text-white">
                                      {prescription.medication}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleRemovePrescription(index)
                                      }
                                      className="text-red-400 hover:text-red-300 text-10-regular lg:text-12-regular"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  <div className="text-10-regular lg:text-12-regular text-purple-300">
                                    {prescription.dosage} -{" "}
                                    {prescription.frequency}
                                  </div>
                                  <div className="text-10-regular lg:text-12-regular text-purple-300">
                                    Duration: {prescription.duration}
                                  </div>
                                  {prescription.instructions && (
                                    <div className="text-10-regular lg:text-12-regular text-purple-300 mt-1">
                                      Instructions: {prescription.instructions}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Lab Tests */}
                        <LabTestsSection
                          consultationData={consultationData}
                          setConsultationData={setConsultationData}
                        />

                        {/* TODO: Later on  */}
                        {/* Hospital Admission */}
                        {/* <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-4 lg:mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Bed className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-16-bold lg:text-18-bold text-white">
                          Hospital Admission
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consultationData.admissionRequired}
                            onChange={(e) =>
                              setConsultationData((prev) => ({
                                ...prev,
                                admissionRequired: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                          />
                          <span className="text-14-medium text-white">
                            Admission Required
                          </span>
                        </label>

                        {consultationData.admissionRequired && (
                          <div className="space-y-3">
                            <select
                              value={consultationData.admissionType}
                              onChange={(e) =>
                                handleInputChange(
                                  "admissionType",
                                  e.target.value
                                )
                              }
                              className="shad-select-trigger w-full text-white text-12-regular lg:text-14-regular"
                            >
                              <option value="">Select admission type</option>
                              {admissionTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <textarea
                              value={consultationData.admissionReason}
                              onChange={(e) =>
                                handleInputChange(
                                  "admissionReason",
                                  e.target.value
                                )
                              }
                              placeholder="Reason for admission..."
                              className="shad-textArea w-full text-white min-h-[80px] resize-none text-12-regular lg:text-14-regular"
                              rows={3}
                            />
                          </div>
                        )}
                      </div>
                    </div> */}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={onBack}
                        className="text-14-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
                      >
                        ← Back to Dashboard
                      </button>

                      <button
                        onClick={handleSaveConsultation}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Consultation
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
                <div className="text-center py-12 lg:py-20">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                    <Stethoscope className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                  </div>
                  <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                    Select a Patient
                  </h3>
                  <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                    Choose a patient from today's appointments to start the
                    consultation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultations;
