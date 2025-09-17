import React, { useState } from "react";
import {
  Plus,
  Users,
  Search,
  Eye,
  Pill,
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-400 border border-dark-500 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-18-bold sm:text-20-bold lg:text-24-bold text-white">
              Patient Details
            </h2>
            <button
              onClick={onClose}
              className="text-dark-600 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Patient Header */}
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-dark-500/50 mx-auto sm:mx-0"
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-20-bold sm:text-24-bold lg:text-32-bold text-white mb-2">
                  {patient.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-14-regular lg:text-16-regular text-dark-700">
                  <span>{patient.age} years old</span>
                  <span>{patient.gender}</span>
                  <span>ID: {patient.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "medications", label: "Current Meds", icon: Pill },
              { id: "history", label: "History", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-12-medium sm:text-14-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-dark-400/50 text-dark-700 hover:bg-dark-400/70 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-14-regular text-dark-700">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{patient.email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-16-semibold text-white mb-3">
                      Pharmacy Information
                    </h3>
                    <div className="space-y-2 text-14-regular text-dark-700">
                      <p>Preferred Pharmacy: {patient.preferredPharmacy}</p>
                      <p>Insurance: {patient.insuranceProvider}</p>
                      <p>Total Prescriptions: {patient.totalPrescriptions}</p>
                      <p>Total Spent: ${patient.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-16-semibold text-white mb-3">
                      Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-12-medium text-red-400"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-16-semibold text-white mb-3">
                      Current Medications
                    </h3>
                    <div className="space-y-2">
                      {patient.currentMedications.map((medication, index) => (
                        <div
                          key={index}
                          className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30"
                        >
                          <span className="text-14-medium text-blue-400">
                            {medication}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "medications" && (
              <div className="space-y-4">
                <h3 className="text-18-bold text-white">Current Medications</h3>
                {patient.currentMedications.map((medication, index) => (
                  <div
                    key={index}
                    className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-16-medium text-white">
                        {medication}
                      </span>
                      <button className="text-12-medium text-blue-400 hover:text-blue-300 px-3 py-1 border border-blue-500/30 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <h3 className="text-18-bold text-white">Medication History</h3>
                {patient.medicationHistory.map((med) => (
                  <div key={med.id} className="bg-dark-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-16-medium text-white">
                        {med.medication}
                      </h4>
                      <span
                        className={`text-12-medium px-3 py-1 rounded-full ${
                          med.status === "ongoing"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {med.status}
                      </span>
                    </div>
                    <div className="text-14-regular text-dark-700">
                      <p>Dosage: {med.dosage}</p>
                      <p>Prescribed by: {med.prescribedBy}</p>
                      <p>Dispensed: {med.dispensedDate}</p>
                      <p>Cost: ${med.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PharmacistPatients = ({ onBack }) => {
  const [patients] = useState([
    {
      id: "P001",
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      allergies: ["Penicillin", "Peanuts"],
      currentMedications: ["Lisinopril 10mg", "Metformin 500mg"],
      lastVisit: "2024-01-15",
      totalPrescriptions: 12,
      totalSpent: 450.75,
      preferredPharmacy: "MediCura Pharmacy",
      insuranceProvider: "BlueCross BlueShield",
      medicationHistory: [
        {
          id: "1",
          medication: "Lisinopril 10mg",
          dosage: "Once daily",
          prescribedBy: "Dr. Sarah Safari",
          dispensedDate: "2024-01-15",
          cost: 25.5,
          status: "ongoing",
        },
        {
          id: "2",
          medication: "Amoxicillin 500mg",
          dosage: "Three times daily",
          prescribedBy: "Dr. Ava Williams",
          dispensedDate: "2023-12-20",
          cost: 15.75,
          status: "completed",
        },
      ],
    },
    {
      id: "P002",
      name: "Emily Johnson",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 234-5678",
      email: "emily.johnson@email.com",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      allergies: ["Shellfish"],
      currentMedications: ["Birth Control", "Vitamin D"],
      lastVisit: "2024-01-10",
      totalPrescriptions: 8,
      totalSpent: 320.25,
      preferredPharmacy: "MediCura Pharmacy",
      insuranceProvider: "Aetna",
      medicationHistory: [
        {
          id: "1",
          medication: "Birth Control Pills",
          dosage: "Once daily",
          prescribedBy: "Dr. Sarah Safari",
          dispensedDate: "2024-01-10",
          cost: 45.0,
          status: "ongoing",
        },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => {
    const lastVisit = new Date(p.lastVisit);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return lastVisit >= monthAgo;
  }).length;
  const totalRevenue = patients.reduce((sum, p) => sum + p.totalSpent, 0);
  const avgSpending = totalRevenue / patients.length;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-400">
        {/* Header */}
        <div className="bg-dark-200/80 backdrop-blur-xl border-b border-dark-500/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <span className="text-20-bold lg:text-24-bold text-white">
                  Patient Records
                </span>
                <p className="text-12-regular lg:text-14-regular text-dark-700">
                  Medication history and profiles
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {totalPatients}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-blue-400">
                    Total Patients
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    {activePatients}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-green-400">
                    Active
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    ${totalRevenue.toFixed(0)}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-purple-400">
                    Total Revenue
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-4 lg:p-6">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <div className="text-20-bold lg:text-32-bold text-white">
                    ${avgSpending.toFixed(0)}
                  </div>
                  <div className="text-10-regular lg:text-14-regular text-yellow-400">
                    Avg Spending
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-dark-600" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name or ID..."
                className="shad-input pl-10 w-full text-white"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h2 className="text-18-bold lg:text-24-bold text-white">
                Patient List
              </h2>
            </div>

            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-gradient-to-r from-dark-300/50 to-dark-400/30 backdrop-blur-sm border border-dark-500/50 rounded-2xl p-4 lg:p-6 hover:border-dark-500/80 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-dark-500/50 flex-shrink-0"
                      />

                      <div className="space-y-2 min-w-0 flex-1">
                        <h3 className="text-16-bold lg:text-20-bold text-white">
                          {patient.name}
                        </h3>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Age:</span>{" "}
                            {patient.age}
                          </div>
                          <div>
                            <span className="text-white">Gender:</span>{" "}
                            {patient.gender}
                          </div>
                          <div>
                            <span className="text-white">ID:</span> {patient.id}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-12-regular lg:text-14-regular text-dark-700">
                          <div>
                            <span className="text-white">Last Visit:</span>{" "}
                            {patient.lastVisit}
                          </div>
                          <div>
                            <span className="text-white">Prescriptions:</span>{" "}
                            {patient.totalPrescriptions}
                          </div>
                          <div>
                            <span className="text-white">Total Spent:</span> $
                            {patient.totalSpent.toFixed(2)}
                          </div>
                        </div>

                        {patient.allergies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-12-regular text-dark-600">
                              Allergies:
                            </span>
                            {patient.allergies
                              .slice(0, 2)
                              .map((allergy, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-10-medium text-red-400"
                                >
                                  {allergy}
                                </span>
                              ))}
                            {patient.allergies.length > 2 && (
                              <span className="text-10-medium text-dark-600">
                                +{patient.allergies.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-start lg:items-end gap-2 lg:gap-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-12-medium lg:text-14-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                          <Phone className="w-4 h-4" />
                        </button>

                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-2 lg:p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 lg:py-20">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 lg:mb-8 border border-green-500/20">
                  <Users className="w-8 h-8 lg:w-12 lg:h-12 text-green-400" />
                </div>
                <h3 className="text-20-bold lg:text-24-bold text-white mb-4">
                  No patients found
                </h3>
                <p className="text-14-regular lg:text-16-regular text-dark-700 max-w-md mx-auto">
                  No patients match your search criteria. Try adjusting your
                  search.
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

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        patient={selectedPatient}
      />
    </>
  );
};

export default PharmacistPatients;
