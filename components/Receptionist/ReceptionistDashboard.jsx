import React, { useState } from 'react';
import { Plus, UserPlus, Calendar, Clock, Users, Phone, CheckCircle, AlertTriangle, TrendingUp, Bell, User, Mail, Edit, Headphones } from 'lucide-react';

const ReceptionistDashboard = ({ onLogout }) => {
  const [todayAppointments] = useState([
    {
      id: '1',
      patientName: 'John Smith',
      patientId: 'P001',
      time: '09:00 AM',
      doctor: 'Dr. Sarah Safari',
      type: 'Consultation',
      status: 'checked-in',
      phone: '+1 (555) 123-4567',
      isNewPatient: false,
      insuranceVerified: true
    },
    {
      id: '2',
      patientName: 'Emily Johnson',
      patientId: 'P002',
      time: '09:30 AM',
      doctor: 'Dr. Ava Williams',
      type: 'Follow-up',
      status: 'scheduled',
      phone: '+1 (555) 234-5678',
      isNewPatient: false,
      insuranceVerified: true
    },
    {
      id: '3',
      patientName: 'Michael Brown',
      patientId: 'P003',
      time: '10:00 AM',
      doctor: 'Dr. Adam Smith',
      type: 'New Patient',
      status: 'scheduled',
      phone: '+1 (555) 345-6789',
      isNewPatient: true,
      insuranceVerified: false
    }
  ]);

  const [waitingPatients] = useState([
    {
      id: '1',
      name: 'John Smith',
      appointmentTime: '09:00 AM',
      doctor: 'Dr. Sarah Safari',
      status: 'waiting',
      waitTime: 15,
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      name: 'Sarah Davis',
      appointmentTime: '08:45 AM',
      doctor: 'Dr. Ava Williams',
      status: 'in-consultation',
      waitTime: 45,
      phone: '+1 (555) 456-7890'
    }
  ]);

  const [pendingTasks] = useState([
    {
      id: '1',
      type: 'insurance-verification',
      description: 'Verify insurance for Michael Brown',
      priority: 'high',
      dueTime: '09:45 AM',
      patientName: 'Michael Brown'
    },
    {
      id: '2',
      type: 'callback',
      description: 'Return call to David Wilson about appointment',
      priority: 'medium',
      dueTime: '10:30 AM',
      patientName: 'David Wilson'
    },
    {
      id: '3',
      type: 'billing',
      description: 'Process payment for completed consultation',
      priority: 'medium',
      dueTime: '11:00 AM',
      patientName: 'Jane Smith'
    }
  ]);

  const getAppointmentStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Calendar className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">Scheduled</span>
          </div>
        );
      case 'checked-in':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">Checked In</span>
          </div>
        );
      case 'in-consultation':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-purple-400">In Consultation</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-gray-400">Completed</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">Cancelled</span>
          </div>
        );
      case 'no-show':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">No Show</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getWaitingStatusBadge = (status, waitTime) => {
    const isLongWait = waitTime > 30;
    
    switch (status) {
      case 'waiting':
        return (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isLongWait 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-yellow-500/20 border border-yellow-500/30'
          }`}>
            <Clock className="w-3 h-3" />
            <span className={`text-10-medium sm:text-12-medium ${
              isLongWait ? 'text-red-400' : 'text-yellow-400'
            }`}>
              Waiting {waitTime}m
            </span>
          </div>
        );
      case 'called':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <Phone className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-blue-400">Called</span>
          </div>
        );
      case 'in-consultation':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-green-400">In Consultation</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-red-400">High</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <Clock className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-yellow-400">Medium</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <CheckCircle className="w-3 h-3" />
            <span className="text-10-medium sm:text-12-medium text-green-400">Low</span>
          </div>
        );
      default:
        return null;
    }
  };

  const scheduledCount = todayAppointments.filter(apt => apt.status === 'scheduled').length;
  const checkedInCount = todayAppointments.filter(apt => apt.status === 'checked-in').length;
  const completedCount = todayAppointments.filter(apt => apt.status === 'completed').length;
  const newPatientsCount = todayAppointments.filter(apt => apt.isNewPatient).length;
  const waitingCount = waitingPatients.filter(p => p.status === 'waiting').length;
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high').length;

  return (
    <div className="h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Headphones className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-24-bold lg:text-36-bold text-white">Good morning, Emily</h1>
                <p className="text-14-regular lg:text-16-regular text-dark-700">Ready to assist patients today</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="relative p-2 lg:p-3 rounded-xl bg-dark-400/50 backdrop-blur-sm border border-dark-500/50 hover:bg-dark-400/70 transition-all duration-300">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{scheduledCount}</div>
                <div className="text-10-regular lg:text-14-regular text-blue-400">Scheduled</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{checkedInCount}</div>
                <div className="text-10-regular lg:text-14-regular text-green-400">Checked In</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{newPatientsCount}</div>
                <div className="text-10-regular lg:text-14-regular text-purple-400">New Patients</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{waitingCount}</div>
                <div className="text-10-regular lg:text-14-regular text-yellow-400">Waiting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2 bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">Today's Appointments</h2>
              </div>
              <span className="text-12-regular lg:text-14-regular text-dark-700">
                {todayAppointments.length} appointments
              </span>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-14-bold lg:text-16-bold text-white">{appointment.patientName}</h3>
                          {getAppointmentStatusBadge(appointment.status)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span className="text-white">Doctor:</span> {appointment.doctor}
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-white">Type:</span> {appointment.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          {appointment.isNewPatient && (
                            <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-10-medium text-purple-400">
                              New Patient
                            </span>
                          )}
                          {!appointment.insuranceVerified && (
                            <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium text-red-400">
                              Insurance Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      {appointment.status === 'scheduled' && (
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          Check In
                        </button>
                      )}
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting Room & Tasks */}
          <div className="space-y-6">
            {/* Waiting Patients */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-16-bold lg:text-18-bold text-white">Waiting Room</h3>
              </div>
              <div className="space-y-3">
                {waitingPatients.map((patient) => (
                  <div key={patient.id} className="bg-dark-400/50 rounded-2xl p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-14-medium text-white">{patient.name}</h4>
                      {getWaitingStatusBadge(patient.status, patient.waitTime)}
                    </div>
                    <div className="text-12-regular text-dark-700">
                      <p>Appointment: {patient.appointmentTime}</p>
                      <p>Doctor: {patient.doctor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-16-bold lg:text-18-bold text-white">Pending Tasks</h3>
              </div>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="bg-dark-400/50 rounded-2xl p-3 lg:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-12-medium text-white">{task.dueTime}</span>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="text-12-regular text-dark-700">{task.description}</p>
                    {task.patientName && (
                      <p className="text-10-regular text-purple-400 mt-1">Patient: {task.patientName}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h2 className="text-18-bold lg:text-24-bold text-white">Today's Summary</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Appointments</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">{todayAppointments.length}</div>
              <div className="text-12-regular text-blue-400">Total today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Registrations</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">8</div>
              <div className="text-12-regular text-green-400">New patients</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Calls</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">24</div>
              <div className="text-12-regular text-purple-400">Handled today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Priority Tasks</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">{highPriorityTasks}</div>
              <div className="text-12-regular text-red-400">High priority</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;