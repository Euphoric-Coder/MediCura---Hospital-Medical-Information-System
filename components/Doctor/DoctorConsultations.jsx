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
import { toast } from "sonner";

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
    blue: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 marker:bg-blue-500",
    green:
      "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 marker:bg-emerald-500",
    yellow:
      "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 marker:bg-amber-500",
    purple:
      "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 marker:bg-purple-500",
    red: "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 marker:bg-rose-500",
    teal: "bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 marker:bg-teal-500",
    orange:
      "bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 marker:bg-orange-500",
  };
  const btnMap = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    green: "bg-emerald-600 hover:bg-emerald-700 text-white",
    yellow: "bg-amber-600 hover:bg-amber-700 text-white",
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    red: "bg-rose-600 hover:bg-rose-700 text-white",
    teal: "bg-teal-600 hover:bg-teal-700 text-white",
    orange: "bg-orange-600 hover:bg-orange-700 text-white",
  };

  const appliedClasses = colorMap[color] || colorMap.blue;
  const btnClasses = btnMap[color] || btnMap.blue;

  return (
    <div className="mt-8 border-b border-slate-100 dark:border-slate-800/60 pb-8 last:border-0 last:pb-0">
      <label className="text-16-bold text-slate-900 dark:text-white block mb-4 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${appliedClasses.match(/marker:(bg-[^\s]+)/)?.[1] || "bg-blue-500"}`}
        ></div>
        {label}
      </label>
      <div className="space-y-4">
        {consultationData[field]?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {consultationData[field].map((item, index) => (
              <div
                key={index}
                className={`flex items-start justify-between rounded-2xl p-4 border transition-all hover:shadow-md ${appliedClasses.replace(/marker:[^\s]+/g, "")}`}
              >
                <div className="flex items-start gap-3 mt-0.5">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                  <span className="text-14-medium leading-relaxed">{item}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-900/50 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="relative group">
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
            className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl pl-5 pr-32 py-4 text-15-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800 focus:border-slate-300 outline-none transition-all shadow-sm group-hover:shadow-md"
          />
          <button
            type="button"
            onClick={addItem}
            className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl text-14-medium transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${btnClasses}`}
          >
            <span>Add</span>
            <Plus className="w-4 h-4" />
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
    med.toLowerCase().includes(search.toLowerCase()),
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
      <label className="text-13-medium text-slate-700 dark:text-slate-300 block mb-1.5 font-medium ml-1">
        Medicine Name <span className="text-rose-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className={`w-full bg-slate-50 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border ${showDropdown ? "border-purple-500 shadow-[0_0_0_4px_rgba(168,85,247,0.15)] dark:shadow-[0_0_0_4px_rgba(168,85,247,0.2)]" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"} rounded-2xl px-5 py-4 text-left text-15-medium text-slate-700 dark:text-slate-200 flex items-center justify-between transition-all cursor-pointer shadow-sm`}
      >
        <span
          className={
            selectedMedicine
              ? "text-slate-900 dark:text-white"
              : "text-slate-400"
          }
        >
          {selectedMedicine || "Search or select medicine..."}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showDropdown ? "rotate-180 text-purple-500" : ""}`}
        />
      </button>

      {showDropdown && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to search or add..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-14-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/15 focus:border-purple-300 dark:focus:border-purple-500/50 outline-none transition-all shadow-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <button
                  key={medicine}
                  type="button"
                  onClick={() => handleSelect(medicine)}
                  className={`w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left text-14-medium group ${selectedMedicine === medicine ? "text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-500/10 font-semibold" : "text-slate-700 dark:text-slate-300"}`}
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    {medicine}
                  </span>
                  {selectedMedicine === medicine && (
                    <Check className="w-4 h-4 text-purple-500" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-6 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                  <Pill className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-14-medium text-slate-900 dark:text-white mb-1">
                  Medicine not found
                </div>
                <div className="text-13-regular text-slate-500">
                  Press{" "}
                  <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-12-semibold font-sans">
                    Enter
                  </kbd>{" "}
                  to add "{search}"
                </div>
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
    <div className="bg-white dark:bg-[#0B1120] backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 lg:p-10 shadow-lg relative">
      {/* Inner teal glow */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/3 pointer-events-none"></div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-600/20 dark:to-teal-500/10 rounded-2xl flex items-center justify-center border border-teal-200/50 dark:border-teal-500/20 shadow-inner">
          <TestTube className="w-7 h-7 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-24-bold lg:text-28-bold text-slate-900 dark:text-white mb-1">
            Order Lab Tests
          </h3>
          <p className="text-14-medium text-slate-500 dark:text-slate-400">
            Recommend path tests & imaging
          </p>
        </div>
      </div>

      {/* Search + Add Test */}
      <div className="flex flex-col gap-4 mb-6">
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
          className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-14-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/50 outline-none transition-all shadow-sm"
        />
        <div className="flex gap-3">
          {/* Category Dropdown */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full bg-slate-50 dark:bg-slate-900/50 border ${showCategoryDropdown ? "border-teal-500 shadow-[0_0_0_2px_rgba(20,184,166,0.2)]" : "border-slate-200 dark:border-slate-800"} rounded-xl px-4 py-3 text-left text-14-medium text-slate-700 dark:text-slate-200 flex items-center justify-between transition-all cursor-pointer shadow-sm`}
            >
              <span>{newTestCategory}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showCategoryDropdown ? "rotate-180 text-teal-500" : ""
                }`}
              />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="max-h-60 overflow-y-auto py-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setNewTestCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left text-14-medium ${newTestCategory === cat ? "text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-500/10 font-semibold" : "text-slate-700 dark:text-slate-300"}`}
                    >
                      <span>{cat}</span>
                      {newTestCategory === cat && (
                        <Check className="w-4 h-4 text-teal-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddLabTest}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl transition-all shadow-sm shadow-slate-200 dark:shadow-none hover:shadow-md text-14-medium whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>

      {/* List of Available Lab Tests */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {labTests.map((test) => {
          const isSelected = consultationData.labTests.some(
            (t) => t.id === test.id,
          );
          return (
            <button
              type="button"
              key={test.id}
              onClick={() => handleLabTestToggle(test)}
              className={`w-full text-left flex items-center gap-4 cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${isSelected ? "bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-500/10 dark:to-emerald-500/10 border-teal-300 dark:border-teal-500/50 shadow-sm" : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500/50 hover:shadow-md"}`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isSelected ? "bg-teal-500 border-teal-500 text-white scale-110 shadow-[0_0_12px_rgba(20,184,166,0.4)]" : "bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600"}`}
              >
                {isSelected && <Check className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`text-15-semibold transition-colors duration-300 ${isSelected ? "text-teal-900 dark:text-teal-100" : "text-slate-900 dark:text-slate-100"}`}
                >
                  {test.name}
                </div>
                <div
                  className={`text-13-medium transition-colors duration-300 mt-0.5 ${isSelected ? "text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  {test.category}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tests */}
      {consultationData.labTests.length > 0 && (
        <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-500/10 rounded-2xl border border-teal-100 dark:border-teal-500/20">
          <div className="text-13-semibold text-teal-800 dark:text-teal-300 mb-3 flex items-center justify-between">
            <span>Selected Tests ({consultationData.labTests.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {consultationData.labTests.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-500/30 pl-3 pr-1 py-1 rounded-lg shadow-sm"
              >
                <span className="text-13-medium text-slate-800 dark:text-slate-200">
                  {t.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLabTestToggle(t);
                  }}
                  className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-1 rounded-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
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
          appointmentType: apt.type,
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
        const updatedPatient = updatedPatients.find(
          (p) => p.appointmentId === appointmentId,
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
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-blue-500/20 shadow-sm">
            <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-24-bold text-slate-900 dark:text-white mb-3">
            Appointment Status
          </h3>
          <p className="text-16-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tracking status for{" "}
            <span className="text-slate-900 dark:text-white font-semibold">
              {patientName}
            </span>
            ’s appointment.
          </p>
        </div>

        <div className="flex justify-center gap-2 lg:gap-6 flex-wrap relative">
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full"></div>
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center relative z-10 w-24"
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl border-4 transition-all duration-500 shadow-sm ${isActive ? "border-blue-100 dark:border-blue-900/50 bg-blue-600 dark:bg-blue-500 text-white scale-110 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : isCompleted ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-500 text-white" : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400"}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Clock
                      className={`w-6 h-6 ${isActive ? "animate-pulse" : ""}`}
                    />
                  )}
                </div>
                <span
                  className={`mt-4 text-13-semibold text-center ${isActive ? "text-blue-600 dark:text-blue-400" : isCompleted ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
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
      const loading = toast.loading("Saving consultation...");

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
          })),
        );
      }

      if (consultationData.labTests.length > 0) {
        await db.insert(LabTests).values(
          consultationData.labTests.map((test) => ({
            consultationId,
            testName: test.name,
            category: test.category,
          })),
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

      toast.dismiss(loading);
      toast.success("Consultation saved successfully");
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

      refreshPatientAppointment(selectedPatient.appointmentId);
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
            className={`${baseClasses} bg-blue-100/80 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Scheduled</span>
          </div>
        );

      case "waiting":
        return (
          <div
            className={`${baseClasses} bg-amber-100/80 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400`}
          >
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span>Waiting</span>
          </div>
        );

      case "arrived":
        return (
          <div
            className={`${baseClasses} bg-yellow-100/80 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400`}
          >
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Arrived</span>
          </div>
        );

      case "checked-in":
        return (
          <div
            className={`${baseClasses} bg-teal-100/80 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400`}
          >
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></div>
            <span>Checked-In</span>
          </div>
        );

      case "in-consultation":
        return (
          <div
            className={`${baseClasses} bg-emerald-100/80 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400`}
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span>In Consultation</span>
          </div>
        );

      case "completed":
        return (
          <div
            className={`${baseClasses} bg-slate-100 dark:bg-slate-500/20 border border-slate-200 dark:border-slate-500/30 text-slate-600 dark:text-slate-400`}
          >
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span>Completed</span>
          </div>
        );

      case "cancelled":
        return (
          <div
            className={`${baseClasses} bg-rose-100/80 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400`}
          >
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            <span>Cancelled</span>
          </div>
        );

      case "no-show":
        return (
          <div
            className={`${baseClasses} bg-purple-100/80 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400`}
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>No Show</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
        <div className="max-w-8xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
              <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <span className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                Patient Consultations
              </span>
              <p className="text-13-regular lg:text-14-regular text-slate-500 dark:text-slate-400">
                Write consultation notes and prescriptions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl border mb-6 lg:mb-8 shadow-sm transition-all animate-in fade-in slide-in-from-top-4 ${messageType === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300"}`}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span className="text-14-medium font-medium">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 lg:p-6 shadow-sm sticky top-28">
              <h2 className="text-16-bold lg:text-18-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />{" "}
                Today's Patients
              </h2>

              <div className="space-y-3">
                {patients
                  .filter(
                    (patient) =>
                      patient.workflow !== "cancelled" &&
                      patient.workflow !== "no-show",
                  )
                  .map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className={`w-full p-3 lg:p-4 rounded-2xl border-2 transition-all duration-300 text-left cursor-pointer group ${
                        selectedPatient?.id === patient.id
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.1)] shadow-sm"
                          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="w-11 h-11 lg:w-12 lg:h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105"
                        />
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`text-14-bold lg:text-15-semibold truncate ${selectedPatient?.id === patient.id ? "text-emerald-900 dark:text-emerald-100" : "text-slate-900 dark:text-white"}`}
                          >
                            {patient.name}
                          </h3>
                          <p className="text-12-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {patient.appointmentTime}
                          </p>
                          <p
                            className={`text-11-medium truncate mt-1 ${selectedPatient?.id === patient.id ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
                          >
                            {patient.appointmentType}
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
                <div className="bg-white dark:bg-emerald-900/10 backdrop-blur-xl border border-slate-200 dark:border-emerald-500/20 rounded-3xl p-5 lg:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-8">
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <h1 className="text-24-bold lg:text-32-bold text-slate-900 dark:text-white">
                          {selectedPatient.name}
                        </h1>
                        {getStatusBadge(
                          selectedPatient.workflow,
                          selectedPatient.isUrgent,
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-14-medium lg:text-15-medium text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-lg">
                          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          {selectedPatient.age} years, {selectedPatient.gender}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />{" "}
                          Today's Consultation
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />{" "}
                          {selectedPatient.appointmentTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  <Button
                    className="w-full md:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm rounded-xl py-5"
                    onClick={() =>
                      refreshPatientAppointment(selectedPatient.appointmentId)
                    }
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                </div>

                {selectedPatient &&
                  selectedPatient.workflow !== "in-consultation" &&
                  getStatusTracker(
                    selectedPatient.workflow,
                    selectedPatient.name,
                  )}

                {/* Made Consultation Form Visible Only for In-Consultation */}
                {selectedPatient.workflow === "in-consultation" && (
                  <div>
                    <div className="flex flex-col space-y-6 lg:space-y-8">
                      {/* Main Consultation Form */}
                      <div className="w-full space-y-6 lg:space-y-8">
                        {/* Clinical Notes */}
                        <div className="bg-white dark:bg-[#0B1120] backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 lg:p-10 shadow-lg relative">
                          {/* Inner soft gradient light */}
                          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-600/20 dark:to-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-200/50 dark:border-blue-500/20 shadow-inner">
                                <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h2 className="text-24-bold lg:text-28-bold text-slate-900 dark:text-white mb-1">
                                  Clinical Notes
                                </h2>
                                <p className="text-14-medium text-slate-500 dark:text-slate-400">
                                  Detailed patient examination and assessment
                                </p>
                              </div>
                            </div>
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
                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80">
                              <label className="text-16-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                Next Appointment
                                <span className="text-13-normal text-slate-400 font-normal ml-2">
                                  (Optional)
                                </span>
                              </label>
                              <div className="relative max-w-sm">
                                <input
                                  type="date"
                                  value={consultationData.nextAppointment}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "nextAppointment",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-slate-50 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl px-5 py-4 text-15-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-300 dark:focus:border-blue-500/50 outline-none transition-all shadow-sm [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Side Panel */}
                      <div className="w-full space-y-6 lg:space-y-8">
                        {/* Prescriptions */}
                        <div className="w-full bg-white dark:bg-[#0B1120] backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 lg:p-10 shadow-lg relative">
                          {/* Inner purple glow */}
                          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/3 pointer-events-none"></div>
                          </div>

                          <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-600/20 dark:to-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-200/50 dark:border-purple-500/20 shadow-inner">
                                <Pill className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h3 className="text-24-bold lg:text-28-bold text-slate-900 dark:text-white mb-1">
                                  Prescriptions
                                </h3>
                                <p className="text-14-medium text-slate-500 dark:text-slate-400">
                                  Add and manage medications
                                </p>
                              </div>
                            </div>
                            {consultationData.prescriptions.length > 0 && (
                              <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-13-bold px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-500/30 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                                {consultationData.prescriptions.length} Added
                              </span>
                            )}
                          </div>

                          {/* Add New Prescription */}
                          <div className="space-y-5 bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 mb-8">
                            <h4 className="text-14-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                              <Plus className="w-4 h-4 text-purple-500" /> Add
                              New Medication
                            </h4>

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
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-13-medium text-slate-700 dark:text-slate-300 block mb-1.5 font-medium ml-1">
                                  Dosage{" "}
                                  <span className="text-rose-500">*</span>
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
                                  placeholder="500mg, 10ml..."
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-14-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/15 focus:border-purple-300 dark:focus:border-purple-500/50 outline-none transition-all shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="text-13-medium text-slate-700 dark:text-slate-300 block mb-1.5 font-medium ml-1">
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
                                  placeholder="1-0-1, Twice daily..."
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-14-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/15 focus:border-purple-300 dark:focus:border-purple-500/50 outline-none transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Duration */}
                            <div>
                              <label className="text-13-medium text-slate-700 dark:text-slate-300 block mb-1.5 font-medium ml-1">
                                Duration
                              </label>
                              <div className="relative">
                                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={newPrescription.duration}
                                  onChange={(e) =>
                                    setNewPrescription((prev) => ({
                                      ...prev,
                                      duration: e.target.value,
                                    }))
                                  }
                                  placeholder="5 Days, 1 Month..."
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-14-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/15 focus:border-purple-300 dark:focus:border-purple-500/50 outline-none transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Instructions */}
                            <div>
                              <label className="text-13-medium text-slate-700 dark:text-slate-300 block mb-1.5 font-medium ml-1">
                                Instructions{" "}
                                <span className="text-slate-400 font-normal">
                                  (Optional)
                                </span>
                              </label>
                              <textarea
                                value={newPrescription.instructions}
                                onChange={(e) =>
                                  setNewPrescription((prev) => ({
                                    ...prev,
                                    instructions: e.target.value,
                                  }))
                                }
                                placeholder="Take after food..."
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-14-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/15 focus:border-purple-300 dark:focus:border-purple-500/50 outline-none transition-all shadow-sm min-h-[80px] resize-none"
                                rows={2}
                              />
                            </div>

                            {/* Add Button */}
                            <button
                              onClick={handleAddPrescription}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 px-4 rounded-xl text-15-semibold transition-all shadow-sm shadow-purple-500/20 dark:shadow-none hover:shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                            >
                              <Plus className="w-5 h-5 flex-shrink-0" /> Add to
                              Prescription
                            </button>
                          </div>

                          {/* Prescription List */}
                          {consultationData.prescriptions.length > 0 ? (
                            <div className="space-y-4">
                              <h4 className="text-16-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />{" "}
                                Prescribed Medications
                              </h4>
                              <div className="grid gap-4">
                                {consultationData.prescriptions.map(
                                  (prescription, index) => (
                                    <div
                                      key={index}
                                      className="group bg-white dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-500/30 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                                    >
                                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3">
                                          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 text-13-bold shadow-sm">
                                            {index + 1}
                                          </div>
                                          <div>
                                            <div className="text-16-bold text-slate-900 dark:text-white">
                                              {prescription.medication}
                                            </div>
                                            <div className="text-13-medium text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mt-0.5">
                                              {prescription.dosage}{" "}
                                              <span className="w-1 h-1 rounded-full bg-purple-300 dark:bg-purple-600"></span>{" "}
                                              {prescription.frequency}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleRemovePrescription(index)
                                          }
                                          className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/10 p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>

                                      <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-13-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                          <Clock className="w-4 h-4 text-slate-400" />
                                          {prescription.duration ||
                                            "Not specified"}
                                        </div>
                                        {prescription.instructions && (
                                          <div className="flex items-center gap-2 text-13-medium text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-100 dark:border-amber-500/20">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            <span
                                              className="truncate"
                                              title={prescription.instructions}
                                            >
                                              {prescription.instructions}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Pill className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                              </div>
                              <h4 className="text-15-semibold text-slate-700 dark:text-slate-300 mb-1">
                                No Prescriptions Yet
                              </h4>
                              <p className="text-13-regular text-slate-500 dark:text-slate-500">
                                Add medications using the form above
                              </p>
                            </div>
                          )}
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
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={onBack}
                        className="text-14-medium lg:text-16-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                      >
                        ← Back to Dashboard
                      </button>

                      <button
                        onClick={handleSaveConsultation}
                        disabled={isSaving}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-600 disabled:border-transparent disabled:cursor-not-allowed text-white px-8 lg:px-10 py-3 lg:py-4 rounded-xl text-15-semibold lg:text-16-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2.5"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
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
              <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-sm h-full flex flex-col justify-center">
                <div className="text-center py-12 lg:py-20">
                  <div className="w-20 h-20 lg:w-28 lg:h-28 bg-emerald-50 dark:bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                    <Stethoscope className="w-10 h-10 lg:w-14 lg:h-14 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-24-bold lg:text-32-bold text-slate-900 dark:text-white mb-4 lg:mb-6">
                    Select a Patient
                  </h3>
                  <p className="text-15-regular lg:text-18-regular text-slate-500 dark:text-slate-400 max-w-md lg:max-w-xl mx-auto leading-relaxed">
                    Choose a patient from today's appointments on the left to
                    start the consultation and clinical notes.
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
