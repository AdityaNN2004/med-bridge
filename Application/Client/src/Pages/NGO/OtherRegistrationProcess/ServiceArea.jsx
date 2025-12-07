import React from "react";

export default function ServiceArea() {
  const goNext = () => {
    window.location.href = "/ngo/review";
  };

  const goBack = () => {
    window.location.href = "/ngo/verify";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10 animate-in fade-in duration-700">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
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
                className={`pb-3 font-medium ${
                  step.active
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-400 border-b-4 border-gray-200"
                }`}
              >
                {idx + 1}. {step.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-bottom-6 duration-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Service Area Details
          </h3>

          {/* Form Fields */}
          <div className="space-y-5">

            <TwoCol>
              <Input label="Company" />
              <Input label="Area / Street" />
            </TwoCol>

            <TwoCol>
              <Input label="Landmark" />
              <Input label="City / Region" />
            </TwoCol>

            <TwoCol>
              <Input label="District" />
              <Input label="Zip Code" />
            </TwoCol>

            <TwoCol>
              <Input label="State" />
              <Select
                label="Collection Type"
                options={["Pickup", "Drop-off"]}
              />
            </TwoCol>

            <TwoCol>
              <Input label="Primary Contact" />
              <Input label="Service Radius (km)" type="number" />
            </TwoCol>

          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-10">
            <button
              onClick={goBack}
              className="px-8 py-3 rounded-xl font-semibold
                         bg-gray-100 text-gray-700
                         hover:bg-gray-200 transition"
            >
              Back
            </button>

            <button
              onClick={goNext}
              className="px-8 py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-blue-600 to-purple-600
                         hover:shadow-lg hover:scale-105
                         transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Components */

function TwoCol({ children }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {children}
    </div>
  );
}

function Input({ label, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-4 py-3 rounded-xl border border-gray-300
                   bg-gray-50 focus:bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        defaultValue=""
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-300
                   bg-gray-50 focus:bg-white
                   text-gray-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled hidden>
          Select Collection Type
        </option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
