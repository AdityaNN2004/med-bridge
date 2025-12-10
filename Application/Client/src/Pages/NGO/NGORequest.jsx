import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

/* ---------------- DATA ---------------- */
const medicines = [
  {
    id: 1,
    brandName: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    expiryDate: "2025-08-15",
    donor: "City Hospital",
    donorContact: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    status: "available",
    quantity: "500 tablets",
    batchNumber: "BN20241234",
    manufacturer: "Sun Pharma",
    requestDate: "2024-11-20",
    description:
      "Pain reliever and fever reducer. Stored in controlled temperature conditions.",
  },
  {
    id: 2,
    brandName: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    expiryDate: "2025-12-30",
    donor: "MedCare Pharmacy",
    donorContact: "+91 98765 43211",
    location: "Pune, Maharashtra",
    status: "pending",
    quantity: "200 capsules",
    batchNumber: "BN20241567",
    manufacturer: "Cipla",
    requestDate: "2024-11-25",
    description:
      "Antibiotic for bacterial infections. Requires proper storage.",
  },
];

/* ---------------- HELPERS ---------------- */
const getStatusColor = (status) => {
  switch (status) {
    case "available":
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
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

const isExpiringSoon = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const days = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  return days <= 90;
};

/* ---------------- MAIN ---------------- */
const NGORequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  /* ✅ Auto focus search on page load */
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.donor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || med.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      {/* Header + Search */}
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-7 h-7 text-teal-700" />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Medicine Requests
          </h1>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Search and request donated medicines from verified donors
        </p>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicine, donor, or generic name..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-600 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["all", "available", "pending", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-xl text-sm font-medium capitalize transition ${
                  statusFilter === status
                    ? "bg-teal-700 text-white shadow"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Cards */}
        <div className="space-y-5">
          {filteredMedicines.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-14 h-14 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No medicines found</p>
            </div>
          )}

          {filteredMedicines.map((med) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedMedicine(med)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer p-6 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {med.brandName}
                </h3>
                <p className="text-sm text-gray-500">{med.genericName}</p>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      Expires:{" "}
                      <span
                        className={
                          isExpiringSoon(med.expiryDate)
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                      >
                        {new Date(med.expiryDate).toLocaleDateString("en-IN")}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {med.donor}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {med.location}
                  </div>
                </div>
              </div>

              {/* ✅ STATUS + VIEW BUTTON */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1.5 h-fit rounded-full text-xs font-medium ${getStatusColor(
                    med.status
                  )}`}
                >
                  {getStatusIcon(med.status)}
                  {med.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/ngo/viewstatus");
                  }}
                  className="text-xs font-medium text-teal-700 border border-teal-700 px-4 py-1.5 rounded-lg hover:bg-teal-700 hover:text-white transition"
                >
                  View Status
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <div className="p-6 border-b flex justify-between">
              <h2 className="font-bold text-lg">{selectedMedicine.brandName}</h2>
              <button onClick={() => setSelectedMedicine(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-gray-700">
              <p>{selectedMedicine.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-semibold">{selectedMedicine.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Manufacturer</p>
                  <p className="font-semibold">
                    {selectedMedicine.manufacturer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGORequest;
