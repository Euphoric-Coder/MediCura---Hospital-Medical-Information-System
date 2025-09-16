import React, { useState } from 'react';
import { Plus, Users, Search, Eye, Phone, Mail, User, Calendar, Edit, FileText, X, CheckCircle, AlertTriangle } from 'lucide-react';

const PatientDetailsModal = ({ isOpen, onClose, patient, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  React.useEffect(() => {
    if (patient) {
      setEditData(patient);
    }
  }, [patient]);

  const handleSave = () => {
    if (patient && editData) {
      onUpdate(patient.id, editData);
      setIsEditing(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Patient Details</h2>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-14-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  >
                    Save
                  </button>
                </div>
              )}
              <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Patient Header */}
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto sm:mx-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-20-bold sm:text-24-bold lg:text-32-bold text-white mb-2">{patient.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-14-regular lg:text-16-regular text-dark-700">
                  <span>{patient.age} years old</span>
                  <span>{patient.gender}</span>
                  <span>ID: {patient.id}</span>
                  <span className={`px-2 py-1 rounded-full text-12-medium ${
                    patient.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6">
              <h3 className="text-16-bold lg:text-18-bold text-white mb-4">Personal Information</h3>
              <div className="space-y-3 text-14-regular text-dark-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="shad-input flex-1 text-white"
                    />
                  ) : (
                    <span>{patient.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="shad-input flex-1 text-white"
                    />
                  ) : (
                    <span>{patient.email}</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Address:</span>
                  {isEditing ? (
                    <textarea
                      value={editData.address || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                      className="shad-textArea w-full text-white mt-2 min-h-[60px] resize-none"
                      rows={2}
                    />
                  ) : (
                    <span className="ml-2">{patient.address}</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Date of Birth:</span> {patient.dateOfBirth}
                </div>
                <div>
                  <span className="text-white">Registration:</span> {patient.registrationDate}
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6">
              <h3 className="text-16-bold lg:text-18-bold text-white mb-4">Medical Information</h3>
              <div className="space-y-3 text-14-regular text-dark-700">
                <div>
                  <span className="text-white">Primary Physician:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.primaryPhysician || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, primaryPhysician: e.target.value }))}
                      className="shad-input w-full text-white mt-2"
                    />
                  ) : (
                    <span className="ml-2">{patient.primaryPhysician}</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Last Visit:</span> {patient.lastVisit}
                </div>
                {patient.nextAppointment && (
                  <div>
                    <span className="text-white">Next Appointment:</span> {patient.nextAppointment}
                  </div>
                )}
                <div>
                  <span className="text-white">Total Visits:</span> {patient.totalVisits}
                </div>
                <div>
                  <span className="text-white">Allergies:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-12-medium text-red-400"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6">
              <h3 className="text-16-bold lg:text-18-bold text-white mb-4">Insurance Information</h3>
              <div className="space-y-3 text-14-regular text-dark-700">
                <div>
                  <span className="text-white">Provider:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.insurance?.provider || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        insurance: { ...prev.insurance, provider: e.target.value }
                      }))}
                      className="shad-input w-full text-white mt-2"
                    />
                  ) : (
                    <span className="ml-2">{patient.insurance.provider}</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Policy Number:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.insurance?.policyNumber || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        insurance: { ...prev.insurance, policyNumber: e.target.value }
                      }))}
                      className="shad-input w-full text-white mt-2"
                    />
                  ) : (
                    <span className="ml-2">{patient.insurance.policyNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">Verified:</span>
                  <span className={`px-2 py-1 rounded-full text-12-medium ${
                    patient.insurance.verified 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {patient.insurance.verified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6">
              <h3 className="text-16-bold lg:text-18-bold text-white mb-4">Emergency Contact</h3>
              <div className="space-y-3 text-14-regular text-dark-700">
                <div>
                  <span className="text-white">Name:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.emergencyContact?.name || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                      className="shad-input w-full text-white mt-2"
                    />
                  ) : (
                    <span className="ml-2">{patient.emergencyContact.name}</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Phone:</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.emergencyContact?.phone || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      className="shad-input w-full text-white mt-2"
                    />
                  ) : (
                    <span className="ml-2">{patient.emergencyContact.phone}</span>
                  )}
                </div>
                <div>
                  <span className="text-white">Relationship:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.emergencyContact?.relationship || ''}
                      onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                      }))}
                      className="shad-input w-full text-white mt-2"
                    />
                  ) : (
                    <span className="ml-2">{patient.emergencyContact.relationship}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 bg-dark-500/30 rounded-2xl p-4 sm:p-6">
            <h3 className="text-16-bold lg:text-18-bold text-white mb-4">Reception Notes</h3>
            {isEditing ? (
              <textarea
                value={editData.notes || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this patient..."
                className="shad-textArea w-full text-white min-h-[100px] resize-none"
                rows={4}
              />
            ) : (
              <p className="text-14-regular text-dark-700">
                {patient.notes || 'No notes available'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceptionistPatients = ({ onBack }) => {
  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      dateOfBirth: '1979-05-15',
      registrationDate: '2023-01-15',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      totalVisits: 12,
      status: 'active',
      primaryPhysician: 'Dr. Sarah Safari',
      insurance: {
        provider: 'BlueCross BlueShield',
        policyNumber: 'BC123456789',
        verified: true
      },
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      },
      allergies: ['Penicillin', 'Peanuts'],
      notes: 'Prefers morning appointments. Very punctual.'
    },
    {
      id: 'P002',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      email: 'emily.johnson@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      dateOfBirth: '1992-08-22',
      registrationDate: '2023-03-10',
      lastVisit: '2024-01-10',
      totalVisits: 8,
      status: 'active',
      primaryPhysician: 'Dr. Ava Williams',
      insurance: {
        provider: 'Aetna',
        policyNumber: 'AET987654321',
        verified: true
      },
      emergencyContact: {
        name: 'Michael Johnson',
        phone: '+1 (555) 876-5432',
        relationship: 'Brother'
      },
      allergies: ['Shellfish']
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 67,
      gender: 'Male',
      phone: '+1 (555) 345-6789',
      email: 'michael.brown@email.com',
      address: '789 Pine St, Chicago, IL 60601',
      dateOfBirth: '1957-12-03',
      registrationDate: '2022-06-20',
      lastVisit: '2024-01-08',
      totalVisits: 25,
      status: 'active',
      primaryPhysician: 'Dr. Adam Smith',
      insurance: {
        provider: 'Medicare',
        policyNumber: 'MED123456789',
        verified: false
      },
      emergencyContact: {
        name: 'Susan Brown',
        phone: '+1 (555) 765-4321',
        relationship: 'Wife'
      },
      allergies: ['Aspirin', 'Latex'],
      notes: 'Requires wheelchair assistance. Hard of hearing.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleUpdatePatient = (patientId, updatedData) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, ...updatedData }
        : patient
    ));

    setMessage('Patient information updated successfully');
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;
  const newPatients = patients.filter(p => {
    const regDate = new Date(p.registrationDate);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return regDate >= monthAgo;
  }).length;
  const unverifiedInsurance = patients.filter(p => !p.insurance.verified).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Patient Records</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">View and manage patient information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
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
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">{message}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{totalPatients}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Total Patients</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{activePatients}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Active</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{newPatients}</div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">New This Month</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{unverifiedInsurance}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Insurance Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patients by name, ID, or phone..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Patient Directory</h2>
            </div>

            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{patient.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-10-medium sm:text-12-medium ${
                            patient.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div>
                            <span className="text-white">Age:</span> {patient.age}
                          </div>
                          <div>
                            <span className="text-white">ID:</span> {patient.id}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Last Visit:</span> {patient.lastVisit}
                          </div>
                          <div>
                            <span className="text-white">Total Visits:</span> {patient.totalVisits}
                          </div>
                          <div>
                            <span className="text-white">Primary Dr:</span> {patient.primaryPhysician}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-10-medium ${
                            patient.insurance.verified 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            Insurance {patient.insurance.verified ? 'Verified' : 'Pending'}
                          </span>
                          {patient.nextAppointment && (
                            <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-10-medium text-blue-400">
                              Next: {patient.nextAppointment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                        
                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-purple-500/20">
                  <Users className="w-8 h-8 lg:w-12 lg:h-12 text-purple-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No patients found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No patients match your search criteria. Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mt-6 lg:mt-8 text-14-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        patient={selectedPatient}
        onUpdate={handleUpdatePatient}
      />
    </>
  );
};

export default ReceptionistPatients;