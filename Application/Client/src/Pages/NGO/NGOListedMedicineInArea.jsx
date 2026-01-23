import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getListMedicinesInServiceRadius,
  RequestMedicine,
  FindOnGoingRequestMedicines,
  FindPendingRequestMedicinesByNgoId,
  FindRejectedRequestMedicines
} from "../../Services/NgoServices";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  User,
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

/* ---------------- NORMALIZER ---------------- */
const normalizeMedicine = (med, status) => ({
  id: med.id ?? med.medicine_id,
  brandName: med.medicineName ?? med.medicine_name ?? "Unknown Medicine",
  genericName: med.medicinecategory ?? "Unknown Category",
  expiryDate: med.expiry_date ?? null,
  quantity: med.quantity ?? "Not specified",
  donor: med.donarid ? `Donor #${med.donarid}` : "Nearby Donor",
  location:
    status === "available"
      ? "Within Service Radius"
      : status === "pending"
      ? "Requested"
      : status === "ongoing"
      ? "In Progress"
      : "Rejected",
  distance: med.distancefromdonar ?? null,
  status,
});

/* ---------------- MAIN ---------------- */
const NGOListedMedicineInArea = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const NGO_ID = 1; // later from JWT

  /* ---------------- FETCH BY STATUS ---------------- */
  const fetchMedicinesByStatus = async (status) => {
    setLoading(true);
    try {
      let response;

      if (status === "available") {
        response = await getListMedicinesInServiceRadius(NGO_ID);
      } else if (status === "pending") {
        response = await FindPendingRequestMedicinesByNgoId(NGO_ID);
      } else if (status === "ongoing") {
        response = await FindOnGoingRequestMedicines(NGO_ID);
      } else if (status === "rejected") {
        response = await FindRejectedRequestMedicines(NGO_ID);
      }

      setMedicines(response.data.map((m) => normalizeMedicine(m, status)));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD ON TAB CHANGE ---------------- */
  useEffect(() => {
    searchRef.current?.focus();
    fetchMedicinesByStatus(statusFilter);
  }, [statusFilter]);

  /* ---------------- REQUEST MEDICINE ---------------- */
  const handleRequestMedicine = async (medicineId) => {
    try {
      await RequestMedicine({ ngoId: NGO_ID, medicineId });
      alert("Requested Successfully ✅");
      setStatusFilter("pending");
    } catch {
      alert("Failed to request medicine ❌");
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredMedicines = medicines.filter((med) => {
    const brand = med.brandName?.toLowerCase() ?? "";
    const generic = med.genericName?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();
    return brand.includes(search) || generic.includes(search);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-7 h-7 text-teal-700" />
          <h1 className="text-2xl font-bold">Medicines</h1>
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicine..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["available", "ongoing", "pending", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-xl text-sm capitalize ${
                  statusFilter === status
                    ? "bg-teal-700 text-white"
                    : "bg-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <Clock className="w-10 h-10 mx-auto animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="space-y-5">
            {filteredMedicines.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border p-6 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{med.brandName}</h3>
                  <p className="text-sm text-gray-500">{med.genericName}</p>

                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    {med.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(med.expiryDate).toLocaleDateString("en-IN")}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {med.donor}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {med.distance
                        ? `${med.distance.toFixed(2)} km away`
                        : med.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                      med.status
                    )}`}
                  >
                    {getStatusIcon(med.status)} {med.status}
                  </span>

                  {med.status === "available" && (
                    <button
                      onClick={() => handleRequestMedicine(med.id)}
                      className="text-xs border px-4 py-1.5 rounded-lg text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white"
                    >
                      Request Medicine
                    </button>
                  )}

                  {/* ✅ ONLY ADDITION */}
                  {med.status === "ongoing" && (
                    <button
                      onClick={() => navigate(`/ngo/viewstatus/${med.id}`)}
                      className="text-xs border px-4 py-1.5 rounded-lg text-emerald-700 border-emerald-700 hover:bg-emerald-700 hover:text-white"
                    >
                      View Status
                    </button>

                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOListedMedicineInArea;
