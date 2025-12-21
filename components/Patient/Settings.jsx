import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const PatientSettings = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState('main');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Password update states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    appointments: true,
    prescriptions: true,
    labResults: true,
    healthTips: false,
    marketing: false
  });

  const [shareResearchData, setShareResearchData] = useState(false);


  const passwordRequirements = {
    minLength: passwordData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(passwordData.newPassword),
    hasLowercase: /[a-z]/.test(passwordData.newPassword),
    hasNumber: /\d/.test(passwordData.newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

  const passwordStrength = React.useMemo(() => {
    const metRequirements = Object.values(passwordRequirements).filter(req => req).length;
    if (metRequirements === 0) return { label: '', color: '', width: '0%' };
    if (metRequirements <= 2) return { label: 'Weak', color: 'bg-red-500 dark:bg-red-600', width: '33%' };
    if (metRequirements <= 4) return { label: 'Medium', color: 'bg-yellow-500 dark:bg-yellow-600', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500 dark:bg-green-600', width: '100%' };
  }, [passwordRequirements]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      setMessage('Please meet all password requirements');
      setMessageType('error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('Password updated successfully!');
      setMessageType('success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setCurrentSection('main');
      }, 2000);
    } catch (error) {
      setMessage('Failed to update password. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderMainSettings = () => (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-24-bold text-white">Your Preferences</h2>
        </div>
        <p className="text-white/90 text-16-regular">
          Customize your experience and manage your privacy settings
        </p>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 px-6 py-5 border-b border-gray-100 dark:border-gray-700/50">
          <h3 className="text-18-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Preferences
          </h3>
          <p className="text-14-regular text-gray-600 dark:text-gray-400 mt-1">
            Manage your notifications and appearance
          </p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          <button
            onClick={() => setCurrentSection('notifications')}
            className="w-full flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent dark:hover:from-blue-950/20 dark:hover:to-transparent transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <span className="text-16-medium text-gray-900 dark:text-gray-100 block">Notifications</span>
                <span className="text-14-regular text-gray-500 dark:text-gray-400">Manage your alert preferences</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">→</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentSection('password')}
            className="w-full flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent dark:hover:from-green-950/20 dark:hover:to-transparent transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3 group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <span className="text-16-medium text-gray-900 dark:text-gray-100 block">Password & Security</span>
                <span className="text-14-regular text-gray-500 dark:text-gray-400">Update your password</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400">→</span>
              </div>
            </div>
          </button>

          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-transparent to-purple-50/50 dark:to-purple-950/10">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-indigo-100 dark:bg-indigo-900/30'
                  : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="text-left">
                <span className="text-16-medium text-gray-900 dark:text-gray-100 block">Dark Mode</span>
                <span className="text-14-regular text-gray-500 dark:text-gray-400">
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                isDarkMode
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-6 h-6 p-1 text-indigo-600" />
                ) : (
                  <Sun className="w-6 h-6 p-1 text-amber-500" />
                )}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 dark:bg-teal-900/30 rounded-xl p-3">
                <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-left">
                <span className="text-16-medium text-gray-900 dark:text-gray-100 block">Language</span>
                <span className="text-14-regular text-gray-500 dark:text-gray-400">App language preference</span>
              </div>
            </div>
            <span className="text-16-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              English
            </span>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 px-6 py-5 border-b border-gray-100 dark:border-gray-700/50">
          <h3 className="text-18-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500 dark:text-red-400" />
            Privacy & Security
          </h3>
          <p className="text-14-regular text-gray-600 dark:text-gray-400 mt-1">
            Control your data and privacy settings
          </p>
        </div>
        <div>
          <button
            onClick={() => setCurrentSection('privacy')}
            className="w-full flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent dark:hover:from-red-950/20 dark:hover:to-transparent transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-3 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <span className="text-16-medium text-gray-900 dark:text-gray-100 block">Privacy Settings</span>
                <span className="text-14-regular text-gray-500 dark:text-gray-400">Manage your data preferences</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400">→</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-20-bold text-white">Update Password</h3>
              <p className="text-white/90 text-14-regular">Keep your account secure</p>
            </div>
          </div>
        </div>
        <div className="p-8">

        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
              Current password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
                  setMessage('');
                }}
                placeholder="Enter your current password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
              New password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                  setMessage('');
                }}
                placeholder="Enter your new password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-12-regular text-gray-500 dark:text-gray-400">Password Strength</span>
                  {passwordStrength.label && (
                    <span className={`text-12-semibold ${
                      passwordStrength.label === 'Weak' ? 'text-red-500 dark:text-red-400' :
                      passwordStrength.label === 'Medium' ? 'text-yellow-500 dark:text-yellow-400' :
                      'text-green-500 dark:text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            {passwordData.newPassword && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                <p className="text-12-semibold text-gray-700 dark:text-gray-200 mb-2">Password Requirements:</p>

                <div className={`flex items-center gap-2 text-12-regular ${
                  passwordRequirements.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {passwordRequirements.minLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>At least 8 characters</span>
                </div>

                <div className={`flex items-center gap-2 text-12-regular ${
                  passwordRequirements.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {passwordRequirements.hasUppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>One uppercase letter (A-Z)</span>
                </div>

                <div className={`flex items-center gap-2 text-12-regular ${
                  passwordRequirements.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {passwordRequirements.hasLowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>One lowercase letter (a-z)</span>
                </div>

                <div className={`flex items-center gap-2 text-12-regular ${
                  passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {passwordRequirements.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>One number (0-9)</span>
                </div>

                <div className={`flex items-center gap-2 text-12-regular ${
                  passwordRequirements.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {passwordRequirements.hasSpecialChar ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>One special character (!@#$%^&*)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-14-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => {
                  setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                  setMessage('');
                }}
                placeholder="Confirm your new password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-12-regular text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                <X className="w-4 h-4" />
                Passwords do not match
              </p>
            )}
            {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
              <p className="text-12-regular text-green-500 dark:text-green-400 mt-1 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${
              messageType === 'success'
                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular">{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !allRequirementsMet || passwordData.newPassword !== passwordData.confirmPassword}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-800 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl text-16-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Update Password
              </>
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => {
    const notificationItems = [
      { key: 'appointments', label: 'Appointments', description: 'Reminders about upcoming appointments', icon: '📅', color: 'blue' },
      { key: 'prescriptions', label: 'Prescriptions', description: 'Updates on your medications', icon: '💊', color: 'green' },
      { key: 'labResults', label: 'Lab Results', description: 'Notifications when results are ready', icon: '🔬', color: 'purple' },
      { key: 'healthTips', label: 'Health Tips', description: 'Wellness tips and health advice', icon: '💡', color: 'amber' },
      { key: 'marketing', label: 'Marketing', description: 'News and promotional updates', icon: '📢', color: 'pink' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-20-bold text-white">Notification Preferences</h3>
                <p className="text-white/90 text-14-regular">Manage your alert settings</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {notificationItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700/30 dark:to-transparent hover:from-gray-100 dark:hover:from-gray-700/50 transition-all duration-200 border border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <p className="text-16-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </p>
                    <p className="text-14-regular text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !notifications[item.key] }))}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                    notifications[item.key]
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 items-center justify-center ${
                      notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  >
                    {notifications[item.key] ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPrivacySection = () => {

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-20-bold text-white">Privacy Settings</h3>
                <p className="text-white/90 text-14-regular">Your data protection controls</p>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 dark:bg-blue-600 rounded-lg p-2">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-16-bold text-gray-900 dark:text-gray-100 mb-2">HIPAA Compliance</h4>
                  <p className="text-14-regular text-gray-700 dark:text-gray-300">
                    Your medical data is protected with HIPAA-compliant security measures. We never share your information without your explicit consent.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-16-bold text-gray-900 dark:text-gray-100">Data Sharing</h4>

              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700/30 dark:to-transparent border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🔬</div>
                  <div>
                    <p className="text-16-medium text-gray-900 dark:text-gray-100">Share data for research</p>
                    <p className="text-14-regular text-gray-500 dark:text-gray-400">Anonymized data for medical research</p>
                  </div>
                </div>
                <button
                  onClick={() => setShareResearchData(!shareResearchData)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 shadow-inner ${
                    shareResearchData
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
                      shareResearchData ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  >
                    {shareResearchData ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700/30 dark:to-transparent border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">👥</div>
                  <div>
                    <p className="text-16-medium text-gray-900 dark:text-gray-100">Profile visibility</p>
                    <p className="text-14-regular text-gray-500 dark:text-gray-400">Control who can see your profile</p>
                  </div>
                </div>
                <span className="text-16-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  Private
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-8 py-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => currentSection === 'main' ? onBack() : setCurrentSection('main')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-14-regular">
              {currentSection === 'main' ? 'Back to Dashboard' : 'Back to Settings'}
            </span>
          </button>
          <h1 className="text-24-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {currentSection === 'main' && renderMainSettings()}
        {currentSection === 'password' && renderPasswordSection()}
        {currentSection === 'notifications' && renderNotificationsSection()}
        {currentSection === 'privacy' && renderPrivacySection()}
      </div>
    </div>
  );
};

export default PatientSettings;
