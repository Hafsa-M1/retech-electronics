// src/components/StaffNavbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/retech-logo.png";

const StaffNavbar = () => {
  const navigate = useNavigate();

  const staffToken = localStorage.getItem("staffToken");
  const staffInfo = localStorage.getItem("staffInfo");
  const staffName = staffInfo ? JSON.parse(staffInfo).first_name || "Staff" : "Staff";
  const staffInitial = staffName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffRefreshToken");
    localStorage.removeItem("staffInfo");
    navigate("/staff/login");
  };

  const activeLinkStyle = "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1";
  const inactiveLinkStyle = "text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        
        {/* Logo */}
        <NavLink to="/staff/dashboard" className="flex items-center">
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-32 w-auto transition-transform hover:scale-105"
          />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/staff/dashboard"
            className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/staff/registration"
            className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
          >
            Registration
          </NavLink>

          <NavLink
            to="/staff/diagnostics"
            className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
          >
            Diagnostics
          </NavLink>

          <NavLink
            to="/staff/certification"
            className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
          >
            Certification
          </NavLink>

          <NavLink
            to="/staff/reservations"
            className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
          >
            Reservations
          </NavLink>

          {/* Catalog links to PUBLIC catalog */}
          <NavLink
            to="/catalog"
            className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
          >
            Catalog
          </NavLink>

          {/* Staff Profile & Logout */}
          {staffToken ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {staffInitial}
                </div>
                <span className="text-sm text-gray-700 font-medium">{staffName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/staff/login"
              className={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {staffToken && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {staffInitial}
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
      {staffToken && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col space-y-4">
            <NavLink to="/staff/dashboard" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 py-2"}>
              Dashboard
            </NavLink>
            <NavLink to="/staff/registration" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 py-2"}>
              Device Registration
            </NavLink>
            <NavLink to="/staff/diagnostics" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 py-2"}>
              Diagnostics
            </NavLink>
            <NavLink to="/staff/certification" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 py-2"}>
              Certification
            </NavLink>
            <NavLink to="/staff/reservations" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 py-2"}>
              Reservations
            </NavLink>
            
            {/* Public Catalog Link in Mobile Menu */}
            <NavLink to="/catalog" className={({ isActive }) => isActive ? "text-emerald-600 font-semibold py-2" : "text-gray-700 hover:text-emerald-600 py-2"}>
              Catalog
            </NavLink>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium mt-4"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default StaffNavbar;
