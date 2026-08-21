"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Receipt,
  Search,
  User,
  Calendar,
  DollarSign,
  Download,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
  Phone,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  Eye,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Trash2,
  LayoutGrid,
  List,
  ArrowLeft,
  Sparkles,
  Send,
  Building2,
} from "lucide-react";
import jsPDF from "jspdf";

// ==========================================
// 1. PROCESS PAYMENT MODAL
// ==========================================
const PaymentModal = ({ isOpen, onClose, bill, onProcessPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    if (bill) {
      setPaymentAmount(bill.patientResponsibility || bill.total);
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

  const paymentMethods = [
    { id: "credit-card", label: "Credit Card", icon: CreditCard },
    { id: "debit-card", label: "Debit Card", icon: CreditCard },
    { id: "cash", label: "Cash", icon: DollarSign },
    { id: "insurance", label: "Insurance", icon: ShieldCheck },
    { id: "check", label: "Check", icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-dark-500/60 flex items-center justify-between bg-gradient-to-r from-dark-300 to-dark-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-18-bold text-white">Process Payment</h2>
              <p className="text-12-regular text-dark-700">
                Record payment details for Bill #{bill.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-dark-500/50 hover:bg-dark-500 text-dark-700 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Card */}
          <div className="p-4 bg-gradient-to-br from-green-500/10 via-dark-300 to-dark-300 border border-green-500/30 rounded-2xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-12-medium text-green-400 uppercase tracking-wider">
                  Patient Invoice Summary
                </span>
                <h3 className="text-16-bold text-white mt-0.5">
                  {bill.patientName}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-12-medium bg-green-500/20 text-green-400 border border-green-500/30">
                {bill.id}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-500/50 text-center">
              <div className="bg-dark-400/60 p-2 rounded-xl border border-dark-500/40">
                <span className="text-10-regular text-dark-700 block">
                  Total Bill
                </span>
                <span className="text-14-bold text-white">
                  ${bill.total.toFixed(2)}
                </span>
              </div>
              <div className="bg-dark-400/60 p-2 rounded-xl border border-dark-500/40">
                <span className="text-10-regular text-dark-700 block">
                  Insurance
                </span>
                <span className="text-14-bold text-blue-400">
                  ${(bill.insuranceCovered || 0).toFixed(2)}
                </span>
              </div>
              <div className="bg-dark-400/60 p-2 rounded-xl border border-green-500/40">
                <span className="text-10-regular text-green-400 block">
                  Patient Due
                </span>
                <span className="text-14-bold text-green-400">
                  ${(bill.patientResponsibility || bill.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Payment Method Selector */}
            <div>
              <label className="text-14-medium text-dark-700 block mb-2.5">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-b from-green-500/20 to-green-600/10 border-green-500 text-white shadow-lg shadow-green-500/10"
                          : "bg-dark-300/60 border-dark-500/60 text-dark-700 hover:border-dark-500 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mb-1.5 ${
                          isSelected ? "text-green-400" : "text-dark-700"
                        }`}
                      />
                      <span className="text-12-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <label className="text-14-medium text-dark-700 block mb-2">
                Payment Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-600">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(parseFloat(e.target.value) || 0)
                  }
                  className="shad-input pl-10 w-full text-white text-16-bold bg-dark-300 border border-dark-500 focus:border-green-500 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-dark-300 hover:bg-dark-500 text-dark-700 hover:text-white py-3 px-4 rounded-xl text-14-medium transition-colors border border-dark-500/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl text-14-semibold transition-all duration-300 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CREATE NEW INVOICE MODAL
// ==========================================
const CreateInvoiceModal = ({ isOpen, onClose, onCreateInvoice }) => {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctor, setDoctor] = useState("Dr. Sarah Safari");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [insuranceCovered, setInsuranceCovered] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([
    { id: "1", description: "General Consultation", quantity: 1, unitPrice: 150 },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: (items.length + 1).toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0),
    0
  );
  const tax = subtotal * 0.08;
  const total = Math.max(0, subtotal + tax - (parseFloat(discount) || 0));
  const patientResponsibility = Math.max(0, total - (parseFloat(insuranceCovered) || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const formattedItems = items.map((item, idx) => ({
      id: (idx + 1).toString(),
      description: item.description || "Medical Service",
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
    }));

    const newBill = {
      id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
      patientId: `P${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      patientPhone: patientPhone || "+1 (555) 000-0000",
      date: new Date().toISOString().split("T")[0],
      dueDate,
      doctor,
      items: formattedItems,
      subtotal,
      tax,
      discount: Number(discount) || 0,
      total,
      status: "sent",
      insuranceCovered: Number(insuranceCovered) || 0,
      patientResponsibility,
    };

    onCreateInvoice(newBill);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300 overflow-y-auto">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-dark-500/60 flex items-center justify-between bg-gradient-to-r from-dark-300 to-dark-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-18-bold text-white">Create New Patient Invoice</h2>
              <p className="text-12-regular text-dark-700">
                Generate a billing statement for medical services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-dark-500/50 hover:bg-dark-500 text-dark-700 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-12-medium text-dark-700 block mb-1.5">
                Patient Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="shad-input w-full text-white bg-dark-300 border border-dark-500 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-12-medium text-dark-700 block mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="shad-input w-full text-white bg-dark-300 border border-dark-500 rounded-xl"
              />
            </div>
            <div>
              <label className="text-12-medium text-dark-700 block mb-1.5">
                Assigned Doctor
              </label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="shad-select-trigger w-full text-white bg-dark-300 border border-dark-500 rounded-xl"
              >
                <option value="Dr. Sarah Safari">Dr. Sarah Safari</option>
                <option value="Dr. Ava Williams">Dr. Ava Williams</option>
                <option value="Dr. Adam Smith">Dr. Adam Smith</option>
                <option value="Dr. Michael Lee">Dr. Michael Lee</option>
              </select>
            </div>
            <div>
              <label className="text-12-medium text-dark-700 block mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="shad-input w-full text-white bg-dark-300 border border-dark-500 rounded-xl"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-14-bold text-white">Line Items / Services</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-12-medium text-green-400 hover:text-green-300 flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Service
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 remove-scrollbar">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-dark-300/80 p-2.5 rounded-xl border border-dark-500/50"
                >
                  <input
                    type="text"
                    placeholder="Description (e.g. Lab Test)"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(idx, "description", e.target.value)
                    }
                    className="flex-1 bg-dark-400 border border-dark-500/60 rounded-lg px-3 py-1.5 text-12-regular text-white focus:outline-none focus:border-green-500"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", e.target.value)
                    }
                    className="w-16 bg-dark-400 border border-dark-500/60 rounded-lg px-2 py-1.5 text-12-regular text-white focus:outline-none focus:border-green-500 text-center"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price ($)"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, "unitPrice", e.target.value)
                    }
                    className="w-24 bg-dark-400 border border-dark-500/60 rounded-lg px-2.5 py-1.5 text-12-regular text-white focus:outline-none focus:border-green-500 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                    className="p-1.5 text-dark-700 hover:text-red-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown Inputs */}
          <div className="grid grid-cols-2 gap-4 bg-dark-300/50 p-4 rounded-2xl border border-dark-500/50">
            <div>
              <label className="text-12-medium text-dark-700 block mb-1">
                Discount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="shad-input w-full text-white bg-dark-400 border border-dark-500/60 rounded-xl"
              />
            </div>
            <div>
              <label className="text-12-medium text-dark-700 block mb-1">
                Insurance Covered ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={insuranceCovered}
                onChange={(e) => setInsuranceCovered(e.target.value)}
                className="shad-input w-full text-white bg-dark-400 border border-dark-500/60 rounded-xl"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center pt-2 text-14-regular text-dark-700 border-t border-dark-500/50">
            <div>
              Subtotal: <span className="text-white">${subtotal.toFixed(2)}</span> | Tax (8%):{" "}
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-12-regular text-dark-700 block">
                Total Patient Responsibility
              </span>
              <span className="text-20-bold text-green-400">
                ${patientResponsibility.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-300 hover:bg-dark-500 text-dark-700 hover:text-white py-3 px-4 rounded-xl text-14-medium transition-colors border border-dark-500/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-xl text-14-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 3. DIGITAL INVOICE PREVIEW MODAL
// ==========================================
const ViewInvoiceModal = ({ isOpen, onClose, bill, onDownloadPDF, onProcessPayment }) => {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300 overflow-y-auto">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-dark-500/60 flex items-center justify-between bg-gradient-to-r from-dark-300 to-dark-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-16-bold sm:text-18-bold text-white">
                Invoice Details #{bill.id}
              </h2>
              <p className="text-12-regular text-dark-700">Digital Billing Receipt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownloadPDF(bill)}
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-xl text-12-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-dark-500/50 hover:bg-dark-500 text-dark-700 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header branding */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-dark-500/50 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-white" />
                </div>
                <span className="text-20-bold text-white tracking-wide">
                  MediCura
                </span>
              </div>
              <p className="text-12-regular text-dark-700">Medical Center Billing Service</p>
              <p className="text-12-regular text-dark-700">
                123 Healthcare Drive, Medical City, MC 12345
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-14-bold text-green-400 uppercase tracking-widest block">
                INVOICE
              </span>
              <span className="text-16-bold text-white block mt-0.5">
                #{bill.id}
              </span>
              <span className="text-12-regular text-dark-700 block">
                Issue Date: {bill.date}
              </span>
              <span className="text-12-regular font-medium text-amber-400 block mt-1">
                Due Date: {bill.dueDate}
              </span>
            </div>
          </div>

          {/* Patient info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-dark-300/60 p-4 rounded-2xl border border-dark-500/40">
            <div>
              <span className="text-10-medium uppercase text-dark-700 tracking-wider block mb-1">
                Billed To
              </span>
              <h4 className="text-16-bold text-white">{bill.patientName}</h4>
              <p className="text-12-regular text-dark-700">
                Patient ID: <span className="text-white">{bill.patientId}</span>
              </p>
              <p className="text-12-regular text-dark-700">
                Phone: <span className="text-white">{bill.patientPhone}</span>
              </p>
            </div>
            <div>
              <span className="text-10-medium uppercase text-dark-700 tracking-wider block mb-1">
                Medical Provider
              </span>
              <h4 className="text-16-bold text-white">{bill.doctor}</h4>
              <p className="text-12-regular text-dark-700">Department: General Health</p>
              <p className="text-12-regular text-dark-700">
                Status:{" "}
                <span
                  className={`capitalize font-semibold ${
                    bill.status === "paid"
                      ? "text-green-400"
                      : bill.status === "overdue"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {bill.status}
                </span>
              </p>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <span className="text-12-bold text-white uppercase tracking-wider block mb-3">
              Rendered Services
            </span>
            <div className="border border-dark-500/50 rounded-2xl overflow-hidden bg-dark-300/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-500/60 bg-dark-300/80 text-12-semibold text-dark-700">
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-500/40 text-14-regular text-white">
                  {bill.items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-center text-dark-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-dark-700">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-4 border-t border-dark-500/50 gap-4">
            <div className="text-12-regular text-dark-700 max-w-xs">
              <p className="mb-1">
                Thank you for choosing MediCura. Payments can be processed via cash,
                credit card, or insurance billing.
              </p>
              {bill.paymentMethod && (
                <p className="text-green-400 font-medium">
                  ✓ Paid via {bill.paymentMethod} on {bill.paidDate}
                </p>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-dark-300/60 p-4 rounded-2xl border border-dark-500/40">
              <div className="flex justify-between text-12-regular text-dark-700">
                <span>Subtotal:</span>
                <span className="text-white">${bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-12-regular text-dark-700">
                <span>Tax (8%):</span>
                <span className="text-white">${bill.tax.toFixed(2)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-12-regular text-green-400">
                  <span>Discount:</span>
                  <span>-${bill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-12-regular text-blue-400">
                <span>Insurance Coverage:</span>
                <span>-${bill.insuranceCovered.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-16-bold pt-2 border-t border-dark-500/50">
                <span className="text-white">Patient Due:</span>
                <span className="text-green-400">
                  ${bill.patientResponsibility.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onDownloadPDF(bill)}
              className="flex-1 bg-dark-300 hover:bg-dark-500 text-white py-3 px-4 rounded-xl text-14-medium transition-colors border border-dark-500/60 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-blue-400" />
              Download PDF
            </button>
            {bill.status !== "paid" && (
              <button
                onClick={() => {
                  onClose();
                  onProcessPayment(bill);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl text-14-semibold transition-all duration-300 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Process Payment Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN RECEPTIONIST BILLING DASHBOARD
// ==========================================
const ReceptionistBilling = () => {
  const onBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  const [bills, setBills] = useState([
    {
      id: "INV-2024-001",
      patientId: "P001",
      patientName: "John Smith",
      patientPhone: "+1 (555) 123-4567",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      doctor: "Dr. Sarah Safari",
      items: [
        {
          id: "1",
          description: "General Consultation",
          quantity: 1,
          unitPrice: 150.0,
          total: 150.0,
        },
        {
          id: "2",
          description: "Blood Test - Complete Panel",
          quantity: 1,
          unitPrice: 85.0,
          total: 85.0,
        },
      ],
      subtotal: 235.0,
      tax: 18.8,
      discount: 10.0,
      total: 243.8,
      status: "sent",
      insuranceCovered: 195.04,
      patientResponsibility: 48.76,
    },
    {
      id: "INV-2024-002",
      patientId: "P002",
      patientName: "Emily Johnson",
      patientPhone: "+1 (555) 234-5678",
      date: "2024-01-14",
      dueDate: "2024-02-14",
      doctor: "Dr. Ava Williams",
      items: [
        {
          id: "1",
          description: "Cardiology Consultation",
          quantity: 1,
          unitPrice: 200.0,
          total: 200.0,
        },
        {
          id: "2",
          description: "ECG Test",
          quantity: 1,
          unitPrice: 120.0,
          total: 120.0,
        },
      ],
      subtotal: 320.0,
      tax: 25.6,
      discount: 0,
      total: 345.6,
      status: "paid",
      paymentMethod: "Credit Card",
      paidDate: "2024-01-15",
      insuranceCovered: 276.76,
      patientResponsibility: 68.84,
    },
    {
      id: "INV-2024-003",
      patientId: "P003",
      patientName: "Michael Brown",
      patientPhone: "+1 (555) 345-6789",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      doctor: "Dr. Adam Smith",
      items: [
        {
          id: "1",
          description: "Emergency Consultation",
          quantity: 1,
          unitPrice: 250.0,
          total: 250.0,
        },
        {
          id: "2",
          description: "X-Ray Chest",
          quantity: 1,
          unitPrice: 150.0,
          total: 150.0,
        },
      ],
      subtotal: 400.0,
      tax: 32.0,
      discount: 20.0,
      total: 412.0,
      status: "overdue",
      insuranceCovered: 329.6,
      patientResponsibility: 82.4,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [expandedBillId, setExpandedBillId] = useState(null);

  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const triggerToast = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3500);
  };

  const handleProcessPayment = (billId, paymentMethod, amount) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: "paid",
              paymentMethod,
              paidDate: new Date().toISOString().split("T")[0],
            }
          : bill
      )
    );

    const bill = bills.find((b) => b.id === billId);
    triggerToast(
      `Payment of $${amount.toFixed(2)} processed for ${bill?.patientName}`
    );
  };

  const handleCreateInvoice = (newBill) => {
    setBills([newBill, ...bills]);
    triggerToast(`Invoice #${newBill.id} created successfully!`);
  };

  const generateBillPDF = (bill) => {
    try {
      const doc = new jsPDF();

      // Branding Header
      doc.setFillColor(13, 15, 16);
      doc.rect(0, 0, 210, 40, "F");

      doc.setFontSize(22);
      doc.setTextColor(36, 174, 124);
      doc.text("MediCura Medical Center", 20, 22);

      doc.setFontSize(10);
      doc.setTextColor(171, 184, 196);
      doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 30);
      doc.text("Phone: (555) 123-4567 | Billing Dept", 130, 30);

      // Title & Badge
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(`MEDICAL INVOICE STATEMENT`, 20, 52);

      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Invoice ID: ${bill.id}`, 20, 60);
      doc.text(`Issue Date: ${bill.date}`, 140, 60);
      doc.text(`Due Date: ${bill.dueDate}`, 140, 66);

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 72, 190, 72);

      // Patient Info Section
      doc.setFontSize(12);
      doc.setTextColor(36, 174, 124);
      doc.text("Patient & Provider Information", 20, 82);

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Patient Name: ${bill.patientName}`, 20, 92);
      doc.text(`Patient ID: ${bill.patientId}`, 20, 98);
      doc.text(`Phone: ${bill.patientPhone}`, 20, 104);

      doc.text(`Attending Doctor: ${bill.doctor}`, 120, 92);
      doc.text(`Status: ${bill.status.toUpperCase()}`, 120, 98);

      // Items Table Header
      let yPos = 120;
      doc.setFillColor(240, 244, 248);
      doc.rect(20, yPos - 6, 170, 10, "F");

      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text("Item / Description", 25, yPos);
      doc.text("Qty", 110, yPos);
      doc.text("Unit Price", 135, yPos);
      doc.text("Total", 170, yPos);

      yPos += 10;
      bill.items.forEach((item) => {
        doc.text(`${item.description}`, 25, yPos);
        doc.text(`${item.quantity}`, 112, yPos);
        doc.text(`$${item.unitPrice.toFixed(2)}`, 135, yPos);
        doc.text(`$${item.total.toFixed(2)}`, 170, yPos);
        yPos += 8;
      });

      // Line divider
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 12;

      // Summary Box
      doc.setFontSize(10);
      doc.text(`Subtotal:`, 125, yPos);
      doc.text(`$${bill.subtotal.toFixed(2)}`, 170, yPos);
      yPos += 6;

      doc.text(`Tax (8%):`, 125, yPos);
      doc.text(`$${bill.tax.toFixed(2)}`, 170, yPos);
      yPos += 6;

      if (bill.discount > 0) {
        doc.text(`Discount:`, 125, yPos);
        doc.text(`-$${bill.discount.toFixed(2)}`, 170, yPos);
        yPos += 6;
      }

      doc.text(`Insurance Coverage:`, 125, yPos);
      doc.text(`-$${bill.insuranceCovered.toFixed(2)}`, 170, yPos);
      yPos += 8;

      doc.setFontSize(12);
      doc.setTextColor(36, 174, 124);
      doc.text(`Patient Responsibility:`, 115, yPos);
      doc.text(`$${bill.patientResponsibility.toFixed(2)}`, 170, yPos);

      if (bill.paymentMethod) {
        yPos += 14;
        doc.setFontSize(10);
        doc.setTextColor(40, 160, 100);
        doc.text(
          `Payment Status: Paid via ${bill.paymentMethod} on ${bill.paidDate}`,
          20,
          yPos
        );
      }

      doc.save(`MediCura-Invoice-${bill.id}.pdf`);
      triggerToast(`PDF Invoice for ${bill.patientName} downloaded`);
    } catch (err) {
      console.error("PDF error:", err);
      triggerToast("Failed to generate PDF", "error");
    }
  };

  const toggleExpand = (id) => {
    setExpandedBillId(expandedBillId === id ? null : id);
  };

  // Filter & Sort Logic
  const filteredBills = bills
    .filter((bill) => {
      const matchesSearch =
        bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.doctor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || bill.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "highest") return b.total - a.total;
      if (sortBy === "due") return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

  // Telemetry Calculations
  const paidBills = bills.filter((b) => b.status === "paid");
  const pendingBills = bills.filter((b) => b.status === "sent");
  const overdueBills = bills.filter((b) => b.status === "overdue");

  const totalRevenue = paidBills.reduce((sum, b) => sum + b.total, 0);
  const totalPendingAmount = pendingBills.reduce(
    (sum, b) => sum + b.patientResponsibility,
    0
  );
  const totalOverdueAmount = overdueBills.reduce(
    (sum, b) => sum + b.patientResponsibility,
    0
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Receipt className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-12-medium text-blue-400">Draft</span>
          </div>
        );
      case "sent":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-12-medium text-yellow-400">Pending</span>
          </div>
        );
      case "paid":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            <span className="text-12-medium text-green-400">Paid</span>
          </div>
        );
      case "overdue":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-12-medium text-red-400">Overdue</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-300 to-dark-400 text-white selection:bg-green-500 selection:text-white">
        {/* Sticky Glass Navbar */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-30 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left Brand info */}
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 rounded-xl bg-dark-400/80 hover:bg-dark-500 text-dark-700 hover:text-white border border-dark-500/60 transition-all group"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                    <Receipt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-18-bold lg:text-22-bold text-white tracking-tight flex items-center gap-2">
                      Billing & Payments
                      <span className="text-10-medium bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                        Live Portal
                      </span>
                    </h1>
                    <p className="text-12-regular text-dark-700">
                      Manage patient invoices, insurance coverage, and collections
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="bg-dark-400/80 p-1 rounded-xl border border-dark-500/60 flex items-center gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                        : "text-dark-700 hover:text-white"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "table"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                        : "text-dark-700 hover:text-white"
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-14-semibold transition-all duration-300 shadow-lg shadow-green-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Container */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
          {/* Notification Alert Banner */}
          {message && (
            <div
              className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md animate-in slide-in-from-top-4 duration-300 shadow-xl ${
                messageType === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-green-500/10 border-green-500/30 text-green-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {messageType === "error" ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-14-medium">{message}</span>
              </div>
              <button
                onClick={() => setMessage("")}
                className="text-dark-700 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Telemetry KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Total Revenue */}
            <div className="relative group bg-gradient-to-br from-green-500/15 via-dark-300/60 to-dark-400/80 backdrop-blur-xl border border-green-500/25 hover:border-green-500/50 rounded-3xl p-5 lg:p-6 transition-all duration-300 shadow-lg hover:shadow-green-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-24 h-24 text-green-400" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-12-medium text-green-400 uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <span className="text-10-regular text-dark-700">
                    Cleared collections
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-28-bold lg:text-32-bold text-white tracking-tight">
                  ${totalRevenue.toFixed(0)}
                </div>
                <div className="flex items-center gap-1 text-12-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{paidBills.length} Paid</span>
                </div>
              </div>
            </div>

            {/* Paid Bills */}
            <div className="relative group bg-gradient-to-br from-blue-500/15 via-dark-300/60 to-dark-400/80 backdrop-blur-xl border border-blue-500/25 hover:border-blue-500/50 rounded-3xl p-5 lg:p-6 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle className="w-24 h-24 text-blue-400" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-12-medium text-blue-400 uppercase tracking-wider block">
                    Paid Invoices
                  </span>
                  <span className="text-10-regular text-dark-700">
                    Fully settled bills
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-28-bold lg:text-32-bold text-white tracking-tight">
                  {paidBills.length}
                </div>
                <span className="text-12-medium text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {((paidBills.length / (bills.length || 1)) * 100).toFixed(0)}% Rate
                </span>
              </div>
            </div>

            {/* Pending Payments */}
            <div className="relative group bg-gradient-to-br from-amber-500/15 via-dark-300/60 to-dark-400/80 backdrop-blur-xl border border-amber-500/25 hover:border-amber-500/50 rounded-3xl p-5 lg:p-6 transition-all duration-300 shadow-lg hover:shadow-amber-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock className="w-24 h-24 text-amber-400" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-12-medium text-amber-400 uppercase tracking-wider block">
                    Pending Due
                  </span>
                  <span className="text-10-regular text-dark-700">
                    Awaiting payment
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-28-bold lg:text-32-bold text-white tracking-tight">
                  ${totalPendingAmount.toFixed(0)}
                </div>
                <span className="text-12-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {pendingBills.length} Invoices
                </span>
              </div>
            </div>

            {/* Overdue Alerts */}
            <div className="relative group bg-gradient-to-br from-red-500/15 via-dark-300/60 to-dark-400/80 backdrop-blur-xl border border-red-500/25 hover:border-red-500/50 rounded-3xl p-5 lg:p-6 transition-all duration-300 shadow-lg hover:shadow-red-500/10 overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle className="w-24 h-24 text-red-400" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-12-medium text-red-400 uppercase tracking-wider block">
                    Overdue Bills
                  </span>
                  <span className="text-10-regular text-dark-700">
                    Past due date
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-28-bold lg:text-32-bold text-white tracking-tight">
                  ${totalOverdueAmount.toFixed(0)}
                </div>
                <span className="text-12-medium text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                  {overdueBills.length} Action Needed
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Filters & Controls Bar */}
          <div className="bg-dark-400/60 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Status Filter Pill Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto remove-scrollbar p-1 bg-dark-300/80 rounded-2xl border border-dark-500/60">
                {[
                  { id: "all", label: "All Bills", count: bills.length },
                  { id: "sent", label: "Pending", count: pendingBills.length },
                  { id: "paid", label: "Paid", count: paidBills.length },
                  { id: "overdue", label: "Overdue", count: overdueBills.length },
                ].map((tab) => {
                  const isActive = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-12-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                          : "text-dark-700 hover:text-white hover:bg-dark-400/50"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 text-10-bold rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-dark-500/60 text-dark-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort Input Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-dark-600">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patient, invoice #, or doctor..."
                    className="shad-input pl-10 pr-8 w-full text-white text-14-regular bg-dark-300/80 border border-dark-500/80 rounded-xl focus:border-green-500 transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-600 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-44">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="shad-select-trigger w-full text-white text-12-medium bg-dark-300/80 border border-dark-500/80 rounded-xl cursor-pointer"
                    >
                      <option value="newest">Sort: Newest First</option>
                      <option value="highest">Sort: Highest Amount</option>
                      <option value="due">Sort: Due Soonest</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bills List / Grid Section */}
          <div className="bg-dark-400/40 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Receipt className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-18-bold lg:text-22-bold text-white tracking-tight">
                    Patient Statements
                  </h2>
                  <p className="text-12-regular text-dark-700">
                    Showing {filteredBills.length} matching billing record(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                {filteredBills.map((bill) => {
                  const isExpanded = expandedBillId === bill.id;
                  const patientRespPct = Math.min(
                    100,
                    Math.max(
                      0,
                      ((bill.patientResponsibility / (bill.total || 1)) * 100)
                    )
                  );

                  return (
                    <div
                      key={bill.id}
                      className="group bg-gradient-to-r from-dark-300/80 via-dark-400/60 to-dark-300/80 backdrop-blur-md border border-dark-500/60 hover:border-green-500/40 rounded-3xl p-5 lg:p-6 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left Side: Avatar & Details */}
                        <div className="flex items-start gap-4 lg:gap-5 flex-1 min-w-0">
                          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-tr from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <User className="w-6 h-6 text-green-400" />
                          </div>

                          <div className="space-y-3 flex-1 min-w-0">
                            {/* Invoice Header Line */}
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-16-bold lg:text-18-bold text-white tracking-tight">
                                {bill.patientName}
                              </h3>
                              <span className="text-12-medium text-dark-700 bg-dark-500/40 px-2.5 py-0.5 rounded-lg border border-dark-500/50">
                                #{bill.id}
                              </span>
                              {getStatusBadge(bill.status)}
                            </div>

                            {/* Info Meta Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-12-regular text-dark-700">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-dark-600" />
                                <span>Date: {bill.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-dark-600" />
                                <span>Doc: {bill.doctor}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                                <span>Due: {bill.dueDate}</span>
                              </div>
                            </div>

                            {/* Mini Coverage Visual Ratio Bar */}
                            <div className="space-y-1.5 pt-1 max-w-md">
                              <div className="flex justify-between text-10-medium">
                                <span className="text-blue-400">
                                  Insurance (${(bill.insuranceCovered || 0).toFixed(2)})
                                </span>
                                <span className="text-green-400">
                                  Patient (${bill.patientResponsibility.toFixed(2)})
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-dark-500/50 rounded-full overflow-hidden flex">
                                <div
                                  style={{ width: `${100 - patientRespPct}%` }}
                                  className="bg-blue-500 h-full transition-all"
                                  title="Insurance Portion"
                                />
                                <div
                                  style={{ width: `${patientRespPct}%` }}
                                  className="bg-green-500 h-full transition-all"
                                  title="Patient Portion"
                                />
                              </div>
                            </div>

                            {/* Additional Payment Note */}
                            {bill.status === "paid" && bill.paymentMethod && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-xl text-12-medium text-green-400">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>
                                  Paid via {bill.paymentMethod} on {bill.paidDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle: Amount Breakdown */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 border-dark-500/50 pt-3 lg:pt-0 lg:pl-6 lg:border-l lg:border-dark-500/50 flex-shrink-0 gap-2">
                          <div className="text-left lg:text-right">
                            <span className="text-10-medium uppercase text-dark-700 block tracking-wider">
                              Total Invoice
                            </span>
                            <span className="text-20-bold text-white block">
                              ${bill.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-10-medium uppercase text-green-400 block tracking-wider">
                              Patient Due
                            </span>
                            <span className="text-18-bold text-green-400 block">
                              ${bill.patientResponsibility.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Right: Quick Actions Toolbar */}
                        <div className="flex items-center lg:flex-col justify-end gap-2 border-t lg:border-t-0 border-dark-500/50 pt-3 lg:pt-0 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            {/* Accordion Line-Items Toggle */}
                            <button
                              onClick={() => toggleExpand(bill.id)}
                              className={`px-3 py-2 rounded-xl text-12-medium flex items-center gap-1.5 transition-all border ${
                                isExpanded
                                  ? "bg-dark-500 text-white border-dark-500"
                                  : "bg-dark-300 hover:bg-dark-500 text-dark-700 hover:text-white border-dark-500/60"
                              }`}
                              title="View line items"
                            >
                              <FileText className="w-4 h-4 text-dark-700" />
                              <span className="hidden sm:inline">Items</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* View Full Digital Receipt Modal */}
                            <button
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowInvoiceModal(true);
                              }}
                              className="p-2 bg-dark-300 hover:bg-dark-500 text-dark-700 hover:text-white rounded-xl border border-dark-500/60 transition-colors"
                              title="View Digital Invoice"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* PDF Download */}
                            <button
                              onClick={() => generateBillPDF(bill)}
                              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 p-2 lg:px-3 rounded-xl text-12-medium transition-all flex items-center gap-1.5"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">PDF</span>
                            </button>
                          </div>

                          {/* Process Payment Button */}
                          {bill.status !== "paid" && (
                            <button
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowPaymentModal(true);
                              }}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-12-semibold transition-all duration-300 shadow-md shadow-green-500/20 flex items-center justify-center gap-2 hover:scale-[1.02]"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Process Payment</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Line-Items Accordion Drawer */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-dark-500/50 bg-dark-400/60 p-4 rounded-2xl animate-in fade-in duration-200">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-12-bold text-white uppercase tracking-wider flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-green-400" />
                              Itemized Medical Services
                            </span>
                            <span className="text-12-regular text-dark-700">
                              {bill.items.length} Service Line(s)
                            </span>
                          </div>

                          <div className="divide-y divide-dark-500/40 text-12-regular">
                            {bill.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="py-2 flex justify-between items-center text-white"
                              >
                                <div>
                                  <span className="font-medium text-white">
                                    {item.description}
                                  </span>
                                  <span className="text-dark-700 ml-2">
                                    (Qty: {item.quantity} × ${item.unitPrice.toFixed(2)})
                                  </span>
                                </div>
                                <span className="font-semibold text-green-400">
                                  ${item.total.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <div className="overflow-x-auto border border-dark-500/60 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark-300/80 border-b border-dark-500/60 text-12-semibold text-dark-700">
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Patient</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-right">Patient Due</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-500/40 text-14-regular text-white bg-dark-400/30">
                    {filteredBills.map((bill) => (
                      <tr
                        key={bill.id}
                        className="hover:bg-dark-300/50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-green-400">
                          #{bill.id}
                        </td>
                        <td className="p-4 font-medium">{bill.patientName}</td>
                        <td className="p-4 text-dark-700 text-12-regular">
                          {bill.date}
                        </td>
                        <td className="p-4 text-dark-700 text-12-regular">
                          {bill.doctor}
                        </td>
                        <td className="p-4 text-right font-medium">
                          ${bill.total.toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-bold text-green-400">
                          ${bill.patientResponsibility.toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          {getStatusBadge(bill.status)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedBill(bill);
                                setShowInvoiceModal(true);
                              }}
                              className="p-1.5 text-dark-700 hover:text-white bg-dark-300 rounded-lg border border-dark-500/60"
                              title="View Digital Invoice"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => generateBillPDF(bill)}
                              className="p-1.5 text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:bg-blue-500/20"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {bill.status !== "paid" && (
                              <button
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setShowPaymentModal(true);
                                }}
                                className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-12-medium rounded-lg shadow-sm"
                              >
                                Pay
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {filteredBills.length === 0 && (
              <div className="text-center py-16 lg:py-24">
                <div className="w-20 h-20 bg-gradient-to-tr from-green-500/10 to-emerald-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                  <Receipt className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-20-bold text-white mb-2">No invoices found</h3>
                <p className="text-14-regular text-dark-700 max-w-sm mx-auto mb-6">
                  No billing statements match your current search or status filter.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="bg-dark-300 hover:bg-dark-500 text-white px-4 py-2 rounded-xl text-14-medium border border-dark-500/60 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Process Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bill={selectedBill}
        onProcessPayment={handleProcessPayment}
      />

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateInvoice={handleCreateInvoice}
      />

      {/* Digital Invoice Preview Modal */}
      <ViewInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        bill={selectedBill}
        onDownloadPDF={generateBillPDF}
        onProcessPayment={(b) => {
          setSelectedBill(b);
          setShowPaymentModal(true);
        }}
      />
    </>
  );
};

export default ReceptionistBilling;
