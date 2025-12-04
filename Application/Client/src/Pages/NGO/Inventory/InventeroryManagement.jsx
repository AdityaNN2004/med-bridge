import React from "react";
import "./InventeroryManagement.css";
import NGONavbar from "../Navbar/NGONavbar";

const InventeroryManagement = () => {
  return (
    <>
      <NGONavbar />

      <div className="inventory-page-container">

        {/* HEADER */}
        <div className="inventory-header">
          {/* <h2 className="inventory-header-title">Inventory Management</h2> */}
          {/* <p className="inventory-header-subtitle">
            Track and manage your received medicine donations
          </p> */}
        </div>

        {/* TOP ALERT BOXES */}
        <div className="inventory-alert-section">
          <div className="inventory-alert-card inventory-alert-urgent">
            <p className="inventory-alert-title">Urgent (≤7 days)</p>
            <h3 className="inventory-alert-value">0</h3>
          </div>

          <div className="inventory-alert-card inventory-alert-warning">
            <p className="inventory-alert-title">Expiring Soon (≤30 days)</p>
            <h3 className="inventory-alert-value">2</h3>
          </div>

          <div className="inventory-alert-card inventory-alert-expired">
            <p className="inventory-alert-title">Expired</p>
            <h3 className="inventory-alert-value">1</h3>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="inventory-search-section">
          <input
            className="inventory-search-input"
            type="text"
            placeholder="Search by medicine name or batch number..."
          />
          <button className="inventory-filter-btn">Advanced Filters</button>
        </div>

        {/* TABS */}
        <div className="inventory-tabs">
          <button className="inventory-tab active">All (5)</button>
          <button className="inventory-tab">Active (2)</button>
          <button className="inventory-tab">Expiring Soon (2)</button>
          <button className="inventory-tab">Expired (1)</button>
        </div>

        {/* TABLE */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Batch Number</th>
                <th>Stock</th>
                <th>Donor</th>
                <th>Received</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <div className="inventory-med-text">
                    <strong>Paracetamol 500mg</strong>
                    <p>Pain Relief</p>
                  </div>
                </td>

                <td>BATCH-2025-001</td>

                <td>
                  <div className="inventory-stock-bar">
                    <span className="inventory-stock-text">100 / 150</span>
                    <div className="inventory-stock-progress">
                      <div className="inventory-stock-fill"></div>
                    </div>
                  </div>
                </td>

                <td>John Donor</td>

                <td>Oct 1, 2025</td>

                <td>
                  Dec 2025
                  <p className="inventory-expire-days">85 days left</p>
                </td>

                <td>
                  <span className="inventory-status-active">Active</span>
                </td>

                <td className="inventory-actions">View Details</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SUMMARY SECTION */}
        <div className="inventory-summary-container">
          <h3 className="inventory-summary-title">Distribution Summary</h3>

          <div className="inventory-summary-grid">
            <div className="inventory-summary-card">
              <h4>Received</h4>
              <p className="inventory-summary-value">590 units</p>
            </div>

            <div className="inventory-summary-card">
              <h4>Distributed</h4>
              <p className="inventory-summary-value">385 units</p>
            </div>

            <div className="inventory-summary-card">
              <h4>In Stock</h4>
              <p className="inventory-summary-value">205 units</p>
            </div>

            <div className="inventory-summary-card">
              <h4>Patients Helped</h4>
              <p className="inventory-summary-value">156</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default InventeroryManagement;
