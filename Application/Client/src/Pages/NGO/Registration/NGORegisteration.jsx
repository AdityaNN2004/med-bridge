import React, { useState } from "react";

function NGORegistration() {
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      organizationName: formData.name,
      registrationNumber: formData.registrationNumber,
      contactNumber: formData.contactNumber,
      confirmPassword: formData.confirmPassword,
      user: {
        email: formData.email,
        password: formData.password,
        mobile: formData.contactNumber 
      },
    };

    try {
      setLoading(true);

      const response = await fetch("http://localhost:9090/ngo/register1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Registration failed");
      }
     

      const data = await response.json();
       localStorage.setItem("ngoId", data.id);
      setSuccess("NGO registered successfully!");
      console.log("Registered NGO:", data);

      // Move to document upload step
      setTimeout(() => {
        window.location.href = `/ngo/verify`;
      }, 1500);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        <div className="grid md:grid-cols-2">

          {/* LEFT PANEL */}
          <div
            className="relative hidden md:flex flex-col justify-end p-10 text-white"
            style={{
              backgroundImage:
                "url('https://media.istockphoto.com/id/535555239/photo/happy-indian-school-children.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-emerald-600/20" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold">
                Empowering Change Through Community
              </h1>
              <p className="mt-3 text-emerald-100">
                Join our network of NGOs making a difference.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8">NGO Registration</h2>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

            <form className="space-y-5" onSubmit={handleRegister}>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  placeholder="Organization Name"
                  className="input"
                  required
                  onChange={handleChange}
                />
                <input
                  name="registrationNumber"
                  placeholder="Registration Number"
                  className="input"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="contactNumber"
                  placeholder="Phone Number"
                  className="input"
                  required
                  onChange={handleChange}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="input"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="input"
                  required
                  onChange={handleChange}
                />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="input"
                  required
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600
                           text-white py-3 rounded-xl font-semibold
                           hover:shadow-lg hover:scale-[1.02]
                           transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/ngo/login" className="text-blue-600 hover:underline">
                  Sign In
                </a>
              </p>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
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
