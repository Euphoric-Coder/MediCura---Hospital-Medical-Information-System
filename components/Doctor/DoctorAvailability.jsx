import React, { useState } from 'react';
import { Plus, Clock, Calendar, Save, X, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const DoctorAvailability = ({ onBack }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const availabilityTemplates = [
    {
      id: 'standard',
      name: 'Standard Hours',
      description: 'Monday-Friday 9AM-5PM',
      schedule: {
        'Monday': { start: '09:00', end: '17:00', break: { start: '12:00', end: '13:00' } },
        'Tuesday': { start: '09:00', end: '17:00', break: { start: '12:00', end: '13:00' } },
        'Wednesday': { start: '09:00', end: '17:00', break: { start: '12:00', end: '13:00' } },
        'Thursday': { start: '09:00', end: '17:00', break: { start: '12:00', end: '13:00' } },
        'Friday': { start: '09:00', end: '17:00', break: { start: '12:00', end: '13:00' } }
      }
    },
    {
      id: 'extended',
      name: 'Extended Hours',
      description: 'Monday-Saturday 8AM-6PM',
      schedule: {
        'Monday': { start: '08:00', end: '18:00', break: { start: '12:00', end: '13:00' } },
        'Tuesday': { start: '08:00', end: '18:00', break: { start: '12:00', end: '13:00' } },
        'Wednesday': { start: '08:00', end: '18:00', break: { start: '12:00', end: '13:00' } },
        'Thursday': { start: '08:00', end: '18:00', break: { start: '12:00', end: '13:00' } },
        'Friday': { start: '08:00', end: '18:00', break: { start: '12:00', end: '13:00' } },
        'Saturday': { start: '08:00', end: '14:00' }
      }
    },
    {
      id: 'flexible',
      name: 'Flexible Schedule',
      description: 'Custom hours per day',
      schedule: {
        'Monday': { start: '10:00', end: '16:00' },
        'Tuesday': { start: '08:00', end: '14:00' },
        'Wednesday': { start: '12:00', end: '20:00' },
        'Thursday': { start: '09:00', end: '17:00' },
        'Friday': { start: '08:00', end: '12:00' }
      }
    }
  ];

  // Generate week schedule
  const generateWeekSchedule = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    
    const schedule = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Generate time slots
      const slots = [];
      for (let hour = 8; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const available = i < 5 && hour >= 9 && hour < 17; // Default weekday availability
          slots.push({ time, available });
        }
      }
      
      schedule.push({
        date: dateStr,
        dayName,
        fullDate: date,
        isWorkingDay: i < 5, // Monday to Friday
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

  const toggleSlotAvailability = (dayIndex, slotIndex) => {
    setWeekSchedule(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? {
            ...day,
            slots: day.slots.map((slot, sIndex) => 
              sIndex === slotIndex ? { ...slot, available: !slot.available } : slot
            )
          }
        : day
    ));
  };

  const toggleWorkingDay = (dayIndex) => {
    setWeekSchedule(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? {
            ...day,
            isWorkingDay: !day.isWorkingDay,
            slots: day.slots.map(slot => ({ ...slot, available: !day.isWorkingDay }))
          }
        : day
    ));
  };

  const applyTemplate = (templateId) => {
    const template = availabilityTemplates.find(t => t.id === templateId);
    if (!template) return;

    setWeekSchedule(prev => prev.map(day => {
      const daySchedule = template.schedule[day.dayName];
      if (!daySchedule) {
        return { ...day, isWorkingDay: false, slots: day.slots.map(slot => ({ ...slot, available: false })) };
      }

      const startHour = parseInt(daySchedule.start.split(':')[0]);
      const startMinute = parseInt(daySchedule.start.split(':')[1]);
      const endHour = parseInt(daySchedule.end.split(':')[0]);
      const endMinute = parseInt(daySchedule.end.split(':')[1]);

      let breakStartHour, breakStartMinute, breakEndHour, breakEndMinute;
      if (daySchedule.break) {
        breakStartHour = parseInt(daySchedule.break.start.split(':')[0]);
        breakStartMinute = parseInt(daySchedule.break.start.split(':')[1]);
        breakEndHour = parseInt(daySchedule.break.end.split(':')[0]);
        breakEndMinute = parseInt(daySchedule.break.end.split(':')[1]);
      }

      const updatedSlots = day.slots.map(slot => {
        const [slotHour, slotMinute] = slot.time.split(':').map(Number);
        const slotTime = slotHour * 60 + slotMinute;
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        let isAvailable = slotTime >= startTime && slotTime < endTime;

        // Check for break time
        if (daySchedule.break && breakStartHour !== undefined) {
          const breakStartTime = breakStartHour * 60 + breakStartMinute;
          const breakEndTime = breakEndHour * 60 + breakEndMinute;
          if (slotTime >= breakStartTime && slotTime < breakEndTime) {
            isAvailable = false;
          }
        }

        return { ...slot, available: isAvailable };
      });

      return { ...day, isWorkingDay: true, slots: updatedSlots };
    }));

    setMessage(`Applied ${template.name} template`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const saveAvailability = () => {
    setMessage('Availability schedule saved successfully');
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getAvailableSlots = (day) => {
    return day.slots.filter(slot => slot.available).length;
  };

  const totalAvailableSlots = weekSchedule.reduce((sum, day) => sum + getAvailableSlots(day), 0);
  const workingDays = weekSchedule.filter(day => day.isWorkingDay).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">Set Availability</span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">Manage your weekly schedule</p>
              </div>
            </div>
            <button
              onClick={saveAvailability}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
            >
              <Save className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">Save Schedule</span>
            </button>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{workingDays}</div>
                <div className="text-10-regular lg:text-14-regular text-blue-400">Working Days</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{totalAvailableSlots}</div>
                <div className="text-10-regular lg:text-14-regular text-green-400">Available Slots</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <div className="text-20-bold lg:text-32-bold text-white">{Math.round(totalAvailableSlots / 2)}</div>
                <div className="text-10-regular lg:text-14-regular text-purple-400">Hours/Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
          <h2 className="text-16-bold lg:text-20-bold text-white mb-4 lg:mb-6">Quick Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {availabilityTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                className="p-4 rounded-2xl border-2 border-dark-500 hover:border-blue-500 bg-dark-400/30 hover:bg-blue-500/10 transition-all duration-300 text-left"
              >
                <h3 className="text-14-bold lg:text-16-bold text-white mb-2">{template.name}</h3>
                <p className="text-10-regular lg:text-12-regular text-dark-700">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
            <h2 className="text-18-bold lg:text-24-bold text-white">Weekly Availability</h2>
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
                    onClick={() => toggleWorkingDay(dayIndex)}
                    className={`mt-2 px-3 py-1 rounded-lg text-10-medium lg:text-12-medium transition-colors ${
                      day.isWorkingDay
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {day.isWorkingDay ? 'Working' : 'Off'}
                  </button>
                </div>
                
                <div className="space-y-1 max-h-64 lg:max-h-96 overflow-y-auto">
                  {day.slots.map((slot, slotIndex) => (
                    <button
                      key={slotIndex}
                      onClick={() => toggleSlotAvailability(dayIndex, slotIndex)}
                      disabled={!day.isWorkingDay}
                      className={`w-full p-1 lg:p-2 rounded-lg text-10-medium lg:text-12-medium transition-all duration-200 ${
                        !day.isWorkingDay
                          ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                          : slot.available
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                
                <div className="mt-3 text-center">
                  <span className="text-10-regular lg:text-12-regular text-dark-600">
                    {getAvailableSlots(day)} slots
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <h3 className="text-14-bold lg:text-16-bold text-white mb-3">Instructions</h3>
            <ul className="space-y-2 text-12-regular lg:text-14-regular text-blue-300">
              <li>• Click on day headers to toggle working/off days</li>
              <li>• Click individual time slots to set availability</li>
              <li>• Use templates for quick setup</li>
              <li>• Green slots are available for appointments</li>
              <li>• Red slots are unavailable</li>
            </ul>
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

export default DoctorAvailability;