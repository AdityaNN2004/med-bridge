import React from "react";
import "./Registrationstyle.css";

export default function ServiceArea() {
  function goNext() {
    window.location.href = "/ngo/review";
  }
  function goBack() {
    window.location.href = "/ngo/verify";
  }

  return (
    <div className="container1">
      <h2>NGO Registration Process</h2>

      <div className="steps">
        <div className="step active">1. Documents</div>
        <div className="step active">2. Service Area</div>
        <div className="step">3. Verification</div>
      </div>

      <div className="page">
        <h3>Service Area Details</h3>

        <div className="row">
          <div className="input-group">
            <label>Company</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Area / Street</label>
            <input type="text" />
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>Landmark</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>City / Region</label>
            <input type="text" />
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>District</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Zip Code</label>
            <input type="text" />
          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>State</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Collection Type</label>

        <select defaultValue="" required>
        <option value="" disabled hidden>Select Collection Type</option>
         <option>Pickup</option>
         <option>Drop-off</option>
        </select>



          </div>
        </div>

        <div className="row">
          <div className="input-group">
            <label>Primary Contact</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Service Radius (km)</label>
            <input type="number" />
          </div>
        </div>

        <div className="btn-area">
          <button onClick={goBack}>Back</button>
          <button onClick={goNext}>Next</button>
        </div>
      </div>
    </div>
  );
}
