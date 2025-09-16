import React, { useState } from 'react';
import { Plus, Bed, Search, User, Calendar, Clock, AlertTriangle, CheckCircle, Phone, Edit, X, Heart, Activity } from 'lucide-react';

const admissionTypes = [
  'Emergency Admission',
  'Elective Surgery',
  'ICU Admission',
  'CCU Admission',
  'Maternity Admission',
  'Pediatric Admission',
  'Psychiatric Admission',
  'Observation'
];

const wards = [
  'General Ward A',
  'General Ward B',
  'ICU',
  'CCU (Cardiac Care Unit)',
  'Emergency Department',
  'Surgery Ward',
  'Maternity Ward',
  'Pediatric Ward',
  'Psychiatric Unit'
];

const patients = [
  { id: 'P001', name: 'John Smith' },
  { id: 'P002', name: 'Emily Johnson' },
  { id: 'P003', name: 'Michael Brown' },
  { id: 'P004', name: 'Sarah Davis' }
];

const NewAdmissionModal = ({ isOpen, onClose, onSubmit }) => {
  const [admissionData, setAdmissionData] = useState({
    patientId: '',
    patientName: '',
    admissionType: '',
    ward: '',
    bedNumber: '',
    reason: '',
    diagnosis: '',
    estimatedStay: 1,
    notes: ''
  });

  const handlePatientSelect = (patient) => {
    setAdmissionData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(admissionData);
    setAdmissionData({
      patientId: '',
      patientName: '',
      admissionType: '',
      ward: '',
      bedNumber: '',
      reason: '',
      diagnosis: '',
      estimatedStay: 1,
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Hospital Admission</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div>
              <label className="shad-input-label block mb-2">Select Patient</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => handlePatientSelect(patient)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                      admissionData.patientId === patient.id
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-dark-500 hover:border-dark-400 bg-dark-400/30'
                    }`}
                  >
                    <div className="text-14-medium text-white">{patient.name}</div>
                    <div className="text-12-regular text-dark-700">{patient.id}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Admission Type */}
            <div>
              <label className="shad-input-label block mb-2">Admission Type</label>
              <select
                value={admissionData.admissionType}
                onChange={(e) => setAdmissionData(prev => ({ ...prev, admissionType: e.target.value }))}
                className="shad-select-trigger w-full text-white"
                required
              >
                <option value="">Select admission type</option>
                {admissionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Ward and Bed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="shad-input-label block mb-2">Ward</label>
                <select
                  value={admissionData.ward}
                  onChange={(e) => setAdmissionData(prev => ({ ...prev, ward: e.target.value }))}
                  className="shad-select-trigger w-full text-white"
                  required
                >
                  <option value="">Select ward</option>
                  {wards.map((ward) => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Bed Number</label>
                <input
                  type="text"
                  value={admissionData.bedNumber}
                  onChange={(e) => setAdmissionData(prev => ({ ...prev, bedNumber: e.target.value }))}
                  placeholder="A-101"
                  className="shad-input w-full text-white"
                  required
                />
              </div>
            </div>

            {/* Reason and Diagnosis */}
            <div>
              <label className="shad-input-label block mb-2">Reason for Admission</label>
              <textarea
                value={admissionData.reason}
                onChange={(e) => setAdmissionData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Clinical reason for hospital admission..."
                className="shad-textArea w-full text-white min-h-[100px] resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="shad-input-label block mb-2">Primary Diagnosis</label>
              <input
                type="text"
                value={admissionData.diagnosis}
                onChange={(e) => setAdmissionData(prev => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="Primary diagnosis"
                className="shad-input w-full text-white"
                required
              />
            </div>

            {/* Estimated Stay */}
            <div>
              <label className="shad-input-label block mb-2">Estimated Stay (days)</label>
              <input
                type="number"
                value={admissionData.estimatedStay}
                onChange={(e) => setAdmissionData(prev => ({ ...prev, estimatedStay: parseInt(e.target.value) || 1 }))}
                min="1"
                className="shad-input w-full text-white"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="shad-input-label block mb-2">Additional Notes</label>
              <textarea
                value={admissionData.notes}
                onChange={(e) => setAdmissionData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes or instructions..."
                className="shad-textArea w-full text-white min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!admissionData.patientId || !admissionData.admissionType}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                Admit Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DoctorAdmissions = ({ onBack }) => {
  const [admissions, setAdmissions] = useState([
    {
      id: '1',
      patientName: 'John Smith',
      patientId: 'P001',
      admissionDate: '2024-01-15',
      admissionType: 'Emergency Admission',
      ward: 'ICU',
      bedNumber: 'ICU-05',
      status: 'admitted',
      reason: 'Acute myocardial infarction',
      diagnosis: 'STEMI - ST-Elevation Myocardial Infarction',
      condition: 'stable',
      attendingPhysician: 'Dr. Sarah Safari',
      estimatedStay: 5,
      cost: 15000,
      insurance: 'BlueCross BlueShield',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1 (555) 987-6543'
      },
      vitalSigns: {
        bloodPressure: '130/85',
        heartRate: 78,
        temperature: 98.6,
        oxygenSaturation: 98
      },
      notes: 'Patient stable post-angioplasty. Continue cardiac monitoring.'
    },
    {
      id: '2',
      patientName: 'Emily Johnson',
      patientId: 'P002',
      admissionDate: '2024-01-12',
      dischargeDate: '2024-01-14',
      admissionType: 'Elective Surgery',
      ward: 'Surgery Ward',
      bedNumber: 'SW-12',
      status: 'discharged',
      reason: 'Laparoscopic cholecystectomy',
      diagnosis: 'Cholelithiasis',
      condition: 'improving',
      attendingPhysician: 'Dr. Sarah Safari',
      estimatedStay: 2,
      actualStay: 2,
      cost: 8500,
      insurance: 'Aetna',
      emergencyContact: {
        name: 'Michael Johnson',
        phone: '+1 (555) 876-5432'
      }
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      patientId: 'P003',
      admissionDate: '2024-01-16',
      admissionType: 'ICU Admission',
      ward: 'ICU',
      bedNumber: 'ICU-02',
      status: 'admitted',
      reason: 'Respiratory failure',
      diagnosis: 'Acute respiratory distress syndrome',
      condition: 'critical',
      attendingPhysician: 'Dr. Sarah Safari',
      estimatedStay: 7,
      cost: 25000,
      insurance: 'Medicare',
      emergencyContact: {
        name: 'Susan Brown',
        phone: '+1 (555) 765-4321'
      },
      vitalSigns: {
        bloodPressure: '110/70',
        heartRate: 95,
        temperature: 101.2,
        oxygenSaturation: 92
      },
      notes: 'Patient on mechanical ventilation. Close monitoring required.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewAdmissionModal, setShowNewAdmissionModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredAdmissions = admissions.filter(admission => {
    const matchesSearch = admission.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admission.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || admission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleNewAdmission = (admissionData) => {
    const newAdmission = {
      id: (admissions.length + 1).toString(),
      patientName: admissionData.patientName,
      patientId: admissionData.patientId,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionType: admissionData.admissionType,
      ward: admissionData.ward,
      bedNumber: admissionData.bedNumber,
      status: 'admitted',
      reason: admissionData.reason,
      diagnosis: admissionData.diagnosis,
      condition: 'stable',
      attendingPhysician: 'Dr. Sarah Safari',
      estimatedStay: admissionData.estimatedStay,
      cost: 0,
      insurance: 'Unknown',
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1 (555) 000-0000'
      },
      notes: admissionData.notes
    };

    setAdmissions(prev => [...prev, newAdmission]);
    setMessage(`${admissionData.patientName} admitted to ${admissionData.ward}`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'admitted':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-blue-400">Admitted</span>
          </div>
        );
      case 'discharged':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">Discharged</span>
          </div>
        );
      case 'transferred':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <Activity className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-purple-400">Transferred</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getConditionBadge = (condition) => {
    switch (condition) {
      case 'stable':
        return <span className="text-12-medium text-green-400">Stable</span>;
      case 'critical':
        return <span className="text-12-medium text-red-400">Critical</span>;
      case 'improving':
        return <span className="text-12-medium text-blue-400">Improving</span>;
      case 'deteriorating':
        return <span className="text-12-medium text-yellow-400">Deteriorating</span>;
      default:
        return null;
    }
  };

  const admittedCount = admissions.filter(a => a.status === 'admitted').length;
  const dischargedCount = admissions.filter(a => a.status === 'discharged').length;
  const criticalCount = admissions.filter(a => a.condition === 'critical').length;
  const totalRevenue = admissions.filter(a => a.status === 'discharged').reduce((sum, a) => sum + a.cost, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bed className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">Hospital Admissions</span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">Manage patient admissions</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewAdmissionModal(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Admit Patient</span>
              </button>
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
                  <Bed className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{admittedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Admitted</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{dischargedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Discharged</div>
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
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">${totalRevenue.toFixed(0)}</div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">Revenue</div>
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
                  placeholder="Search admissions..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="admitted">Admitted</option>
                <option value="discharged">Discharged</option>
                <option value="transferred">Transferred</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Admissions List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Bed className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Patient Admissions</h2>
            </div>

            <div className="space-y-4">
              {filteredAdmissions.map((admission) => (
                <div key={admission.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Bed className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{admission.patientName}</h3>
                          {getStatusBadge(admission.status)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Ward:</span> {admission.ward}
                          </div>
                          <div>
                            <span className="text-white">Bed:</span> {admission.bedNumber}
                          </div>
                          <div>
                            <span className="text-white">Type:</span> {admission.admissionType}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Admitted:</span> {admission.admissionDate}
                          </div>
                          {admission.dischargeDate && (
                            <div>
                              <span className="text-white">Discharged:</span> {admission.dischargeDate}
                            </div>
                          )}
                          <div>
                            <span className="text-white">Condition:</span> {getConditionBadge(admission.condition)}
                          </div>
                        </div>
                        
                        <div className="bg-red-500/20 rounded-lg px-3 py-2">
                          <p className="text-10-regular lg:text-12-regular text-red-400">
                            <span className="text-white">Diagnosis:</span> {admission.diagnosis}
                          </p>
                        </div>

                        {admission.vitalSigns && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            <div className="bg-dark-500/30 rounded-lg p-2 text-center">
                              <div className="text-12-medium text-white">{admission.vitalSigns.bloodPressure}</div>
                              <div className="text-10-regular text-dark-600">BP</div>
                            </div>
                            <div className="bg-dark-500/30 rounded-lg p-2 text-center">
                              <div className="text-12-medium text-white">{admission.vitalSigns.heartRate}</div>
                              <div className="text-10-regular text-dark-600">HR</div>
                            </div>
                            <div className="bg-dark-500/30 rounded-lg p-2 text-center">
                              <div className="text-12-medium text-white">{admission.vitalSigns.temperature}°F</div>
                              <div className="text-10-regular text-dark-600">Temp</div>
                            </div>
                            <div className="bg-dark-500/30 rounded-lg p-2 text-center">
                              <div className="text-12-medium text-white">{admission.vitalSigns.oxygenSaturation}%</div>
                              <div className="text-10-regular text-dark-600">O2</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                        
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {admission.status === 'admitted' && (
                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <span className="hidden sm:inline">Discharge</span>
                          <span className="sm:hidden">DC</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAdmissions.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-red-500/20">
                  <Bed className="w-8 h-8 lg:w-12 lg:h-12 text-red-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No admissions found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No admissions match your search criteria. Try adjusting your filters.
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

      {/* New Admission Modal */}
      <NewAdmissionModal
        isOpen={showNewAdmissionModal}
        onClose={() => setShowNewAdmissionModal(false)}
        onSubmit={handleNewAdmission}
      />
    </>
  );
};

export default DoctorAdmissions;