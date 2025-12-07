import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, Plus, Trash2, Clock, List, CheckCircle, X } from 'lucide-react';
import DonorNavbar from './DonorNavbar';

function ViewMedicine() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load medicines from storage on mount
  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const result = await window.storage.get('medicines');
      if (result && result.value) {
        setMedicines(JSON.parse(result.value));
      } else {
        // Set dummy data if no medicines exist
        const dummyMedicines = [
          {
            id: 1,
            medicineName: 'Paracetamol 500mg',
            expiryDate: '2025-12-31',
            numberOfUnits: '20',
            photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
            listed: false
          },
          {
            id: 2,
            medicineName: 'Ibuprofen 400mg',
            expiryDate: '2025-06-15',
            numberOfUnits: '15',
            photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
            listed: false
          },
          {
            id: 3,
            medicineName: 'Amoxicillin 250mg',
            expiryDate: '2026-03-20',
            numberOfUnits: '30',
            photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
            listed: false
          },
          {
            id: 4,
            medicineName: 'Vitamin D3 1000 IU',
            expiryDate: '2025-09-10',
            numberOfUnits: '60',
            photoUrl: 'https://images.unsplash.com/photo-1550572017-4892b2f88d5f?w=400&h=300&fit=crop',
            listed: false
          },
          {
            id: 5,
            medicineName: 'Cetirizine 10mg',
            expiryDate: '2025-01-25',
            numberOfUnits: '10',
            photoUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
            listed: false
          },
          {
            id: 6,
            medicineName: 'Omeprazole 20mg',
            expiryDate: '2026-08-18',
            numberOfUnits: '25',
            photoUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
            listed: false
          }
        ];
        setMedicines(dummyMedicines);
        await window.storage.set('medicines', JSON.stringify(dummyMedicines));
      }
    } catch (error) {
      console.log('No medicines found or error loading:', error);
      // Set dummy data on error as well
      const dummyMedicines = [
        {
          id: 1,
          medicineName: 'Paracetamol 500mg',
          expiryDate: '2025-12-31',
          numberOfUnits: '20',
          photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
          listed: false
        },
        {
          id: 2,
          medicineName: 'Ibuprofen 400mg',
          expiryDate: '2025-06-15',
          numberOfUnits: '15',
          photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
          listed: false
        },
        {
          id: 3,
          medicineName: 'Amoxicillin 250mg',
          expiryDate: '2026-03-20',
          numberOfUnits: '30',
          photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
          listed: false
        },
        {
          id: 4,
          medicineName: 'Vitamin D3 1000 IU',
          expiryDate: '2025-09-10',
          numberOfUnits: '60',
          photoUrl: 'https://images.unsplash.com/photo-1550572017-4892b2f88d5f?w=400&h=300&fit=crop',
          listed: false
        },
        {
          id: 5,
          medicineName: 'Cetirizine 10mg',
          expiryDate: '2025-01-25',
          numberOfUnits: '10',
          photoUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop',
          listed: false
        },
        {
          id: 6,
          medicineName: 'Omeprazole 20mg',
          expiryDate: '2026-08-18',
          numberOfUnits: '25',
          photoUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
          listed: false
        }
      ];
      setMedicines(dummyMedicines);
    }
  };

  const deleteMedicine = async (id) => {
    const newMedicines = medicines.filter(med => med.id !== id);
    setMedicines(newMedicines);
    try {
      await window.storage.set('medicines', JSON.stringify(newMedicines));
    } catch (error) {
      console.error('Error saving medicines:', error);
    }
  };

  const handleListClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowConfirm(true);
  };

  const confirmListMedicine = async () => {
    if (selectedMedicine) {
      const updatedMedicines = medicines.map(med => 
        med.id === selectedMedicine.id ? { ...med, listed: true } : med
      );
      setMedicines(updatedMedicines);
      
      try {
        await window.storage.set('medicines', JSON.stringify(updatedMedicines));
      } catch (error) {
        console.error('Error saving medicines:', error);
      }

      setShowConfirm(false);
      setSelectedMedicine(null);
      
      // Show toast
      setToast({ show: true, message: 'Medicine listed successfully!' });
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 3000);
    }
  };

  const cancelListMedicine = () => {
    setShowConfirm(false);
    setSelectedMedicine(null);
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { text: 'Expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (days <= 30) return { text: `${days} days left`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: `${days} days left`, color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const handleAddMedicine = () => {
    navigate('/donor/add-medicine');
  };

  return (
    <div>
      <DonorNavbar />
    <div className="mt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Medicines</h2>
            <p className="text-gray-600 mt-1">{medicines.length} medicine(s) available for donation</p>
          </div>
          <button
            onClick={handleAddMedicine}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </div>

        {medicines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No medicines added yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first medicine to help someone in need</p>
            <button
              onClick={handleAddMedicine}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((medicine) => {
              const expiryStatus = getExpiryStatus(medicine.expiryDate);
              return (
                <div
                  key={medicine.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="h-48 overflow-hidden bg-gray-200 relative">
                    <img
                      src={medicine.photoUrl}
                      alt={medicine.medicineName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Medicine';
                      }}
                    />
                    {medicine.listed && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Listed
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{medicine.medicineName}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Expires: {medicine.expiryDate}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${expiryStatus.color}`}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{expiryStatus.text}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span className="text-sm">{medicine.numberOfUnits} units available</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleListClick(medicine)}
                        disabled={medicine.listed}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                          medicine.listed
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <List className="w-4 h-4" />
                        {medicine.listed ? 'Listed' : 'List'}
                      </button>
                      <button
                        onClick={() => deleteMedicine(medicine.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <List className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">List Medicine?</h3>
              <p className="text-gray-600">
                Are you sure you want to list <span className="font-semibold">{selectedMedicine?.medicineName}</span> for donation?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelListMedicine}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmListMedicine}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Yes, List It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className="bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 min-w-[300px]">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-800 font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => setToast({ show: false, message: '' })}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
   </div>
  );
}

export default ViewMedicine;