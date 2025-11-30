import React from "react";
import "./Registration.css";

function NGORegistration() {
  
  const goNext = () => {
    window.location.href = "verify"; // redirect on register
  };

  return (
    <div className="body-wrapper">
      <div className="container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1>Empowering Change Through Community</h1>
          <p>Join our network of NGOs making a positive impact.</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h2>NGO Registration</h2>

          <form>
            <div className="form-group">
              <input type="text" placeholder="Organization Name" required />
              <input type="text" placeholder="Registration Number" required />
            </div>

            <div className="form-group">
              <input type="text" placeholder="Organization Info" required />
              <input type="text" placeholder="Phone Number" required />
            </div>

            <div className="form-group">
              <input type="text" placeholder="Contact Person Name" required />
              <input type="email" placeholder="Email Address" required />
            </div>

            <div className="form-group">
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Confirm Password" required />
            </div>

            <div className="checkbox">
              <input type="checkbox" required />
              <label>I agree to the Terms and Conditions</label>
            </div>

            <button type="button" onClick={goNext}>
              Register Now
            </button>

            <div className="login-text">
              Already have an account? <a href="#">Sign In</a>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default NGORegistration;
