import React, { useState } from 'react';
import { Search, Package, MapPin, Calendar, User, X, CheckCircle, Clock, XCircle } from 'lucide-react';

const NGODashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample medicine data
  const medicines = [
    {
      id: 1,
      brandName: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      expiryDate: '2025-08-15',
      donor: 'City Hospital',
      donorContact: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      status: 'available',
      quantity: '500 tablets',
      batchNumber: 'BN20241234',
      manufacturer: 'Sun Pharma',
      requestDate: '2024-11-20',
      description: 'Pain reliever and fever reducer. Stored in controlled temperature conditions.'
    },
    {
      id: 2,
      brandName: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      expiryDate: '2025-12-30',
      donor: 'MedCare Pharmacy',
      donorContact: '+91 98765 43211',
      location: 'Pune, Maharashtra',
      status: 'pending',
      quantity: '200 capsules',
      batchNumber: 'BN20241567',
      manufacturer: 'Cipla',
      requestDate: '2024-11-25',
      description: 'Antibiotic for bacterial infections. Requires proper storage.'
    },
    {
      id: 3,
      brandName: 'Vitamin D3 60K',
      genericName: 'Cholecalciferol',
      expiryDate: '2026-03-10',
      donor: 'Health Plus Clinic',
      donorContact: '+91 98765 43212',
      location: 'Delhi, Delhi',
      status: 'available',
      quantity: '100 sachets',
      batchNumber: 'BN20241890',
      manufacturer: 'Mankind',
      requestDate: '2024-11-15',
      description: 'Vitamin D supplement for bone health. Easy to store.'
    },
    {
      id: 4,
      brandName: 'Metformin 500mg',
      genericName: 'Metformin HCl',
      expiryDate: '2025-06-22',
      donor: 'Apollo Pharmacy',
      donorContact: '+91 98765 43213',
      location: 'Bangalore, Karnataka',
      status: 'rejected',
      quantity: '300 tablets',
      batchNumber: 'BN20241123',
      manufacturer: 'Dr. Reddy\'s',
      requestDate: '2024-11-10',
      description: 'Diabetes medication. Temperature sensitive storage required.'
    },
    {
      id: 5,
      brandName: 'Cetirizine 10mg',
      genericName: 'Cetirizine HCl',
      expiryDate: '2025-09-18',
      donor: 'Community Health Center',
      donorContact: '+91 98765 43214',
      location: 'Chennai, Tamil Nadu',
      status: 'available',
      quantity: '400 tablets',
      batchNumber: 'BN20241456',
      manufacturer: 'Alkem',
      requestDate: '2024-11-22',
      description: 'Antihistamine for allergies. Stable at room temperature.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.donor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || med.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Medicine Donations</h1>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines, donors, or generic names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'available', 'pending', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl font-medium capitalize transition-all ${statusFilter === status
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
          {filteredMedicines.map(medicine => (
            <div
              key={medicine.id}
              onClick={() => setSelectedMedicine(medicine)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {medicine.brandName}
                    </h3>
                    <p className="text-sm text-gray-500">{medicine.genericName}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(medicine.status)}`}>
                    {getStatusIcon(medicine.status)}
                    {medicine.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Expires:</span>
                    <span className={isExpiringSoon(medicine.expiryDate) ? 'text-red-600 font-semibold' : ''}>
                      {new Date(medicine.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {isExpiringSoon(medicine.expiryDate) && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Soon</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Donor:</span>
                    <span className="truncate">{medicine.donor}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{medicine.location}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{medicine.quantity}</span>
                      <span className="text-xs text-blue-600 font-medium group-hover:underline">View Details →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMedicine.brandName}</h2>
                  <p className="text-blue-100">{selectedMedicine.genericName}</p>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-sm 
                 hover:bg-white/30 border border-white/20 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedMedicine.status)}`}>
                    {getStatusIcon(selectedMedicine.status)}
                    {selectedMedicine.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Quantity</p>
                  <p className="text-lg font-bold text-gray-900">{selectedMedicine.quantity}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                  <p className={`text-lg font-semibold ${isExpiringSoon(selectedMedicine.expiryDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(selectedMedicine.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  {isExpiringSoon(selectedMedicine.expiryDate) && (
                    <p className="text-sm text-red-600 mt-1">⚠️ Expiring within 90 days</p>
                  )}
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm text-gray-500 mb-1">Donor Information</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedMedicine.donor}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedMedicine.donorContact}</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedMedicine.location}</p>
                </div>

                <div className="border-l-4 border-amber-500 pl-4">
                  <p className="text-sm text-gray-500 mb-1">Request Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedMedicine.requestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Additional Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-700">Batch Number:</span> <span className="text-gray-600">{selectedMedicine.batchNumber}</span></p>
                  <p><span className="font-medium text-gray-700">Manufacturer:</span> <span className="text-gray-600">{selectedMedicine.manufacturer}</span></p>
                  <p><span className="font-medium text-gray-700">Description:</span> <span className="text-gray-600">{selectedMedicine.description}</span></p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  Accept Donation
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                  Contact Donor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;