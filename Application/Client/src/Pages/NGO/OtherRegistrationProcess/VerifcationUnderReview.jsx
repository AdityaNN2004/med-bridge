import React from "react";
import "./Registrationstyle.css";

export default function VerifcationUnderReview() {
  function goBack() {
    window.location.href = "service-area";
  }

  function submitForm() {
    alert("Registration Submitted Successfully!");
  }

  return (
    <div className="container1">
      <h2>NGO Registration Process</h2>

      <div className="steps">
        <div className="step active">1. Documents</div>
        <div className="step active">2. Service Area</div>
        <div className="step active">3. Verification</div>
      </div>

      <div className="page slide">
        <h3>Review & Submit</h3>

        <p>✔ Registration details completed</p>
        <p>✔ Documents uploaded</p>
        <p>✔ Service area information saved</p>

        <div className="btn-area">
          <button onClick={goBack}>Back</button>
          <button onClick={submitForm}>Submit</button>
        </div>
      </div>
    </div>
  );
}
