import React, { useState, useEffect } from "react";
import {
  Receipt,
  Search,
  DollarSign,
  Download,
  Printer as Print,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";
import jsPDF from "jspdf";
import { db } from "@/lib/dbConfig";
import { Billings, Patients, Doctors, Consultations } from "@/lib/schema";
import { eq } from "drizzle-orm";

const PharmacistBilling = ({ onBack }) => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const rows = await db
      .select({
        id: Billings.id,
        patientId: Billings.patientId,
        category: Billings.category,
        itemName: Billings.itemName,
        quantity: Billings.quantity,
        unitPrice: Billings.unitPrice,
        baseAmount: Billings.baseAmount,
        totalPrice: Billings.totalPrice,
        paymentStatus: Billings.paymentStatus,
        paymentMethod: Billings.paymentMethod,
        breakdown: Billings.breakdown,
        createdAt: Billings.createdAt,
        patientName: Patients.name,
        patientPhone: Patients.phone,
        doctorName: Doctors.name,
        doctorSpeciality: Doctors.speciality,
      })
      .from(Billings)
      .leftJoin(Patients, eq(Billings.patientId, Patients.userId))
      .leftJoin(Consultations, eq(Billings.consultationId, Consultations.id))
      .leftJoin(Doctors, eq(Consultations.doctorId, Doctors.userId));

    const formatted = rows.map((row) => ({
      id: row.id,
      itemName: row.itemName,
      patientId: row.patientId,
      patientName: row.patientName,
      patientPhone: row.patientPhone,
      doctorName: row.doctorName,
      doctorSpeciality: row.doctorSpeciality,
      date: row.createdAt?.toISOString().split("T")[0] ?? "",
      quantity: Number(row.quantity),
      unitPrice: Number(row.unitPrice),
      subtotal: Number(row.baseAmount),
      taxRate: row.breakdown?.taxRate || 0,
      taxAmount: row.breakdown?.taxAmount || 0,
      discountAmount: row.breakdown?.discountAmount || 0,
      discountPercent: row.breakdown?.discountPercent || 0,
      total: Number(row.totalPrice),
      status: row.paymentStatus,
      paymentMethod: row.paymentMethod,
    }));

    console.log(rows);
    console.log(formatted);

    setBills(formatted);
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateBillPDF = (bill) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("MediCura Pharmacy", 20, 20);
    doc.setFontSize(10);
    doc.text("123 Healthcare Drive, Medical City", 20, 28);
    doc.text("Phone: (555) 123-4567", 20, 34);

    // Bill Info
    doc.setFontSize(14);
    doc.text(`Bill Receipt - ${bill.id}`, 20, 50);

    doc.setFontSize(12);
    doc.text(`Patient: ${bill.patientName} (${bill.patientId})`, 20, 65);
    doc.text(`Phone: ${bill.patientPhone || "N/A"}`, 20, 72);
    doc.text(
      `Doctor: ${bill.doctorName || "N/A"} (${bill.doctorSpeciality})`,
      20,
      79
    );
    doc.text(`Date: ${bill.date}`, 20, 86);

    // Single Item
    doc.text("Medication:", 20, 100);
    doc.text(`${bill.itemName}`, 25, 110);
    doc.text(
      `Qty: ${bill.quantity} × $${bill.unitPrice.toFixed(2)} = $${bill.subtotal.toFixed(2)}`,
      25,
      118
    );

    // Totals with breakdown
    doc.text(`Subtotal: $${bill.subtotal.toFixed(2)}`, 20, 135);
    doc.text(`Tax (${bill.taxRate}%): $${bill.taxAmount.toFixed(2)}`, 20, 143);
    if (bill.discountAmount > 0) {
      doc.text(
        `Discount (${bill.discountPercent}%): -$${bill.discountAmount.toFixed(2)}`,
        20,
        151
      );
    }
    doc.text(`Total: $${bill.total.toFixed(2)}`, 20, 160);

    doc.save(`bill-${bill.id}.pdf`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-sm">Paid</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400 text-sm">Pending</span>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Receipt className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 text-sm">Draft</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Stats
  const paidCount = bills.filter((b) => b.status === "paid").length;
  const pendingCount = bills.filter((b) => b.status === "pending").length;
  const totalRevenue = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, bill) => sum + bill.total, 0);

  return (
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
                  Take a look at your patient bills
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
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

          {/* Bills List */}
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
                          {bill.patientName}
                        </div>
                        <div>
                          <span className="text-white">Date:</span> {bill.date}
                        </div>
                        <div>
                          <span className="text-white">Amount:</span> $
                          {bill.total.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                        <div>
                          <span className="text-white">Doctor Name:</span>{" "}
                          {bill.doctorName}
                        </div>
                        <div>
                          <span className="text-white">Speciality:</span> {bill.doctorSpeciality}
                        </div>
                      </div>

                      <div className="text-12-regular lg:text-14-regular text-dark-700">
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
                    </div>
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
  );
};

export default PharmacistBilling;
