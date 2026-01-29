import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NGOLogin() {
  const navigate = useNavigate();

  // ✅ logic only (no UI change)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const goNext = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9090/user/sign-in",
        { email, password }
      );

      const token = response.data.jwtString;

      // ✅ store token
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ decode JWT (simple + safe)
      const base64Url = token.split(".")[1];
      const payload = JSON.parse(atob(base64Url));



      // ✅ role check
      if (payload.role === "ROLE_NGO") {
        navigate("/ngo/dashboard");
      } else {
        setError("Unauthorized access. Please use an NGO account.");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f7f1] px-4">
      {/* LOGIN CARD */}
      <div className="w-full max-w-md p-10 rounded-2xl bg-white/85 backdrop-blur-md shadow-xl animate-fadeIn">
        {/* Title */}
        <h2 className="text-2xl font-bold text-[#2d5a27] text-center mb-1">
          NGO Login
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Welcome back! Continue making an impact.
        </p>

        {/* Form */}
        <form className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}   // ✅
              className="w-full px-4 py-3 rounded-lg border border-[#b7d5b2] bg-[#f8fff9] text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)} // ✅
              className="w-full px-4 py-3 rounded-lg border border-[#b7d5b2] bg-[#f8fff9] text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label>Remember Me</label>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={goNext}   // ✅
            className="w-full py-3 bg-green-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/ngo/register" className="text-green-700 font-semibold hover:underline">
            Register Here
          </a>
        </p>
      </div>

      {/* Tailwind Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default NGOLogin;
