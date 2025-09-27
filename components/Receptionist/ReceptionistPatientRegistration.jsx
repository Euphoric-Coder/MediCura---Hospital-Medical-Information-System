import React, { useState } from "react";
import {
  Plus,
  UserPlus,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Upload,
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  ChevronDown,
  X,
  Briefcase,
} from "lucide-react";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { registerPatient } from "@/lib/registerPatient";

const ReceptionistPatientRegistration = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyPhone: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: [],
    currentMedications: [],
    pastMedicalHistory: [],
    familyMedicalHistory: [],
    primaryPhysician: "",
    insuranceCard: null,
    idDocument: null,
  });

  const commonAllergies = [
    "Penicillin",
    "Peanuts",
    "Tree nuts",
    "Shellfish",
    "Fish",
    "Eggs",
    "Milk",
    "Soy",
    "Wheat",
    "Sesame",
    "Latex",
    "Dust mites",
    "Pollen",
    "Pet dander",
    "Aspirin",
    "Ibuprofen",
    "Sulfa drugs",
    "Codeine",
    "Morphine",
    "Contrast dye",
  ];

  const commonMedications = [
    "Lisinopril",
    "Metformin",
    "Amlodipine",
    "Metoprolol",
    "Omeprazole",
    "Simvastatin",
    "Losartan",
    "Albuterol",
    "Hydrochlorothiazide",
    "Atorvastatin",
    "Levothyroxine",
    "Ibuprofen",
    "Acetaminophen",
    "Aspirin",
    "Prednisone",
    "Amoxicillin",
    "Azithromycin",
    "Ciprofloxacin",
    "Warfarin",
    "Insulin",
  ];

  const countryCodes = [
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
  ];

  const [allergySearch, setAllergySearch] = useState("");
  const [medicationSearch, setMedicationSearch] = useState("");
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
  const [familyHistoryInput, setFamilyHistoryInput] = useState("");
  const [pastHistoryInput, setPastHistoryInput] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState({
    insuranceCard: null,
    idDocument: null,
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] =
    useState(false);
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+91");
  const [showEmergencyCountryDropdown, setShowEmergencyCountryDropdown] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const handleAllergySelect = (allergy) => {
    if (!formData.allergies.includes(allergy)) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergy],
      }));
    }
    setAllergySearch("");
    setShowAllergyDropdown(false);
  };

  const handleAllergyKeyPress = (e) => {
    if (e.key === "Enter" && allergySearch.trim()) {
      e.preventDefault();
      handleAllergySelect(allergySearch.trim());
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter(
        (allergy) => allergy !== allergyToRemove
      ),
    }));
  };

  const handleMedicationSelect = (medication) => {
    if (!formData.currentMedications.includes(medication)) {
      setFormData((prev) => ({
        ...prev,
        currentMedications: [...prev.currentMedications, medication],
      }));
    }
    setMedicationSearch("");
    setShowMedicationDropdown(false);
  };

  const handleMedicationKeyPress = (e) => {
    if (e.key === "Enter" && medicationSearch.trim()) {
      e.preventDefault();
      handleMedicationSelect(medicationSearch.trim());
    }
  };

  const removeMedication = (medicationToRemove) => {
    setFormData((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter(
        (med) => med !== medicationToRemove
      ),
    }));
  };

  // Point-wise input handlers
  const addFamilyHistory = () => {
    if (familyHistoryInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        familyMedicalHistory: [
          ...prev.familyMedicalHistory,
          familyHistoryInput.trim(),
        ],
      }));
      setFamilyHistoryInput("");
    }
  };

  const removeFamilyHistory = (index) => {
    setFormData((prev) => ({
      ...prev,
      familyMedicalHistory: prev.familyMedicalHistory.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addPastHistory = () => {
    if (pastHistoryInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        pastMedicalHistory: [
          ...prev.pastMedicalHistory,
          pastHistoryInput.trim(),
        ],
      }));
      setPastHistoryInput("");
    }
  };

  const removePastHistory = (index) => {
    setFormData((prev) => ({
      ...prev,
      pastMedicalHistory: prev.pastMedicalHistory.filter((_, i) => i !== index),
    }));
  };

  // Phone number handlers
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    setFormData((prev) => ({
      ...prev,
      phone: `${phoneCountryCode} ${value}`,
    }));
  };

  const handleEmergencyNumberChange = (value) => {
    setEmergencyNumber(value);
    setFormData((prev) => ({
      ...prev,
      emergencyPhone: `${emergencyCountryCode} ${value}`,
    }));
    console.log("Emergency phone:", {
      emergencyPhone: `${emergencyCountryCode} ${value}`,
    });
  };

  const handlePhoneCountrySelect = (code) => {
    setPhoneCountryCode(code);
    setFormData((prev) => ({
      ...prev,
      phone: `${code} ${phoneNumber}`,
    }));
    setShowPhoneCountryDropdown(false);
  };

  const handleEmergencyCountrySelect = (code) => {
    setEmergencyCountryCode(code);
    setFormData((prev) => ({
      ...prev,
      emergencyPhone: `${code} ${emergencyNumber}`,
    }));
    setShowEmergencyCountryDropdown(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: file.name,
      }));
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      console.log(formData);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await registerPatient(formData);

      if (!res.success) {
        setMessage(res.error || "Failed to register patient.");
        setMessageType("error");
        return;
      }

      setMessage("Patient registered successfully!");
      setMessageType("success");

      // Reset form
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          occupation: "",
          address: "",
          emergencyContactName: "",
          emergencyPhone: "",
          insuranceProvider: "",
          insurancePolicyNumber: "",
          allergies: [],
          currentMedications: [],
          pastMedicalHistory: [],
          familyMedicalHistory: [],
          primaryPhysician: "",
          insuranceCard: null,
          idDocument: null,
        });
        setUploadedFiles({ insuranceCard: null, idDocument: null });
        setCurrentStep(1);
        setMessage("");
        setMessageType("");
      }, 2000);
    } catch (error) {
      setMessage("Failed to register patient. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAllergies = commonAllergies.filter(
    (allergy) =>
      allergy.toLowerCase().includes(allergySearch.toLowerCase()) &&
      !formData.allergies.includes(allergy)
  );

  const filteredMedications = commonMedications.filter(
    (medication) =>
      medication.toLowerCase().includes(medicationSearch.toLowerCase()) &&
      !formData.currentMedications.includes(medication)
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Full name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Email address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Phone number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowPhoneCountryDropdown(!showPhoneCountryDropdown)
                      }
                      className="bg-dark-400 border border-dark-500 rounded-lg px-3 py-3 text-white flex items-center gap-2 hover:border-green-500 transition-colors min-w-[100px]"
                    >
                      <span>
                        {
                          countryCodes.find((c) => c.code === phoneCountryCode)
                            ?.flag
                        }
                      </span>
                      <span className="text-14-regular">
                        {phoneCountryCode}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-dark-600 transition-transform ${
                          showPhoneCountryDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showPhoneCountryDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden min-w-[200px]">
                        <div className="max-h-60 overflow-y-auto">
                          {countryCodes.map((country, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handlePhoneCountrySelect(country.code)
                              }
                              className="w-full p-3 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="text-14-medium text-white">
                                  {country.code}
                                </div>
                                <div className="text-12-regular text-dark-600">
                                  {country.country}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                    placeholder="123 456 7890"
                    className="shad-input flex-1 text-white p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Date of birth *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Gender *</label>
                <div className="flex gap-4">
                  {["Male", "Female", "Other"].map((gender) => (
                    <label key={gender} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                        required
                      />
                      <span className="text-14-regular text-white">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                {/* Occupation */}
                <div>
                  <label className="shad-input-label block mb-2">
                    Occupation
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="Software Engineer"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>
                <label className="shad-input-label block mb-2">Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, City, State 12345"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Emergency contact name *
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  className="shad-input w-full text-white p-2"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Emergency Phone number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowEmergencyCountryDropdown(
                          !showEmergencyCountryDropdown
                        )
                      }
                      className="bg-dark-400 border border-dark-500 rounded-lg px-3 py-3 text-white flex items-center gap-2 hover:border-green-500 transition-colors min-w-[100px]"
                    >
                      <span>
                        {
                          countryCodes.find(
                            (c) => c.code === emergencyCountryCode
                          )?.flag
                        }
                      </span>
                      <span className="text-14-regular">
                        {emergencyCountryCode}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-dark-600 transition-transform ${
                          showEmergencyCountryDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showEmergencyCountryDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden min-w-[200px]">
                        <div className="max-h-60 overflow-y-auto">
                          {countryCodes.map((country, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleEmergencyCountrySelect(country.code)
                              }
                              className="w-full p-3 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="text-14-medium text-white">
                                  {country.code}
                                </div>
                                <div className="text-12-regular text-dark-600">
                                  {country.country}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Emergency Phone Number Input */}
                  <input
                    type="tel"
                    value={emergencyNumber}
                    onChange={(e) =>
                      handleEmergencyNumberChange(e.target.value)
                    }
                    placeholder="123 456 7890"
                    className="shad-input flex-1 text-white p-2"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">
              Insurance Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="shad-input-label block mb-2">
                  Insurance provider *
                </label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  placeholder="BlueCross BlueShield"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  Policy number *
                </label>
                <input
                  type="text"
                  name="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={handleInputChange}
                  placeholder="BC123456789"
                  className="shad-input w-full text-white"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">
              Medical Information
            </h3>

            {/* Primary Physician */}
            <div>
              <label className="shad-input-label block mb-2">
                Primary physician
              </label>
              <input
                type="text"
                name="primaryPhysician"
                value={formData.primaryPhysician}
                onChange={handleInputChange}
                placeholder="Dr. Sarah Safari"
                className="shad-input w-full text-white"
              />
            </div>

            {/* Allergies */}
            <div className="mt-8">
              <label className="shad-input-label block mb-2">
                Allergies (if any)
              </label>
              <div className="space-y-3">
                {/* Selected Allergies */}
                {formData.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1"
                      >
                        <span className="text-12-medium text-red-400">
                          {allergy}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Allergy Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={allergySearch}
                    onChange={(e) => setAllergySearch(e.target.value)}
                    onKeyPress={handleAllergyKeyPress}
                    placeholder="Type to search allergies or add custom..."
                    className="shad-input w-full text-white"
                    onFocus={() => setShowAllergyDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowAllergyDropdown(false), 150)
                    } // small delay
                  />
                  {/* Allergy Dropdown */}
                  {showAllergyDropdown &&
                    (allergySearch || filteredAllergies.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                          {allergySearch &&
                            !filteredAllergies.includes(allergySearch) && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAllergySelect(allergySearch)
                                }
                                className="w-full p-3 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left border-b border-dark-500"
                              >
                                <Plus className="w-4 h-4 text-green-500" />
                                <span className="text-14-regular text-white">
                                  Add "{allergySearch}"
                                </span>
                              </button>
                            )}
                          {filteredAllergies.map((allergy) => (
                            <button
                              key={allergy}
                              type="button"
                              onMouseDown={() => handleAllergySelect(allergy)} // ✅ fires before blur
                              className="w-full p-3 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-14-regular text-white">
                                {allergy}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div className="mt-8">
              <label className="shad-input-label block mb-2">
                Current medications
              </label>
              <div className="space-y-3">
                {/* Selected Medications */}
                {formData.currentMedications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.currentMedications.map((medication, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1"
                      >
                        <span className="text-12-medium text-blue-400">
                          {medication}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMedication(medication)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Medication Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={medicationSearch}
                    onChange={(e) => {
                      setMedicationSearch(e.target.value);
                    }}
                    onKeyPress={handleMedicationKeyPress}
                    onFocus={() => setShowMedicationDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowMedicationDropdown(false), 150)
                    } // small delay
                    placeholder="Type to search medications or add custom..."
                    className="shad-input w-full text-white"
                  />

                  {/* Medication Dropdown */}
                  {showMedicationDropdown &&
                    (medicationSearch || filteredMedications.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                          {medicationSearch &&
                            !filteredMedications.includes(medicationSearch) && (
                              <button
                                type="button"
                                onMouseDown={() =>
                                  handleMedicationSelect(medicationSearch)
                                }
                                className="w-full p-3 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left border-b border-dark-500"
                              >
                                <Plus className="w-4 h-4 text-green-500" />
                                <span className="text-14-regular text-white">
                                  Add "{medicationSearch}"
                                </span>
                              </button>
                            )}
                          {filteredMedications.map((medication) => (
                            <button
                              key={medication}
                              type="button"
                              onClick={() => handleMedicationSelect(medication)}
                              className="w-full p-3 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-14-regular text-white">
                                {medication}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Family Medical History */}
            <div className="mt-8">
              <label className="shad-input-label block mb-2">
                Family medical history (if relevant)
              </label>
              <div className="space-y-3">
                {/* Existing Family History */}
                {formData.familyMedicalHistory.length > 0 && (
                  <div className="space-y-2">
                    {formData.familyMedicalHistory.map((history, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-14-regular text-white">
                            {history}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFamilyHistory(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Family History */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={familyHistoryInput}
                    onChange={(e) => setFamilyHistoryInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFamilyHistory();
                      }
                    }}
                    placeholder="ex: Mother had breast cancer"
                    className="shad-input flex-1 text-white"
                  />
                  <button
                    type="button"
                    onClick={addFamilyHistory}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-14-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Past Medical History */}
            <div className="mt-8">
              <label className="shad-input-label block mb-2">
                Past medical history
              </label>
              <div className="space-y-3">
                {/* Existing Past History */}
                {formData.pastMedicalHistory.length > 0 && (
                  <div className="space-y-2">
                    {formData.pastMedicalHistory.map((history, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-14-regular text-white">
                            {history}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePastHistory(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Past History */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pastHistoryInput}
                    onChange={(e) => setPastHistoryInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPastHistory();
                      }
                    }}
                    placeholder="ex: Asthma diagnosis in childhood"
                    className="shad-input flex-1 text-white"
                  />
                  <button
                    type="button"
                    onClick={addPastHistory}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-14-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">
              Document Upload
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="shad-input-label block mb-2">
                  Insurance card *
                </label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="insuranceCard"
                    name="insuranceCard"
                    onChange={(e) => handleFileUpload(e, "insuranceCard")}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    required
                  />
                  <label htmlFor="insuranceCard" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div className="file-upload_label">
                        <p className="text-14-regular text-green-500">
                          {uploadedFiles.insuranceCard ||
                            "Upload insurance card"}
                        </p>
                        <p className="text-12-regular text-dark-600">
                          JPG, PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">
                  ID document *
                </label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="idDocument"
                    name="idDocument"
                    onChange={(e) => handleFileUpload(e, "idDocument")}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    required
                  />
                  <label htmlFor="idDocument" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div className="file-upload_label">
                        <p className="text-14-regular text-blue-500">
                          {uploadedFiles.idDocument || "Upload ID document"}
                        </p>
                        <p className="text-12-regular text-dark-600">
                          JPG, PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
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
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <span className="text-20-bold lg:text-24-bold text-white">
                Patient Registration
              </span>
              <p className="text-12-regular lg:text-14-regular text-dark-700">
                Register new patients
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Progress Steps */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-14-medium lg:text-16-medium font-semibold ${
                    step <= currentStep
                      ? "bg-purple-500 text-white"
                      : "bg-dark-400 text-dark-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 lg:w-24 h-1 mx-2 ${
                      step < currentStep ? "bg-purple-500" : "bg-dark-400"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-12-regular lg:text-14-regular text-dark-700">
            <span className={currentStep >= 1 ? "text-purple-400" : ""}>
              Personal Info
            </span>
            <span className={currentStep >= 2 ? "text-purple-400" : ""}>
              Insurance
            </span>
            <span className={currentStep >= 3 ? "text-purple-400" : ""}>
              Medical Info
            </span>
            <span className={currentStep >= 4 ? "text-purple-400" : ""}>
              Documents
            </span>
          </div>
        </div>

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
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-14-regular lg:text-16-regular">
              {message}
            </span>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8 mb-8">
          {getStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={currentStep === 1 ? onBack : handlePrevStep}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
            >
              {currentStep === 1 ? "← Back" : "Previous"}
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Next
              </button>
            ) : (
              <button
                // type="submit"
                onClick={(e) => handleSubmit(e)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Register Patient
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistPatientRegistration;
