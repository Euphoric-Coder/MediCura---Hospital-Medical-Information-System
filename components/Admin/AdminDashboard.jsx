import React, { useState } from 'react';
import { Plus, Users, Calendar, Package, Receipt, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, Bed, Activity, Shield, Stethoscope, Building, UserPlus, Pill } from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const [alerts] = useState([
    {
      id: '1',
      type: 'critical',
      title: 'Low Stock Alert',
      description: 'Amoxicillin 500mg is running low (25 units remaining)',
      time: '5 minutes ago',
      action: 'Reorder Now'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Staff Schedule Conflict',
      description: 'Dr. Williams has overlapping appointments on Friday',
      time: '15 minutes ago',
      action: 'Resolve Conflict'
    },
    {
      id: '3',
      type: 'info',
      title: 'Monthly Report Ready',
      description: 'Hospital performance report for January is available',
      time: '1 hour ago',
      action: 'View Report'
    }
  ]);

  const quickStats = [
    {
      title: 'Total Patients',
      value: '2,847',
      change: 12.5,
      icon: Users,
      color: 'from-blue-500/10 to-blue-600/5',
      trend: 'up'
    },
    {
      title: 'Active Staff',
      value: '156',
      change: 3.2,
      icon: Stethoscope,
      color: 'from-green-500/10 to-green-600/5',
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: '$2.4M',
      change: 8.7,
      icon: DollarSign,
      color: 'from-green-500/10 to-green-600/5',
      trend: 'up'
    },
    {
      title: 'Bed Occupancy',
      value: '78%',
      change: -2.1,
      icon: Bed,
      color: 'from-purple-500/10 to-purple-600/5',
      trend: 'down'
    },
    {
      title: 'Appointments Today',
      value: '124',
      change: 15.3,
      icon: Calendar,
      color: 'from-blue-500/10 to-blue-600/5',
      trend: 'up'
    },
    {
      title: 'Pending Bills',
      value: '23',
      change: -18.2,
      icon: Receipt,
      color: 'from-yellow-500/10 to-yellow-600/5',
      trend: 'down'
    },
    {
      title: 'Inventory Items',
      value: '1,245',
      change: 2.8,
      icon: Package,
      color: 'from-purple-500/10 to-purple-600/5',
      trend: 'up'
    },
    {
      title: 'System Uptime',
      value: '99.8%',
      change: 0.1,
      icon: Activity,
      color: 'from-green-500/10 to-green-600/5',
      trend: 'up'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'from-red-500/10 to-red-600/5 border-red-500/20';
      case 'warning':
        return 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20';
      case 'info':
        return 'from-blue-500/10 to-blue-600/5 border-blue-500/20';
      default:
        return 'from-gray-500/10 to-gray-600/5 border-gray-500/20';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Building className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-24-bold lg:text-36-bold text-white">Hospital Administration</h1>
                <p className="text-14-regular lg:text-16-regular text-dark-700">Comprehensive hospital management overview</p>
              </div>
            </div>
            
            <div className="bg-dark-400/50 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-xl border border-dark-500/50">
              <span className="text-12-medium lg:text-14-medium text-white">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-opacity-20 rounded-2xl p-4 lg:p-6`}>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className={`w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r ${stat.color.replace('/10', '').replace('/5', '')} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{stat.value}</div>
                  <div className="text-10-regular lg:text-14-regular text-opacity-70">{stat.title}</div>
                  <div className={`flex items-center gap-1 mt-1 ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                    ) : (
                      <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                    <span className="text-10-medium lg:text-12-medium">{Math.abs(stat.change)}% vs last month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* System Alerts */}
          <div className="lg:col-span-2 bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">System Alerts</h2>
              </div>
              <span className="text-12-regular lg:text-14-regular text-dark-700">
                {alerts.length} active alerts
              </span>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`bg-gradient-to-r ${getAlertColor(alert.type)} backdrop-blur-sm border rounded-2xl p-4 lg:p-6`}>
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-14-bold lg:text-16-bold text-white">{alert.title}</h3>
                        <span className="text-10-regular lg:text-12-regular text-dark-600">{alert.time}</span>
                      </div>
                      <p className="text-12-regular lg:text-14-regular text-dark-700 mb-3">{alert.description}</p>
                      {alert.action && (
                        <button className={`text-12-medium lg:text-14-medium px-3 py-1 rounded-lg transition-colors ${
                          alert.type === 'critical' 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : alert.type === 'warning'
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                        }`}>
                          {alert.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-6">
            {/* Department Status */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-16-bold lg:text-18-bold text-white">Department Status</h3>
              </div>
              <div className="space-y-3">
                {[
                  { dept: 'Emergency', status: 'Normal', color: 'text-green-400' },
                  { dept: 'ICU', status: 'High Load', color: 'text-yellow-400' },
                  { dept: 'Surgery', status: 'Normal', color: 'text-green-400' },
                  { dept: 'Pharmacy', status: 'Normal', color: 'text-green-400' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-12-regular lg:text-14-regular text-white">{item.dept}</span>
                    <span className={`text-12-medium lg:text-14-medium ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Utilization */}
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-16-bold lg:text-18-bold text-white">Resource Utilization</h3>
              </div>
              <div className="space-y-4">
                {[
                  { resource: 'Beds', usage: 78, total: 200 },
                  { resource: 'Staff', usage: 142, total: 156 },
                  { resource: 'Equipment', usage: 85, total: 100 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-12-medium lg:text-14-medium text-white">{item.resource}</span>
                      <span className="text-12-medium lg:text-14-medium text-white">{item.usage}/{item.total}</span>
                    </div>
                    <div className="w-full bg-dark-500 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          (item.usage / item.total) > 0.9 ? 'bg-red-500' : 
                          (item.usage / item.total) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(item.usage / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h2 className="text-18-bold lg:text-24-bold text-white">Recent Hospital Activity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">New Registrations</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">8</div>
              <div className="text-12-regular text-blue-400">Today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Completed Procedures</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">15</div>
              <div className="text-12-regular text-green-400">Today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Prescriptions</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">67</div>
              <div className="text-12-regular text-purple-400">Dispensed today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Critical Alerts</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">{alerts.filter(a => a.type === 'critical').length}</div>
              <div className="text-12-regular text-red-400">Require attention</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;