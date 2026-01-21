import React, { useState } from "react";

export default function ServiceArea() {
  const ngoId = localStorage.getItem("ngoId");

  const [formData, setFormData] = useState({
    companyName: "",
    streetAddress: "",
    landMark: "",
    city: "",
    district: "",
    zipCode: "",
    state: "",
    collectionType: "",
    primaryContact: "",
    serviceRadius: ""
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

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!ngoId) {
      setError("NGO ID not found. Please register again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:9090/ngo/${ngoId}/service-area`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to save service area");
      }

      console.log(formData);
      setSuccess("Service area saved successfully!");

      setTimeout(() => {
        window.location.href = "/ngo/review";
      }, 1200);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.href = "/ngo/verify";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10">

        <h2 className="text-3xl font-bold text-center mb-6">
          NGO Registration Process
        </h2>

        {/* Steps */}
        <div className="flex justify-between mb-10">
          {[
            { label: "Documents", active: true },
            { label: "Service Area", active: true },
            { label: "Verification", active: false },
          ].map((step, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div
                className={`pb-3 font-medium ${step.active
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-400 border-b-4 border-gray-200"
                  }`}
              >
                {idx + 1}. {step.label}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="space-y-5">

          <TwoCol>
            <Input label="Company" name="companyName" onChange={handleChange} />
            <Input label="Area / Street" name="streetAddress" onChange={handleChange} />
          </TwoCol>

          <TwoCol>
            <Input label="Landmark" name="landMark" onChange={handleChange} />
            <Input label="City / Region" name="city" onChange={handleChange} />
          </TwoCol>

          <TwoCol>
            <Input label="District" name="district" onChange={handleChange} />
            <Input label="Zip Code" name="zipCode" onChange={handleChange} />
          </TwoCol>

          <TwoCol>
            <Input label="State" name="state" onChange={handleChange} />
            <Select
              label="Collection Type"
              name="collectionType"
              options={["PICK_UP", "DROP"]}
              onChange={handleChange}
            />
          </TwoCol>

          <TwoCol>
            <Input
              label="Primary Contact"
              name="primaryContact"
              onChange={handleChange}
            />
            <Input
              label="Service Radius (km)"
              name="serviceRadius"
              type="number"
              onChange={handleChange}
            />

          </TwoCol>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={goBack}
            className="px-8 py-3 rounded-xl font-semibold
                       bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-purple-600
                       hover:shadow-lg hover:scale-105
                       transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Components */

function TwoCol({ children }) {
  return <div className="grid md:grid-cols-2 gap-5">{children}</div>;
}

function Input({ label, name, type = "text", onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        name={name}
        type={type}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-gray-300
                   bg-gray-50 focus:bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, name, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        name={name}
        defaultValue=""
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-gray-300
                   bg-gray-50 text-gray-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled hidden>
          Select Collection Type
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
