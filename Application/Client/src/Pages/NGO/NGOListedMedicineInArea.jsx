import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getListMedicinesInServiceRadius,
  RequestMedicine,
  FindOnGoingRequestMedicines,
  FindPendingRequestMedicinesByNgoId,
  FindRejectedRequestMedicines,
  updateServiceArea,
  getServiceAreaOfNgo,
} from "../../Services/NgoServices";
import { getEntityId } from "../../utils/jwtUtils";
import { ToastContainer, toast } from "react-toastify";
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
import MapWithRadius from "../../Compoments/MapWithRadius";
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

  // 🔹 map-related
  const [radiusKm, setRadiusKm] = useState(10);
  const [refreshMapKey, setRefreshMapKey] = useState(0);

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const NGO_ID = getEntityId();

  /* -------- LOAD CURRENT RADIUS -------- */
  useEffect(() => {
    const loadRadius = async () => {
      try {
        const res = await getServiceAreaOfNgo(NGO_ID);
        setRadiusKm(res.data.serviceRadius || 10);
      } catch (e) {
        console.error("Failed to load radius", e);
      }
    };
    loadRadius();
  }, []);

  /* -------- FETCH MEDICINES -------- */
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

  useEffect(() => {
    searchRef.current?.focus();
    fetchMedicinesByStatus(statusFilter);
  }, [statusFilter]);

  /* -------- UPDATE RADIUS -------- */
  const handleUpdateRadius = async () => {
    try {
      await updateServiceArea(NGO_ID, radiusKm);
   toast.success("Service radius updated");
      setRefreshMapKey((k) => k + 1); // force map reload
      fetchMedicinesByStatus(statusFilter);
    } catch {
     toast.error("Failed to update radius");
    }
  };

  const handleRequestMedicine = async (medicineId) => {
    try {
      await RequestMedicine({ ngoId: NGO_ID, medicineId });
    toast.success("Requested Successfully ");
      setStatusFilter("pending");
    } catch {
        toast.error("Failed to request medicine ");
    }
  };

  const filteredMedicines = medicines.filter((med) => {
    const brand = med.brandName?.toLowerCase() ?? "";
    const generic = med.genericName?.toLowerCase() ?? "";
    return (
      brand.includes(searchTerm.toLowerCase()) ||
      generic.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-28">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-7 h-7 text-teal-700" />
          <h1 className="text-2xl font-bold">Medicines Near Me</h1>
        </div>

        {/* SEARCH + TABS */}
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

        {/* MAP + LIST */}
        <div className="flex gap-6 h-[470px]">
          {/* MAP */}
          <div className="w-[45%] bg-white rounded-xl border p-4">
            {/* UPDATE RADIUS BOX */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium">Service Radius (km)</span>
              <input
                type="number"
                min="1"
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
                className="w-20 border rounded-md px-2 py-1 text-sm"
              />
              <button
                onClick={handleUpdateRadius}
                className="bg-teal-700 text-white px-4 py-1.5 rounded-md text-xs"
              >
                Update
              </button>
            </div>

            <MapWithRadius key={refreshMapKey} />
          </div>

          {/* MEDICINE LIST */}
          <div className="w-[55%] overflow-y-auto pr-2 space-y-4">
            {loading && (
              <div className="flex justify-center items-center h-full">
                <Clock className="w-10 h-10 animate-spin" />
              </div>
            )}

            {!loading &&
              filteredMedicines.map((med) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border p-4"
                >
                  <h3 className="font-semibold text-sm">{med.brandName}</h3>
                  <p className="text-xs text-gray-500">{med.genericName}</p>

                  <div className="text-xs text-gray-600 mt-2 space-y-1">
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

                  <div className="flex justify-between items-center mt-3">
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
                        className="text-xs border px-3 py-1 rounded-lg text-teal-700 border-teal-700 hover:bg-teal-700 hover:text-white"
                      >
                        Request
                      </button>
                    )}

                    {med.status === "ongoing" && (
                      <button
                        onClick={() =>
                          navigate(`/ngo/viewstatus/${med.id}`)
                        }
                        className="text-xs border px-3 py-1 rounded-lg text-emerald-700 border-emerald-700 hover:bg-emerald-700 hover:text-white"
                      >
                        View Status
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOListedMedicineInArea;
