import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to Our Platform</h1>
      <p>Choose your role to continue</p>
      <div className="buttons">
        <button className="btn ngo" onClick={() => navigate("/ngo/login")}>
          NGO Login
        </button>
        <button className="btn donor" onClick={() => navigate("/donor/login")}>
          Donor
        </button>
        <button className="btn donor" onClick={() => navigate("/mapwithradius")}>
          map with radius test
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
