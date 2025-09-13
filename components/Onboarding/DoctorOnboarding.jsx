import React, { useState } from 'react';
import { Plus, User, Mail, Phone, Calendar, MapPin, Briefcase, Upload, ChevronDown, GraduationCap, Award, Stethoscope, Clock, Building } from 'lucide-react';

const specialties = [
  'General Medicine',
  'Internal Medicine',
  'Family Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology'
];

const hospitals = [
  'City General Hospital',
  'Metropolitan Medical Center',
  'St. Mary\'s Hospital',
  'University Medical Center',
  'Regional Health System',
  'Community Hospital',
  'Children\'s Hospital',
  'Cancer Treatment Center'
];

const DoctorOnboardingPage = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContactName: '',
    emergencyPhone: '',
    
    // Professional Information
    medicalLicenseNumber: '',
    specialty: '',
    subSpecialty: '',
    yearsOfExperience: '',
    currentHospital: '',
    previousHospitals: '',
    
    // Education & Certifications
    medicalSchool: '',
    graduationYear: '',
    residencyProgram: '',
    fellowshipProgram: '',
    boardCertifications: '',
    continuingEducation: '',
    
    // Practice Information
    consultationFee: '',
    availableHours: '',
    languagesSpoken: '',
    insuranceAccepted: '',
    
    // Documents
    medicalLicense: null,
    cv: null,
    certifications: null,
    
    // Consent
    practiceConsent: true,
    dataConsent: true,
    ethicsConsent: true
  });

  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    medicalLicense: null,
    cv: null,
    certifications: null
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  const handleSpecialtySelect = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialty: specialty
    }));
    setShowSpecialtyDropdown(false);
  };

  const handleHospitalSelect = (hospital) => {
    setFormData(prev => ({
      ...prev,
      currentHospital: hospital
    }));
    setShowHospitalDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Doctor onboarding form submitted:', formData);
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
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-8 h-8 text-green-500" />
              <span className="text-18-bold text-green-500">Doctor Registration</span>
            </div>
            <h1 className="text-36-bold text-white mb-2">Welcome, Doctor 👨‍⚕️</h1>
            <p className="text-16-regular text-dark-700">
              Complete your professional profile to join our healthcare network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Personal Information */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Personal Information</h2>
              
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
                      placeholder="Dr. John Smith"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="shad-input-label block mb-2">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="doctor@hospital.com"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="shad-input-label block mb-2">Phone number</label>
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

                {/* Date of Birth */}
                <div>
                  <label className="shad-input-label block mb-2">Date of birth</label>
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
                        checked={formData.gender === 'Male'}
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
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 focus:ring-green-500"
                      />
                      <span className="text-14-regular text-white">Female</span>
                    </label>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
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
                      placeholder="123 Medical Center Drive, City, State 12345"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="shad-input-label block mb-2">Emergency contact name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Emergency phone number</label>
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
            </section>

            {/* Professional Information */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical License Number */}
                <div>
                  <label className="shad-input-label block mb-2">Medical license number</label>
                  <input
                    type="text"
                    name="medicalLicenseNumber"
                    value={formData.medicalLicenseNumber}
                    onChange={handleInputChange}
                    placeholder="MD123456789"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Specialty */}
                <div>
                  <label className="shad-input-label block mb-2">Primary specialty</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSpecialtyDropdown(!showSpecialtyDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                    >
                      <span className="text-white">{formData.specialty || 'Select specialty'}</span>
                      <ChevronDown className={`w-5 h-5 text-dark-600 transition-transform ${showSpecialtyDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSpecialtyDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-500">
                          <span className="text-14-medium text-dark-700">Medical Specialties</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {specialties.map((specialty) => (
                            <button
                              key={specialty}
                              type="button"
                              onClick={() => handleSpecialtySelect(specialty)}
                              className="w-full p-4 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                            >
                              <span className="text-16-medium text-white">{specialty}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-specialty */}
                <div>
                  <label className="shad-input-label block mb-2">Sub-specialty (if any)</label>
                  <input
                    type="text"
                    name="subSpecialty"
                    value={formData.subSpecialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Interventional Cardiology"
                    className="shad-input w-full text-white"
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="shad-input-label block mb-2">Years of experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="10"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Current Hospital */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Current hospital/clinic</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-dark-600" />
                        <span className="text-white">{formData.currentHospital || 'Select hospital/clinic'}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-dark-600 transition-transform ${showHospitalDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showHospitalDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-500">
                          <span className="text-14-medium text-dark-700">Hospitals & Clinics</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {hospitals.map((hospital) => (
                            <button
                              key={hospital}
                              type="button"
                              onClick={() => handleHospitalSelect(hospital)}
                              className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <Building className="w-5 h-5 text-dark-600" />
                              <span className="text-16-medium text-white">{hospital}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Previous Hospitals */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Previous hospitals/clinics</label>
                  <textarea
                    name="previousHospitals"
                    value={formData.previousHospitals}
                    onChange={handleInputChange}
                    placeholder="List previous workplaces and duration"
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* Education & Certifications */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Education & Certifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical School */}
                <div>
                  <label className="shad-input-label block mb-2">Medical school</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="text"
                      name="medicalSchool"
                      value={formData.medicalSchool}
                      onChange={handleInputChange}
                      placeholder="Harvard Medical School"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="shad-input-label block mb-2">Graduation year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    placeholder="2015"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Residency Program */}
                <div>
                  <label className="shad-input-label block mb-2">Residency program</label>
                  <input
                    type="text"
                    name="residencyProgram"
                    value={formData.residencyProgram}
                    onChange={handleInputChange}
                    placeholder="Internal Medicine - Johns Hopkins"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Fellowship Program */}
                <div>
                  <label className="shad-input-label block mb-2">Fellowship program (if any)</label>
                  <input
                    type="text"
                    name="fellowshipProgram"
                    value={formData.fellowshipProgram}
                    onChange={handleInputChange}
                    placeholder="Cardiology Fellowship - Mayo Clinic"
                    className="shad-input w-full text-white"
                  />
                </div>

                {/* Board Certifications */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Board certifications</label>
                  <textarea
                    name="boardCertifications"
                    value={formData.boardCertifications}
                    onChange={handleInputChange}
                    placeholder="List all board certifications and dates"
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                    required
                  />
                </div>

                {/* Continuing Education */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Recent continuing education</label>
                  <textarea
                    name="continuingEducation"
                    value={formData.continuingEducation}
                    onChange={handleInputChange}
                    placeholder="Recent courses, conferences, or training programs"
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* Practice Information */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Practice Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Consultation Fee */}
                <div>
                  <label className="shad-input-label block mb-2">Consultation fee</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    placeholder="200"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Available Hours */}
                <div>
                  <label className="shad-input-label block mb-2">Available hours</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="text"
                      name="availableHours"
                      value={formData.availableHours}
                      onChange={handleInputChange}
                      placeholder="Mon-Fri 9AM-5PM"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Languages Spoken */}
                <div>
                  <label className="shad-input-label block mb-2">Languages spoken</label>
                  <input
                    type="text"
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleInputChange}
                    placeholder="English, Spanish, French"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Insurance Accepted */}
                <div>
                  <label className="shad-input-label block mb-2">Insurance accepted</label>
                  <input
                    type="text"
                    name="insuranceAccepted"
                    value={formData.insuranceAccepted}
                    onChange={handleInputChange}
                    placeholder="BlueCross, Aetna, Medicare"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Document Upload */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Document Upload</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medical License */}
                <div>
                  <label className="shad-input-label block mb-2">Medical license document</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="medicalLicense"
                      name="medicalLicense"
                      onChange={(e) => handleFileUpload(e, 'medicalLicense')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <label htmlFor="medicalLicense" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-green-500">
                            {uploadedFiles.medicalLicense || 'Upload medical license'}
                          </p>
                          <p className="text-12-regular text-dark-600">PDF, JPG, PNG (max 5MB)</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* CV/Resume */}
                <div>
                  <label className="shad-input-label block mb-2">CV/Resume</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="cv"
                      name="cv"
                      onChange={(e) => handleFileUpload(e, 'cv')}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label htmlFor="cv" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-blue-500">
                            {uploadedFiles.cv || 'Upload CV/Resume'}
                          </p>
                          <p className="text-12-regular text-dark-600">PDF, DOC, DOCX (max 5MB)</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Certifications */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Board certifications documents</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="certifications"
                      name="certifications"
                      onChange={(e) => handleFileUpload(e, 'certifications')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                    />
                    <label htmlFor="certifications" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-purple-500">
                            {uploadedFiles.certifications || 'Upload certifications'}
                          </p>
                          <p className="text-12-regular text-dark-600">Multiple files allowed - PDF, JPG, PNG</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Consent and Agreement */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Professional Agreement</h2>
              
              <div className="space-y-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="practiceConsent"
                    checked={formData.practiceConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I agree to practice medicine in accordance with professional standards and hospital policies.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dataConsent"
                    checked={formData.dataConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I consent to the collection and use of my professional data for credentialing and practice management.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ethicsConsent"
                    checked={formData.ethicsConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I acknowledge and agree to abide by the medical ethics code and professional conduct guidelines.
                  </span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg text-16-semibold transition-colors"
              >
                Complete Registration
              </button>
            </div>
          </form>

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

export default DoctorOnboardingPage;