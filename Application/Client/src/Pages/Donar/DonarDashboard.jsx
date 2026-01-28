import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  User,
  LayoutDashboard,
  LogOut
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
  AreaChart,
  Area
} from "recharts";

import {
  getAllMedicinesCount,
  getListedMedicinesCount,
  getUnListedMedicinesCount,
  getExpiredMedicinesCount,
  getExpiringSoonMedicinesCount,
  getCompletedDonations,
  getpendingRequests
} from "../../Services/DonarServices";

import { getEntityId,isTokenExpired } from "../../utils/jwtUtils";

function DonorDashboard() {
  const navigate = useNavigate();
  const location = window.location;

  const [stats, setStats] = useState({
    total: 0,
    listed: 0,
    notListed: 0,
    expired: 0,
    expiringSoon: 0,
    completedDonation: 0,
    pendingRequests: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem('authToken');
    if (!token || isTokenExpired()) {
      console.error('No valid token found, redirecting to login');
      navigate('/donor/login');
      return;
    }

    fetchMedicineCounts();
  }, [navigate]);

  const fetchMedicineCounts = async () => {
    try {
      setLoading(true);
      
      // Get donarId from token
      const donarId = getEntityId();
      
      if (!donarId) {
        console.error('No donarId found in token');
        navigate('/donor/login');
        return;
      }

      console.log('Fetching data for Donar ID:', donarId);

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
      // If error is due to authentication, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('donorToken');
        navigate('/donor/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('donorToken');
    navigate('/donor/login');
  };

  // Dynamic chart data based on backend stats
  const barChartData = [
    { name: "Pending", value: stats.pendingRequests, color: "#8b5cf6" },
    { name: "Completed", value: stats.completedDonation, color: "#10b981" },
    { name: "Expired", value: stats.expired, color: "#ef4444" },
    { name: "Expiring", value: stats.expiringSoon, color: "#f59e0b" }
  ];

  const pieChartData = [
    { name: "Listed", value: stats.listed },
    { name: "Not Listed", value: stats.notListed },
    { name: "Expired", value: stats.expired }
  ].filter(item => item.value > 0);

  const generateTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentTotal = stats.completedDonation;
    
    return months.map((month, index) => ({
      month,
      donations: Math.max(0, Math.floor(currentTotal * (0.5 + (index * 0.15))))
    }));
  };

  const trendData = generateTrendData();

  const recentActivity = [];
  
  if (stats.listed > 0) {
    recentActivity.push({
      action: "Medicine Listed",
      medicine: `${stats.listed} medicine(s) currently listed`,
      time: "Active",
      status: "success"
    });
  }
  
  if (stats.pendingRequests > 0) {
    recentActivity.push({
      action: "Pending Requests",
      medicine: `${stats.pendingRequests} donation request(s) pending`,
      time: "Awaiting response",
      status: "pending"
    });
  }
  
  if (stats.completedDonation > 0) {
    recentActivity.push({
      action: "Donations Completed",
      medicine: `${stats.completedDonation} successful donation(s)`,
      time: "Completed",
      status: "success"
    });
  }

  const COLORS = ["#10b981", "#3b82f6", "#ef4444"];

  const calculateChange = (current) => {
    if (current === 0) return { value: "0%", isPositive: true };
    const mockChange = Math.floor(Math.random() * 30) - 10;
    return {
      value: `${Math.abs(mockChange)}%`,
      isPositive: mockChange >= 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 z-50 w-260 max-w-7xl -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full p-2 shadow-lg">
        <div className="flex items-center justify-center px-4 gap-2 overflow-x-auto scrollbar-hide">
          {/* LOGO */}
          <div className="flex items-center gap-2 pl-3 pr-2 border-r border-gray-200 flex-shrink-0">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">MediBridge</span>
          </div>

          {/* CENTER NAV */}
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
            <button
              onClick={() => navigate('/donor/viewprofile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                isActive('/donor/viewprofile')
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => navigate('/donor/dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                isActive('/donor/dashboard')
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => navigate('/donor/view-medicine')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                isActive('/donor/view-medicine')
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              My Medicines
            </button>

            <button
              onClick={() => navigate('/donor/listedmedicine')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                isActive('/donor/listedmedicine')
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Listed Medicines
            </button>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/donor/add-medicine')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-300 bg-red-50 text-red-600 text-sm font-medium transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-lg flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your medicine donations today
            </p>
          </div>

          <button 
            onClick={() => navigate('/donor/add-medicine')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Medicine
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="w-6 h-6" />}
            title="Total Medicines"
            value={stats.total}
            change={calculateChange(stats.total)}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Active Listings"
            value={stats.listed}
            change={calculateChange(stats.listed)}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Pending Requests"
            value={stats.pendingRequests}
            change={calculateChange(stats.pendingRequests)}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Completed"
            value={stats.completedDonation}
            change={calculateChange(stats.completedDonation)}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Donation Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Donation Trends</h3>
                <p className="text-sm text-gray-500 mt-1">Monthly donation activity overview</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="donations"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#colorDonations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Medicine Status Pie Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Medicine Status</h3>
            <p className="text-sm text-gray-500 mb-4">Distribution overview</p>
            {pieChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {pieChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                  {pieChartData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-xs font-medium text-gray-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Status Overview</h3>
            <p className="text-sm text-gray-500 mb-6">Current medicine request status</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <XAxis 
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                  {barChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Activity Summary</h3>
                <p className="text-sm text-gray-500 mt-1">Current status</p>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.status === 'success' ? 'bg-green-50' : 'bg-orange-50'
                    }`}>
                      {item.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-600">{item.medicine}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        {(stats.expiringSoon > 0 || stats.expired > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {stats.expiringSoon > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 mb-1">Expiring Soon</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      {stats.expiringSoon} medicine{stats.expiringSoon > 1 ? 's' : ''} will expire within 30 days
                    </p>
                    <button 
                      onClick={() => navigate('/donor/view-medicine')}
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {stats.expired > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 mb-1">Expired Medicines</h4>
                    <p className="text-sm text-red-700 mb-3">
                      {stats.expired} expired medicine{stats.expired > 1 ? 's' : ''} need{stats.expired === 1 ? 's' : ''} to be removed
                    </p>
                    <button 
                      onClick={() => navigate('/donor/view-medicine')}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Manage Now →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, change, gradient }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
          change.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {change.isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change.value}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{title}</p>
    </div>
  );
};

export default DonorDashboard;