import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, Activity } from 'lucide-react';

const DonorNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed left-1/2 top-8 flex w-fit -translate-x-1/2 items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md p-2 shadow-lg z-50">
      <Logo />
      
      <div className=" flex items-center gap-1 px-2">
        <NavLink 
          icon={<LayoutDashboard className="w-4 h-4" />}
          active={isActive('/donor/dashboard')}
          onClick={() => navigate('/donor/dashboard')}
        >
          Dashboard
        </NavLink>
        
        <NavLink 
          icon={<Package className="w-4 h-4" />}
          active={isActive('/donor/view-medicine')}
          onClick={() => navigate('/donor/view-medicine')}
        >
          My Medicines
        </NavLink>
        
        <AddButton onClick={() => navigate('/donor/add-medicine')} />
      </div>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center gap-2 pl-3 pr-2 border-r border-gray-200">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <span className="font-bold text-gray-900 text-sm">MediShare</span>
    </div>
  );
};

const NavLink = ({ children, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
        flex items-center gap-2
        ${active 
          ? 'text-white bg-indigo-600 shadow-md' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      <span className={`transition-all ${active ? 'text-white' : 'text-gray-500'}`}>
        {icon}
      </span>
      <span>{children}</span>
      
      {active && (
        <span className="absolute inset-0 rounded-full bg-indigo-600 -z-10 animate-pulse"></span>
      )}
    </button>
  );
};

const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap 
        rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 
        font-medium text-indigo-600 transition-all duration-300 ml-2
        
        before:absolute before:inset-0
        before:-z-10 before:translate-y-[200%]
        before:scale-[2.5]
        before:rounded-full before:bg-indigo-600
        before:transition-transform before:duration-500
        before:content-['']

        hover:scale-105 hover:border-indigo-600 hover:text-white hover:shadow-lg
        hover:before:translate-y-[0%]
        active:scale-100
      "
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm">Add Medicine</span>
    </button>
  );
};

export default DonorNavbar;