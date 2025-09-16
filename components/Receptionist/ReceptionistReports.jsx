import React, { useState } from "react";
import {
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Download,
  UserPlus,
  Phone,
  CheckCircle,
} from "lucide-react";
import jsPDF from "jspdf";

const ReceptionistReports = ({
  onBack,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for charts
  const registrationsData = [
    { label: "Jan", value: 45, change: 5.2, color: "bg-purple-500" },
    { label: "Feb", value: 52, change: 15.6, color: "bg-purple-500" },
    { label: "Mar", value: 38, change: -26.9, color: "bg-purple-500" },
    { label: "Apr", value: 61, change: 60.5, color: "bg-purple-500" },
    { label: "May", value: 58, change: -4.9, color: "bg-purple-500" },
    { label: "Jun", value: 65, change: 12.1, color: "bg-purple-500" },
  ];

  const appointmentsData = [
    { label: "Jan", value: 320, change: 8.1, color: "bg-blue-500" },
    { label: "Feb", value: 385, change: 20.3, color: "bg-blue-500" },
    { label: "Mar", value: 298, change: -22.6, color: "bg-blue-500" },
    { label: "Apr", value: 425, change: 42.6, color: "bg-blue-500" },
    { label: "May", value: 410, change: -3.5, color: "bg-blue-500" },
    { label: "Jun", value: 445, change: 8.5, color: "bg-blue-500" },
  ];

  const revenueData = [
    { label: "Q1", value: 125000, change: 12.5, color: "bg-green-500" },
    { label: "Q2", value: 145000, change: 16.0, color: "bg-green-500" },
    { label: "Q3", value: 135000, change: -6.9, color: "bg-green-500" },
    { label: "Q4", value: 165000, change: 22.2, color: "bg-green-500" },
  ];

  const callsData = [
    { label: "Jan", value: 850, change: 3.2, color: "bg-yellow-500" },
    { label: "Feb", value: 920, change: 8.2, color: "bg-yellow-500" },
    { label: "Mar", value: 780, change: -15.2, color: "bg-yellow-500" },
    { label: "Apr", value: 1050, change: 34.6, color: "bg-yellow-500" },
    { label: "May", value: 980, change: -6.7, color: "bg-yellow-500" },
    { label: "Jun", value: 1120, change: 14.3, color: "bg-yellow-500" },
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
    doc.text("RECEPTION DEPARTMENT REPORT", 20, 70);

    // Staff Information
    doc.setFontSize(14);
    doc.text("Reception Staff:", 20, 90);
    doc.setFontSize(12);
    doc.text("Emily Johnson - Front Desk Receptionist", 30, 105);
    doc.text(`Report Period: ${selectedPeriod}`, 30, 115);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 30, 125);

    // Performance Metrics
    doc.setFontSize(14);
    doc.text("Performance Metrics:", 20, 145);
    doc.setFontSize(12);
    doc.text("Patient Registrations: 65", 30, 160);
    doc.text("Appointments Scheduled: 445", 30, 170);
    doc.text("Phone Calls Handled: 1,120", 30, 180);
    doc.text("Insurance Verifications: 85", 30, 190);
    doc.text("Payments Processed: $45,000", 30, 200);
    doc.text("Patient Satisfaction: 4.7/5.0", 30, 210);

    // Monthly Breakdown
    doc.setFontSize(14);
    doc.text("Monthly Registrations:", 20, 230);
    doc.setFontSize(12);
    registrationsData.forEach((data, index) => {
      doc.text(
        `${data.label}: ${data.value} registrations (${
          data.change > 0 ? "+" : ""
        }${data.change}%)`,
        30,
        245 + index * 10
      );
    });

    doc.save(
      `reception-report-${selectedPeriod}-${
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
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  Reception Reports
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Front desk performance analytics
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
            title="Registrations"
            value="65"
            change={12.1}
            icon={UserPlus}
            color="from-purple-500/10 to-purple-600/5"
          />
          <StatCard
            title="Appointments"
            value="445"
            change={8.5}
            icon={Calendar}
            color="from-blue-500/10 to-blue-600/5"
          />
          <StatCard
            title="Calls Handled"
            value="1,120"
            change={14.3}
            icon={Phone}
            color="from-yellow-500/10 to-yellow-600/5"
          />
          <StatCard
            title="Revenue Processed"
            value="$45K"
            change={18.7}
            icon={DollarSign}
            color="from-green-500/10 to-green-600/5"
          />
        </div>

        {/* Report Tabs */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex gap-1 lg:gap-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: FileText },
              { id: "registrations", label: "Registrations", icon: UserPlus },
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "revenue", label: "Revenue", icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 whitespace-nowrap ${
                  selectedReport === tab.id
                    ? "bg-purple-500 text-white"
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
            <BarChart
              data={registrationsData}
              title="Monthly Patient Registrations"
            />
            <BarChart data={appointmentsData} title="Appointments Scheduled" />
            <BarChart data={revenueData} title="Revenue Processed" unit="$" />
            <BarChart data={callsData} title="Phone Calls Handled" />
          </div>
        )}

        {selectedReport === "registrations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart
              data={registrationsData}
              title="Monthly Registrations Trend"
            />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Registration Sources
              </h3>
              <div className="space-y-4">
                {[
                  { source: "Walk-in", count: 28, percentage: 43 },
                  { source: "Phone Call", count: 20, percentage: 31 },
                  { source: "Online", count: 12, percentage: 18 },
                  { source: "Referral", count: 5, percentage: 8 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">
                        {item.source}
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

        {selectedReport === "appointments" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart data={appointmentsData} title="Monthly Appointments" />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Appointment Types
              </h3>
              <div className="space-y-4">
                {[
                  { type: "Consultations", count: 180, percentage: 40 },
                  { type: "Follow-ups", count: 135, percentage: 30 },
                  { type: "Check-ups", count: 90, percentage: 20 },
                  { type: "Emergency", count: 40, percentage: 10 },
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

        {selectedReport === "revenue" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart
              data={revenueData}
              title="Quarterly Revenue Processed"
              unit="$"
            />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Payment Methods
              </h3>
              <div className="space-y-4">
                {[
                  { method: "Credit Card", amount: 25000, percentage: 56 },
                  { method: "Insurance", amount: 15000, percentage: 33 },
                  { method: "Cash", amount: 3500, percentage: 8 },
                  { method: "Check", amount: 1500, percentage: 3 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">
                        {item.method}
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
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Avg Call Duration
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              4.2 min
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingDown className="w-4 h-4" />
              <span className="text-12-medium">-0.8 min improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Patient Satisfaction
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              4.7/5
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-12-medium">+0.3 improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Efficiency Score
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              94%
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-12-medium">+3% improvement</span>
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

export default ReceptionistReports;
