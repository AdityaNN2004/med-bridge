import React, { useState, useEffect, useRef } from "react";
import NGONavbar from "./NGONavbar";
import {
  Calendar,
  User,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { animate, useInView, motion } from "framer-motion";

/* ---------------- DEMO DATA ---------------- */
const demoInventory = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain & fever relief",
    batch: "B-001",
    stock: 120,
    total: 150,
    donor: "City Hospital",
    expiryDate: "2025-12-15",
    location: "Mumbai",
    status: "active",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    description: "Antibiotic",
    batch: "B-002",
    stock: 30,
    total: 200,
    donor: "MedCare",
    expiryDate: "2025-10-22",
    location: "Pune",
    status: "expiring",
  },
  {
    id: 3,
    name: "Metformin 500mg",
    description: "Diabetes care",
    batch: "B-003",
    stock: 0,
    total: 300,
    donor: "Apollo",
    expiryDate: "2025-09-20",
    location: "Bangalore",
    status: "expired",
  },
  {
    id: 4,
    name: "Vitamin D3 60K",
    description: "Supplement",
    batch: "B-004",
    stock: 90,
    total: 120,
    donor: "Health Plus",
    expiryDate: "2026-02-15",
    location: "Delhi",
    status: "active",
  },
  {
    id: 5,
    name: "ORS Sachets",
    description: "Hydration support",
    batch: "B-005",
    stock: 500,
    total: 600,
    donor: "WHO Drive",
    expiryDate: "2025-10-10",
    location: "Nagpur",
    status: "expiring",
  },
];

/* ---------------- HELPERS ---------------- */
const getDaysLeft = (date) =>
  Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

const badgeStyles = {
  active: "bg-green-50 text-green-700",
  expiring: "bg-amber-50 text-amber-700",
  expired: "bg-red-50 text-red-700",
};

const badgeIcon = {
  active: <CheckCircle className="w-4 h-4" />,
  expiring: <Clock className="w-4 h-4" />,
  expired: <XCircle className="w-4 h-4" />,
};

/* ---------------- COUNT CARD ---------------- */
const StatCard = ({ title, value, color, border }) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    animate(0, value, {
      duration: 1.5,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = v.toFixed(0);
      },
    });
  }, [value, inView]);

  return (
    <div
      className={`bg-white ${color} border-l-4 ${border} rounded-xl p-5 shadow hover:shadow-md transition`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p ref={ref} className="text-2xl font-bold mt-1"></p>
    </div>
  );
};

/* ---------------- COMPONENT ---------------- */
const InventoryManagement = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const searchRef = useRef(null);

  /* ✅ AUTO FOCUS SEARCH */
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const urgent = demoInventory.filter(
    (i) => getDaysLeft(i.expiryDate) <= 7 && i.status !== "expired"
  ).length;

  const expiringSoon = demoInventory.filter(
    (i) => getDaysLeft(i.expiryDate) <= 30 && getDaysLeft(i.expiryDate) > 7
  ).length;

  const expired = demoInventory.filter((i) => i.status === "expired").length;

  const filtered = demoInventory.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.batch.toLowerCase().includes(search.toLowerCase()) ||
      item.donor.toLowerCase().includes(search.toLowerCase());

    const matchTab = tab === "all" || item.status === tab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-29">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Inventory Management
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Track & manage donated medicines
        </p>

        {/* ---- STATS ---- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
          <StatCard
            title="Urgent (≤7 days)"
            value={urgent}
            color="bg-red-50"
            border="border-red-500"
          />
          <StatCard
            title="Expiring Soon (≤30 days)"
            value={expiringSoon}
            color="bg-amber-50"
            border="border-amber-500"
          />
          <StatCard
            title="Expired"
            value={expired}
            color="bg-gray-100"
            border="border-gray-400"
          />
        </div>

        {/* ---- SEARCH ---- */}
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medicine, donor or batch"
          className="w-full mb-5 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-teal-600 focus:border-transparent"
        />

        {/* ---- TABS ---- */}
        <div className="flex gap-3 mb-6">
          {["all", "active", "expiring", "expired"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition
                ${
                  tab === t
                    ? "bg-teal-700 text-white shadow"
                    : "bg-white border border-gray-200 text-gray-700 hover:shadow-md"
                }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ---- INVENTORY LIST ---- */}
        <div className="space-y-5">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-5"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {item.description}
                </p>

                <div className="text-xs text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {item.donor}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {item.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Exp: {item.expiryDate}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full ${badgeStyles[item.status]}`}
                >
                  {badgeIcon[item.status]} {item.status}
                </span>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Stock: {item.stock}/{item.total}
                  </p>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-teal-700 rounded-full"
                      style={{
                        width: `${(item.stock / item.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
