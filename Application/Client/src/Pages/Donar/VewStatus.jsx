import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Truck, MapPin, MessageCircle } from "lucide-react";

import DonorNavbar from "./DonorNavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import DonorChatBot from "../../Compoments/DonarChatbot";

import { getMedicineDetails } from "../../Services/MedicineServices";
import { getDonarAddress } from "../../Services/DonarServices";
import { getServiceAreaOfNgo } from "../../Services/NgoServices";

function ViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const donorId = 1;

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

    const ngoRes = await getServiceAreaOfNgo(1);
    setNgo(ngoRes.data);
  };

  // ✅ API COORDINATES (NO STRING ADDRESSES)
  const donorCoords =
    donor?.latitude && donor?.longitude
      ? { lat: Number(donor.latitude), lng: Number(donor.longitude) }
      : null;

  const ngoCoords =
    ngo?.latitude && ngo?.longitude
      ? { lat: Number(ngo.latitude), lng: Number(ngo.longitude) }
      : null;

  return (
    <div className="bg-gray-100 min-h-screen">
      <DonorNavbar />

      <div className="pt-20 px-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-xl font-bold">Tracking ID: MED-{id}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* MAP */}
          <div className="lg:col-span-8 bg-white rounded-xl shadow h-[500px]">
            {donorCoords && ngoCoords && (
              <RoutesMap
                origin={donorCoords}
                destination={ngoCoords}
              />
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow flex flex-col">
            <div className="p-5 border-b">
              <div className="flex justify-between items-center">
                <Step active label="Order Placed" icon={<Check />} />
                <Line />
                <Step active label="In Transit" icon={<Truck />} />
                <Line />
                <Step label="Delivered" icon={<MapPin />} />
              </div>
            </div>

            <div className="p-5 border-b">
              <h3 className="font-semibold">Delivery Details</h3>

              {medicine && (
                <p className="text-sm text-gray-600">
                  Medicine: <b>{medicine.medicineName}</b>
                </p>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <DonorChatBot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Step = ({ active, label, icon }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${
        active ? "bg-teal-500 text-white" : "bg-gray-300"
      }`}
    >
      {icon}
    </div>
    <p className="text-xs mt-2">{label}</p>
  </div>
);

const Line = () => <div className="flex-1 h-[2px] bg-gray-300 mx-1" />;

export default ViewStatus;
