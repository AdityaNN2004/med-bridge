import React from "react";
import "./Registrationstyle.css";

export default function DocumentVerification() {
  function goNext() {
    window.location.href = "service-area";
  }

  function goBack() {
    window.location.href = "/ngo/register";
  }

  return (
    <div className="container1">
      <h2>NGO Registration Process</h2>
      <div className="steps">
        <div className="step active">1. Documents</div>
        <div className="step">2. Service Area</div>
        <div className="step">3. Verification</div>
      </div>

      <div className="page slide">
        <h3>Upload Documents</h3>

        <div className="input-group">
          <label>NGO Registration Certificate</label>
          <input type="file" />
        </div>

        <div className="input-group">
          <label>Tax Exemption Certificate</label>
          <input type="file" />
        </div>

        <div className="input-group">
          <label>ID Proof of Contact Person</label>
          <input type="file" />
        </div>

        <div className="btn-area">
          <button onClick={goBack}>Back</button>
          <button onClick={goNext}>Next</button>
        </div>
      </div>
    </div>
  );
}