import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaMobileAlt, 
  FaUsers, 
  FaUserTie, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaChartLine,
  FaCog
} from 'react-icons/fa';
import logo from "../../assets/retech-logo.png";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    // Get admin data from localStorage
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      setAdminData(JSON.parse(adminInfo));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin-login');
  };

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaTachometerAlt className="w-5 h-5" /> },
    { path: '/admin/submissions', name: 'All Submissions', icon: <FaMobileAlt className="w-5 h-5" /> },
    { path: '/admin/staff', name: 'Staff Accounts', icon: <FaUserTie className="w-5 h-5" /> },
    { path: '/admin/users', name: 'Customers', icon: <FaUsers className="w-5 h-5" /> },
    { path: '/admin/devices', name: 'Device Inventory', icon: <FaMobileAlt className="w-5 h-5" /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 text-white ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <img src={logo} alt="ReTech" className="h-10 w-auto" />
            {sidebarOpen && <span className="text-xl font-bold">Admin Panel</span>}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 my-1 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {adminData?.name?.charAt(0) || 'A'}
                </span>
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium text-gray-700">{adminData?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;