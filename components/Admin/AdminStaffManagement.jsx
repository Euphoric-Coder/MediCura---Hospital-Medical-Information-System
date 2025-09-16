import React, { useState } from 'react';
import { Plus, Users, Search, Edit, Trash2, User, Mail, Phone, Shield, Stethoscope, Pill, Headphones, CheckCircle, AlertCircle, X } from 'lucide-react';

const AddStaffModal = ({ isOpen, onClose, onAdd, editingStaff }) => {
  const [formData, setFormData] = useState({
    name: editingStaff?.name || '',
    email: editingStaff?.email || '',
    phone: editingStaff?.phone || '',
    role: editingStaff?.role || 'doctor',
    department: editingStaff?.department || '',
    specialization: editingStaff?.specialization || '',
    licenseNumber: editingStaff?.licenseNumber || '',
    salary: editingStaff?.salary || 0,
    workSchedule: editingStaff?.workSchedule || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = {
      ...formData,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: getDefaultAvatar(formData.role)
    };
    onAdd(newStaff);
    onClose();
  };

  const getDefaultAvatar = (role) => {
    const avatars = {
      doctor: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      pharmacist: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      receptionist: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      admin: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    };
    return avatars[role];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="shad-input-label block mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. John Smith"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@hospital.com"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="shad-select-trigger w-full text-white"
                  required
                >
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Cardiology, Pharmacy, etc."
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">License Number</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  placeholder="MD123456789"
                  className="shad-input w-full text-white"
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Salary ($)</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                  placeholder="120000"
                  className="shad-input w-full text-white"
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Work Schedule</label>
                <input
                  type="text"
                  value={formData.workSchedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, workSchedule: e.target.value }))}
                  placeholder="Mon-Fri 9AM-5PM"
                  className="shad-input w-full text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="shad-input-label block mb-2">Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="General Medicine, Clinical Pharmacy, etc."
                  className="shad-input w-full text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-14-semibold lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
              >
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminStaffManagement = ({ onBack }) => {
  const [staff, setStaff] = useState([
    {
      id: '1',
      name: 'Dr. Sarah Safari',
      email: 'sarah@hospital.com',
      phone: '+1 (555) 123-4567',
      role: 'doctor',
      department: 'General Medicine',
      status: 'active',
      joinDate: '2023-01-15',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      specialization: 'Internal Medicine',
      licenseNumber: 'MD123456',
      salary: 180000,
      workSchedule: 'Mon-Fri 8AM-6PM'
    },
    {
      id: '2',
      name: 'PharmD. Michael Chen',
      email: 'michael@hospital.com',
      phone: '+1 (555) 234-5678',
      role: 'pharmacist',
      department: 'Pharmacy',
      status: 'active',
      joinDate: '2023-03-20',
      avatar: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      specialization: 'Clinical Pharmacy',
      licenseNumber: 'RPH789012',
      salary: 95000,
      workSchedule: 'Mon-Sat 9AM-7PM'
    },
    {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily@hospital.com',
      phone: '+1 (555) 345-6789',
      role: 'receptionist',
      department: 'Front Desk',
      status: 'active',
      joinDate: '2023-06-10',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      salary: 45000,
      workSchedule: 'Mon-Fri 7AM-3PM'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@hospital.com',
      phone: '+1 (555) 456-7890',
      role: 'admin',
      department: 'Administration',
      status: 'pending',
      joinDate: '2024-01-15',
      avatar: 'https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      specialization: 'Hospital Management',
      salary: 85000,
      workSchedule: 'Mon-Fri 8AM-5PM'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="w-5 h-5 text-green-400" />;
      case 'pharmacist':
        return <Pill className="w-5 h-5 text-blue-400" />;
      case 'receptionist':
        return <Headphones className="w-5 h-5 text-purple-400" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-red-400" />;
      default:
        return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-green-400">Active</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-10-medium sm:text-12-medium text-gray-400">Inactive</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-yellow-400">Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleAddStaff = (newStaff) => {
    const staff_member = {
      ...newStaff,
      id: (staff.length + 1).toString()
    };
    
    setStaff(prev => [...prev, staff_member]);
    setMessage(`${staff_member.name} added successfully`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setShowAddModal(true);
  };

  const handleDeleteStaff = (id) => {
    const staffMember = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    setMessage(`${staffMember?.name} removed successfully`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleStatusToggle = (id) => {
    setStaff(prev => prev.map(member => 
      member.id === id 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  const activeCount = staff.filter(s => s.status === 'active').length;
  const pendingCount = staff.filter(s => s.status === 'pending').length;
  const doctorCount = staff.filter(s => s.role === 'doctor').length;
  const totalStaff = staff.length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">Staff Management</span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">Manage hospital staff and roles</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Add Staff</span>
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
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">{message}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{totalStaff}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">Total Staff</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{activeCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Active</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{pendingCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{doctorCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Doctors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-dark-600" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff members..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  <option value="all">All Roles</option>
                  <option value="doctor">Doctors</option>
                  <option value="pharmacist">Pharmacists</option>
                  <option value="receptionist">Receptionists</option>
                  <option value="admin">Administrators</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Staff List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Staff Members</h2>
            </div>

            <div className="space-y-4">
              {filteredStaff.map((member) => (
                <div key={member.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-dark-500/50"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-dark-400">
                          {getRoleIcon(member.role)}
                        </div>
                      </div>
                      
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{member.name}</h3>
                          {getStatusBadge(member.status)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-green-400" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Role:</span> {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </div>
                          <div>
                            <span className="text-white">Department:</span> {member.department}
                          </div>
                          <div>
                            <span className="text-white">Joined:</span> {member.joinDate}
                          </div>
                        </div>
                        
                        {member.specialization && (
                          <div className="bg-dark-500/30 rounded-lg px-3 py-2 inline-block">
                            <p className="text-10-regular lg:text-12-regular text-dark-600">
                              <span className="text-white">Specialization:</span> {member.specialization}
                            </p>
                          </div>
                        )}

                        {member.salary && (
                          <div className="text-12-regular lg:text-14-regular text-dark-700">
                            <span className="text-white">Salary:</span> ${member.salary.toLocaleString()}/year
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusToggle(member.id)}
                          className={`px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 ${
                            member.status === 'active'
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {member.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => handleEditStaff(member)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-red-500/20">
                  <Users className="w-8 h-8 lg:w-12 lg:h-12 text-red-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No staff members found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No staff members match your search criteria. Try adjusting your filters or add new staff members.
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

      {/* Add/Edit Staff Modal */}
      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingStaff(null);
        }}
        onAdd={handleAddStaff}
        editingStaff={editingStaff}
      />
    </>
  );
};

export default AdminStaffManagement;