import React, { useEffect, useState } from "react";
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
  NotebookTabs,
  ClipboardPlus,
  Hospital,
  IdCard,
} from "lucide-react";
import FileUpload from "../FileUpload";
import { useSession } from "next-auth/react";
import { ModeToggle } from "../ThemeButton";
import { fetchPhysicians } from "@/lib/patients/profile";
import AvatarUpload from "../AvatarUpload";
import InputField from "./OnboardingInput";
import OnboardingSuccess from "./OnboardingSuccess";
import { getOnboardingStatus, onboardPatient } from "@/lib/patients/onboarding";

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
    name: "",
    email: "",
    phone: "",
    avatarId: null,
    avatar: null,
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
    insurancePolicyDocument: null,
    insurancePolicyDocumentId: null,
    allergies: [],
    currentMedications: [],
    familyMedicalHistory: [],
    pastMedicalHistory: [],

    // Identification
    identificationType: "Birth Certificate",
    identificationNumber: "",
    identificationDocument: null,
    identificationDocumentId: null,

    // Consent
    treatmentConsent: false,
    disclosureConsent: false,
    privacyConsent: false,
  });
  const [onboardingStatus, setOnboardingStatus] = useState(false);
  const [physicians, setPhysicians] = useState([]);
  const [errors, setErrors] = useState({});

  const { data: session } = useSession();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    }));
    fetchOnboardingStatus();
    fetchPhysician();
  }, [session?.user]);

  const fetchOnboardingStatus = async () => {
    const data = await getOnboardingStatus(session?.user?.id);
    console.log(data);
    if (data.length > 0) setOnboardingStatus(data[0].hasOnboarded);
  };

  const fetchPhysician = async () => {
    const data = await fetchPhysicians();
    setPhysicians(data);
  };

  // Multi-select states
  const [allergySearch, setAllergySearch] = useState("");
  const [medicationSearch, setMedicationSearch] = useState("");
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);

  // Point-wise input states
  const [familyHistoryInput, setFamilyHistoryInput] = useState("");
  const [pastHistoryInput, setPastHistoryInput] = useState("");

  // Phone number states
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+91");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] =
    useState(false);
  const [showEmergencyCountryDropdown, setShowEmergencyCountryDropdown] =
    useState(false);

  const [uploadData, setUploadData] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [insuranceUpload, setInsuranceUpload] = useState(null);
  const [insuranceFileId, setInsuranceFileId] = useState(null);
  const [showPhysicianDropdown, setShowPhysicianDropdown] = useState(false);
  const [showIdTypeDropdown, setShowIdTypeDropdown] = useState(false);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [avatarData, setAvatarData] = useState(null);
  const [avatarId, setAvatarId] = useState(null);

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
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
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
    setErrors((prev) => ({
      ...prev,
      phone: "",
    }));
  };

  const handleEmergencyNumberChange = (value) => {
    setEmergencyNumber(value);
    setFormData((prev) => ({
      ...prev,
      emergencyPhone: `${emergencyCountryCode} ${value}`,
    }));
    setErrors((prev) => ({
      ...prev,
      emergencyPhone: "",
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

  const handleAvatarUpload = (url, id) => {
    console.log("Avatar uploaded:", url, id);
    setFormData((prev) => ({
      ...prev,
      avatar: url,
      avatarId: id,
    }));
  };

  const handleDocumentUpload = (uploadData, fileId) => {
    console.log("File uploaded:", fileId, uploadData);
    setFormData((prev) => ({
      ...prev,
      identificationDocument: uploadData,
      identificationDocumentId: fileId,
    }));
  };

  const handleInsuranceFileUpload = (uploadData, fileId) => {
    console.log("File uploaded:", fileId, uploadData);
    setFormData((prev) => ({
      ...prev,
      insurancePolicyDocument: uploadData,
      insurancePolicyDocumentId: fileId,
    }));
    setErrors((prev) => ({
      ...prev,
      insurancePolicyDocument: "",
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

  const validateForm = () => {
    const newErrors = {};

    // split phone & emergency phone by space ("+91 9876543210")
    const [phoneCode, phoneNumber] = formData.phone.trim().split(" ");
    const [emCode, emNumber] = formData.emergencyPhone.trim().split(" ");

    // Personal Info
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";

    if (!phoneNumber || phoneNumber.length < 5)
      newErrors.phone = "Valid phone number is required.";

    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required.";

    if (!formData.gender) newErrors.gender = "Please select your gender.";

    if (!formData.address.trim()) newErrors.address = "Address is required.";

    if (!formData.occupation.trim())
      newErrors.occupation = "Occupation is required.";

    if (!formData.emergencyContactName.trim())
      newErrors.emergencyContactName = "Emergency contact name is required.";

    if (!emNumber || emNumber.length < 5)
      newErrors.emergencyPhone = "Valid emergency phone number is required.";

    // Medical Info
    if (!formData.insuranceProvider.trim())
      newErrors.insuranceProvider = "Insurance provider is required.";

    if (!formData.insurancePolicyNumber.trim())
      newErrors.insurancePolicyNumber = "Insurance policy number is required.";

    if (!formData.insurancePolicyDocument)
      newErrors.insurancePolicyDocument =
        "Insurance policy document is required.";

    // Identification
    if (!formData.identificationNumber.trim())
      newErrors.identificationNumber = "Identification number is required.";

    if (!formData.identificationDocument)
      newErrors.identificationDocument = "Identification document is required.";

    // Consent
    if (!formData.treatmentConsent)
      newErrors.treatmentConsent = "You must agree to the treatment policy.";

    if (!formData.disclosureConsent)
      newErrors.disclosureConsent = "You must agree to the privacy policy.";

    if (!formData.privacyConsent)
      newErrors.privacyConsent = "You must agree to the terms and conditions.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Validation failed:", validationErrors);
      console.log("Form data:", {
        ...formData,
        userId: session?.user?.id,
        hasOnboarded: true,
      });
      await onboardPatient(session?.user?.id, {
        ...formData,
        userId: session?.user?.id,
        hasOnboarded: true,
      });
      return;
    }

    console.log("Form submitted:", formData);
    setErrors({}); // clear any previous errors
  };

  if (onboardingStatus) {
    return <OnboardingSuccess />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-300 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-100/60 dark:bg-dark-200/60 backdrop-blur-lg border-b-2 border-slate-300/50 dark:border-dark-600/50 px-8 py-6 shadow-lg shadow-slate-200/20 dark:shadow-black/30 transition-all duration-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-24-bold text-slate-900 dark:text-white transition-colors">
              MediCura
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ModeToggle />
            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-3xl text-16-semibold transition-colors dark:shadow-emerald-500/10 shadow-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="sub-container max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-36-bold text-slate-900 dark:text-white mb-2">
              Welcome 👋
            </h1>
            <p className="text-16-regular text-slate-700 dark:text-slate-400">
              Let us know more about yourself
            </p>
          </div>

          {/* Personal Information */}
          <section>
            <h2 className="text-24-bold text-slate-700 dark:text-slate-50 mb-8">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Field */}
              <div className="w-full">
                <label className="shad-input-label block mb-3 text-[15px] font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-dark-600 dark:text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="ex: Sagnik"
                    className="shad-input pl-10 w-full text-[17px] font-medium h-[56px]
                   text-slate-900 dark:text-white bg-white dark:bg-dark-500
                   border border-slate-300 dark:border-dark-500
                   rounded-2xl disabled:cursor-not-allowed disabled:opacity-80
                   transition-colors shadow-sm focus:border-emerald-500 focus:ring-emerald-500/30"
                    disabled
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="flex flex-col items-center md:items-start">
                <div className="mb-3">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Profile Picture
                  </h3>
                  <p className="text-[13px] text-slate-600 dark:text-slate-400">
                    Upload your profile photo
                  </p>
                </div>

                <AvatarUpload
                  uploadData={avatarData}
                  setUploadData={setAvatarData}
                  fileId={avatarId}
                  setFileId={setAvatarId}
                  handleFileUpload={handleAvatarUpload}
                  folder="Patient"
                />
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
                    placeholder="sagnik@patient.medicura.com"
                    className="shad-input pl-10 w-full rounded-2xl text-white disabled:cursor-not-allowed disabled:opacity-80"
                    disabled
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="shad-input-label block mb-2">
                  Phone number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowPhoneCountryDropdown(!showPhoneCountryDropdown)
                      }
                      className="bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg px-3 py-3 flex items-center gap-2 hover:border-green-500 transition-colors min-w-[100px]"
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
                      <div className="absolute top-full left-0 mt-2 bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden min-w-[200px]">
                        <div className="max-h-60 overflow-y-auto">
                          {countryCodes.map((country, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handlePhoneCountrySelect(country.code)
                              }
                              className="w-full p-3 flex items-center gap-3 hover:bg-light-200 dark:hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="text-14-medium">
                                  {country.code}
                                </div>
                                <div className="text-12-regular text-dark-400 dark:text-dark-600">
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
                    className={`
            w-full p-3 rounded-xl border-[2px] shadow-lg
            ${
              errors.phone
                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                : "input-field focus-visible:ring-slate-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400 focus-visible:ring-[4px]"
            }
            bg-white text-slate-900 placeholder:text-slate-400 border-slate-300
            dark:bg-dark-400 dark:text-white dark:placeholder:text-dark-600 dark:border-dark-500
            transition-all duration-500 focus:outline-none
          `}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <InputField
                type="date"
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                icon={Calendar}
                addStyle="p-3"
                error={errors.dateOfBirth}
                required
              />

              {/* Gender */}
              <div>
                <label className="shad-input-label block mb-2">
                  Gender
                  <span className="text-red-500 ml-1">*</span>
                </label>
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
                    <span className="text-14-regular">Male</span>
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
                    <span className="text-14-regular">Female</span>
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
                    <span className="text-14-regular">Other</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Address */}
              <InputField
                type="text"
                label="Address"
                name="address"
                placeholder="ex: MG Road, Bengaluru, India, 560001"
                value={formData.address}
                onChange={handleInputChange}
                icon={MapPin}
                addStyle="p-3"
                error={errors.address}
                required
              />

              {/* Occupation */}
              <InputField
                type="text"
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Software Engineer"
                icon={Briefcase}
                addStyle="p-3"
                error={errors.occupation}
                required
              />

              {/* Emergency Contact Name */}
              <InputField
                type="text"
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                placeholder="Guardian's name"
                icon={User}
                addStyle="p-3"
                error={errors.emergencyContactName}
                required
              />

              {/* Emergency Phone */}
              <div>
                <label className="shad-input-label block mb-2">
                  Emergency Phone number
                  <span className="text-red-500 ml-1">*</span>
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
                      className="bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg px-3 py-3 flex items-center gap-2 hover:border-green-500 transition-colors min-w-[100px]"
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
                      <div className="absolute top-full left-0 mt-2 bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden min-w-[200px]">
                        <div className="max-h-60 overflow-y-auto">
                          {countryCodes.map((country, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleEmergencyCountrySelect(country.code)
                              }
                              className="w-full p-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-lg">{country.flag}</span>
                              <div>
                                <div className="text-14-medium">
                                  {country.code}
                                </div>
                                <div className="text-12-regular text-slate-600 dark:text-dark-600">
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
                    className={`
            w-full p-3 rounded-xl border-[2px] shadow-lg
            ${
              errors.emergencyPhone
                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                : "input-field focus-visible:ring-slate-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400 focus-visible:ring-[4px]"
            }
            bg-white text-slate-900 placeholder:text-slate-400 border-slate-300
            dark:bg-dark-400 dark:text-white dark:placeholder:text-dark-600 dark:border-dark-500
            transition-all duration-500 focus:outline-none
          `}
                    required
                  />
                </div>
                {errors.emergencyPhone && (
                  <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
                    {errors.emergencyPhone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Medical Information */}
          <section>
            <h2 className="text-24-bold text-slate-700 dark:text-slate-50 my-8">
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
                    className="w-full bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-emerald-500 transition-all duration-200shadow-sm focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      {selectedPhysician ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedPhysician.avatar}
                            alt={selectedPhysician.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-slate-900 dark:text-white font-medium">
                            {selectedPhysician.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">
                          Select a physician
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform ${
                        showPhysicianDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {showPhysicianDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden animate-fadeIn">
                      <div className="p-3 border-b border-slate-200 dark:border-dark-500">
                        <span className="text-14-medium text-slate-700 dark:text-slate-300">
                          Physicians
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {physicians.map((physician) => (
                          <button
                            key={physician.id}
                            type="button"
                            onClick={() => handlePhysicianSelect(physician)}
                            className="w-full p-4 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-dark-500 transition-colors text-left"
                          >
                            <img
                              src={physician.avatar}
                              alt={physician.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="text-16-medium text-slate-900 dark:text-white font-medium">
                                {physician.name}
                              </div>
                              {physician.speciality && (
                                <div className="text-12-regular text-slate-500 dark:text-slate-400">
                                  {physician.speciality}
                                </div>
                              )}
                            </div>
                            {selectedPhysician?.id === physician.id && (
                              <Check className="w-5 h-5 text-emerald-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Provider */}
              <InputField
                type="text"
                label="Insurance provider"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleInputChange}
                placeholder="ex: Star Health"
                icon={Hospital}
                addStyle="p-3"
                error={errors.insuranceProvider}
                required
              />

              {/* Insurance Policy Number */}
              <InputField
                type="text"
                label="Insurance policy number"
                name="insurancePolicyNumber"
                value={formData.insurancePolicyNumber}
                onChange={handleInputChange}
                placeholder="ex: ABC1234567"
                icon={ClipboardPlus}
                addStyle="p-3"
                error={errors.insurancePolicyNumber}
                required
              />

              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Scanned Copy of Insurance Document
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <FileUpload
                  uploadData={insuranceUpload}
                  setUploadData={setInsuranceUpload}
                  fileId={insuranceFileId}
                  setFileId={setInsuranceFileId}
                  handleFileUpload={handleInsuranceFileUpload}
                  folder="Patient"
                  error={errors.insurancePolicyDocument}
                />
                {errors.insurancePolicyDocument && (
                  <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
                    {errors.insurancePolicyDocument}
                  </p>
                )}
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
                    className="shad-input w-full text-white p-3 rounded-2xl"
                    onFocus={() => setShowAllergyDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowAllergyDropdown(false), 150)
                    } // small delay
                  />
                  {/* Allergy Dropdown */}
                  {showAllergyDropdown &&
                    (allergySearch || filteredAllergies.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
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
                                <span className="text-14-regular">
                                  Add "{allergySearch}"
                                </span>
                              </button>
                            )}
                          {filteredAllergies.map((allergy) => (
                            <button
                              key={allergy}
                              type="button"
                              onMouseDown={() => handleAllergySelect(allergy)}
                              className="w-full p-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-14-regular">{allergy}</span>
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
                    className="shad-input w-full text-white p-3 rounded-2xl"
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
                    className="shad-input flex-1 text-white p-3 rounded-2xl"
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
                    className="shad-input flex-1 text-white p-3 rounded-2xl"
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
            <h2 className="text-24-bold text-slate-700 dark:text-slate-50 my-8">
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
                    className="w-full bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-emerald-500 transition-all duration-200shadow-sm focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <span className="text-slate-900 dark:text-white font-medium">
                      {formData.identificationType ||
                        "Select Identification Type"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform ${
                        showIdTypeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {showIdTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg shadow-lg z-20 overflow-hidden animate-fadeIn">
                      <div className="p-3 border-b border-slate-200 dark:border-dark-500">
                        <span className="text-14-medium text-slate-700 dark:text-slate-300">
                          Identification Types
                        </span>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {idTypes.map((idType) => (
                          <button
                            key={idType}
                            type="button"
                            onClick={() => handleIdTypeSelect(idType)}
                            className="w-full p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-dark-500 transition-colors text-left"
                          >
                            <span className="text-16-medium text-slate-900 dark:text-white font-medium">
                              {idType}
                            </span>
                            {formData.identificationType === idType && (
                              <Check className="w-5 h-5 text-emerald-500" />
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
                <InputField
                  type="text"
                  label="Insurance policy number"
                  name="identificationNumber"
                  value={formData.identificationNumber}
                  onChange={handleInputChange}
                  placeholder="ex 1234567"
                  icon={IdCard}
                  addStyle="p-3"
                  error={errors.identificationNumber}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">
                  Scanned Copy of Identification Document
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <FileUpload
                  uploadData={uploadData}
                  setUploadData={setUploadData}
                  fileId={fileId}
                  setFileId={setFileId}
                  handleFileUpload={handleDocumentUpload}
                  folder="Patient"
                  error={errors.identificationDocument}
                />
                {errors.identificationDocument && (
                  <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
                    {errors.identificationDocument}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Consent and Privacy */}
          <section>
            <h2 className="text-24-bold text-slate-700 dark:text-slate-50 my-8">
              Consent and Privacy
            </h2>

            <div className="space-y-6">
              {/* Treatment Consent */}
              <label
                className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-colors ${
                  errors.treatmentConsent
                    ? "bg-red-50 dark:bg-[#2a0000] border border-red-400/40"
                    : "hover:bg-slate-100 dark:hover:bg-dark-500"
                }`}
              >
                <input
                  type="checkbox"
                  name="treatmentConsent"
                  checked={formData.treatmentConsent}
                  onChange={handleInputChange}
                  className={`w-5 h-5 mt-0.5 rounded focus:ring-green-500 ${
                    errors.treatmentConsent
                      ? "border-red-500 text-red-500"
                      : "text-green-500 bg-dark-400 border-dark-500"
                  }`}
                />
                <span
                  className={`text-14-regular transition-colors ${
                    errors.treatmentConsent
                      ? "text-red-700 dark:text-red-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  I consent to receive treatment for my health condition.
                </span>
              </label>
              {errors.treatmentConsent && (
                <p className="text-red-500 dark:text-red-400 text-sm ml-8 -mt-3 font-medium tracking-wide">
                  {errors.treatmentConsent}
                </p>
              )}

              {/* Disclosure Consent */}
              <label
                className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-colors ${
                  errors.disclosureConsent
                    ? "bg-red-50 dark:bg-[#2a0000] border border-red-400/40"
                    : "hover:bg-slate-100 dark:hover:bg-dark-500"
                }`}
              >
                <input
                  type="checkbox"
                  name="disclosureConsent"
                  checked={formData.disclosureConsent}
                  onChange={handleInputChange}
                  className={`w-5 h-5 mt-0.5 rounded focus:ring-green-500 ${
                    errors.disclosureConsent
                      ? "border-red-500 text-red-500"
                      : "text-green-500 bg-dark-400 border-dark-500"
                  }`}
                />
                <span
                  className={`text-14-regular transition-colors ${
                    errors.disclosureConsent
                      ? "text-red-700 dark:text-red-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  I consent to the use and disclosure of my health information
                  for treatment purposes.
                </span>
              </label>
              {errors.disclosureConsent && (
                <p className="text-red-500 dark:text-red-400 text-sm ml-8 -mt-3 font-medium tracking-wide">
                  {errors.disclosureConsent}
                </p>
              )}

              {/* Privacy Consent */}
              <label
                className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-colors ${
                  errors.privacyConsent
                    ? "bg-red-50 dark:bg-[#2a0000] border border-red-400/40"
                    : "hover:bg-slate-100 dark:hover:bg-dark-500"
                }`}
              >
                <input
                  type="checkbox"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleInputChange}
                  className={`w-5 h-5 mt-0.5 rounded focus:ring-green-500 ${
                    errors.privacyConsent
                      ? "border-red-500 text-red-500"
                      : "text-green-500 bg-dark-400 border-dark-500"
                  }`}
                />
                <span
                  className={`text-14-regular transition-colors ${
                    errors.privacyConsent
                      ? "text-red-700 dark:text-red-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  I acknowledge that I have reviewed and agree to the{" "}
                  <span
                    className={`underline ${
                      errors.privacyConsent
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-500"
                    }`}
                  >
                    privacy policy
                  </span>
                </span>
              </label>
              {errors.privacyConsent && (
                <p className="text-red-500 dark:text-red-400 text-sm ml-8 -mt-3 font-medium tracking-wide">
                  {errors.privacyConsent}
                </p>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-lg text-16-semibold transition-colors dark:shadow-emerald-500/10 shadow-md"
            >
              Submit and continue
            </button>
          </div>

          {/* Back Link */}
          <button
            onClick={onBack}
            className="mt-8 text-14-regular text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            ← Back to Home
          </button>

          {/* Copyright */}
          <div className="mt-16">
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
              © MediCura — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
