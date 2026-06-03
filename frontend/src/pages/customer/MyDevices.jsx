// src/pages/customer/MyDevices.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function MyDevices() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('customerToken');
        if (!token) {
          setError('Please log in to view your devices');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          'http://localhost:8000/api/submissions/my/',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSubmissions(response.data);
      } catch (err) {
        setError('Failed to load your devices. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `http://localhost:8000${imagePath}`;
    if (imagePath.startsWith('media/')) return `http://localhost:8000/${imagePath}`;
    return `http://localhost:8000/media/${imagePath}`;
  };

  return (
    <>
      <CustomerNavbar />

      <div className="min-h-screen bg-gray-50 py-6 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Devices</h1>

          {loading && (
            <div className="text-center py-12">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
              <p className="text-gray-600 text-lg mt-4">Loading your submissions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl mb-8">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {submissions.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
                  <p className="text-xl text-gray-600 mb-6">
                    You haven't submitted any devices yet.
                  </p>
                  <Link
                    to="/customer-submit-device"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                  >
                    Submit Your First Device
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {submissions.map((device) => (
                    <div
                      key={device.id}
                      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                    >
                      {/* Image Section */}
                      {device.photos && device.photos.length > 0 ? (
                        <div className="relative w-full h-48 bg-gray-100 overflow-hidden border-b border-gray-200">
                          <img
                            src={getImageUrl(device.photos[0].image)}
                            alt={`${device.brand} ${device.model}`}
                            className="w-full h-full object-contain bg-gray-50"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x300?text=Photo+Failed';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 font-medium border-b border-gray-200">
                          No photo uploaded
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {device.brand} {device.model}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Submitted: {new Date(device.submission_date).toLocaleDateString()}
                        </p>

                        {/* Status Badge */}
                        <div className="mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            device.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            device.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            device.status === 'CERTIFIED' ? 'bg-emerald-100 text-emerald-800' :
                            device.status === 'REFURBISH' ? 'bg-amber-100 text-amber-800' :
                            device.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            device.status === 'PUBLISHED' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {device.status === 'REFURBISH' ? 'REFURBISHMENT' : 
                             device.status === 'PUBLISHED' ? 'PUBLISHED' : device.status}
                          </span>
                        </div>

                        {/* Certificate ID */}
                        {device.status === 'CERTIFIED' && device.certificate_id && (
                          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <p className="text-emerald-700 text-sm font-medium">Certificate ID</p>
                            <p className="font-mono text-emerald-800 font-semibold">{device.certificate_id}</p>
                          </div>
                        )}

                        {/* Status Messages */}
                        {device.status === 'APPROVED' && (
                          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-blue-700 font-semibold">✅ Device Accepted</p>
                            <p className="text-blue-600 text-sm mt-1">
                              Please bring your device to the shop for inspection.
                            </p>
                          </div>
                        )}

                        {device.status === 'CERTIFIED' && (
                          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <p className="text-emerald-700 font-semibold">🎉 Device is now Certified!</p>
                            <p className="text-emerald-600 text-sm mt-1">
                              Your device has passed all quality checks.
                            </p>
                          </div>
                        )}

                        {device.status === 'REFURBISH' && (
                          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <p className="text-amber-700 font-semibold">🔧 Under Refurbishment</p>
                            <p className="text-amber-600 text-sm mt-1">
                              Our team is repairing this device.
                            </p>
                          </div>
                        )}

                        {device.status === 'REJECTED' && (
                          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-700 font-semibold">❌ Device Rejected</p>
                            <p className="text-red-600 text-sm mt-1">
                              This device did not meet our quality standards.
                            </p>
                          </div>
                        )}

                        {device.status === 'PUBLISHED' && (
                          <div className="mb-5 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <p className="text-purple-700 font-semibold">📢 Published to Catalog</p>
                            <p className="text-purple-600 text-sm mt-1">
                              This device is now available for sale in our catalog.
                            </p>
                          </div>
                        )}

                        <Link
                          to={`/customer-device/${device.id}`}
                          className="block w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                        >
                          View Submitted Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}