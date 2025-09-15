import React, { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import PatientDashboard from './PatientDashboard';
import PatientProfile from './PatientProfile';
import BillingHistory from './BillingHistory';
import PatientBookAppointment from './PatientBookAppointment';
import { Plus, Menu } from 'lucide-react';
import PatientPrescriptions from './PatientPrescription';
import PatientLabResults from './PatientLabResults';
import PatientMedicalRecords from './PatientMedicalRecords';

const PatientDashboardWithSidebar = ({ 
  onLogout, 
  onBookAppointment 
}) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleGoToProfile = () => {
    setCurrentPage('profile');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <PatientDashboard 
            onLogout={onLogout} 
            onBookAppointment={onBookAppointment}
            onGoToProfile={handleGoToProfile}
          />
        );
      case 'profile':
        return (
          <PatientProfile 
            onBack={() => setCurrentPage('dashboard')} 
          />
        );
      case 'billing':
        return (
          <BillingHistory 
            onBack={() => setCurrentPage('dashboard')} 
          />
        );
      case 'appointments':
        return (
          <PatientBookAppointment 
            onBack={() => setCurrentPage('dashboard')}
            onSuccess={(appointmentData) => {
              console.log('Appointment booked:', appointmentData);
              setCurrentPage('dashboard');
            }}
          />
        );
      case 'prescriptions':
        return (
          <PatientPrescriptions />
        );
      case 'lab-results':
        return (
          <PatientLabResults />
        );
      case 'medical-records':
        return (
          <PatientMedicalRecords />
        );
      case 'emergency':
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                <Plus className="w-12 h-12 text-red-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">Emergency Services</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto mb-8">
                In case of emergency, call 911 immediately or contact your healthcare provider.
              </p>
              <div className="space-y-4">
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                  Call 911
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                  Contact Primary Care
                </button>
              </div>
            </div>
          </div>
        );
      case 'health-tips':
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-pink-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-pink-500/20">
                <Plus className="w-12 h-12 text-pink-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">Health Tips Coming Soon</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Personalized health tips and wellness recommendations will be available here.
              </p>
            </div>
          </div>
        );
      case 'vitals':
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <Plus className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">Vitals Tracking Coming Soon</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                Track your blood pressure, heart rate, weight, and other vital signs here.
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-500/20">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">Settings Coming Soon</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                App preferences, notification settings, and privacy controls will be available here.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <PatientDashboard 
            onLogout={onLogout} 
            onBookAppointment={onBookAppointment}
            onGoToProfile={handleGoToProfile}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-dark-300">
      {/* Sidebar */}
      <PatientSidebar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
      <div className="flex-1 overflow-hidden relative">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-dark-400/50 hover:bg-dark-400/70 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <span className="text-18-bold text-white">CarePulse</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        <div className="h-full overflow-y-auto">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
    </div>
  );
};

export default PatientDashboardWithSidebar;