import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getDonor,
  updateDonor,
  getAddresses,
  updateAddress,
  makeAddressActive,
} from "../../Services/DonarServices";

// ---------- COMPONENT ----------
function DonorProfile() {
  const navigate = useNavigate();
  const donorId = 1; // TODO: make dynamic later

  const [donor, setDonor] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);

  // Forms
  const [editProfileForm, setEditProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  });

  const [editAddressForm, setEditAddressForm] = useState({
    id: null,
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ---------- FETCH DATA ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorRes = await getDonor(donorId);
        const donorData = donorRes.data;

        setDonor(donorData);
        setEditProfileForm({
          firstName: donorData.firstName,
          lastName: donorData.lastName,
          email: donorData.user?.email || "",
          mobile: donorData.user?.mobile || "",
        });

        const addressesRes = await getAddresses();
        setAddresses(addressesRes.data);
        setSelectedAddress(
          addressesRes.data.find((a) => a.active) || addressesRes.data[0] || null
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch donor data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [donorId]);

  // ---------- HANDLERS ----------
  const handleSwitchAddress = async (address) => {
    try {
      await makeAddressActive(address.id);
      setSelectedAddress(address);
      setShowAddressModal(false);
      toast.success("Address switched successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to switch address!");
    }
  };

  const handleEditAddressClick = (address) => {
    setEditAddressForm(address);
    setShowEditAddressModal(true);
  };

  const saveEditedProfile = async () => {
    try {
      const payload = {
        firstName: editProfileForm.firstName,
        lastName: editProfileForm.lastName,
        email: editProfileForm.email,
        mobile: editProfileForm.mobile,
      };

      await updateDonor(donorId, payload);
      setDonor({ ...donor, ...payload });
      setShowEditProfileModal(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile!");
    }
  };

  const saveEditedAddress = async () => {
    try {
      const { id, fullAddress, city, state, pincode } = editAddressForm;

      await updateAddress(id, { fullAddress, city, state, pincode });

      const updatedAddresses = addresses.map((addr) =>
        addr.id === id
          ? { ...addr, fullAddress, city, state, pincode }
          : addr
      );

      setAddresses(updatedAddresses);

      if (selectedAddress?.id === id) {
        setSelectedAddress({
          ...selectedAddress,
          fullAddress,
          city,
          state,
          pincode,
        });
      }

      setShowEditAddressModal(false);
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update address!");
    }
  };

  if (loading || !donor)
    return <div className="p-10 text-center">Loading...</div>;

  const email = donor.user?.email || "";
  const mobile = donor.user?.mobile || "";

  // ---------- JSX ----------
  return (
    <div className="min-h-screen bg-gray-100">
      {/* PROFILE COVER */}
      <div className="relative h-[340px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[2px] scale-110"
          style={{
            backgroundImage:
              "url('https://rajivgandhingo.wordpress.com/wp-content/uploads/2017/12/about-us-bal-utsav-bangalore-india.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      {/* PROFILE CARD */}
      <div className="relative max-w-5xl mx-auto -mt-69 px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-15 z-20 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur text-gray-700 text-sm font-medium rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-300"
        >
          ← Back
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={
                donor.profileImage ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Donor"
              className="w-36 h-36 rounded-full border-[5px] border-white shadow-xl -mt-24 bg-white hover:scale-105 transition"
            />

            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {donor.firstName} {donor.lastName}
              </h2>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>✉ {email}</p>
                <p>📞 {mobile}</p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            <ProfileItem label="First Name" value={donor.firstName} />
            <ProfileItem label="Last Name" value={donor.lastName} />
            <ProfileItem label="Email" value={email} />
            <ProfileItem label="Mobile" value={mobile} />
          </div>

          {selectedAddress && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Current Address
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <p className="font-semibold text-gray-800">
                  {selectedAddress.fullAddress}
                </p>
                <p className="text-gray-600 mt-1">
                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pincode}
                </p>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="mt-5 px-5 py-2.5 bg-blue-600 text-white text-sm rounded-xl shadow hover:bg-blue-500 hover:scale-105 transition-all"
              >
                Switch Address
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ---------- MODALS ---------- */}
      {showEditProfileModal && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
          <div className="space-y-3">
            {["firstName", "lastName", "email", "mobile"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={editProfileForm[field]}
                onChange={(e) =>
                  setEditProfileForm({
                    ...editProfileForm,
                    [field]: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveEditedProfile}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {showAddressModal && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Select Address</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div className="text-sm">
                  <p className="font-medium">{addr.fullAddress}</p>
                  <p className="text-gray-600">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSwitchAddress(addr)}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleEditAddressClick(addr)}
                    className="text-xs px-3 py-1 bg-yellow-500 text-white rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setShowAddressModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {showEditAddressModal && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Edit Address</h3>
          <div className="space-y-3">
            {["fullAddress", "city", "state", "pincode"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field}
                value={editAddressForm[field]}
                onChange={(e) =>
                  setEditAddressForm({
                    ...editAddressForm,
                    [field]: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setShowEditAddressModal(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveEditedAddress}
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

// ---------- MODAL ----------
const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
      {children}
    </div>
  </div>
);

// ---------- PROFILE ITEM ----------
function ProfileItem({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

export default DonorProfile;
