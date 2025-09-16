import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, ChevronLeft, ChevronRight, Search, Filter, CheckCircle, AlertTriangle, Phone, Mail, Edit, Save, X, Users } from 'lucide-react';

const AvailabilityModal = ({ isOpen, onClose, selectedDate, onSaveAvailability }) => {
  const [timeSlots, setTimeSlots] = useState(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time, available: true });
      }
    }
    return slots;
  });

  const toggleSlotAvailability = (index) => {
    setTimeSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, available: !slot.available } : slot
    ));
  };

  const handleSave = () => {
    onSaveAvailability(selectedDate, timeSlots);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">Set Availability</h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-16-bold text-white mb-2">Date: {selectedDate}</h3>
            <p className="text-14-regular text-dark-700">Click time slots to toggle availability</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => toggleSlotAvailability(index)}
                className={`p-2 lg:p-3 rounded-lg text-12-medium lg:text-14-medium transition-all duration-200 ${
                  slot.available
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorAppointments = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Generate week schedule with appointments
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
      
      // Generate time slots with appointments
      const slots = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const hasAppointment = Math.random() > 0.7 && i < 5; // Weekdays only
          
          if (hasAppointment) {
            const appointment = {
              id: `${i}-${hour}-${minute}`,
              patient: {
                id: `P${Math.floor(Math.random() * 999) + 1}`,
                name: ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson'][Math.floor(Math.random() * 5)],
                age: Math.floor(Math.random() * 60) + 20,
                phone: '+1 (555) 123-4567',
                email: 'patient@email.com',
                avatar: `https://images.pexels.com/photos/${[1222271, 1239291, 1681010, 1130626, 1043471][Math.floor(Math.random() * 5)]}/pexels-photo-${[1222271, 1239291, 1681010, 1130626, 1043471][Math.floor(Math.random() * 5)]}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
              },
              date: dateStr,
              time,
              duration: 30,
              type: ['Consultation', 'Follow-up', 'Check-up', 'Emergency'][Math.floor(Math.random() * 4)],
              status: ['scheduled', 'completed', 'in-progress'][Math.floor(Math.random() * 3)],
              reason: ['Annual check-up', 'Follow-up visit', 'Chest pain', 'Routine examination'][Math.floor(Math.random() * 4)],
              isUrgent: Math.random() > 0.9,
              consultationFee: 150
            };
            
            slots.push({ time, available: false, appointment });
          } else {
            slots.push({ time, available: true });
          }
        }
      }
      
      schedule.push({
        date: dateStr,
        dayName,
        fullDate: date,
        slots
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

  const handleSetAvailability = (date) => {
    setSelectedDate(date);
    setShowAvailabilityModal(true);
  };

  const handleSaveAvailability = (date, slots) => {
    setMessage(`Availability updated for ${date}`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
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
      case 'no-show':
        return (
          <div className={`${baseClasses} bg-yellow-500/20 border border-yellow-500/30`}>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-400">No Show</span>
          </div>
        );
      default:
        return null;
    }
  };

  const allAppointments = weekSchedule.flatMap(day => 
    day.slots.filter(slot => slot.appointment).map(slot => slot.appointment)
  );

  const filteredAppointments = allAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const scheduledCount = allAppointments.filter(apt => apt.status === 'scheduled').length;
  const completedCount = allAppointments.filter(apt => apt.status === 'completed').length;
  const urgentCount = allAppointments.filter(apt => apt.isUrgent).length;
  const totalRevenue = allAppointments.filter(apt => apt.status === 'completed').reduce((sum, apt) => sum + apt.consultationFee, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Appointment Schedule</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Manage your weekly schedule</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Message */}
          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-6 lg:mb-8 ${
              messageType === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">{message}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
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
                  <div className="text-20-bold lg:text-32-bold text-white">{completedCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{urgentCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Urgent</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">${totalRevenue.toFixed(0)}</div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">Revenue</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-18-bold lg:text-24-bold text-white">Weekly Schedule</h2>
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
                    <button
                      onClick={() => handleSetAvailability(day.date)}
                      className="mt-2 text-10-regular lg:text-12-regular text-green-400 hover:text-green-300 transition-colors"
                    >
                      Set Availability
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
                    {day.slots.filter(slot => slot.appointment).length > 0 ? (
                      day.slots.filter(slot => slot.appointment).map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`p-2 lg:p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                            slot.appointment?.isUrgent
                              ? 'bg-red-500/20 border-red-500/40 hover:bg-red-500/30'
                              : slot.appointment?.status === 'completed'
                              ? 'bg-green-500/20 border-green-500/30 hover:bg-green-500/30'
                              : slot.appointment?.status === 'in-progress'
                              ? 'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30'
                              : 'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-12-medium lg:text-14-medium text-white">{slot.time}</div>
                            <div className="text-10-regular lg:text-12-regular text-white/70 truncate mt-1">
                              {slot.appointment?.patient.name}
                            </div>
                            <div className="text-10-regular text-white/50 truncate">
                              {slot.appointment?.type}
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

          {/* Appointment List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">All Appointments</h2>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patients..."
                    className="shad-input pl-10 w-full sm:w-48 text-white text-12-regular lg:text-14-regular"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shad-select-trigger text-white w-full sm:w-auto text-12-regular lg:text-14-regular"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <img
                        src={appointment.patient.avatar}
                        alt={appointment.patient.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-dark-500/50 flex-shrink-0"
                      />
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{appointment.patient.name}</h3>
                          {getStatusBadge(appointment.status, appointment.isUrgent)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-purple-400" />
                            <span>{appointment.time}</span>
                          </div>
                          <div>
                            <span className="text-white">Type:</span> {appointment.type}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Age:</span> {appointment.patient.age}
                          </div>
                          <div>
                            <span className="text-white">Fee:</span> ${appointment.consultationFee}
                          </div>
                          <div className="hidden sm:block">
                            <span className="text-white">ID:</span> {appointment.patient.id}
                          </div>
                        </div>
                        
                        <div className="bg-dark-500/30 rounded-lg px-3 py-2">
                          <p className="text-10-regular lg:text-12-regular text-dark-600">
                            <span className="text-white">Reason:</span> {appointment.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <Calendar className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No appointments found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No appointments match your search criteria. Try adjusting your filters.
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

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        selectedDate={selectedDate || ''}
        onSaveAvailability={handleSaveAvailability}
      />
    </>
  );
};

export default DoctorAppointments;