import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Calendar, Package, Plus } from "lucide-react";
import DonorNavbar from "./DonorNavbar";

function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: "",
    expiryDate: "",
    numberOfUnits: "",
    photoUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [medicines, setMedicines] = useState([]); // Initialize empty

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.medicineName.trim()) newErrors.medicineName = "Medicine name is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry < today) newErrors.expiryDate = "Expiry date cannot be in the past";
    }
    if (!formData.numberOfUnits || formData.numberOfUnits <= 0)
      newErrors.numberOfUnits = "Please enter a valid number of units";
    if (!formData.photoUrl.trim()) newErrors.photoUrl = "Photo URL is required";
    else if (!isValidUrl(formData.photoUrl)) newErrors.photoUrl = "Please enter a valid URL";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      const newMedicine = {
        ...formData,
        id: Date.now(),
        donor: "You",
        location: "Your Location",
        status: "available",
        manufacturer: "Unknown",
        description: "No description",
      };

      const updatedMedicines = [newMedicine, ...medicines];
      setMedicines(updatedMedicines);

      // Save to storage for ViewMedicine page
      try {
        await window.storage.set("medicines", JSON.stringify(updatedMedicines));
      } catch (error) {
        console.error("Error saving medicines:", error);
      }

      navigate("/donor/view-medicine");
    } else {
      setErrors(newErrors);
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
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4" />
                Medicine Name
              </label>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                placeholder="e.g., Paracetamol 500mg"
                className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm ${
                  errors.medicineName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.medicineName && <p className="text-red-500 text-xs mt-1">{errors.medicineName}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4" />
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm ${
                  errors.expiryDate ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4" />
                Number of Units
              </label>
              <input
                type="number"
                name="numberOfUnits"
                value={formData.numberOfUnits}
                onChange={handleChange}
                placeholder="e.g., 10"
                min="1"
                className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm ${
                  errors.numberOfUnits ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.numberOfUnits && <p className="text-red-500 text-xs mt-1">{errors.numberOfUnits}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Camera className="w-4 h-4" />
                Photo URL
              </label>
              <input
                type="text"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/medicine-photo.jpg"
                className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm ${
                  errors.photoUrl ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.photoUrl && <p className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>}
              {formData.photoUrl && !errors.photoUrl && (
                <div className="mt-2">
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl shadow-sm"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              Add Medicine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;


// import java.io.*;
// import java.net.HttpURLConnection;
// import java.net.URL;

// public class OCRExample {
//     public static void main(String[] args) {
//         try {
//             String apiKey = "API key";
//             String url = "https://api.ocr.space/parse/image";

//             URL obj = new URL(url);
//             HttpURLConnection conn = (HttpURLConnection) obj.openConnection();

//             conn.setRequestMethod("POST");
//             conn.setRequestProperty("apikey", apiKey);
//             conn.setDoOutput(true);

//             String data = "url=https://ocr.space/Content/Images/receipt-ocr-original.jpg";

//             conn.getOutputStream().write(data.getBytes("UTF-8"));

//             BufferedReader in = new BufferedReader(
//                     new InputStreamReader(conn.getInputStream())
//             );
//             String inputLine;
//             StringBuffer response = new StringBuffer();

//             while ((inputLine = in.readLine()) != null) {
//                 response.append(inputLine);
//             }
//             in.close();

//             System.out.println("OCR Output:");
//             System.out.println(response.toString());

//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//     }
// }