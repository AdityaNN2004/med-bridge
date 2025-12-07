import React from "react";

export default function DocumentVerification() {
  const goNext = () => {
    window.location.href = "service-area";
  };

  const goBack = () => {
    window.location.href = "/ngo/register";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10 animate-in fade-in duration-700">

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          NGO Registration Process
        </h2>

        {/* Steps */}
        <div className="flex justify-between mb-10">
          {["Documents", "Service Area", "Verification"].map((step, index) => (
            <div key={step} className="flex-1 text-center">
              <div
                className={`pb-3 font-medium ${
                  index === 0
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-400 border-b-4 border-gray-200"
                }`}
              >
                {index + 1}. {step}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="animate-in slide-in-from-bottom-6 duration-500">

          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Upload Documents
          </h3>

          {/* Upload Fields */}
          <div className="space-y-5">

            <UploadField label="NGO Registration Certificate" />
            <UploadField label="Tax Exemption Certificate" />
            <UploadField label="ID Proof of Contact Person" />

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

/* Reusable Upload Field */
function UploadField({ label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="file"
        className="w-full rounded-xl border border-gray-300 bg-gray-50
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
