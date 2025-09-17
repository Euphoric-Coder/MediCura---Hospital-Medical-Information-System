import React, { useState } from "react";
import {
  Plus,
  TestTube,
  Search,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Edit,
  X,
} from "lucide-react";
import jsPDF from "jspdf";

const availableTests = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    category: "Hematology",
    cost: 85,
  },
  { id: "2", name: "Basic Metabolic Panel", category: "Chemistry", cost: 65 },
  { id: "3", name: "Lipid Profile", category: "Chemistry", cost: 75 },
  {
    id: "4",
    name: "Thyroid Function Tests",
    category: "Endocrinology",
    cost: 120,
  },
  { id: "5", name: "Urinalysis", category: "Urology", cost: 45 },
  { id: "6", name: "Chest X-Ray", category: "Radiology", cost: 150 },
  { id: "7", name: "ECG", category: "Cardiology", cost: 100 },
  { id: "8", name: "Echocardiogram", category: "Cardiology", cost: 300 },
  { id: "9", name: "CT Scan - Head", category: "Radiology", cost: 800 },
  { id: "10", name: "MRI - Brain", category: "Radiology", cost: 1200 },
];

const patients = [
  { id: "P001", name: "John Smith" },
  { id: "P002", name: "Emily Johnson" },
  { id: "P003", name: "Michael Brown" },
  { id: "P004", name: "Sarah Davis" },
];

const NewLabOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [orderData, setOrderData] = useState({
    patientId: "",
    patientName: "",
    tests: [],
    priority: "routine",
    reason: "",
    notes: "",
  });

  const handleTestToggle = (testId) => {
    setOrderData((prev) => ({
      ...prev,
      tests: prev.tests.includes(testId)
        ? prev.tests.filter((id) => id !== testId)
        : [...prev.tests, testId],
    }));
  };

  const handlePatientSelect = (patient) => {
    setOrderData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(orderData);
    setOrderData({
      patientId: "",
      patientName: "",
      tests: [],
      priority: "routine",
      reason: "",
      notes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              Order Lab Tests
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <div>
              <label className="shad-input-label block mb-2">
                Select Patient
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => handlePatientSelect(patient)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                      orderData.patientId === patient.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-dark-500 hover:border-dark-400 bg-dark-400/30"
                    }`}
                  >
                    <div className="text-14-medium text-white">
                      {patient.name}
                    </div>
                    <div className="text-12-regular text-dark-700">
                      {patient.id}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Selection */}
            <div>
              <label className="shad-input-label block mb-2">
                Select Tests
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {availableTests.map((test) => (
                  <label
                    key={test.id}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-green-500/10 transition-colors border border-dark-500"
                  >
                    <input
                      type="checkbox"
                      checked={orderData.tests.includes(test.id)}
                      onChange={() => handleTestToggle(test.id)}
                      className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="text-14-medium text-white">
                        {test.name}
                      </div>
                      <div className="text-12-regular text-green-400">
                        {test.category} - ${test.cost}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="shad-input-label block mb-2">Priority</label>
              <div className="flex gap-4">
                {["routine", "urgent", "stat"].map((priority) => (
                  <label key={priority} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={orderData.priority === priority}
                      onChange={(e) =>
                        setOrderData((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-green-500 bg-dark-400 border-dark-500 focus:ring-green-500"
                    />
                    <span className="text-14-regular text-white capitalize">
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="shad-input-label block mb-2">
                Reason for Tests
              </label>
              <textarea
                value={orderData.reason}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Clinical indication for lab tests..."
                className="shad-textArea w-full text-white min-h-[100px] resize-none"
                rows={4}
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="shad-input-label block mb-2">
                Additional Notes
              </label>
              <textarea
                value={orderData.notes}
                onChange={(e) =>
                  setOrderData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any additional instructions..."
                className="shad-textArea w-full text-white min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!orderData.patientId || orderData.tests.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Order Tests
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DoctorLabOrders = ({ onBack }) => {
  const [labOrders, setLabOrders] = useState([
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P001",
      testName: "Complete Blood Count (CBC)",
      category: "Hematology",
      orderedDate: "2024-01-15",
      collectionDate: "2024-01-16",
      resultDate: "2024-01-17",
      status: "completed",
      priority: "routine",
      cost: 85,
      lab: "MediCura Laboratory",
      reason: "Annual physical examination",
      results: [
        {
          parameter: "White Blood Cells",
          value: "7.2",
          unit: "K/uL",
          normalRange: "4.0-11.0",
          status: "normal",
        },
        {
          parameter: "Red Blood Cells",
          value: "4.8",
          unit: "M/uL",
          normalRange: "4.2-5.4",
          status: "normal",
        },
        {
          parameter: "Hemoglobin",
          value: "14.5",
          unit: "g/dL",
          normalRange: "12.0-16.0",
          status: "normal",
        },
      ],
      notes: "All parameters within normal limits",
    },
    {
      id: "2",
      patientName: "Emily Johnson",
      patientId: "P002",
      testName: "Lipid Profile",
      category: "Chemistry",
      orderedDate: "2024-01-14",
      collectionDate: "2024-01-15",
      status: "in-progress",
      priority: "routine",
      cost: 75,
      lab: "MediCura Laboratory",
      reason: "Cardiovascular risk assessment",
    },
    {
      id: "3",
      patientName: "Michael Brown",
      patientId: "P003",
      testName: "Chest X-Ray",
      category: "Radiology",
      orderedDate: "2024-01-16",
      status: "ordered",
      priority: "urgent",
      cost: 150,
      lab: "Radiology Department",
      reason: "Chest pain evaluation",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const filteredOrders = labOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const generateLabOrderPDF = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("MediCura Medical Center", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567 | Email: lab@medicura.com", 20, 50);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("LABORATORY ORDER", 20, 70);

    // Doctor Information
    doc.setFontSize(14);
    doc.text("Ordering Physician:", 20, 90);
    doc.setFontSize(12);
    doc.text("Dr. Sarah Safari, MD", 30, 105);
    doc.text("General Medicine", 30, 115);

    // Patient Information
    doc.setFontSize(14);
    doc.text("Patient Information:", 20, 135);
    doc.setFontSize(12);
    doc.text(`Patient: ${order.patientName}`, 30, 150);
    doc.text(`Patient ID: ${order.patientId}`, 30, 160);
    doc.text(`Order Date: ${order.orderedDate}`, 30, 170);

    // Test Information
    doc.setFontSize(14);
    doc.text("Test Information:", 20, 190);
    doc.setFontSize(12);
    doc.text(`Test Name: ${order.testName}`, 30, 205);
    doc.text(`Category: ${order.category}`, 30, 215);
    doc.text(`Priority: ${order.priority.toUpperCase()}`, 30, 225);
    doc.text(`Cost: $${order.cost.toFixed(2)}`, 30, 235);
    doc.text(`Laboratory: ${order.lab}`, 30, 245);

    // Clinical Information
    doc.setFontSize(14);
    doc.text("Clinical Information:", 20, 265);
    doc.setFontSize(12);
    doc.text(`Reason: ${order.reason}`, 30, 280);

    if (order.notes) {
      const noteLines = doc.splitTextToSize(order.notes, 160);
      doc.text(noteLines, 30, 295);
    }

    doc.save(
      `lab-order-${order.testName.toLowerCase().replace(/\s+/g, "-")}-${
        order.id
      }.pdf`
    );
  };

  const handleNewOrder = (orderData) => {
    const selectedTests = availableTests.filter((test) =>
      orderData.tests.includes(test.id)
    );

    selectedTests.forEach((test, index) => {
      const newOrder = {
        id: (labOrders.length + index + 1).toString(),
        patientName: orderData.patientName,
        patientId: orderData.patientId,
        testName: test.name,
        category: test.category,
        orderedDate: new Date().toISOString().split("T")[0],
        status: "ordered",
        priority: orderData.priority,
        cost: test.cost,
        lab:
          test.category === "Radiology"
            ? "Radiology Department"
            : "MediCura Laboratory",
        reason: orderData.reason,
        notes: orderData.notes,
      };

      setLabOrders((prev) => [...prev, newOrder]);
    });

    setMessage(
      `${selectedTests.length} lab test(s) ordered for ${orderData.patientName}`
    );
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const getStatusBadge = (status, priority) => {
    const baseClasses =
      "flex items-center gap-2 px-3 py-1 rounded-full text-10-medium sm:text-12-medium";

    if (priority === "stat") {
      return (
        <div
          className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span className="text-red-400">STAT</span>
        </div>
      );
    }

    switch (status) {
      case "ordered":
        return (
          <div
            className={`${baseClasses} ${
              priority === "urgent"
                ? "bg-yellow-500/20 border border-yellow-500/30"
                : "bg-blue-500/20 border border-blue-500/30"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span
              className={
                priority === "urgent" ? "text-yellow-400" : "text-blue-400"
              }
            >
              {priority === "urgent" ? "Urgent Ordered" : "Ordered"}
            </span>
          </div>
        );
      case "collected":
        return (
          <div
            className={`${baseClasses} bg-purple-500/20 border border-purple-500/30`}
          >
            <TestTube className="w-3 h-3" />
            <span className="text-purple-400">Collected</span>
          </div>
        );
      case "in-progress":
        return (
          <div
            className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}
          >
            <Clock className="w-3 h-3" />
            <span className="text-blue-400">In Progress</span>
          </div>
        );
      case "completed":
        return (
          <div
            className={`${baseClasses} bg-green-500/20 border border-green-500/30`}
          >
            <CheckCircle className="w-3 h-3" />
            <span className="text-green-400">Completed</span>
          </div>
        );
      case "cancelled":
        return (
          <div
            className={`${baseClasses} bg-red-500/20 border border-red-500/30`}
          >
            <X className="w-3 h-3" />
            <span className="text-red-400">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const orderedCount = labOrders.filter((o) => o.status === "ordered").length;
  const completedCount = labOrders.filter(
    (o) => o.status === "completed"
  ).length;
  const urgentCount = labOrders.filter(
    (o) => o.priority === "urgent" || o.priority === "stat"
  ).length;
  const totalCost = labOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.cost, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TestTube className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">
                    Lab Orders
                  </span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">
                    Order and track lab tests
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Order Tests</span>
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
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TestTube className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {orderedCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">
                    Ordered
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {completedCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    Completed
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {urgentCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">
                    Urgent
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    ${totalCost.toFixed(0)}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">
                    Revenue
                  </div>
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
                  placeholder="Search lab orders..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="shad-select-trigger text-white w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="ordered">Ordered</option>
                <option value="collected">Collected</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Lab Orders List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TestTube className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Lab Test Orders
              </h2>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <TestTube className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>

                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">
                            {order.testName}
                          </h3>
                          {getStatusBadge(order.status, order.priority)}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Patient:</span>{" "}
                            {order.patientName}
                          </div>
                          <div>
                            <span className="text-white">Category:</span>{" "}
                            {order.category}
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-white">Cost:</span> $
                            {order.cost}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Ordered:</span>{" "}
                            {order.orderedDate}
                          </div>
                          {order.collectionDate && (
                            <div>
                              <span className="text-white">Collected:</span>{" "}
                              {order.collectionDate}
                            </div>
                          )}
                          {order.resultDate && (
                            <div>
                              <span className="text-white">Result:</span>{" "}
                              {order.resultDate}
                            </div>
                          )}
                        </div>

                        <div className="bg-dark-500/30 rounded-lg px-3 py-2">
                          <p className="text-10-regular lg:text-12-regular text-dark-600">
                            <span className="text-white">Reason:</span>{" "}
                            {order.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => generateLabOrderPDF(order)}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>

                        {order.status === "completed" && order.results && (
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Results</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <TestTube className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No lab orders found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No lab orders match your search criteria. Try adjusting your
                  filters.
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

      {/* New Order Modal */}
      <NewLabOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onSubmit={handleNewOrder}
      />
    </>
  );
};

export default DoctorLabOrders;
