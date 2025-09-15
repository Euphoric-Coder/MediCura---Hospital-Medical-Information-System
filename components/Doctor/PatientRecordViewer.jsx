import React, { useState } from 'react';
import { Plus, User, FileText, Calendar, Pill, Activity, Heart, Eye, Download, Search } from 'lucide-react';

const PatientRecordViewer = ({ onBack }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const patients = [
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543',
        relationship: 'Spouse'
      }
    },
    {
      id: '2',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      phone: '+1 (555) 234-5678',
      email: 'emily.johnson@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bloodType: 'A-',
      allergies: ['Shellfish'],
      emergencyContact: {
        name: 'Michael Johnson',
        phone: '+1 (555) 876-5432',
        relationship: 'Brother'
      }
    }
  ];

  const medicalHistory = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'consultation',
      title: 'Annual Physical Examination',
      description: 'Routine annual check-up. Patient reports feeling well overall. Blood pressure slightly elevated.',
      doctor: 'Dr. Sarah Safari',
      attachments: ['physical_exam_2024.pdf']
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'lab',
      title: 'Blood Work - Complete Panel',
      description: 'Comprehensive metabolic panel, lipid profile, and CBC ordered due to elevated BP.',
      doctor: 'Dr. Sarah Safari',
      attachments: ['lab_results_jan2024.pdf']
    },
    {
      id: '3',
      date: '2023-12-20',
      type: 'prescription',
      title: 'Hypertension Management',
      description: 'Prescribed Lisinopril 10mg daily for blood pressure management.',
      doctor: 'Dr. Sarah Safari'
    }
  ];

  const prescriptions = [
    {
      id: '1',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: 'Ongoing',
      prescribedBy: 'Dr. Sarah Safari',
      date: '2023-12-20',
      status: 'active'
    },
    {
      id: '2',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      prescribedBy: 'Dr. Sarah Safari',
      date: '2023-11-15',
      status: 'completed'
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecordIcon = (type) => {
    switch (type) {
      case 'consultation':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'lab':
        return <Activity className="w-5 h-5 text-green-400" />;
      case 'prescription':
        return <Pill className="w-5 h-5 text-purple-400" />;
      case 'diagnosis':
        return <Heart className="w-5 h-5 text-red-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPrescriptionStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-green-400">Active</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-12-medium text-gray-400">Completed</span>
          </div>
        );
      case 'discontinued':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-12-medium text-red-400">Discontinued</span>
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-24-bold text-white">Patient Records</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Search & List */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
              <h2 className="text-20-bold text-white mb-6">Select Patient</h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patients..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Patient List */}
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedPatient?.id === patient.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-dark-500 hover:border-dark-400 bg-dark-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="text-16-semibold text-white">{patient.name}</h3>
                        <p className="text-14-regular text-dark-700">{patient.age} years, {patient.gender}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Header */}
                <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                      className="w-24 h-24 rounded-3xl object-cover border-2 border-dark-500/50"
                    />
                    <div>
                      <h1 className="text-32-bold text-white mb-2">{selectedPatient.name}</h1>
                      <div className="flex items-center gap-6 text-16-regular text-dark-700">
                        <span>{selectedPatient.age} years old</span>
                        <span>{selectedPatient.gender}</span>
                        <span>Blood Type: {selectedPatient.bloodType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: User },
                      { id: 'history', label: 'Medical History', icon: FileText },
                      { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
                      { id: 'lab-results', label: 'Lab Results', icon: Activity }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-14-medium transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <h2 className="text-24-bold text-white mb-6">Patient Overview</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-16-semibold text-white mb-2">Contact Information</h3>
                            <div className="space-y-2 text-14-regular text-dark-700">
                              <p>📧 {selectedPatient.email}</p>
                              <p>📞 {selectedPatient.phone}</p>
                              <p>📍 {selectedPatient.address}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-16-semibold text-white mb-2">Emergency Contact</h3>
                            <div className="space-y-2 text-14-regular text-dark-700">
                              <p>{selectedPatient.emergencyContact.name}</p>
                              <p>{selectedPatient.emergencyContact.phone}</p>
                              <p>{selectedPatient.emergencyContact.relationship}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-16-semibold text-white mb-2">Medical Information</h3>
                            <div className="space-y-2 text-14-regular text-dark-700">
                              <p>Blood Type: {selectedPatient.bloodType}</p>
                              <p>Age: {selectedPatient.age} years</p>
                              <p>Gender: {selectedPatient.gender}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-16-semibold text-white mb-2">Allergies</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedPatient.allergies.map((allergy, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-12-medium text-red-400"
                                >
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="space-y-6">
                      <h2 className="text-24-bold text-white mb-6">Medical History</h2>
                      
                      <div className="space-y-4">
                        {medicalHistory.map((record) => (
                          <div key={record.id} className="bg-dark-400/50 rounded-2xl p-6 border border-dark-500/50">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-dark-300 rounded-xl flex items-center justify-center">
                                {getRecordIcon(record.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-18-bold text-white">{record.title}</h3>
                                  <span className="text-14-regular text-dark-700">{record.date}</span>
                                </div>
                                <p className="text-14-regular text-dark-700 mb-2">{record.description}</p>
                                <p className="text-12-regular text-blue-400">Dr. {record.doctor}</p>
                                {record.attachments && (
                                  <div className="flex gap-2 mt-3">
                                    {record.attachments.map((attachment, index) => (
                                      <button
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-12-medium text-green-400 hover:bg-green-500/30 transition-colors"
                                      >
                                        <Download className="w-3 h-3" />
                                        {attachment}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'prescriptions' && (
                    <div className="space-y-6">
                      <h2 className="text-24-bold text-white mb-6">Current Prescriptions</h2>
                      
                      <div className="space-y-4">
                        {prescriptions.map((prescription) => (
                          <div key={prescription.id} className="bg-dark-400/50 rounded-2xl p-6 border border-dark-500/50">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                  <Pill className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                  <h3 className="text-18-bold text-white">{prescription.medication}</h3>
                                  <p className="text-14-regular text-dark-700">{prescription.dosage} - {prescription.frequency}</p>
                                </div>
                              </div>
                              {getPrescriptionStatusBadge(prescription.status)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-14-regular text-dark-700">
                              <div>
                                <span className="text-white">Duration:</span> {prescription.duration}
                              </div>
                              <div>
                                <span className="text-white">Prescribed:</span> {prescription.date}
                              </div>
                              <div>
                                <span className="text-white">Doctor:</span> {prescription.prescribedBy}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'lab-results' && (
                    <div className="space-y-6">
                      <h2 className="text-24-bold text-white mb-6">Lab Results</h2>
                      
                      <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                          <Activity className="w-12 h-12 text-green-400" />
                        </div>
                        <h3 className="text-24-bold text-white mb-4">Lab Results Coming Soon</h3>
                        <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                          Lab results and diagnostic reports will be displayed here once available.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                    <User className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-24-bold text-white mb-4">Select a Patient</h3>
                  <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                    Choose a patient from the list to view their medical records and history.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-8 text-16-regular text-dark-600 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PatientRecordViewer;