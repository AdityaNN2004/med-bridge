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
import { getAllDonatedMedicinesByNgoId } from "../../Services/NgoServices";

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

/* ---------------- STAT CARD ---------------- */
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

/* ---------------- ENTITY MAPPER ---------------- */
const mapApiMedicineToUi = (med) => {
  const daysLeft = getDaysLeft(med.expiry_date);

  let status = "active";
  if (daysLeft <= 0) status = "expired";
  else if (daysLeft <= 30) status = "expiring";

  const quantity = Number(med.quantity?.split(" ")[0]) || 0;

  return {
    id: med.id,
    name: med.medicineName ?? "",
    description: med.medicinecategory ?? "",
    batch: `B-${med.id}`,
    stock: quantity,
    total: quantity,
    donor: med.donarid ? `Donor #${med.donarid}` : "Donated",
    location: "NGO Inventory",
    expiryDate: med.expiry_date,
    status,
  };
};

/* ---------------- COMPONENT ---------------- */
const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const searchRef = useRef(null);

  const NGO_ID = 1;

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await getAllDonatedMedicinesByNgoId(NGO_ID);
        setInventory(res.data.map(mapApiMedicineToUi));
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      }
    };

    fetchInventory();
  }, []);

  /* STATS */
  const urgent = inventory.filter(
    (i) => getDaysLeft(i.expiryDate) <= 7 && i.status !== "expired"
  ).length;

  const expiringSoon = inventory.filter(
    (i) => getDaysLeft(i.expiryDate) <= 30 && getDaysLeft(i.expiryDate) > 7
  ).length;

  const expired = inventory.filter((i) => i.status === "expired").length;

  /* 🔥 FIXED FILTER (NULL SAFE) */
  const filtered = inventory.filter((item) => {
    const matchSearch =
      (item.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.batch ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.donor ?? "").toLowerCase().includes(search.toLowerCase());

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

        {/* STATS */}
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

        {/* SEARCH */}
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medicine, donor or batch"
          className="w-full mb-5 p-3 text-sm border rounded-xl focus:ring-2 focus:ring-teal-600"
        />

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          {["all", "active", "expiring", "expired"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition ${
                tab === t
                  ? "bg-teal-700 text-white shadow"
                  : "bg-white border text-gray-700"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-5">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-5 border shadow-sm flex gap-5"
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
