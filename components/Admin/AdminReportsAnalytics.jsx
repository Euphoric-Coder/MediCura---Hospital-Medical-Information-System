import React, { useState } from "react";
import {
  Plus,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Bed,
  DollarSign,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import jsPDF from "jspdf";

const AdminReportsAnalytics = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for charts
  const admissionsData = [
    { label: "Jan", value: 120, change: 5.2, color: "bg-blue-500" },
    { label: "Feb", value: 135, change: 12.5, color: "bg-blue-500" },
    { label: "Mar", value: 110, change: -18.5, color: "bg-blue-500" },
    { label: "Apr", value: 145, change: 31.8, color: "bg-blue-500" },
    { label: "May", value: 160, change: 10.3, color: "bg-blue-500" },
    { label: "Jun", value: 155, change: -3.1, color: "bg-blue-500" },
  ];

  const occupancyData = [
    { label: "ICU", value: 85, change: 2.1, color: "bg-red-500" },
    { label: "General", value: 72, change: -5.3, color: "bg-green-500" },
    { label: "Emergency", value: 95, change: 8.7, color: "bg-yellow-500" },
    { label: "Surgery", value: 68, change: -2.4, color: "bg-purple-500" },
  ];

  const revenueData = [
    { label: "Q1", value: 2500000, change: 8.5, color: "bg-green-500" },
    { label: "Q2", value: 2750000, change: 10.0, color: "bg-green-500" },
    { label: "Q3", value: 2650000, change: -3.6, color: "bg-green-500" },
    { label: "Q4", value: 2900000, change: 9.4, color: "bg-green-500" },
  ];

  const staffWorkloadData = [
    { label: "Doctors", value: 42, change: 3.2, color: "bg-green-500" },
    { label: "Nurses", value: 38, change: -1.5, color: "bg-blue-500" },
    { label: "Pharmacists", value: 35, change: 2.8, color: "bg-purple-500" },
    { label: "Admin", value: 28, change: -0.8, color: "bg-red-500" },
  ];

  const generateHospitalReport = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("MediCura Medical Center", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Healthcare Drive, Medical City, MC 12345", 20, 40);
    doc.text("Phone: (555) 123-4567 | Email: admin@medicura.com", 20, 50);

    // Title
    doc.set(16);
    doc.setTextColor(40, 40, 40);
    doc.text("HOSPITAL PERFORMANCE REPORT", 20, 70);

    // Executive Summary
    doc.setFontSize(14);
    doc.text("Executive Summary:", 20, 90);
    doc.setFontSize(12);
    doc.text(`Report Period: ${selectedPeriod}`, 30, 105);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 30, 115);

    // Key Metrics
    doc.setFontSize(14);
    doc.text("Key Performance Indicators:", 20, 135);
    doc.setFontSize(12);
    doc.text("Patient Admissions: 155 (Monthly Average)", 30, 150);
    doc.text("Bed Occupancy Rate: 78%", 30, 160);
    doc.text("Average Length of Stay: 4.2 days", 30, 170);
    doc.text("Patient Satisfaction: 4.6/5.0", 30, 180);
    doc.text("Staff Utilization: 85%", 30, 190);
    doc.text("Revenue: $2.9M (Quarterly)", 30, 200);

    // Department Performance
    doc.setFontSize(14);
    doc.text("Department Performance:", 20, 220);
    doc.setFontSize(12);
    doc.text("Emergency Department: 95% occupancy", 30, 235);
    doc.text("ICU: 85% occupancy", 30, 245);
    doc.text("General Wards: 72% occupancy", 30, 255);
    doc.text("Surgery Department: 68% occupancy", 30, 265);

    doc.save(
      `hospital-report-${selectedPeriod}-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  const getMaxValue = (data) => Math.max(...data.map((d) => d.value));

  const BarChart = ({ data, title, unit = "" }) => {
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
                      ? `$${(item.value / 1000000).toFixed(1)}M`
                      : unit === "%"
                      ? `${item.value}%`
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
                  style={{
                    width: `${
                      unit === "%" ? item.value : (item.value / maxValue) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
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
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  Reports & Analytics
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Hospital performance insights
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
                onClick={generateHospitalReport}
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
            title="Patient Admissions"
            value="155"
            change={10.3}
            icon={Users}
            color="from-blue-500/10 to-blue-600/5"
          />
          <StatCard
            title="Bed Occupancy"
            value="78%"
            change={-2.1}
            icon={Bed}
            color="from-purple-500/10 to-purple-600/5"
          />
          <StatCard
            title="Monthly Revenue"
            value="$2.9M"
            change={9.4}
            icon={DollarSign}
            color="from-green-500/10 to-green-600/5"
          />
          <StatCard
            title="Avg Length of Stay"
            value="4.2 days"
            change={-5.8}
            icon={Calendar}
            color="from-yellow-500/10 to-yellow-600/5"
          />
        </div>

        {/* Report Tabs */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
          <div className="flex gap-1 lg:gap-2 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "admissions", label: "Admissions", icon: Users },
              { id: "occupancy", label: "Occupancy", icon: Bed },
              { id: "revenue", label: "Revenue", icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-12-medium lg:text-14-medium transition-all duration-300 whitespace-nowrap ${
                  selectedReport === tab.id
                    ? "bg-red-500 text-white"
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
              data={admissionsData}
              title="Monthly Patient Admissions"
            />
            <BarChart
              data={occupancyData}
              title="Department Occupancy Rates"
              unit="%"
            />
            <BarChart data={revenueData} title="Quarterly Revenue" unit="$" />
            <BarChart
              data={staffWorkloadData}
              title="Staff Workload (Hours/Week)"
            />
          </div>
        )}

        {selectedReport === "admissions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart data={admissionsData} title="Monthly Admissions Trend" />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Admission Sources
              </h3>
              <div className="space-y-4">
                {[
                  { source: "Emergency", count: 65, percentage: 42 },
                  { source: "Referral", count: 48, percentage: 31 },
                  { source: "Elective", count: 32, percentage: 21 },
                  { source: "Transfer", count: 10, percentage: 6 },
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

        {selectedReport === "occupancy" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <BarChart
              data={occupancyData}
              title="Current Occupancy by Department"
              unit="%"
            />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Bed Utilization
              </h3>
              <div className="space-y-4">
                {[
                  { dept: "ICU", total: 20, occupied: 17, available: 3 },
                  {
                    dept: "General Ward",
                    total: 100,
                    occupied: 72,
                    available: 28,
                  },
                  { dept: "Emergency", total: 15, occupied: 14, available: 1 },
                  { dept: "Surgery", total: 25, occupied: 17, available: 8 },
                ].map((item, index) => (
                  <div key={index} className="bg-dark-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-14-medium text-white">
                        {item.dept}
                      </span>
                      <span className="text-12-regular text-dark-700">
                        {item.occupied}/{item.total} beds
                      </span>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                        style={{
                          width: `${(item.occupied / item.total) * 100}%`,
                        }}
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
              title="Quarterly Revenue Performance"
              unit="$"
            />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6">
              <h3 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">
                Revenue Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  {
                    category: "Inpatient Services",
                    amount: 1450000,
                    percentage: 50,
                  },
                  {
                    category: "Outpatient Services",
                    amount: 870000,
                    percentage: 30,
                  },
                  {
                    category: "Emergency Services",
                    amount: 435000,
                    percentage: 15,
                  },
                  { category: "Pharmacy", amount: 145000, percentage: 5 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">
                        {item.category}
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
              4.6/5.0
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-12-medium">+0.2 improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Readmission Rate
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              8.2%
            </div>
            <div className={`flex items-center gap-1 text-green-400`}>
              <TrendingDown className="w-4 h-4" />
              <span className="text-12-medium">-1.3% improvement</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-16-bold lg:text-18-bold text-white">
                Staff Efficiency
              </h3>
            </div>
            <div className="text-24-bold lg:text-32-bold text-white mb-2">
              92%
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

export default AdminReportsAnalytics;
