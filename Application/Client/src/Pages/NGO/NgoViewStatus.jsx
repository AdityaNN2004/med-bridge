import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import NgoNavbar from "./NGONavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import NGOChatbot from "../../Compoments/NGOChatbot";
import { getEntityId } from "../../utils/jwtUtils";
import { ToastContainer, toast } from "react-toastify";

import {
  getDonorWithAddressByNgoAndMedicineNative,
  getServiceAreaOfNgo,getMedicineDetails
} from "../../Services/NgoServices";

function NgoViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ngoId = getEntityId(); // 🔴 replace later

  const [medicine, setMedicine] = useState(null);
  const [donor, setDonor] = useState(null);
  const [ngoAddress, setNgoAddress] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const medRes = await getMedicineDetails(id);
      setMedicine(medRes.data);

      const donorRes = await getDonorWithAddressByNgoAndMedicineNative(
        ngoId,
        id
      );
      setDonor(donorRes.data);

      const ngoAddrRes = await getServiceAreaOfNgo(ngoId);
      setNgoAddress(ngoAddrRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const donorFullAddress =
    donor &&
    `${donor.fullAddress}, ${donor.city}, ${donor.state} ${donor.pincode}`;

  const ngoFullAddress =
    ngoAddress &&
    `${ngoAddress.streetAddress}, ${ngoAddress.city}, ${ngoAddress.state} ${ngoAddress.zipCode}`;

  return (
    <div className="bg-gray-100 min-h-screen">
      <NgoNavbar />

      <div className="pt-20 px-4 max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-800">
            Donation Details
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* MAP */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow h-[520px] overflow-hidden">
            {donorFullAddress && ngoFullAddress && (
              <RoutesMap
                originAddress={donorFullAddress}
                destinationAddress={ngoFullAddress}
              />
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow flex flex-col h-[520px] overflow-hidden">

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
                <p className="text-xs text-gray-400">
                  Loading medicine details…
                </p>
              )}
            </div>

            {/* DONOR INFO (COMPACT) */}
            <div className="px-4 py-3 border-b bg-gray-50">
              {donor && (
                <>
                  <p className="text-sm font-medium text-gray-800">
                    Donor: {donor.firstName} {donor.lastName}
                  </p>
                  <p className="text-xs text-gray-600 leading-snug mt-1">
                    {donorFullAddress}
                  </p>
                </>
              )}
            </div>

            {/* CHATBOT (~65% HEIGHT) */}
            <div className="flex-1 overflow-hidden p-2">
              {donor && (
                <NGOChatbot
                  ngoId={ngoId}
                  donarId={donor.donarId}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default NgoViewStatus;
