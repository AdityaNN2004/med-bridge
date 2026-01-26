import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import DonorNavbar from "./DonorNavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import DonarChatbot from "../../Compoments/DonarChatbot";

import { getMedicineDetails } from "../../Services/MedicineServices";
import { getDonarAddress } from "../../Services/DonarServices";
import { getServiceAreaOfNgo } from "../../Services/NgoServices";

function ViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const donorId = 1; // 🔴 replace later
  const ngoId = 1;   // 🔴 replace later

  const [medicine, setMedicine] = useState(null);
  const [donor, setDonor] = useState(null);
  const [ngo, setNgo] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const medRes = await getMedicineDetails(id);
    setMedicine(medRes.data);

    const donorRes = await getDonarAddress(donorId);
    setDonor(donorRes.data);

    const ngoRes = await getServiceAreaOfNgo(ngoId);
    setNgo(ngoRes.data);
  };

  /* ADDRESS STRINGS */
  const donorFullAddress =
    donor &&
    `${donor.fullAddress}, ${donor.city}, ${donor.state} ${donor.pincode}`;

  const ngoFullAddress =
    ngo &&
    `${ngo.streetAddress}, ${ngo.city}, ${ngo.state} ${ngo.zipCode}`;

  return (
    <div className="bg-gray-100 min-h-screen">
      <DonorNavbar />

      <div className="pt-20 px-4 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-white shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-800">
            Donation Details
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MAP */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow h-[520px] overflow-hidden">
            {donorFullAddress && ngoFullAddress && (
              <RoutesMap
                originAddress={donorFullAddress}
                destinationAddress={ngoFullAddress}
              />
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow flex flex-col h-[520px] overflow-hidden">

            {/* NGO DETAILS (COMPACT) */}
            <div className="px-4 py-3 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                NGO Details
              </h3>
              {ngo ? (
                <p className="text-xs text-gray-600 leading-snug">
                  {ngoFullAddress}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Loading NGO details…</p>
              )}
            </div>

            {/* MEDICINE DETAILS (COMPACT) */}
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Medicine Details
              </h3>
              {medicine ? (
                <div className="text-xs text-gray-600 space-y-[2px]">
                  <p><b>Name:</b> {medicine.medicineName}</p>
                  <p><b>Category:</b> {medicine.medicinecategory}</p>
                  <p><b>Qty:</b> {medicine.quantity}</p>
                  <p><b>Expiry:</b> {medicine.expiry_date}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Loading medicine…</p>
              )}
            </div>

            {/* CHATBOT (≈65–70% HEIGHT) */}
            <div className="flex-1 overflow-hidden">
              <DonarChatbot
                ngoId={ngoId}
                donarId={donorId}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStatus;
