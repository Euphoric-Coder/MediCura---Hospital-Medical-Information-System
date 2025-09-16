import React, { useState } from 'react';
import { Plus, Pill, Search, Check, X, Clock, User, Calendar, AlertTriangle, CheckCircle, Eye, Download, Phone } from 'lucide-react';
import jsPDF from 'jspdf';

const PrescriptionDetailsModal = ({ 
  isOpen, 
  onClose, 
  prescription, 
  onUpdateStatus,
  onDownloadPDF 
}) => {
  const [notes, setNotes] = useState('');

  if (!isOpen || !prescription) return null;

  const handleStatusUpdate = (status) => {
    onUpdateStatus(prescription.id, status, notes);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Prescription Review</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Prescription Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-16-bold sm:text-18-bold lg:text-20-bold text-white">{prescription.medication}</h3>
                <p className="text-12-regular sm:text-14-regular text-blue-400">{prescription.dosage} - {prescription.frequency}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-12-regular sm:text-14-regular text-dark-700">
              <div><span className="text-white">Patient:</span> {prescription.patientName}</div>
              <div><span className="text-white">Patient ID:</span> {prescription.patientId}</div>
              <div><span className="text-white">Prescribed by:</span> {prescription.prescribedBy}</div>
              <div><span className="text-white">Date:</span> {prescription.prescribedDate}</div>
              <div><span className="text-white">Duration:</span> {prescription.duration}</div>
              <div><span className="text-white">Refills:</span> {prescription.refills}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-green-500/10 rounded-2xl p-4 sm:p-6 mb-6">
            <h4 className="text-14-bold sm:text-16-bold text-white mb-3">Instructions</h4>
            <p className="text-12-regular sm:text-14-regular text-green-300">{prescription.instructions}</p>
          </div>

          {/* Drug Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Side Effects */}
            {prescription.sideEffects.length > 0 && (
              <div className="bg-yellow-500/10 rounded-2xl p-4 sm:p-6">
                <h4 className="text-14-bold sm:text-16-bold text-white mb-3">Side Effects</h4>
                <div className="flex flex-wrap gap-2">
                  {prescription.sideEffects.map((effect, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-10-medium sm:text-12-medium text-yellow-400">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Drug Interactions */}
            {prescription.interactions.length > 0 && (
              <div className="bg-red-500/10 rounded-2xl p-4 sm:p-6">
                <h4 className="text-14-bold sm:text-16-bold text-white mb-3">Drug Interactions</h4>
                <div className="flex flex-wrap gap-2">
                  {prescription.interactions.map((interaction, index) => (
                    <span key={index} className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium sm:text-12-medium text-red-400">
                      {interaction}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pharmacist Notes */}
          <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
            <h4 className="text-14-bold sm:text-16-bold text-white mb-3">Pharmacist Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this prescription..."
              className="shad-textArea w-full text-white min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {prescription.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('verified')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Verify Prescription
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  Reject
                </button>
              </>
            )}
            
            {prescription.status === 'verified' && (
              <button
                onClick={() => handleStatusUpdate('dispensed')}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Dispense Medication
              </button>
            )}
            
            <button
              onClick={() => onDownloadPDF(prescription)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PharmacistPrescriptions = ({ onBack }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: '1',
      patientName: 'John Smith',
      patientId: 'P001',
      patientPhone: '+1 (555) 123-4567',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '90 days',
      prescribedBy: 'Dr. Sarah Safari',
      prescribedDate: '2024-01-15',
      status: 'pending',
      priority: 'normal',
      instructions: 'Take with food in the morning. Monitor blood pressure regularly. Avoid potassium supplements.',
      refills: 2,
      cost: 25.50,
      sideEffects: ['Dizziness', 'Dry cough', 'Fatigue', 'Headache'],
      contraindications: ['Pregnancy', 'Kidney disease', 'Hyperkalemia'],
      interactions: ['Potassium supplements', 'NSAIDs', 'Lithium'],
      reason: 'Hypertension management'
    },
    {
      id: '2',
      patientName: 'Emily Johnson',
      patientId: 'P002',
      patientPhone: '+1 (555) 234-5678',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      duration: '7 days',
      prescribedBy: 'Dr. Ava Williams',
      prescribedDate: '2024-01-15',
      status: 'verified',
      priority: 'urgent',
      instructions: 'Complete the full course even if feeling better. Take with water.',
      refills: 0,
      cost: 15.75,
      sideEffects: ['Nausea', 'Diarrhea', 'Rash', 'Stomach upset'],
      contraindications: ['Penicillin allergy', 'Mononucleosis'],
      interactions: ['Warfarin', 'Methotrexate', 'Oral contraceptives'],
      reason: 'Bacterial infection'
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      patientId: 'P003',
      patientPhone: '+1 (555) 345-6789',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '90 days',
      prescribedBy: 'Dr. Adam Smith',
      prescribedDate: '2024-01-14',
      status: 'dispensed',
      priority: 'normal',
      instructions: 'Take with meals to reduce stomach upset. Monitor blood sugar levels.',
      refills: 3,
      cost: 18.00,
      sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
      contraindications: ['Kidney disease', 'Liver disease', 'Heart failure'],
      interactions: ['Alcohol', 'Contrast dye', 'Diuretics'],
      reason: 'Type 2 Diabetes'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generatePrescriptionPDF = (prescription) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('CarePulse Pharmacy', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('123 Healthcare Drive, Medical City, MC 12345', 20, 40);
    doc.text('Phone: (555) 123-4567 | Email: pharmacy@carepulse.com', 20, 50);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('PRESCRIPTION DISPENSING RECORD', 20, 70);
    
    // Pharmacist Information
    doc.setFontSize(14);
    doc.text('Dispensing Pharmacist:', 20, 90);
    doc.setFontSize(12);
    doc.text('PharmD. Michael Chen', 30, 105);
    doc.text('License: RPH123456', 30, 115);
    doc.text(`Dispensed Date: ${new Date().toLocaleDateString()}`, 30, 125);
    
    // Patient Information
    doc.setFontSize(14);
    doc.text('Patient Information:', 20, 145);
    doc.setFontSize(12);
    doc.text(`Patient: ${prescription.patientName}`, 30, 160);
    doc.text(`Patient ID: ${prescription.patientId}`, 30, 170);
    doc.text(`Phone: ${prescription.patientPhone}`, 30, 180);
    
    // Prescription Details
    doc.setFontSize(14);
    doc.text('Prescription Details:', 20, 200);
    doc.setFontSize(12);
    doc.text(`Medication: ${prescription.medication}`, 30, 215);
    doc.text(`Dosage: ${prescription.dosage}`, 30, 225);
    doc.text(`Frequency: ${prescription.frequency}`, 30, 235);
    doc.text(`Duration: ${prescription.duration}`, 30, 245);
    doc.text(`Refills: ${prescription.refills}`, 30, 255);
    doc.text(`Prescribed by: ${prescription.prescribedBy}`, 30, 265);
    doc.text(`Cost: $${prescription.cost.toFixed(2)}`, 30, 275);
    
    // Instructions
    doc.setFontSize(14);
    doc.text('Instructions:', 20, 295);
    doc.setFontSize(12);
    const instructionLines = doc.splitTextToSize(prescription.instructions, 160);
    doc.text(instructionLines, 30, 310);
    
    doc.save(`prescription-dispensed-${prescription.medication.toLowerCase().replace(/\s+/g, '-')}-${prescription.id}.pdf`);
  };

  const handleUpdateStatus = (prescriptionId, newStatus, notes) => {
    setPrescriptions(prev => prev.map(prescription => 
      prescription.id === prescriptionId 
        ? { ...prescription, status: newStatus }
        : prescription
    ));

    const prescription = prescriptions.find(p => p.id === prescriptionId);
    let message = '';
    
    switch (newStatus) {
      case 'verified':
        message = `Prescription verified for ${prescription?.patientName}`;
        break;
      case 'dispensed':
        message = `Medication dispensed to ${prescription?.patientName}`;
        break;
      case 'rejected':
        message = `Prescription rejected for ${prescription?.patientName}`;
        break;
    }

    setMessage(message);
    setMessageType(newStatus === 'rejected' ? 'error' : 'success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const handleDownloadPDF = (prescription) => {
    generatePrescriptionPDF(prescription);
    setMessage(`PDF downloaded for ${prescription.medication}`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getStatusBadge = (status, priority) => {
    const baseClasses = "flex items-center gap-2 px-3 py-1 rounded-full text-10-medium sm:text-12-medium";
    
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
            <CheckCircle className="w-3 h-3" />
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
              onClick={() => handleUpdateStatus(prescription.id, 'verified')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Verify
            </button>
            <button
              onClick={() => handleUpdateStatus(prescription.id, 'rejected')}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Reject
            </button>
          </div>
        );
      case 'verified':
        return (
          <button
            onClick={() => handleUpdateStatus(prescription.id, 'dispensed')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            Dispense
          </button>
        );
      case 'dispensed':
        return (
          <div className="text-12-medium lg:text-14-medium text-green-400 px-3 lg:px-4 py-2">
            Completed
          </div>
        );
      case 'rejected':
        return (
          <div className="text-12-medium lg:text-14-medium text-red-400 px-3 lg:px-4 py-2">
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Pill className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Prescription Management</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Verify and dispense medications</p>
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
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{pendingCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{verifiedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Verified</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Pill className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{dispensedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Dispensed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{urgentCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Urgent</div>
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
                    className={`px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 ${
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
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Pill className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Prescriptions</h2>
            </div>

            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div key={prescription.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{prescription.medication}</h3>
                          {getStatusBadge(prescription.status, prescription.priority)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Patient:</span> {prescription.patientName} ({prescription.patientId})
                          </div>
                          <div>
                            <span className="text-white">Dosage:</span> {prescription.dosage}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Prescribed by:</span> {prescription.prescribedBy}
                          </div>
                          <div>
                            <span className="text-white">Date:</span> {prescription.prescribedDate}
                          </div>
                          <div>
                            <span className="text-white">Cost:</span> ${prescription.cost.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-dark-500/30 rounded-lg px-3 py-2">
                          <p className="text-10-regular lg:text-12-regular text-dark-600">
                            <span className="text-white">Instructions:</span> {prescription.instructions}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                      {getActionButtons(prescription)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <Pill className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No prescriptions found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No prescriptions match your current search criteria. Try adjusting your filters.
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

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        prescription={selectedPrescription}
        onUpdateStatus={handleUpdateStatus}
        onDownloadPDF={handleDownloadPDF}
      />
    </>
  );
};

export default PharmacistPrescriptions;