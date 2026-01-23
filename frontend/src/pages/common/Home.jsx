import { Link } from 'react-router-dom';
import logo from "../../assets/retech-logo.png";  // your working path

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar - Fixed top */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-20 flex items-center justify-between px-6">
        {/* Logo on far left corner */}
        <Link to="/" className="flex items-center h-full -ml-2">
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-30 w-auto object-contain"
          />
        </Link>

        {/* Menu Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition">
            Home
          </Link>
          <Link to="/about-us" className="text-gray-700 hover:text-green-600 font-medium transition">
            About Us
          </Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-green-600 font-medium transition">
            Contact Us
          </Link>
          <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 font-medium transition">
            Privacy Policy
          </Link>
          <Link to="/catalog" className="text-gray-700 hover:text-green-600 font-medium transition">
            Browse Catalog
          </Link>
          <Link
            to="/customer-login"
            className="text-gray-700 hover:text-green-600 font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/customer-signup"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition shadow-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-700 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <header className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container mx-auto px-6 text-center">
          {/* Hero logo */}
          <img
            src={logo}
            alt="ReTech Logo"
            className="mx-auto h-36 md:h-48 mb-8 object-contain drop-shadow-lg"
          />
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            ReTech
          </h1>
          <p className="text-xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Refurbished Electronics – Affordable, Certified, Eco-Friendly
          </p>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Give your old devices a new life or discover high-quality refurbished tech at unbeatable prices.
          </p>

          {/* Primary CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/customer-signup"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Get Started as Customer
            </Link>
            <Link
              to="/catalog"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Browse Refurbished Devices
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Info / Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-green-50 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-green-700 mb-4">Certified Quality</h3>
            <p className="text-gray-600">Every device passes diagnostics & certification</p>
          </div>
          <div className="p-8 bg-blue-50 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-blue-700 mb-4">Eco-Friendly</h3>
            <p className="text-gray-600">Reduce e-waste with refurbished tech</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Best Prices</h3>
            <p className="text-gray-600">Up to 70% off new prices</p>
          </div>
        </div>
      </section>
    </div>
  );
}
