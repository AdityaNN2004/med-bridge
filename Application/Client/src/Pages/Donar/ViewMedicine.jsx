import React, { useState, useEffect, useRef } from "react";
import {
  getAllUnListedMedicines,
  getExpiredMedicines,
  getCloseToExpiredMedicines,
  getActiveMedicines,
  deleteMedicine,
  changelistingstatusmedicine,
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
} from "lucide-react";
import DonorNavbar from "./DonorNavbar";

const DUMMY_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae";

function ViewMedicine() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [listingId, setListingId] = useState(null); // ✅ NEW

  // ================= LOAD MEDICINES =================
  const loadMedicines = async (selectedFilter = "all") => {
    try {
      let response;

      switch (selectedFilter) {
        case "expired":
          response = await getExpiredMedicines();
          break;
        case "close":
          response = await getCloseToExpiredMedicines();
          break;
        case "active":
          response = await getActiveMedicines();
          break;
        case "all":
        default:
          response = await getAllUnListedMedicines();
      }

      const mapped =
        response?.data?.map((med) => ({
          ...med,
          expiryDate: med.expiry_date,
        })) || [];

      setMedicines(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load medicines");
      setMedicines([]);
    }
  };

  useEffect(() => {
    searchRef.current?.focus();
    loadMedicines(filter);
  }, [filter]);

  // ================= DELETE =================
  const handleDeleteMedicine = async (id) => {
    try {
      await deleteMedicine(id);
      toast.success("Medicine deleted successfully!");
      loadMedicines(filter);
    } catch {
      toast.error("Failed to delete medicine");
    }
  };

  // ================= LIST / UNLIST =================
  const handleListClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowConfirm(true);
  };

  const confirmListMedicine = async () => {
    if (!selectedMedicine) return;

    try {
      setListingId(selectedMedicine.id);

      // ✅ CALL UNLIST/LIST API
      await changelistingstatusmedicine(selectedMedicine.id);

      toast.success("Medicine listing status updated!");

      // ✅ Remove from current view after success
      setMedicines((prev) =>
        prev.filter((m) => m.id !== selectedMedicine.id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update listing status");
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

  // ================= SEARCH =================
  const searchedMedicines = medicines.filter((med) =>
    med.medicineName.toLowerCase().includes(search.toLowerCase())
  );

  // ================= EXPIRY HELPERS =================
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return -1;
    const today = new Date();
    const expiry = new Date(expiryDate + "T23:59:59");
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

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
    <div className="min-h-screen bg-gray-100">
      <DonorNavbar />

      <div className="max-w-6xl mx-auto px-6 py-28">
        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine"
            className="flex-1 p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-3">
            {["all", "active", "close", "expired"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white border hover:bg-gray-50"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/donor/add-medicine")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" /> Add New
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {searchedMedicines.map((med) => {
            const daysRemaining = getDaysUntilExpiry(med.expiryDate);

            return (
              <div
                key={med.id}
                className="flex bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 gap-4 border"
              >
                <img
                  src={med.photoUrl || DUMMY_IMAGE}
                  onError={(e) => (e.target.src = DUMMY_IMAGE)}
                  alt={med.medicineName}
                  className="w-28 h-28 rounded-lg object-cover border"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {med.medicineName}
                  </h3>

                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Expires: {med.expiryDate}
                  </p>

                  <p
                    className={`mt-1 flex items-center gap-2 px-2 py-1 rounded-full w-max text-sm font-medium ${daysBadgeColor(
                      daysRemaining
                    )}`}
                  >
                    {daysBadgeIcon(daysRemaining)}
                    {daysRemaining < 0
                      ? "Expired"
                      : `${daysRemaining} days remaining`}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Package className="w-4 h-4" />
                    {med.quantity}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleListClick(med)}
                    disabled={daysRemaining < 0 || listingId === med.id}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      daysRemaining < 0 || listingId === med.id
                        ? "bg-gray-200 text-gray-400"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {listingId === med.id ? "Processing..." : "List"}
                  </button>

                  <button
                    onClick={() => handleDeleteMedicine(med.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONFIRM MODAL */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-bold mb-4">
                List {selectedMedicine?.medicineName}?
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={cancelListMedicine}
                  className="flex-1 bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmListMedicine}
                  className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
                >
                  Yes, List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ViewMedicine;
