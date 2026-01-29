import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import { getEntityId,isTokenExpired } from "../../utils/jwtUtils";
import { ToastContainer, toast } from "react-toastify";
import {
  getAllListedMedicines,
  ChangeListingStatusNotListed,
  getRequestedNgosForMedicine,
  isMedicineDonationInProgress
} from "../../Services/MedicineServices";
import { RejectNgo, ApproveNgo } from "../../Services/DonarServices";

const DEFAULT_MEDICINE_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop";

function ListedMedicine() {
  const navigate = useNavigate();
  const donar_id = getEntityId();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unlistingId, setUnlistingId] = useState(null);

  // popup state
  const [activeMedicine, setActiveMedicine] = useState(null);
  const [requestedNgos, setRequestedNgos] = useState([]);

  useEffect(() => {
    fetchListedMedicines();
  }, []);

  /* ================= FETCH LISTED MEDICINES ================= */
  const fetchListedMedicines = async () => {
    try {
      const response = await getAllListedMedicines(donar_id);

      // Check if response data exists and is an array
      if (!response.data || !Array.isArray(response.data)) {
        setMedicines([]);
        setLoading(false);
        return;
      }

      const updated = await Promise.all(
        response.data.map(async (med) => {
          try {
            const [ngoRes, processRes] = await Promise.all([
              getRequestedNgosForMedicine(med.id),
              isMedicineDonationInProgress(med.id)
            ]);

            return {
              ...med,
              expiryDate: med.expiry_date,
              hasRequests: ngoRes.data && ngoRes.data.length > 0,
              donationInProgress: Number(processRes.data) === 1
            };
          } catch {
            return {
              ...med,
              expiryDate: med.expiry_date,
              hasRequests: false,
              donationInProgress: false
            };
          }
        })
      );

      setMedicines(updated);
    } catch (err) {
      console.error(err);
      // Only set error if it's an actual error, not just empty data
      setError("Failed to load listed medicines");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXPIRY CALC ================= */
  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return 0;
    const expiry = new Date(expiryDate);
    const today = new Date();
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  /* ================= UNLIST ================= */
  const handleUnlist = async (medicineId) => {
    try {
      setUnlistingId(medicineId);
      await ChangeListingStatusNotListed(medicineId);
      setMedicines((prev) => prev.filter((m) => m.id !== medicineId));
       toast.success("medicine unlisted");
    } catch (err) {
      console.error(err);
     toast.error("Failed to unlist medicine");

    } finally {
      setUnlistingId(null);
    }
  };

  /* ================= OPEN NGO REQUEST POPUP ================= */
  const openRequestPopup = async (medicine) => {
    const res = await getRequestedNgosForMedicine(medicine.id);
    setRequestedNgos(res.data || []);
    setActiveMedicine(medicine);
  };

  /* ================= APPROVE NGO ================= */
  const handleApproveNgo = async (ngoId) => {
    try {
      await ApproveNgo(activeMedicine.id, ngoId);
       toast.success("NGO Approved");
      setActiveMedicine(null);
      fetchListedMedicines();
    } catch (err) {
      console.error(err);
       toast.success("Failed to approve NGO");
    }
  };

  /* ================= REJECT NGO ================= */
  const handleRejectNgo = async (ngoId) => {
    try {
      await RejectNgo(activeMedicine.id, ngoId);
       toast.success("NGO Rejected");
      setRequestedNgos((prev) => prev.filter((n) => n.ngo_id !== ngoId));
    } catch (err) {
      console.error(err);
    toast.error("Fail to Rejected");
    }
  };

  return (
    <div>
      <DonorNavbar />

      <div className="mt-24 max-w-7xl mx-auto px-6 pb-10">
        <button
          className="flex items-center gap-2 text-indigo-600 mb-6 font-medium hover:underline"
          onClick={() => navigate("/donor/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8">Listed Medicines</h1>

        {loading && <p>Loading medicines...</p>}
        {error && medicines.length === 0 && !loading && (
          <p className="text-red-500">{error}</p>
        )}

        {/* ================= EMPTY STATE ================= */}
        {!loading && !error && medicines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-indigo-50 rounded-full p-6 mb-6">
              <svg
                className="w-24 h-24 text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Medicines Listed Yet
            </h2>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              You haven't listed any medicines for donation. Start making a difference by listing your unused medicines to help those in need.
            </p>
            <button
              onClick={() => navigate("/donor/add-medicine")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              List Your First Medicine
            </button>
          </div>
        )}

        {!loading && medicines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {medicines.map((med) => {
              const daysLeft = getDaysUntilExpiry(med.expiryDate);

              return (
                <div
                  key={med.id}
                  className="relative bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                    <img
                      src={med.medicineImageUrl || DEFAULT_MEDICINE_IMAGE}
                      alt={med.medicineName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Status Badge */}
                    {med.donationInProgress && (
                      <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        In Progress
                      </div>
                    )}
                    {!med.donationInProgress && med.hasRequests && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Requests
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-base text-gray-800 mb-2 truncate">
                      {med.medicineName}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600 font-medium">
                        Qty: {med.quantity}
                      </p>
                      
                      <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        daysLeft > 30 
                          ? 'bg-green-50 text-green-700' 
                          : daysLeft > 7 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {daysLeft > 0 ? `${daysLeft}d` : "Expired"}
                      </div>
                    </div>

                    {/* ================= BUTTON LOGIC ================= */}
                    <div className="flex gap-2">
                      {med.donationInProgress && (
                        <button
                          onClick={() =>
                            navigate(`/donor/viewstatus/${med.id}`)
                          }
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                        >
                          View Status
                        </button>
                      )}

                      {!med.donationInProgress && med.hasRequests && (
                        <button
                          onClick={() => openRequestPopup(med)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                        >
                          View Requests
                        </button>
                      )}

                      {!med.donationInProgress && (
                        <button
                          onClick={() => handleUnlist(med.id)}
                          disabled={unlistingId === med.id}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {unlistingId === med.id ? "Unlisting..." : "Unlist"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= NGO REQUEST POPUP ================= */}
      {activeMedicine && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">
              NGO Requests for {activeMedicine.medicineName}
            </h2>

            {requestedNgos.length === 0 && (
              <p className="text-sm text-gray-500">No pending NGO requests</p>
            )}

            {requestedNgos.map((ngo) => (
              <div
                key={ngo.ngo_id}
                className="flex justify-between items-center border p-3 rounded-lg mb-2"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {ngo.organizationName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Service Radius: {ngo.serviceRadius} km
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveNgo(ngo.ngo_id)}
                    className="text-green-600 hover:scale-110"
                  >
                    <CheckCircle />
                  </button>
                  <button
                    onClick={() => handleRejectNgo(ngo.ngo_id)}
                    className="text-red-600 hover:scale-110"
                  >
                    <XCircle />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setActiveMedicine(null)}
              className="mt-4 w-full bg-gray-100 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListedMedicine;