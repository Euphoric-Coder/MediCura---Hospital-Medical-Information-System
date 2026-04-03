import React, { useState } from 'react';
import { Plus, Users, Search, Eye, FileText, Calendar, Phone, Mail, User, Heart, Activity, Pill, TestTube, AlertTriangle, CheckCircle, ArrowLeft, Filter, ChevronDown, Check } from 'lucide-react';

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-slate-900 dark:text-white">Patient Details</h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="text-2xl leading-none">&times;</span>
            </button>
          </div>

          {/* Patient Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md mx-auto sm:mx-0"
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-20-bold sm:text-24-bold lg:text-32-bold text-slate-900 dark:text-white mb-2">{patient.name}</h1>
                <div className="flex justify-center sm:justify-start flex-wrap gap-2 sm:gap-6 text-14-medium lg:text-16-medium text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-blue-500" /> {patient.age} years</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-500" /> {patient.gender}</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-rose-500" /> {patient.bloodType}</span>
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> ID: {patient.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'medical', label: 'Medical Info', icon: Heart },
              { id: 'visits', label: 'Visit History', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-14-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-16-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-500" /> Contact Information
                    </h3>
                    <div className="space-y-4 text-14-medium text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"><Phone className="w-4 h-4 text-blue-500" /></div>
                        <span className="text-slate-900 dark:text-slate-200">{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"><Mail className="w-4 h-4 text-indigo-500" /></div>
                        <span className="text-slate-900 dark:text-slate-200">{patient.email}</span>
                      </div>
                      <div className="mt-2 text-13-regular bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        {patient.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-2xl p-5">
                    <h3 className="text-16-semibold text-rose-900 dark:text-rose-100 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-500" /> Emergency Contact
                    </h3>
                    <div className="space-y-2 text-14-medium text-rose-800 dark:text-rose-200">
                      <p className="flex justify-between border-b border-rose-200/50 dark:border-rose-800/50 pb-2">
                        <span className="opacity-70">Name:</span> <span className="font-semibold text-rose-900 dark:text-rose-100">{patient.emergencyContact?.name}</span>
                      </p>
                      <p className="flex justify-between border-b border-rose-200/50 dark:border-rose-800/50 py-2">
                        <span className="opacity-70">Phone:</span> <span>{patient.emergencyContact?.phone}</span>
                      </p>
                      <p className="flex justify-between pt-2">
                        <span className="opacity-70">Relation:</span> <span className="capitalize">{patient.emergencyContact?.relationship}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-16-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500" /> Insurance
                    </h3>
                    <div className="space-y-3 text-14-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-500">Provider</span> 
                        <span className="text-slate-900 dark:text-white font-semibold">{patient.insurance?.provider}</span>
                      </p>
                      <div className="h-px bg-slate-100 dark:bg-slate-700 w-full"></div>
                      <p className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-500">Policy</span> 
                        <span className="font-mono text-slate-800 dark:text-slate-300">{patient.insurance?.policyNumber}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-5">
                    <h3 className="text-16-semibold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-500" /> Visit Summary
                    </h3>
                    <div className="space-y-3 text-14-medium text-emerald-800 dark:text-emerald-200">
                      <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/20 p-3 rounded-lg">
                        <span>Total Visits</span>
                        <span className="text-16-bold text-emerald-600 dark:text-emerald-400">{patient.totalVisits}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/20 p-3 rounded-lg border-l-4 border-slate-300 dark:border-slate-600">
                        <span>Last Visit</span>
                        <span className="font-medium">{patient.lastVisit}</span>
                      </div>
                      {patient.nextAppointment && (
                        <div className="flex justify-between items-center bg-white/60 dark:bg-emerald-900/20 p-3 rounded-lg border-l-4 border-emerald-400 dark:border-emerald-500">
                          <span>Next Apt.</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">{patient.nextAppointment}</span>
                        </div>
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
                    <h3 className="text-16-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-rose-500" /> Latest Vital Signs
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Blood Pressure', value: patient.vitalSigns.bloodPressure, icon: Heart, unit: 'mmHg', color: 'rose' },
                        { label: 'Heart Rate', value: patient.vitalSigns.heartRate, icon: Activity, unit: 'bpm', color: 'orange' },
                        { label: 'Temperature', value: patient.vitalSigns.temperature, icon: TestTube, unit: '°F', color: 'amber' },
                        { label: 'Weight', value: patient.vitalSigns.weight, icon: User, unit: 'lbs', color: 'blue' }
                      ].map((vital, idx) => {
                        const bgClasses = {
                          rose: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-500 text-rose-700 dark:text-rose-300 text-rose-600 dark:text-rose-400/80',
                          orange: 'bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20 text-orange-500 text-orange-700 dark:text-orange-300 text-orange-600 dark:text-orange-400/80',
                          amber: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-500 text-amber-700 dark:text-amber-300 text-amber-600 dark:text-amber-400/80',
                          blue: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-500 text-blue-700 dark:text-blue-300 text-blue-600 dark:text-blue-400/80'
                        };
                        const clsMap = bgClasses[vital.color].split(' ');
                        
                        return (
                        <div key={idx} className={`${clsMap.slice(0,4).join(' ')} border rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 shadow-sm`}>
                          <vital.icon className={`w-6 h-6 ${clsMap[4]} mb-2`} />
                          <div className={`text-20-bold ${clsMap.slice(5,7).join(' ')}`}>{vital.value} <span className="text-12-medium opacity-70">{vital.unit}</span></div>
                          <div className={`text-12-medium ${clsMap.slice(7).join(' ')} uppercase tracking-wider mt-1`}>{vital.label}</div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allergies */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-16-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" /> Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies?.length > 0 ? patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-xl text-13-medium text-amber-800 dark:text-amber-300 shadow-sm"
                        >
                          {allergy}
                        </span>
                      )) : <span className="text-slate-500 dark:text-slate-400 italic">No known allergies</span>}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5">
                    <h3 className="text-16-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-blue-500" /> Medications
                    </h3>
                    <div className="space-y-2">
                      {patient.currentMedications?.length > 0 ? patient.currentMedications.map((medication, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                          <span className="text-14-medium text-slate-700 dark:text-slate-300">{medication}</span>
                        </div>
                      )) : <span className="text-slate-500 dark:text-slate-400 italic">No current medications</span>}
                    </div>
                  </div>
                </div>

                {/* Recent Diagnosis */}
                {patient.recentDiagnosis && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 border border-purple-100 dark:border-purple-500/20 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-16-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" /> Recent Diagnosis
                    </h3>
                    <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-4 border border-purple-200 dark:border-purple-500/30 shadow-sm">
                      <span className="text-15-medium text-purple-800 dark:text-purple-200">{patient.recentDiagnosis}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 border-dashed">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-20-bold text-slate-900 dark:text-white mb-2">Detailed Visit History</h3>
                <p className="text-15-regular text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Comprehensive visit timeline and clinical notes will be available in the next system update.
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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100/80 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-full shadow-sm text-emerald-700 dark:text-emerald-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-12-bold">Active</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-500/20 border border-slate-200 dark:border-slate-500/30 rounded-full text-slate-600 dark:text-slate-400">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span className="text-12-bold">Inactive</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-100/80 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 rounded-full shadow-sm text-rose-700 dark:text-rose-400">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
            <span className="text-12-bold">Critical</span>
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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 transition-colors duration-300 pb-12">
        {/* Header */}
        <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-10 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
                      Patient Directory
                    </h1>
                    <p className="text-13-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                      Manage and view your patients effortlessly
                    </p>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-xl transition-colors shadow-lg shadow-blue-500/30 text-14-medium w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Patient
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { title: 'Total Patients', value: totalPatients, icon: Users, color: 'blue' },
              { title: 'Active Cases', value: activeCount, icon: CheckCircle, color: 'emerald' },
              { title: 'Critical Cases', value: criticalCount, icon: AlertTriangle, color: 'rose' },
              { title: 'Recent Visits', value: recentVisits, icon: Calendar, color: 'purple' }
            ].map((stat, idx) => {
              const bgMap = {
                blue: 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
                emerald: 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                rose: 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
                purple: 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
              };
              const clsMap = bgMap[stat.color].split(' ');

              return (
               <div key={idx} className={`${clsMap.slice(0,2).join(' ')} ${clsMap[3]} ${clsMap[4]} border rounded-3xl p-5 transition-all duration-300 shadow-sm hover:shadow-md group`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${clsMap[5]} ${clsMap[6]} flex items-center justify-center ${clsMap[7]} ${clsMap[8]} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-24-bold text-slate-900 dark:text-white leading-tight">{stat.value}</div>
                      <div className="text-13-medium text-slate-500 dark:text-slate-400">{stat.title}</div>
                    </div>
                  </div>
               </div>
            )})}
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row gap-3 shadow-sm backdrop-blur-xl">
            <div className="flex-1 relative group">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, ID, or condition..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border-none rounded-xl pl-12 pr-4 py-3 sm:py-3.5 text-15-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>
             <div className="flex items-center gap-3 w-full sm:w-auto relative">
               <div className="relative flex-1 sm:w-56 group">
                 <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 border ${isFilterOpen ? 'border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'} rounded-xl px-4 py-3 sm:py-3.5 text-15-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer`}
                 >
                   <div className="flex items-center gap-2.5">
                     <Filter className={`w-4 h-4 ${isFilterOpen ? 'text-blue-500' : 'text-slate-400'} transition-colors`} />
                     <span>
                        {statusFilter === 'all' && 'All Status'}
                        {statusFilter === 'active' && 'Active Only'}
                        {statusFilter === 'critical' && 'Critical Only'}
                        {statusFilter === 'inactive' && 'Inactive Only'}
                     </span>
                   </div>
                   <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180 text-blue-500' : ''}`} />
                 </button>
                 
                 {isFilterOpen && (
                   <>
                     <div 
                       className="fixed inset-0 z-40" 
                       onClick={() => setIsFilterOpen(false)}
                     />
                     <div className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[200px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                       {[
                         { id: 'all', label: 'All Status', colors: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/80 dark:bg-blue-500/10', dot: 'bg-blue-500', icon: 'text-blue-500' } },
                         { id: 'active', label: 'Active Only', pulse: true, colors: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/80 dark:bg-emerald-500/10', dot: 'bg-emerald-500', icon: 'text-emerald-500' } },
                         { id: 'critical', label: 'Critical Only', pulse: true, colors: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50/80 dark:bg-rose-500/10', dot: 'bg-rose-500', icon: 'text-rose-500' } },
                         { id: 'inactive', label: 'Inactive Only', pulse: false, colors: { text: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700/50', dot: 'bg-slate-400', icon: 'text-slate-500' } }
                       ].map((option) => {
                         const isSelected = statusFilter === option.id;
                         return (
                         <button
                           key={option.id}
                           onClick={() => {
                             setStatusFilter(option.id);
                             setIsFilterOpen(false);
                           }}
                           className={`w-full flex items-center justify-between px-4 py-3 text-14-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${isSelected ? `${option.colors.text} ${option.colors.bg}` : 'text-slate-700 dark:text-slate-300'}`}
                         >
                           <div className="flex items-center gap-3">
                              {option.id !== 'all' && (
                                <div className={`w-2 h-2 rounded-full ${option.colors.dot} ${option.pulse ? 'animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-none' : ''}`}></div>
                              )}
                              <span className={isSelected ? 'font-semibold' : ''}>{option.label}</span>
                           </div>
                           {isSelected && (
                             <Check className={`w-4 h-4 ${option.colors.icon}`} />
                           )}
                         </button>
                       )})}
                     </div>
                   </>
                 )}
               </div>
             </div>
          </div>

          {/* Patient List */}
          <div className="space-y-4">
             {filteredPatients.map(patient => (
                <div key={patient.id} onClick={() => handleViewDetails(patient)} className="group bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-3xl p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                   <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                      <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                         <div className="relative flex-shrink-0">
                            <img src={patient.avatar} alt={patient.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300" />
                            {patient.status === 'critical' && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>}
                         </div>
                         <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-18-bold text-slate-900 dark:text-white truncate">{patient.name}</h3>
                              {getStatusBadge(patient.status)}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-13-medium sm:text-14-medium text-slate-500 dark:text-slate-400">
                               <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-blue-500" /> {patient.age}y • {patient.gender.charAt(0)}</span>
                               <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500/70" /> {patient.bloodType}</span>
                               <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-500" /> {patient.id}</span>
                               <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-500" /> {patient.phone}</span>
                            </div>
                            {patient.recentDiagnosis && (
                               <div className="mt-1.5 text-13-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 inline-block px-3 py-1 rounded-lg truncate max-w-full border border-slate-200/50 dark:border-slate-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                                 Diagnoses: <span className="text-slate-800 dark:text-white font-semibold">{patient.recentDiagnosis}</span>
                               </div>
                            )}
                         </div>
                      </div>

                      <div className="flex flex-row items-center justify-between sm:justify-start gap-4 xl:pl-6 xl:border-l border-slate-100 dark:border-slate-800 mt-2 xl:mt-0 pt-4 xl:pt-0 border-t xl:border-t-0">
                         <div className="text-left xl:text-right xl:pr-4 xl:border-r border-slate-100 dark:border-slate-800 flex-1 sm:flex-none">
                            <div className="text-12-medium text-slate-400 uppercase tracking-wide mb-1">Last Visit</div>
                            <div className="text-14-bold text-slate-700 dark:text-slate-200">{patient.lastVisit}</div>
                         </div>
                         <div className="flex gap-2 w-auto">
                            <button onClick={(e) => { e.stopPropagation(); handleViewDetails(patient); }} className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl text-14-medium transition-all duration-300 shadow-sm hover:shadow">
                              <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View</span>
                            </button>
                            <button onClick={(e) => e.stopPropagation()} className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-xl transition-all shadow-sm flex-shrink-0">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => e.stopPropagation()} className="hidden sm:block px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-xl transition-all shadow-sm flex-shrink-0">
                               <Calendar className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             ))}

             {filteredPatients.length === 0 && (
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 border-dashed dark:border-slate-800 rounded-3xl p-12 text-center">
                   <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100 dark:border-slate-700">
                      <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                   </div>
                   <h3 className="text-20-bold text-slate-900 dark:text-white mb-2">No patients found</h3>
                   <p className="text-15-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      We couldn't find any patients matching your current search criteria. Try adjusting your filters.
                   </p>
                   <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="mt-6 text-14-medium text-blue-600 dark:text-blue-400 hover:underline">
                      Clear all filters
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>

      <PatientDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        patient={selectedPatient}
      />
    </>
  );
};

export default DoctorPatients;