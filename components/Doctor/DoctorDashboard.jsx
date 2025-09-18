import React, { useState } from 'react';
import { Plus, Calendar, Clock, Users, FileText, Pill, TestTube, Bed, TrendingUp, Bell, ChevronLeft, ChevronRight, User, Phone, Mail, Stethoscope, Activity } from 'lucide-react';

const DoctorDashboard = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate week schedule
  const generateWeekSchedule = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const schedule = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Mock appointments for demonstration
      const appointments = [];
      if (i < 5) { // Weekdays only
        const appointmentCount = Math.floor(Math.random() * 6) + 2;
        for (let j = 0; j < appointmentCount; j++) {
          const hour = 9 + Math.floor(Math.random() * 8);
          const minute = Math.random() > 0.5 ? 0 : 30;
          appointments.push({
            id: `${i}-${j}`,
            patientName: ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson'][Math.floor(Math.random() * 5)],
            patientId: `P00${Math.floor(Math.random() * 999) + 1}`,
            time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            duration: 30,
            type: ['Consultation', 'Follow-up', 'Check-up', 'Emergency'][Math.floor(Math.random() * 4)],
            status: ['scheduled', 'completed', 'in-progress'][Math.floor(Math.random() * 3)],
            patientPhone: '+1 (555) 123-4567',
            patientAge: Math.floor(Math.random() * 60) + 20,
            reason: ['Annual check-up', 'Follow-up visit', 'Chest pain', 'Routine examination'][Math.floor(Math.random() * 4)],
            isUrgent: Math.random() > 0.8
          });
        }
      }
      
      schedule.push({
        date: dateStr,
        dayName,
        appointments: appointments.sort((a, b) => a.time.localeCompare(b.time))
      });
    }
    
    return schedule;
  };

  const [weekSchedule, setWeekSchedule] = useState(generateWeekSchedule(0));

  const handleWeekChange = (direction) => {
    const newWeek = direction === 'next' ? currentWeek + 1 : currentWeek - 1;
    setCurrentWeek(newWeek);
    setWeekSchedule(generateWeekSchedule(newWeek));
  };

  const getStatusBadge = (status, isUrgent) => {
    const baseClasses = "flex items-center gap-1 px-2 py-1 rounded-full text-10-medium sm:text-12-medium";
    
    if (isUrgent) {
      return (
        <div className={`${baseClasses} bg-red-500/20 border border-red-500/30`}>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-400">Urgent</span>
        </div>
      );
    }

    switch (status) {
      case 'scheduled':
        return (
          <div className={`${baseClasses} bg-blue-500/20 border border-blue-500/30`}>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-400">Scheduled</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className={`${baseClasses} bg-green-500/20 border border-green-500/30`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400">In Progress</span>
          </div>
        );
      case 'completed':
        return (
          <div className={`${baseClasses} bg-gray-500/20 border border-gray-500/30`}>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-gray-400">Completed</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className={`${baseClasses} bg-red-500/20 border border-red-500/30`}>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-red-400">Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  const todayAppointments = weekSchedule.find(day => {
    const today = new Date();
    const dayDate = new Date();
    dayDate.setDate(today.getDate() - today.getDay() + weekSchedule.indexOf(day));
    return dayDate.toDateString() === today.toDateString();
  })?.appointments || [];

  const totalAppointments = weekSchedule.reduce((sum, day) => sum + day.appointments.length, 0);
  const completedAppointments = weekSchedule.reduce((sum, day) => 
    sum + day.appointments.filter(apt => apt.status === 'completed').length, 0
  );
  const urgentAppointments = weekSchedule.reduce((sum, day) => 
    sum + day.appointments.filter(apt => apt.isUrgent).length, 0
  );

  return (
    <div className="h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-24-bold lg:text-36-bold text-white">Good morning, Dr. Safari</h1>
                <p className="text-14-regular lg:text-16-regular text-dark-700">Ready to help your patients today</p>
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
                <div className="text-20-bold lg:text-32-bold text-white">{todayAppointments.length}</div>
                <div className="text-10-regular lg:text-14-regular text-blue-400">Today</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{totalAppointments}</div>
                <div className="text-10-regular lg:text-14-regular text-green-400">This Week</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{completedAppointments}</div>
                <div className="text-10-regular lg:text-14-regular text-purple-400">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{urgentAppointments}</div>
                <div className="text-10-regular lg:text-14-regular text-red-400">Urgent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2 bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">Today's Schedule</h2>
              </div>
              <span className="text-12-regular lg:text-14-regular text-dark-700">
                {todayAppointments.length} appointments
              </span>
            </div>

            <div className="space-y-3 lg:space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-14-bold lg:text-16-bold text-white">{appointment.patientName}</h3>
                            {getStatusBadge(appointment.status, appointment.isUrgent)}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span>{appointment.time}</span>
                            </div>
                            <div>
                              <span className="text-white">Type:</span> {appointment.type}
                            </div>
                            <div className="hidden sm:block">
                              <span className="text-white">Age:</span> {appointment.patientAge}
                            </div>
                          </div>
                          <div className="mt-1">
                            <span className="text-12-regular text-dark-600">Reason: </span>
                            <span className="text-white text-12-regular lg:text-14-regular">{appointment.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        {appointment.status === 'scheduled' && (
                          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                            Start
                          </button>
                        )}
                        {appointment.status === 'in-progress' && (
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                            Continue
                          </button>
                        )}
                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 lg:py-12">
                  <Calendar className="w-12 h-12 lg:w-16 lg:h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-16-bold lg:text-20-bold text-white mb-2">No appointments today</h3>
                  <p className="text-14-regular text-dark-700">Enjoy your free day!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-6">
            {/* Patient Summary */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-16-bold lg:text-18-bold text-white">Patient Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-12-regular lg:text-14-regular text-dark-700">Total Patients</span>
                  <span className="text-14-bold lg:text-16-bold text-white">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-12-regular lg:text-14-regular text-dark-700">New This Month</span>
                  <span className="text-14-bold lg:text-16-bold text-green-400">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-12-regular lg:text-14-regular text-dark-700">Follow-ups Due</span>
                  <span className="text-14-bold lg:text-16-bold text-yellow-400">8</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-16-bold lg:text-18-bold text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 lg:py-3 px-4 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Write Prescription
                </button>
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 lg:py-3 px-4 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Order Lab Test
                </button>
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 lg:py-3 px-4 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  Hospital Admit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Weekly Schedule</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleWeekChange('prev')}
                className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-14-medium lg:text-16-medium text-white px-4">
                {currentWeek === 0 ? 'This Week' : currentWeek > 0 ? `${currentWeek} Week${currentWeek > 1 ? 's' : ''} Ahead` : `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? 's' : ''} Ago`}
              </span>
              <button
                onClick={() => handleWeekChange('next')}
                className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {weekSchedule.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-dark-400/50 rounded-2xl p-3 lg:p-4">
                <div className="text-center mb-4">
                  <h3 className="text-14-semibold lg:text-16-semibold text-white">{day.dayName}</h3>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">{day.date}</p>
                </div>
                
                <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
                  {day.appointments.length > 0 ? (
                    day.appointments.map((appointment, index) => (
                      <div
                        key={index}
                        className={`p-2 lg:p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:border-opacity-60 ${
                          appointment.isUrgent
                            ? 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30'
                            : appointment.status === 'completed'
                            ? 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30'
                            : appointment.status === 'in-progress'
                            ? 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30'
                            : 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-12-medium lg:text-14-medium text-white">{appointment.time}</div>
                          <div className="text-10-regular lg:text-12-regular text-white/70 truncate mt-1">
                            {appointment.patientName}
                          </div>
                          <div className="text-10-regular text-white/50 truncate">
                            {appointment.type}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 lg:py-8">
                      <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-dark-600 mx-auto mb-2" />
                      <p className="text-10-regular lg:text-12-regular text-dark-600">No appointments</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h2 className="text-18-bold lg:text-24-bold text-white">Recent Activity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Prescriptions</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">12</div>
              <div className="text-12-regular text-blue-400">Written today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <TestTube className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Lab Orders</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">8</div>
              <div className="text-12-regular text-green-400">Ordered today</div>
            </div>

            <div className="bg-dark-400/50 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Bed className="w-4 h-4 text-white" />
                </div>
                <span className="text-14-medium lg:text-16-medium text-white">Admissions</span>
              </div>
              <div className="text-20-bold lg:text-24-bold text-white mb-1">3</div>
              <div className="text-12-regular text-red-400">Admitted today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;