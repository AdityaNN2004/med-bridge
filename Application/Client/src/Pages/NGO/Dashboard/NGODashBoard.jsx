import React from "react";
import "./NGODashboard.css";
import NGONavbar from "../Navbar/NGONavbar";
const NGODashboard = () => {
  return (
    <div className="dashboard-layout">
      {/* MAIN SECTION */}
      <main className="main-content">
        <NGONavbar />
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2>Hope Medical Foundation <span className="verified">✔ Verified</span></h2>
          <p>Welcome back! Here's your donation overview</p>
        </section>

        {/* Top Cards */}
        <section className="top-cards">

          <div className="card">
            <div className="card-icon cube">📦</div>
            <h4>Total Donations Received</h4>
            <h2>143</h2>
            <p className="growth">+12%</p>
          </div>

          <div className="card">
            <div className="card-icon clock">⏳</div>
            <h4>Pending Requests</h4>
            <h2>8</h2>
            <p className="growth">3 new</p>
          </div>

          <div className="card">
            <div className="card-icon people">👥</div>
            <h4>Active Donors</h4>
            <h2>52</h2>
            <p className="growth">+5 this week</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <button className="qa-btn teal"><span>🔍</span> Search Medicines</button>
          <button className="qa-btn"><span>🤍</span> View Requests</button>
          <button className="qa-btn"><span>📦</span> Manage Inventory</button>
        </section>

        {/* Graphs Area */}
        <section className="graphs-section">

          <div className="graph-card">
            <h3>Monthly Donation Trends</h3>
            <div className="graph-placeholder">📊 (Bar Graph)</div>
          </div>

          <div className="graph-card">
            <h3>Medicine Categories</h3>
            <div className="graph-placeholder">🟢🟣🟡 (Donut Chart)</div>
          </div>

        </section>

        {/* Recent Donations */}
        <section className="recent-section">
          <div className="section-header">
            <h3>Recent Donations</h3>
            <button className="view-all">View All</button>
          </div>

          <div className="donation-card">
            <div>
              <h4>Paracetamol 500mg</h4>
              <p>From John D.</p>
              <span>📍 2.3 km</span> | <span>📦 50 units</span> | <span>⏳ Exp: Dec 2025</span>
            </div>
            <div className="status pending">Pending</div>
            <button className="accept-btn">Accept</button>
          </div>

          <div className="donation-card">
            <div>
              <h4>Amoxicillin 250mg</h4>
              <p>From Sarah M.</p>
              <span>📍 3.7 km</span> | <span>📦 30 units</span> | <span>⏳ Exp: Jan 2026</span>
            </div>
            <div className="status confirmed">Confirmed</div>
          </div>

          <div className="donation-card">
            <div>
              <h4>Vitamin D3 1000IU</h4>
              <p>From Mike R.</p>
              <span>📍 1.2 km</span> | <span>📦 60 units</span> | <span>⏳ Exp: Nov 2025</span>
            </div>
            <div className="status received">Received</div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default NGODashboard;
