import React, { useState } from "react";
import {
  Plus,
  Receipt,
  Search,
  User,
  Calendar,
  DollarSign,
  Download,
  Printer as Print,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import jsPDF from "jspdf";

const NewBillModal = ({ isOpen, onClose, onCreateBill }) => {
  const [billData, setBillData] = useState({
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

      const updatedItems = [...(billData.items || []), item];
      const {
        subtotal,
        tax,
        total: billTotal,
      } = calculateBillTotals(updatedItems, billData.discount || 0);

      setBillData((prev) => ({
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
    const updatedItems = (billData.items || []).filter(
      (item) => item.id !== itemId
    );
    const { subtotal, tax, total } = calculateBillTotals(
      updatedItems,
      billData.discount || 0
    );

    setBillData((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax,
      total,
    }));
  };

  const handleCreateBill = () => {
    if (billData.patientName && billData.items && billData.items.length > 0) {
      onCreateBill(billData);
      setBillData({
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
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              Create New Bill
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="shad-input-label block mb-2">Patient ID</label>
              <input
                type="text"
                value={billData.patientId || ""}
                onChange={(e) =>
                  setBillData((prev) => ({
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
                value={billData.patientName || ""}
                onChange={(e) =>
                  setBillData((prev) => ({
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
                value={billData.patientPhone || ""}
                onChange={(e) =>
                  setBillData((prev) => ({
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
          <div className="border border-dark-500 rounded-2xl p-4 sm:p-6 mb-6">
            <h3 className="text-16-bold lg:text-18-bold text-white mb-4">
              Add Medications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
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
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-12-medium lg:text-14-medium transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Items List */}
            {billData.items && billData.items.length > 0 && (
              <div className="space-y-2">
                {billData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-dark-500/30 rounded-lg p-3"
                  >
                    <div className="flex-1 grid grid-cols-4 gap-4 text-12-regular lg:text-14-regular text-white">
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
          {billData.items && billData.items.length > 0 && (
            <div className="bg-dark-500/30 rounded-2xl p-4 sm:p-6 mb-6">
              <h3 className="text-16-bold lg:text-18-bold text-white mb-4">
                Bill Summary
              </h3>
              <div className="space-y-2 text-14-regular lg:text-16-regular">
                <div className="flex justify-between text-dark-700">
                  <span>Subtotal:</span>
                  <span>${billData.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-700">
                  <span>Tax (8%):</span>
                  <span>${billData.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-dark-700">
                  <span>Discount:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={billData.discount || 0}
                    onChange={(e) => {
                      const discount = parseFloat(e.target.value) || 0;
                      const { subtotal, tax, total } = calculateBillTotals(
                        billData.items || [],
                        discount
                      );
                      setBillData((prev) => ({
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
                  <div className="flex justify-between text-18-bold lg:text-20-bold text-white">
                    <span>Total:</span>
                    <span>${billData.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBill}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Create Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PharmacistBilling = ({ onBack }) => {
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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const filteredBills = bills.filter(
    (bill) =>
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateBillPDF = (bill) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("MediCura Pharmacy", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567 | Email: pharmacy@medicura.com", 20, 50);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`PHARMACY BILL - ${bill.id}`, 20, 70);

    // Patient Information
    doc.setFontSize(14);
    doc.text("Patient Information:", 20, 90);
    doc.setFontSize(12);
    doc.text(`Patient: ${bill.patientName}`, 30, 105);
    doc.text(`Patient ID: ${bill.patientId}`, 30, 115);
    doc.text(`Phone: ${bill.patientPhone}`, 30, 125);
    doc.text(`Date: ${bill.date}`, 30, 135);

    // Items
    doc.setFontSize(14);
    doc.text("Medications:", 20, 155);
    doc.setFontSize(12);

    let yPos = 170;
    bill.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.medication}`, 30, yPos);
      doc.text(
        `   Quantity: ${item.quantity} × $${item.unitPrice.toFixed(
          2
        )} = $${item.total.toFixed(2)}`,
        30,
        yPos + 10
      );
      yPos += 25;
    });

    // Totals
    doc.setFontSize(14);
    doc.text("Bill Summary:", 20, yPos + 10);
    doc.setFontSize(12);
    doc.text(`Subtotal: $${bill.subtotal.toFixed(2)}`, 30, yPos + 25);
    doc.text(`Tax (8%): $${bill.tax.toFixed(2)}`, 30, yPos + 35);
    if (bill.discount > 0) {
      doc.text(`Discount: -$${bill.discount.toFixed(2)}`, 30, yPos + 45);
    }
    doc.setFontSize(14);
    doc.text(`Total: $${bill.total.toFixed(2)}`, 30, yPos + 55);

    if (bill.paymentMethod) {
      doc.setFontSize(12);
      doc.text(`Payment Method: ${bill.paymentMethod}`, 30, yPos + 70);
    }

    doc.save(`pharmacy-bill-${bill.id}.pdf`);
  };

  const handleCreateBill = (billData) => {
    const bill = {
      id: `B${String(bills.length + 1).padStart(3, "0")}`,
      patientId:
        billData.patientId || `P${String(bills.length + 1).padStart(3, "0")}`,
      patientName: billData.patientName,
      patientPhone: billData.patientPhone || "",
      date: new Date().toISOString().split("T")[0],
      items: billData.items,
      subtotal: billData.subtotal,
      tax: billData.tax,
      discount: billData.discount || 0,
      total: billData.total,
      status: "draft",
    };

    setBills((prev) => [...prev, bill]);
    setMessage(`Bill ${bill.id} created successfully`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
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
            <span className="text-10-medium sm:text-12-medium text-green-400">
              Paid
            </span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">
              Pending
            </span>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Receipt className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">
              Draft
            </span>
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
                  <span className="text-20-bold lg:text-24-bold text-white">
                    Pharmacy Billing
                  </span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">
                    Generate and manage patient bills
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewBillModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">New Bill</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-6 lg:mb-8 ${
                messageType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">
                {message}
              </span>
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
                  <div className="text-20-bold lg:text-32-bold text-white">
                    ${totalRevenue.toFixed(0)}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    Total Revenue
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {paidCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">
                    Paid Bills
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {pendingCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">
                    Pending
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Receipt className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {draftCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">
                    Drafts
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
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
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Recent Bills
              </h2>
            </div>

            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>

                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">
                            Bill #{bill.id}
                          </h3>
                          {getStatusBadge(bill.status)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Patient:</span>{" "}
                            {bill.patientName} ({bill.patientId})
                          </div>
                          <div>
                            <span className="text-white">Date:</span>{" "}
                            {bill.date}
                          </div>
                          <div>
                            <span className="text-white">Amount:</span> $
                            {bill.total.toFixed(2)}
                          </div>
                        </div>

                        <div className="text-12-regular lg:text-14-regular text-dark-700">
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

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateBillPDF(bill)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>

                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <Print className="w-4 h-4" />
                        </button>
                      </div>

                      {bill.status === "pending" && (
                        <button
                          onClick={() => handleMarkAsPaid(bill.id, "Cash")}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <Receipt className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No bills found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No bills match your search criteria. Create a new bill to get
                  started.
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

      {/* New Bill Modal */}
      <NewBillModal
        isOpen={showNewBillModal}
        onClose={() => setShowNewBillModal(false)}
        onCreateBill={handleCreateBill}
      />
    </>
  );
};

export default PharmacistBilling;
