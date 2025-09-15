import React, { useState } from 'react';
import { FileText, Search, Edit, Save, X, Plus, User, Calendar, Pill, Activity, Heart, AlertTriangle, CheckCircle } from 'lucide-react';

const EditModal = ({ isOpen, onClose, record, onSave }) => {
  const [editValue, setEditValue] = useState('');
  const [editArray, setEditArray] = useState([]);
  const [newItem, setNewItem] = useState('');

  React.useEffect(() => {
    if (record) {
      if (Array.isArray(record.value)) {
        setEditArray([...record.value]);
      } else {
        setEditValue(record.value);
      }
    }
  }, [record]);

  const handleSave = () => {
    if (record) {
      const valueToSave = Array.isArray(record.value) ? editArray : editValue;
      onSave(record.id, valueToSave);
      onClose();
    }
  };

  const addArrayItem = () => {
    if (newItem.trim()) {
      setEditArray(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeArrayItem = (index) => {
    setEditArray(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-md">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold lg:text-20-bold text-white">Edit {record.field}</h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {Array.isArray(record.value) ? (
              <div className="space-y-4">
                {/* Existing Items */}
                {editArray.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-14-medium text-white">Current Items:</label>
                    {editArray.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-dark-500/30 rounded-lg p-3">
                        <span className="text-14-regular text-white">{item}</span>
                        <button
                          onClick={() => removeArrayItem(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Item */}
                <div>
                  <label className="shad-input-label block mb-2">Add New Item</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem();
                        }
                      }}
                      placeholder={`Add new ${record.field.toLowerCase()}`}
                      className="shad-input flex-1 text-white"
                    />
                    <button
                      onClick={addArrayItem}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-14-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="shad-input-label block mb-2">{record.field}</label>
                {record.field.toLowerCase().includes('history') || record.field.toLowerCase().includes('notes') ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="shad-textArea w-full text-white min-h-[120px] resize-none"
                    rows={5}
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="shad-input w-full text-white"
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientMedicalRecords = ({ onBack }) => {
  const [medicalRecords, setMedicalRecords] = useState([
    // Personal Information
    {
      id: '1',
      category: 'personal',
      field: 'Full Name',
      value: 'John Smith',
      editable: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'Patient'
    },
    {
      id: '2',
      category: 'personal',
      field: 'Date of Birth',
      value: '1990-05-15',
      editable: false,
      lastUpdated: '2024-01-10',
      updatedBy: 'Registration'
    },
    {
      id: '3',
      category: 'personal',
      field: 'Gender',
      value: 'Male',
      editable: false,
      lastUpdated: '2024-01-10',
      updatedBy: 'Registration'
    },
    {
      id: '4',
      category: 'personal',
      field: 'Address',
      value: '123 Main Street, New York, NY 10001',
      editable: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'Patient'
    },
    {
      id: '5',
      category: 'personal',
      field: 'Phone Number',
      value: '+1 (555) 123-4567',
      editable: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'Patient'
    },
    {
      id: '6',
      category: 'personal',
      field: 'Email',
      value: 'john.smith@email.com',
      editable: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'Patient'
    },
    {
      id: '7',
      category: 'personal',
      field: 'Occupation',
      value: 'Software Engineer',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },

    // Medical Information
    {
      id: '8',
      category: 'medical',
      field: 'Primary Physician',
      value: 'Dr. Sarah Safari',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },
    {
      id: '9',
      category: 'medical',
      field: 'Blood Type',
      value: 'O+',
      editable: false,
      lastUpdated: '2024-01-10',
      updatedBy: 'Lab Test'
    },
    {
      id: '10',
      category: 'medical',
      field: 'Allergies',
      value: ['Penicillin', 'Peanuts', 'Shellfish'],
      editable: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'Patient'
    },
    {
      id: '11',
      category: 'medical',
      field: 'Current Medications',
      value: ['Lisinopril 10mg', 'Metformin 500mg'],
      editable: true,
      lastUpdated: '2024-01-15',
      updatedBy: 'Dr. Sarah Safari'
    },
    {
      id: '12',
      category: 'medical',
      field: 'Family Medical History',
      value: ['Mother had breast cancer', 'Father had diabetes', 'Grandfather had heart disease'],
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },
    {
      id: '13',
      category: 'medical',
      field: 'Past Medical History',
      value: ['Appendectomy in 2015', 'Broken arm in 2018', 'Asthma in childhood'],
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },

    // Emergency Contact
    {
      id: '14',
      category: 'emergency',
      field: 'Emergency Contact Name',
      value: 'Jane Smith',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },
    {
      id: '15',
      category: 'emergency',
      field: 'Emergency Phone',
      value: '+1 (555) 987-6543',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },
    {
      id: '16',
      category: 'emergency',
      field: 'Relationship',
      value: 'Spouse',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },

    // Insurance Information
    {
      id: '17',
      category: 'insurance',
      field: 'Insurance Provider',
      value: 'BlueCross BlueShield',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },
    {
      id: '18',
      category: 'insurance',
      field: 'Policy Number',
      value: 'BC123456789',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    },
    {
      id: '19',
      category: 'insurance',
      field: 'Group Number',
      value: 'GRP001234',
      editable: true,
      lastUpdated: '2024-01-10',
      updatedBy: 'Patient'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const categories = [
    { id: 'all', label: 'All Categories', icon: FileText, color: 'text-gray-400' },
    { id: 'personal', label: 'Personal Info', icon: User, color: 'text-blue-400' },
    { id: 'medical', label: 'Medical Info', icon: Heart, color: 'text-red-400' },
    { id: 'emergency', label: 'Emergency Contact', icon: AlertTriangle, color: 'text-yellow-400' },
    { id: 'insurance', label: 'Insurance', icon: CheckCircle, color: 'text-green-400' }
  ];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (typeof record.value === 'string' && record.value.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'personal':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'medical':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'insurance':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'personal':
        return 'from-blue-500/10 to-blue-600/5 border-blue-500/20';
      case 'medical':
        return 'from-red-500/10 to-red-600/5 border-red-500/20';
      case 'emergency':
        return 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20';
      case 'insurance':
        return 'from-green-500/10 to-green-600/5 border-green-500/20';
      default:
        return 'from-gray-500/10 to-gray-600/5 border-gray-500/20';
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleSave = (recordId, newValue) => {
    setMedicalRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            value: newValue, 
            lastUpdated: new Date().toISOString().split('T')[0],
            updatedBy: 'Patient'
          }
        : record
    ));

    const record = medicalRecords.find(r => r.id === recordId);
    setMessage(`${record?.field} updated successfully`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-dark-600 italic">None specified</span>;
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-12-medium text-blue-400"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }
    return <span className="text-white">{value || 'Not specified'}</span>;
  };

  const personalCount = medicalRecords.filter(r => r.category === 'personal').length;
  const medicalCount = medicalRecords.filter(r => r.category === 'medical').length;
  const emergencyCount = medicalRecords.filter(r => r.category === 'emergency').length;
  const insuranceCount = medicalRecords.filter(r => r.category === 'insurance').length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Medical Records</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">View and edit your medical information</p>
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
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{personalCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Personal</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{medicalCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Medical</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{emergencyCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">Emergency</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{insuranceCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Insurance</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search medical records..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 ${
                      categoryFilter === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Medical Records by Category */}
          <div className="space-y-6 lg:space-y-8">
            {categories.slice(1).map((category) => {
              const categoryRecords = filteredRecords.filter(record => record.category === category.id);
              
              if (categoryRecords.length === 0 && categoryFilter !== 'all' && categoryFilter !== category.id) {
                return null;
              }

              return (
                <div key={category.id} className={`bg-gradient-to-r ${getCategoryColor(category.id)} backdrop-blur-xl border rounded-3xl p-4 lg:p-8`}>
                  <div className="flex items-center gap-3 mb-6 lg:mb-8">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r ${category.id === 'personal' ? 'from-blue-500 to-blue-600' : category.id === 'medical' ? 'from-red-500 to-red-600' : category.id === 'emergency' ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'} rounded-xl flex items-center justify-center`}>
                      <category.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <h2 className="text-18-bold lg:text-24-bold text-white">{category.label}</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {categoryRecords.map((record) => (
                      <div key={record.id} className="bg-dark-400/50 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              {getCategoryIcon(record.category)}
                              <h3 className="text-14-bold lg:text-16-bold text-white">{record.field}</h3>
                            </div>
                            
                            <div className="mb-4">
                              {renderValue(record.value)}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-10-regular lg:text-12-regular text-dark-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                <span>Updated: {record.lastUpdated}</span>
                              </div>
                              <div>
                                <span>By: {record.updatedBy}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            {record.editable ? (
                              <button
                                onClick={() => handleEdit(record)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="p-2 lg:p-3 rounded-lg bg-dark-500/50 border border-dark-500">
                                <Edit className="w-4 h-4 text-dark-600" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {categoryRecords.length === 0 && categoryFilter === category.id && (
                    <div className="text-center py-12">
                      <category.icon className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                      <h3 className="text-18-bold text-white mb-2">No {category.label.toLowerCase()} found</h3>
                      <p className="text-14-regular text-dark-700">
                        No records match your search criteria in this category.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredRecords.length === 0 && (
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <FileText className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No records found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No medical records match your search criteria. Try adjusting your search or filters.
                </p>
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

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        record={selectedRecord}
        onSave={handleSave}
      />
    </>
  );
};

export default PatientMedicalRecords;