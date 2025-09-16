import React, { useState } from "react";
import {
  Plus,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Download,
  Filter,
  FileText,
  Pill,
  TestTube,
  Bed,
} from "lucide-react";
import jsPDF from "jspdf";

const DoctorReports = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for charts
  const appointmentsData = [
    { label: "Jan", value: 85, change: 5.2, color: "bg-blue-500" },
    { label: "Feb", value: 92, change: 8.2, color: "bg-blue-500" },
    { label: "Mar", value: 78, change: -15.2, color: "bg-blue-500" },
    { label: "Apr", value: 95, change: 21.8, color: "bg-blue-500" },
    { label: "May", value: 88, change: -7.4, color: "bg-blue-500" },
    { label: "Jun", value: 102, change: 15.9, color: "bg-blue-500" },
  ];

  const prescriptionsData = [
    { label: "Jan", value: 120, change: 3.1, color: "bg-purple-500" },
    { label: "Feb", value: 135, change: 12.5, color: "bg-purple-500" },
    { label: "Mar", value: 110, change: -18.5, color: "bg-purple-500" },
    { label: "Apr", value: 145, change: 31.8, color: "bg-purple-500" },
    { label: "May", value: 160, change: 10.3, color: "bg-purple-500" },
    { label: "Jun", value: 155, change: -3.1, color: "bg-purple-500" },
  ];

  const revenueData = [
    { label: "Q1", value: 45000, change: 8.5, color: "bg-green-500" },
    { label: "Q2", value: 52000, change: 15.6, color: "bg-green-500" },
    { label: "Q3", value: 48000, change: -7.7, color: "bg-green-500" },
    { label: "Q4", value: 58000, change: 20.8, color: "bg-green-500" },
  ];

  const patientSatisfactionData = [
    { label: "Jan", value: 4.8, change: 2.1, color: "bg-yellow-500" },
    { label: "Feb", value: 4.9, change: 2.1, color: "bg-yellow-500" },
    { label: "Mar", value: 4.7, change: -4.1, color: "bg-yellow-500" },
    { label: "Apr", value: 4.9, change: 4.3, color: "bg-yellow-500" },
    { label: "May", value: 5.0, change: 2.0, color: "bg-yellow-500" },
    { label: "Jun", value: 4.8, change: -4.0, color: "bg-yellow-500" },
  ];

  const generateReportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("CarePulse Medical Center", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567 | Email: info@carepulse.com", 20, 50);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("DOCTOR PERFORMANCE REPORT", 20, 70);

    // Doctor Information
    doc.setFontSize(14);
    doc.text("Physician Information:", 20, 90);
    doc.setFontSize(12);
    doc.text("Dr. Sarah Safari, MD", 30, 105);
    doc.text("General Medicine", 30, 115);
    doc.text(`Report Period: ${selectedPeriod}`, 30, 125);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 30, 135);

    // Performance Metrics
    doc.setFontSize(14);
    doc.text("Performance Metrics:", 20, 155);
    doc.setFontSize(12);
    doc.text("Total Appointments: 102", 30, 170);
    doc.text("Prescriptions Written: 155", 30, 180);
    doc.text("Lab Orders: 45", 30, 190);
    doc.text("Hospital Admissions: 8", 30, 200);
    doc.text("Revenue Generated: $58,000", 30, 210);
    doc.text("Patient Satisfaction: 4.8/5.0", 30, 220);

    // Monthly Breakdown
    doc.setFontSize(14);
    doc.text("Monthly Performance:", 20, 240);
    doc.setFontSize(12);
    appointmentsData.forEach((data, index) => {
      doc.text(
        `${data.label}: ${data.value} appointments (${
          data.change > 0 ? "+" : ""
        }${data.change}%)`,
        30,
        255 + index * 10
      );
    });

    doc.save(
      `doctor-report-${selectedPeriod}-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const getMaxValue = (data) =>
    Math.max(...data.map((d) => d.value));

  const BarChart = ({
    data,
    title,
    unit = "",
  }) => {
    const maxValue = getMaxValue(data);

    return (
      <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
        <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
          {title}
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-12-medium lg:text-14-medium text-white">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-14-semibold lg:text-16-semibold text-white">
                    {unit === "$"
                      ? `$${(item.value / 1000).toFixed(0)}K`
                      : `${item.value}${unit}`}
                  </span>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      item.change >= 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-10-medium lg:text-12-medium">
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-2 lg:h-3">
                <div
                  className={`h-2 lg:h-3 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    color,
  }) => (
    <div
      className={`bg-gradient-to-br ${color} backdrop-blur-sm border border-opacity-20 rounded-2xl p-4 lg:p-6`}
    >
      <div className="flex items-center gap-3 lg:gap-4">
        <div
          className={`w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r ${color
            .replace("/10", "")
            .replace(
              "/5",
              ""
            )} rounded-2xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
        </div>
        <div>
          <div className="text-20-bold lg:text-32-bold text-white">{value}</div>
          <div className="text-10-regular lg:text-14-regular text-opacity-70">
            {title}
          </div>
          <div
            className={`flex items-center gap-1 mt-1 ${
              change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4" />
            )}
            <span className="text-10-medium lg:text-12-medium">
              {Math.abs(change)}% vs last {selectedPeriod}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  Practice Reports
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Analytics and performance insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="shad-select-trigger text-white text-12-regular lg:text-14-regular"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={generateReportPDF}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
              >
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <StatCard
            title="Appointments"
            value="102"
            change={15.9}
            icon={Calendar}
            color="from-blue-500/10 to-blue-600/5"
          />
          <StatCard
            title="Prescriptions"
            value="155"
            change={-3.2}
            icon={Pill}
            color="from-purple-500/10 to-purple-600/5"
          />
          <StatCard
            title="Revenue"
            value="$58K"
            change={20.8}
            icon={DollarSign}
            color="from-green-500/10 to-green-600/5"
          />
          <StatCard
            title="Satisfaction"
            value="4.8"
            change={2.1}
            icon={Users}
            color="from-yellow-500/10 to-yellow-600/5"
          />
        </div>

        {/* Report Tabs */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex gap-1 lg:gap-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "prescriptions", label: "Prescriptions", icon: Pill },
              { id: "revenue", label: "Revenue", icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 whitespace-nowrap ${
                  selectedReport === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        {selectedReport === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart data={appointmentsData} title="Monthly Appointments" />
            <BarChart data={prescriptionsData} title="Prescriptions Written" />
            <BarChart data={revenueData} title="Quarterly Revenue" unit="$" />
            <BarChart
              data={patientSatisfactionData}
              title="Patient Satisfaction"
              unit="/5"
            />
          </div>
        )}

        {selectedReport === "appointments" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart
              data={appointmentsData}
              title="Monthly Appointments Trend"
            />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Appointment Types
              </h3>
              <div className="space-y-4">
                {[
                  { type: "Consultations", count: 65, percentage: 64 },
                  { type: "Follow-ups", count: 25, percentage: 25 },
                  { type: "Emergency", count: 8, percentage: 8 },
                  { type: "Check-ups", count: 4, percentage: 3 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">
                        {item.type}
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-white">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === "prescriptions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart data={prescriptionsData} title="Monthly Prescriptions" />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Top Prescribed Medications
              </h3>
              <div className="space-y-4">
                {[
                  { medication: "Lisinopril", count: 25, percentage: 16 },
                  { medication: "Metformin", count: 22, percentage: 14 },
                  { medication: "Amoxicillin", count: 18, percentage: 12 },
                  { medication: "Ibuprofen", count: 15, percentage: 10 },
                  { medication: "Others", count: 75, percentage: 48 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">
                        {item.medication}
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-white">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === "revenue" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart data={revenueData} title="Quarterly Revenue" unit="$" />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Revenue Sources
              </h3>
              <div className="space-y-4">
                {[
                  { source: "Consultations", amount: 35000, percentage: 60 },
                  { source: "Procedures", amount: 15000, percentage: 26 },
                  { source: "Follow-ups", amount: 6000, percentage: 10 },
                  { source: "Emergency", amount: 2000, percentage: 4 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">
                        {item.source}
                      </span>
                      <span className="text-14-semibold lg:text-16-semibold text-white">
                        ${(item.amount / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Patient Satisfaction
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              4.8/5
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-12-medium">
                +0.2 from last {selectedPeriod}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Avg Consultation
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              28 min
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingDown className="w-4 h-4" />
              <span className="text-12-medium">-2 min improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Success Rate
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              96%
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-12-medium">+2% improvement</span>
            </div>
          </div>
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

export default DoctorReports;
