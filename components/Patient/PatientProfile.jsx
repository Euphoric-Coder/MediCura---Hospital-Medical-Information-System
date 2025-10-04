import React, { useState } from "react";
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
} from "lucide-react";
import UpdatePassword from "../UpdatePassword";

const PatientProfile = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const [profileData, setProfileData] = useState({
    // Personal Information
    name: "John Smith",
    avatar: "https://via.placeholder.com/150",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: "123 Main Street, New York, NY 10001",
    occupation: "Software Engineer",
    emergencyContactName: "Jane Smith",
    emergencyPhone: "+1 (555) 987-6543",

    // Health Information
    primaryPhysician: "Dr. Sarah Johnson",
    insuranceProvider: "BlueCross BlueShield",
    insurancePolicyNumber: "BC123456789",
    insurancePolicyDocument: "https://via.placeholder.com/150",
    insurancePolicyDocumentId: "policy123",
    allergies: ["Penicillin", "Peanuts"], // JSON array of allergies, e.g., "Penicillin, Peanuts",
    currentMedications: ["Aspirin", "Ibuprofen"], // JSON array of current medications, e.g., "Aspirin, Ibuprofen",
    familyMedicalHistory: ["High blood pressure", "Diabetes"], // JSON array of family medical history, e.g., "High blood pressure, Diabetes",
    pastMedicalHistory: ["Heart attack", "Stroke"], // JSON array of past medical history, e.g., "Heart attack, Stroke",

    // Identification
    identificationType: "Driver's License",
    identificationNumber: "123456789",
    identificationDocument: "https://via.placeholder.com/150",
    identificationDocumentId: "license123",

    // Consent
    treatmentConsent: true,
    disclosureConsent: false,
    privacyConsent: false,
  });

  const [editData, setEditData] = useState(profileData);

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
    setEditData(profileData);
    setMessage("");
    setMessageType("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProfileData(editData);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  };

  const ProfileField = ({
    label,
    name,
    value,
    type = "text",
    icon: Icon,
    isTextArea = false,
  }) => (
    <div>
      <label className="shad-input-label block mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-dark-600" />
        </div>
        {isTextArea ? (
          <textarea
            name={name}
            value={isEditing ? editData[name] : value}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`shad-textArea pl-10 w-full text-white min-h-[80px] resize-none ${
              !isEditing ? "bg-dark-500/50 cursor-not-allowed" : ""
            }`}
            rows={3}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={isEditing ? editData[name] : value}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`shad-input pl-10 w-full text-white ${
              !isEditing ? "bg-dark-500/50 cursor-not-allowed" : ""
            }`}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-24-bold text-white">MediCura</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-dark-400/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-dark-500/50">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-14-medium text-white">
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
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-dark-400 hover:bg-green-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div>
                  <h1 className="text-36-bold text-white mb-2">
                    {profileData.name}
                  </h1>
                  <p className="text-16-regular text-dark-700">
                    {profileData.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-14-regular text-green-400">
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
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      <Lock className="w-5 h-5" />
                      Update Password
                    </button>
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${
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
                <span className="text-16-regular">{message}</span>
              </div>
            )}
          </div>

          {/* Profile Sections */}
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  icon={User}
                />
                <ProfileField
                  label="Email Address"
                  name="email"
                  value={profileData.email}
                  type="email"
                  icon={Mail}
                />
                <ProfileField
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  type="tel"
                  icon={Phone}
                />
                <ProfileField
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  type="date"
                  icon={Calendar}
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
                          className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 focus:ring-green-500 disabled:opacity-50"
                        />
                        <span className="text-14-regular text-white">
                          {gender}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <ProfileField
                  label="Occupation"
                  name="occupation"
                  value={profileData.occupation}
                  icon={Briefcase}
                />
                <div className="md:col-span-2">
                  <ProfileField
                    label="Address"
                    name="address"
                    value={profileData.address}
                    icon={MapPin}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">Emergency Contact</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  value={profileData.emergencyContactName}
                  icon={User}
                />
                <ProfileField
                  label="Emergency Phone Number"
                  name="emergencyPhone"
                  value={profileData.emergencyPhone}
                  type="tel"
                  icon={Phone}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">Medical Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label="Primary Physician"
                  name="primaryPhysician"
                  value={profileData.primaryPhysician}
                  icon={User}
                />
                <ProfileField
                  label="Insurance Provider"
                  name="insuranceProvider"
                  value={profileData.insuranceProvider}
                  icon={Shield}
                />
                <div className="md:col-span-2">
                  <ProfileField
                    label="Insurance Policy Number"
                    name="insurancePolicyNumber"
                    value={profileData.insurancePolicyNumber}
                    icon={Shield}
                  />
                </div>
                <ProfileField
                  label="Allergies"
                  name="allergies"
                  value={profileData.allergies}
                  icon={AlertCircle}
                  isTextArea
                />
                <ProfileField
                  label="Current Medications"
                  name="currentMedications"
                  value={profileData.currentMedications}
                  icon={Plus}
                  isTextArea
                />
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
