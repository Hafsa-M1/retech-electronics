import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaMobileAlt, 
  FaUsers, 
  FaUserTie, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaChartLine,
  FaEye,
  FaTrash,
  FaEdit
} from 'react-icons/fa';
import AdminNavbar from '../../components/AdminNavbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    certifiedDevices: 0,
    totalCustomers: 0,
    totalStaff: 0,
    soldDevices: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // Fetch submissions
      const submissionsRes = await axios.get('http://localhost:8000/api/submissions/all/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const submissions = submissionsRes.data;
      
      // Calculate stats
      const pending = submissions.filter(s => s.status === 'PENDING' || s.status === 'pending').length;
      const certified = submissions.filter(s => s.status === 'CERTIFIED' || s.status === 'approved').length;
      const sold = submissions.filter(s => s.status === 'SOLD' || s.status === 'sold').length;
      
      setStats({
        totalSubmissions: submissions.length,
        pendingSubmissions: pending,
        certifiedDevices: certified,
        totalCustomers: 0, // Will be fetched from users endpoint
        totalStaff: 0, // Will be fetched from staff endpoint
        soldDevices: sold
      });
      
      setRecentSubmissions(submissions.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Submissions', value: stats.totalSubmissions, icon: <FaMobileAlt />, color: 'bg-blue-500' },
    { title: 'Pending Review', value: stats.pendingSubmissions, icon: <FaClock />, color: 'bg-yellow-500' },
    { title: 'Certified Devices', value: stats.certifiedDevices, icon: <FaCheckCircle />, color: 'bg-green-500' },
    { title: 'Sold Devices', value: stats.soldDevices, icon: <FaChartLine />, color: 'bg-purple-500' },
  ];

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('pending')) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    } else if (statusLower.includes('certified') || statusLower.includes('approved')) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Certified</span>;
    } else if (statusLower.includes('sold')) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Sold</span>;
    } else if (statusLower.includes('reject')) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your marketplace today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Submissions Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Device Submissions</h2>
                <p className="text-sm text-gray-500">Latest device submissions awaiting review</p>
              </div>
              <Link 
                to="/admin/submissions" 
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{submission.brand?.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.brand} {submission.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.condition || 'Standard'}
                            </div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{submission.customer_name || 'Customer'}</div>
                        <div className="text-sm text-gray-500">{submission.customer_email || '—'}</div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(submission.submission_date).toLocaleDateString()}
                        </div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(submission.status)}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-emerald-600 hover:text-emerald-900 mr-3">
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <FaTrash className="w-5 h-5" />
                        </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {recentSubmissions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-500">No device submissions yet</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link to="/admin/submissions" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-xl font-bold mb-2">Review Submissions</h3>
              <p className="text-white/80 mb-4">Review pending device submissions and update their status</p>
              <span className="inline-flex items-center text-white font-medium hover:text-blue-100">
                Go to Submissions <span className="ml-1">→</span>
              </span>
            </Link>
            
            <Link to="/admin/staff" className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2">Manage Staff</h3>
              <p className="text-white/80 mb-4">Create and manage staff accounts with different roles</p>
              <span className="inline-flex items-center text-white font-medium hover:text-purple-100">
                Manage Staff <span className="ml-1">→</span>
              </span>
            </Link>
            
            <Link to="/admin/devices" className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="text-xl font-bold mb-2">Catalog Management</h3>
              <p className="text-white/80 mb-4">Manage device listings and inventory in the public catalog</p>
              <span className="inline-flex items-center text-white font-medium hover:text-emerald-100">
                Manage Catalog <span className="ml-1">→</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;