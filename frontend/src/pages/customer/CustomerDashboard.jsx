import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from "../../components/CustomerNavbar";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [stats, setStats] = useState({
    totalDevices: 0,
    submitted: 0,
    underDiagnostics: 0,
    certified: 0,
    sold: 0
  });

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('customerToken') || sessionStorage.getItem('customerToken');
    if (!token) {
      navigate('/customer-login');
      return;
    }

    // Fetch customer data (replace with actual API call)
    const fetchCustomerData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock customer data
        const mockCustomerData = {
          name: 'Emma Gregory',
          email: localStorage.getItem('customerEmail') || 'emma@gmail.com',
          memberSince: '2026-01-26',
          totalSubmissions: 1,
          lastSubmission: '2026-01-26'
        };
        
        // Mock devices data based on SRS Section 4.1-4.3
        const mockDevices = [
          {
            id: 'DEV001',
            brand: 'Samsung',
            model: 'Galaxy S21',
            submissionDate: '2024-02-10',
            status: 'Under Diagnostics',
            condition: 'Good',
            certificateId: null,
            estimatedValue: 'Rs. 45,000'
          },
          {
            id: 'DEV002',
            brand: 'Apple',
            model: 'iPhone 12',
            submissionDate: '2024-01-25',
            status: 'Certified',
            condition: 'Excellent',
            certificateId: 'CERT-2024-0012',
            certifiedDate: '2024-01-28',
            certifiedValue: 'Rs. 60,000'
          },
          {
            id: 'DEV003',
            brand: 'Dell',
            model: 'XPS 13',
            submissionDate: '2024-01-15',
            status: 'Sold',
            condition: 'Good',
            certificateId: 'CERT-2024-0008',
            soldDate: '2024-01-20',
            soldPrice: 'Rs. 85,000'
          }
        ];

        // Calculate statistics
        const statsData = {
          totalDevices: mockDevices.length,
          submitted: mockDevices.filter(d => d.status === 'Submitted').length,
          underDiagnostics: mockDevices.filter(d => d.status === 'Under Diagnostics').length,
          certified: mockDevices.filter(d => d.status === 'Certified').length,
          sold: mockDevices.filter(d => d.status === 'Sold').length
        };

        setCustomerData(mockCustomerData);
        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer data:', error);
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
    {
      title: 'Provide Feedback',
      description: 'Share your experience with submitted or purchased devices',
      icon: '💬',
      link: '/customer-feedback',
      color: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20"> {/* Added pt-20 for navbar height */}
        <CustomerNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar />
      
      {/* Main Content - Added pt-20 for navbar height */}
      <div className="container mx-auto px-4 py-8 pt-24"> {/* Changed from pt-8 to pt-24 */}
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {customerData?.name || 'Customer'}!
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your device submissions, track certifications, and explore refurbished electronics.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl font-bold text-blue-600">{stats.totalDevices}</div>
            <div className="text-gray-700 font-medium">Total Devices</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl font-bold text-yellow-600">{stats.underDiagnostics}</div>
            <div className="text-gray-700 font-medium">Under Diagnostics</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl font-bold text-emerald-600">{stats.certified}</div>
            <div className="text-gray-700 font-medium">Certified</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl font-bold text-purple-600">{stats.sold}</div>
            <div className="text-gray-700 font-medium">Sold</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="text-3xl font-bold text-gray-600">{stats.submitted}</div>
            <div className="text-gray-700 font-medium">Submitted</div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                to={action.link}
                className={`${action.color} text-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-white/90 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600">Your latest device submissions and updates</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600">📱</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Device submitted for diagnostics</p>
                  <p className="text-sm text-gray-600">Samsung Galaxy S21 - Submitted on 2024-02-10</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Under Review
                </span>
              </div>
              
              <div className="flex items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600">✅</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Device certified for resale</p>
                  <p className="text-sm text-gray-600">Apple iPhone 12 - Certified on 2024-01-28</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  Certified
                </span>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600">💰</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Device sold successfully</p>
                  <p className="text-sm text-gray-600">Dell XPS 13 - Sold on 2024-01-20 for Rs. 85,000</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                  Sold
                </span>
              </div>
            </div>
            
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
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Certification Process Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Certification Process</h3>
            <p className="text-gray-600 mb-4">
              Based on SRS Section 4.3, all devices undergo standardized diagnostic testing before certification.
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

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600">📱</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Device diagnostics completed</p>
                  <p className="text-sm text-gray-600 mt-1">Your Samsung Galaxy S21 has completed diagnostic testing</p>
                  <span className="inline-block mt-2 text-xs text-blue-600">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-emerald-600">✅</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Certificate issued</p>
                  <p className="text-sm text-gray-600 mt-1">Your iPhone 12 has been certified for resale</p>
                  <span className="inline-block mt-2 text-xs text-emerald-600">1 day ago</span>
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