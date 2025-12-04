import React from "react";
import "./NGOAlert.css";
import NGONavbar from "../Navbar/NGONavbar";
const NGOAlert = () => {
  return (
    <div>
  <NGONavbar />

<div className="alert-wrapper">
       
      <div className="alert-page">

        {/* Header */}
        <div className="alert-header">
        </div>

        {/* Summary */}
        <div className="alert-summary">
          <div className="summary-box unread">
            <span>Unread</span>
            <h3>3</h3>
          </div>

          <div className="summary-box urgent">
            <span>Urgent</span>
            <h3>3</h3>
          </div>

          <div className="summary-box completed">
            <span>Completed</span>
            <h3>2</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="alert-tabs">
          <button className="active">All Notifications (8)</button>
          <button>Unread (3)</button>
          <button>Urgent</button>
          <button>Completed</button>
        </div>

        {/* Alerts List */}
        <div className="alert-list">

          <div className="alert-card urgent-card">
            <div className="alert-icon">⚠️</div>
            <div className="alert-text">
              <h4>Urgent: Medicine Expiring Soon</h4>
              <p>Vitamin D3 1000IU will expire in 8 days. Consider donating soon.</p>
              <span>2 hours ago</span>
            </div>
          </div>

          <div className="alert-card warning-card">
            <div className="alert-icon">⚠️</div>
            <div className="alert-text">
              <h4>Expiry Warning</h4>
              <p>Cetirizine 10mg will expire in 23 days.</p>
              <span>5 hours ago</span>
            </div>
          </div>

          <div className="alert-card reminder-card">
            <div className="alert-icon">⚠️</div>
            <div className="alert-text">
              <h4>Expiry Reminder</h4>
              <p>Ibuprofen 400mg will expire in 60 days.</p>
              <span>8 hours ago</span>
            </div>
          </div>

        </div>

      </div>
    </div>
    </div>
    
  );
};

export default NGOAlert;
