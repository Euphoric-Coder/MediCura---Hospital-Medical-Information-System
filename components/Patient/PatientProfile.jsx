import React, { useEffect, useState } from "react";
import {
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Edit,
  Save,
  X,
  Lock,
  Shield,
  Camera,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
  Check,
  IdCard,
  RefreshCcw,
} from "lucide-react";
import UpdatePassword from "../UpdatePassword";
import { usePatient } from "@/contexts/PatientContext";
import { fetchPhysicians, profileUpdate } from "@/lib/patients/profile";
import ProfileField from "./ProfileInput";
import { toast } from "sonner";
import AvatarUpload from "../AvatarUpload";
import { FiFileText } from "react-icons/fi";
import { Button } from "../ui/button";
import FileUpload from "../FileUpload";

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

const PatientProfile = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [errors, setErrors] = useState({});

  // Phone number states
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] = useState("+91");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [showPhoneCountryDropdown, setShowPhoneCountryDropdown] =
    useState(false);
  const [showEmergencyCountryDropdown, setShowEmergencyCountryDropdown] =
    useState(false);

  const { patientData, refreshPatientData } = usePatient();

  useEffect(() => {
    setProfileData(patientData);
    setPreviousAvatarId(patientData.avatarId);
    setPreviousIdentityId(patientData.identificationDocumentId);
    setPreviousInsuranceId(patientData.insurancePolicyDocumentId);
    prepareDefaultData();
    fetchPhysician();
  }, [patientData]);

  // Refresh Data and store the profile data
  const handleRefresh = async () => {
    const loading = toast.loading("Refreshing data... Please wait.");
    await refreshPatientData();
    setProfileData(patientData);
    setPreviousAvatarId(patientData.avatarId);
    setPreviousIdentityId(patientData.identificationDocumentId);
    setPreviousInsuranceId(patientData.insurancePolicyDocumentId);
    prepareDefaultData();
    fetchPhysician();
    toast.dismiss(loading);
    toast.success("Data refreshed successfully!");
  };

  const prepareDefaultData = () => {
    setPhoneCountryCode(patientData.phone.split(" ")[0]);
    setPhoneNumber(patientData.phone.split(" ").slice(1).join(" "));
    setEmergencyCountryCode(patientData.emergencyPhone.split(" ")[0]);
    setEmergencyNumber(
      patientData.emergencyPhone.split(" ").slice(1).join(" ")
    );
  };

  const fetchPhysician = async () => {
    const data = await fetchPhysicians();

    // find returns a single object or undefined
    const match = data.find((p) => p.name === patientData.primaryPhysician);
    setSelectedPhysician(match ?? null);
    setPhysicians(data);
  };

  const [profileData, setProfileData] = useState({});

  const [editData, setEditData] = useState(profileData);
  const [physicians, setPhysicians] = useState([]);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [showPhysicianDropdown, setShowPhysicianDropdown] = useState(false);
  const [allergySearch, setAllergySearch] = useState("");
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
  const [medicationSearch, setMedicationSearch] = useState("");
  const [familyHistoryInput, setFamilyHistoryInput] = useState("");
  const [pastHistoryInput, setPastHistoryInput] = useState("");
  const [avatarData, setAvatarData] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [previousAvatarId, setPreviousAvatarId] = useState(null);
  const [editAvatar, setEditAvatar] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [editIdentity, setEditIdentity] = useState(false);
  const [previousIdentityId, setPreviousIdentityId] = useState(null);
  const [showIdTypeDropdown, setShowIdTypeDropdown] = useState(false);
  const [insuranceUpload, setInsuranceUpload] = useState(null);
  const [insuranceFileId, setInsuranceFileId] = useState(null);
  const [previousInsuranceId, setPreviousInsuranceId] = useState(null);
  const [editInsurance, setEditInsurance] = useState(false);

  const handlePhysicianSelect = (physician) => {
    setSelectedPhysician(physician);
    setProfileData((prev) => ({
      ...prev,
      primaryPhysician: physician.name,
    }));
    setEditData((prev) => ({
      ...prev,
      primaryPhysician: physician.name,
    }));
    setShowPhysicianDropdown(false);
  };

  const handleIdTypeSelect = (idType) => {
    setProfileData((prev) => ({
      ...prev,
      identificationType: idType,
    }));
    setEditData((prev) => ({
      ...prev,
      identificationType: idType,
    }));
    setShowIdTypeDropdown(false);
  };

  // Multi-select handlers
  const handleAllergySelect = (allergy) => {
    if (!profileData.allergies.includes(allergy)) {
      setProfileData((prev) => ({
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
    setProfileData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter(
        (allergy) => allergy !== allergyToRemove
      ),
    }));
  };

  const handleMedicationSelect = (medication) => {
    if (!profileData.currentMedications.includes(medication)) {
      setProfileData((prev) => ({
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
    setProfileData((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter(
        (med) => med !== medicationToRemove
      ),
    }));
  };

  // Point-wise input handlers
  const addFamilyHistory = () => {
    if (familyHistoryInput.trim()) {
      setProfileData((prev) => ({
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
    setProfileData((prev) => ({
      ...prev,
      familyMedicalHistory: prev.familyMedicalHistory.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addPastHistory = () => {
    if (pastHistoryInput.trim()) {
      setProfileData((prev) => ({
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
    setProfileData((prev) => ({
      ...prev,
      pastMedicalHistory: prev.pastMedicalHistory.filter((_, i) => i !== index),
    }));
  };

  // Phone number handlers
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    setEditData((prev) => ({
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
    setEditData((prev) => ({
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
    setEditData((prev) => ({
      ...prev,
      phone: `${code} ${phoneNumber}`,
    }));
    setShowPhoneCountryDropdown(false);
  };

  const handleEmergencyCountrySelect = (code) => {
    setEmergencyCountryCode(code);
    setEditData((prev) => ({
      ...prev,
      emergencyPhone: `${code} ${emergencyNumber}`,
    }));
    setShowEmergencyCountryDropdown(false);
  };

  const filteredAllergies = commonAllergies.filter(
    (allergy) =>
      allergy.toLowerCase().includes(allergySearch.toLowerCase()) &&
      !profileData.allergies?.includes(allergy)
  );

  const filteredMedications = commonMedications.filter(
    (medication) =>
      medication.toLowerCase().includes(medicationSearch.toLowerCase()) &&
      !profileData.currentMedications?.includes(medication)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
    setMessage("");
    setMessageType("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    prepareDefaultData();
    setEditData(profileData);
    setEditAvatar(false);
    setEditIdentity(false);
    setEditInsurance(false);
    setErrors({});
    setMessage("");
    setMessageType("");
  };

  const deleteFile = async (fileId) => {
    if (!fileId) return;
    try {
      await fetch("/api/delete-image", {
        method: "POST",
        body: JSON.stringify({ fileId }),
      });
      console.log("Deleted previous file:", fileId);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleAvatarUpload = (url, id) => {
    setEditData((prev) => ({
      ...prev,
      avatar: url,
      avatarId: id,
    }));
  };

  const handleInsuranceFileUpload = (uploadData, fileId) => {
    setEditData((prev) => ({
      ...prev,
      insurancePolicyDocument: uploadData,
      insurancePolicyDocumentId: fileId,
    }));
    setErrors((prev) => ({
      ...prev,
      insurancePolicyDocument: "",
    }));
  };

  const handleDocumentUpload = (uploadData, fileId) => {
    setEditData((prev) => ({
      ...prev,
      identificationDocument: uploadData,
      identificationDocumentId: fileId,
    }));
    setErrors((prev) => ({
      ...prev,
      identificationDocument: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // split phone & emergency phone by space ("+91 9876543210")
    const [phoneCode, phoneNumber] = editData.phone.trim().split(" ");
    const [emCode, emNumber] = editData.emergencyPhone.trim().split(" ");

    // Personal Info
    if (!editData.name.trim()) newErrors.name = "Full name is required.";
    if (!editData.email.trim()) newErrors.email = "Email is required.";

    if (!phoneNumber || phoneNumber.length < 5)
      newErrors.phone = "Valid phone number is required.";

    if (!editData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required.";

    if (!editData.gender) newErrors.gender = "Please select your gender.";

    if (!editData.address.trim()) newErrors.address = "Address is required.";

    if (!editData.occupation.trim())
      newErrors.occupation = "Occupation is required.";

    if (!editData.emergencyContactName.trim())
      newErrors.emergencyContactName = "Emergency contact name is required.";

    if (!emNumber || emNumber.length < 5)
      newErrors.emergencyPhone = "Valid emergency phone number is required.";

    // Medical Info
    if (!editData.insuranceProvider.trim())
      newErrors.insuranceProvider = "Insurance provider is required.";

    if (!editData.insurancePolicyNumber.trim())
      newErrors.insurancePolicyNumber = "Insurance policy number is required.";

    if (!editData.insurancePolicyDocument)
      newErrors.insurancePolicyDocument =
        "Insurance policy document is required.";

    // Identification
    if (!editData.identificationNumber.trim())
      newErrors.identificationNumber = "Identification number is required.";

    if (!editData.identificationDocument)
      newErrors.identificationDocument = "Identification document is required.";

    // Consent
    if (!editData.treatmentConsent)
      newErrors.treatmentConsent = "You must agree to the treatment policy.";

    if (!editData.disclosureConsent)
      newErrors.disclosureConsent = "You must agree to the privacy policy.";

    if (!editData.privacyConsent)
      newErrors.privacyConsent = "You must agree to the terms and conditions.";

    return newErrors;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error("Please fill the required fields.");
        return;
      }
      console.log("Final Edit Data to be saved:", editData);

      await profileUpdate({ profileData: editData });

      if (avatarData) {
        await deleteFile(previousAvatarId);
      }

      if (uploadData) {
        await deleteFile(previousIdentityId);
      }

      if (insuranceUpload) {
        await deleteFile(previousInsuranceId);
      }

      await handleRefresh();

      // setProfileData(editData);
      setIsEditing(false);
      setEditInsurance(false);
      setEditIdentity(false);
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to update profile. Please try again. " + error);
      setMessageType("error");
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Header */}
        <div
          className="
  sticky top-0 z-10
  bg-white/80 dark:bg-slate-900/70
  backdrop-blur-xl
  border-b border-slate-200 dark:border-slate-700
"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl shadow-lg
                        bg-gradient-to-r from-emerald-500 to-emerald-600
                        flex items-center justify-center"
                >
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-[24px] font-bold text-slate-900 dark:text-white">
                  MediCura
                </span>
              </div>

              {/* Right chip */}
              <div className="flex items-center gap-4">
                <div
                  className="
          flex items-center gap-3
          px-4 py-2 rounded-xl
          bg-white/70 dark:bg-slate-800/60
          border border-slate-200 dark:border-slate-700
          backdrop-blur-sm
        "
                >
                  <div
                    className="w-8 h-8 rounded-lg
                          bg-gradient-to-r from-sky-500 to-violet-600
                          flex items-center justify-center"
                  >
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Profile Settings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Profile Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {!isEditing ? (
                    <div
                      className="w-24 h-24 rounded-3xl shadow-xl
                        bg-gradient-to-r from-emerald-500 to-sky-600
                        flex items-center justify-center"
                    >
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Profile Avatar"
                          className="w-full h-full object-fit rounded-3xl"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                  ) : (
                    <div>
                      {!editAvatar ? (
                        <div className="relative">
                          <div
                            className="w-24 h-24 rounded-3xl shadow-xl
                        bg-gradient-to-r from-emerald-500 to-sky-600
                        flex items-center justify-center"
                          >
                            <img
                              src={profileData.avatar}
                              alt="Profile Avatar"
                              className="w-full h-full object-fit rounded-3xl"
                            />
                          </div>
                          <button
                            className="absolute gap-2 -bottom-2 px-2 rounded-full
                     bg-emerald-500 hover:bg-emerald-600
                     border-2 border-white dark:border-slate-900
                     flex items-center justify-center transition-colors text-white"
                            onClick={() => setEditAvatar(true)}
                          >
                            <Camera className="w-4 h-4 text-white" /> Reupload
                          </button>
                        </div>
                      ) : (
                        <AvatarUpload
                          uploadData={avatarData}
                          setUploadData={setAvatarData}
                          fileId={avatarId}
                          setFileId={setAvatarId}
                          handleFileUpload={handleAvatarUpload}
                          folder="Patient"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h1
                    className="text-[36px] font-bold leading-tight
                       text-slate-900 dark:text-white mb-2"
                  >
                    {profileData.name}
                  </h1>
                  <p className="text-base text-slate-600 dark:text-slate-400">
                    {profileData.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                      Active Patient
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="inline-flex items-center gap-2
                       bg-gradient-to-r from-violet-500 to-violet-600
                       hover:from-violet-600 hover:to-violet-700
                       text-white px-6 py-3 rounded-xl
                       text-[16px] font-semibold transition-all duration-300
                       shadow-lg hover:shadow-violet-500/25"
                    >
                      <Lock className="w-5 h-5" />
                      Update Password
                    </button>

                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center gap-2
                       bg-gradient-to-r from-emerald-500 to-emerald-600
                       hover:from-emerald-600 hover:to-emerald-700
                       text-white px-6 py-3 rounded-xl
                       text-[16px] font-semibold transition-all duration-300
                       shadow-lg hover:shadow-emerald-500/25"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2
                       bg-slate-900 text-white hover:bg-slate-800
                       dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white
                       px-6 py-3 rounded-xl text-[16px] font-semibold
                       border border-slate-200 dark:border-slate-700
                       transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2
                       bg-gradient-to-r from-emerald-500 to-emerald-600
                       hover:from-emerald-600 hover:to-emerald-700
                       disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed
                       text-white px-6 py-3 rounded-xl
                       text-[16px] font-semibold transition-all duration-300
                       shadow-lg hover:shadow-emerald-500/25"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                role={messageType === "success" ? "status" : "alert"}
                aria-live="polite"
                className={[
                  "flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm",
                  "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700",
                  messageType === "success"
                    ? "shadow-[inset_0_0_0_9999px_rgba(16,185,129,0.08)] border-emerald-300/40 dark:border-emerald-400/30"
                    : "shadow-[inset_0_0_0_9999px_rgba(239,68,68,0.08)] border-rose-300/40 dark:border-rose-400/30",
                ].join(" ")}
              >
                {messageType === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                )}
                <span
                  className={[
                    "text-base",
                    messageType === "success"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-rose-700 dark:text-rose-300",
                  ].join(" ")}
                >
                  {message}
                </span>
              </div>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-8 ">
            <div className="flex justify-end">
              <Button className="btn3" onClick={() => handleRefresh()}>
                <RefreshCcw /> Refresh Data
              </Button>
            </div>
            {/* Personal Information */}
            <div
              className="
    rounded-3xl p-8 backdrop-blur-xl
    bg-sky-50 dark:bg-blue-900/30
    border border-sky-300 dark:border-sky-700
    shadow-sm
  "
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="
        w-10 h-10 rounded-xl
        bg-gradient-to-r from-sky-500 to-sky-600
        flex items-center justify-center
      "
                >
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[24px] font-bold text-sky-900 dark:text-sky-200">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        disabled={!isEditing}
                        className="bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg px-3 py-3 flex items-center gap-2 hover:border-green-500 transition-colors min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>
                          {
                            countryCodes.find(
                              (c) => c.code === phoneCountryCode
                            )?.flag
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
                            transition-all duration-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
                          `}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 font-medium tracking-wide">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <ProfileField
                  label="Date of Birth"
                  name="dateOfBirth"
                  editData={editData}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  value={profileData.dateOfBirth || ""}
                  error={errors.dateOfBirth}
                  required
                  type="date"
                  icon={Calendar}
                />

                <ProfileField
                  label="Occupation"
                  name="occupation"
                  editData={editData}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  value={profileData.occupation || ""}
                  error={errors.occupation}
                  required
                  icon={Briefcase}
                />

                <div>
                  <label className="shad-input-label block mb-2">Gender</label>

                  <div className="flex gap-4">
                    {["Male", "Female", "Other"].map((gender) => (
                      <label key={gender} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={
                            (isEditing
                              ? editData.gender
                              : profileData.gender) === gender
                          }
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="
            w-4 h-4 rounded-full
            text-emerald-600
            bg-white border-slate-300
            focus:ring-emerald-500 focus:ring-offset-0
            disabled:opacity-50

            dark:text-emerald-500
            dark:bg-slate-800 dark:border-slate-600
            dark:focus:ring-emerald-500
          "
                        />
                        <span className="text-sm text-slate-800 dark:text-slate-100">
                          {gender}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <ProfileField
                    label="Address"
                    name="address"
                    editData={editData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    value={profileData.address || ""}
                    error={errors.address}
                    required
                    icon={MapPin}
                  />
                </div>

                {/* Identification Type */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">
                    Identification type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIdTypeDropdown(!showIdTypeDropdown)}
                      disabled={!isEditing}
                      className="w-full bg-white dark:bg-dark-400 border border-slate-300 dark:border-dark-500 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-emerald-500 transition-all duration-200shadow-sm focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="text-slate-900 dark:text-white font-medium">
                        {profileData.identificationType ||
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
                              {profileData.identificationType === idType && (
                                <Check className="w-5 h-5 text-emerald-500" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <ProfileField
                    label="Identification Number"
                    name="identificationNumber"
                    editData={editData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    value={profileData.identificationNumber || ""}
                    error={errors.identificationNumber}
                    required
                    icon={IdCard}
                  />
                </div>

                <div className="md:col-span-2">
                  {!editIdentity ? (
                    <div>
                      {/* In case there is no identity document uploaded or got removed by mistake */}
                      {profileData.identificationDocument ? (
                        <div className="relative flex flex-col items-center gap-6 mt-4 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-cyan-50 to-indigo-100 dark:from-[#1c1c1c] dark:to-[#0f172a] shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                            <FiFileText className="text-5xl" />
                            <div className="text-left">
                              <h3 className="text-lg font-semibold break-all">
                                {`${profileData.name}'s Identity Document` ||
                                  "Uploaded File"}
                              </h3>
                            </div>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              setEditIdentity(true);
                            }}
                            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-medium px-5 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                            disabled={!isEditing}
                          >
                            Reupload PDF
                          </Button>

                          <a
                            href={profileData.identificationDocument}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 text-sm underline hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            View PDF
                          </a>
                        </div>
                      ) : (
                        <FileUpload
                          uploadData={uploadData}
                          setUploadData={setUploadData}
                          fileId={fileId}
                          setFileId={setFileId}
                          handleFileUpload={handleDocumentUpload}
                          folder="Patient"
                          error={errors.identificationDocument}
                        />
                      )}
                    </div>
                  ) : (
                    <FileUpload
                      uploadData={uploadData}
                      setUploadData={setUploadData}
                      fileId={fileId}
                      setFileId={setFileId}
                      handleFileUpload={handleDocumentUpload}
                      folder="Patient"
                      error={errors.identificationDocument}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div
              className="
    rounded-3xl p-8
    bg-rose-50/80 dark:bg-rose-900/20
    border border-rose-200 dark:border-rose-700
    shadow-sm
  "
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="
        w-10 h-10 rounded-xl
        bg-gradient-to-r from-rose-500 to-rose-600
        flex items-center justify-center
        shadow-sm ring-1 ring-black/5 dark:ring-white/10
      "
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[24px] font-bold text-rose-900 dark:text-rose-100">
                  Emergency Contact
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  editData={editData}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  value={profileData.emergencyContactName || ""}
                  error={errors.emergencyContactName}
                  icon={User}
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
                        disabled={!isEditing}
                        className="bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg px-3 py-3 flex items-center gap-2 hover:border-green-500 transition-colors min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={!isEditing}
                      className={`
                            w-full p-3 rounded-xl border-[2px] shadow-lg
                            ${
                              errors.emergencyPhone
                                ? "input-error-field focus-visible:ring-red-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-red-400 focus-visible:ring-[4px]"
                                : "input-field focus-visible:ring-slate-500 dark:focus-visible:ring-offset-gray-800 dark:focus-visible:ring-gray-400 focus-visible:ring-[4px]"
                            }
                            bg-white text-slate-900 placeholder:text-slate-400 border-slate-300
                            dark:bg-dark-400 dark:text-white dark:placeholder:text-dark-600 dark:border-dark-500
                            transition-all duration-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50
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
            </div>

            {/* Medical Information */}
            <div
              className="
    rounded-3xl p-8 backdrop-blur-xl
    bg-emerald-50/80 dark:bg-emerald-900/20
    border border-emerald-200 dark:border-emerald-700
    shadow-sm
  "
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="
        w-10 h-10 rounded-xl
        bg-gradient-to-r from-emerald-500 to-emerald-600
        flex items-center justify-center
        shadow-sm ring-1 ring-black/5 dark:ring-white/10
      "
                >
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[24px] font-bold text-emerald-900 dark:text-emerald-100">
                  Medical Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Physician */}
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
                      disabled={!isEditing}
                      className={[
                        // layout
                        "w-full rounded-xl px-4 py-3 text-left flex items-center justify-between transition-colors duration-200",

                        // base (light)
                        "bg-white/90 text-slate-900 border border-slate-300",

                        // hover/focus using theme color (emerald/green)
                        "hover:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:border-emerald-500",

                        // dark
                        "dark:bg-slate-800/70 dark:text-slate-100 dark:border-slate-700 dark:hover:border-emerald-500 dark:focus-visible:ring-emerald-500/50",

                        // disabled
                        !isEditing
                          ? "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
                          : "",
                      ].join(" ")}
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
                            <span>{selectedPhysician.name}</span>
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
                      <div
                        className="
    absolute top-full left-0 right-0 mt-2 z-10 overflow-hidden
    rounded-xl backdrop-blur-xl
    bg-white/90 border border-slate-200 shadow-lg
    dark:bg-slate-900/80 dark:border-slate-700
  "
                      >
                        {/* Header */}
                        <div
                          className="
      p-3 border-b border-slate-200
      dark:border-slate-700
    "
                        >
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Physicians
                          </span>
                        </div>

                        {/* List */}
                        <div className="max-h-60 overflow-y-auto">
                          {physicians.map((physician) => {
                            const isSelected =
                              selectedPhysician?.id === physician.id;
                            return (
                              <button
                                key={physician.id}
                                type="button"
                                onClick={() => handlePhysicianSelect(physician)}
                                className={[
                                  "w-full p-4 text-left transition-colors",
                                  "flex items-center gap-3",
                                  // base row styles
                                  "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60",
                                  // selected state accent (emerald theme)
                                  isSelected
                                    ? "ring-1 ring-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-900/20"
                                    : "",
                                ].join(" ")}
                              >
                                <img
                                  src={physician.avatar}
                                  alt={physician.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="text-[16px] font-medium text-slate-900 dark:text-slate-100">
                                    {physician.name}
                                  </div>
                                  {physician.speciality && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                      {physician.speciality}
                                    </div>
                                  )}
                                </div>

                                {isSelected && (
                                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <ProfileField
                  label="Insurance Provider"
                  name="insuranceProvider"
                  editData={editData}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  value={profileData.insuranceProvider || ""}
                  error={errors.insuranceProvider}
                  icon={Shield}
                />
                <ProfileField
                  label="Insurance Policy Number"
                  name="insurancePolicyNumber"
                  editData={editData}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  value={profileData.insurancePolicyNumber || ""}
                  error={errors.insurancePolicyNumber}
                  icon={Shield}
                />

                {/* Insurance Document */}
                <div className="md:col-span-2">
                  {!editInsurance ? (
                    <div className="relative flex flex-col items-center gap-6 mt-4 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-cyan-50 to-indigo-100 dark:from-[#1c1c1c] dark:to-[#0f172a] shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                        <FiFileText className="text-5xl" />
                        <div className="text-left">
                          <h3 className="text-lg font-semibold break-all">
                            {`${profileData.name}'s Insurance Policy` ||
                              "Uploaded File"}
                          </h3>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setEditInsurance(true);
                        }}
                        className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-medium px-5 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                        disabled={!isEditing}
                      >
                        Reupload PDF
                      </Button>

                      <a
                        href={profileData.insurancePolicyDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 text-sm underline hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        View PDF
                      </a>
                    </div>
                  ) : (
                    <FileUpload
                      uploadData={insuranceUpload}
                      setUploadData={setInsuranceUpload}
                      fileId={insuranceFileId}
                      setFileId={setInsuranceFileId}
                      handleFileUpload={handleInsuranceFileUpload}
                      folder="Patient"
                      error={errors.insurancePolicyDocument}
                    />
                  )}
                </div>

                {/* Allergies */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">
                    Allergies (if any)
                  </label>
                  <div className="space-y-3">
                    {/* Selected Allergies */}
                    {profileData.allergies?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profileData.allergies.map((allergy, index) => (
                          <div
                            key={index}
                            className="
    flex items-center gap-2 rounded-full px-3 py-2
    border
    bg-rose-50/80 border-rose-200
    dark:bg-rose-900/20 dark:border-rose-700
  "
                          >
                            <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
                              {allergy}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeAllergy(allergy)}
                              disabled={!isEditing}
                              aria-disabled={!isEditing}
                              className="
      inline-flex items-center justify-center
      text-rose-600 hover:text-rose-700
      dark:text-rose-300 dark:hover:text-rose-200
      transition-colors disabled:opacity-60 disabled:cursor-not-allowed
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 rounded-full
    "
                              title="Remove allergy"
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
                        className="shad-input p-3 rounded-3xl w-full text-white disabled:cursor-not-allowed"
                        disabled={!isEditing}
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
                                    className="w-full p-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-dark-500 transition-colors text-left border-b border-dark-500"
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
                                  onMouseDown={() =>
                                    handleAllergySelect(allergy)
                                  }
                                  className="w-full p-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors text-left"
                                >
                                  <span className="text-14-regular">
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
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">
                    Current medications (if any)
                  </label>
                  <div className="space-y-3">
                    {/* Selected Medications */}
                    {profileData.currentMedications?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profileData.currentMedications.map(
                          (medication, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full px-3 py-2 border bg-sky-50/80 border-sky-200 dark:bg-sky-900/20 dark:border-sky-700"
                            >
                              <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                                {medication}
                              </span>

                              <button
                                type="button"
                                onClick={() => removeMedication(medication)}
                                disabled={!isEditing}
                                aria-disabled={!isEditing}
                                className="inline-flex items-center justify-center text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 rounded-full"
                                title="Remove medication"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )
                        )}
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
                        disabled={!isEditing}
                        onKeyPress={handleMedicationKeyPress}
                        onFocus={() => setShowMedicationDropdown(true)}
                        onBlur={() =>
                          setTimeout(
                            () => setShowMedicationDropdown(false),
                            150
                          )
                        } // small delay
                        placeholder="Type to search medications or add custom..."
                        className="shad-input rounded-3xl p-2 w-full text-white disabled:cursor-not-allowed"
                      />

                      {/* Medication Dropdown */}
                      {showMedicationDropdown &&
                        (medicationSearch ||
                          filteredMedications.length > 0) && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-50 dark:bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                            <div className="max-h-48 overflow-y-auto">
                              {medicationSearch &&
                                !filteredMedications.includes(
                                  medicationSearch
                                ) && (
                                  <button
                                    type="button"
                                    onMouseDown={() =>
                                      handleMedicationSelect(medicationSearch)
                                    }
                                    className="w-full p-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors text-left border-b border-dark-500"
                                  >
                                    <Plus className="w-4 h-4 text-green-500" />
                                    <span className="text-14-regular">
                                      Add "{medicationSearch}"
                                    </span>
                                  </button>
                                )}
                              {filteredMedications.map((medication) => (
                                <button
                                  key={medication}
                                  type="button"
                                  onClick={() =>
                                    handleMedicationSelect(medication)
                                  }
                                  className="w-full p-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors text-left"
                                >
                                  <span className="text-14-regular">
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
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">
                    Family medical history (if relevant)
                  </label>
                  <div className="space-y-3">
                    {/* Existing Family History */}
                    {profileData.familyMedicalHistory?.length > 0 && (
                      <div className="space-y-2">
                        {profileData.familyMedicalHistory.map(
                          (history, index) => (
                            <div
                              key={index}
                              className="
        flex items-center justify-between rounded-lg p-3
        border
        bg-emerald-100 border-emerald-400
        dark:bg-emerald-900/20 dark:border-emerald-700
      "
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="text-sm text-slate-800 dark:text-slate-100">
                                  {history}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFamilyHistory(index)}
                                disabled={!isEditing}
                                aria-disabled={!isEditing}
                                className="
          text-rose-600 hover:text-rose-700
          dark:text-rose-300 dark:hover:text-rose-200
          transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 rounded-md
        "
                                title="Remove item"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Add Family History */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={familyHistoryInput}
                        disabled={!isEditing}
                        onChange={(e) => setFamilyHistoryInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFamilyHistory();
                          }
                        }}
                        placeholder="ex: Mother had breast cancer"
                        className="shad-input rounded-3xl p-3 flex-1 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={addFamilyHistory}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-14-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!isEditing}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Past Medical History */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">
                    Past medical history
                  </label>
                  <div className="space-y-3">
                    {/* Existing Past History */}
                    {profileData.pastMedicalHistory?.length > 0 && (
                      <div className="space-y-2">
                        {profileData.pastMedicalHistory.map(
                          (history, index) => (
                            <div
                              key={index}
                              className="
        flex items-center justify-between rounded-lg p-3
        border
        bg-sky-100 border-sky-400
        dark:bg-sky-900/20 dark:border-sky-700
      "
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-sky-500 rounded-full" />
                                <span className="text-sm text-slate-800 dark:text-slate-100">
                                  {history}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => removePastHistory(index)}
                                disabled={!isEditing}
                                aria-disabled={!isEditing}
                                className="
          text-rose-600 hover:text-rose-700
          dark:text-rose-300 dark:hover:text-rose-200
          transition-colors disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 rounded-md
        "
                                title="Remove item"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Add Past History */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pastHistoryInput}
                        disabled={!isEditing}
                        onChange={(e) => setPastHistoryInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addPastHistory();
                          }
                        }}
                        placeholder="ex: Asthma diagnosis in childhood"
                        className="shad-input flex-1 rounded-3xl p-3 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={addPastHistory}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-14-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!isEditing}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12">
            <button
              onClick={onBack}
              className="text-16-regular text-dark-600 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-md relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-dark-600 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <UpdatePassword onBack={() => setShowPasswordModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default PatientProfile;
