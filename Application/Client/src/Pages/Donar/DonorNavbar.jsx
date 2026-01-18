import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  Activity,
  LogOut,
  User
} from 'lucide-react';

const DonorNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-260 max-w-7xl -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full p-2 shadow-lg">
      <div className="flex items-center justify-center px-4 gap-2 overflow-x-auto scrollbar-hide">

        {/* LOGO */}
        <Logo />

        {/* CENTER NAV */}
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
         <NavLink
            icon={<User className="w-4 h-4" />}
            active={isActive('/donor/profile')}
            onClick={() => navigate('/donor/viewprofile')}
          >
            Profile
          </NavLink>
          <NavLink
            icon={<LayoutDashboard className="w-4 h-4" />}
            active={isActive('/donor/dashboard')}
            onClick={() => navigate('/donor/dashboard')}
          >
            Dashboard
          </NavLink>

          {/* 🔥 PROFILE BUTTON */}
          

          <NavLink
            icon={<Package className="w-4 h-4" />}
            active={isActive('/donor/view-medicine')}
            onClick={() => navigate('/donor/view-medicine')}
          >
            My Medicines
          </NavLink>

          <NavLink
            icon={<Package className="w-4 h-4" />}
            active={isActive('/donor/listedmedicine')}
            onClick={() => navigate('/donor/listedmedicine')}
          >
            Listed Medicines
          </NavLink>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <AddButton onClick={() => navigate('/donor/add-medicine')} />
          <LogoutButton onClick={handleLogout} />
        </div>
         
      </div>
      
    </nav>
  );
};

/* ================= LOGO ================= */
const Logo = () => {
  return (
    <div className="flex items-center gap-2 pl-3 pr-2 border-r border-gray-200 flex-shrink-0">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
      </div>
      <span className="font-bold text-gray-900 text-sm">MediBridge</span>
    </div>
  );
};

/* ================= NAV LINK ================= */
const NavLink = ({ children, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0
      ${
        active
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }
    `}
  >
    {icon}
    {children}
  </button>
);

/* ================= ADD BUTTON ================= */
const AddButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:shadow-lg flex-shrink-0"
  >
    <Plus className="w-4 h-4" />
    Add Medicine
  </button>
);

/* ================= LOGOUT ================= */
const LogoutButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-300 bg-red-50 text-red-600 text-sm font-medium transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-lg flex-shrink-0"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </button>
);

export default DonorNavbar;
