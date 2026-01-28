import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Bell,
  FileCheck,
  LogOut,
  HeartHandshake
} from "lucide-react";

const NGONavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed left-1/2 top-6 z-50 flex -translate-x-1/2 items-center gap-2 
      rounded-full border border-green-200 bg-white/80 backdrop-blur-md p-2 shadow-lg">

      {/* Logo */}
      <Logo />
  <NavItem
          icon={<UserCircle className="w-4 h-4" />}
          active={isActive("/ngo/profile")}
          onClick={() => navigate("/ngo/profile")}
        >
          Profile
        </NavItem>
      {/* Links */}
      <div className="flex items-center gap-1 px-2">
        <NavItem
          icon={<LayoutDashboard className="w-4 h-4" />}
          active={isActive("/ngo/dashboard")}
          onClick={() => navigate("/ngo/dashboard")}
        >
          Dashboard
        </NavItem>

        <NavItem
          icon={<Package className="w-4 h-4" />}
          active={isActive("/ngo/inventory")}
          onClick={() => navigate("/ngo/inventory")}
        >
          Inventory
        </NavItem>

        <NavItem
          icon={<Bell className="w-4 h-4" />}
          active={isActive("/ngo/alert")}
          onClick={() => navigate("/ngo/alert")}
        >
          Alerts
        </NavItem>

        <NavItem
          icon={<FileCheck className="w-4 h-4" />}
          active={isActive("/ngo/listedmedicineinarea")}
          onClick={() => navigate("/ngo/listedmedicineinarea")}
        >
          Listed Medicines in Area
        </NavItem>

      

        <LogoutButton onClick={() => navigate("/")} />
      </div>
    </nav>
  );
};

/* ------------------- Sub Components ------------------- */

const Logo = () => (
  <div className="flex items-center gap-2 pl-3 pr-2 border-r border-green-200">
    <div className="relative">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 
        flex items-center justify-center">
        <HeartHandshake className="w-5 h-5 text-white" />
      </div>
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 
        bg-green-500 rounded-full border-2 border-white"></div>
    </div>
    <span className="text-sm font-bold text-green-900">MediBridge NGO</span>
  </div>
);

const NavItem = ({ children, icon, active, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`
      relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
      whitespace-nowrap
      transition-all duration-300
      ${active
        ? "bg-green-600 text-white shadow-md"
        : "text-green-800 hover:bg-green-100 hover:text-green-900"}
    `}
  >
    {icon}
    <span>{children}</span>

    {active && (
      <span className="absolute inset-0 rounded-full bg-green-600 -z-10 animate-pulse"></span>
    )}
  </button>
);

const LogoutButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      ml-2 flex items-center gap-2 rounded-full border border-red-200
      bg-red-50 px-4 py-2 text-sm font-semibold text-red-600
      transition-all duration-300

      hover:scale-105 hover:bg-red-600 hover:text-white hover:shadow-lg
      active:scale-100
    "
  >
    <LogOut className="w-4 h-4" />
    Logout
  </button>
);

export default NGONavbar;
