import React, { useState } from 'react';
import { Plus, Receipt, Search, CheckCircle, AlertTriangle, DollarSign, Calendar, TrendingUp, TrendingDown, Eye, Download, X } from 'lucide-react';
import jsPDF from 'jspdf';

const InvoiceDetailsModal = ({ 
  isOpen, 
  onClose, 
  invoice, 
  onApprove, 
  onReject 
}) => {
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Invoice Details</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-16-bold text-white mb-3">Invoice Information</h3>
                <div className="space-y-2 text-14-regular text-dark-700">
                  <p><span className="text-white">Invoice ID:</span> {invoice.id}</p>
                  <p><span className="text-white">Date:</span> {invoice.date}</p>
                  <p><span className="text-white">Due Date:</span> {invoice.dueDate}</p>
                  <p><span className="text-white">Department:</span> {invoice.department}</p>
                  <p><span className="text-white">Doctor:</span> {invoice.doctor}</p>
                </div>
              </div>
              <div>
                <h3 className="text-16-bold text-white mb-3">Patient Information</h3>
                <div className="space-y-2 text-14-regular text-dark-700">
                  <p><span className="text-white">Patient:</span> {invoice.patientName}</p>
                  <p><span className="text-white">Patient ID:</span> {invoice.patientId}</p>
                  <p><span className="text-white">Total Amount:</span> ${invoice.amount.toFixed(2)}</p>
                  <p><span className="text-white">Insurance:</span> ${invoice.insuranceCovered.toFixed(2)}</p>
                  <p><span className="text-white">Patient Pays:</span> ${invoice.patientResponsibility.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-16-bold lg:text-18-bold text-white mb-4">Services & Procedures</h3>
            <div className="space-y-3">
              {invoice.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between bg-dark-400/50 rounded-lg p-3">
                  <div className="flex-1">
                    <div className="text-14-medium text-white">{service.description}</div>
                    <div className="text-12-regular text-dark-700">
                      Qty: {service.quantity} × ${service.unitPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-16-semibold text-white">${service.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Actions */}
          {invoice.status === 'draft' && (
            <div className="bg-yellow-500/10 rounded-2xl p-4 sm:p-6 mb-6">
              <h3 className="text-16-bold text-white mb-4">Administrative Review</h3>
              <div className="space-y-4">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Add rejection reason (if rejecting)..."
                  className="shad-textArea w-full text-white min-h-[80px] resize-none"
                  rows={3}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => onApprove(invoice.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  >
                    Approve Invoice
                  </button>
                  <button
                    onClick={() => onReject(invoice.id, rejectionReason)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                  >
                    Reject Invoice
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminBillingFinance = ({ onBack }) => {
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2024-001',
      patientName: 'John Smith',
      patientId: 'P001',
      department: 'General Medicine',
      doctor: 'Dr. Sarah Safari',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 350.00,
      paidAmount: 350.00,
      status: 'paid',
      paymentMethod: 'Credit Card',
      paidDate: '2024-01-16',
      services: [
        { description: 'General Consultation', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: 'Blood Test - Complete Panel', quantity: 1, unitPrice: 85.00, total: 85.00 },
        { description: 'Prescription - Lisinopril', quantity: 30, unitPrice: 2.50, total: 75.00 }
      ],
      insuranceCovered: 280.00,
      patientResponsibility: 70.00
    },
    {
      id: 'INV-2024-002',
      patientName: 'Emily Johnson',
      patientId: 'P002',
      department: 'Cardiology',
      doctor: 'Dr. Ava Williams',
      date: '2024-01-14',
      dueDate: '2024-02-14',
      amount: 520.00,
      paidAmount: 0,
      status: 'sent',
      services: [
        { description: 'Cardiology Consultation', quantity: 1, unitPrice: 200.00, total: 200.00 },
        { description: 'ECG Test', quantity: 1, unitPrice: 120.00, total: 120.00 },
        { description: 'Echocardiogram', quantity: 1, unitPrice: 200.00, total: 200.00 }
      ],
      insuranceCovered: 416.00,
      patientResponsibility: 104.00
    },
    {
      id: 'INV-2024-003',
      patientName: 'Michael Brown',
      patientId: 'P003',
      department: 'Emergency',
      doctor: 'Dr. Adam Smith',
      date: '2024-01-10',
      dueDate: '2024-01-25',
      amount: 850.00,
      paidAmount: 0,
      status: 'overdue',
      services: [
        { description: 'Emergency Room Visit', quantity: 1, unitPrice: 500.00, total: 500.00 },
        { description: 'X-Ray Chest', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: 'Medication - Antibiotics', quantity: 7, unitPrice: 8.50, total: 59.50 }
      ],
      insuranceCovered: 680.00,
      patientResponsibility: 170.00
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateFinancialReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('CarePulse Medical Center', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('123 Healthcare Drive, Medical City, MC 12345', 20, 40);
    doc.text('Phone: (555) 123-4567 | Email: billing@carepulse.com', 20, 50);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('FINANCIAL SUMMARY REPORT', 20, 70);
    
    // Summary
    doc.setFontSize(14);
    doc.text('Financial Overview:', 20, 90);
    doc.setFontSize(12);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 30, 105);
    doc.text(`Outstanding Amount: $${outstandingAmount.toFixed(2)}`, 30, 115);
    doc.text(`Paid Invoices: ${paidCount}`, 30, 125);
    doc.text(`Pending Invoices: ${pendingCount}`, 30, 135);
    doc.text(`Overdue Invoices: ${overdueCount}`, 30, 145);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 30, 155);
    
    doc.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleApproveInvoice = (invoiceId) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: 'sent' }
        : invoice
    ));

    const invoice = invoices.find(i => i.id === invoiceId);
    setMessage(`Invoice ${invoiceId} approved and sent to ${invoice?.patientName}`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleRejectInvoice = (invoiceId, reason) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: 'cancelled', notes: reason }
        : invoice
    ));

    setMessage(`Invoice ${invoiceId} rejected: ${reason}`);
    setMessageType('error');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Receipt className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">Draft</span>
          </div>
        );
      case 'sent':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Calendar className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">Sent</span>
          </div>
        );
      case 'paid':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">Paid</span>
          </div>
        );
      case 'overdue':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">Overdue</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <X className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-gray-400">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidCount = invoices.filter(i => i.status === 'paid').length;
  const pendingCount = invoices.filter(i => i.status === 'sent').length;
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;
  const draftCount = invoices.filter(i => i.status === 'draft').length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Receipt className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">Billing & Finance</span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">Monitor invoices and payments</p>
                </div>
              </div>
              <button
                onClick={generateFinancialReport}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
              >
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Export Report</span>
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

          {/* Financial Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">${totalRevenue.toFixed(0)}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Total Revenue</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">${outstandingAmount.toFixed(0)}</div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">Outstanding</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{paidCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Paid Invoices</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{overdueCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Overdue</div>
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
                  placeholder="Search invoices by patient, ID, or doctor..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Invoice List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Invoice Management</h2>
            </div>

            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">Invoice #{invoice.id}</h3>
                          {getStatusBadge(invoice.status)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Patient:</span> {invoice.patientName}
                          </div>
                          <div>
                            <span className="text-white">Department:</span> {invoice.department}
                          </div>
                          <div>
                            <span className="text-white">Doctor:</span> {invoice.doctor}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Amount:</span> ${invoice.amount.toFixed(2)}
                          </div>
                          <div>
                            <span className="text-white">Date:</span> {invoice.date}
                          </div>
                          <div>
                            <span className="text-white">Due:</span> {invoice.dueDate}
                          </div>
                        </div>
                        
                        {invoice.status === 'paid' && invoice.paymentMethod && (
                          <div className="bg-green-500/20 rounded-lg px-3 py-2">
                            <p className="text-10-regular lg:text-12-regular text-green-400">
                              <span className="text-white">Paid via {invoice.paymentMethod} on {invoice.paidDate}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(invoice)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Review</span>
                        </button>
                      </div>
                      
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => handleApproveInvoice(invoice.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                        >
                          <span className="hidden sm:inline">Approve</span>
                          <span className="sm:hidden">✓</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <Receipt className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No invoices found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No invoices match your search criteria. Try adjusting your filters.
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

      {/* Invoice Details Modal */}
      <InvoiceDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        invoice={selectedInvoice}
        onApprove={handleApproveInvoice}
        onReject={handleRejectInvoice}
      />
    </>
  );
};

export default AdminBillingFinance;