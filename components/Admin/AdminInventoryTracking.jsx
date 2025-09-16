import React, { useState } from 'react';
import { Plus, Package, Search, Edit, Trash2, AlertTriangle, CheckCircle, Calendar, TrendingUp, TrendingDown, Bed, Monitor, Pill, X } from 'lucide-react';

const AddItemModal = ({ isOpen, onClose, onAdd, editingItem }) => {
  const [itemData, setItemData] = useState({
    name: editingItem?.name || '',
    category: editingItem?.category || 'medical-equipment',
    quantity: editingItem?.quantity || 0,
    minStockLevel: editingItem?.minStockLevel || 0,
    location: editingItem?.location || '',
    condition: editingItem?.condition || 'excellent',
    lastMaintenance: editingItem?.lastMaintenance || '',
    nextMaintenance: editingItem?.nextMaintenance || '',
    purchaseDate: editingItem?.purchaseDate || '',
    cost: editingItem?.cost || 0,
    supplier: editingItem?.supplier || '',
    status: editingItem?.status || 'available'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(itemData);
    setItemData({
      name: '',
      category: 'medical-equipment',
      quantity: 0,
      minStockLevel: 0,
      location: '',
      condition: 'excellent',
      lastMaintenance: '',
      nextMaintenance: '',
      purchaseDate: '',
      cost: 0,
      supplier: '',
      status: 'available'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              {editingItem ? 'Edit Inventory Item' : 'Add New Item'}
            </h2>
            <button onClick={onClose} className="text-dark-600 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="shad-input-label block mb-2">Item Name *</label>
                <input
                  type="text"
                  value={itemData.name}
                  onChange={(e) => setItemData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Hospital Bed - Electric"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Category *</label>
                <select
                  value={itemData.category}
                  onChange={(e) => setItemData(prev => ({ ...prev, category: e.target.value }))}
                  className="shad-select-trigger w-full text-white"
                  required
                >
                  <option value="medical-equipment">Medical Equipment</option>
                  <option value="furniture">Furniture</option>
                  <option value="medicines">Medicines</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Quantity *</label>
                <input
                  type="number"
                  value={itemData.quantity}
                  onChange={(e) => setItemData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Min Stock Level *</label>
                <input
                  type="number"
                  value={itemData.minStockLevel}
                  onChange={(e) => setItemData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Location *</label>
                <input
                  type="text"
                  value={itemData.location}
                  onChange={(e) => setItemData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ward A, ICU, etc."
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Condition *</label>
                <select
                  value={itemData.condition}
                  onChange={(e) => setItemData(prev => ({ ...prev, condition: e.target.value }))}
                  className="shad-select-trigger w-full text-white"
                  required
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-repair">Needs Repair</option>
                </select>
              </div>

              <div>
                <label className="shad-input-label block mb-2">Purchase Date *</label>
                <input
                  type="date"
                  value={itemData.purchaseDate}
                  onChange={(e) => setItemData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div>
                <label className="shad-input-label block mb-2">Cost ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemData.cost}
                  onChange={(e) => setItemData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="shad-input-label block mb-2">Supplier *</label>
                <input
                  type="text"
                  value={itemData.supplier}
                  onChange={(e) => setItemData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="MedEquip Solutions"
                  className="shad-input w-full text-white"
                  required
                />
              </div>

              {itemData.category === 'medical-equipment' && (
                <>
                  <div>
                    <label className="shad-input-label block mb-2">Last Maintenance</label>
                    <input
                      type="date"
                      value={itemData.lastMaintenance}
                      onChange={(e) => setItemData(prev => ({ ...prev, lastMaintenance: e.target.value }))}
                      className="shad-input w-full text-white"
                    />
                  </div>

                  <div>
                    <label className="shad-input-label block mb-2">Next Maintenance</label>
                    <input
                      type="date"
                      value={itemData.nextMaintenance}
                      onChange={(e) => setItemData(prev => ({ ...prev, nextMaintenance: e.target.value }))}
                      className="shad-input w-full text-white"
                    />
                  </div>
                </>
              )}
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
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminInventoryTracking = ({ onBack }) => {
  const [inventory, setInventory] = useState([
    {
      id: '1',
      name: 'Hospital Bed - Electric',
      category: 'furniture',
      quantity: 25,
      minStockLevel: 20,
      location: 'Ward A',
      condition: 'excellent',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-07-01',
      purchaseDate: '2023-06-15',
      cost: 2500,
      supplier: 'MedEquip Solutions',
      status: 'available'
    },
    {
      id: '2',
      name: 'Ventilator - ICU Grade',
      category: 'medical-equipment',
      quantity: 8,
      minStockLevel: 10,
      location: 'ICU',
      condition: 'good',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      purchaseDate: '2022-03-20',
      cost: 15000,
      supplier: 'Advanced Medical Tech',
      status: 'in-use'
    },
    {
      id: '3',
      name: 'Surgical Gloves (Box)',
      category: 'supplies',
      quantity: 150,
      minStockLevel: 200,
      location: 'Supply Room B',
      condition: 'excellent',
      purchaseDate: '2024-01-05',
      cost: 25,
      supplier: 'Medical Supplies Inc',
      status: 'available'
    },
    {
      id: '4',
      name: 'X-Ray Machine',
      category: 'medical-equipment',
      quantity: 2,
      minStockLevel: 2,
      location: 'Radiology',
      condition: 'needs-repair',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-02-15',
      purchaseDate: '2020-08-10',
      cost: 85000,
      supplier: 'Imaging Systems Corp',
      status: 'maintenance'
    },
    {
      id: '5',
      name: 'Wheelchairs',
      category: 'furniture',
      quantity: 30,
      minStockLevel: 25,
      location: 'Main Lobby',
      condition: 'good',
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-07-08',
      purchaseDate: '2023-09-12',
      cost: 350,
      supplier: 'Mobility Solutions',
      status: 'available'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const categories = ['all', 'medical-equipment', 'furniture', 'medicines', 'supplies'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medical-equipment':
        return <Monitor className="w-5 h-5 text-blue-400" />;
      case 'furniture':
        return <Bed className="w-5 h-5 text-green-400" />;
      case 'medicines':
        return <Pill className="w-5 h-5 text-purple-400" />;
      case 'supplies':
        return <Package className="w-5 h-5 text-yellow-400" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-10-medium sm:text-12-medium text-green-400">Available</span>
          </div>
        );
      case 'in-use':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-blue-400">In Use</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-10-medium sm:text-12-medium text-yellow-400">Maintenance</span>
          </div>
        );
      case 'out-of-order':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-10-medium sm:text-12-medium text-red-400">Out of Order</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getConditionBadge = (condition) => {
    switch (condition) {
      case 'excellent':
        return <span className="text-12-medium text-green-400">Excellent</span>;
      case 'good':
        return <span className="text-12-medium text-blue-400">Good</span>;
      case 'fair':
        return <span className="text-12-medium text-yellow-400">Fair</span>;
      case 'needs-repair':
        return <span className="text-12-medium text-red-400">Needs Repair</span>;
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

  const handleAddItem = (newItem) => {
    const item = {
      ...newItem,
      id: (inventory.length + 1).toString()
    };
    
    setInventory(prev => [...prev, item]);
    setMessage(`${newItem.name} added to inventory`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDeleteItem = (id) => {
    const item = inventory.find(i => i.id === id);
    setInventory(prev => prev.filter(item => item.id !== id));
    setMessage(`${item?.name} removed from inventory`);
    setMessageType('success');
    
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const availableCount = inventory.filter(i => i.status === 'available').length;
  const inUseCount = inventory.filter(i => i.status === 'in-use').length;
  const maintenanceCount = inventory.filter(i => i.status === 'maintenance').length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.minStockLevel).length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">Inventory Tracking</span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">Manage hospital-wide inventory</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Add Item</span>
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{availableCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">Available</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{inUseCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">In Use</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{maintenanceCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">Maintenance</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingDown className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">{lowStockCount}</div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">Low Stock</div>
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
                  placeholder="Search inventory items..."
                  className="shad-input pl-10 w-full text-white"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  <option value="all">All Categories</option>
                  <option value="medical-equipment">Medical Equipment</option>
                  <option value="furniture">Furniture</option>
                  <option value="medicines">Medicines</option>
                  <option value="supplies">Supplies</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="in-use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out-of-order">Out of Order</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inventory List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Package className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">Hospital Inventory</h2>
            </div>

            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      
                      <div className="space-y-3 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">{item.name}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Category:</span> {item.category.replace('-', ' ')}
                          </div>
                          <div>
                            <span className="text-white">Location:</span> {item.location}
                          </div>
                          <div>
                            <span className="text-white">Condition:</span> {getConditionBadge(item.condition)}
                          </div>
                          <div>
                            <span className="text-white">Supplier:</span> {item.supplier}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Quantity:</span> {item.quantity}
                          </div>
                          <div>
                            <span className="text-white">Min Level:</span> {item.minStockLevel}
                          </div>
                          <div>
                            <span className="text-white">Cost:</span> ${item.cost.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-white">Purchased:</span> {item.purchaseDate}
                          </div>
                        </div>
                        
                        {item.nextMaintenance && (
                          <div className="bg-yellow-500/20 rounded-lg px-3 py-2 inline-block">
                            <p className="text-10-regular lg:text-12-regular text-yellow-400">
                              Next Maintenance: {item.nextMaintenance}
                            </p>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-10-regular lg:text-12-regular">
                            <span className="text-dark-600">Stock Level</span>
                            <span className="text-white">{item.quantity} / {item.minStockLevel * 2}</span>
                          </div>
                          {getStockLevelBar(item.quantity, item.minStockLevel)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInventory.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-red-500/20">
                  <Package className="w-8 h-8 lg:w-12 lg:h-12 text-red-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">No items found</h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No inventory items match your search criteria. Try adjusting your filters or add new items.
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

      {/* Add/Edit Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        onAdd={handleAddItem}
        editingItem={editingItem}
      />
    </>
  );
};

export default AdminInventoryTracking;