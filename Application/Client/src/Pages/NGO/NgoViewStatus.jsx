import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, User, Package, Calendar } from "lucide-react";
import NgoNavbar from "./NgoNavbar"; // if you have one
import DonorChatBot from "../../Compoments/DonarChatbot";

function NgoViewStatus() {
  const navigate = useNavigate();

  return (
    <div>
      <NgoNavbar />

      <div className="mt-24 max-w-7xl min-h-[calc(100vh-6rem)] mx-auto px-6 py-4">

        {/* Back */}
        <button
          className="flex items-center gap-2 text-indigo-600 font-medium mb-6 hover:underline"
          onClick={() => navigate("/ngo/requests")}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Medicine Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Paracetamol 500mg</h1>
              <p className="text-sm text-gray-500">
                20 units | Expires 2025-12-31
              </p>
            </div>
            <span className="px-4 py-1 rounded-full bg-green-500 text-white text-sm font-semibold">
              Accepted
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT — Donor + Chat */}
          <div className="space-y-6">

            {/* Donor Details */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-3">Donor Details</h3>
              <p className="flex items-center gap-2">
                <User size={16} /> Rahul Sharma
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> +91 91234 56789
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} /> Nagpur, Maharashtra
              </p>
            </div>

            {/* ✅ SAME CHATBOX (Redux Connected) */}
            <div>
              <DonorChatBot />
            </div>
          </div>

          {/* RIGHT — Map */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Live Tracking</h2>
            <div className="h-[340px] border rounded-xl overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScDLQeIDVShuT2tL3g-BkmQUdq0tId_aQP9g&s"
                alt="Map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NgoViewStatus;
