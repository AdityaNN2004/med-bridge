import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Calendar, Package, Plus } from "lucide-react";
import DonorNavbar from "./DonorNavbar";
import { toast } from "react-toastify";
import { addMedicine } from "../../Services/MedicineServices";
import { getEntityId } from "../../utils/jwtUtils";

function AddMedicine() {
  const navigate = useNavigate();
  const d_id = getEntityId();

  const [medicineName, setMedicineName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [numberOfUnits, setNumberOfUnits] = useState("");
  const [category, setCategory] = useState("ANTIBIOTIC");
  const [photo, setPhoto] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!medicineName.trim())
      newErrors.medicineName = "Medicine name required";

    if (!expiryDate)
      newErrors.expiryDate = "Expiry date required";

    if (!numberOfUnits || numberOfUnits <= 0)
      newErrors.numberOfUnits = "Enter valid units";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    if (!photo) {
      toast.error("Please upload medicine image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "medicine",
        new Blob(
          [
            JSON.stringify({
              medicineName,
              expiry_date: expiryDate,
              quantity: numberOfUnits,
              medicinecategory: category,
              d_id,
            }),
          ],
          { type: "application/json" }
        )
      );

      formData.append("image", photo);

      await addMedicine(formData, d_id);

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

            <h2 className="text-2xl font-bold text-gray-900">
              Add Medicine
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Help someone by donating unused medicine
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
                onChange={(e) =>
                  setMedicineName(e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-xl ${
                  errors.medicineName
                    ? "border-red-500"
                    : "border-gray-200"
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
                onChange={(e) =>
                  setExpiryDate(e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-xl ${
                  errors.expiryDate
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />

              {errors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expiryDate}
                </p>
              )}
            </div>

            {/* Units + Category */}
            <div className="flex gap-3">
              {/* Units */}
              <div className="w-1/2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Package className="w-4 h-4" />
                  Units
                </label>

                <input
                  type="number"
                  min="1"
                  value={numberOfUnits}
                  onChange={(e) =>
                    setNumberOfUnits(e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-xl ${
                    errors.numberOfUnits
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                />

                {errors.numberOfUnits && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.numberOfUnits}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                >
                  <option value="ANTACID">Antacid</option>
                  <option value="ANTIALLERGIC">
                    Anti Allergic
                  </option>
                  <option value="ANTIBIOTIC">
                    Antibiotic
                  </option>
                  <option value="ANTIDIABETIC">
                    Anti Diabetic
                  </option>
                  <option value="ANTIFUNGAL">
                    Anti Fungal
                  </option>
                  <option value="ANTIINFLAMMATORY">
                    Anti Inflammatory
                  </option>
                  <option value="ANTIVIRAL">
                    Anti Viral
                  </option>
                  <option value="CARDIAC">Cardiac</option>
                  <option value="HORMONAL">
                    Hormonal
                  </option>
                  <option value="PAINKILLER">
                    Painkiller
                  </option>
                  <option value="VITAMIN_SUPPLEMENT">
                    Vitamin Supplement
                  </option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Camera className="w-4 h-4" />
                Upload Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhoto(e.target.files[0])
                }
                className="w-full"
              />
            </div>

            {/* Submit */}
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
