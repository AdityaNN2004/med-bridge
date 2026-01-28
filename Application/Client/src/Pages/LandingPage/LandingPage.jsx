import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <div className="landing-container">
        <div className="hero-content">
          <p className="hero-subtitle">Help us to Save</p>

          <h1 className="hero-title">
            A Helping Hand for the <br /> Homeless People
          </h1>

          <p className="hero-desc">
            Connecting donors and NGOs to ensure unused medicines
            reach people who need them the most.
          </p>

          <div className="buttons">
            <button className="btn ngo" onClick={() => navigate("/ngo/login")}>
              NGO Login
            </button>
            <button className="btn donor" onClick={() => navigate("/donor/login")}>
              Donor
            </button>
          </div>
        </div>
      </div>

      {/* WHITE SECTION BELOW */}
      <div className="white-section">
        <p className="section-subtitle">Our Core Mission</p>
        <h2 className="section-title">
          We Invest in Health, Care & Community Well-Being
        </h2>
        <p className="section-desc">
          MediBridge helps NGOs connect with donors to reduce medicine waste
          and improve healthcare accessibility for underserved communities.
        </p>
      </div>
    </>
  );
};

export default LandingPage;
