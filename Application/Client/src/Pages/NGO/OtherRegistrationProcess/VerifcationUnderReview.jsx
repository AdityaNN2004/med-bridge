import React from "react";

export default function VerificationUnderReview() {
  function goBack() {
    window.location.href = "/ngo/service-area";
  }

  function submitForm() {
  
    window.location.href = "/ngo/login";
  }

  return (
    <div className="min-h-screen bg-[#f0f7f1] flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-[#2d5a27] text-center mb-4">
          NGO Registration Process
        </h2>

        {/* Steps Indicator */}
        <div className="flex justify-between mb-8">
          <div className="w-1/3 text-center border-b-4 border-[#2d5a27] font-semibold text-[#2d5a27]">
            1. Documents
          </div>
          <div className="w-1/3 text-center border-b-4 border-[#2d5a27] font-semibold text-[#2d5a27]">
            2. Service Area
          </div>
          <div className="w-1/3 text-center border-b-4 border-[#2d5a27] font-semibold text-[#2d5a27]">
            3. Verification
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-[#2d5a27] mb-5 text-center">
          Review & Submit
        </h3>

        <div className="space-y-3">
          <p className="bg-green-50 border-l-4 border-green-700 px-4 py-3 rounded-md text-green-800 font-medium">
            ✔ Registration details completed
          </p>

          <p className="bg-green-50 border-l-4 border-green-700 px-4 py-3 rounded-md text-green-800 font-medium">
            ✔ Documents uploaded
          </p>

          <p className="bg-green-50 border-l-4 border-green-700 px-4 py-3 rounded-md text-green-800 font-medium">
            ✔ Service area information saved
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goBack}
            className="px-8 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Back
          </button>

          <button
            onClick={submitForm}
            className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}
