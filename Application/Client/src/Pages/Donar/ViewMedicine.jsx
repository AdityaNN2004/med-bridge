// ViewMedicine.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAllMedicines, getAllUnListedMedicines } from "../../Services/MedicineServices";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar, Package, Plus, List, CheckCircle, X, Clock } from "lucide-react";
import DonorNavbar from "./DonorNavbar";

function ViewMedicine() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const result = await getAllUnListedMedicines();
      if (result && result.data) {
        const mappedMedicines = result.data.map((med) => ({
          ...med,
          expiryDate: med.expiry_date, // map API field
        }));
        setMedicines(mappedMedicines);
      } else {
        setMedicines([]);
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
      setMedicines([]);
      toast.error("Failed to load medicines from server.");
    }
  };

  const deleteMedicine = async (id) => {
    const newMedicines = medicines.filter((med) => med.id !== id);
    setMedicines(newMedicines);
    toast.success("Medicine deleted successfully!");
  };

  const handleListClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowConfirm(true);
  };

  const confirmListMedicine = async () => {
    if (selectedMedicine) {
      const updatedMedicines = medicines.map((med) =>
        med.id === selectedMedicine.id ? { ...med, listed: true } : med
      );
      setMedicines(updatedMedicines);
      setShowConfirm(false);
      setSelectedMedicine(null);
      toast.success("Medicine listed successfully!");
    }
  };

  const cancelListMedicine = () => {
    setShowConfirm(false);
    setSelectedMedicine(null);
  };

  // Days remaining until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return -1;
    const today = new Date();
    const expiry = new Date(expiryDate + "T23:59:59");
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredMedicines = medicines.filter((med) => {
    const searchMatch = med.medicineName.toLowerCase().includes(search.toLowerCase());
    const daysRemaining = getDaysUntilExpiry(med.expiryDate);
    const filterMatch =
      filter === "all" ||
      (filter === "expired" && daysRemaining < 0) ||
      (filter === "close" && daysRemaining <= 30 && daysRemaining >= 0);
    return searchMatch && filterMatch;
  });

  const handleAddMedicine = () => navigate("/donor/add-medicine");

  const daysBadgeColor = (days) => {
    if (days < 0) return "bg-red-100 text-red-700";
    if (days <= 30) return "bg-orange-100 text-orange-700";
    return "bg-green-100 text-green-700";
  };

  const daysBadgeIcon = (days) => {
    if (days < 0) return <X className="w-4 h-4" />;
    if (days <= 30) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-150">
      <DonorNavbar />

      <div className="max-w-6xl mx-auto px-6 py-28">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex flex-1 gap-4">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine"
              className="flex-1 p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <div className="flex gap-3">
              {["all", "expired", "close"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-sm rounded-xl font-medium transition
                    ${
                      filter === f
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-white border border-gray-200 text-gray-700 hover:shadow-md"
                    }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddMedicine}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        </div>

        {/* Medicines List */}
        <div className="space-y-4">
          {filteredMedicines.map((med) => {
            const daysRemaining = getDaysUntilExpiry(med.expiryDate);

            return (
              <div
                key={med.id}
                className="flex items-center bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 gap-4"
              >
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 relative">
                  <img
                    src={
                      med.photoUrl
                        ? med.photoUrl
                        : "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={med.medicineName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNCeXHK8oikr7iAv0XmUffsyExo6R30zkLDA&s";
                    }}
                  />
                  {med.listed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Listed
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {med.medicineName}
                  </h3>
                  <div className="text-xs text-gray-600 mt-1 space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Expires: {med.expiryDate}
                    </p>
                    <p
                      className={`flex items-center gap-2 px-2 py-1 rounded-full w-max font-medium ${daysBadgeColor(
                        daysRemaining
                      )}`}
                    >
                      {daysBadgeIcon(daysRemaining)}{" "}
                      {daysRemaining < 0
                        ? "Expired"
                        : `${daysRemaining} days remaining`}
                    </p>
                    <p className="flex items-center gap-2">
                      <Package className="w-4 h-4" /> {med.numberOfUnits} units
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleListClick(med)}
                    disabled={med.listed || daysRemaining < 0}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      med.listed || daysRemaining < 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {med.listed ? "Listed" : daysRemaining < 0 ? "Expired" : "List"}
                  </button>
                  <button
                    onClick={() => deleteMedicine(med.id)}
                    className="py-2 px-3 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <List className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  List Medicine?
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to list{" "}
                  <span className="font-semibold">{selectedMedicine?.medicineName}</span>{" "}
                  for donation?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cancelListMedicine}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmListMedicine}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Yes, List It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default ViewMedicine;
