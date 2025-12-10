import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import DonorNavbar from "./DonorNavbar";

function ListedMedicine() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const dummyMedicines = [
      {
        id: 1,
        medicineName: "Paracetamol 500mg",
        expiryDate: "2025-12-31",
        numberOfUnits: 20,
        photoUrl:
          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
        listed: true,
      },
      {
        id: 2,
        medicineName: "Ibuprofen 400mg",
        expiryDate: "2025-06-15",
        numberOfUnits: 15,
        photoUrl:
          "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
        listed: true,
      },
      {
        id: 3,
        medicineName: "Amoxicillin 250mg",
        expiryDate: "2026-03-20",
        numberOfUnits: 30,
        photoUrl:
          "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
        listed: true,
      },
      {
        id: 4,
        medicineName: "Vitamin D3 1000 IU",
        expiryDate: "2025-09-10",
        numberOfUnits: 60,
        photoUrl:
          "https://images.unsplash.com/photo-1550572017-4892b2f88d5f?w=400&h=300&fit=crop",
        listed: true,
      },
    ];
    setMedicines(dummyMedicines);
  }, []);

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const handleUnlist = (id) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, listed: false } : m))
    );
  };

  return (
    <div>
      <DonorNavbar />

      <div className="mt-24 max-w-7xl mx-auto px-6 pb-10">
        {/* Back */}
        <button
          className="flex items-center gap-2 text-indigo-600 mb-6 font-medium hover:underline"
          onClick={() => navigate("/donor/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Listed Medicines
        </h1>

        {medicines.length === 0 ? (
          <p className="text-gray-500">No listed medicines available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {medicines.map((med) => {
              const daysLeft = getDaysUntilExpiry(med.expiryDate);
              const expiryColor =
                daysLeft <= 30
                  ? "bg-red-100 text-red-600"
                  : daysLeft <= 90
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-green-100 text-green-600";

              return (
                <div
                  key={med.id}
                  className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={med.photoUrl}
                      alt={med.medicineName}
                      className="w-full h-40 object-cover"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x300?text=Medicine")
                      }
                    />
                    <span
                      className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${expiryColor}`}
                    >
                      <Clock className="inline w-3 h-3 mr-1" />
                      {daysLeft} days left
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                      {med.medicineName}
                    </h3>

                    <p className="text-xs text-gray-500 mb-4">
                      {med.numberOfUnits} units available
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/donor/viewstatus/${med.id}`)
                        }
                        className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
                      >
                        View Status
                      </button>

                      <button
                        onClick={() => handleUnlist(med.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                      >
                        Unlist
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
