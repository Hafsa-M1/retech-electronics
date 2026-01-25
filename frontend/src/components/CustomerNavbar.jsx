import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/retech-logo.png"; // Adjust the path based on your folder structure

const CustomerNavbar = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('customerToken');
  
  const handleLogout = () => {
    // Clear customer authentication data
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerEmail');
    navigate('/customer-login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/customer-dashboard" className="flex items-center">
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-32 w-auto transition-transform hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/customer-dashboard" 
            className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/customer-submit-device" 
            className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
          >
            Submit Device
          </Link>
          <Link 
            to="/customer-my-devices" 
            className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
          >
            My Devices
          </Link>
          <Link 
            to="/catalog" 
            className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
          >
            Browse Catalog
          </Link>
          <Link 
            to="/customer-feedback" 
            className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
          >
            Feedback
          </Link>
          
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
              <Link
                to="/customer-login"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/customer-signup"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
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

      {/* Mobile Menu */}
      {isLoggedIn && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/customer-dashboard" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
            >
              Dashboard
            </Link>
            <Link 
              to="/customer-submit-device" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
            >
              Submit Device
            </Link>
            <Link 
              to="/customer-my-devices" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
            >
              My Devices
            </Link>
            <Link 
              to="/catalog" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
            >
              Browse Catalog
            </Link>
            <Link 
              to="/customer-feedback" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 py-2"
            >
              Feedback
            </Link>
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