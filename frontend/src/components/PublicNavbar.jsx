import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from "../assets/retech-logo.png";

const PublicNavbar = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between" style={{ height: 'calc(80px - 1mm)' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center" style={{ marginLeft: '-50px', marginTop: '4mm' }}>
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-32 w-auto transition-transform hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
            Home
          </Link>
          <Link to="/about-us" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
            About Us
          </Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
            Partner With Us
          </Link>
          <Link to="/catalog" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
            Browse Catalog
          </Link>
          <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link to="/customer-login" className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200">
            Login
          </Link>
          <Link
            to="/customer-signup"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default PublicNavbar;