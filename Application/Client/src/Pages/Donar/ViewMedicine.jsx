import React, { useState, useEffect, useRef } from "react";
import {
  getAllUnListedMedicines,
  getExpiredMedicines,
  getCloseToExpiredMedicines,
  getActiveMedicines,
  deleteMedicine,
  ChangeListingStatusToListed
} from "../../Services/MedicineServices";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Calendar,
  Package,
  Plus,
  CheckCircle,
  X,
  Clock,
  Pill,
  Search,
  Trash2,
  List,
  Filter,
  AlertCircle,
  Loader2
} from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import { getEntityId,isTokenExpired } from "../../utils/jwtUtils";
const DUMMY_IMAGE = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae";

const donar_id =getEntityId();

function ViewMedicine() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MEDICINES ================= */
  const loadMedicines = async (selectedFilter = "all") => {
    try {
      setLoading(true);
      let response;

      switch (selectedFilter) {
        case "expired":
          response = await getExpiredMedicines(donar_id);
          break;
        case "close":
          response = await getCloseToExpiredMedicines(donar_id);
          break;
        case "active":
          response = await getActiveMedicines(donar_id);
          break;
        case "all":
        default:
          response = await getAllUnListedMedicines(donar_id);
      }

      const mapped =
        response?.data?.map((med) => ({
          ...med,
          expiryDate: med.expiry_date,
        })) || [];

      setMedicines(mapped);
    } catch (error) {
      console.error(error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchRef.current?.focus();
    loadMedicines(filter);
  }, [filter]);

  /* ================= DELETE ================= */
  const handleDeleteMedicine = async (id) => {
    try {
      await deleteMedicine(id);
      toast.success("Medicine deleted successfully!");
      loadMedicines(filter);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete medicine");
    }
  };

  /* ================= LIST ================= */
  const handleListClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowConfirm(true);
  };

  // const confirmListMedicine = async () => {
  //   if (!selectedMedicine) return;

  //   try {
  //     setListingId(selectedMedicine.id);
  //     const res =  await ChangeListingStatusToListed(selectedMedicine.id);
  //     console.log(res);
  //     toast.success("Medicine listed successfully!");
  //     setMedicines((prev) => prev.filter((m) => m.id !== selectedMedicine.id));
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to list medicine");
  //   } finally {
  //     setListingId(null);
  //     setShowConfirm(false);
  //     setSelectedMedicine(null);
  //   }
  // };

  const confirmListMedicine = async () => {
  if (!selectedMedicine) return;

  try {
    setListingId(selectedMedicine.id);

    const res = await ChangeListingStatusToListed(selectedMedicine.id);

    // 👇 IMPORTANT: check backend response
    if (res?.data?.status === "Failure") {
      toast.error(res.data.message || "Cannot list expired medicine");
      return;
    }

    toast.success( "Medicine listed successfully!");

    // remove from list only if success
    setMedicines((prev) =>
      prev.filter((m) => m.id !== selectedMedicine.id)
    );

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Failed to list medicine"
    );
  } finally {
    setListingId(null);
    setShowConfirm(false);
    setSelectedMedicine(null);
  }
};

  const cancelListMedicine = () => {
    setShowConfirm(false);
    setSelectedMedicine(null);
  };

  /* ================= SEARCH ================= */
  const searchedMedicines = medicines.filter((med) =>
    med.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= EXPIRY HELPERS ================= */
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return -1;
    const today = new Date();
    const expiry = new Date(expiryDate + "T23:59:59");
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (days) => {
    if (days < 0) return { 
      badge: "bg-red-100 text-red-700",
      icon: <X className="w-4 h-4" />,
      label: "Expired"
    };
    if (days <= 30) return { 
      badge: "bg-orange-100 text-orange-700",
      icon: <Clock className="w-4 h-4" />,
      label: `${days} days left`
    };
    return { 
      badge: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-4 h-4" />,
      label: `${days} days left`
    };
  };

  const filterOptions = [
    { value: "all", label: "All", icon: <Package className="w-4 h-4" /> },
    { value: "active", label: "Active", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "close", label: "Expiring Soon", icon: <Clock className="w-4 h-4" /> },
    { value: "expired", label: "Expired", icon: <X className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DonorNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Medicines</h1>
              <p className="text-gray-600">Manage your medicine inventory</p>
            </div>
            <button
              onClick={() => navigate("/donor/add-medicine")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Medicine
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for medicines by name..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all outline-none shadow-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm mr-2">
              <Filter className="w-4 h-4" />
              Filter:
            </div>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  filter === option.value
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading medicines...</p>
            </div>
          </div>
        ) : searchedMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-500 mb-6">
              {search ? "Try adjusting your search" : "Start by adding your first medicine"}
            </p>
            <button
              onClick={() => navigate("/donor/add-medicine")}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {searchedMedicines.map((med) => {
              const daysRemaining = getDaysUntilExpiry(med.expiryDate);
              const status = getExpiryStatus(daysRemaining);

              return (
                <div
                  key={med.id}
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                    daysRemaining < 0 ? 'border-red-200' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Medicine Image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-md">
                          <img
                            src={med.medicineImageUrl || DUMMY_IMAGE}
                            onError={(e) => (e.target.src = DUMMY_IMAGE)}
                            alt={med.medicineName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {daysRemaining < 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                            <AlertCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Medicine Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 truncate">
                          {med.medicineName}
                        </h3>

                        <div className="space-y-2">
                          {/* Expiry Date */}
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-gray-600">
                              Expires: <span className="font-semibold text-gray-900">{med.expiryDate}</span>
                            </span>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                              <Pill className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-gray-600">
                              Quantity: <span className="font-semibold text-gray-900">{med.quantity}</span>
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.badge}`}>
                            {status.icon}
                            {status.label}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleListClick(med)}
                        disabled={daysRemaining < 0 || listingId === med.id}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                          daysRemaining < 0 || listingId === med.id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
                        }`}
                      >
                        {listingId === med.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <List className="w-4 h-4" />
                            List Medicine
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteMedicine(med.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 hover:shadow-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results count */}
        {!loading && searchedMedicines.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{searchedMedicines.length}</span> medicine{searchedMedicines.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-white text-center">
                List Medicine?
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to list <span className="font-semibold text-gray-900">{selectedMedicine?.medicineName}</span> for donation?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelListMedicine}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={confirmListMedicine}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Yes, List It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default ViewMedicine;