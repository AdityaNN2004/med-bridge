import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getListMedicinesInServiceRadius,
  RequestMedicine,
} from "../../Services/NgoServices";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  User,
  X,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import NGONavbar from "./NGONavbar";
import { motion } from "framer-motion";

/* ---------------- HELPERS ---------------- */
const getStatusColor = (status) => {
  switch (status) {
    case "available":
      return "bg-blue-100 text-blue-700";
    case "ongoing":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "available":
      return <Package className="w-4 h-4" />;
    case "ongoing":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

/* ---------------- MAIN ---------------- */
const NGOListedMedicineInArea = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  const NGO_ID = 2; // later from JWT

  useEffect(() => {
    searchRef.current?.focus();

    const fetchAvailableMedicines = async () => {
      try {
        const response = await getListMedicinesInServiceRadius(NGO_ID);

        const mappedData = response.data.map((med) => ({
          id: med.id,
          brandName: med.medicineName,
          genericName: med.medicinecategory,
          expiryDate: med.expiry_date,
          quantity: med.quantity ?? "Not specified",
          donor: "Nearby Donor",
          location: "Within Service Radius",
          distance: med.distancefromdonar,
          status: "available",
        }));

        setMedicines(mappedData);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableMedicines();
  }, []);

  /* ---------------- REQUEST MEDICINE ---------------- */
  const handleRequestMedicine = async (medicineId) => {
    try {
      const payload = {
        ngoId: NGO_ID,
        medicineId: medicineId,
      };
      console.log(payload);
      await RequestMedicine(payload);
       alert("Requeted SuccessFull");
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to request medicine ❌");
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "available" ? med.status === "available" : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-7 h-7 text-teal-700" />
          <h1 className="text-2xl font-bold text-gray-900">
            Available Medicines
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Medicines available within your service radius
        </p>

        {/* Search + STATUS BUTTONS (UNCHANGED) */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicine or category..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["available", "ongoing", "pending", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-xl text-sm font-medium capitalize transition ${
                  statusFilter === status
                    ? "bg-teal-700 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <Clock className="w-10 h-10 mx-auto text-gray-400 animate-spin" />
            <p className="text-gray-500 mt-2">Loading medicines...</p>
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="space-y-5">
            {filteredMedicines.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border shadow-sm hover:shadow-lg p-6 flex flex-col sm:flex-row gap-4 cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{med.brandName}</h3>
                  <p className="text-sm text-gray-500">{med.genericName}</p>

                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(med.expiryDate).toLocaleDateString("en-IN")}
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {med.donor}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {med.distance != null
                        ? `${med.distance.toFixed(2)} km away`
                        : "Distance unavailable"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                      med.status
                    )}`}
                  >
                    {getStatusIcon(med.status)}
                    {med.status}
                  </span>

                  {med.status === "available" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestMedicine(med.id);
                      }}
                      className="text-xs font-medium text-teal-700 border border-teal-700 px-4 py-1.5 rounded-lg hover:bg-teal-700 hover:text-white transition"
                    >
                      Request Medicine
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="p-6 border-b flex justify-between">
              <h2 className="font-bold text-lg">
                {selectedMedicine.brandName}
              </h2>
              <button onClick={() => setSelectedMedicine(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGOListedMedicineInArea;
