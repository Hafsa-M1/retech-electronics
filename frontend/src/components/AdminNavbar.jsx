import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from "../assets/retech-logo.png";

const AdminNavbar = () => {
  const navigate = useNavigate();
  
  // Check if admin is logged in
  const isLoggedIn = localStorage.getItem('adminToken');
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin-login');
  };

  // Common active link styles
  const activeLinkStyle = "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1";
  const inactiveLinkStyle = "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200";

  // Get admin name from localStorage
  const adminInfo = localStorage.getItem('adminInfo');
  const adminName = adminInfo ? JSON.parse(adminInfo).name || 'Admin' : 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <NavLink to="/admin/dashboard" className="flex items-center">
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-32 w-auto transition-transform hover:scale-105"
          />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/submissions" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Submissions
          </NavLink>
          <NavLink 
            to="/admin/staff" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Staff
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Customers
          </NavLink>
          <NavLink 
            to="/admin/devices" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Inventory
          </NavLink>
          
          {/* Admin Profile & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {adminInitial}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {adminName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/admin-login"
                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
              >
                Login
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {isLoggedIn && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {adminInitial}
                </span>
              </div>
            </div>
          )}
          <button className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isLoggedIn && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/admin/submissions" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Submissions
            </NavLink>
            <NavLink 
              to="/admin/staff" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Staff
            </NavLink>
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Customers
            </NavLink>
            <NavLink 
              to="/admin/devices" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Inventory
            </NavLink>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 text-left mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;