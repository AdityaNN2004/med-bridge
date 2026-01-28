import React, { useState, useEffect } from "react";
import NGONavbar from "./NGONavbar";
import { XCircle, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  FindPendingRequestMedicinesByNgoId,
  getAllDonatedMedicinesByNgoId,
  FindRejectedRequestMedicines,
  getListMedicinesInServiceRadius
} from "../../Services/NgoServices";
import { getEntityId } from "../../utils/jwtUtils";
/* ---------------- SAFE DATE HELPERS ---------------- */

// Extract date safely from ANY API response
const getSafeDateString = (m) => {
  return (
    m?.lastUpdated ||
    m?.last_updated ||
    m?.updatedAt ||
    m?.createdAt ||
    null
  );
};

// Used for filtering (tabs & cards)
const getTimeCategory = (dateString) => {
  if (!dateString) return "justnow";

  const date = new Date(
    typeof dateString === "string"
      ? dateString.replace(" ", "T")
      : dateString
  );

  if (isNaN(date.getTime())) return "justnow";

  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 24) return "justnow";
  if (diffDays < 7) return "week";
  if (diffDays < 30) return "month";
  return "older";
};

// Used for display text
const getExactTimeLabel = (dateString) => {
  if (!dateString) return "Just now";

  const date = new Date(
    typeof dateString === "string"
      ? dateString.replace(" ", "T")
      : dateString
  );

  if (isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

/* ---------------- MAIN COMPONENT ---------------- */
const NGOAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const ngo_id = getEntityId();
  /* ---------------- LOAD NOTIFICATIONS ---------------- */
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [
          pendingRes,
          rejectedRes,
          donatedRes,
          nearbyRes
        ] = await Promise.all([
          FindPendingRequestMedicinesByNgoId(ngo_id),
          FindRejectedRequestMedicines(ngo_id),
          getAllDonatedMedicinesByNgoId(ngo_id),
          getListMedicinesInServiceRadius(ngo_id)
        ]);

        const mapAlert = (m, title, message, type, status) => {
          const safeDate = getSafeDateString(m);

          const parsedDate = safeDate
            ? new Date(
                typeof safeDate === "string"
                  ? safeDate.replace(" ", "T")
                  : safeDate
              )
            : new Date();

          const timeMs = isNaN(parsedDate.getTime())
            ? Date.now()
            : parsedDate.getTime();

          return {
            id: `${type}-${m.id}`,
            title,
            message,
            type,
            status,
            timeCategory: getTimeCategory(safeDate),
            timeLabel: getExactTimeLabel(safeDate),
            lastUpdatedMs: timeMs
          };
        };

        const allAlerts = [
          ...(pendingRes?.data || []).map((m) =>
            mapAlert(
              m,
              "New Medicine Request",
              `${m.medicineName} request is pending approval.`,
              "warning",
              "unread"
            )
          ),
          ...(rejectedRes?.data || []).map((m) =>
            mapAlert(
              m,
              "Request Rejected",
              `${m.medicineName} request was rejected.`,
              "urgent",
              "unread"
            )
          ),
          ...(donatedRes?.data || []).map((m) =>
            mapAlert(
              m,
              "Donation Completed",
              `${m.medicineName} donation completed successfully.`,
              "success",
              "completed"
            )
          ),
          ...(nearbyRes?.data || []).map((m) =>
            mapAlert(
              m,
              "Medicine Available Nearby",
              `${m.medicineName} is available within your service radius.`,
              "success",
              "unread"
            )
          )
        ];

        // ✅ SORT: newest first
        allAlerts.sort((a, b) => b.lastUpdatedMs - a.lastUpdatedMs);

        setAlerts(allAlerts);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    loadNotifications();
  }, []);

  /* ---------------- COUNTS ---------------- */
  const totalCount = alerts.length;
  const justNowCount = alerts.filter(a => a.timeCategory === "justnow").length;
  const weekCount = alerts.filter(a => a.timeCategory === "week").length;
  const monthCount = alerts.filter(a => a.timeCategory === "month").length;

  /* ---------------- FILTER ---------------- */
  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === "all") return true;
    return a.timeCategory === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NGONavbar />

      <div className="max-w-7xl mx-auto px-6 py-28">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Alerts & Notifications
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Monitor urgent updates, expiry alerts, and completed actions
        </p>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border-l-4 border-teal-600 rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-3xl font-bold text-teal-700">{totalCount}</p>
          </div>
          <div className="bg-white border-l-4 border-indigo-600 rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Just Now</p>
            <p className="text-3xl font-bold text-indigo-700">{justNowCount}</p>
          </div>
          <div className="bg-white border-l-4 border-amber-500 rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Last Week</p>
            <p className="text-3xl font-bold text-amber-700">{weekCount}</p>
          </div>
          <div className="bg-white border-l-4 border-emerald-600 rounded-xl p-5 shadow">
            <p className="text-sm text-gray-500">Last Month</p>
            <p className="text-3xl font-bold text-emerald-700">{monthCount}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["all", "justnow", "week", "month"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-teal-700 text-white shadow"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab === "all"
                ? "All"
                : tab === "justnow"
                ? "Just Now"
                : tab === "week"
                ? "Last Week"
                : "Last Month"}
            </button>
          ))}
        </div>

        {/* NOTIFICATIONS */}
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
              <div className="mt-1">
                {alert.type === "urgent" ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : alert.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {alert.title}
                </h4>
                <p className="text-gray-700 text-sm">{alert.message}</p>
                <span className="text-xs text-gray-400">
                  {alert.timeLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGOAlert;