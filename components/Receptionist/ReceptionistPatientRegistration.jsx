import React, { useState } from 'react';
import { Plus, UserPlus, User, Mail, Phone, Calendar, MapPin, Upload, Shield, FileText, CheckCircle, AlertCircle, Save } from 'lucide-react';

const ReceptionistPatientRegistration = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceGroupNumber: '',
    allergies: '',
    currentMedications: '',
    medicalHistory: '',
    primaryPhysician: '',
    insuranceCard: null,
    idDocument: null
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    insuranceCard: null,
    idDocument: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: file.name
      }));
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
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
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Patient registered successfully!');
      setMessageType('success');
      
      // Reset form after successful registration
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          emergencyContactName: '',
          emergencyPhone: '',
          insuranceProvider: '',
          insurancePolicyNumber: '',
          insuranceGroupNumber: '',
          allergies: '',
          currentMedications: '',
          medicalHistory: '',
          primaryPhysician: '',
          insuranceCard: null,
          idDocument: null
        });
        setUploadedFiles({ insuranceCard: null, idDocument: null });
        setCurrentStep(1);
      }, 2000);
    } catch (error) {
      setMessage('Failed to register patient. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">Full name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Email address *</label>
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
                <label className="shad-input-label block mb-2">Phone number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="shad-input pl-10 w-full text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Date of birth *</label>
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
                  {['Male', 'Female', 'Other'].map((gender) => (
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
                      <span className="text-14-regular text-white">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
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
                <label className="shad-input-label block mb-2">Emergency contact name *</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Jane Smith"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Emergency phone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 987-6543"
                    className="shad-input pl-10 w-full text-white"
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
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">Insurance Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="shad-input-label block mb-2">Insurance provider *</label>
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
                <label className="shad-input-label block mb-2">Policy number *</label>
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

              <div className="md:col-span-2">
                <label className="shad-input-label block mb-2">Group number</label>
                <input
                  type="text"
                  name="insuranceGroupNumber"
                  value={formData.insuranceGroupNumber}
                  onChange={handleInputChange}
                  placeholder="GRP001234"
                  className="shad-input w-full text-white"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">Medical Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="shad-input-label block mb-2">Primary physician</label>
                <input
                  type="text"
                  name="primaryPhysician"
                  value={formData.primaryPhysician}
                  onChange={handleInputChange}
                  placeholder="Dr. Sarah Safari"
                  className="shad-input w-full text-white"
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="Penicillin, Peanuts, etc."
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Current medications</label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  placeholder="Lisinopril 10mg daily, etc."
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Medical history</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Previous surgeries, chronic conditions, etc."
                  className="shad-textArea w-full text-white min-h-[100px] resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-20-bold lg:text-24-bold text-white mb-6">Document Upload</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="shad-input-label block mb-2">Insurance card *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="insuranceCard"
                    name="insuranceCard"
                    onChange={(e) => handleFileUpload(e, 'insuranceCard')}
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
                          {uploadedFiles.insuranceCard || 'Upload insurance card'}
                        </p>
                        <p className="text-12-regular text-dark-600">JPG, PNG, PDF (max 5MB)</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="shad-input-label block mb-2">ID document *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    id="idDocument"
                    name="idDocument"
                    onChange={(e) => handleFileUpload(e, 'idDocument')}
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
                          {uploadedFiles.idDocument || 'Upload ID document'}
                        </p>
                        <p className="text-12-regular text-dark-600">JPG, PNG, PDF (max 5MB)</p>
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
              <span className="text-20-bold lg:text-24-bold text-white">Patient Registration</span>
              <p className="text-12-regular lg:text-14-regular text-dark-700">Register new patients</p>
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
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-14-medium lg:text-16-medium font-semibold ${
                  step <= currentStep
                    ? 'bg-purple-500 text-white'
                    : 'bg-dark-400 text-dark-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 lg:w-24 h-1 mx-2 ${
                    step < currentStep ? 'bg-purple-500' : 'bg-dark-400'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-12-regular lg:text-14-regular text-dark-700">
            <span className={currentStep >= 1 ? 'text-purple-400' : ''}>Personal Info</span>
            <span className={currentStep >= 2 ? 'text-purple-400' : ''}>Insurance</span>
            <span className={currentStep >= 3 ? 'text-purple-400' : ''}>Medical Info</span>
            <span className={currentStep >= 4 ? 'text-purple-400' : ''}>Documents</span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-6 lg:mb-8 ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-14-regular lg:text-16-regular">{message}</span>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 lg:p-8 mb-8">
          <form onSubmit={handleSubmit}>
            {getStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={currentStep === 1 ? onBack : handlePrevStep}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                {currentStep === 1 ? '← Back' : 'Previous'}
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
                  type="submit"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistPatientRegistration;