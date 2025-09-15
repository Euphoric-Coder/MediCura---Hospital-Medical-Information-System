import React, { useState } from 'react';
import { Plus, FileText, Stethoscope, Pill, TestTube, Save, Mic, MicOff, User, Calendar, Clock } from 'lucide-react';

const labTests = [
  { id: '1', name: 'Complete Blood Count (CBC)', category: 'Hematology' },
  { id: '2', name: 'Basic Metabolic Panel', category: 'Chemistry' },
  { id: '3', name: 'Lipid Profile', category: 'Chemistry' },
  { id: '4', name: 'Thyroid Function Tests', category: 'Endocrinology' },
  { id: '5', name: 'Urinalysis', category: 'Urology' },
  { id: '6', name: 'Chest X-Ray', category: 'Radiology' },
  { id: '7', name: 'ECG', category: 'Cardiology' }
];

const ConsultationForm = ({ onBack, patientId }) => {
  const [consultationData, setConsultationData] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    followUpInstructions: ''
  });

  const [selectedLabTests, setSelectedLabTests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const [isRecording, setIsRecording] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Mock patient data
  const patient = {
    id: patientId || '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  };

  const handleInputChange = (field, value) => {
    setConsultationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVoiceToText = (field) => {
    if (isRecording && activeField === field) {
      // Stop recording
      setIsRecording(false);
      setActiveField('');
      // Simulate voice-to-text result
      const mockText = "Patient reports feeling better since last visit. No significant changes in symptoms.";
      handleInputChange(field, consultationData[field] + ' ' + mockText);
    } else {
      // Start recording
      setIsRecording(true);
      setActiveField(field);
    }
  };

  const handleLabTestToggle = (testId) => {
    setSelectedLabTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      setPrescriptions(prev => [...prev, newPrescription]);
      setNewPrescription({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveConsultation = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Consultation saved:', {
        patient: patient.id,
        consultation: consultationData,
        labTests: selectedLabTests,
        prescriptions
      });
      // Could redirect or show success message
    } catch (error) {
      console.error('Error saving consultation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-24-bold text-white">Patient Consultation</span>
              <p className="text-14-regular text-dark-700">{currentDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Patient Info Header */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-dark-500/50"
            />
            <div>
              <h1 className="text-32-bold text-white mb-2">{patient.name}</h1>
              <div className="flex items-center gap-6 text-16-regular text-dark-700">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{patient.age} years, {patient.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Today's Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Consultation Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Clinical Notes */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">Clinical Notes</h2>
              </div>

              <div className="space-y-6">
                {/* Chief Complaint */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="shad-input-label">Chief Complaint</label>
                    <button
                      onClick={() => handleVoiceToText('chiefComplaint')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isRecording && activeField === 'chiefComplaint'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-dark-400 text-dark-600 hover:text-white'
                      }`}
                    >
                      {isRecording && activeField === 'chiefComplaint' ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={consultationData.chiefComplaint}
                    onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                    placeholder="Patient's primary concern or reason for visit..."
                    className="shad-textArea w-full text-white min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>

                {/* History of Present Illness */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="shad-input-label">History of Present Illness</label>
                    <button
                      onClick={() => handleVoiceToText('historyOfPresentIllness')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isRecording && activeField === 'historyOfPresentIllness'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-dark-400 text-dark-600 hover:text-white'
                      }`}
                    >
                      {isRecording && activeField === 'historyOfPresentIllness' ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={consultationData.historyOfPresentIllness}
                    onChange={(e) => handleInputChange('historyOfPresentIllness', e.target.value)}
                    placeholder="Detailed history of the current illness..."
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Physical Examination */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="shad-input-label">Physical Examination</label>
                    <button
                      onClick={() => handleVoiceToText('physicalExamination')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isRecording && activeField === 'physicalExamination'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-dark-400 text-dark-600 hover:text-white'
                      }`}
                    >
                      {isRecording && activeField === 'physicalExamination' ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={consultationData.physicalExamination}
                    onChange={(e) => handleInputChange('physicalExamination', e.target.value)}
                    placeholder="Physical examination findings..."
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Assessment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="shad-input-label">Assessment & Diagnosis</label>
                    <button
                      onClick={() => handleVoiceToText('assessment')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isRecording && activeField === 'assessment'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-dark-400 text-dark-600 hover:text-white'
                      }`}
                    >
                      {isRecording && activeField === 'assessment' ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={consultationData.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    placeholder="Clinical assessment and diagnosis..."
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Treatment Plan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="shad-input-label">Treatment Plan</label>
                    <button
                      onClick={() => handleVoiceToText('plan')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isRecording && activeField === 'plan'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-dark-400 text-dark-600 hover:text-white'
                      }`}
                    >
                      {isRecording && activeField === 'plan' ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={consultationData.plan}
                    onChange={(e) => handleInputChange('plan', e.target.value)}
                    placeholder="Treatment plan and recommendations..."
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>

                {/* Follow-up Instructions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="shad-input-label">Follow-up Instructions</label>
                    <button
                      onClick={() => handleVoiceToText('followUpInstructions')}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isRecording && activeField === 'followUpInstructions'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-dark-400 text-dark-600 hover:text-white'
                      }`}
                    >
                      {isRecording && activeField === 'followUpInstructions' ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={consultationData.followUpInstructions}
                    onChange={(e) => handleInputChange('followUpInstructions', e.target.value)}
                    placeholder="Follow-up instructions for the patient..."
                    className="shad-textArea w-full text-white min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-8">
            {/* Lab Tests */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TestTube className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-18-bold text-white">Order Lab Tests</h3>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {labTests.map((test) => (
                  <label key={test.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-500/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedLabTests.includes(test.id)}
                      onChange={() => handleLabTestToggle(test.id)}
                      className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                    />
                    <div>
                      <div className="text-14-medium text-white">{test.name}</div>
                      <div className="text-12-regular text-green-400">{test.category}</div>
                    </div>
                  </label>
                ))}
              </div>

              {selectedLabTests.length > 0 && (
                <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                  <div className="text-12-medium text-green-400">
                    {selectedLabTests.length} test{selectedLabTests.length > 1 ? 's' : ''} selected
                  </div>
                </div>
              )}
            </div>

            {/* Prescriptions */}
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-18-bold text-white">Prescriptions</h3>
              </div>

              {/* Add New Prescription */}
              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  value={newPrescription.medication}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, medication: e.target.value }))}
                  placeholder="Medication name"
                  className="shad-input w-full text-white text-14-regular"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="Dosage"
                    className="shad-input w-full text-white text-12-regular"
                  />
                  <input
                    type="text"
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                    placeholder="Frequency"
                    className="shad-input w-full text-white text-12-regular"
                  />
                </div>
                <input
                  type="text"
                  value={newPrescription.duration}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Duration"
                  className="shad-input w-full text-white text-12-regular"
                />
                <textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Special instructions"
                  className="shad-textArea w-full text-white min-h-[60px] resize-none text-12-regular"
                  rows={2}
                />
                <button
                  onClick={handleAddPrescription}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-12-medium transition-colors"
                >
                  Add Prescription
                </button>
              </div>

              {/* Prescription List */}
              <div className="space-y-3">
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-14-medium text-white">{prescription.medication}</div>
                      <button
                        onClick={() => handleRemovePrescription(index)}
                        className="text-red-400 hover:text-red-300 text-12-regular"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="text-12-regular text-purple-300">
                      {prescription.dosage} - {prescription.frequency}
                    </div>
                    <div className="text-12-regular text-purple-300">
                      Duration: {prescription.duration}
                    </div>
                    {prescription.instructions && (
                      <div className="text-12-regular text-purple-300 mt-1">
                        Instructions: {prescription.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-16-regular text-dark-600 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={handleSaveConsultation}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving Consultation...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Consultation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;