import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DonorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9090/user/sign-in",
        { email, password }
      );

      const token = response.data.jwtString;

      // ✅ unified token name
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ✅ decode JWT
      const base64Url = token.split(".")[1];
      const payload = JSON.parse(atob(base64Url));

      console.log("JWT PAYLOAD:", payload);

      if (payload.role === "ROLE_DONAR") {
        navigate("/donor/dashboard");
      } else {
        setError("Unauthorized access. Please use a donor account.");
      }

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f7f1] px-4">
      <div className="w-full max-w-md p-10 rounded-2xl bg-white/85 backdrop-blur-md shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-1">
          Donor Login
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Welcome back! Continue making an impact.
        </p>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#b7d5b2] bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#b7d5b2] bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <label>Remember Me</label>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3 bg-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm text-center mt-3">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/donor/register" className="text-blue-800 font-semibold hover:underline">
            Register Here
          </a>
        </p>
      </div>

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

export default DonorLogin;
