import React, { useState } from "react";
import {
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Upload,
  ChevronDown,
  CheckCircle,
  Search,
  Check,
  X,
} from "lucide-react";
import FileUpload from "../FileUpload";

const physicians = [
  {
    id: "1",
    name: "Dr. Adam Smith",
    avatar:
      "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    speciality: "General Medicine",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    speciality: "Internal Medicine",
  },
  {
    id: "3",
    name: "Dr. Michael Brown",
    avatar:
      "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    speciality: "Family Medicine",
  },
  {
    id: "4",
    name: "Dr. Emily Davis",
    avatar:
      "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    speciality: "Cardiology",
  },
];

const idTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

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

const OnboardingPage = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyPhone: "",

    // Medical Information
    primaryPhysician: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: [],
    currentMedications: [],
    familyMedicalHistory: [],
    pastMedicalHistory: [],

    // Identification
    identificationType: "Birth Certificate",
    identificationNumber: "",
    identificationDocument: null,

    // Consent
    treatmentConsent: true,
    disclosureConsent: false,
    privacyConsent: true,
  });

  // Multi-select states
  const [allergySearch, setAllergySearch] = useState("");
  const [medicationSearch, setMedicationSearch] = useState("");
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);

  // Point-wise input states
  const [familyHistoryInput, setFamilyHistoryInput] = useState("");
  const [pastHistoryInput, setPastHistoryInput] = useState("");

  // Phone number states
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+1");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] =
    useState(false);
  const [showEmergencyCountryDropdown, setShowEmergencyCountryDropdown] =
    useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [showPhysicianDropdown, setShowPhysicianDropdown] = useState(false);
  const [showIdTypeDropdown, setShowIdTypeDropdown] = useState(false);
  const [selectedPhysician, setSelectedPhysician] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Multi-select handlers
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

  const handleFileUpload = (uploadData, fileId) => {
    console.log("File uploaded:", fileId, uploadData);
    setFormData((prev) => ({
      ...prev,
      identificationDocument: uploadData,
      identificationDocumentId: fileId,
    }));
  };

  const handlePhysicianSelect = (physician) => {
    setSelectedPhysician(physician);
    setFormData((prev) => ({
      ...prev,
      primaryPhysician: physician.name,
    }));
    setShowPhysicianDropdown(false);
  };

  const handleIdTypeSelect = (idType) => {
    setFormData((prev) => ({
      ...prev,
      identificationType: idType,
    }));
    setShowIdTypeDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Onboarding form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Header */}
      <div className="bg-dark-200 border-b border-dark-500 px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-24-bold text-white">MediCura</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="sub-container max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-36-bold text-white mb-2 flex items-center gap-2">
              Welcome 👋
            </h1>
            <p className="text-16-regular text-dark-700">
              Let us know more about yourself
            </p>
          </div>

          {/* Personal Information */}
          <section>
            <h2 className="text-24-bold text-white mb-8">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">Full name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="ex: Adam"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="shad-input-label block mb-2">
                  Email address
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
                    placeholder="adrian@jsmastery.pro"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
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
                    className="shad-input flex-1 text-white"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="shad-input-label block mb-2">
                  Date of birth
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

              {/* Gender */}
              <div>
                <label className="shad-input-label block mb-2">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 focus:ring-green-500"
                    />
                    <span className="text-14-regular text-white">Male</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 focus:ring-green-500"
                    />
                    <span className="text-14-regular text-white">Female</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 focus:ring-green-500"
                    />
                    <span className="text-14-regular text-white">Other</span>
                  </label>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="shad-input-label block mb-2">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="ex: 14 street, New York, NY - 5101"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

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

              {/* Emergency Contact Name */}
              <div>
                <label className="shad-input-label block mb-2">
                  Emergency contact name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Guardian's name"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              {/* Emergency Phone */}
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
                    className="shad-input flex-1 text-white"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section>
            <h2 className="text-24-bold text-white mb-8">
              Medical Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Care Physician */}
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Primary care physician
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowPhysicianDropdown(!showPhysicianDropdown)
                    }
                    className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-dark-600" />
                      {selectedPhysician ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedPhysician.avatar}
                            alt={selectedPhysician.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-white">
                            {selectedPhysician.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-dark-600">
                          Select a physician
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-dark-600 transition-transform ${
                        showPhysicianDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Physician Dropdown */}
                  {showPhysicianDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-3 border-b border-dark-500">
                        <span className="text-14-medium text-dark-700">
                          Physicians
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {physicians.map((physician) => (
                          <button
                            key={physician.id}
                            type="button"
                            onClick={() => handlePhysicianSelect(physician)}
                            className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                          >
                            <img
                              src={physician.avatar}
                              alt={physician.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-16-medium text-white">
                                {physician.name}
                              </div>
                              {physician.speciality && (
                                <div className="text-12-regular text-dark-600">
                                  {physician.speciality}
                                </div>
                              )}
                            </div>
                            {selectedPhysician?.id === physician.id && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Provider */}
              <div>
                <label className="shad-input-label block mb-2">
                  Insurance provider
                </label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  placeholder="ex: BlueCross"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              {/* Insurance Policy Number */}
              <div>
                <label className="shad-input-label block mb-2">
                  Insurance policy number
                </label>
                <input
                  type="text"
                  name="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={handleInputChange}
                  placeholder="ex: ABC1234567"
                  className="shad-input w-full text-white"
                  required
                />
              </div>
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
          </section>

          {/* Identification and Verification */}
          <section>
            <h2 className="text-24-bold text-white mb-8">
              Identification and Verification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Identification Type */}
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Identification type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowIdTypeDropdown(!showIdTypeDropdown)}
                    className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                  >
                    <span className="text-white">
                      {formData.identificationType}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-dark-600 transition-transform ${
                        showIdTypeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* ID Type Dropdown */}
                  {showIdTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-3 border-b border-dark-500">
                        <span className="text-14-medium text-dark-700">
                          Identification Types
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {idTypes.map((idType) => (
                          <button
                            key={idType}
                            type="button"
                            onClick={() => handleIdTypeSelect(idType)}
                            className="w-full p-4 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                          >
                            <span className="text-16-medium text-white">
                              {idType}
                            </span>
                            {formData.identificationType === idType && (
                              <Check className="w-5 h-5 text-green-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Identification Number */}
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Identification Number
                </label>
                <input
                  type="text"
                  name="identificationNumber"
                  value={formData.identificationNumber}
                  onChange={handleInputChange}
                  placeholder="ex 1234567"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Scanned Copy of Identification Document
                </label>
                <FileUpload
                  uploadData={uploadData}
                  setUploadData={setUploadData}
                  fileId={fileId}
                  setFileId={setFileId}
                  handleFileUpload={handleFileUpload}
                  folder="Patient"
                />
              </div>
            </div>
          </section>

          {/* Consent and Privacy */}
          <section>
            <h2 className="text-24-bold text-white mb-8">
              Consent and Privacy
            </h2>

            <div className="space-y-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="treatmentConsent"
                  checked={formData.treatmentConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 mt-0.5 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                />
                <span className="text-14-regular text-white">
                  I consent to receive treatment for my health condition.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="disclosureConsent"
                  checked={formData.disclosureConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 mt-0.5 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                />
                <span className="text-14-regular text-white">
                  I consent to the use and disclosure of my health information
                  for treatment purposes.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 mt-0.5 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                  required
                />
                <span className="text-14-regular text-white">
                  I acknowledge that I have reviewed and agree to the{" "}
                  <span className="text-green-500 underline">
                    privacy policy
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg text-16-semibold transition-colors"
            >
              Submit and continue
            </button>
          </div>

          {/* Back Link */}
          <button
            onClick={onBack}
            className="mt-8 text-14-regular text-dark-600 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>

          {/* Copyright */}
          <div className="mt-16">
            <p className="copyright">©medicura copyright</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
