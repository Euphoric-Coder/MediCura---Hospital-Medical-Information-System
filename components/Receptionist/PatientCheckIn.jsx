import React, { useState } from 'react';
import { Plus, Clock, User, Phone, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const PatientCheckIn = ({ onBack }) => {
  const [patients, setPatients] = useState([
    {
      id: '1',
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      appointmentTime: '09:00 AM',
      doctor: 'Dr. Sarah Safari',
      reason: 'Annual check-up',
      status: 'waiting',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Emily Johnson',
      phone: '+1 (555) 234-5678',
      appointmentTime: '09:30 AM',
      doctor: 'Dr. Ava Williams',
      reason: 'Heart consultation',
      status: 'arrived',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Michael Brown',
      phone: '+1 (555) 345-6789',
      appointmentTime: '10:00 AM',
      doctor: 'Dr. Adam Smith',
      reason: 'Follow-up visit',
      status: 'in-consultation',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '4',
      name: 'Sarah Davis',
      phone: '+1 (555) 456-7890',
      appointmentTime: '10:30 AM',
      doctor: 'Dr. Sarah Safari',
      reason: 'Routine examination',
      status: 'waiting',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '5',
      name: 'David Wilson',
      phone: '+1 (555) 567-8901',
      appointmentTime: '11:00 AM',
      doctor: 'Dr. Ava Williams',
      reason: 'Blood pressure check',
      status: 'completed',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ]);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const handleMarkArrived = (patientId) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'arrived' }
        : patient
    ));
    
    const patient = patients.find(p => p.id === patientId);
    setMessage(`${patient?.name} marked as arrived`);
    setMessageType('success');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleStartConsultation = (patientId) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'in-consultation' }
        : patient
    ));
    
    const patient = patients.find(p => p.id === patientId);
    setMessage(`Consultation started for ${patient?.name}`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-yellow-400">Waiting</span>
          </div>
        );
      case 'arrived':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-blue-400">Arrived</span>
          </div>
        );
      case 'in-consultation':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-green-400">In Consultation</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-12-medium text-gray-400">Completed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButton = (patient) => {
    switch (patient.status) {
      case 'waiting':
        return (
          <button
            onClick={() => handleMarkArrived(patient.id)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Mark Arrived
          </button>
        );
      case 'arrived':
        return (
          <button
            onClick={() => handleStartConsultation(patient.id)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-14-medium transition-all duration-300 shadow-lg hover:shadow-green-500/25"
          >
            Start Consultation
          </button>
        );
      case 'in-consultation':
        return (
          <div className="text-14-medium text-green-400 px-4 py-2">
            In Progress...
          </div>
        );
      case 'completed':
        return (
          <div className="text-14-medium text-gray-400 px-4 py-2">
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const waitingCount = patients.filter(p => p.status === 'waiting').length;
  const arrivedCount = patients.filter(p => p.status === 'arrived').length;
  const inConsultationCount = patients.filter(p => p.status === 'in-consultation').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-24-bold text-white">Patient Check-In</span>
                <p className="text-14-regular text-dark-700">{todayDate}</p>
              </div>
            </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{waitingCount}</div>
                <div className="text-14-regular text-yellow-400">Waiting</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{arrivedCount}</div>
                <div className="text-14-regular text-blue-400">Arrived</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{inConsultationCount}</div>
                <div className="text-14-regular text-green-400">In Consultation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-24-bold text-white">Today's Appointments</h2>
          </div>

          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-6 hover:border-dark-500/80 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-dark-500/50"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-dark-400">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-20-bold text-white">{patient.name}</h3>
                        <div className="flex items-center gap-2 text-14-regular text-dark-700">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-14-regular text-dark-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{patient.appointmentTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-green-400" />
                          <span>{patient.doctor}</span>
                        </div>
                      </div>
                      
                      <div className="bg-dark-500/30 rounded-lg px-3 py-2 inline-block">
                        <p className="text-12-regular text-dark-600">
                          Reason: <span className="text-white">{patient.reason}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    {getStatusBadge(patient.status)}
                    {getActionButton(patient)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {patients.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
                <Calendar className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">No appointments today</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                There are no scheduled appointments for today. Check back later or view upcoming appointments.
              </p>
            </div>
          )}
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

export default PatientCheckIn;