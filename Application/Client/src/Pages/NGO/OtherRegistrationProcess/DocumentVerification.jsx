import React, { useState } from "react";
import { getEntityId , getToken} from "../../../utils/jwtUtils";
export default function DocumentVerification() {
  const ngoId = localStorage.getItem("ngoId"); // saved after registration
  const token = getToken();
  const [files, setFiles] = useState({
    registrationCertificate: null,
    taxExemptionCertificate: null,
    contactIdProof: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    if (!files.registrationCertificate ||
        !files.taxExemptionCertificate ||
        !files.contactIdProof) {
      setError("Please upload all required documents");
      return;
    }

    const formData = new FormData();
    formData.append("registrationCertificate", files.registrationCertificate);
    formData.append("taxExemptionCertificate", files.taxExemptionCertificate);
    formData.append("contactIdProof", files.contactIdProof);

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:9090/ngo/${ngoId}/documents`,
        {
         
          method: "POST",
           headers: {
         Authorization: `Bearer ${token}`,
           },
          body: formData, // ❗ DO NOT set Content-Type manually
        }
      );

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Upload failed");
      }

      setSuccess("Documents uploaded successfully!");

      setTimeout(() => {
        window.location.href = `/ngo/service-area`;
      }, 1200);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.href = "/ngo/register";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10">

        <h2 className="text-3xl font-bold text-center mb-6">
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

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        {/* Upload Fields */}
        <div className="space-y-5">
          <UploadField
            label="NGO Registration Certificate"
            name="registrationCertificate"
            onChange={handleFileChange}
          />
          <UploadField
            label="Tax Exemption Certificate"
            name="taxExemptionCertificate"
            onChange={handleFileChange}
          />
          <UploadField
            label="ID Proof of Contact Person"
            name="contactIdProof"
            onChange={handleFileChange}
          />
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
            onClick={handleUpload}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-purple-600
                       hover:shadow-lg hover:scale-105
                       transition-all disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Upload Field */
function UploadField({ label, name, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 bg-gray-50
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700"
      />
    </div>
  );
}
