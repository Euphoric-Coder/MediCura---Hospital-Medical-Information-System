import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, Search, ChevronDown, Check, ChevronLeft, ChevronRight, Stethoscope, MapPin, Phone } from 'lucide-react';

const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Safari',
    specialty: 'General Medicine',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.9,
    experience: '12 years',
    location: 'Main Building, Floor 2',
    phone: '+1 (555) 123-4567',
    consultationFee: 150,
    nextAvailable: 'Today 2:00 PM'
  },
  {
    id: '2',
    name: 'Dr. Ava Williams',
    specialty: 'Cardiology',
    avatar: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.8,
    experience: '15 years',
    location: 'Cardiology Wing, Floor 3',
    phone: '+1 (555) 234-5678',
    consultationFee: 200,
    nextAvailable: 'Tomorrow 10:00 AM'
  },
  {
    id: '3',
    name: 'Dr. Adam Smith',
    specialty: 'Pediatrics',
    avatar: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.7,
    experience: '10 years',
    location: 'Pediatric Wing, Floor 1',
    phone: '+1 (555) 345-6789',
    consultationFee: 175,
    nextAvailable: 'Jan 25 9:00 AM'
  },
  {
    id: '4',
    name: 'Dr. Emily Chen',
    specialty: 'Dermatology',
    avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: 4.9,
    experience: '8 years',
    location: 'Dermatology Clinic, Floor 2',
    phone: '+1 (555) 456-7890',
    consultationFee: 180,
    nextAvailable: 'Jan 26 11:30 AM'
  }
];

const PatientBookAppointment = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState('select-doctor');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Generate week schedule for selected doctor
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
      const fullDate = date.toISOString().split('T')[0];
      
      // Generate time slots (9 AM to 5 PM)
      const slots = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const available = Math.random() > 0.4; // Random availability
          
          slots.push({ time, available });
        }
      }
      
      schedule.push({
        date: dateStr,
        dayName,
        fullDate,
        slots
      });
    }
    
    return schedule;
  };

  const [weekSchedule, setWeekSchedule] = useState([]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = ['all', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setWeekSchedule(generateWeekSchedule(0));
    setStep('select-time');
  };

  const handleTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep('confirm');
  };

  const handleWeekChange = (direction) => {
    const newWeek = direction === 'next' ? currentWeek + 1 : currentWeek - 1;
    setCurrentWeek(newWeek);
    setWeekSchedule(generateWeekSchedule(newWeek));
  };

  const handleConfirmBooking = () => {
    const appointmentData = {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason: appointmentReason,
      notes: additionalNotes,
      bookingDate: new Date().toISOString()
    };
    
    console.log('Booking appointment:', appointmentData);
    onSuccess(appointmentData);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-500'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-36-bold text-white">Book Appointment</h1>
              <p className="text-16-regular text-dark-700">Schedule your next healthcare visit</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              step === 'select-doctor' ? 'bg-green-500 text-white' : 'bg-dark-400/50 text-dark-700'
            }`}>
              <User className="w-4 h-4" />
              <span className="text-14-medium">Select Doctor</span>
            </div>
            <div className="w-8 h-0.5 bg-dark-500"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              step === 'select-time' ? 'bg-green-500 text-white' : 'bg-dark-400/50 text-dark-700'
            }`}>
              <Calendar className="w-4 h-4" />
              <span className="text-14-medium">Select Time</span>
            </div>
            <div className="w-8 h-0.5 bg-dark-500"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              step === 'confirm' ? 'bg-green-500 text-white' : 'bg-dark-400/50 text-dark-700'
            }`}>
              <Check className="w-4 h-4" />
              <span className="text-14-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Doctor */}
        {step === 'select-doctor' && (
          <div className="space-y-8">
            {/* Filters */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-dark-600" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search doctors by name or specialty..."
                    className="shad-input pl-10 w-full text-white"
                  />
                </div>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="shad-select-trigger text-white"
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty === 'all' ? 'All Specialties' : specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Doctor List */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">Available Doctors</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-dark-500/50 group-hover:border-green-500/50 transition-all duration-300"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center border-2 border-dark-400">
                          <Stethoscope className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-20-bold text-white group-hover:text-green-400 transition-colors">{doctor.name}</h3>
                          <p className="text-14-regular text-blue-400">{doctor.specialty}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {renderStars(doctor.rating)}
                          <span className="text-14-medium text-white ml-2">{doctor.rating}</span>
                          <span className="text-12-regular text-dark-600">({doctor.experience} experience)</span>
                        </div>
                        
                        <div className="space-y-2 text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-400" />
                            <span>{doctor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-400" />
                            <span>{doctor.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>Next available: {doctor.nextAvailable}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="bg-green-500/20 rounded-lg px-3 py-2">
                            <span className="text-14-medium text-green-400">
                              ${doctor.consultationFee} consultation
                            </span>
                          </div>
                          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25 opacity-0 group-hover:opacity-100">
                            Select Doctor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 'select-time' && selectedDoctor && (
          <div className="space-y-8">
            {/* Selected Doctor Info */}
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-20-bold text-white">{selectedDoctor.name}</h3>
                  <p className="text-14-regular text-green-400">{selectedDoctor.specialty}</p>
                  <p className="text-14-regular text-dark-700">{selectedDoctor.location}</p>
                </div>
                <button
                  onClick={() => setStep('select-doctor')}
                  className="ml-auto text-14-medium text-green-400 hover:text-green-300 px-4 py-2 border border-green-500/30 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                >
                  Change Doctor
                </button>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-24-bold text-white">Select Date & Time</h2>
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
                          onClick={() => slot.available && handleTimeSelect(day.fullDate, slot.time)}
                          disabled={!slot.available}
                          className={`w-full p-2 rounded-lg text-12-medium transition-all duration-200 ${
                            slot.available
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Booking */}
        {step === 'confirm' && selectedDoctor && (
          <div className="space-y-8">
            {/* Appointment Summary */}
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-24-bold text-white">Confirm Appointment</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Doctor Info */}
                <div className="bg-dark-400/50 rounded-2xl p-6">
                  <h3 className="text-18-bold text-white mb-4">Doctor Information</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="text-16-semibold text-white">{selectedDoctor.name}</h4>
                      <p className="text-14-regular text-blue-400">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(selectedDoctor.rating)}
                        <span className="text-12-regular text-white ml-1">{selectedDoctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-14-regular text-dark-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>{selectedDoctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span>{selectedDoctor.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-dark-400/50 rounded-2xl p-6">
                  <h3 className="text-18-bold text-white mb-4">Appointment Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-16-semibold text-white">
                          {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-14-regular text-dark-700">Date</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-16-semibold text-white">{selectedTime}</div>
                        <div className="text-14-regular text-dark-700">Time</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-500/20 rounded-lg px-4 py-3">
                      <div className="text-16-semibold text-green-400">
                        Consultation Fee: ${selectedDoctor.consultationFee}
                      </div>
                      <div className="text-12-regular text-green-300">
                        Payment due at time of service
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details Form */}
            <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
              <h2 className="text-24-bold text-white mb-6">Appointment Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="shad-input-label block mb-2">Reason for appointment *</label>
                  <textarea
                    value={appointmentReason}
                    onChange={(e) => setAppointmentReason(e.target.value)}
                    placeholder="Please describe the reason for your visit (e.g., annual check-up, follow-up, specific symptoms)"
                    className="shad-textArea w-full text-white min-h-[100px] resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Additional notes (optional)</label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional information you'd like the doctor to know (e.g., preferred appointment time, specific concerns)"
                    className="shad-textArea w-full text-white min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('select-time')}
                className="flex items-center gap-2 text-16-regular text-dark-600 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Time Selection
              </button>
              
              <button
                onClick={handleConfirmBooking}
                disabled={!appointmentReason.trim()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        )}

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

export default PatientBookAppointment;