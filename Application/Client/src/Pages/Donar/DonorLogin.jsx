import React from "react";
import { useNavigate } from "react-router-dom";

function DonorLogin() {
  const navigate = useNavigate();

  const goNext = () => {
    navigate("/donor/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f7f1] px-4">
      {/* LOGIN CARD */}
      <div className="w-full max-w-md p-10 rounded-2xl bg-white/85 backdrop-blur-md shadow-xl animate-fadeIn">
        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-1">
          Donor Login
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
              className="w-full px-4 py-3 rounded-lg border border-[#b7d5b2] bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg border border-[#b7d5b2] bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label>Remember Me</label>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={goNext}
            className="w-full py-3 bg-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/donor/register" className="text-blue-800 font-semibold hover:underline">
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

export default DonorLogin;
