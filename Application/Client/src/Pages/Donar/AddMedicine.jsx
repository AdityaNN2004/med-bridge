import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Calendar, Package, Plus } from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import { toast } from "react-toastify";
import { addMedicine } from "../../Services/MedicineServices";
import { getEntityId } from "../../utils/jwtUtils";
function AddMedicine() {
  const navigate = useNavigate();

  // 🔹 Separate states
  const [medicineName, setMedicineName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [numberOfUnits, setNumberOfUnits] = useState("");
  const [photo , setPhoto]= useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const d_id =getEntityId();

  // 🔹 Validation
  const validate = () => {
    const newErrors = {};

    if (!medicineName.trim())
      newErrors.medicineName = "Medicine name is required";

    if (!expiryDate)
      newErrors.expiryDate = "Expiry date is required";

    if (!numberOfUnits || numberOfUnits <= 0)
      newErrors.numberOfUnits = "Enter valid units";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit handler
const handleSubmit = async () => {
  if (!validate()) return;

  if (!photo) {
    toast.error("Please upload a medicine image");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
     console.log(d_id)
    // JSON part
    formData.append(
      "medicine",
      new Blob(
        [
          JSON.stringify({
            medicineName,
            expiry_date: expiryDate,
            quantity: numberOfUnits,
            medicinecategory: "ANTIBIOTIC",
            d_id,
          })
        ],
        { type: "application/json" }
      )
    );

    // FILE part (name MUST match backend)
    formData.append("image", photo);
    console.log(formData);
    await addMedicine(formData ,d_id);

    toast.success("Medicine added successfully");
    navigate("/donor/view-medicine");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add medicine");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-150 font-poppins">
      <DonorNavbar />

      <div className="max-w-2xl mx-auto py-28 px-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-3">
              <Plus className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Add Medicine</h2>
            <p className="text-gray-500 text-sm mt-1">
              Help someone in need by donating your unused medicine
            </p>
          </div>

          <div className="space-y-4">
            {/* Medicine Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4" />
                Medicine Name
              </label>
              <input
                type="text"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl ${
                  errors.medicineName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.medicineName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.medicineName}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4" />
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl ${
                  errors.expiryDate ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expiryDate}
                </p>
              )}
            </div>

            {/* Number of Units */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4" />
                Number of Units
              </label>
              <input
                type="number"
                min="1"
                value={numberOfUnits}
                onChange={(e) => setNumberOfUnits(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl ${
                  errors.numberOfUnits ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.numberOfUnits && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfUnits}
                </p>
              )}
            </div>

            {/* Photo URL (optional – not sent) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
               <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}/>
              </label>
             <input
  type="file"
  accept="image/*"
  onChange={(e) => setPhoto(e.target.files[0])}
/>

            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              {loading ? "Adding..." : "Add Medicine"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;