import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Camera,
  Home,
  CheckCircle
} from "lucide-react";

import {
  getDonor,
  updateDonor,
  getAddresses,
  updateAddress,
  makeAddressActive,
} from "../../Services/DonarServices";

function DonorProfile() {
  const navigate = useNavigate();
  const donorId = 1; // TODO: make dynamic later

  const [donor, setDonor] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);

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

  // Fetch data from backend
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

  if (loading || !donor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const email = donor.user?.email || "";
  const mobile = donor.user?.mobile || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with gradient */}
      <div className="relative h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur text-gray-700 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Profile Card */}
      <div className="relative max-w-5xl mx-auto -mt-32 px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Profile Header Section */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                  <img
                    src={
                      donor.profileImage ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors opacity-0 group-hover:opacity-100">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {donor.firstName} {donor.lastName}
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{mobile}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <InfoCard icon={<User className="w-5 h-5 text-indigo-600" />} label="First Name" value={donor.firstName} />
              <InfoCard icon={<User className="w-5 h-5 text-purple-600" />} label="Last Name" value={donor.lastName} />
              <InfoCard icon={<Mail className="w-5 h-5 text-blue-600" />} label="Email Address" value={email} />
              <InfoCard icon={<Phone className="w-5 h-5 text-green-600" />} label="Mobile Number" value={mobile} />
            </div>
          </div>

          {/* Address Section */}
          {selectedAddress && (
            <div className="px-8 pb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Current Address
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Switch Address
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-2 border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg mb-2">
                      {selectedAddress.fullAddress}
                    </p>
                    <p className="text-gray-600">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <Modal onClose={() => setShowEditProfileModal(false)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Edit2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
          </div>
          
          <div className="space-y-4">
            <InputField
              label="First Name"
              icon={<User className="w-5 h-5 text-gray-400" />}
              value={editProfileForm.firstName}
              onChange={(e) =>
                setEditProfileForm({ ...editProfileForm, firstName: e.target.value })
              }
            />
            <InputField
              label="Last Name"
              icon={<User className="w-5 h-5 text-gray-400" />}
              value={editProfileForm.lastName}
              onChange={(e) =>
                setEditProfileForm({ ...editProfileForm, lastName: e.target.value })
              }
            />
            <InputField
              label="Email"
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              value={editProfileForm.email}
              onChange={(e) =>
                setEditProfileForm({ ...editProfileForm, email: e.target.value })
              }
            />
            <InputField
              label="Mobile"
              icon={<Phone className="w-5 h-5 text-gray-400" />}
              value={editProfileForm.mobile}
              onChange={(e) =>
                setEditProfileForm({ ...editProfileForm, mobile: e.target.value })
              }
            />
          </div>
          
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={saveEditedProfile}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && (
        <Modal onClose={() => setShowAddressModal(false)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Select Address</h3>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border-2 rounded-2xl p-5 transition-all hover:shadow-md ${
                  selectedAddress?.id === addr.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-2">{addr.fullAddress}</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {selectedAddress?.id !== addr.id && (
                      <button
                        onClick={() => handleSwitchAddress(addr)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                      >
                        Select
                      </button>
                    )}
                    <button
                      onClick={() => handleEditAddressClick(addr)}
                      className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setShowAddressModal(false)}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Address Modal */}
      {showEditAddressModal && (
        <Modal onClose={() => setShowEditAddressModal(false)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Edit Address</h3>
          </div>
          
          <div className="space-y-4">
            <InputField
              label="Full Address"
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
              value={editAddressForm.fullAddress}
              onChange={(e) =>
                setEditAddressForm({ ...editAddressForm, fullAddress: e.target.value })
              }
            />
            <InputField
              label="City"
              icon={<Home className="w-5 h-5 text-gray-400" />}
              value={editAddressForm.city}
              onChange={(e) =>
                setEditAddressForm({ ...editAddressForm, city: e.target.value })
              }
            />
            <InputField
              label="State"
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
              value={editAddressForm.state}
              onChange={(e) =>
                setEditAddressForm({ ...editAddressForm, state: e.target.value })
              }
            />
            <InputField
              label="Pincode"
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
              value={editAddressForm.pincode}
              onChange={(e) =>
                setEditAddressForm({ ...editAddressForm, pincode: e.target.value })
              }
            />
          </div>
          
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setShowEditAddressModal(false)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={saveEditedAddress}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

// Reusable Components
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-8">
        {children}
      </div>
    </div>
  </div>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-base font-semibold text-gray-900 ml-11">{value || "Not provided"}</p>
  </div>
);

const InputField = ({ label, icon, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-900"
      />
    </div>
  </div>
);

export default DonorProfile;