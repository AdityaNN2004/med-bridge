import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Truck,
  MapPin,
  MessageCircle,
} from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import DonorChatBot from "../../Compoments/DonarChatbot";
import { getMedicineDetails } from "../../Services/MedicineServices";
import { getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar } from "../../Services/DonarServices";

function ViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [status, setStatus] = useState("IN_TRANSIT");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const medRes = await getMedicineDetails(id);
    setMedicine(medRes.data);

    const ngoRes =
      await getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar(id);
    setNgo(ngoRes.data);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DonorNavbar />

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

            {/* Floating status */}
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
                Last updated 4 minutes ago
              </p>
            </div>

            {/* NGO + MEDICINE INFO */}
            <div className="p-5 border-b space-y-2">
              <h3 className="font-semibold text-gray-800">Delivery Details</h3>
              {ngo && (
                <p className="text-sm text-gray-600">
                  NGO: <span className="font-medium">{ngo.organizationName}</span>
                </p>
              )}
              {medicine && (
                <p className="text-sm text-gray-600">
                  Medicine:{" "}
                  <span className="font-medium">{medicine.medicineName}</span>
                </p>
              )}
            </div>

            {/* LIVE UPDATES / CHAT */}
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
        active ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {icon}
    </div>
    <p
      className={`text-xs mt-2 ${
        active ? "text-gray-800 font-medium" : "text-gray-400"
      }`}
    >
      {label}
    </p>
  </div>
);

const Line = () => (
  <div className="flex-1 h-[2px] bg-gray-300 mx-1"></div>
);

export default ViewStatus;
