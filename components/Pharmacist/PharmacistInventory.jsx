import React, { useEffect, useState } from "react";
import {
  Plus,
  Package,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  X,
  Factory,
  Hash,
  MapPin,
  Boxes,
  AlertCircle,
  ChevronDown,
  Check,
  RefreshCcw,
  IndianRupee,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormInput from "../FormUI/FormInput";

const AddMedicineDialog = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editingMedicine,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [medicineData, setMedicineData] = useState({
    name: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    quantity: 0,
    minStockLevel: 0,
    unitPrice: 0,
    location: "",
  });
  const [reasonOfEdit, setReasonOfEdit] = useState("");

  useEffect(() => {
    if (editingMedicine) {
      setMedicineData(editingMedicine);
    } else {
      setMedicineData({
        name: "",
        category: "",
        manufacturer: "",
        batchNumber: "",
        expiryDate: "",
        quantity: 0,
        minStockLevel: 0,
        unitPrice: 0,
        location: "",
      });
    }
  }, [editingMedicine]);

  const categories = [
    "Cardiovascular",
    "Antibiotic",
    "Analgesic",
    "Antipyretic",
    "Antihistamine",
    "Antidiabetic",
    "Antidepressant",
  ];

  const handleCategorySelect = (cat) => {
    setMedicineData((prev) => ({ ...prev, category: cat }));
    setShowCategoryDropdown(false);
  };

  const handleCustomCategory = () => {
    if (customCategory.trim() !== "") {
      setMedicineData((prev) => ({ ...prev, category: customCategory.trim() }));
      setCustomCategory("");
      setShowCategoryDropdown(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Medicine data:", medicineData);
    if (!editingMedicine) {
      onAdd(medicineData);
    } else {
      onEdit(medicineData, reasonOfEdit);
    }
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        setMedicineData({
          name: "",
          category: "",
          manufacturer: "",
          batchNumber: "",
          expiryDate: "",
          quantity: 0,
          minStockLevel: 0,
          unitPrice: 0,
          location: "",
        });
        setReasonOfEdit("");
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-dark-400 border border-dark-500 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
          </DialogTitle>
          <DialogDescription className="text-dark-600">
            Fill in the medicine details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="name"
              label="Medicine Name"
              value={medicineData.name}
              onChange={(e) =>
                setMedicineData({ ...medicineData, name: e.target.value })
              }
              placeholder="e.g., Paracetamol 500mg"
              required
              icon={<Package className="w-5 h-5" />}
            />

            <FormInput
              id="manufacturer"
              label="Manufacturer"
              value={medicineData.manufacturer}
              onChange={(e) =>
                setMedicineData({
                  ...medicineData,
                  manufacturer: e.target.value,
                })
              }
              placeholder="e.g., Cipla"
              required
              icon={<Factory className="w-5 h-5" />}
            />

            {/* Category Dropdown */}
            <div className="sm:col-span-2">
              <label className="shad-input-label block mb-2">Category *</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full bg-dark-400 border border-dark-500 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:border-green-500 transition-colors"
                >
                  <span>{medicineData.category || "Select a category"}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-dark-600 transition-transform ${
                      showCategoryDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-dark-400 border border-dark-500 rounded-lg shadow-lg z-10 overflow-hidden">
                    <div className="p-3 border-b border-dark-500">
                      <span className="text-14-medium text-dark-700">
                        Categories
                      </span>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className="w-full p-4 flex items-center justify-between hover:bg-dark-500 transition-colors text-left"
                        >
                          <span className="text-16-medium text-white">
                            {cat}
                          </span>
                          {medicineData.category === cat && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                      ))}

                      <div className="border-t border-dark-500 my-2"></div>

                      {/* Custom Category */}
                      <div className="p-3 flex gap-2 items-center">
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Add custom category"
                          className="shad-input w-full text-white bg-dark-300 border border-dark-500 rounded-lg"
                        />
                        <Button
                          type="button"
                          onClick={handleCustomCategory}
                          size="icon"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <FormInput
              id="batchNumber"
              label="Batch Number"
              value={medicineData.batchNumber}
              onChange={(e) =>
                setMedicineData({
                  ...medicineData,
                  batchNumber: e.target.value,
                })
              }
              placeholder="e.g., PCM123"
              required
              icon={<Hash className="w-5 h-5" />}
            />

            <FormInput
              id="expiryDate"
              label="Expiry Date"
              type="date"
              value={medicineData.expiryDate}
              onChange={(e) =>
                setMedicineData({ ...medicineData, expiryDate: e.target.value })
              }
              required
              icon={<Calendar className="w-5 h-5" />}
            />

            <FormInput
              id="quantity"
              label="Quantity"
              type="number"
              value={medicineData.quantity}
              onChange={(e) =>
                setMedicineData({
                  ...medicineData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
              disabled={editingMedicine}
              icon={<Boxes className="w-5 h-5" />}
            />

            <FormInput
              id="minStockLevel"
              label="Minimum Stock Level"
              type="number"
              value={medicineData.minStockLevel}
              onChange={(e) =>
                setMedicineData({
                  ...medicineData,
                  minStockLevel: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
              required
              icon={<AlertCircle className="w-5 h-5" />}
            />

            <FormInput
              id="unitPrice"
              label="Unit Price ($)"
              type="number"
              value={medicineData.unitPrice}
              onChange={(e) =>
                setMedicineData({
                  ...medicineData,
                  unitPrice: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              required
              icon={<IndianRupee className="w-5 h-5" />}
            />

            <FormInput
              id="location"
              label="Storage Location"
              value={medicineData.location}
              onChange={(e) =>
                setMedicineData({ ...medicineData, location: e.target.value })
              }
              placeholder="e.g., Rack A3"
              required
              icon={<MapPin className="w-5 h-5" />}
            />
          </div>

          {editingMedicine && (
            <FormInput
              id="reason"
              label="Reason for Updating Metadata"
              value={reasonOfEdit}
              onChange={(e) => setReasonOfEdit(e.target.value)}
              placeholder="e.g., Mistake in batch number"
              required={editingMedicine}
              icon={<Hash className="w-5 h-5" />}
            />
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {editingMedicine ? "Update Medicine" : "Add Medicine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RestockModal = ({ medicine }) => {
  const [open, setOpen] = useState(false);
  const [restockAmount, setRestockAmount] = useState(0);

  const handleRestock = () => {
    console.log(medicine);
    console.log(`Restocked ${medicine.name} with ${restockAmount} units`);
    console.log(typeof restockAmount);
    // 👉 call your API here
    setOpen(false); // close modal after restock
    setRestockAmount(0);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 
                   rounded-full text-green-400 text-12-medium lg:text-14-medium 
                   hover:bg-green-500/30 transition-all"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Restock
      </button>

      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setRestockAmount(0);
        }}
      >
        <DialogContent className="sm:max-w-md bg-gray-900 border border-green-700 shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-green-400 font-semibold">
              Restock Medicine
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter the quantity to add for{" "}
              <span className="text-green-400 font-semibold">
                {medicine.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-3">
            <Input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              className="bg-gray-800 border-green-700 text-white placeholder-gray-400 
                         focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="bg-gray-800 border border-green-700 text-green-400 hover:bg-gray-700 rounded-3xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRestock}
              disabled={!restockAmount}
              className="bg-green-600 hover:bg-green-500 text-white rounded-3xl"
            >
              Confirm Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PharmacistInventory = ({ onBack, pharmacistData }) => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicine();
  }, []);

  const fetchMedicine = async () => {
    setLoading(true); // make sure to show loader when fetch starts
    try {
      const res = await fetch("/api/medicines");
      const data = await res.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false); // hide loader only after fetch is done
    }
  };

  const refreshMedicine = async () => {
    try {
      const res = await fetch("/api/medicines");
      const data = await res.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(medicines.map((m) => m.category))),
  ];

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || medicine.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || medicine.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStatus = (medicine) => {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);

    if (expiryDate < today) return "expired";
    if (medicine.quantity === 0) return "out-of-stock";
    if (medicine.quantity <= medicine.minStockLevel) return "low-stock";
    return "in-stock";
  };

  const getStatusBadge = (currentStock, minStock, status) => {
    console.log(
      parseInt(currentStock),
      parseInt(minStock),
      status,
      currentStock,
      minStock,
      status
    );
    // Check expired first (always takes priority)
    if (status === "expired") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span className="text-10-medium sm:text-12-medium text-gray-400">
            Expired
          </span>
        </div>
      );
    }

    // Handle stock levels
    if (parseInt(currentStock) === 0) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-10-medium sm:text-12-medium text-red-400">
            Out of Stock
          </span>
        </div>
      );
    }

    if (parseInt(currentStock) <= parseInt(minStock)) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-10-medium sm:text-12-medium text-yellow-400">
            Low Stock
          </span>
        </div>
      );
    }

    // Default: in stock
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-10-medium sm:text-12-medium text-green-400">
          In Stock
        </span>
      </div>
    );
  };

  const getStockLevelBar = (current, min) => {
    // Convert varchar -> number safely
    const curr = parseInt(current, 10) || 0;
    const minimum = parseInt(min, 10) || 0;

    // percentage capped at 100
    const percentage =
      minimum > 0 ? Math.min((curr / (minimum * 2)) * 100, 100) : 0;

    let colorClass = "bg-green-500";
    if (curr === 0) colorClass = "bg-red-500";
    else if (curr <= minimum) colorClass = "bg-yellow-500";

    return (
      <div className="w-full bg-dark-500 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };


  const handleAddMedicine = async (newMedicine) => {
    try {
      console.log(newMedicine);

      const data = {
        ...newMedicine,
        pharmacistId: pharmacistData.userId,
      };

      console.log(data);

      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to add medicine");
      }

      refreshMedicine();
      setMessage(`${newMedicine.name} added to inventory`);
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      console.error("Error adding medicine:", err);
    }
  };

  const handleEditMedicine = async (updatedMedicine, reason) => {
    try {
      const data = {
        ...updatedMedicine,
        pharmacistId: pharmacistData.userId,
        reason,
      };

      console.log(data);
      console.log(reason);
      const res = await fetch(`/api/medicines/${updatedMedicine.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error updating medicine:", error);
        return;
      }

      refreshMedicine();
      setMessage(`${updatedMedicine.name} edited in inventory`);
      setMessageType("success");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (err) {
      console.error("Unexpected error while editing medicine:", err);
    }
  };

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);
    setShowAddModal(true);
  };

  const handleDeleteMedicine = (id) => {
    const medicine = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
    setMessage(`${medicine?.name} removed from inventory`);
    setMessageType("success");

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const inStockCount = medicines.filter((m) => m.status === "in-stock").length;
  const lowStockCount = medicines.filter(
    (m) => m.status === "low-stock"
  ).length;
  const outOfStockCount = medicines.filter(
    (m) => m.status === "out-of-stock"
  ).length;
  const expiredCount = medicines.filter((m) => m.status === "expired").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg animate-pulse">
            Loading Medicine Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="text-20-bold lg:text-24-bold text-white">
                    Medicine Inventory
                  </span>
                  <p className="text-12-regular lg:text-14-regular text-dark-700">
                    Manage medicine stock
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl text-12-medium lg:text-16-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Add Medicine</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Message */}
          {message && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm mb-6 lg:mb-8 ${
                messageType === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-14-regular lg:text-16-regular">
                {message}
              </span>
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
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {inStockCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    In Stock
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {lowStockCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">
                    Low Stock
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingDown className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {outOfStockCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-red-400">
                    Out of Stock
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {expiredCount}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-gray-400">
                    Expired
                  </div>
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
                  placeholder="Search medicines..."
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
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="shad-select-trigger text-white flex-1"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medicine List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <div className="flex  items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h2 className="text-18-bold lg:text-24-bold text-white">
                  Medicine Inventory
                </h2>
              </div>
              <Button onClick={() => refreshMedicine()} className="btn2">
                <RefreshCcw />
                Refresh Medicine Data
              </Button>
            </div>

            <div className="space-y-4">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>

                      <div className="space-y-3 min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="text-16-bold lg:text-20-bold text-white">
                            {medicine.name}
                          </h3>
                          {getStatusBadge(
                            medicine.quantity,
                            medicine.minStockLevel,
                            medicine.status
                          )}
                          {medicine.quantity <= medicine.minStockLevel && (
                            <RestockModal medicine={medicine} />
                          )}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Category:</span>{" "}
                            {medicine.category}
                          </div>
                          <div>
                            <span className="text-white">Manufacturer:</span>{" "}
                            {medicine.manufacturer}
                          </div>
                          <div>
                            <span className="text-white">Batch:</span>{" "}
                            {medicine.batchNumber}
                          </div>
                          <div>
                            <span className="text-white">Location:</span>{" "}
                            {medicine.location}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Quantity:</span>{" "}
                            {medicine.quantity}
                          </div>
                          <div>
                            <span className="text-white">Min Level:</span>{" "}
                            {medicine.minStockLevel}
                          </div>
                          <div>
                            <span className="text-white">Unit Price:</span> $
                            {medicine.unitPrice}
                          </div>
                          <div>
                            <span className="text-white">Expires:</span>{" "}
                            {medicine.expiryDate}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-10-regular lg:text-12-regular">
                            <span className="text-dark-600">Stock Level</span>
                            <span className="text-white">
                              {medicine.quantity} / {medicine.minStockLevel * 2}
                            </span>
                          </div>
                          {getStockLevelBar(
                            medicine.quantity,
                            medicine.minStockLevel
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col justify-end lg:items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(medicine)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-blue-500/20">
                  <Package className="w-8 h-8 lg:w-12 lg:h-12 text-blue-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No medicines found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No medicines match your search criteria. Try adjusting your
                  filters.
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

      {/* Add/Edit Medicine Modal */}
      <AddMedicineDialog
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingMedicine(null);
        }}
        onAdd={handleAddMedicine}
        onEdit={handleEditMedicine}
        editingMedicine={editingMedicine}
      />
    </>
  );
};

export default PharmacistInventory;
