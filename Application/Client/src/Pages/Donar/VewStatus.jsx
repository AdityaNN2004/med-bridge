import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Building } from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import DonorChatBot from "../../Compoments/DonarChatbot";
import RoutesMap from "../../Compoments/RoutesMap";
import { getMedicineDetails } from "../../Services/MedicineServices";

function ViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicineDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchMedicineDetails = async () => {
    try {
      const response = await getMedicineDetails(id);
      const data = response.data;

      setMedicine(data);

      // 🔹 Map backend status → UI status
      if (data?.donationStatus === "ACCEPTED") {
        setStatus("Accepted");
      } else if (data?.donationStatus === "REJECTED") {
        setStatus("Not Accepted");
      } else {
        setStatus("Pending");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load medicine details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-24 text-gray-500">
        Loading medicine details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-24 text-red-500">
        {error}
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center mt-24 text-gray-500">
        Medicine not found
      </div>
    );
  }

  const statusColor = {
    Accepted: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "Not Accepted": "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <DonorNavbar />

      <div className="mt-24 max-w-7xl mx-auto px-6 py-6">
        {/* Back */}
        <button
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:underline"
          onClick={() => navigate("/donor/listedmedicine")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Medicines
        </button>

        {/* Medicine Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {medicine.medicineName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {medicine.quantity || medicine.numberOfUnits} units • Expires{" "}
                {medicine.expiryDate}
              </p>
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColor[status]}`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-600" />
                  Live Route Tracking
                </h2>
                <p className="text-sm text-gray-500">
                  Pickup → NGO delivery route
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>

            <div className="h-[340px] rounded-xl overflow-hidden shadow-inner">
              <RoutesMap />
            </div>

            <div className="flex justify-between items-center mt-4 px-2">
              <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm">
                <p className="font-semibold text-gray-800">Distance</p>
                <p className="text-gray-600">~ 4.5 km</p>
              </div>

              <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm">
                <p className="font-semibold text-gray-800">ETA</p>
                <p className="text-gray-600">~ 15 mins</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* NGO Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                NGO Details
              </h3>

              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-2">
                  <Building size={16} />{" "}
                  {medicine.ngoName || "Helping Hands NGO"}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} />{" "}
                  {medicine.ngoContact || "+91 98765 43210"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} />{" "}
                  {medicine.ngoAddress || "Pune, Maharashtra"}
                </p>
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Chat & Updates
              </h3>
              <DonorChatBot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStatus;
