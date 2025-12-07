import React, { useRef, useEffect } from "react";
import NGONavbar from "./Navbar/NGONavbar";
import {
  Package,
  Clock,
  Users,
  Search,
  Heart,
  Boxes,
} from "lucide-react";
import { motion, animate, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ---------------- DEMO STATS ---------------- */
const demoStats = [
  {
    id: 1,
    title: "Total Donations",
    value: 143,
    meta: "+12%",
    border: "border-teal-600",
    icon: <Package className="w-4 h-4 text-teal-700" />,
  },
  {
    id: 2,
    title: "Pending Requests",
    value: 8,
    meta: "3 new",
    border: "border-amber-500",
    icon: <Clock className="w-4 h-4 text-amber-600" />,
  },
  {
    id: 3,
    title: "Active Donors",
    value: 52,
    meta: "+5 this week",
    border: "border-green-500",
    icon: <Users className="w-4 h-4 text-green-600" />,
  },
];

/* ---------------- QUICK ACTIONS ---------------- */
const quickActions = [
  {
    id: 1,
    title: "Search Medicines",
    icon: <Search className="w-4 h-4" />,
    route: "/ngo/inventory",
    solid: true,
  },
  {
    id: 2,
    title: "View Requests",
    icon: <Heart className="w-4 h-4 text-red-500" />,
    route: "/ngo/requests",
  },
  {
    id: 3,
    title: "Manage Inventory",
    icon: <Boxes className="w-4 h-4 text-indigo-500" />,
    route: "/ngo/inventory",
  },
];

/* ---------------- CHART DATA ---------------- */
const monthlyTrends = [
  { month: "Jan", donations: 10 },
  { month: "Feb", donations: 18 },
  { month: "Mar", donations: 14 },
  { month: "Apr", donations: 24 },
  { month: "May", donations: 20 },
  { month: "Jun", donations: 28 },
];

const medicineCategories = [
  { name: "Pain Relief", value: 35 },
  { name: "Antibiotics", value: 25 },
  { name: "Chronic Care", value: 20 },
  { name: "Vitamins", value: 12 },
  { name: "Others", value: 8 },
];

/* ---------------- COUNT STAT CARD ---------------- */
const StatCard = ({ stat }) => {
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    animate(0, stat.value, {
      duration: 1.5,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = v.toFixed(0);
      },
    });
  }, [stat.value, inView]);

  return (
    <div
      className={`bg-white border-l-4 ${stat.border}
      rounded-xl p-5 shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">{stat.title}</p>
        {stat.icon}
      </div>

      <p className="text-2xl font-bold mt-1">
        <span ref={ref}></span>
        <span className="ml-2 text-xs font-medium text-green-600">
          {stat.meta}
        </span>
      </p>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const NGODashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-29">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Hope Medical Foundation
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Welcome back! Here's your donation overview
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
          {demoStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.route)}
              className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition
                ${
                  action.solid
                    ? "bg-teal-700 text-white hover:bg-teal-800"
                    : "bg-white border border-gray-200 text-gray-700 hover:shadow-md"
                }`}
            >
              {action.icon}
              {action.title}
            </button>
          ))}
        </div>

        {/* GRAPHS (FADE ONLY HERE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <p className="text-lg font-semibold text-gray-900 mb-3">
              Monthly Donation Trends
            </p>

            <div className="h-40 flex items-end gap-3">
              {monthlyTrends.map((m, i) => (
                <div
                  key={i}
                  className="bg-teal-700 w-6 rounded-xl"
                  style={{ height: `${m.donations * 6}px` }}
                />
              ))}
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {monthlyTrends.map((m) => (
                <span key={m.month}>{m.month}</span>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <p className="text-lg font-semibold text-gray-900 mb-3">
              Medicine Categories
            </p>

            <div className="flex justify-center my-4">
              <div className="w-36 h-36 rounded-full border-[10px] border-teal-700 border-t-transparent rotate-45" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {medicineCategories.map((cat, idx) => (
                <p key={idx}>
                  ● {cat.name} — {cat.value}%
                </p>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
