import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerNavbar from "../../components/CustomerNavbar";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({
    totalDevices: 0,
    submitted: 0,
    underDiagnostics: 0,
    certified: 0,
    sold: 0
  });

  // Fetch real customer data from API
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('customerToken') || sessionStorage.getItem('customerToken');
    if (!token) {
      navigate('/customer-login');
      return;
    }

    // Fetch customer data from API
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await axios.get(
          'http://localhost:8000/api/users/me/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Fetch user's devices/submissions
        const devicesResponse = await axios.get(
          'http://localhost:8000/api/submissions/my/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const userData = userResponse.data;
        const devicesData = devicesResponse.data;
        
        // Calculate statistics from real devices
        const statsData = {
          totalDevices: devicesData.length,
          submitted: devicesData.filter(d => d.status === 'PENDING' || d.status === 'Submitted' || d.status === 'pending').length,
          underDiagnostics: devicesData.filter(d => d.status === 'UNDER_DIAGNOSTICS' || d.status === 'Under Diagnostics' || d.status === 'under_diagnostics').length,
          certified: devicesData.filter(d => d.status === 'CERTIFIED' || d.status === 'Certified' || d.status === 'APPROVED' || d.status === 'approved').length,
          sold: devicesData.filter(d => d.status === 'SOLD' || d.status === 'Sold' || d.status === 'sold').length
        };

        setCustomerData({
          name: userData.full_name || `${userData.first_name} ${userData.last_name}`.trim() || userData.email.split('@')[0],
          email: userData.email,
          memberSince: new Date(userData.date_joined).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          totalSubmissions: devicesData.length,
          lastSubmission: devicesData.length > 0 ? new Date(devicesData[0].submission_date).toLocaleDateString() : 'N/A'
        });
        
        setDevices(devicesData);
        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        
        // If token is invalid, redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('customerToken');
          localStorage.removeItem('customerEmail');
          navigate('/customer-login');
        }
        
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [navigate]);

  // Quick action cards based on SRS functionality - Updated to hyphen URLs
  const quickActions = [
    {
      title: 'Submit New Device',
      description: 'Submit details of your electronic device for refurbishing and resale',
      icon: '📱',
      link: '/customer-submit-device',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'View My Devices',
      description: 'Track status of all your submitted devices',
      icon: '📋',
      link: '/customer-my-devices',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
    },
    {
      title: 'Browse Catalog',
      description: 'View certified refurbished devices available for purchase',
      icon: '🛒',
      link: '/catalog',
      color: 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
    },
  ];

  // Get status badge color
  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('submitted')) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower.includes('diagnostic') || statusLower.includes('under')) {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower.includes('certified') || statusLower.includes('approved')) {
      return 'bg-green-100 text-green-800';
    } else if (statusLower.includes('sold')) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <CustomerNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Welcome Section (redesigned) */}
        <div className="mb-8 bg-gradient-to-r from-emerald-50 via-white to-white p-6 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Welcome back, {customerData?.name || 'Customer'}!
            </h1>
            <p className="text-gray-600 text-lg">
              Member since {customerData?.memberSince || 'N/A'} • {customerData?.totalSubmissions || 0} device(s) submitted
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Link to="/customer-submit-device" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow">
                Submit Device
              </Link>
              <Link to="/customer-my-devices" className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:shadow">
                My Devices
              </Link>
              <Link to="/catalog" className="px-4 py-2 bg-white border border-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-50">
                Browse Catalog
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-700">
              {customerData?.name ? customerData.name.split(' ').map(n => n[0]).slice(0,2).join('') : 'CU'}
            </div>
          </div>
        </div>

        {/* Stats Overview (redesigned cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-blue-400 hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-blue-700 text-xl">📦</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalDevices}</div>
              <div className="text-sm text-gray-500">Total Devices</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-yellow-400 hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg flex items-center justify-center text-yellow-700 text-xl">📝</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.submitted}</div>
              <div className="text-sm text-gray-500">Submitted</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-indigo-500 hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center text-indigo-700 text-xl">🔧</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.underDiagnostics}</div>
              <div className="text-sm text-gray-500">Under Diagnostics</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-emerald-400 hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 text-xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.certified}</div>
              <div className="text-sm text-gray-500">Certified</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 border-l-4 border-purple-400 hover:shadow-md transition">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center text-purple-700 text-xl">💰</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.sold}</div>
              <div className="text-sm text-gray-500">Sold</div>
            </div>
          </div>
        </div>

        {/* Quick Actions removed per request */}

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600">Your latest device submissions and updates</p>
          </div>
          
          <div className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-4">
                {devices.slice(0, 3).map((device, index) => (
                  <div key={index} className="flex items-center p-4 bg-white rounded-lg border shadow-sm">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                      {device.photos && device.photos.length > 0 ? (
                        <img src={device.photos[0].image} alt="photo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">📱</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{device.brand} {device.model}</p>
                      <p className="text-sm text-gray-600">{device.condition || device.condition_description || 'Standard'} • {new Date(device.submission_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 ${getStatusColor(device.status)} text-xs font-medium rounded-full`}>{device.status}</span>
                      <Link to={`/customer-my-devices`} className="text-sm text-emerald-600 mt-2">Details →</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No devices yet</h3>
                <p className="text-gray-600 mb-6">Start by submitting your first device for refurbishment</p>
                <Link
                  to="/customer-submit-device"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Your First Device
                </Link>
              </div>
            )}

            {devices.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/customer-my-devices"
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                >
                  View All Activities
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Certification Process Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Certification Process</h3>
            <p className="text-gray-600 mb-4">
              All devices undergo standardized diagnostic testing before certification.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-emerald-600 font-medium">1</span>
                </div>
                <span className="text-gray-700">Device submission and registration</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium">2</span>
                </div>
                <span className="text-gray-700">Standardized diagnostic testing</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-medium">3</span>
                </div>
                <span className="text-gray-700">Quality assessment and certification</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-medium">4</span>
                </div>
                <span className="text-gray-700">Listing in public catalog for sale</span>
              </li>
            </ul>
          </div>

          {/* Why Choose ReTech */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Why Choose ReTech?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Certified Quality</p>
                  <p className="text-sm text-gray-600">50+ point diagnostic testing on every device</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">90-Day Warranty</p>
                  <p className="text-sm text-gray-600">Peace of mind with every purchase</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sustainable Choice</p>
                  <p className="text-sm text-gray-600">Reduce e-waste and carbon footprint</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-orange-600 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Best Prices</p>
                  <p className="text-sm text-gray-600">Up to 70% off retail prices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;