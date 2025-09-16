import React, { useState } from 'react';
import { Plus, DollarSign, Save, Edit, CheckCircle, AlertTriangle, Clock, Calendar, TrendingUp, Users } from 'lucide-react';

const DoctorConsultationFee = ({ onBack }) => {
  const [feeStructures, setFeeStructures] = useState([
    {
      id: '1',
      type: 'General Consultation',
      description: 'Standard consultation for new and existing patients',
      currentFee: 150,
      suggestedFee: 160,
      lastUpdated: '2024-01-01',
      effectiveDate: '2024-01-01'
    },
    {
      id: '2',
      type: 'Follow-up Visit',
      description: 'Follow-up consultation for existing patients',
      currentFee: 100,
      suggestedFee: 110,
      lastUpdated: '2024-01-01',
      effectiveDate: '2024-01-01'
    },
    {
      id: '3',
      type: 'Emergency Consultation',
      description: 'Urgent consultation outside regular hours',
      currentFee: 250,
      suggestedFee: 275,
      lastUpdated: '2024-01-01',
      effectiveDate: '2024-01-01'
    },
    {
      id: '4',
      type: 'Telemedicine',
      description: 'Virtual consultation via video call',
      currentFee: 120,
      suggestedFee: 130,
      lastUpdated: '2024-01-01',
      effectiveDate: '2024-01-01'
    },
    {
      id: '5',
      type: 'House Call',
      description: 'Home visit consultation',
      currentFee: 300,
      suggestedFee: 320,
      lastUpdated: '2024-01-01',
      effectiveDate: '2024-01-01'
    }
  ]);

  const [feeHistory] = useState([
    {
      date: '2024-01-01',
      type: 'General Consultation',
      oldFee: 140,
      newFee: 150,
      reason: 'Annual fee adjustment'
    },
    {
      date: '2023-07-01',
      type: 'Emergency Consultation',
      oldFee: 230,
      newFee: 250,
      reason: 'Market rate adjustment'
    },
    {
      date: '2023-07-01',
      type: 'Telemedicine',
      oldFee: 100,
      newFee: 120,
      reason: 'Technology upgrade costs'
    }
  ]);

  const [editingFee, setEditingFee] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleEditFee = (feeStructure) => {
    setEditingFee(feeStructure.id);
    setEditValue(feeStructure.currentFee);
    setEffectiveDate(new Date().toISOString().split('T')[0]);
    setReason('');
  };

  const handleSaveFee = () => {
    if (editingFee && editValue > 0 && effectiveDate && reason) {
      setFeeStructures(prev => prev.map(fee => 
        fee.id === editingFee 
          ? { 
              ...fee, 
              currentFee: editValue, 
              lastUpdated: new Date().toISOString().split('T')[0],
              effectiveDate: effectiveDate
            }
          : fee
      ));

      const feeType = feeStructures.find(f => f.id === editingFee)?.type;
      setMessage(`${feeType} fee updated to $${editValue}`);
      setMessageType('success');
      
      setEditingFee(null);
      setEditValue(0);
      setEffectiveDate('');
      setReason('');
      
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingFee(null);
    setEditValue(0);
    setEffectiveDate('');
    setReason('');
  };

  const applySuggestedFees = () => {
    setFeeStructures(prev => prev.map(fee => ({
      ...fee,
      currentFee: fee.suggestedFee,
      lastUpdated: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0]
    })));

    setMessage('All suggested fees applied successfully');
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const totalRevenue = feeStructures.reduce((sum, fee) => sum + (fee.currentFee * 10), 0); // Estimated monthly
  const averageFee = feeStructures.reduce((sum, fee) => sum + fee.currentFee, 0) / feeStructures.length;
  const potentialIncrease = feeStructures.reduce((sum, fee) => sum + (fee.suggestedFee - fee.currentFee), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Consultation Fees</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Manage your pricing structure</p>
              </div>
            </div>
            <button
              onClick={applySuggestedFees}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Apply Suggested Fees
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

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">${totalRevenue.toFixed(0)}</div>
                <div className="text-10-regular lg:text-14-regular text-green-400">Est. Monthly</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">${averageFee.toFixed(0)}</div>
                <div className="text-10-regular lg:text-14-regular text-blue-400">Average Fee</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">+${potentialIncrease}</div>
                <div className="text-10-regular lg:text-14-regular text-purple-400">Potential Increase</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">4.8</div>
                <div className="text-10-regular lg:text-14-regular text-yellow-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8 mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h2 className="text-18-bold lg:text-24-bold text-white">Fee Structure</h2>
          </div>

          <div className="space-y-4">
            {feeStructures.map((feeStructure) => (
              <div key={feeStructure.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6">
                {editingFee === feeStructure.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-16-bold lg:text-20-bold text-white">{feeStructure.type}</h3>
                        <p className="text-12-regular lg:text-14-regular text-dark-700">{feeStructure.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="shad-input-label block mb-2">New Fee ($)</label>
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                          className="shad-input w-full text-white"
                          min="0"
                          step="5"
                        />
                      </div>

                      <div>
                        <label className="shad-input-label block mb-2">Effective Date</label>
                        <input
                          type="date"
                          value={effectiveDate}
                          onChange={(e) => setEffectiveDate(e.target.value)}
                          className="shad-input w-full text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="shad-input-label block mb-2">Reason</label>
                        <input
                          type="text"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Reason for change"
                          className="shad-input w-full text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 lg:py-3 px-4 rounded-lg text-12-medium lg:text-14-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveFee}
                        disabled={!editValue || !effectiveDate || !reason}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-2 lg:py-3 px-4 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{feeStructure.type}</h3>
                          <div className="text-20-bold lg:text-24-bold text-green-400">${feeStructure.currentFee}</div>
                        </div>
                        
                        <p className="text-12-regular lg:text-14-regular text-dark-700">{feeStructure.description}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Last Updated:</span> {feeStructure.lastUpdated}
                          </div>
                          <div>
                            <span className="text-white">Effective:</span> {feeStructure.effectiveDate}
                          </div>
                        </div>
                        
                        {feeStructure.suggestedFee > feeStructure.currentFee && (
                          <div className="bg-blue-500/20 rounded-lg px-3 py-2 inline-block">
                            <p className="text-10-regular lg:text-12-regular text-blue-400">
                              <span className="text-white">Suggested:</span> ${feeStructure.suggestedFee} 
                              <span className="text-green-400"> (+${feeStructure.suggestedFee - feeStructure.currentFee})</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleEditFee(feeStructure)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit Fee</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fee History */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h2 className="text-18-bold lg:text-24-bold text-white">Fee Change History</h2>
          </div>

          <div className="space-y-4">
            {feeHistory.map((history, index) => (
              <div key={index} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-16-bold lg:text-18-bold text-white">{history.type}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                        <div>
                          <span className="text-white">Date:</span> {history.date}
                        </div>
                        <div>
                          <span className="text-red-400">${history.oldFee}</span> → <span className="text-green-400">${history.newFee}</span>
                        </div>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg px-3 py-2 inline-block">
                        <p className="text-10-regular lg:text-12-regular text-purple-400">
                          <span className="text-white">Reason:</span> {history.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-16-bold lg:text-18-bold text-green-400">
                      +${history.newFee - history.oldFee}
                    </div>
                    <div className="text-10-regular lg:text-12-regular text-dark-600">
                      {(((history.newFee - history.oldFee) / history.oldFee) * 100).toFixed(1)}% increase
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {feeHistory.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-18-bold lg:text-20-bold text-white mb-2">No fee changes yet</h3>
              <p className="text-14-regular text-dark-700">
                Fee change history will appear here when you update your consultation fees.
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
  );
};

export default DoctorConsultationFee;