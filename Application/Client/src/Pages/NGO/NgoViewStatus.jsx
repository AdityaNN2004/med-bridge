import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Truck,
  MapPin,
  MessageCircle,
  User,
  Phone,
} from "lucide-react";

import NgoNavbar from "./NgoNavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import DonorChatBot from "../../Compoments/DonarChatbot";

import { getMedicineDetails } from "../../Services/MedicineServices";
import { getDonorWithAddressByNgoAndMedicineNative } from "../../Services/NgoServices";

function NgoViewStatus() {
  const { id } = useParams(); // medicine id
  const navigate = useNavigate();

  // 🔴 Replace later with logged-in NGO ID
  const ngoId = 1;

  const [medicine, setMedicine] = useState(null);
  const [donor, setDonor] = useState(null);
  const [status, setStatus] = useState("IN_TRANSIT");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [id]);

  const loadData = async () => {
    try {
      const medRes = await getMedicineDetails(id);
      setMedicine(medRes.data);

      const donorRes =
        await getDonorWithAddressByNgoAndMedicineNative(ngoId, id);
      setDonor(donorRes.data);
    } catch (err) {
      console.error("Failed to load NGO view status data", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NgoNavbar />

      <div className="pt-20 px-4 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <ArrowLeft />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              Tracking ID: MED-{id}
            </h2>
          </div>

          <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            In Transit
          </span>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* MAP SECTION */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow overflow-hidden relative">
            <RoutesMap />

            {/* Floating Status */}
            <div className="absolute top-4 left-4 bg-white shadow px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">In Transit</span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow flex flex-col">
            {/* STEPPER */}
            <div className="p-5 border-b">
              <div className="flex items-center justify-between">
                <Step active label="Order Placed" icon={<Check />} />
                <Line />
                <Step active label="In Transit" icon={<Truck />} />
                <Line />
                <Step label="Delivered" icon={<MapPin />} />
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Last updated a few minutes ago
              </p>
            </div>

            {/* DONOR + MEDICINE INFO */}
            <div className="p-5 border-b space-y-2">
              <h3 className="font-semibold text-gray-800">
                Pickup Details
              </h3>

              {donor && (
                <>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User size={14} />
                    <span className="font-medium">
                      {donor.firstName} {donor.lastName}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone size={14} />
                    +91 XXXXXXXXXX
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin size={14} />
                    {donor.fullAddress}, {donor.city},{" "}
                    {donor.state} - {donor.pincode}
                  </p>
                </>
              )}

              {medicine && (
                <p className="text-sm text-gray-600">
                  Medicine:{" "}
                  <span className="font-medium">
                    {medicine.medicineName}
                  </span>
                </p>
              )}
            </div>

            {/* LIVE CHAT */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b flex items-center gap-2">
                <MessageCircle size={18} className="text-indigo-600" />
                <h3 className="font-semibold text-indigo-600">
                  Live Updates
                </h3>
              </div>

              <div className="flex-1 overflow-hidden">
                <DonorChatBot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Step = ({ active, label, icon }) => (
  <div className="flex flex-col items-center text-center">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        active
          ? "bg-teal-500 text-white"
          : "bg-gray-200 text-gray-500"
      }`}
    >
      {icon}
    </div>
    <p
      className={`text-xs mt-2 ${
        active
          ? "text-gray-800 font-medium"
          : "text-gray-400"
      }`}
    >
      {label}
    </p>
  </div>
);

const Line = () => (
  <div className="flex-1 h-[2px] bg-gray-300 mx-1"></div>
);

export default NgoViewStatus;
