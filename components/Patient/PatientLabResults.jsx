import React, { useState } from 'react';
import { TestTube, Search, Download, Eye, Calendar, User, Clock, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import jsPDF from 'jspdf';

const LabResultDetailsModal = ({ 
  isOpen, 
  onClose, 
  labResult, 
  onDownloadPDF 
}) => {
  if (!isOpen || !labResult) return null;

  const getParameterStatusIcon = (status) => {
    switch (status) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-blue-400" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getParameterStatusColor = (status) => {
    switch (status) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'low':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'critical':
        return 'text-red-500 bg-red-500/20 border-red-500/40';
      default:
        return 'text-green-400 bg-green-500/10 border-green-500/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Lab Result Details</h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Test Header */}
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <TestTube className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-16-bold sm:text-18-bold lg:text-20-bold text-white">{labResult.testName}</h3>
                <p className="text-12-regular sm:text-14-regular text-green-400">{labResult.category}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-12-regular sm:text-14-regular text-dark-700">
              <div>
                <span className="text-white">Ordered by:</span> {labResult.orderedBy}
              </div>
              <div>
                <span className="text-white">Ordered Date:</span> {labResult.orderedDate}
              </div>
              <div>
                <span className="text-white">Collection:</span> {labResult.collectionDate}
              </div>
              {labResult.resultDate && (
                <div>
                  <span className="text-white">Result Date:</span> {labResult.resultDate}
                </div>
              )}
              <div>
                <span className="text-white">Lab:</span> {labResult.lab}
              </div>
              <div>
                <span className="text-white">Cost:</span> ${labResult.cost.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Test Results */}
          {labResult.results && labResult.results.length > 0 && (
            <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
              <h4 className="text-16-bold sm:text-18-bold text-white mb-4">Test Results</h4>
              <div className="space-y-3">
                {labResult.results.map((result, index) => (
                  <div key={index} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border ${getParameterStatusColor(result.status)}`}>
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      {getParameterStatusIcon(result.status)}
                      <div>
                        <div className="text-14-medium sm:text-16-medium text-white">{result.parameter}</div>
                        <div className="text-12-regular text-dark-600">Normal: {result.normalRange}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-16-semibold sm:text-18-semibold text-white">
                        {result.value} {result.unit}
                      </div>
                      <div className={`text-12-medium ${result.status === 'normal' ? 'text-green-400' : result.status === 'critical' ? 'text-red-500' : 'text-yellow-400'}`}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {labResult.notes && (
            <div className="bg-blue-500/10 rounded-2xl p-4 sm:p-6 mb-6">
              <h4 className="text-16-bold sm:text-18-bold text-white mb-4">Doctor's Notes</h4>
              <p className="text-12-regular sm:text-14-regular text-blue-300">{labResult.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onDownloadPDF(labResult)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold sm:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientLabResults = ({ onBack }) => {
  const [labResults] = useState([
    {
      id: '1',
      testName: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      orderedBy: 'Dr. Sarah Safari',
      orderedDate: '2024-01-10',
      collectionDate: '2024-01-12',
      resultDate: '2024-01-13',
      status: 'completed',
      results: [
        { parameter: 'White Blood Cells', value: '7.2', unit: 'K/uL', normalRange: '4.0-11.0', status: 'normal' },
        { parameter: 'Red Blood Cells', value: '4.8', unit: 'M/uL', normalRange: '4.2-5.4', status: 'normal' },
        { parameter: 'Hemoglobin', value: '14.5', unit: 'g/dL', normalRange: '12.0-16.0', status: 'normal' },
        { parameter: 'Hematocrit', value: '42.1', unit: '%', normalRange: '36.0-46.0', status: 'normal' },
        { parameter: 'Platelets', value: '285', unit: 'K/uL', normalRange: '150-450', status: 'normal' }
      ],
      overallResult: 'normal',
      notes: 'All blood count parameters are within normal limits. Continue current medications.',
      cost: 85.00,
      lab: 'CarePulse Laboratory'
    },
    {
      id: '2',
      testName: 'Lipid Profile',
      category: 'Chemistry',
      orderedBy: 'Dr. Sarah Safari',
      orderedDate: '2024-01-10',
      collectionDate: '2024-01-12',
      resultDate: '2024-01-14',
      status: 'completed',
      results: [
        { parameter: 'Total Cholesterol', value: '195', unit: 'mg/dL', normalRange: '<200', status: 'normal' },
        { parameter: 'LDL Cholesterol', value: '125', unit: 'mg/dL', normalRange: '<100', status: 'high' },
        { parameter: 'HDL Cholesterol', value: '45', unit: 'mg/dL', normalRange: '>40', status: 'normal' },
        { parameter: 'Triglycerides', value: '150', unit: 'mg/dL', normalRange: '<150', status: 'normal' }
      ],
      overallResult: 'abnormal',
      notes: 'LDL cholesterol slightly elevated. Recommend dietary modifications and follow-up in 3 months.',
      cost: 65.00,
      lab: 'CarePulse Laboratory'
    },
    {
      id: '3',
      testName: 'Thyroid Function Tests',
      category: 'Endocrinology',
      orderedBy: 'Dr. Ava Williams',
      orderedDate: '2024-01-15',
      collectionDate: '2024-01-16',
      status: 'in-progress',
      cost: 120.00,
      lab: 'External Lab Partners'
    },
    {
      id: '4',
      testName: 'Basic Metabolic Panel',
      category: 'Chemistry',
      orderedBy: 'Dr. Sarah Safari',
      orderedDate: '2024-01-18',
      collectionDate: '2024-01-20',
      status: 'pending',
      cost: 45.00,
      lab: 'CarePulse Laboratory'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const categories = ['all', ...Array.from(new Set(labResults.map(r => r.category)))];

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.orderedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || result.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">Completed</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">Pending</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Activity className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">In Progress</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getOverallResultBadge = (result) => {
    if (!result) return null;
    
    switch (result) {
      case 'normal':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-14-medium text-green-400">Normal</span>
          </div>
        );
      case 'abnormal':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-14-medium text-yellow-400">Abnormal</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-14-medium text-red-400">Critical</span>
          </div>
        );
      default:
        return null;
    }
  };

  const generateLabResultPDF = (labResult) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('CarePulse Medical Center', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('123 Healthcare Drive, Medical City, MC 12345', 20, 40);
    doc.text('Phone: (555) 123-4567 | Email: lab@carepulse.com', 20, 50);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('LABORATORY REPORT', 20, 70);
    
    // Patient Information
    doc.setFontSize(14);
    doc.text('Patient Information:', 20, 90);
    doc.setFontSize(12);
    doc.text('Patient: John Smith', 30, 105);
    doc.text('Patient ID: P001', 30, 115);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 30, 125);
    
    // Test Information
    doc.setFontSize(14);
    doc.text('Test Information:', 20, 145);
    doc.setFontSize(12);
    doc.text(`Test Name: ${labResult.testName}`, 30, 160);
    doc.text(`Category: ${labResult.category}`, 30, 170);
    doc.text(`Ordered by: ${labResult.orderedBy}`, 30, 180);
    doc.text(`Ordered Date: ${labResult.orderedDate}`, 30, 190);
    doc.text(`Collection Date: ${labResult.collectionDate}`, 30, 200);
    if (labResult.resultDate) {
      doc.text(`Result Date: ${labResult.resultDate}`, 30, 210);
    }
    doc.text(`Laboratory: ${labResult.lab}`, 30, 220);
    
    let yPos = 255;
    
    // Results
    if (labResult.results && labResult.results.length > 0) {
      doc.setFontSize(14);
      doc.text('Test Results:', 20, 240);
      doc.setFontSize(12);
      
      labResult.results.forEach((result) => {
        doc.text(`${result.parameter}: ${result.value} ${result.unit}`, 30, yPos);
        doc.text(`Normal Range: ${result.normalRange}`, 30, yPos + 10);
        doc.text(`Status: ${result.status.toUpperCase()}`, 30, yPos + 20);
        yPos += 35;
      });
    }
    
    // Notes
    if (labResult.notes) {
      doc.setFontSize(14);
      doc.text('Doctor\'s Notes:', 20, yPos + 10);
      doc.setFontSize(12);
      const noteLines = doc.splitTextToSize(labResult.notes, 160);
      doc.text(noteLines, 30, yPos + 25);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('This report is confidential and intended for the patient and healthcare provider only.', 20, 280);
    
    // Save the PDF
    doc.save(`lab-result-${labResult.testName.toLowerCase().replace(/\s+/g, '-')}-${labResult.id}.pdf`);
  };

  const handleDownloadPDF = (labResult) => {
    generateLabResultPDF(labResult);
    setMessage(`PDF downloaded for ${labResult.testName}`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleViewDetails = (labResult) => {
    setSelectedLabResult(labResult);
    setShowDetailsModal(true);
  };

  const completedCount = labResults.filter(r => r.status === 'completed').length;
  const pendingCount = labResults.filter(r => r.status === 'pending').length;
  const inProgressCount = labResults.filter(r => r.status === 'in-progress').length;
  const abnormalCount = labResults.filter(r => r.overallResult === 'abnormal' || r.overallResult === 'critical').length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <TestTube className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Lab Results</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">View your test results</p>
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
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{completedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Completed</div>
                </div>
              </div>
            </div>

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
                  <Activity className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{inProgressCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{abnormalCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Abnormal</div>
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
                  placeholder="Search lab tests or doctors..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lab Results List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TestTube className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-20-bold lg:text-24-bold text-white">Your Lab Results</h2>
            </div>

            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div key={result.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <TestTube className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{result.testName}</h3>
                          {getStatusBadge(result.status)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Category:</span> {result.category}
                          </div>
                          <div>
                            <span className="text-white">Ordered by:</span> {result.orderedBy}
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-white">Date:</span> {result.orderedDate}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Collection:</span> {result.collectionDate}
                          </div>
                          {result.resultDate && (
                            <div>
                              <span className="text-white">Result:</span> {result.resultDate}
                            </div>
                          )}
                          <div>
                            <span className="text-white">Cost:</span> ${result.cost.toFixed(2)}
                          </div>
                        </div>
                        
                        {result.overallResult && (
                          <div className="mt-2">
                            {getOverallResultBadge(result.overallResult)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        {result.status === 'completed' && (
                          <>
                            <button
                              onClick={() => handleViewDetails(result)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            
                            <button
                              onClick={() => handleDownloadPDF(result)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">PDF</span>
                            </button>
                          </>
                        )}
                        
                        {result.status === 'pending' && (
                          <div className="text-12-medium lg:text-14-medium text-yellow-400 px-3 lg:px-4 py-2">
                            Awaiting Collection
                          </div>
                        )}
                        
                        {result.status === 'in-progress' && (
                          <div className="text-12-medium lg:text-14-medium text-blue-400 px-3 lg:px-4 py-2">
                            Processing...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredResults.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <TestTube className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No lab results found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No lab results match your search criteria. Try adjusting your filters.
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

      {/* Lab Result Details Modal */}
      <LabResultDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        labResult={selectedLabResult}
        onDownloadPDF={handleDownloadPDF}
      />
    </>
  );
};

export default PatientLabResults;