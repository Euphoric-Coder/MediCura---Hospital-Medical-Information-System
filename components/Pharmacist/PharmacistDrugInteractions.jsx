import React, { useState } from 'react';
import { Plus, AlertTriangle, Search, User, Pill, X, CheckCircle, Info } from 'lucide-react';

const PharmacistDrugInteractions = ({ onBack }) => {
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [medicationInput, setMedicationInput] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [activeTab, setActiveTab] = useState('checker');

  const commonMedications = [
    'Lisinopril', 'Metformin', 'Amlodipine', 'Metoprolol', 'Omeprazole',
    'Simvastatin', 'Losartan', 'Albuterol', 'Hydrochlorothiazide', 'Atorvastatin',
    'Levothyroxine', 'Ibuprofen', 'Acetaminophen', 'Aspirin', 'Prednisone',
    'Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Warfarin', 'Insulin'
  ];

  const knownInteractions = [
    {
      id: '1',
      drug1: 'Warfarin',
      drug2: 'Aspirin',
      severity: 'major',
      description: 'Increased risk of bleeding',
      clinicalEffect: 'Enhanced anticoagulant effect leading to increased bleeding risk',
      management: 'Monitor INR closely. Consider alternative pain management.',
      mechanism: 'Additive anticoagulant effects'
    },
    {
      id: '2',
      drug1: 'Lisinopril',
      drug2: 'Ibuprofen',
      severity: 'moderate',
      description: 'Reduced antihypertensive effect',
      clinicalEffect: 'NSAIDs may reduce the effectiveness of ACE inhibitors',
      management: 'Monitor blood pressure. Consider alternative pain relief.',
      mechanism: 'NSAIDs inhibit prostaglandin synthesis'
    },
    {
      id: '3',
      drug1: 'Metformin',
      drug2: 'Prednisone',
      severity: 'moderate',
      description: 'Increased blood glucose levels',
      clinicalEffect: 'Corticosteroids may increase blood glucose levels',
      management: 'Monitor blood glucose closely. May need to adjust diabetes medication.',
      mechanism: 'Corticosteroids increase insulin resistance'
    }
  ];

  const patientProfiles = [
    {
      patientId: 'P001',
      patientName: 'John Smith',
      medications: ['Lisinopril', 'Metformin', 'Aspirin'],
      interactions: [],
      riskLevel: 'low'
    },
    {
      patientId: 'P002',
      patientName: 'Emily Johnson',
      medications: ['Warfarin', 'Aspirin', 'Omeprazole'],
      interactions: [knownInteractions[0]],
      riskLevel: 'high'
    }
  ];

  const addMedication = (medication) => {
    if (medication && !selectedMedications.includes(medication)) {
      setSelectedMedications(prev => [...prev, medication]);
    }
    setMedicationInput('');
  };

  const removeMedication = (medication) => {
    setSelectedMedications(prev => prev.filter(med => med !== medication));
  };

  const checkInteractions = () => {
    const interactions = [];
    
    for (let i = 0; i < selectedMedications.length; i++) {
      for (let j = i + 1; j < selectedMedications.length; j++) {
        const interaction = knownInteractions.find(int => 
          (int.drug1 === selectedMedications[i] && int.drug2 === selectedMedications[j]) ||
          (int.drug1 === selectedMedications[j] && int.drug2 === selectedMedications[i])
        );
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }
    
    return interactions;
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'minor':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <Info className="w-3 h-3" />
            <span className="text-12-medium text-green-400">Minor</span>
          </div>
        );
      case 'moderate':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-12-medium text-yellow-400">Moderate</span>
          </div>
        );
      case 'major':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-12-medium text-red-400">Major</span>
          </div>
        );
      case 'contraindicated':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/30 border border-red-500/50 rounded-full">
            <X className="w-3 h-3" />
            <span className="text-12-medium text-red-300">Contraindicated</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getRiskLevelBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-12-medium text-green-400">Low Risk</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-12-medium text-yellow-400">Medium Risk</span>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-12-medium text-red-400">High Risk</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/30 border border-red-500/50 rounded-full">
            <X className="w-3 h-3" />
            <span className="text-12-medium text-red-300">Critical Risk</span>
          </div>
        );
      default:
        return null;
    }
  };

  const currentInteractions = checkInteractions();
  const filteredPatients = patientProfiles.filter(patient =>
    patient.patientName.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <span className="text-20-bold lg:text-24-bold text-white">Drug Interaction Checker</span>
              <p className="text-12-regular lg:text-14-regular text-dark-700">Check for medication interactions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Tabs */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex gap-2">
            {[
              { id: 'checker', label: 'Drug Checker', icon: Pill },
              { id: 'patient-check', label: 'Patient Check', icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-14-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-red-500 text-white'
                    : 'bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'checker' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Medication Input */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
              <h2 className="text-18-bold lg:text-24-bold text-white mb-6">Add Medications</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addMedication(medicationInput);
                      }
                    }}
                    placeholder="Type medication name..."
                    className="shad-input w-full text-white"
                    list="medications"
                  />
                  <datalist id="medications">
                    {commonMedications.map((med) => (
                      <option key={med} value={med} />
                    ))}
                  </datalist>
                </div>
                <button
                  onClick={() => addMedication(medicationInput)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Add
                </button>
              </div>

              {/* Selected Medications */}
              {selectedMedications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-16-bold text-white mb-4">Selected Medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedications.map((medication) => (
                      <div
                        key={medication}
                        className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1"
                      >
                        <span className="text-12-medium text-blue-400">{medication}</span>
                        <button
                          onClick={() => removeMedication(medication)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Add Common Combinations */}
              <div>
                <h3 className="text-16-bold text-white mb-4">Common Medication Combinations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ['Warfarin', 'Aspirin'],
                    ['Lisinopril', 'Ibuprofen'],
                    ['Metformin', 'Prednisone']
                  ].map((combo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMedications(combo)}
                      className="p-3 rounded-lg border border-dark-500 hover:border-blue-500 bg-dark-400/30 hover:bg-blue-500/10 transition-all duration-300 text-left"
                    >
                      <div className="text-14-medium text-white">{combo.join(' + ')}</div>
                      <div className="text-12-regular text-dark-700">Click to check</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interaction Results */}
            {selectedMedications.length >= 2 && (
              <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
                <h2 className="text-18-bold lg:text-24-bold text-white mb-6">Interaction Results</h2>
                
                {currentInteractions.length > 0 ? (
                  <div className="space-y-4">
                    {currentInteractions.map((interaction) => (
                      <div key={interaction.id} className="bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                              <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-16-bold lg:text-18-bold text-white">
                                {interaction.drug1} + {interaction.drug2}
                              </h3>
                              <p className="text-14-regular text-red-400">{interaction.description}</p>
                            </div>
                          </div>
                          {getSeverityBadge(interaction.severity)}
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-14-bold text-white mb-2">Clinical Effect</h4>
                            <p className="text-12-regular text-dark-700">{interaction.clinicalEffect}</p>
                          </div>
                          <div>
                            <h4 className="text-14-bold text-white mb-2">Management</h4>
                            <p className="text-12-regular text-dark-700">{interaction.management}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-18-bold lg:text-20-bold text-white mb-2">No Interactions Found</h3>
                    <p className="text-14-regular text-green-400">
                      The selected medications appear to be safe to use together.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'patient-check' && (
          <div className="space-y-6 lg:space-y-8">
            {/* Patient Search */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search patients by name or ID..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>
            </div>

            {/* Patient Interaction Results */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
              <h2 className="text-18-bold lg:text-24-bold text-white mb-6">Patient Medication Reviews</h2>
              
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.patientId} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-16-bold lg:text-18-bold text-white">{patient.patientName}</h3>
                          <p className="text-14-regular text-dark-700">ID: {patient.patientId}</p>
                        </div>
                      </div>
                      {getRiskLevelBadge(patient.riskLevel)}
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-14-bold text-white mb-2">Current Medications</h4>
                      <div className="flex flex-wrap gap-2">
                        {patient.medications.map((medication, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-12-medium text-blue-400"
                          >
                            {medication}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {patient.interactions.length > 0 && (
                      <div>
                        <h4 className="text-14-bold text-white mb-2">Detected Interactions</h4>
                        <div className="space-y-2">
                          {patient.interactions.map((interaction) => (
                            <div key={interaction.id} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-14-medium text-white">
                                  {interaction.drug1} + {interaction.drug2}
                                </span>
                                {getSeverityBadge(interaction.severity)}
                              </div>
                              <p className="text-12-regular text-red-400">{interaction.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {patient.interactions.length === 0 && (
                      <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-14-medium text-green-400">No interactions detected</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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

export default PharmacistDrugInteractions;