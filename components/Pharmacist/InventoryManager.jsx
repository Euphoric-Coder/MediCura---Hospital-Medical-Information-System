import React, { useState } from 'react';
import { Plus, Package, Search, Edit, Trash2, AlertTriangle, CheckCircle, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const InventoryManager = ({ onBack }) => {
  const [medicines, setMedicines] = useState([
    {
      id: '1',
      name: 'Lisinopril 10mg',
      category: 'Cardiovascular',
      manufacturer: 'Pfizer',
      batchNumber: 'LIS001',
      expiryDate: '2025-06-15',
      quantity: 150,
      minStockLevel: 50,
      unitPrice: 2.50,
      location: 'A-1-01',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      category: 'Antibiotic',
      manufacturer: 'GSK',
      batchNumber: 'AMX002',
      expiryDate: '2024-03-20',
      quantity: 25,
      minStockLevel: 30,
      unitPrice: 1.75,
      location: 'B-2-05',
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Metformin 500mg',
      category: 'Diabetes',
      manufacturer: 'Teva',
      batchNumber: 'MET003',
      expiryDate: '2024-12-10',
      quantity: 0,
      minStockLevel: 40,
      unitPrice: 1.25,
      location: 'C-1-03',
      status: 'out-of-stock'
    },
    {
      id: '4',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      manufacturer: 'Johnson & Johnson',
      batchNumber: 'IBU004',
      expiryDate: '2024-01-30',
      quantity: 80,
      minStockLevel: 25,
      unitPrice: 0.85,
      location: 'D-3-02',
      status: 'expired'
    },
    {
      id: '5',
      name: 'Omeprazole 20mg',
      category: 'Gastric',
      manufacturer: 'AstraZeneca',
      batchNumber: 'OME005',
      expiryDate: '2025-09-15',
      quantity: 200,
      minStockLevel: 60,
      unitPrice: 3.20,
      location: 'A-2-04',
      status: 'in-stock'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    minStockLevel: 0,
    unitPrice: 0,
    location: ''
  });

  const categories = ['all', ...Array.from(new Set(medicines.map(m => m.category)))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || medicine.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStatus = (medicine) => {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    
    if (expiryDate < today) return 'expired';
    if (medicine.quantity === 0) return 'out-of-stock';
    if (medicine.quantity <= medicine.minStockLevel) return 'low-stock';
    return 'in-stock';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-stock':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-12-medium text-green-400">In Stock</span>
          </div>
        );
      case 'low-stock':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-12-medium text-yellow-400">Low Stock</span>
          </div>
        );
      case 'out-of-stock':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-12-medium text-red-400">Out of Stock</span>
          </div>
        );
      case 'expired':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-12-medium text-gray-400">Expired</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStockLevelBar = (current, min) => {
    const percentage = Math.min((current / (min * 2)) * 100, 100);
    let colorClass = 'bg-green-500';
    
    if (current === 0) colorClass = 'bg-red-500';
    else if (current <= min) colorClass = 'bg-yellow-500';
    
    return (
      <div className="w-full bg-dark-500 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const handleAddMedicine = () => {
    const id = (medicines.length + 1).toString();
    const status = getStockStatus({ ...newMedicine, id, status: 'in-stock' });
    
    setMedicines(prev => [...prev, { ...newMedicine, id, status }]);
    setNewMedicine({
      name: '',
      category: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      minStockLevel: 0,
      unitPrice: 0,
      location: ''
    });
    setShowAddModal(false);
  };

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine({
      name: medicine.name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      batchNumber: medicine.batchNumber,
      expiryDate: medicine.expiryDate,
      quantity: medicine.quantity,
      minStockLevel: medicine.minStockLevel,
      unitPrice: medicine.unitPrice,
      location: medicine.location
    });
    setShowAddModal(true);
  };

  const handleUpdateMedicine = () => {
    if (editingMedicine) {
      const status = getStockStatus({ ...newMedicine, id: editingMedicine.id, status: 'in-stock' });
      
      setMedicines(prev => prev.map(medicine => 
        medicine.id === editingMedicine.id 
          ? { ...newMedicine, id: editingMedicine.id, status }
          : medicine
      ));
      
      setEditingMedicine(null);
      setNewMedicine({
        name: '',
        category: '',
        manufacturer: '',
        batchNumber: '',
        expiryDate: '',
        quantity: 0,
        minStockLevel: 0,
        unitPrice: 0,
        location: ''
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteMedicine = (id) => {
    setMedicines(prev => prev.filter(medicine => medicine.id !== id));
  };

  const inStockCount = medicines.filter(m => m.status === 'in-stock').length;
  const lowStockCount = medicines.filter(m => m.status === 'low-stock').length;
  const outOfStockCount = medicines.filter(m => m.status === 'out-of-stock').length;
  const expiredCount = medicines.filter(m => m.status === 'expired').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
      {/* Header */}
      <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-24-bold text-white">Inventory Management</span>
                <p className="text-14-regular text-dark-700">Manage medicine stock and supplies</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{inStockCount}</div>
                <div className="text-14-regular text-green-400">In Stock</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{lowStockCount}</div>
                <div className="text-14-regular text-yellow-400">Low Stock</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingDown className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{outOfStockCount}</div>
                <div className="text-14-regular text-red-400">Out of Stock</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-32-bold text-white">{expiredCount}</div>
                <div className="text-14-regular text-gray-400">Expired</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-dark-600" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicines..."
                className="shad-input pl-10 w-full text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="shad-select-trigger text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="shad-select-trigger text-white"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-24-bold text-white">Medicine Inventory</h2>
          </div>

          <div className="space-y-4">
            {filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-6 hover:border-dark-500/80 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-20-bold text-white">{medicine.name}</h3>
                        {getStatusBadge(medicine.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-14-regular text-dark-700">
                        <div>
                          <span className="text-white">Category:</span> {medicine.category}
                        </div>
                        <div>
                          <span className="text-white">Manufacturer:</span> {medicine.manufacturer}
                        </div>
                        <div>
                          <span className="text-white">Batch:</span> {medicine.batchNumber}
                        </div>
                        <div>
                          <span className="text-white">Location:</span> {medicine.location}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-14-regular text-dark-700">
                        <div>
                          <span className="text-white">Quantity:</span> {medicine.quantity}
                        </div>
                        <div>
                          <span className="text-white">Min Level:</span> {medicine.minStockLevel}
                        </div>
                        <div>
                          <span className="text-white">Unit Price:</span> ${medicine.unitPrice}
                        </div>
                        <div>
                          <span className="text-white">Expires:</span> {medicine.expiryDate}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-12-regular">
                          <span className="text-dark-600">Stock Level</span>
                          <span className="text-white">{medicine.quantity} / {medicine.minStockLevel * 2}</span>
                        </div>
                        {getStockLevelBar(medicine.quantity, medicine.minStockLevel)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditMedicine(medicine)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
                <Package className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-24-bold text-white mb-4">No medicines found</h3>
              <p className="text-16-regular text-dark-700 max-w-md mx-auto">
                No medicines match your current search criteria. Try adjusting your filters or add new medicines.
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-24-bold text-white">
                  {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMedicine(null);
                    setNewMedicine({
                      name: '',
                      category: '',
                      manufacturer: '',
                      batchNumber: '',
                      expiryDate: '',
                      quantity: 0,
                      minStockLevel: 0,
                      unitPrice: 0,
                      location: ''
                    });
                  }}
                  className="text-dark-600 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="shad-input-label block mb-2">Medicine Name *</label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Lisinopril 10mg"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Category *</label>
                  <input
                    type="text"
                    value={newMedicine.category}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Cardiovascular"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Manufacturer *</label>
                  <input
                    type="text"
                    value={newMedicine.manufacturer}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder="e.g., Pfizer"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Batch Number *</label>
                  <input
                    type="text"
                    value={newMedicine.batchNumber}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="e.g., LIS001"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Location *</label>
                  <input
                    type="text"
                    value={newMedicine.location}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., A-1-01"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Quantity *</label>
                  <input
                    type="number"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div>
                  <label className="shad-input-label block mb-2">Minimum Stock Level *</label>
                  <input
                    type="number"
                    value={newMedicine.minStockLevel}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="shad-input-label block mb-2">Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMedicine.unitPrice}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className="shad-input w-full text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMedicine(null);
                    setNewMedicine({
                      name: '',
                      category: '',
                      manufacturer: '',
                      batchNumber: '',
                      expiryDate: '',
                      quantity: 0,
                      minStockLevel: 0,
                      unitPrice: 0,
                      location: ''
                    });
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg text-16-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingMedicine ? handleUpdateMedicine : handleAddMedicine}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-16-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;