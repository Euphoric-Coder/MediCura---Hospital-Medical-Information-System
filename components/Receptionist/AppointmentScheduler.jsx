import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, ChevronLeft, ChevronRight, Search, CheckCircle, AlertCircle } from 'lucide-react';

const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Safari',
    specialty: 'General Medicine',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: 'bg-green-500'
  },
  {
    id: '2',
    name: 'Dr. Ava Williams',
    specialty: 'Cardiology',
    avatar: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: 'bg-blue-500'
  },
  {
    id: '3',
    name: 'Dr. Adam Smith',
    specialty: 'Pediatrics',
    avatar: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    color: 'bg-purple-500'
  }
];

const AppointmentScheduler = ({ onBack }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    patientPhone: '',
    reason: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Generate week schedule
  const generateWeekSchedule = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (weekOffset * 7));
    
    const schedule = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Generate time slots (9 AM to 5 PM)
      const slots = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const available = Math.random() > 0.3; // Random availability
          const patientName = !available ? 'John Doe' : undefined;
          
          slots.push({ time, available, patientName });
        }
      }
      
      schedule.push({
        date: dateStr,
        dayName,
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

  const handleSlotClick = (date, time, available) => {
    if (available) {
      setSelectedSlot({ date, time });
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage(`Appointment booked successfully for ${bookingData.patientName}`);
      setMessageType('success');
      setShowBookingForm(false);
      setSelectedSlot(null);
      setBookingData({ patientName: '', patientPhone: '', reason: '', notes: '' });
      
      // Update the schedule to show the booked slot
      setWeekSchedule(prev => prev.map(day => {
        if (day.date === selectedSlot?.date) {
          return {
            ...day,
            slots: day.slots.map(slot => {
              if (slot.time === selectedSlot?.time) {
                return { ...slot, available: false, patientName: bookingData.patientName };
              }
              return slot;
            })
          };
        }
        return day;
      }));
    } catch (error) {
      setMessage('Failed to book appointment. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-24-bold text-white">Appointment Scheduler</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-8 ${
            messageType === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {messageType === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-16-regular">{message}</span>
          </div>
        )}

        {/* Doctor Selection */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8 mb-8">
          <h2 className="text-24-bold text-white mb-6">Select Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedDoctor.id === doctor.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-dark-500 hover:border-dark-400 bg-dark-400/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="text-left">
                    <h3 className="text-16-semibold text-white">{doctor.name}</h3>
                    <p className="text-14-regular text-dark-700">{doctor.specialty}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-24-bold text-white">Weekly Schedule - {selectedDoctor.name}</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleWeekChange('prev')}
                className="p-2 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-16-medium text-white px-4">
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
          <div className="grid grid-cols-7 gap-4">
            {weekSchedule.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-dark-400/50 rounded-2xl p-4">
                <div className="text-center mb-4">
                  <h3 className="text-16-semibold text-white">{day.dayName}</h3>
                  <p className="text-14-regular text-dark-700">{day.date}</p>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {day.slots.map((slot, slotIndex) => (
                    <button
                      key={slotIndex}
                      onClick={() => handleSlotClick(day.date, slot.time, slot.available)}
                      disabled={!slot.available}
                      className={`w-full p-2 rounded-lg text-12-medium transition-all duration-200 ${
                        slot.available
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-center">
                        <div>{slot.time}</div>
                        {!slot.available && (
                          <div className="text-10-regular mt-1 truncate">{slot.patientName}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
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

      {/* Booking Modal */}
      {showBookingForm && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-md">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-24-bold text-white">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-dark-600 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-16-semibold text-white">{selectedDoctor.name}</h3>
                    <p className="text-14-regular text-blue-400">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-14-regular text-dark-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedSlot.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedSlot.time}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="shad-input-label block mb-2">Patient name *</label>
                  <input
                    type="text"
                    value={bookingData.patientName}
                    onChange={(e) => setBookingData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="Enter patient name"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Phone number *</label>
                  <input
                    type="tel"
                    value={bookingData.patientPhone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, patientPhone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Reason for visit *</label>
                  <input
                    type="text"
                    value={bookingData.reason}
                    onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Annual check-up, consultation, etc."
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Additional notes</label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information..."
                    className="shad-textArea w-full text-white min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentScheduler;