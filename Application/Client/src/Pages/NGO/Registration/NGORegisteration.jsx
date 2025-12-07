import React from "react";

function NGORegistration() {
  const goNext = () => {
    window.location.href = "verify";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      
      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in duration-700">
        <div className="grid md:grid-cols-2">

          {/* LEFT PANEL */}
          <div
            className="relative hidden md:flex flex-col justify-end p-10 text-white"
            style={{
              backgroundImage:
                "url('https://media.istockphoto.com/id/535555239/photo/happy-indian-school-children.jpg?s=612x612&w=0&k=20&c=fcpTUHiHJuaeRS-xHJy4oOflwKpBooiPecyewzohvhk=')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-emerald-600/20" />

            <div className="relative z-10">
              <h1 className="text-3xl font-bold leading-snug">
                Empowering Change Through Community
              </h1>
              <p className="mt-3 text-emerald-100">
                Join our network of NGOs making a positive impact.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              NGO Registration
            </h2>

            <form className="space-y-5">

              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Organization Name"
                  className="input"
                  required
                />
                <input
                  type="text"
                  placeholder="Registration Number"
                  className="input"
                  required
                />
              </div>

              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Organization Info"
                  className="input"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="input"
                  required
                />
              </div>

              {/* Row 3 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Contact Person Name"
                  className="input"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input"
                  required
                />
              </div>

              {/* Row 4 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Password"
                  className="input"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input"
                  required
                />
              </div>

              {/* Checkbox */}
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

              {/* Button */}
              <button
                type="button"
                onClick={goNext}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                           text-white py-3 rounded-xl font-semibold
                           hover:shadow-lg hover:scale-[1.02]
                           transition-all duration-200"
              >
                Register Now
              </button>

              {/* Login */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/ngo/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Tailwind reusable input style */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 14px;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
      `}</style>
    </div>
  );
}

export default NGORegistration;
