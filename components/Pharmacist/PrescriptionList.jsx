import React, { useState } from 'react';
import { Plus, Pill, Search, Check, X, Clock, User, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const PrescriptionList = ({ onBack }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: '1',
      patientName: 'John Smith',
      patientId: 'P001',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      prescribedBy: 'Dr. Sarah Safari',
      prescribedDate: '2024-01-15',
      status: 'pending',
      instructions: 'Take with food. Monitor blood pressure.',
      refills: 2,
      priority: 'normal'
    },
    {
      id: '2',
      patientName: 'Emily Johnson',
      patientId: 'P002',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: '7 days',
      prescribedBy: 'Dr. Ava Williams',
      prescribedDate: '2024-01-15',
      status: 'verified',
      instructions: 'Complete full course. Take with water.',
      refills: 0,
      priority: 'urgent'
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      patientId: 'P003',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      prescribedBy: 'Dr. Adam Smith',
      prescribedDate: '2024-01-14',
      status: 'dispensed',
      instructions: 'Take with meals. Monitor blood sugar.',
      refills: 5,
      priority: 'normal'
    },
    {
      id: '4',
      patientName: 'Sarah Davis',
      patientId: 'P004',
      medication: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'As needed',
      duration: '14 days',
      prescribedBy: 'Dr. Sarah Safari',
      prescribedDate: '2024-01-15',
      status: 'pending',
      instructions: 'Take with food. Maximum 3 times daily.',
      refills: 1,
      priority: 'normal'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (prescriptionId, newStatus) => {
    setPrescriptions(prev => prev.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, status: newStatus }
        : prescription
    ));

    const prescription = prescriptions.find(p => p.id === prescriptionId);
    let message = '';
    
    switch (newStatus) {
      case 'verified':
        message = `Prescription for ${prescription?.patientName} verified successfully`;
        break;
      case 'dispensed':
        message = `Medication dispensed to ${prescription?.patientName}`;
        break;
      case 'rejected':
        message = `Prescription for ${prescription?.patientName} rejected`;
        break;
    }

    setMessage(message);
    setMessageType(newStatus === 'rejected' ? 'error' : 'success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getStatusBadge = (status, priority) => {
    const baseClasses = "flex items-center gap-2 px-3 py-1 rounded-full text-12-medium";
    
    switch (status) {
      case 'pending':
        return (
          <div className={`${baseClasses} ${priority === 'urgent' ? 'bg-red-500/20 border border-red-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'}`}>
            <Clock className="w-3 h-3" />
            <span className={priority === 'urgent' ? 'text-red-400' : 'text-yellow-400'}>
              {priority === 'urgent' ? 'Urgent Pending' : 'Pending'}
            </span>
          </div>
        );
      case 'verified':
        return (
          <div className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}>
            <Check className="w-3 h-3" />
            <span className="text-blue-400">Verified</span>
          </div>
        );
      case 'dispensed':
        return (
          <div className={`${baseClasses} bg-green-500/20 border border-green-500/30`}>
            <CheckCircle className="w-3 h-3" />
            <span className="text-green-400">Dispensed</span>
          </div>
        );
      case 'rejected':
        return (
          <div className={`${baseClasses} bg-red-500/20 border border-red-500/30`}>
            <X className="w-3 h-3" />
            <span className="text-red-400">Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButtons = (prescription) => {
    switch (prescription.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(prescription.id, 'verified')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-12-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Verify
            </button>
            <button
              onClick={() => handleStatusUpdate(prescription.id, 'rejected')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-12-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Reject
            </button>
          </div>
        );
      case 'verified':
        return (
          <button
            onClick={() => handleStatusUpdate(prescription.id, 'dispensed')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-12-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            Dispense
          </button>
        );
      case 'dispensed':
        return (
          <div className="text-12-medium text-green-400 px-4 py-2">
            Completed
          </div>
        );
      case 'rejected':
        return (
          <div className="text-12-medium text-red-400 px-4 py-2">
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const verifiedCount = prescriptions.filter(p => p.status === 'verified').length;
  const dispensedCount = prescriptions.filter(p => p.status === 'dispensed').length;
  const urgentCount = prescriptions.filter(p => p.priority === 'urgent' && p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-24-bold text-white">Prescription Management</span>
              <p className="text-14-regular text-dark-700">Verify and dispense medications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-8 ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-16-regular">{message}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{pendingCount}</div>
                <div className="text-14-regular text-yellow-400">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Check className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{verifiedCount}</div>
                <div className="text-14-regular text-blue-400">Verified</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{dispensedCount}</div>
                <div className="text-14-regular text-green-400">Dispensed</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{urgentCount}</div>
                <div className="text-14-regular text-red-400">Urgent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-dark-600" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, medication, or ID..."
                className="shad-input pl-10 w-full text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'verified', 'dispensed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-14-medium transition-all duration-300 ${
                    statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-24-bold text-white">Prescriptions</h2>
          </div>

          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-6 hover:border-dark-500/80 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-20-bold text-white">{prescription.medication}</h3>
                        {getStatusBadge(prescription.status, prescription.priority)}
                      </div>
                      
                      <div className="flex items-center gap-6 text-14-regular text-dark-700">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span>{prescription.patientName} ({prescription.patientId})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span>{prescription.prescribedDate}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-14-regular text-dark-700">
                        <div>
                          <span className="text-white">Dosage:</span> {prescription.dosage}
                        </div>
                        <div>
                          <span className="text-white">Frequency:</span> {prescription.frequency}
                        </div>
                        <div>
                          <span className="text-white">Duration:</span> {prescription.duration}
                        </div>
                        <div>
                          <span className="text-white">Refills:</span> {prescription.refills}
                        </div>
                      </div>
                      
                      <div className="bg-dark-500/30 rounded-lg px-3 py-2">
                        <p className="text-12-regular text-dark-600">
                          <span className="text-white">Instructions:</span> {prescription.instructions}
                        </p>
                        <p className="text-12-regular text-blue-400 mt-1">
                          Prescribed by: {prescription.prescribedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    {getActionButtons(prescription)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPrescriptions.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <Pill className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">No prescriptions found</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                No prescriptions match your current search criteria. Try adjusting your filters.
              </p>
            </div>
          )}
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

export default PrescriptionList;