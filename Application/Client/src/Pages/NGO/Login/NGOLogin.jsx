import React from "react";
import "./NGOLogin.css";

function NGOLogin() {

  const goNext = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="login-wrapper">
      {/* LOGIN CARD */}
      <div className="login-card">
        <h2>NGO Login</h2>
        <p className="subtitle">Welcome back! Continue making an impact.</p>

        <form>
          <div className="input-box">
            <input type="email" placeholder="Email Address" required />
          </div>

          <div className="input-box">
            <input type="password" placeholder="Password" required />
          </div>

          <div className="checkbox">
            <input type="checkbox" />
            <label>Remember Me</label>
          </div>

          <button type="button" className="loginbutton"  onClick={goNext}>Login</button>

          <div className="register-link">
            Don't have an account? <a href="/ngo/register">Register Here</a>
          </div>
        </form>
      </div>

    </div>
  );
}

export default NGOLogin;
