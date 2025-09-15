import React, { useState } from "react";
import {
  Plus,
  Search,
  Receipt,
  User,
  Calendar,
  DollarSign,
  Download,
  Printer as Print,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PharmacyBilling = ({ onBack }) => {
  const [bills, setBills] = useState([
    {
      id: "B001",
      patientId: "P001",
      patientName: "John Smith",
      patientPhone: "+1 (555) 123-4567",
      date: "2024-01-15",
      items: [
        {
          id: "1",
          medication: "Lisinopril 10mg",
          quantity: 30,
          unitPrice: 2.5,
          total: 75.0,
        },
        {
          id: "2",
          medication: "Metformin 500mg",
          quantity: 60,
          unitPrice: 1.25,
          total: 75.0,
        },
      ],
      subtotal: 150.0,
      tax: 12.0,
      discount: 5.0,
      total: 157.0,
      status: "paid",
      paymentMethod: "Credit Card",
    },
    {
      id: "B002",
      patientId: "P002",
      patientName: "Emily Johnson",
      patientPhone: "+1 (555) 234-5678",
      date: "2024-01-15",
      items: [
        {
          id: "1",
          medication: "Amoxicillin 500mg",
          quantity: 21,
          unitPrice: 1.75,
          total: 36.75,
        },
      ],
      subtotal: 36.75,
      tax: 2.94,
      discount: 0,
      total: 39.69,
      status: "pending",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showNewBillModal, setShowNewBillModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // New bill state
  const [newBill, setNewBill] = useState({
    patientId: "",
    patientName: "",
    patientPhone: "",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: "draft",
  });

  const [newItem, setNewItem] = useState({
    medication: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
  });

  const filteredBills = bills.filter(
    (bill) =>
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateBillTotals = (items, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax - discount;

    return { subtotal, tax, total };
  };

  const handleAddItem = () => {
    if (newItem.medication && newItem.quantity && newItem.unitPrice) {
      const total = newItem.quantity * newItem.unitPrice;
      const item = {
        id: Date.now().toString(),
        medication: newItem.medication,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        total,
      };

      const updatedItems = [...(newBill.items || []), item];
      const {
        subtotal,
        tax,
        total: billTotal,
      } = calculateBillTotals(updatedItems, newBill.discount || 0);

      setNewBill((prev) => ({
        ...prev,
        items: updatedItems,
        subtotal,
        tax,
        total: billTotal,
      }));

      setNewItem({
        medication: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = (newBill.items || []).filter(
      (item) => item.id !== itemId
    );
    const { subtotal, tax, total } = calculateBillTotals(
      updatedItems,
      newBill.discount || 0
    );

    setNewBill((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax,
      total,
    }));
  };

  const handleCreateBill = () => {
    if (newBill.patientName && newBill.items && newBill.items.length > 0) {
      const bill = {
        id: `B${String(bills.length + 1).padStart(3, "0")}`,
        patientId:
          newBill.patientId || `P${String(bills.length + 1).padStart(3, "0")}`,
        patientName: newBill.patientName,
        patientPhone: newBill.patientPhone || "",
        date: new Date().toISOString().split("T")[0],
        items: newBill.items,
        subtotal: newBill.subtotal || 0,
        tax: newBill.tax || 0,
        discount: newBill.discount || 0,
        total: newBill.total || 0,
        status: "draft",
      };

      setBills((prev) => [...prev, bill]);
      setMessage(`Bill ${bill.id} created successfully`);
      setMessageType("success");
      setShowNewBillModal(false);
      setNewBill({
        patientId: "",
        patientName: "",
        patientPhone: "",
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: "draft",
      });

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  const handleMarkAsPaid = (billId, paymentMethod) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId ? { ...bill, status: "paid", paymentMethod } : bill
      )
    );

    const bill = bills.find((b) => b.id === billId);
    setMessage(
      `Payment received for ${bill?.patientName} - $${bill?.total.toFixed(2)}`
    );
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-12-medium text-green-400">Paid</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span className="text-12-medium text-yellow-400">Pending</span>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Receipt className="w-3 h-3" />
            <span className="text-12-medium text-blue-400">Draft</span>
          </div>
        );
      default:
        return null;
    }
  };

  const paidCount = bills.filter((b) => b.status === "paid").length;
  const pendingCount = bills.filter((b) => b.status === "pending").length;
  const draftCount = bills.filter((b) => b.status === "draft").length;
  const totalRevenue = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, bill) => sum + bill.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-24-bold text-white">
                  Pharmacy Billing
                </span>
                <p className="text-14-regular text-dark-700">
                  Generate and manage patient bills
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewBillModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Bill
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-8 ${
              messageType === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-16-regular">{message}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">
                  ${totalRevenue.toFixed(0)}
                </div>
                <div className="text-14-regular text-green-400">
                  Total Revenue
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
                <div className="text-14-regular text-blue-400">Paid Bills</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{pendingCount}</div>
                <div className="text-14-regular text-yellow-400">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Receipt className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{draftCount}</div>
                <div className="text-14-regular text-purple-400">Drafts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-dark-600" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, ID, or bill number..."
              className="shad-input pl-10 w-full text-white"
            />
          </div>
        </div>

        {/* Bills List */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-24-bold text-white">Recent Bills</h2>
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
                          <User className="w-4 h-4 text-blue-400" />
                          <span>
                            {bill.patientName} ({bill.patientId})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span>{bill.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-yellow-400" />
                          <span>${bill.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="text-14-regular text-dark-700">
                        <span className="text-white">Items:</span>{" "}
                        {bill.items.length} medication
                        {bill.items.length > 1 ? "s" : ""}
                        {bill.paymentMethod && (
                          <span className="ml-4">
                            <span className="text-white">Payment:</span>{" "}
                            {bill.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedBill(bill);
                        setShowBillDetails(true);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      View
                    </button>

                    {bill.status === "pending" && (
                      <button
                        onClick={() => handleMarkAsPaid(bill.id, "Cash")}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      >
                        Mark Paid
                      </button>
                    )}

                    <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                      <Download className="w-4 h-4" />
                    </button>

                    <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25">
                      <Print className="w-4 h-4" />
                    </button>
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
                No bills match your search criteria. Create a new bill to get
                started.
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

      {/* New Bill Modal */}
      {showNewBillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-24-bold text-white">Create New Bill</h2>
                <button
                  onClick={() => setShowNewBillModal(false)}
                  className="text-dark-600 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="shad-input-label block mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={newBill.patientId || ""}
                    onChange={(e) =>
                      setNewBill((prev) => ({
                        ...prev,
                        patientId: e.target.value,
                      }))
                    }
                    placeholder="P001"
                    className="shad-input w-full text-white"
                  />
                </div>
                <div>
                  <label className="shad-input-label block mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newBill.patientName || ""}
                    onChange={(e) =>
                      setNewBill((prev) => ({
                        ...prev,
                        patientName: e.target.value,
                      }))
                    }
                    placeholder="John Smith"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="shad-input-label block mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newBill.patientPhone || ""}
                    onChange={(e) =>
                      setNewBill((prev) => ({
                        ...prev,
                        patientPhone: e.target.value,
                      }))
                    }
                    placeholder="+1 (555) 123-4567"
                    className="shad-input w-full text-white"
                  />
                </div>
              </div>

              {/* Add Items */}
              <div className="border border-dark-500 rounded-2xl p-6 mb-6">
                <h3 className="text-18-bold text-white mb-4">
                  Add Medications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      value={newItem.medication || ""}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          medication: e.target.value,
                        }))
                      }
                      placeholder="Medication name"
                      className="shad-input w-full text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newItem.quantity || 1}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 1,
                        }))
                      }
                      placeholder="Quantity"
                      className="shad-input w-full text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.unitPrice || 0}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          unitPrice: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="Unit Price"
                      className="shad-input w-full text-white"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleAddItem}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-14-medium transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {newBill.items && newBill.items.length > 0 && (
                  <div className="space-y-2">
                    {newBill.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-dark-500/30 rounded-lg p-3"
                      >
                        <div className="flex-1 grid grid-cols-4 gap-4 text-14-regular text-white">
                          <span>{item.medication}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>${item.unitPrice.toFixed(2)}</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              {newBill.items && newBill.items.length > 0 && (
                <div className="bg-dark-500/30 rounded-2xl p-6 mb-6">
                  <h3 className="text-18-bold text-white mb-4">Bill Summary</h3>
                  <div className="space-y-2 text-16-regular">
                    <div className="flex justify-between text-dark-700">
                      <span>Subtotal:</span>
                      <span>${newBill.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-dark-700">
                      <span>Tax (8%):</span>
                      <span>${newBill.tax?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-dark-700">
                      <span>Discount:</span>
                      <input
                        type="number"
                        step="0.01"
                        value={newBill.discount || 0}
                        onChange={(e) => {
                          const discount = parseFloat(e.target.value) || 0;
                          const { subtotal, tax, total } = calculateBillTotals(
                            newBill.items || [],
                            discount
                          );
                          setNewBill((prev) => ({
                            ...prev,
                            discount,
                            subtotal,
                            tax,
                            total,
                          }));
                        }}
                        className="w-20 bg-dark-400 border border-dark-500 rounded px-2 py-1 text-white text-right"
                      />
                    </div>
                    <div className="border-t border-dark-500 pt-2">
                      <div className="flex justify-between text-20-bold text-white">
                        <span>Total:</span>
                        <span>${newBill.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowNewBillModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBill}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  Create Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyBilling;
