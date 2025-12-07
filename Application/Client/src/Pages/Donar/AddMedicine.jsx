import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Calendar, Package, Plus } from 'lucide-react';
import DonorNavbar from './DonorNavbar';

function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: '',
    expiryDate: '',
    numberOfUnits: '',
    photoUrl: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Medicine name is required';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const today = new Date();
      const expiry = new Date(formData.expiryDate);
      if (expiry < today) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
      }
    }
    if (!formData.numberOfUnits || formData.numberOfUnits <= 0) {
      newErrors.numberOfUnits = 'Please enter a valid number of units';
    }
    if (!formData.photoUrl.trim()) {
      newErrors.photoUrl = 'Photo URL is required';
    } else if (!isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = 'Please enter a valid URL';
    }
    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        // Load existing medicines
        let medicines = [];
        try {
          const result = await window.storage.get('medicines');
          if (result && result.value) {
            medicines = JSON.parse(result.value);
          }
        } catch (error) {
          console.log('No existing medicines found');
        }

        // Add new medicine
        const newMedicine = {
          ...formData,
          id: Date.now()
        };
        medicines.push(newMedicine);

        // Save to storage
        await window.storage.set('medicines', JSON.stringify(medicines));

        // Navigate to view medicines page
        navigate('/donor/view-medicine');
      } catch (error) {
        console.error('Error saving medicine:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <DonorNavbar />
      <div className="">
      <div className="max-w-2xl my-24 mx-auto px-4 py-8 ">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Add Medicine</h2>
            <p className="text-gray-600 mt-2">Help someone in need by donating your unused medicine</p>
          </div>

          <div className="space-y-6">
            {/* Medicine Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4" />
                Medicine Name
              </label>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                placeholder="e.g., Paracetamol 500mg"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.medicineName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.medicineName && (
                <p className="text-red-500 text-sm mt-1">{errors.medicineName}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            {/* Number of Units */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.numberOfUnits ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.numberOfUnits && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfUnits}</p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Camera className="w-4 h-4" />
                Photo URL
              </label>
              <input
                type="text"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/medicine-photo.jpg"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                  errors.photoUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.photoUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.photoUrl}</p>
              )}
              {formData.photoUrl && !errors.photoUrl && (
                <div className="mt-3">
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Add Medicine
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
}

export default AddMedicine;