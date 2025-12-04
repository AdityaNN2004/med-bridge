import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NGONavbar.css";

const NGONavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/ngo/login");
  };

  return (
    <div className="ngo-navbar-container">

      {/* LEFT SIDEBAR */}
      <aside className="ngo-sidebar">
        <nav className="ngo-nav-links">
          <NavLink to="/ngo/dashboard" className="ngo-nav-item">
            Dashboard
          </NavLink>

          <NavLink to="/ngo/inventory" className="ngo-nav-item">
            Inventory
          </NavLink>

          <NavLink to="/ngo/alert" className="ngo-nav-item">
            Alerts
          </NavLink>

          <NavLink to="/ngo/requests" className="ngo-nav-item">
            Requests
          </NavLink>

          <NavLink to="/ngo/review" className="ngo-nav-item">
            Review Status
          </NavLink>
        
        <button className="ngo-logout-btn" onClick={handleLogout}>
          Logout
        </button>
        </nav>
   
      </aside>
    </div>
  );
};

export default NGONavbar;
