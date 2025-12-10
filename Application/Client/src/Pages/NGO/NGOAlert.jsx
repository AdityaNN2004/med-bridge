import React, { useState, useRef, useEffect } from "react";
import NGONavbar from "./NGONavbar";
import { XCircle, Clock, CheckCircle } from "lucide-react";
import { animate, useInView, motion } from "framer-motion";

/* ---------------- DEMO ALERT DATA ---------------- */
const alertsData = [
  {
    id: 1,
    title: "Urgent: Medicine Expiring Soon",
    message: "Vitamin D3 1000IU will expire in 8 days.",
    type: "urgent",
    status: "unread",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Expiry Warning",
    message: "Cetirizine 10mg will expire in 23 days.",
    type: "warning",
    status: "unread",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "Expiry Reminder",
    message: "Ibuprofen 400mg will expire in 60 days.",
    type: "reminder",
    status: "completed",
    time: "8 hours ago",
  },
  {
    id: 4,
    title: "Urgent: Donor Pickup Required",
    message: "Pickup scheduled today for donated medicines.",
    type: "urgent",
    status: "unread",
    time: "1 day ago",
  },
  {
    id: 5,
    title: "Donation Completed",
    message: "Paracetamol donation successfully completed.",
    type: "success",
    status: "completed",
    time: "2 days ago",
  },
];

/* ---------------- COUNTING STAT CARD ---------------- */
const StatMiniCard = ({ title, value, border, textColor }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    animate(0, value, {
      duration: 1.5,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v);
      },
    });
  }, [value, isInView]);

  return (
    <div className={`bg-white border-l-4 ${border} rounded-xl p-5 shadow`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p ref={ref} className={`text-3xl font-bold mt-1 ${textColor}`} />
    </div>
  );
};

/* ---------------- HELPERS ---------------- */
const getIcon = (type) => {
  switch (type) {
    case "urgent":
      return <XCircle className="w-5 h-5 text-red-600" />;
    case "warning":
    case "reminder":
      return <Clock className="w-5 h-5 text-amber-500" />;
    case "success":
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    default:
      return null;
  }
};

const getBadge = (status) =>
  status === "unread"
    ? "bg-blue-100 text-blue-800"
    : "bg-emerald-100 text-emerald-800";

/* ---------------- MAIN COMPONENT ---------------- */
const NGOAlert = () => {
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = alertsData.filter((a) => a.status === "unread").length;
  const urgentCount = alertsData.filter((a) => a.type === "urgent").length;
  const completedCount = alertsData.filter((a) => a.status === "completed")
    .length;

  const filteredAlerts = alertsData.filter((alert) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return alert.status === "unread";
    if (activeTab === "urgent") return alert.type === "urgent";
    if (activeTab === "completed") return alert.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-28">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Alerts & Notifications
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Monitor urgent updates, expiry alerts, and completed actions
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatMiniCard
            title="Unread Alerts"
            value={unreadCount}
            border="border-teal-600"
            textColor="text-teal-700"
          />
          <StatMiniCard
            title="Urgent"
            value={urgentCount}
            border="border-amber-500"
            textColor="text-amber-700"
          />
          <StatMiniCard
            title="Completed"
            value={completedCount}
            border="border-emerald-600"
            textColor="text-emerald-700"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["all", "unread", "urgent", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-teal-700 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Alerts List with Fade Animation */}
        <div className="space-y-5">
          {filteredAlerts.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              No notifications found
            </p>
          )}

          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow hover:shadow-lg transition flex gap-4"
            >
              <div className="mt-1">{getIcon(alert.type)}</div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {alert.title}
                  </h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getBadge(
                      alert.status
                    )}`}
                  >
                    {alert.status}
                  </span>
                </div>

                <p className="text-gray-700 text-sm">{alert.message}</p>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGOAlert;
