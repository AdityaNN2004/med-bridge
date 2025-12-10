import React from "react";
import { useNavigate } from "react-router-dom";

function DonorRegistration() {
  const navigate = useNavigate();

  const goNext = () => {
    navigate("/donor/login"); // redirect after registration
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      {/* REGISTRATION CARD */}
      <div className="w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row bg-white/85 backdrop-blur-md animate-fadeIn">

        {/* LEFT PANEL: Background Image */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage: "url('https://helplocal.in/blog/wp-content/uploads/2020/12/191286_1.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-blue-900/40" /> {/* Optional overlay */}
          <div className="relative z-10 p-10 flex flex-col justify-end text-white">
            <h2 className="text-3xl font-bold leading-snug mb-2">
              Empowering Donors to Help Local Communities
            </h2>
            <p className="text-white/80 text-sm">
              Join our network of donors and make a real difference today.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="w-full md:w-1/2 p-10">
          {/* Title */}
          <h2 className="text-2xl font-bold text-blue-800 text-center mb-1">
             Registration here
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Join our community and start making an impact.
          </p>

          <form className="space-y-4">
            {/* Row 1: First Name & Last Name */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Row 2: Email & Mobile */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Row 4: City, State, Pincode */}
            <div className="grid sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                type="text"
                placeholder="State"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <input
                type="text"
                placeholder="Pincode"
                required
                className="w-full px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-blue-600"
              />
              <span>
                I agree to the{" "}
                <span className="text-blue-600 font-medium cursor-pointer">
                  Terms and Conditions
                </span>
              </span>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={goNext}
              className="w-full py-3 bg-blue-800 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Register
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/donor/login" className="text-blue-800 font-semibold hover:underline">
                Sign In
              </a>
            </p>
          </form>
        </div>
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

export default DonorRegistration;
