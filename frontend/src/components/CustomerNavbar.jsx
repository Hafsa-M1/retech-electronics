import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';  // ← Changed to NavLink
import logo from "../assets/retech-logo.png";

const CustomerNavbar = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('customerToken');
  
  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerEmail');
    navigate('/customer-login');
  };

  // Common active link styles
  const activeLinkStyle = "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1";
  const inactiveLinkStyle = "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <NavLink to="/customer-dashboard" className="flex items-center">
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-32 w-auto transition-transform hover:scale-105"
          />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/customer-dashboard" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/customer-submit-device" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Submit Device
          </NavLink>
          <NavLink 
            to="/customer-my-devices" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            My Devices
          </NavLink>
          <NavLink 
            to="/catalog" 
            className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
          >
            Browse Catalog
          </NavLink>
          
          
          {/* User Profile & Logout */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {localStorage.getItem('customerEmail')?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {localStorage.getItem('customerEmail')?.split('@')[0] || 'Customer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/customer-login"
                className={({ isActive }) => isActive ? activeLinkStyle : inactiveLinkStyle}
              >
                Login
              </NavLink>
              <NavLink
                to="/customer-signup"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {isLoggedIn && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {localStorage.getItem('customerEmail')?.charAt(0).toUpperCase() || 'U'}
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

      {/* Mobile Menu - also using NavLink for active style */}
      {isLoggedIn && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <NavLink 
              to="/customer-dashboard" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/customer-submit-device" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Submit Device
            </NavLink>
            <NavLink 
              to="/customer-my-devices" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              My Devices
            </NavLink>
            <NavLink 
              to="/catalog" 
              className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"}
            >
              Browse Catalog
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 text-left mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;