import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  TrendingUp
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import DonorNavbar from "./DonorNavbar";
import {
  getAllMedicinesCount,
  getListedMedicinesCount,
  getUnListedMedicinesCount,
  getExpiredMedicinesCount,
  getExpiringSoonMedicinesCount,
  getCompletedDonations,
  getpendingRequests
} from "../../Services/DonarServices";

function DonorDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    listed: 0,
    notListed: 0,
    expired: 0,
    expiringSoon: 0,
    completedDonation: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    fetchMedicineCounts();
  }, []);

  const fetchMedicineCounts = async () => {
    try {
      const donarId = 1; // replace later with auth user

      const [
        total,
        listed,
        unlisted,
        expired,
        expiringSoon,
        completedDonation,
        pendingRequests
      ] = await Promise.all([
        getAllMedicinesCount(donarId),
        getListedMedicinesCount(donarId),
        getUnListedMedicinesCount(donarId),
        getExpiredMedicinesCount(donarId),
        getExpiringSoonMedicinesCount(donarId),
        getCompletedDonations(donarId),
        getpendingRequests(donarId)
      ]);

      setStats({
        total: total ?? 0,
        listed: listed ?? 0,
        notListed: unlisted ?? 0,
        expired: expired ?? 0,
        expiringSoon: expiringSoon ?? 0,
        completedDonation: completedDonation ?? 0,
        pendingRequests: pendingRequests ?? 0
      });
    } catch (error) {
      console.error("Error fetching medicine counts", error);
    }
  };

  const barChartData = [
    { name: "Pending Requests", value: stats.pendingRequests },
    { name: "Completed", value: stats.completedDonation },
    { name: "Expired", value: stats.expired },
    { name: "Expiring Soon", value: stats.expiringSoon }
  ];

  const pieChartData = [
    { name: "Listed", value: stats.listed },
    { name: "Not Listed", value: stats.notListed },
    { name: "Expired", value: stats.expired }
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50">
      <DonorNavbar />

      <div className="mt-24 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview of your medicine donations and status
            </p>
          </div>

          <button
            onClick={() => navigate("/donor/add-medicine")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Medicine
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          <StatCard icon={<Package className="w-5 h-5 text-indigo-600" />} title="Total Medicines" value={stats.total} accent="indigo" />
          <StatCard icon={<CheckCircle className="w-5 h-5 text-green-600" />} title="Listed" value={stats.listed} accent="green" />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-blue-600" />} title="Not Listed" value={stats.notListed} accent="blue" />
          <StatCard icon={<AlertTriangle className="w-5 h-5 text-orange-600" />} title="Expiring Soon" value={stats.expiringSoon} accent="orange" />
          <StatCard icon={<XCircle className="w-5 h-5 text-red-600" />} title="Expired" value={stats.expired} accent="red" />
          <StatCard icon={<CheckCircle className="w-5 h-5 text-green-600" />} title="Donations Completed" value={stats.completedDonation} accent="green" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#f97316" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieChartData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, accent }) => {
  const accentMap = {
    indigo: "bg-indigo-50",
    green: "bg-green-50",
    blue: "bg-blue-50",
    orange: "bg-orange-50",
    red: "bg-red-50"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className={`inline-flex p-3 rounded-lg ${accentMap[accent]} mb-4`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
};

export default DonorDashboard;
