import React, { useState } from 'react';
import { Plus, User, Mail, Phone, Calendar, MapPin, Upload, ChevronDown, GraduationCap, Clock, Building, Users, Headphones } from 'lucide-react';

const departments = [
  'Front Desk Reception',
  'Patient Registration',
  'Appointment Scheduling',
  'Insurance Verification',
  'Medical Records',
  'Billing Department',
  'Emergency Department',
  'Outpatient Services'
];

const softwareExperience = [
  'Epic',
  'Cerner',
  'Allscripts',
  'NextGen',
  'eClinicalWorks',
  'Practice Fusion',
  'Athenahealth',
  'Meditech',
  'Microsoft Office Suite',
  'Google Workspace'
];

const ReceptionistOnboardingPage = ({ onBack, onComplete }) => {
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
    department: '',
    previousExperience: '',
    yearsOfExperience: '',
    currentEmployer: '',
    reasonForLeaving: '',
    
    // Skills & Qualifications
    education: '',
    certifications: '',
    softwareSkills: '',
    languagesSpoken: '',
    typingSpeed: '',
    
    // Work Preferences
    workSchedule: '',
    shiftPreference: '',
    availableHours: '',
    transportationMethod: '',
    
    // Documents
    resume: null,
    certificationDocs: null,
    references: null,
    
    // Consent
    backgroundCheck: true,
    dataConsent: true,
    workAgreement: true
  });

  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showSoftwareDropdown, setShowSoftwareDropdown] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    certificationDocs: null,
    references: null
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

  const handleDepartmentSelect = (dept) => {
    setFormData(prev => ({
      ...prev,
      department: dept
    }));
    setShowDepartmentDropdown(false);
  };

  const handleSoftwareToggle = (software) => {
    const updatedSoftware = selectedSoftware.includes(software)
      ? selectedSoftware.filter(s => s !== software)
      : [...selectedSoftware, software];
    
    setSelectedSoftware(updatedSoftware);
    setFormData(prev => ({
      ...prev,
      softwareSkills: updatedSoftware.join(', ')
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Receptionist onboarding form submitted:', formData);
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
              <Headphones className="w-8 h-8 text-purple-500" />
              <span className="text-18-bold text-purple-500">Receptionist Registration</span>
            </div>
            <h1 className="text-36-bold text-white mb-2">Welcome, Receptionist 👋</h1>
            <p className="text-16-regular text-dark-700">
              Join our team and be the first point of contact for our patients
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
                      placeholder="Sarah Johnson"
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
                      placeholder="receptionist@hospital.com"
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
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
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
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
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
                      placeholder="123 Main Street, City, State 12345"
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
                {/* Department */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Preferred department</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-purple-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-dark-600" />
                        <span className="text-white">{formData.department || 'Select department'}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-dark-600 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showDepartmentDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-500">
                          <span className="text-14-medium text-dark-700">Departments</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {departments.map((dept) => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => handleDepartmentSelect(dept)}
                              className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <Building className="w-5 h-5 text-dark-600" />
                              <span className="text-16-medium text-white">{dept}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="shad-input-label block mb-2">Years of experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="3"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Current Employer */}
                <div>
                  <label className="shad-input-label block mb-2">Current/Previous employer</label>
                  <input
                    type="text"
                    name="currentEmployer"
                    value={formData.currentEmployer}
                    onChange={handleInputChange}
                    placeholder="City General Hospital"
                    className="shad-input w-full text-white"
                  />
                </div>

                {/* Previous Experience */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Previous healthcare experience</label>
                  <textarea
                    name="previousExperience"
                    value={formData.previousExperience}
                    onChange={handleInputChange}
                    placeholder="Describe your previous experience in healthcare or customer service"
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Reason for Leaving */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Reason for leaving current position (if applicable)</label>
                  <textarea
                    name="reasonForLeaving"
                    value={formData.reasonForLeaving}
                    onChange={handleInputChange}
                    placeholder="Career advancement, relocation, etc."
                    className="shad-textArea w-full text-white min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* Skills & Qualifications */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Skills & Qualifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <div>
                  <label className="shad-input-label block mb-2">Education level</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="w-5 h-5 text-dark-600" />
                    </div>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="shad-select-trigger pl-10 w-full text-white"
                      required
                    >
                      <option value="">Select education level</option>
                      <option value="High School Diploma">High School Diploma</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="Certificate Program">Certificate Program</option>
                    </select>
                  </div>
                </div>

                {/* Typing Speed */}
                <div>
                  <label className="shad-input-label block mb-2">Typing speed (WPM)</label>
                  <input
                    type="number"
                    name="typingSpeed"
                    value={formData.typingSpeed}
                    onChange={handleInputChange}
                    placeholder="45"
                    className="shad-input w-full text-white"
                  />
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

                {/* Certifications */}
                <div>
                  <label className="shad-input-label block mb-2">Relevant certifications</label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="CPR, First Aid, Medical Terminology"
                    className="shad-input w-full text-white"
                  />
                </div>

                {/* Software Skills */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Software experience</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSoftwareDropdown(!showSoftwareDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-purple-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-dark-600" />
                        <span className="text-white">
                          {selectedSoftware.length > 0 
                            ? `${selectedSoftware.length} software(s) selected`
                            : 'Select software experience'
                          }
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-dark-600 transition-transform ${showSoftwareDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSoftwareDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-500">
                          <span className="text-14-medium text-dark-700">Software & Systems</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {softwareExperience.map((software) => (
                            <label
                              key={software}
                              className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSoftware.includes(software)}
                                onChange={() => handleSoftwareToggle(software)}
                                className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 rounded focus:ring-purple-500"
                              />
                              <span className="text-14-regular text-white">{software}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Work Preferences */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Work Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Schedule */}
                <div>
                  <label className="shad-input-label block mb-2">Preferred work schedule</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="workSchedule"
                        value="Full-time"
                        checked={formData.workSchedule === 'Full-time'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Full-time</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="workSchedule"
                        value="Part-time"
                        checked={formData.workSchedule === 'Part-time'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Part-time</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="workSchedule"
                        value="Contract"
                        checked={formData.workSchedule === 'Contract'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Contract</span>
                    </label>
                  </div>
                </div>

                {/* Shift Preference */}
                <div>
                  <label className="shad-input-label block mb-2">Shift preference</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shiftPreference"
                        value="Day shift"
                        checked={formData.shiftPreference === 'Day shift'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Day shift (7AM-3PM)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shiftPreference"
                        value="Evening shift"
                        checked={formData.shiftPreference === 'Evening shift'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Evening shift (3PM-11PM)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shiftPreference"
                        value="Night shift"
                        checked={formData.shiftPreference === 'Night shift'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Night shift (11PM-7AM)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shiftPreference"
                        value="Flexible"
                        checked={formData.shiftPreference === 'Flexible'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-500 bg-dark-400 border-dark-500 focus:ring-purple-500"
                      />
                      <span className="text-14-regular text-white">Flexible</span>
                    </label>
                  </div>
                </div>

                {/* Available Hours */}
                <div>
                  <label className="shad-input-label block mb-2">Available hours per week</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="number"
                      name="availableHours"
                      value={formData.availableHours}
                      onChange={handleInputChange}
                      placeholder="40"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Transportation */}
                <div>
                  <label className="shad-input-label block mb-2">Transportation method</label>
                  <select
                    name="transportationMethod"
                    value={formData.transportationMethod}
                    onChange={handleInputChange}
                    className="shad-select-trigger w-full text-white"
                    required
                  >
                    <option value="">Select transportation</option>
                    <option value="Own vehicle">Own vehicle</option>
                    <option value="Public transportation">Public transportation</option>
                    <option value="Rideshare">Rideshare</option>
                    <option value="Walking/Biking">Walking/Biking</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Document Upload */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Document Upload</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume */}
                <div>
                  <label className="shad-input-label block mb-2">Resume/CV</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={(e) => handleFileUpload(e, 'resume')}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-purple-500">
                            {uploadedFiles.resume || 'Upload resume'}
                          </p>
                          <p className="text-12-regular text-dark-600">PDF, DOC, DOCX (max 5MB)</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Certification Documents */}
                <div>
                  <label className="shad-input-label block mb-2">Certification documents</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="certificationDocs"
                      name="certificationDocs"
                      onChange={(e) => handleFileUpload(e, 'certificationDocs')}
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                    />
                    <label htmlFor="certificationDocs" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-blue-500">
                            {uploadedFiles.certificationDocs || 'Upload certifications'}
                          </p>
                          <p className="text-12-regular text-dark-600">Multiple files allowed - PDF, JPG, PNG</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* References */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">References document</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="references"
                      name="references"
                      onChange={(e) => handleFileUpload(e, 'references')}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label htmlFor="references" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-green-500">
                            {uploadedFiles.references || 'Upload references'}
                          </p>
                          <p className="text-12-regular text-dark-600">List of professional references - PDF, DOC, DOCX</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Consent and Agreement */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Employment Agreement</h2>
              
              <div className="space-y-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="backgroundCheck"
                    checked={formData.backgroundCheck}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-purple-500 bg-dark-400 border-dark-500 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I consent to a background check and drug screening as required for employment.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dataConsent"
                    checked={formData.dataConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-purple-500 bg-dark-400 border-dark-500 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I consent to the collection and use of my personal data for employment purposes.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="workAgreement"
                    checked={formData.workAgreement}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-purple-500 bg-dark-400 border-dark-500 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I agree to maintain patient confidentiality and follow all hospital policies and procedures.
                  </span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-lg text-16-semibold transition-colors"
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

export default ReceptionistOnboardingPage;