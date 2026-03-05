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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('API Response:', response.data);
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

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Log the original path for debugging
    console.log('Original image path:', imagePath);
    
    // If it's already a full URL (starts with http), use it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If the path starts with /media/, add base URL
    else if (imagePath.startsWith('/media/')) {
      return `http://localhost:8000${imagePath}`;
    }
    // If the path starts with media/ (without leading slash), add slash and base URL
    else if (imagePath.startsWith('media/')) {
      return `http://localhost:8000/${imagePath}`;
    }
    // If it's just the filename, construct the full path
    else {
      return `http://localhost:8000/media/${imagePath}`;
    }
  };

  return (
    <>
      <CustomerNavbar />

      <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
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
                            onLoad={() => console.log('✅ Photo loaded successfully for device:', device.id)}
                            onError={(e) => {
                              console.error('❌ Photo failed to load for device:', device.id);
                              console.error('Attempted URL:', e.target.src);
                              // Show a nicer placeholder
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="50" y="150" font-family="Arial" font-size="16" fill="%239ca3af">Image failed to load</text></svg>';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 font-medium border-b border-gray-200">
                          <div className="text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>No photo uploaded</p>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {device.brand} {device.model}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Submitted: {new Date(device.submission_date).toLocaleDateString()}
                        </p>
                        {device.condition && (
                          <p className="text-sm text-gray-600 mb-4">
                            Condition: {device.condition}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            device.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            device.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            device.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {device.status}
                          </span>
                          <Link
                            to={`/customer-device/${device.id}`}
                            className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
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