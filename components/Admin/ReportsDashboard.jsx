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

const ReportsDashboard = ({ onBack }) => {
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

  const getMaxValue = (data) => Math.max(...data.map((d) => d.value));

  const BarChart = ({ data, title, unit = "" }) => {
    const maxValue = getMaxValue(data);

    return (
      <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
        <h3 className="text-20-bold text-white mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-14-medium text-white">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-16-semibold text-white">
                    {unit === "$"
                      ? `$${(item.value / 1000000).toFixed(1)}M`
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
                    <span className="text-12-medium">
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
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
      className={`bg-gradient-to-br ${color} backdrop-blur-sm border border-opacity-20 rounded-2xl p-6`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 bg-gradient-to-r ${color
            .replace("/10", "")
            .replace(
              "/5",
              ""
            )} rounded-2xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className="text-32-bold text-white">{value}</div>
          <div className="text-14-regular text-opacity-70">{title}</div>
          <div
            className={`flex items-center gap-1 mt-1 ${
              change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-12-medium">
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-24-bold text-white">
                  Reports Dashboard
                </span>
                <p className="text-14-regular text-dark-700">
                  Analytics and insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="shad-select-trigger text-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Admissions"
            value="1,245"
            change={8.5}
            icon={Users}
            color="from-blue-500/10 to-blue-600/5"
          />
          <StatCard
            title="Bed Occupancy"
            value="78%"
            change={-2.3}
            icon={Bed}
            color="from-green-500/10 to-green-600/5"
          />
          <StatCard
            title="Revenue"
            value="$2.9M"
            change={12.7}
            icon={DollarSign}
            color="from-green-500/10 to-green-600/5"
          />
          <StatCard
            title="Staff Utilization"
            value="85%"
            change={3.1}
            icon={Users}
            color="from-purple-500/10 to-purple-600/5"
          />
        </div>

        {/* Report Tabs */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 mb-8">
          <div className="flex gap-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "admissions", label: "Admissions", icon: Users },
              { id: "occupancy", label: "Occupancy", icon: Bed },
              { id: "finances", label: "Finances", icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-14-medium transition-all duration-300 ${
                  selectedReport === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        {selectedReport === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BarChart data={admissionsData} title="Monthly Admissions" />
            <BarChart
              data={occupancyData}
              title="Department Occupancy"
              unit="%"
            />
            <BarChart data={revenueData} title="Quarterly Revenue" unit="$" />
            <BarChart
              data={staffWorkloadData}
              title="Staff Workload"
              unit=" hrs/week"
            />
          </div>
        )}

        {selectedReport === "admissions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BarChart data={admissionsData} title="Monthly Admissions Trend" />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
              <h3 className="text-20-bold text-white mb-6">
                Admission Sources
              </h3>
              <div className="space-y-4">
                {[
                  {
                    source: "Emergency Department",
                    count: 450,
                    percentage: 36,
                  },
                  { source: "Physician Referral", count: 380, percentage: 31 },
                  { source: "Scheduled Surgery", count: 250, percentage: 20 },
                  { source: "Transfer", count: 165, percentage: 13 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-14-medium text-white">
                        {item.source}
                      </span>
                      <span className="text-16-semibold text-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BarChart
              data={occupancyData}
              title="Current Occupancy by Department"
              unit="%"
            />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
              <h3 className="text-20-bold text-white mb-6">Bed Availability</h3>
              <div className="space-y-6">
                {[
                  { department: "ICU", total: 20, occupied: 17, available: 3 },
                  {
                    department: "General Ward",
                    total: 100,
                    occupied: 72,
                    available: 28,
                  },
                  {
                    department: "Emergency",
                    total: 15,
                    occupied: 14,
                    available: 1,
                  },
                  {
                    department: "Surgery",
                    total: 25,
                    occupied: 17,
                    available: 8,
                  },
                ].map((dept, index) => (
                  <div key={index} className="bg-dark-500/30 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-16-semibold text-white">
                        {dept.department}
                      </h4>
                      <div className="flex items-center gap-4 text-14-regular">
                        <span className="text-green-400">
                          {dept.available} available
                        </span>
                        <span className="text-blue-400">
                          {dept.occupied} occupied
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                        style={{
                          width: `${(dept.occupied / dept.total) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-12-regular text-dark-600 mt-2">
                      <span>0</span>
                      <span>{dept.total} beds</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === "finances" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BarChart data={revenueData} title="Quarterly Revenue" unit="$" />
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
              <h3 className="text-20-bold text-white mb-6">
                Revenue Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  {
                    category: "Patient Services",
                    amount: 1800000,
                    percentage: 62,
                  },
                  { category: "Surgery", amount: 650000, percentage: 22 },
                  {
                    category: "Emergency Care",
                    amount: 300000,
                    percentage: 10,
                  },
                  { category: "Pharmacy", amount: 150000, percentage: 6 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-14-medium text-white">
                        {item.category}
                      </span>
                      <span className="text-16-semibold text-white">
                        ${(item.amount / 1000000).toFixed(1)}M
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-18-bold text-white">Patient Satisfaction</h3>
            </div>
            <div className="text-32-bold text-white mb-2">4.8/5</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-14-regular text-green-400">
                +0.3 from last month
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-18-bold text-white">Average Stay</h3>
            </div>
            <div className="text-32-bold text-white mb-2">3.2 days</div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-14-regular text-green-400">
                -0.5 days improvement
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-18-bold text-white">Efficiency Score</h3>
            </div>
            <div className="text-32-bold text-white mb-2">92%</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-14-regular text-green-400">
                +5% improvement
              </span>
            </div>
          </div>
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
  );
};

export default ReportsDashboard;
