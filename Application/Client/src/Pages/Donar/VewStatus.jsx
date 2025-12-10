import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Building } from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import DonorChatBot from "../../Compoments/DonarChatbot";

function ViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const dummyMedicines = [
      { id: 1, medicineName: "Paracetamol 500mg", numberOfUnits: 20, expiryDate: "2025-12-31" },
      { id: 2, medicineName: "Ibuprofen 400mg", numberOfUnits: 15, expiryDate: "2025-06-15" },
      { id: 3, medicineName: "Amoxicillin 250mg", numberOfUnits: 30, expiryDate: "2026-03-20" },
      { id: 4, medicineName: "Vitamin D3 1000 IU", numberOfUnits: 60, expiryDate: "2025-09-10" }
    ];

    const med = dummyMedicines.find(m => m.id === parseInt(id));
    setMedicine(med);

    if (med?.id === 1) setStatus("Accepted");
    else if (med?.id === 2) setStatus("Pending");
    else setStatus("Not Accepted");
  }, [id]);

  if (!medicine) return <p className="text-center mt-24">Loading...</p>;

  return (
    <div>
      <DonorNavbar />

      <div className="mt-24 max-w-7xl min-h-[calc(100vh-6rem)] mx-auto px-6 py-4">

        {/* Back */}
        <button
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:underline"
          onClick={() => navigate("/donor/listedmedicine")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Medicine Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{medicine.medicineName}</h1>
              <p className="text-sm text-gray-500">
                {medicine.numberOfUnits} units | Expires {medicine.expiryDate}
              </p>
            </div>
            <span
              className={`px-4 py-1 rounded-full text-white text-sm font-semibold
                ${
                  status === "Accepted"
                    ? "bg-green-500"
                    : status === "Pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Map */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Live Tracking</h2>
            <div className="h-[340px] border rounded-xl overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScDLQeIDVShuT2tL3g-BkmQUdq0tId_aQP9g&s"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* NGO + CHAT */}
          <div className="space-y-6">

            {/* NGO Details */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-3">NGO Details</h3>
              <p className="flex items-center gap-2">
                <Building size={16} /> Helping Hands NGO
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> +91 98765 43210
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} /> Pune, Maharashtra
              </p>
            </div>

            {/* ✅ CHATBOT INTEGRATION */}
            <div>
              <DonorChatBot />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStatus;
