import React, { useEffect, useState } from "react";
import {
  markRequestAsCompleted,
  markRequestAsDiscarded,
} from "../../Services/DonarServices"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import DonorNavbar from "./DonorNavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import DonarChatbot from "../../Compoments/DonarChatbot";

import { getMedicineDetails } from "../../Services/MedicineServices";
import {
  getDonarAddress,
  getDonationDtoByMedicineId,getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar
} from "../../Services/DonarServices";

function ViewStatus() {
  const { id } = useParams(); // medicineId
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [donor, setDonor] = useState(null);
  const [ngo, setNgo] = useState(null);
  const [donationInfo, setDonationInfo] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCompleted = async () => {
    try {
      await markRequestAsCompleted(id);
       toast.success("Donation Completed");
      navigate(-1); // go back after success (optional)
    } catch (err) {
      console.error(err);
       toast.error("Donation Failed");
    }
  };

  const handleDiscarded = async () => {
    try {
      await markRequestAsDiscarded(id);
      toast.success("Request Discarded");
      navigate(-1); // go back after success (optional)
    } catch (err) {
      console.error(err);
       toast.error("failed to Discard Request");
    }
  };


  const loadData = async () => {
    try {
      // 1️⃣ Get donation DTO (donorId + ngoId)
      const dto = await getDonationDtoByMedicineId(id);
      setDonationInfo(dto);

      // 2️⃣ Medicine details
      const medRes = await getMedicineDetails(id);
      setMedicine(medRes.data);

      // 3️⃣ Donor address
      const donorRes = await getDonarAddress(dto.donar_id);
      setDonor(donorRes.data);

      // 4️⃣ NGO address
      const ngoRes = await getNgoDetailsForARequestedMedicineByMedicineIdApprovedByDonar(id);
      setNgo(ngoRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
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

            {/* NGO DETAILS */}
             <div className="px-4 py-3 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                NGO Details
              </h3>

              {ngo ? (
                <>
                  <p className="text-xs text-gray-600 leading-snug mb-3">
                    {ngoFullAddress}
                  </p> 

            {/* ACTION BUTTONS */}
             <div className="flex gap-2">
                    <button onClick={handleCompleted}
                      className="flex items-center justify-center gap-1 flex-1
                     bg-green-600 hover:bg-green-700 text-white
                     text-xs font-medium py-2 rounded-lg transition"
                    >
                      <CheckCircle size={14} />
                      Completed
                    </button>

                    <button onClick={handleDiscarded}
                      className="flex items-center justify-center gap-1 flex-1
                     bg-red-600 hover:bg-red-700 text-white
                     text-xs font-medium py-2 rounded-lg transition"
                    >
                      <XCircle size={14} />
                      Discard
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-gray-400">Loading NGO details…</p>
              )}
            </div> 

            {/* MEDICINE DETAILS */}
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

            {/* CHATBOT */}
            <div className="flex-1 overflow-hidden">
              {donationInfo && (
                <DonarChatbot
                  ngoId={donationInfo.ngo_id}
                  donarId={donationInfo.donar_id}
                />
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStatus;
