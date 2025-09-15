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
} from "lucide-react";
import FileUpload from "../FileUpload";

const physicians = [
  {
    id: "1",
    name: "Dr. Adam Smith",
    avatar:
      "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    specialty: "General Medicine",
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    specialty: "Internal Medicine",
  },
  {
    id: "3",
    name: "Dr. Michael Brown",
    avatar:
      "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    specialty: "Family Medicine",
  },
  {
    id: "4",
    name: "Dr. Emily Davis",
    avatar:
      "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    specialty: "Cardiology",
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

const PatientOnboarding = ({ email, name, onBack, onComplete }) => {
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
    allergies: "",
    currentMedications: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",

    // Identification
    identificationType: "Birth Certificate",
    identificationNumber: "",
    identificationDocument: null,
    identificationDocumentId: null,

    // Consent
    treatmentConsent: true,
    disclosureConsent: false,
    privacyConsent: true,
  });

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

  const handleFileUpload = (fileId, uploadData) => {
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
    onComplete();
  };

  return (
    <div className="min-h-screen bg-dark-300">
      {/* Header */}
      <div className="bg-dark-200 border-b border-dark-500 px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <span className="text-24-bold text-white">CarePulse</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="sub-container max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-36-bold text-white mb-2 flex items-center gap-2">
              Welcome 👋, {name}
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+00 0342 0453 34"
                    className="shad-input pl-10 w-full text-white"
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="ex: +1 (868) 579-9831"
                    className="shad-input pl-10 w-full text-white"
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
                              {physician.specialty && (
                                <div className="text-12-regular text-dark-600">
                                  {physician.specialty}
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

              {/* Allergies */}
              <div>
                <label className="shad-input-label block mb-2">
                  Allergies (if any)
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="ex: Peanuts, Penicillin, Pollen"
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              {/* Current Medications */}
              <div>
                <label className="shad-input-label block mb-2">
                  Current medications
                </label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              {/* Family Medical History */}
              <div>
                <label className="shad-input-label block mb-2">
                  Family medical history (if relevant)
                </label>
                <textarea
                  name="familyMedicalHistory"
                  value={formData.familyMedicalHistory}
                  onChange={handleInputChange}
                  placeholder="ex: Mother had breast cancer"
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              {/* Past Medical History */}
              <div>
                <label className="shad-input-label block mb-2">
                  Past medical history
                </label>
                <textarea
                  name="pastMedicalHistory"
                  value={formData.pastMedicalHistory}
                  onChange={handleInputChange}
                  placeholder="ex: Asthma diagnosis in childhood"
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
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
              onClick={() => {
                console.log("Form Data:", formData);
              }}
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
            <p className="copyright">©carepulse copyright</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
