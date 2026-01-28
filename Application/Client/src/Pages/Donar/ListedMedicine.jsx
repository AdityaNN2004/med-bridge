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
        {error && <p className="text-red-500">{error}</p>}

        {!loading && medicines.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {medicines.map((med) => {
              const daysLeft = getDaysUntilExpiry(med.expiryDate);

              return (
                <div
                  key={med.id}
                  className="relative bg-white border rounded-xl shadow-sm hover:shadow-xl transition"
                >
                  <img
                    src={med.photoUrl || DEFAULT_MEDICINE_IMAGE}
                    alt={med.medicineName}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate">
                      {med.medicineName}
                    </h3>

                    <p className="text-xs text-gray-500 mb-3">
                      {med.quantity}
                    </p>

                    <span className="text-xs flex items-center gap-1 mb-3">
                      <Clock className="w-3 h-3" />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                    </span>

                    {/* ================= BUTTON LOGIC ================= */}
                    <div className="flex gap-2">
                      {med.donationInProgress && (
                        <button
                          onClick={() =>
                            navigate(`/donor/viewstatus/${med.id}`)
                          }
                          className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-semibold"
                        >
                          View Status
                        </button>
                      )}

                      {!med.donationInProgress && med.hasRequests && (
                        <button
                          onClick={() => openRequestPopup(med)}
                          className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-lg text-xs font-semibold"
                        >
                          NGO Request
                        </button>
                      )}

                      {!med.donationInProgress && (
                        <button
                          onClick={() => handleUnlist(med.id)}
                          disabled={unlistingId === med.id}
                          className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-semibold"
                        >
                          Unlist
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
