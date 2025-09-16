import React, { useState } from 'react';
import { Plus, Receipt, Search, User, Calendar, DollarSign, Download, CreditCard, CheckCircle, AlertTriangle, Clock, X, Phone } from 'lucide-react';
import jsPDF from 'jspdf';

const PaymentModal = ({ isOpen, onClose, bill, onProcessPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);

  React.useEffect(() => {
    if (bill) {
      setPaymentAmount(bill.patientResponsibility);
    }
  }, [bill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bill) {
      onProcessPayment(bill.id, paymentMethod, paymentAmount);
      onClose();
    }
  };

  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-md">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold text-white">Process Payment</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="text-16-bold text-white mb-2">Bill #{bill.id}</h3>
            <p className="text-14-regular text-blue-400">Patient: {bill.patientName}</p>
            <p className="text-14-regular text-blue-400">Total Amount: ${bill.total.toFixed(2)}</p>
            <p className="text-14-regular text-blue-400">Patient Responsibility: ${bill.patientResponsibility.toFixed(2)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="shad-input-label block mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="shad-select-trigger w-full text-white"
                required
              >
                <option value="cash">Cash</option>
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="check">Check</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>

            <div>
              <label className="shad-input-label block mb-2">Payment Amount</label>
              <input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                className="shad-input w-full text-white"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Process Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ReceptionistBilling = ({ onBack }) => {
  const [bills, setBills] = useState([
    {
      id: 'INV-2024-001',
      patientId: 'P001',
      patientName: 'John Smith',
      patientPhone: '+1 (555) 123-4567',
      date: '2024-01-15',
      items: [
        { id: '1', description: 'General Consultation', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { id: '2', description: 'Blood Test - Complete Panel', quantity: 1, unitPrice: 85.00, total: 85.00 }
      ],
      subtotal: 235.00,
      tax: 18.80,
      discount: 10.00,
      total: 243.80,
      status: 'sent',
      dueDate: '2024-02-15',
      doctor: 'Dr. Sarah Safari',
      insuranceCovered: 195.04,
      patientResponsibility: 48.76
    },
    {
      id: 'INV-2024-002',
      patientId: 'P002',
      patientName: 'Emily Johnson',
      patientPhone: '+1 (555) 234-5678',
      date: '2024-01-14',
      items: [
        { id: '1', description: 'Cardiology Consultation', quantity: 1, unitPrice: 200.00, total: 200.00 },
        { id: '2', description: 'ECG Test', quantity: 1, unitPrice: 120.00, total: 120.00 }
      ],
      subtotal: 320.00,
      tax: 25.60,
      discount: 0,
      total: 345.60,
      status: 'paid',
      paymentMethod: 'Credit Card',
      paidDate: '2024-01-15',
      dueDate: '2024-02-14',
      doctor: 'Dr. Ava Williams',
      insuranceCovered: 276.76,
      patientResponsibility: 68.84
    },
    {
      id: 'INV-2024-003',
      patientId: 'P003',
      patientName: 'Michael Brown',
      patientPhone: '+1 (555) 345-6789',
      date: '2024-01-10',
      items: [
        { id: '1', description: 'Emergency Consultation', quantity: 1, unitPrice: 250.00, total: 250.00 },
        { id: '2', description: 'X-Ray Chest', quantity: 1, unitPrice: 150.00, total: 150.00 }
      ],
      subtotal: 400.00,
      tax: 32.00,
      discount: 20.00,
      total: 412.00,
      status: 'overdue',
      dueDate: '2024-01-25',
      doctor: 'Dr. Adam Smith',
      insuranceCovered: 329.60,
      patientResponsibility: 82.40
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateBillPDF = (bill) => {
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
    doc.text(`MEDICAL BILL - ${bill.id}`, 20, 70);
    
    // Patient Information
    doc.setFontSize(14);
    doc.text('Patient Information:', 20, 90);
    doc.setFontSize(12);
    doc.text(`Patient: ${bill.patientName}`, 30, 105);
    doc.text(`Patient ID: ${bill.patientId}`, 30, 115);
    doc.text(`Phone: ${bill.patientPhone}`, 30, 125);
    doc.text(`Date: ${bill.date}`, 30, 135);
    doc.text(`Doctor: ${bill.doctor}`, 30, 145);
    
    // Services
    doc.setFontSize(14);
    doc.text('Services:', 20, 165);
    doc.setFontSize(12);
    
    let yPos = 180;
    bill.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.description}`, 30, yPos);
      doc.text(`   Quantity: ${item.quantity} × $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}`, 30, yPos + 10);
      yPos += 25;
    });
    
    // Totals
    doc.setFontSize(14);
    doc.text('Bill Summary:', 20, yPos + 10);
    doc.setFontSize(12);
    doc.text(`Subtotal: $${bill.subtotal.toFixed(2)}`, 30, yPos + 25);
    doc.text(`Tax: $${bill.tax.toFixed(2)}`, 30, yPos + 35);
    if (bill.discount > 0) {
      doc.text(`Discount: -$${bill.discount.toFixed(2)}`, 30, yPos + 45);
    }
    doc.text(`Insurance Coverage: $${bill.insuranceCovered.toFixed(2)}`, 30, yPos + 55);
    doc.setFontSize(14);
    doc.text(`Patient Responsibility: $${bill.patientResponsibility.toFixed(2)}`, 30, yPos + 70);
    
    if (bill.paymentMethod) {
      doc.setFontSize(12);
      doc.text(`Payment Method: ${bill.paymentMethod}`, 30, yPos + 85);
      doc.text(`Paid Date: ${bill.paidDate}`, 30, yPos + 95);
    }
    
    doc.save(`medical-bill-${bill.id}.pdf`);
  };

  const handleProcessPayment = (billId, paymentMethod, amount) => {
    setBills(prev => prev.map(bill =>
      bill.id === billId
        ? { 
            ...bill, 
            status: 'paid', 
            paymentMethod, 
            paidDate: new Date().toISOString().split('T')[0]
          }
        : bill
    ));

    const bill = bills.find(b => b.id === billId);
    setMessage(`Payment of $${amount.toFixed(2)} processed for ${bill?.patientName}`);
    setMessageType('success');

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handlePaymentClick = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
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
            <Clock className="w-3 h-3" />
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
      default:
        return null;
    }
  };

  const paidCount = bills.filter(b => b.status === 'paid').length;
  const pendingCount = bills.filter(b => b.status === 'sent').length;
  const overdueCount = bills.filter(b => b.status === 'overdue').length;
  const totalRevenue = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.total, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Billing & Payments</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Process patient payments and bills</p>
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
                  <DollarSign className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">${totalRevenue.toFixed(0)}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Total Revenue</div>
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
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Paid Bills</div>
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
                  placeholder="Search bills by patient name, ID, or bill number..."
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
              </select>
            </div>
          </div>

          {/* Bills List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Patient Bills</h2>
            </div>

            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div key={bill.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">Bill #{bill.id}</h3>
                          {getStatusBadge(bill.status)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Patient:</span> {bill.patientName}
                          </div>
                          <div>
                            <span className="text-white">Date:</span> {bill.date}
                          </div>
                          <div>
                            <span className="text-white">Doctor:</span> {bill.doctor}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Total:</span> ${bill.total.toFixed(2)}
                          </div>
                          <div>
                            <span className="text-white">Insurance:</span> ${bill.insuranceCovered.toFixed(2)}
                          </div>
                          <div>
                            <span className="text-white">Patient:</span> ${bill.patientResponsibility.toFixed(2)}
                          </div>
                        </div>
                        
                        {bill.status === 'paid' && bill.paymentMethod && (
                          <div className="bg-green-500/20 rounded-lg px-3 py-2">
                            <p className="text-10-regular lg:text-12-regular text-green-400">
                              <span className="text-white">Paid via {bill.paymentMethod} on {bill.paidDate}</span>
                            </p>
                          </div>
                        )}
                        
                        {bill.status === 'overdue' && (
                          <div className="bg-red-500/20 rounded-lg px-3 py-2">
                            <p className="text-10-regular lg:text-12-regular text-red-400">
                              <span className="text-white">Due: {bill.dueDate}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateBillPDF(bill)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                        
                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {bill.status !== 'paid' && (
                        <button
                          onClick={() => handlePaymentClick(bill)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="hidden sm:inline">Process Payment</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <Receipt className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No bills found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No bills match your search criteria. Try adjusting your filters.
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bill={selectedBill}
        onProcessPayment={handleProcessPayment}
      />
    </>
  );
};

export default ReceptionistBilling;