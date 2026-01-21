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

/* ---------------- DATA (REPLACE WITH API LATER) ---------------- */
const medicines = [
  {
    id: 1,
    brandName: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    expiryDate: "2025-08-15",
    donor: "City Hospital",
    location: "Mumbai, Maharashtra",
    status: "available", // listed in area
    quantity: "500 tablets",
    manufacturer: "Sun Pharma",
    description: "Pain reliever and fever reducer.",
  },
  {
    id: 2,
    brandName: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    expiryDate: "2025-12-30",
    donor: "MedCare Pharmacy",
    location: "Pune, Maharashtra",
    status: "ongoing", // approved by donor
    quantity: "200 capsules",
    manufacturer: "Cipla",
    description: "Antibiotic for bacterial infections.",
  },
  {
    id: 3,
    brandName: "Cetirizine 10mg",
    genericName: "Cetirizine",
    expiryDate: "2025-10-01",
    donor: "HealthPlus",
    location: "Nagpur, Maharashtra",
    status: "pending",
    quantity: "300 tablets",
    manufacturer: "Dr Reddy’s",
    description: "Used to relieve allergy symptoms.",
  },
  {
    id: 4,
    brandName: "Azithromycin 500mg",
    genericName: "Azithromycin",
    expiryDate: "2025-07-20",
    donor: "Care Hospital",
    location: "Hyderabad, Telangana",
    status: "rejected",
    quantity: "150 tablets",
    manufacturer: "Cipla",
    description: "Antibiotic used to treat infections.",
  },
];

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

const isExpiringSoon = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return (expiry - today) / (1000 * 60 * 60 * 24) <= 90;
};

/* ---------------- MAIN ---------------- */
const NGOListedMedicineInArea = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("available");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.donor.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && med.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-7 h-7 text-teal-700" />
          <h1 className="text-2xl font-bold text-gray-900">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicine, donor, or generic name..."
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
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
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
              className="bg-white rounded-xl border shadow-sm hover:shadow-lg p-6 flex flex-col sm:flex-row gap-4 cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{med.brandName}</h3>
                <p className="text-sm text-gray-500">{med.genericName}</p>

                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span
                      className={
                        isExpiringSoon(med.expiryDate)
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {new Date(med.expiryDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {med.donor}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {med.location}
                  </div>
                </div>
              </div>

              {/* STATUS + ACTION */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                    med.status
                  )}`}
                >
                  {getStatusIcon(med.status)}
                  {med.status}
                </span>

                {/* AVAILABLE → REQUEST */}
                {med.status === "available" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // CALL REQUEST MEDICINE API
                      navigate("/ngo/pending-requests");
                    }}
                    className="text-xs font-medium text-teal-700 border border-teal-700 px-4 py-1.5 rounded-lg hover:bg-teal-700 hover:text-white transition"
                  >
                    Request Medicine
                  </button>
                )}

                {/* ONGOING → VIEW STATUS */}
                {med.status === "ongoing" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/ngo/viewstatus");
                    }}
                    className="text-xs font-medium text-teal-700 border border-teal-700 px-4 py-1.5 rounded-lg hover:bg-teal-700 hover:text-white transition"
                  >
                    View Status
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
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

            <div className="p-6 space-y-4 text-sm text-gray-700">
              <p>{selectedMedicine.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p className="font-semibold">
                    {selectedMedicine.quantity}
                  </p>
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

export default NGOListedMedicineInArea;
