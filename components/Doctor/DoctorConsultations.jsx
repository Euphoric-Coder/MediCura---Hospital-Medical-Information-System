import React, { useState } from 'react';
import { Plus, FileText, Stethoscope, Pill, TestTube, Bed, Save, Mic, MicOff, User, Calendar, Clock, Search, CheckCircle, AlertTriangle } from 'lucide-react';

const labTests = [
  { id: '1', name: 'Complete Blood Count (CBC)', category: 'Hematology' },
  { id: '2', name: 'Basic Metabolic Panel', category: 'Chemistry' },
  { id: '3', name: 'Lipid Profile', category: 'Chemistry' },
  { id: '4', name: 'Thyroid Function Tests', category: 'Endocrinology' },
  { id: '5', name: 'Urinalysis', category: 'Urology' },
  { id: '6', name: 'Chest X-Ray', category: 'Radiology' },
  { id: '7', name: 'ECG', category: 'Cardiology' },
  { id: '8', name: 'Echocardiogram', category: 'Cardiology' },
  { id: '9', name: 'CT Scan - Head', category: 'Radiology' },
  { id: '10', name: 'MRI - Brain', category: 'Radiology' }
];

const admissionTypes = [
  'General Ward',
  'ICU',
  'CCU (Cardiac Care Unit)',
  'Emergency Department',
  'Surgery',
  'Maternity Ward',
  'Pediatric Ward',
  'Psychiatric Unit'
];

const DoctorConsultations = ({ onBack }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationData, setConsultationData] = useState({
    patientId: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    prescriptions: [],
    labTests: [],
    admissionRequired: false,
    admissionType: '',
    admissionReason: '',
    followUpInstructions: '',
    nextAppointment: ''
  });

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
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Mock patients for today's consultations
  const todayPatients = [
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      reason: 'Annual check-up',
      appointmentTime: '10:00 AM'
    },
    {
      id: 'P002',
      name: 'Emily Johnson',
      age: 32,
      gender: 'Female',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      reason: 'Follow-up visit',
      appointmentTime: '11:30 AM'
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 67,
      gender: 'Male',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      reason: 'Chest pain evaluation',
      appointmentTime: '2:00 PM'
    }
  ];

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setConsultationData(prev => ({
      ...prev,
      patientId: patient.id
    }));
  };

  const handleInputChange = (field, value) => {
    setConsultationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVoiceToText = (field) => {
    if (isRecording && activeField === field) {
      setIsRecording(false);
      setActiveField('');
      // Simulate voice-to-text result
      const mockText = "Patient reports feeling better since last visit. No significant changes in symptoms.";
      handleInputChange(field, consultationData[field] + ' ' + mockText);
    } else {
      setIsRecording(true);
      setActiveField(field);
    }
  };

  const handleAddPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage) {
      setConsultationData(prev => ({
        ...prev,
        prescriptions: [...prev.prescriptions, newPrescription]
      }));
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
    setConsultationData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  const handleLabTestToggle = (testId) => {
    setConsultationData(prev => ({
      ...prev,
      labTests: prev.labTests.includes(testId)
        ? prev.labTests.filter(id => id !== testId)
        : [...prev.labTests, testId]
    }));
  };

  const handleSaveConsultation = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Consultation saved successfully');
      setMessageType('success');
      
      // Reset form
      setConsultationData({
        patientId: '',
        chiefComplaint: '',
        historyOfPresentIllness: '',
        physicalExamination: '',
        assessment: '',
        plan: '',
        prescriptions: [],
        labTests: [],
        admissionRequired: false,
        admissionType: '',
        admissionReason: '',
        followUpInstructions: '',
        nextAppointment: ''
      });
      setSelectedPatient(null);
    } catch (error) {
      setMessage('Error saving consultation');
      setMessageType('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <span className="text-20-bold lg:text-24-bold text-white">Patient Consultations</span>
              <p className="text-12-regular lg:text-14-regular text-dark-700">Write consultation notes and prescriptions</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h2 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">Today's Patients</h2>
              
              <div className="space-y-3">
                {todayPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`w-full p-3 lg:p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedPatient?.id === patient.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-dark-500 hover:border-dark-400 bg-dark-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-14-semibold lg:text-16-semibold text-white truncate">{patient.name}</h3>
                        <p className="text-12-regular text-dark-700">{patient.appointmentTime}</p>
                        <p className="text-10-regular lg:text-12-regular text-dark-600 truncate">{patient.reason}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="lg:col-span-3">
            {selectedPatient ? (
              <div className="space-y-6 lg:space-y-8">
                {/* Patient Header */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl object-cover border-2 border-dark-500/50"
                    />
                    <div>
                      <h1 className="text-20-bold lg:text-32-bold text-white mb-2">{selectedPatient.name}</h1>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-14-regular lg:text-16-regular text-dark-700">
                        <span>{selectedPatient.age} years, {selectedPatient.gender}</span>
                        <span>Today's Consultation</span>
                        <span>{selectedPatient.appointmentTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* Main Consultation Form */}
                  <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    {/* Clinical Notes */}
                    <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
                      <div className="flex items-center gap-3 mb-6 lg:mb-8">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <h2 className="text-18-bold lg:text-24-bold text-white">Clinical Notes</h2>
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
                          <label className="shad-input-label block mb-2">Follow-up Instructions</label>
                          <textarea
                            value={consultationData.followUpInstructions}
                            onChange={(e) => handleInputChange('followUpInstructions', e.target.value)}
                            placeholder="Follow-up instructions for the patient..."
                            className="shad-textArea w-full text-white min-h-[80px] resize-none"
                            rows={3}
                          />
                        </div>

                        {/* Next Appointment */}
                        <div>
                          <label className="shad-input-label block mb-2">Next Appointment</label>
                          <input
                            type="datetime-local"
                            value={consultationData.nextAppointment}
                            onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                            className="shad-input w-full text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Side Panel */}
                  <div className="space-y-6 lg:space-y-8">
                    {/* Prescriptions */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-4 lg:mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-16-bold lg:text-18-bold text-white">Prescriptions</h3>
                      </div>

                      {/* Add New Prescription */}
                      <div className="space-y-3 mb-4">
                        <input
                          type="text"
                          value={newPrescription.medication}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, medication: e.target.value }))}
                          placeholder="Medication name"
                          className="shad-input w-full text-white text-12-regular lg:text-14-regular"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newPrescription.dosage}
                            onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                            placeholder="Dosage"
                            className="shad-input w-full text-white text-10-regular lg:text-12-regular"
                          />
                          <input
                            type="text"
                            value={newPrescription.frequency}
                            onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                            placeholder="Frequency"
                            className="shad-input w-full text-white text-10-regular lg:text-12-regular"
                          />
                        </div>
                        <input
                          type="text"
                          value={newPrescription.duration}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="Duration"
                          className="shad-input w-full text-white text-12-regular lg:text-14-regular"
                        />
                        <textarea
                          value={newPrescription.instructions}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                          placeholder="Special instructions"
                          className="shad-textArea w-full text-white min-h-[60px] resize-none text-10-regular lg:text-12-regular"
                          rows={2}
                        />
                        <button
                          onClick={handleAddPrescription}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-12-medium lg:text-14-medium transition-colors"
                        >
                          Add Prescription
                        </button>
                      </div>

                      {/* Prescription List */}
                      <div className="space-y-3">
                        {consultationData.prescriptions.map((prescription, index) => (
                          <div key={index} className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-14-medium text-white">{prescription.medication}</div>
                              <button
                                onClick={() => handleRemovePrescription(index)}
                                className="text-red-400 hover:text-red-300 text-10-regular lg:text-12-regular"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="text-10-regular lg:text-12-regular text-purple-300">
                              {prescription.dosage} - {prescription.frequency}
                            </div>
                            <div className="text-10-regular lg:text-12-regular text-purple-300">
                              Duration: {prescription.duration}
                            </div>
                            {prescription.instructions && (
                              <div className="text-10-regular lg:text-12-regular text-purple-300 mt-1">
                                Instructions: {prescription.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lab Tests */}
                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-4 lg:mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <TestTube className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-16-bold lg:text-18-bold text-white">Order Lab Tests</h3>
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {labTests.map((test) => (
                          <label key={test.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-500/10 transition-colors">
                            <input
                              type="checkbox"
                              checked={consultationData.labTests.includes(test.id)}
                              onChange={() => handleLabTestToggle(test.id)}
                              className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-12-medium lg:text-14-medium text-white">{test.name}</div>
                              <div className="text-10-regular lg:text-12-regular text-green-400">{test.category}</div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {consultationData.labTests.length > 0 && (
                        <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
                          <div className="text-10-medium lg:text-12-medium text-green-400">
                            {consultationData.labTests.length} test{consultationData.labTests.length > 1 ? 's' : ''} selected
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hospital Admission */}
                    <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-4 lg:p-6">
                      <div className="flex items-center gap-3 mb-4 lg:mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Bed className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-16-bold lg:text-18-bold text-white">Hospital Admission</h3>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consultationData.admissionRequired}
                            onChange={(e) => setConsultationData(prev => ({ ...prev, admissionRequired: e.target.checked }))}
                            className="w-4 h-4 text-red-500 bg-dark-400 border-dark-500 rounded focus:ring-red-500"
                          />
                          <span className="text-14-medium text-white">Admission Required</span>
                        </label>

                        {consultationData.admissionRequired && (
                          <div className="space-y-3">
                            <select
                              value={consultationData.admissionType}
                              onChange={(e) => handleInputChange('admissionType', e.target.value)}
                              className="shad-select-trigger w-full text-white text-12-regular lg:text-14-regular"
                            >
                              <option value="">Select admission type</option>
                              {admissionTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                            <textarea
                              value={consultationData.admissionReason}
                              onChange={(e) => handleInputChange('admissionReason', e.target.value)}
                              placeholder="Reason for admission..."
                              className="shad-textArea w-full text-white min-h-[80px] resize-none text-12-regular lg:text-14-regular"
                              rows={3}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={onBack}
                    className="text-14-regular lg:text-16-regular text-dark-600 hover:text-white transition-colors"
                  >
                    ← Back to Dashboard
                  </button>

                  <button
                    onClick={handleSaveConsultation}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
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
            ) : (
              <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
                <div className="text-center py-12 lg:py-20">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                    <Stethoscope className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                  </div>
                  <h3 className="text-20-bold lg:text-24-bold text-white mb-4">Select a Patient</h3>
                  <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                    Choose a patient from today's appointments to start the consultation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultations;