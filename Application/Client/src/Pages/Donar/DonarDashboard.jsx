import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, XCircle, AlertTriangle, Plus, Clock, Calendar, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import DonorNavbar from './DonorNavbar';
import { getAllListedMedicines, getExpiredMedicines, getAllUnListedMedicines } from '../../Services/MedicineServices';
function DonorDashboard() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    listed: 0,
    notListed: 0,
    expired: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const result = await window.storage.get('medicines');
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setMedicines(data);
        calculateStats(data);
      } else {
        const dummyMedicines = [
          {
            id: 1,
            medicineName: 'Paracetamol 500mg',
            expiryDate: '2025-12-31',
            numberOfUnits: '20',
            photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
            listed: true
          },
          {
            id: 2,
            medicineName: 'Ibuprofen 400mg',
            expiryDate: '2025-06-15',
            numberOfUnits: '15',
            photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
            listed: true
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
            id: 5,
            medicineName: 'Cetirizine 10mg',
            expiryDate: '2025-01-15',
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
            listed: true
          },
          {
            id: 7,
            medicineName: 'Aspirin 75mg',
            expiryDate: '2024-11-30',
            numberOfUnits: '8',
            photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
            listed: false
          },
          {
            id: 8,
            medicineName: 'Metformin 500mg',
            expiryDate: '2024-10-15',
            numberOfUnits: '12',
            photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
            listed: false
          }
        ];
        setMedicines(dummyMedicines);
        calculateStats(dummyMedicines);
        await window.storage.set('medicines', JSON.stringify(dummyMedicines));
      }
    } catch (error) {
      console.log('No medicines found or error loading:', error);
      const dummyMedicines = [
        {
          id: 1,
          medicineName: 'Paracetamol 500mg',
          expiryDate: '2025-12-31',
          numberOfUnits: '20',
          photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
          listed: true
        },
        {
          id: 2,
          medicineName: 'Ibuprofen 400mg',
          expiryDate: '2025-06-15',
          numberOfUnits: '15',
          photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
          listed: true
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
          expiryDate: '2025-01-15',
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
          listed: true
        },
        {
          id: 7,
          medicineName: 'Aspirin 75mg',
          expiryDate: '2024-11-30',
          numberOfUnits: '8',
          photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
          listed: false
        },
        {
          id: 8,
          medicineName: 'Metformin 500mg',
          expiryDate: '2024-10-15',
          numberOfUnits: '12',
          photoUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
          listed: false
        }
      ];
      setMedicines(dummyMedicines);
      calculateStats(dummyMedicines);
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isExpired = (expiryDate) => {
    return getDaysUntilExpiry(expiryDate) < 0;
  };

  const isExpiringSoon = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    return days >= 0 && days <= 30;
  };

  const calculateStats = (data) => {
    const total = data.length;
    const listed = data.filter(med => med.listed).length;
    const notListed = data.filter(med => !med.listed && !isExpired(med.expiryDate)).length;
    const expired = data.filter(med => isExpired(med.expiryDate)).length;
    const expiringSoon = data.filter(med => isExpiringSoon(med.expiryDate)).length;

    setStats({ total, listed, notListed, expired, expiringSoon });
  };

  const listedMedicines = medicines.filter(med => med.listed && !isExpired(med.expiryDate));
  const notListedMedicines = medicines.filter(med => !med.listed && !isExpired(med.expiryDate));
  const expiredMedicines = medicines.filter(med => isExpired(med.expiryDate));

  return (
    <div>
      <DonorNavbar/>
    <div className="mt-24">
      {/* Header Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
              <p className="text-gray-500">Welcome back! Here's your medicine donation overview</p>
            </div>
            <button
              onClick={() => navigate('/donor/add-medicine')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {/* Total Medicines */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-indigo-50 rounded-lg">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500 font-medium">Total Medicines</p>
            </div>
          </div>

          {/* Listed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stats.listed}</p>
              <p className="text-sm text-gray-500 font-medium">Listed for Donation</p>
            </div>
          </div>

          {/* Not Listed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stats.notListed}</p>
              <p className="text-sm text-gray-500 font-medium">Available to List</p>
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
              <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
            </div>
          </div>

          {/* Expired */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-red-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              <p className="text-sm text-gray-500 font-medium">Expired</p>
            </div>
          </div>
        </div>

        {/* Listed Medicines Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Listed Medicines</h2>
                <p className="text-sm text-gray-500">{listedMedicines.length} medicines available for donation</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/donor/view-medicine')}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {listedMedicines.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No medicines listed yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listedMedicines.slice(0, 4).map((medicine) => (
                <div key={medicine.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-all hover:shadow-sm">
                  <div className="h-36 overflow-hidden bg-gray-100 relative">
                    <img
                      src={medicine.photoUrl}
                      alt={medicine.medicineName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Medicine';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                        <Activity className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm truncate">{medicine.medicineName}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{medicine.numberOfUnits} units</span>
                      <span className="text-gray-400">{getDaysUntilExpiry(medicine.expiryDate)} days left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Not Listed Medicines Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Not Listed Yet</h2>
                <p className="text-sm text-gray-500">{notListedMedicines.length} medicines ready to be listed</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/donor/view-medicine')}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Manage
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {notListedMedicines.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                <CheckCircle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">All medicines are listed!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {notListedMedicines.slice(0, 4).map((medicine) => (
                <div key={medicine.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all hover:shadow-sm">
                  <div className="h-36 overflow-hidden bg-gray-100 relative">
                    <img
                      src={medicine.photoUrl}
                      alt={medicine.medicineName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Medicine';
                      }}
                    />
                    {isExpiringSoon(medicine.expiryDate) && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          Soon
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm truncate">{medicine.medicineName}</h3>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500">{medicine.numberOfUnits} units</span>
                      <span className="text-gray-400">{getDaysUntilExpiry(medicine.expiryDate)} days left</span>
                    </div>
                    <button
                      onClick={() => navigate('/donor/view-medicine')}
                      className="w-full bg-blue-50 text-blue-600 py-1.5 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      List Medicine
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expired Medicines Section */}
        {expiredMedicines.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Expired Medicines</h2>
                  <p className="text-sm text-gray-500">{expiredMedicines.length} medicines past expiry date</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {expiredMedicines.slice(0, 4).map((medicine) => (
                <div key={medicine.id} className="group border border-gray-200 rounded-lg overflow-hidden opacity-60">
                  <div className="h-36 overflow-hidden bg-gray-100 relative">
                    <img
                      src={medicine.photoUrl}
                      alt={medicine.medicineName}
                      className="w-full h-full object-cover grayscale"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Medicine';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Expired
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm truncate">{medicine.medicineName}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{medicine.numberOfUnits} units</span>
                      <span className="text-red-500">{medicine.expiryDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default DonorDashboard;