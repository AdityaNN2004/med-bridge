import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import {
  getAllListedMedicines,
  changelistingstatusmedicine,
} from "../../Services/MedicineServices";

// Default image
const DEFAULT_MEDICINE_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop";

function ListedMedicine() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unlistingId, setUnlistingId] = useState(null); // ✅ track API call

  useEffect(() => {
    fetchListedMedicines();
  }, []);

  const fetchListedMedicines = async () => {
    try {
      const response = await getAllListedMedicines();
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load listed medicines");
    } finally {
      setLoading(false);
    }
  };

  // Expiry calculation
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return 0;

    const expiry = new Date(expiryDate.split("T")[0]);
    const today = new Date();

    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ✅ FIXED: ACTUAL API CALL
  const handleUnlist = async (medicineId) => {
    try {
      setUnlistingId(medicineId);

      // ✅ CALL BACKEND
      await changelistingstatusmedicine(medicineId);

      // ✅ Update UI only AFTER success
      setMedicines((prev) =>
        prev.filter((m) => m.id !== medicineId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unlist medicine. Please try again.");
    } finally {
      setUnlistingId(null);
    }
  };

  return (
    <div>
      <DonorNavbar />

      <div className="mt-24 max-w-7xl mx-auto px-6 pb-10">
        <button
          className="flex items-center gap-2 text-indigo-600 mb-6 font-medium hover:underline"
          onClick={() => navigate("/donor/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Listed Medicines
        </h1>

        {loading && <p className="text-gray-500">Loading medicines...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && medicines.length === 0 && (
          <p className="text-gray-500">No listed medicines available.</p>
        )}

        {!loading && medicines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {medicines.map((med) => {
              const daysLeft = getDaysUntilExpiry(med.expiryDate);

              const expiryColor =
                daysLeft <= 0
                  ? "bg-gray-200 text-gray-600"
                  : daysLeft <= 30
                  ? "bg-red-100 text-red-600"
                  : daysLeft <= 90
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600";

              return (
                <div
                  key={med.id}
                  className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition"
                >
                  <div className="relative">
                    <img
                      src={
                        med.photoUrl && med.photoUrl.trim() !== ""
                          ? med.photoUrl
                          : DEFAULT_MEDICINE_IMAGE
                      }
                      alt={med.medicineName}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_MEDICINE_IMAGE;
                      }}
                    />

                    <span
                      className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${expiryColor}`}
                    >
                      <Clock className="inline w-3 h-3 mr-1" />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {med.medicineName}
                    </h3>

                    <p className="text-xs text-gray-500 mb-4">
                      {med.numberOfUnits} units available
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/donor/viewstatus/${med.id}`)
                        }
                        className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100"
                      >
                        View Status
                      </button>

                      <button
                        onClick={() => handleUnlist(med.id)}
                        disabled={unlistingId === med.id}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold
                          ${
                            unlistingId === med.id
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                      >
                        {unlistingId === med.id ? "Unlisting..." : "Unlist"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListedMedicine;
