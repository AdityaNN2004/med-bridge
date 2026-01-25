import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Truck, MapPin, MessageCircle } from "lucide-react";

import NgoNavbar from "./NgoNavbar";
import RoutesMap from "../../Compoments/RoutesMap";
import DonorChatBot from "../../Compoments/DonarChatbot";

import { getMedicineDetails } from "../../Services/MedicineServices";
import { getDonorWithAddressByNgoAndMedicineNative } from "../../Services/NgoServices";
import { getServiceAreaOfNgo } from "../../Services/NgoServices";

function NgoViewStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ngoId = 1;

  const [medicine, setMedicine] = useState(null);
  const [donor, setDonor] = useState(null);
  const [ngoAddress, setNgoAddress] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const medRes = await getMedicineDetails(id);
    setMedicine(medRes.data);

    const donorRes = await getDonorWithAddressByNgoAndMedicineNative(ngoId, id);
    setDonor(donorRes.data);

    const ngoAddrRes = await getServiceAreaOfNgo(ngoId);
    setNgoAddress(ngoAddrRes.data);
  };

  const donorFullAddress =
    donor &&
    `${donor.fullAddress}, ${donor.city}, ${donor.state} ${donor.pincode}`;
      console.log(donorFullAddress)
  const ngoFullAddress =
    ngoAddress &&
    `${ngoAddress.streetAddress}, ${ngoAddress.city}, ${ngoAddress.state} ${ngoAddress.zipCode}`;
 console.log(ngoFullAddress)
  return (
    <div className="bg-gray-100 min-h-screen">
      <NgoNavbar />

      <div className="pt-20 px-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200">
            <ArrowLeft />
          </button>
          <h2 className="text-xl font-bold">Tracking ID: MED-{id}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white rounded-xl shadow h-[500px]">
            {donorFullAddress && ngoFullAddress && (
              <RoutesMap
                originAddress={donorFullAddress}
                destinationAddress={ngoFullAddress}
              />
            )}
          </div>

          <div className="lg:col-span-4 bg-white rounded-xl shadow flex flex-col">
            <div className="p-5 border-b">
              <div className="flex justify-between">
                <Step active label="Order Placed" icon={<Check />} />
                <Line />
                <Step active label="In Transit" icon={<Truck />} />
                <Line />
                <Step label="Delivered" icon={<MapPin />} />
              </div>
            </div>

            <div className="p-5 border-b">
              {donor && (
                <>
                  <p className="text-sm"><b>Donor:</b> {donor.firstName} {donor.lastName}</p>
                  <p className="text-sm">{donorFullAddress}</p>
                </>
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

const Step = ({ active, label, icon }) => (
  <div className="flex flex-col items-center">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
      active ? "bg-teal-500 text-white" : "bg-gray-300"
    }`}>
      {icon}
    </div>
    <p className="text-xs mt-2">{label}</p>
  </div>
);

const Line = () => <div className="flex-1 h-[2px] bg-gray-300 mx-1" />;

export default NgoViewStatus;