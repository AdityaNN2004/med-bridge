import React, { useRef, useEffect, useState } from "react";
import NGONavbar from "./NGONavbar";
import { getEntityId } from "../../utils/jwtUtils";
import {
  getAllDonatedMedicinesByNgoId,
  FindPendingRequestMedicinesByNgoId,
  FindOnGoingRequestMedicines,
} from "../../Services/NgoServices";

import {
  Package,
  Clock,
  Users,
  Search,
  Heart,
  Boxes,
} from "lucide-react";

import { motion, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ---------------- COUNT STAT CARD ---------------- */
const StatCard = ({ stat }) => {
  const ref = useRef(null);

  useEffect(() => {
    animate(0, stat.value, {
      duration: 1.5,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = v.toFixed(0);
      },
    });
  }, [stat.value]);

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
      className={`rounded-xl p-6 ${stat.bg} border-l-4 ${stat.border} transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 font-semibold">{stat.title}</p>
        {stat.icon}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold" ref={ref}></p>
        <span className="text-xs font-medium text-gray-500">{stat.meta}</span>
      </div>
      <div className="w-full bg-gray-200 h-1 mt-3 rounded-full overflow-hidden">
        <div
          className={`h-1 rounded-full ${stat.border.split("-")[1]}`}
          style={{ width: `${Math.min(stat.value, 100)}%` }}
        ></div>
      </div>
    </motion.div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const NGODashboard = () => {
  const navigate = useNavigate();
  const ngoId = getEntityId(); // 🔴 replace with JWT-based NGO ID later

  const [demoStats, setDemoStats] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [medicineCategories, setMedicineCategories] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const donatedRes = await getAllDonatedMedicinesByNgoId(ngoId);
      const pendingRes = await FindPendingRequestMedicinesByNgoId(ngoId);
      const ongoingRes = await FindOnGoingRequestMedicines(ngoId);

      const donated = donatedRes.data || [];
      const pending = pendingRes.data || [];
      const ongoing = ongoingRes.data || [];

      /* ---------------- STATS ---------------- */
      setDemoStats([
        {
          id: 1,
          title: "Total Donations",
          value: donated.length,
          meta: "",
          border: "border-teal-500",
          icon: <Package className="w-5 h-5 text-teal-500" />,
          bg: "bg-teal-50",
        },
        {
          id: 2,
          title: "Pending Requests",
          value: pending.length,
          meta: "",
          border: "border-amber-500",
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          bg: "bg-amber-50",
        },
        {
          id: 3,
          title: "Ongoing Requests",
          value: ongoing.length,
          meta: "",
          border: "border-green-500",
          icon: <Users className="w-5 h-5 text-green-500" />,
          bg: "bg-green-50",
        },
      ]);

      /* ---------------- MONTHLY GRAPH (lastUpdated) ---------------- */
      const monthMap = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
      };

      donated.forEach((m) => {
        if (!m.lastUpdated) return;
        const month = new Date(m.lastUpdated).toLocaleString("default", {
          month: "short",
        });
        if (monthMap[month] !== undefined) {
          monthMap[month]++;
        }
      });

      setMonthlyTrends(
        Object.keys(monthMap).map((m) => ({
          month: m,
          donations: monthMap[m],
        }))
      );

      /* ---------------- CATEGORY CHART (medicinecategory) ---------------- */
      const categoryMap = {};
      donated.forEach((m) => {
        const cat = m.medicinecategory || "Others";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const total = donated.length || 1;

      setMedicineCategories(
        Object.keys(categoryMap).map((key) => ({
          name: key,
          value: Math.round((categoryMap[key] / total) * 100),
        }))
      );
    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  /* ---------------- QUICK ACTIONS ---------------- */
  const quickActions = [
    {
      id: 1,
      title: "Search Medicines",
      icon: <Search className="w-5 h-5" />,
      route: "/ngo/inventory",
      solid: true,
    },
    {
      id: 2,
      title: "Medicines Near Me ",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      route: "/ngo/listedmedicineinarea",
    },
    {
      id: 3,
      title: "Manage Inventory",
      icon: <Boxes className="w-5 h-5 text-indigo-500" />,
      route: "/ngo/inventory",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-25">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Hope Medical Foundation
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Welcome back! Here's your donation overview
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {demoStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(action.route)}
              className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition
                ${
                  action.solid
                    ? "bg-teal-700 text-white hover:bg-teal-800"
                    : "bg-white border border-gray-200 text-gray-700 hover:shadow-lg"
                }`}
            >
              {action.icon}
              {action.title}
            </motion.button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <motion.div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Donation Trends
            </p>

            <div className="h-48 flex items-end gap-3">
              {monthlyTrends.map((m, i) => (
                <motion.div
                  key={i}
                  className="bg-teal-600 w-8 rounded-xl"
                  style={{ height: `${m.donations * 6}px` }}
                />
              ))}
            </div>

            <div className="flex justify-between mt-3 text-xs text-gray-500">
              {monthlyTrends.map((m) => (
                <span key={m.month}>{m.month}</span>
              ))}
            </div>
          </motion.div>

          {/* Medicine Categories */}
          <motion.div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Medicine Categories
            </p>

            <div className="flex justify-center my-4">
              <svg className="w-40 h-40">
                {medicineCategories.reduce(
                  (acc, cat, idx, arr) => {
                    const total = arr.reduce((s, c) => s + c.value, 0);
                    const startAngle = acc.angle || 0;
                    const endAngle =
                      startAngle + (cat.value / total) * 360;

                    const r = 70,
                      cx = 80,
                      cy = 80;
                    const sx = cx + r * Math.cos((Math.PI / 180) * startAngle);
                    const sy = cy + r * Math.sin((Math.PI / 180) * startAngle);
                    const ex = cx + r * Math.cos((Math.PI / 180) * endAngle);
                    const ey = cy + r * Math.sin((Math.PI / 180) * endAngle);

                    acc.paths.push(
                      <path
                        key={idx}
                        d={`M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey} Z`}
                        fill={`hsl(${idx * 60},70%,60%)`}
                        stroke="white"
                      />
                    );
                    acc.angle = endAngle;
                    return acc;
                  },
                  { paths: [], angle: 0 }
                ).paths}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
              {medicineCategories.map((cat, i) => (
                <p key={i}>● {cat.name} — {cat.value}%</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
