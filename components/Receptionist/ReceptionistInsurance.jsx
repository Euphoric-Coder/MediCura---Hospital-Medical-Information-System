import React, { useState } from 'react';
import { Plus, CreditCard, Search, CheckCircle, AlertTriangle, Clock, User, Phone, X, Shield, FileText } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, verification, onUpdate }) => {
  const [notes, setNotes] = useState('');
  const [coverage, setCoverage] = useState({
    deductible: 0,
    copay: 0,
    coinsurance: 0,
    outOfPocketMax: 0
  });

  React.useEffect(() => {
    if (verification) {
      setNotes(verification.notes || '');
      setCoverage(verification.coverage);
    }
  }, [verification]);

  const handleVerify = (status) => {
    if (verification) {
      onUpdate(verification.id, status, notes);
      onClose();
    }
  };

  if (!isOpen || !verification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Insurance Verification</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Patient & Insurance Info */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-16-bold text-white mb-3">Patient Information</h3>
                <div className="space-y-2 text-14-regular text-dark-700">
                  <p><span className="text-white">Name:</span> {verification.patientName}</p>
                  <p><span className="text-white">ID:</span> {verification.patientId}</p>
                  <p><span className="text-white">Phone:</span> {verification.patientPhone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-16-bold text-white mb-3">Insurance Details</h3>
                <div className="space-y-2 text-14-regular text-dark-700">
                  <p><span className="text-white">Provider:</span> {verification.insuranceProvider}</p>
                  <p><span className="text-white">Policy:</span> {verification.policyNumber}</p>
                  {verification.groupNumber && (
                    <p><span className="text-white">Group:</span> {verification.groupNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Information */}
          <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-16-bold text-white mb-4">Coverage Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="shad-input-label block mb-2">Deductible ($)</label>
                <input
                  type="number"
                  value={coverage.deductible}
                  onChange={(e) => setCoverage(prev => ({ ...prev, deductible: parseFloat(e.target.value) || 0 }))}
                  className="shad-input w-full text-white"
                />
              </div>
              <div>
                <label className="shad-input-label block mb-2">Copay ($)</label>
                <input
                  type="number"
                  value={coverage.copay}
                  onChange={(e) => setCoverage(prev => ({ ...prev, copay: parseFloat(e.target.value) || 0 }))}
                  className="shad-input w-full text-white"
                />
              </div>
              <div>
                <label className="shad-input-label block mb-2">Coinsurance (%)</label>
                <input
                  type="number"
                  value={coverage.coinsurance}
                  onChange={(e) => setCoverage(prev => ({ ...prev, coinsurance: parseFloat(e.target.value) || 0 }))}
                  className="shad-input w-full text-white"
                />
              </div>
              <div>
                <label className="shad-input-label block mb-2">Out-of-Pocket Max ($)</label>
                <input
                  type="number"
                  value={coverage.outOfPocketMax}
                  onChange={(e) => setCoverage(prev => ({ ...prev, outOfPocketMax: parseFloat(e.target.value) || 0 }))}
                  className="shad-input w-full text-white"
                />
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-green-500/10 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-16-bold text-white mb-4">Covered Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Office Visits',
                'Preventive Care',
                'Emergency Services',
                'Prescription Drugs',
                'Laboratory Tests',
                'Radiology Services',
                'Specialist Consultations',
                'Mental Health Services'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-14-regular text-green-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Notes */}
          <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-16-bold text-white mb-4">Verification Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add verification notes, coverage details, or special instructions..."
              className="shad-textArea w-full text-white min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {verification.status === 'pending' && (
              <>
                <button
                  onClick={() => handleVerify('verified')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  Verify Insurance
                </button>
                <button
                  onClick={() => handleVerify('rejected')}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceptionistInsurance = ({ onBack }) => {
  const [verifications, setVerifications] = useState([
    {
      id: '1',
      patientId: 'P001',
      patientName: 'John Smith',
      patientPhone: '+1 (555) 123-4567',
      insuranceProvider: 'BlueCross BlueShield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001',
      status: 'verified',
      submittedDate: '2024-01-15',
      verifiedDate: '2024-01-15',
      verifiedBy: 'Emily Johnson',
      coverage: {
        deductible: 1000,
        copay: 25,
        coinsurance: 20,
        outOfPocketMax: 5000
      },
      eligibility: {
        active: true,
        effectiveDate: '2024-01-01'
      },
      benefits: ['Office Visits', 'Preventive Care', 'Emergency Services'],
      priority: 'low'
    },
    {
      id: '2',
      patientId: 'P002',
      patientName: 'Emily Johnson',
      patientPhone: '+1 (555) 234-5678',
      insuranceProvider: 'Aetna',
      policyNumber: 'AET987654321',
      status: 'pending',
      submittedDate: '2024-01-16',
      coverage: {
        deductible: 0,
        copay: 0,
        coinsurance: 0,
        outOfPocketMax: 0
      },
      eligibility: {
        active: false,
        effectiveDate: ''
      },
      benefits: [],
      priority: 'high'
    },
    {
      id: '3',
      patientId: 'P003',
      patientName: 'Michael Brown',
      patientPhone: '+1 (555) 345-6789',
      insuranceProvider: 'Medicare',
      policyNumber: 'MED123456789',
      status: 'rejected',
      submittedDate: '2024-01-14',
      verifiedDate: '2024-01-15',
      verifiedBy: 'Emily Johnson',
      coverage: {
        deductible: 0,
        copay: 0,
        coinsurance: 0,
        outOfPocketMax: 0
      },
      eligibility: {
        active: false,
        effectiveDate: ''
      },
      benefits: [],
      notes: 'Policy expired. Patient needs to update insurance information.',
      priority: 'medium'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = verification.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleVerificationClick = (verification) => {
    setSelectedVerification(verification);
    setShowVerificationModal(true);
  };

  const handleUpdateVerification = (verificationId, status, notes) => {
    setVerifications(prev => prev.map(verification => 
      verification.id === verificationId 
        ? { 
            ...verification, 
            status: status,
            verifiedDate: new Date().toISOString().split('T')[0],
            verifiedBy: 'Emily Johnson',
            notes: notes || verification.notes
          }
        : verification
    ));

    const verification = verifications.find(v => v.id === verificationId);
    setMessage(`Insurance ${status} for ${verification?.patientName}`);
    setMessageType(status === 'rejected' ? 'error' : 'success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getStatusBadge = (status, priority) => {
    switch (status) {
      case 'pending':
        return (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            priority === 'high' 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-yellow-500/20 border border-yellow-500/30'
          }`}>
            <Clock className="w-3 h-3" />
            <span className={`text-10-medium sm:text-12-medium ${
              priority === 'high' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {priority === 'high' ? 'Urgent Pending' : 'Pending'}
            </span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">Verified</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">Rejected</span>
          </div>
        );
      case 'expired':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-gray-400">Expired</span>
          </div>
        );
      default:
        return null;
    }
  };

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const verifiedCount = verifications.filter(v => v.status === 'verified').length;
  const rejectedCount = verifications.filter(v => v.status === 'rejected').length;
  const urgentCount = verifications.filter(v => v.priority === 'high' && v.status === 'pending').length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Insurance Verification</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Verify patient insurance coverage</p>
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

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{verifiedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Verified</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{rejectedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Rejected</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{urgentCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">Urgent</div>
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
                  placeholder="Search by patient name, ID, or policy number..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Verification List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Insurance Verifications</h2>
            </div>

            <div className="space-y-4">
              {filteredVerifications.map((verification) => (
                <div key={verification.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{verification.patientName}</h3>
                          {getStatusBadge(verification.status, verification.priority)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Provider:</span> {verification.insuranceProvider}
                          </div>
                          <div>
                            <span className="text-white">Policy:</span> {verification.policyNumber}
                          </div>
                          <div>
                            <span className="text-white">ID:</span> {verification.patientId}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Submitted:</span> {verification.submittedDate}
                          </div>
                          {verification.verifiedDate && (
                            <div>
                              <span className="text-white">Verified:</span> {verification.verifiedDate}
                            </div>
                          )}
                          {verification.verifiedBy && (
                            <div>
                              <span className="text-white">By:</span> {verification.verifiedBy}
                            </div>
                          )}
                        </div>
                        
                        {verification.status === 'verified' && (
                          <div className="bg-green-500/20 rounded-lg px-3 py-2">
                            <p className="text-10-regular lg:text-12-regular text-green-400">
                              <span className="text-white">Coverage:</span> Deductible: ${verification.coverage.deductible}, Copay: ${verification.coverage.copay}
                            </p>
                          </div>
                        )}
                        
                        {verification.notes && (
                          <div className="bg-red-500/20 rounded-lg px-3 py-2">
                            <p className="text-10-regular lg:text-12-regular text-red-400">
                              <span className="text-white">Notes:</span> {verification.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerificationClick(verification)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </button>
                        
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVerifications.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <CreditCard className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No verifications found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No insurance verifications match your search criteria.
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

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        verification={selectedVerification}
        onUpdate={handleUpdateVerification}
      />
    </>
  );
};

export default ReceptionistInsurance;