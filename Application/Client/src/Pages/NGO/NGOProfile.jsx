import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getNgoDetails,
  getServiceArea,
  updateServiceArea,
} from "../../Services/NgoServices";

function NGOProfile() {
  const navigate = useNavigate();
  const ngoId = 1; // TODO: make dynamic later

  const [ngo, setNgo] = useState(null);
  const [serviceArea, setServiceArea] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditServiceModal, setShowEditServiceModal] = useState(false);

  const [editServiceForm, setEditServiceForm] = useState({
    companyName: "",
    streetAddress: "",
    landMark: "",
    city: "",
    district: "",
    zipCode: "",
    state: "",
    primaryContact: "",
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const ngoRes = await getNgoDetails(ngoId);
      setNgo(ngoRes.data);

      const serviceRes = await getServiceArea(ngoId);
      setServiceArea(serviceRes.data);
      setEditServiceForm(serviceRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load NGO profile");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [ngoId]);

  // ---------- UPDATE SERVICE AREA ----------
  const saveServiceArea = async () => {
      try {
    const payload = {
      companyName: editServiceForm.companyName,
      streetAddress: editServiceForm.streetAddress,
      landMark: editServiceForm.landMark,
      city: editServiceForm.city,
      district: editServiceForm.district,
      zipCode: editServiceForm.zipCode,
      state: editServiceForm.state,
      primaryContact: editServiceForm.primaryContact,
    };

    await updateServiceArea(ngoId, payload);

    setServiceArea(payload);        // update UI instantly
    setShowEditServiceModal(false);
    toast.success("Service Area updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update Service Area");
  }
  };

  if (loading || !ngo || !serviceArea) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gray-100">
      {/* COVER */}
      <div className="relative h-[320px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[2px] scale-110"
          style={{
            backgroundImage:
              "url('https://rajivgandhingo.wordpress.com/wp-content/uploads/2017/12/about-us-bal-utsav-bangalore-india.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      {/* CARD */}
      <div className="relative max-w-5xl mx-auto -mt-72 px-4">
        <button
          onClick={() => navigate("/ngo/dashboard")}
          className="absolute top-5 right-5 z-20 px-4 py-2 bg-white rounded-xl shadow"
        >
          ← Back
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4202/4202843.png"
              alt="NGO"
              className="w-36 h-36 rounded-full border-[5px] border-white shadow-xl -mt-24 bg-white"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {ngo.organizationName}
              </h2>
              <p className="text-gray-600 mt-2">
                Registration No: {ngo.registrationNumber}
              </p>
            </div>
          </div>

          {/* SERVICE AREA DETAILS */}
          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            <Info label="Company Name" value={serviceArea.companyName} />
            <Info label="Primary Contact" value={serviceArea.primaryContact} />
            <Info label="City" value={serviceArea.city} />
            <Info label="District" value={serviceArea.district} />
            <Info label="State" value={serviceArea.state} />
            <Info label="Zip Code" value={serviceArea.zipCode} />
          </div>

          <div className="mt-6">
            <Info
              label="Address"
              value={`${serviceArea.streetAddress}, ${serviceArea.landMark}`}
            />
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setShowEditServiceModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ---------- EDIT SERVICE AREA MODAL ---------- */}
      {showEditServiceModal && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">
            Edit Service Area Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {[
    { name: "companyName", label: "Company Name" },
    { name: "primaryContact", label: "Primary Contact" },
    { name: "streetAddress", label: "Street Address", full: true },
    { name: "landMark", label: "Landmark" },
    { name: "city", label: "City" },
    { name: "district", label: "District" },
    { name: "state", label: "State" },
    { name: "zipCode", label: "Zip Code" },
  ].map(({ name, label, full }) => (
    <div
      key={name}
      className={full ? "sm:col-span-2" : ""}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={editServiceForm[name]}
        onChange={(e) =>
          setEditServiceForm({
            ...editServiceForm,
            [name]: e.target.value,
          })
        }
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  ))}
</div>


          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setShowEditServiceModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveServiceArea}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

// ---------- COMPONENTS ----------
const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
      {children}
    </div>
  </div>
);

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
    </div>
  );
}

export default NGOProfile;