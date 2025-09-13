import React, { useState } from 'react';
import { Plus, User, Mail, Phone, Calendar, MapPin, Upload, ChevronDown, GraduationCap, Award, Shield, Clock, Building, Users, Settings } from 'lucide-react';

const adminRoles = [
  'Hospital Administrator',
  'Department Manager',
  'IT Administrator',
  'Finance Manager',
  'HR Manager',
  'Quality Assurance Manager',
  'Operations Manager',
  'Compliance Officer',
  'Medical Records Manager',
  'Facilities Manager'
];

const departments = [
  'Administration',
  'Human Resources',
  'Information Technology',
  'Finance & Billing',
  'Quality Assurance',
  'Operations',
  'Medical Records',
  'Facilities Management',
  'Compliance',
  'Patient Services'
];

const systemAccess = [
  'Electronic Health Records (EHR)',
  'Hospital Information System (HIS)',
  'Financial Management System',
  'Human Resources System',
  'Inventory Management',
  'Scheduling System',
  'Reporting & Analytics',
  'Compliance Management',
  'Document Management',
  'Communication Systems'
];

const AdminOnboarding = ({ onBack, onComplete }) => {
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
    adminRole: '',
    department: '',
    employeeId: '',
    reportingManager: '',
    yearsOfExperience: '',
    previousRole: '',
    
    // Education & Qualifications
    education: '',
    certifications: '',
    specialTraining: '',
    languagesSpoken: '',
    
    // System Access & Permissions
    systemAccess: '',
    securityClearance: '',
    accessLevel: '',
    
    // Work Information
    workSchedule: '',
    startDate: '',
    salary: '',
    benefits: '',
    
    // Documents
    resume: null,
    certificationDocs: null,
    backgroundCheck: null,
    
    // Consent & Security
    securityAgreement: true,
    dataConsent: true,
    confidentialityAgreement: true,
    codeOfConduct: true
  });

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showSystemAccessDropdown, setShowSystemAccessDropdown] = useState(false);
  const [selectedSystemAccess, setSelectedSystemAccess] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    certificationDocs: null,
    backgroundCheck: null
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

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      adminRole: role
    }));
    setShowRoleDropdown(false);
  };

  const handleDepartmentSelect = (dept) => {
    setFormData(prev => ({
      ...prev,
      department: dept
    }));
    setShowDepartmentDropdown(false);
  };

  const handleSystemAccessToggle = (system) => {
    const updatedAccess = selectedSystemAccess.includes(system)
      ? selectedSystemAccess.filter(s => s !== system)
      : [...selectedSystemAccess, system];
    
    setSelectedSystemAccess(updatedAccess);
    setFormData(prev => ({
      ...prev,
      systemAccess: updatedAccess.join(', ')
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Admin onboarding form submitted:', formData);
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
              <Shield className="w-8 h-8 text-red-500" />
              <span className="text-18-bold text-red-500">Administrator Registration</span>
            </div>
            <h1 className="text-36-bold text-white mb-2">Welcome, Administrator 🛡️</h1>
            <p className="text-16-regular text-dark-700">
              Complete your administrative profile to manage our healthcare system
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
                      placeholder="Michael Johnson"
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
                      placeholder="admin@hospital.com"
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
                        className="w-4 h-4 text-red-500 bg-dark-400 border-dark-500 focus:ring-red-500"
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
                        className="w-4 h-4 text-red-500 bg-dark-400 border-dark-500 focus:ring-red-500"
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
                      placeholder="123 Executive Drive, City, State 12345"
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
                {/* Admin Role */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Administrative role</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-red-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-dark-600" />
                        <span className="text-white">{formData.adminRole || 'Select administrative role'}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-dark-600 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showRoleDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-500">
                          <span className="text-14-medium text-dark-700">Administrative Roles</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {adminRoles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleRoleSelect(role)}
                              className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors text-left"
                            >
                              <Shield className="w-5 h-5 text-dark-600" />
                              <span className="text-16-medium text-white">{role}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="shad-input-label block mb-2">Department</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-red-500 transition-colors"
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

                {/* Employee ID */}
                <div>
                  <label className="shad-input-label block mb-2">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="EMP001234"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Reporting Manager */}
                <div>
                  <label className="shad-input-label block mb-2">Reporting manager</label>
                  <input
                    type="text"
                    name="reportingManager"
                    value={formData.reportingManager}
                    onChange={handleInputChange}
                    placeholder="Chief Executive Officer"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="shad-input-label block mb-2">Years of management experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="12"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                {/* Previous Role */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Previous role/experience</label>
                  <textarea
                    name="previousRole"
                    value={formData.previousRole}
                    onChange={handleInputChange}
                    placeholder="Describe your previous administrative or management experience"
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* Education & Qualifications */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Education & Qualifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <div>
                  <label className="shad-input-label block mb-2">Highest education level</label>
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
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="MBA">MBA</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="Professional Certification">Professional Certification</option>
                    </select>
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

                {/* Certifications */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Professional certifications</label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="PMP, Six Sigma, Healthcare Administration, etc."
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Special Training */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Special training or courses</label>
                  <textarea
                    name="specialTraining"
                    value={formData.specialTraining}
                    onChange={handleInputChange}
                    placeholder="Leadership training, healthcare management courses, compliance training, etc."
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </section>

            {/* System Access & Permissions */}
            <section>
              <h2 className="text-24-bold text-white mb-8">System Access & Permissions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Access */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Required system access</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSystemAccessDropdown(!showSystemAccessDropdown)}
                      className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-red-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-dark-600" />
                        <span className="text-white">
                          {selectedSystemAccess.length > 0 
                            ? `${selectedSystemAccess.length} system(s) selected`
                            : 'Select system access'
                          }
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-dark-600 transition-transform ${showSystemAccessDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSystemAccessDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-3 border-b border-dark-500">
                          <span className="text-14-medium text-dark-700">System Access</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {systemAccess.map((system) => (
                            <label
                              key={system}
                              className="w-full p-4 flex items-center gap-3 hover:bg-dark-500 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSystemAccess.includes(system)}
                                onChange={() => handleSystemAccessToggle(system)}
                                className="w-4 h-4 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                              />
                              <span className="text-14-regular text-white">{system}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Clearance */}
                <div>
                  <label className="shad-input-label block mb-2">Security clearance level</label>
                  <select
                    name="securityClearance"
                    value={formData.securityClearance}
                    onChange={handleInputChange}
                    className="shad-select-trigger w-full text-white"
                    required
                  >
                    <option value="">Select clearance level</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                {/* Access Level */}
                <div>
                  <label className="shad-input-label block mb-2">System access level</label>
                  <select
                    name="accessLevel"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    className="shad-select-trigger w-full text-white"
                    required
                  >
                    <option value="">Select access level</option>
                    <option value="Read Only">Read Only</option>
                    <option value="Standard User">Standard User</option>
                    <option value="Power User">Power User</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Super Administrator">Super Administrator</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Work Information */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Work Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Work Schedule */}
                <div>
                  <label className="shad-input-label block mb-2">Work schedule</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="text"
                      name="workSchedule"
                      value={formData.workSchedule}
                      onChange={handleInputChange}
                      placeholder="Mon-Fri 8AM-6PM"
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="shad-input-label block mb-2">Expected start date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-dark-600" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="shad-input pl-10 w-full text-white"
                      required
                    />
                  </div>
                </div>

                {/* Salary Expectation */}
                <div>
                  <label className="shad-input-label block mb-2">Salary expectation (annual)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="120000"
                    className="shad-input w-full text-white"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="shad-input-label block mb-2">Benefits package</label>
                  <select
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    className="shad-select-trigger w-full text-white"
                    required
                  >
                    <option value="">Select benefits package</option>
                    <option value="Standard">Standard Package</option>
                    <option value="Premium">Premium Package</option>
                    <option value="Executive">Executive Package</option>
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
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-red-500">
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
                          <Award className="w-6 h-6 text-white" />
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

                {/* Background Check */}
                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Background check authorization</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="backgroundCheck"
                      name="backgroundCheck"
                      onChange={(e) => handleFileUpload(e, 'backgroundCheck')}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <label htmlFor="backgroundCheck" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="file-upload_label">
                          <p className="text-14-regular text-green-500">
                            {uploadedFiles.backgroundCheck || 'Upload background check form'}
                          </p>
                          <p className="text-12-regular text-dark-600">Signed authorization form - PDF, DOC, DOCX</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Consent & Security Agreement */}
            <section>
              <h2 className="text-24-bold text-white mb-8">Security & Compliance Agreement</h2>
              
              <div className="space-y-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="securityAgreement"
                    checked={formData.securityAgreement}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I agree to comply with all security policies and procedures, including password requirements and system access protocols.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dataConsent"
                    checked={formData.dataConsent}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I consent to the collection and use of my personal and professional data for employment and system access purposes.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="confidentialityAgreement"
                    checked={formData.confidentialityAgreement}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I acknowledge my responsibility to maintain strict confidentiality of all patient information and organizational data.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="codeOfConduct"
                    checked={formData.codeOfConduct}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                    required
                  />
                  <span className="text-14-regular text-white">
                    I agree to abide by the organization's code of conduct and ethical standards for healthcare administration.
                  </span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg text-16-semibold transition-colors"
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

export default AdminOnboarding;