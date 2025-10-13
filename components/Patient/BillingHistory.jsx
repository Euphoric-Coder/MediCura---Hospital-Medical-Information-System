import React, { useState } from 'react';
import { Plus, Receipt, Search, Download, Eye, Calendar, DollarSign, CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const BillingHistory = ({ onBack }) => {
  const [bills] = useState([
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        { description: 'General Consultation', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: 'Blood Test - Complete Panel', quantity: 1, unitPrice: 85.00, total: 85.00 },
        { description: 'Prescription - Lisinopril', quantity: 30, unitPrice: 2.50, total: 75.00 }
      ],
      subtotal: 310.00,
      tax: 24.80,
      discount: 15.00,
      total: 319.80,
      status: 'paid',
      paymentMethod: 'Credit Card',
      paidDate: '2024-01-16',
      doctor: 'Dr. Sarah Safari',
      department: 'General Medicine'
    },
    {
      id: 'INV-2024-002',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      items: [
        { description: 'Cardiology Consultation', quantity: 1, unitPrice: 200.00, total: 200.00 },
        { description: 'ECG Test', quantity: 1, unitPrice: 120.00, total: 120.00 }
      ],
      subtotal: 320.00,
      tax: 25.60,
      discount: 0,
      total: 345.60,
      status: 'paid',
      paymentMethod: 'Insurance',
      paidDate: '2024-01-12',
      doctor: 'Dr. Ava Williams',
      department: 'Cardiology'
    },
    {
      id: 'INV-2024-003',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      items: [
        { description: 'Emergency Room Visit', quantity: 1, unitPrice: 500.00, total: 500.00 },
        { description: 'X-Ray Chest', quantity: 1, unitPrice: 150.00, total: 150.00 },
        { description: 'Medication - Antibiotics', quantity: 7, unitPrice: 8.50, total: 59.50 }
      ],
      subtotal: 709.50,
      tax: 56.76,
      discount: 50.00,
      total: 716.26,
      status: 'pending',
      doctor: 'Dr. Adam Smith',
      department: 'Emergency'
    },
    {
      id: 'INV-2023-045',
      date: '2023-12-15',
      dueDate: '2024-01-15',
      items: [
        { description: 'Annual Physical Exam', quantity: 1, unitPrice: 180.00, total: 180.00 },
        { description: 'Vaccination - Flu Shot', quantity: 1, unitPrice: 25.00, total: 25.00 }
      ],
      subtotal: 205.00,
      tax: 16.40,
      discount: 10.00,
      total: 211.40,
      status: 'overdue',
      doctor: 'Dr. Sarah Safari',
      department: 'General Medicine'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-12-medium text-green-400">Paid</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-12-medium text-yellow-400">Pending</span>
          </div>
        );
      case 'overdue':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-12-medium text-red-400">Overdue</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillDetails(true);
  };

  const handleDownloadPDF = (billId) => {
    // Simulate PDF download
    console.log(`Downloading PDF for bill ${billId}`);
  };

  const paidCount = bills.filter(b => b.status === 'paid').length;
  const pendingCount = bills.filter(b => b.status === 'pending').length;
  const overdueCount = bills.filter(b => b.status === 'overdue').length;
  const totalAmount = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.total, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-24-bold text-white">Billing History</span>
                <p className="text-14-regular text-dark-700">
                  View and manage your medical bills
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">
                    ${totalAmount.toFixed(0)}
                  </div>
                  <div className="text-14-regular text-green-400">
                    Total Paid
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">{paidCount}</div>
                  <div className="text-14-regular text-blue-400">
                    Paid Bills
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">{pendingCount}</div>
                  <div className="text-14-regular text-yellow-400">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-32-bold text-white">{overdueCount}</div>
                  <div className="text-14-regular text-red-400">Overdue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by bill ID, doctor, or department..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Bills List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-24-bold text-white">Your Bills</h2>
            </div>

            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Receipt className="w-8 h-8 text-white" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="text-20-bold text-white">
                            Bill #{bill.id}
                          </h3>
                          {getStatusBadge(bill.status)}
                        </div>

                        <div className="flex items-center gap-6 text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>Date: {bill.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span>Amount: ${bill.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Doctor:</span>{" "}
                            {bill.doctor}
                          </div>
                          <div>
                            <span className="text-white">Department:</span>{" "}
                            {bill.department}
                          </div>
                        </div>

                        {bill.status === "paid" && bill.paymentMethod && (
                          <div className="bg-green-500/20 rounded-lg px-3 py-2 inline-block">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-green-400" />
                              <span className="text-12-regular text-green-400">
                                Paid via {bill.paymentMethod} on {bill.paidDate}
                              </span>
                            </div>
                          </div>
                        )}

                        {bill.status === "overdue" && (
                          <div className="bg-red-500/20 rounded-lg px-3 py-2 inline-block">
                            <span className="text-12-regular text-red-400">
                              Due: {bill.dueDate}
                            </span>
                          </div>
                        )}

                        {bill.status === "pending" && (
                          <div className="bg-yellow-500/20 rounded-lg px-3 py-2 inline-block">
                            <span className="text-12-regular text-yellow-400">
                              Due: {bill.dueDate}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(bill.id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </button>

                      {bill.status !== "paid" && (
                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                  <Receipt className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-24-bold text-white mb-4">No bills found</h3>
                <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                  No bills match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mt-8 text-16-regular text-dark-600 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Bill Details Modal */}
      {showBillDetails && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-24-bold text-white">Bill Details</h2>
                <button
                  onClick={() => setShowBillDetails(false)}
                  className="text-dark-600 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Bill Header */}
              <div className="bg-dark-500/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-20-bold text-white">
                      Invoice #{selectedBill.id}
                    </h3>
                    <p className="text-14-regular text-dark-700">
                      Date: {selectedBill.date}
                    </p>
                  </div>
                  {getStatusBadge(selectedBill.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-14-regular text-dark-700">
                  <div>
                    <span className="text-white">Doctor:</span>{" "}
                    {selectedBill.doctor}
                  </div>
                  <div>
                    <span className="text-white">Department:</span>{" "}
                    {selectedBill.department}
                  </div>
                  <div>
                    <span className="text-white">Due Date:</span>{" "}
                    {selectedBill.dueDate}
                  </div>
                  {selectedBill.paidDate && (
                    <div>
                      <span className="text-white">Paid Date:</span>{" "}
                      {selectedBill.paidDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Items */}
              <div className="mb-6">
                <h4 className="text-18-bold text-white mb-4">
                  Services & Items
                </h4>
                <div className="space-y-3">
                  {selectedBill.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-dark-500/30 rounded-lg p-4"
                    >
                      <div className="flex-1">
                        <div className="text-16-medium text-white">
                          {item.description}
                        </div>
                        <div className="text-14-regular text-dark-700">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-16-semibold text-white">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-dark-500/30 rounded-2xl p-6 mb-6">
                <h4 className="text-18-bold text-white mb-4">Bill Summary</h4>
                <div className="space-y-2 text-16-regular">
                  <div className="flex justify-between text-dark-700">
                    <span>Subtotal:</span>
                    <span>${selectedBill.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-dark-700">
                    <span>Tax:</span>
                    <span>${selectedBill.tax.toFixed(2)}</span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount:</span>
                      <span>-${selectedBill.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-dark-500 pt-2">
                    <div className="flex justify-between text-20-bold text-white">
                      <span>Total:</span>
                      <span>${selectedBill.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleDownloadPDF(selectedBill.id)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>

                {selectedBill.status !== "paid" && (
                  <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg text-16-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingHistory;