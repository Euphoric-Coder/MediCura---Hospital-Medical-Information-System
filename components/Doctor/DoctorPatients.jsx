import React, { useState } from 'react';
import { Plus, Users, Search, Eye, FileText, Calendar, Phone, Mail, User, Heart, Activity, Pill, TestTube, AlertTriangle, CheckCircle } from 'lucide-react';

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Patient Details</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              ×
            </button>
          </div>

          {/* Patient Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-dark-500/50 mx-auto sm:mx-0"
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-20-bold sm:text-24-bold lg:text-32-bold text-white mb-2">{patient.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-14-regular lg:text-16-regular text-dark-700">
                  <span>{patient.age} years old</span>
                  <span>{patient.gender}</span>
                  <span>Blood Type: {patient.bloodType}</span>
                  <span>ID: {patient.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'medical', label: 'Medical Info', icon: Heart },
              { id: 'visits', label: 'Visit History', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-12-medium sm:text-14-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">Contact Information</h3>
                    <div className="space-y-2 text-14-regular text-dark-700">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{patient.email}</span>
                      </div>
                      <p className="text-12-regular">{patient.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">Emergency Contact</h3>
                    <div className="space-y-2 text-14-regular text-dark-700">
                      <p>{patient.emergencyContact.name}</p>
                      <p>{patient.emergencyContact.phone}</p>
                      <p>{patient.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">Insurance</h3>
                    <div className="space-y-2 text-14-regular text-dark-700">
                      <p>Provider: {patient.insurance.provider}</p>
                      <p>Policy: {patient.insurance.policyNumber}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">Visit Summary</h3>
                    <div className="space-y-2 text-14-regular text-dark-700">
                      <p>Total Visits: {patient.totalVisits}</p>
                      <p>Last Visit: {patient.lastVisit}</p>
                      {patient.nextAppointment && (
                        <p>Next: {patient.nextAppointment}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-6">
                {/* Vital Signs */}
                {patient.vitalSigns && (
                  <div>
                    <h3 className="text-16-semibold text-white mb-4">Latest Vital Signs</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-dark-500/30 rounded-lg p-4 text-center">
                        <div className="text-18-bold text-white">{patient.vitalSigns.bloodPressure}</div>
                        <div className="text-12-regular text-dark-600">Blood Pressure</div>
                      </div>
                      <div className="bg-dark-500/30 rounded-lg p-4 text-center">
                        <div className="text-18-bold text-white">{patient.vitalSigns.heartRate}</div>
                        <div className="text-12-regular text-dark-600">Heart Rate (bpm)</div>
                      </div>
                      <div className="bg-dark-500/30 rounded-lg p-4 text-center">
                        <div className="text-18-bold text-white">{patient.vitalSigns.temperature}°F</div>
                        <div className="text-12-regular text-dark-600">Temperature</div>
                      </div>
                      <div className="bg-dark-500/30 rounded-lg p-4 text-center">
                        <div className="text-18-bold text-white">{patient.vitalSigns.weight} lbs</div>
                        <div className="text-12-regular text-dark-600">Weight</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Allergies */}
                <div>
                  <h3 className="text-16-semibold text-white mb-3">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-12-medium text-red-400"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <h3 className="text-16-semibold text-white mb-3">Current Medications</h3>
                  <div className="space-y-2">
                    {patient.currentMedications.map((medication, index) => (
                      <div key={index} className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                        <span className="text-14-medium text-blue-400">{medication}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Diagnosis */}
                {patient.recentDiagnosis && (
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">Recent Diagnosis</h3>
                    <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
                      <span className="text-14-regular text-green-400">{patient.recentDiagnosis}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-20-bold text-white mb-2">Visit History</h3>
                <p className="text-14-regular text-dark-700">
                  Detailed visit history will be available here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorPatients = ({ onBack }) => {
  const [patients] = useState([
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      currentMedications: ['Lisinopril 10mg', 'Metformin 500mg'],
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      status: 'active',
      totalVisits: 12,
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      },
      insurance: {
        provider: 'BlueCross BlueShield',
        policyNumber: 'BC123456789'
      },
      recentDiagnosis: 'Hypertension, Type 2 Diabetes',
      vitalSigns: {
        bloodPressure: '130/85',
        heartRate: 72,
        temperature: 98.6,
        weight: 180
      }
    },
    {
      id: 'P002',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      email: 'emily.johnson@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bloodType: 'A-',
      allergies: ['Shellfish'],
      currentMedications: ['Birth Control', 'Vitamin D'],
      lastVisit: '2024-01-10',
      status: 'active',
      totalVisits: 8,
      emergencyContact: {
        name: 'Michael Johnson',
        phone: '+1 (555) 876-5432',
        relationship: 'Brother'
      },
      insurance: {
        provider: 'Aetna',
        policyNumber: 'AET987654321'
      },
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 68,
        temperature: 98.4,
        weight: 135
      }
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 67,
      gender: 'Male',
      phone: '+1 (555) 345-6789',
      email: 'michael.brown@email.com',
      address: '789 Pine St, Chicago, IL 60601',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bloodType: 'B+',
      allergies: ['Aspirin', 'Latex'],
      currentMedications: ['Warfarin', 'Metoprolol', 'Atorvastatin'],
      lastVisit: '2024-01-08',
      nextAppointment: '2024-01-22',
      status: 'critical',
      totalVisits: 25,
      emergencyContact: {
        name: 'Susan Brown',
        phone: '+1 (555) 765-4321',
        relationship: 'Wife'
      },
      insurance: {
        provider: 'Medicare',
        policyNumber: 'MED123456789'
      },
      recentDiagnosis: 'Atrial Fibrillation, Coronary Artery Disease',
      vitalSigns: {
        bloodPressure: '145/95',
        heartRate: 88,
        temperature: 99.1,
        weight: 195
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-green-400">Active</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-10-medium sm:text-12-medium text-gray-400">Inactive</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-red-400">Critical</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const activeCount = patients.filter(p => p.status === 'active').length;
  const criticalCount = patients.filter(p => p.status === 'critical').length;
  const totalPatients = patients.length;
  const recentVisits = patients.filter(p => {
    const lastVisit = new Date(p.lastVisit);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastVisit >= weekAgo;
  }).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">My Patients</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Manage your patient list</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{totalPatients}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Total</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{activeCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Active</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{criticalCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Critical</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{recentVisits}</div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">Recent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patients by name or ID..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Patient List</h2>
            </div>

            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-dark-500/50 flex-shrink-0"
                      />
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{patient.name}</h3>
                          {getStatusBadge(patient.status)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Age:</span> {patient.age}
                          </div>
                          <div>
                            <span className="text-white">Gender:</span> {patient.gender}
                          </div>
                          <div>
                            <span className="text-white">Blood:</span> {patient.bloodType}
                          </div>
                          <div className="hidden sm:block">
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
                          {patient.nextAppointment && (
                            <div>
                              <span className="text-white">Next:</span> {patient.nextAppointment}
                            </div>
                          )}
                        </div>
                        
                        {patient.allergies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-12-regular text-dark-600">Allergies:</span>
                            {patient.allergies.slice(0, 2).map((allergy, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium text-red-400"
                              >
                                {allergy}
                              </span>
                            ))}
                            {patient.allergies.length > 2 && (
                              <span className="text-10-medium text-dark-600">+{patient.allergies.length - 2} more</span>
                            )}
                          </div>
                        )}
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
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <Users className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
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
      />
    </>
  );
};

export default DoctorPatients;