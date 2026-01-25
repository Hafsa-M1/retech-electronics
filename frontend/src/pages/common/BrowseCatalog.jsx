import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFilter, FaSortAmountDown, FaSearch, FaShoppingCart, FaHeart, FaStar, FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones } from 'react-icons/fa';
import logo from "../../assets/retech-logo.png";
import browseHero from "../../assets/images/browse-hero.png";

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  // Categories
  const categories = [
    { id: 'all', name: 'All Devices', icon: '📱', count: 120 },
    { id: 'smartphones', name: 'Smartphones', icon: <FaMobileAlt />, count: 45 },
    { id: 'laptops', name: 'Laptops', icon: <FaLaptop />, count: 35 },
    { id: 'tablets', name: 'Tablets', icon: <FaTabletAlt />, count: 20 },
    { id: 'accessories', name: 'Accessories', icon: <FaHeadphones />, count: 20 },
  ];

  // Filters
  const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Microsoft', 'Google', 'OnePlus'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Certified Refurbished'];
  const priceRanges = [
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500 - $1000', min: 500, max: 1000 },
    { label: '$1000 - $2000', min: 1000, max: 2000 },
    { label: 'Over $2000', min: 2000, max: 5000 },
  ];

  // Sort options
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  // Placeholder devices - will be replaced with real data from database
  const placeholderDevices = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      category: "smartphones",
      brand: "Apple",
      condition: "Excellent",
      price: 899,
      originalPrice: 1299,
      rating: 4.8,
      reviewCount: 124,
      image: "📱",
      specs: ["256GB", "6.7\" Display", "5G", "Excellent Condition"],
      isCertified: true,
      stock: 8
    },
    {
      id: 2,
      name: "MacBook Air M2",
      category: "laptops",
      brand: "Apple",
      condition: "Certified Refurbished",
      price: 999,
      originalPrice: 1499,
      rating: 4.9,
      reviewCount: 89,
      image: "💻",
      specs: ["M2 Chip", "16GB RAM", "512GB SSD", "Certified Refurbished"],
      isCertified: true,
      stock: 5
    },
    {
      id: 3,
      name: "Samsung Galaxy S23 Ultra",
      category: "smartphones",
      brand: "Samsung",
      condition: "Good",
      price: 749,
      originalPrice: 1199,
      rating: 4.7,
      reviewCount: 156,
      image: "📱",
      specs: ["512GB", "S Pen", "200MP Camera", "Good Condition"],
      isCertified: true,
      stock: 12
    },
    {
      id: 4,
      name: "Dell XPS 13",
      category: "laptops",
      brand: "Dell",
      condition: "Excellent",
      price: 899,
      originalPrice: 1399,
      rating: 4.6,
      reviewCount: 67,
      image: "💻",
      specs: ["i7 Processor", "16GB RAM", "1TB SSD", "Excellent Condition"],
      isCertified: true,
      stock: 3
    },
    {
      id: 5,
      name: "iPad Pro 12.9\"",
      category: "tablets",
      brand: "Apple",
      condition: "Fair",
      price: 699,
      originalPrice: 1099,
      rating: 4.5,
      reviewCount: 42,
      image: "📱",
      specs: ["M1 Chip", "512GB", "Liquid Retina Display", "Fair Condition"],
      isCertified: false,
      stock: 7
    },
    {
      id: 6,
      name: "AirPods Pro 2",
      category: "accessories",
      brand: "Apple",
      condition: "Excellent",
      price: 199,
      originalPrice: 249,
      rating: 4.8,
      reviewCount: 231,
      image: "🎧",
      specs: ["Noise Cancellation", "Spatial Audio", "Excellent Condition"],
      isCertified: true,
      stock: 15
    },
    {
      id: 7,
      name: "Microsoft Surface Pro 9",
      category: "tablets",
      brand: "Microsoft",
      condition: "Good",
      price: 1099,
      originalPrice: 1599,
      rating: 4.4,
      reviewCount: 38,
      image: "💻",
      specs: ["i5 Processor", "16GB RAM", "256GB SSD", "Good Condition"],
      isCertified: true,
      stock: 4
    },
    {
      id: 8,
      name: "Samsung Galaxy Tab S8",
      category: "tablets",
      brand: "Samsung",
      condition: "Excellent",
      price: 649,
      originalPrice: 899,
      rating: 4.6,
      reviewCount: 91,
      image: "📱",
      specs: ["11\" Display", "S Pen Included", "Excellent Condition"],
      isCertified: true,
      stock: 9
    },
  ];

  // Calculate savings percentage
  const calculateSavings = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-20 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center h-full -ml-4" style={{ marginTop: '4mm' }}>
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-32 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Home</Link>
          <Link to="/about-us" className="text-gray-700 hover:text-green-600 font-medium">About Us</Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-green-600 font-medium">Partner With Us</Link>
          <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 font-medium">Privacy Policy</Link>
          <Link to="/catalog" className="text-green-600 font-medium border-b-2 border-green-600 pb-1">Browse Catalog</Link>
          <Link to="/customer-login" className="text-gray-700 hover:text-green-600 font-medium">Login</Link>
          <Link
            to="/customer-signup"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm"
          >
            Sign Up
          </Link>
        </div>

        <button className="md:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <header 
        className="relative pt-32 pb-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${browseHero})`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Device <span className="text-emerald-200">Catalog</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Browse certified refurbished electronics with guaranteed quality and savings
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for devices, brands, or specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-8 py-3 pr-16 rounded-3xl shadow-2xl text-lg focus:outline-none focus:ring-4 focus:ring-white/50 border-2 border-white/20 bg-white/95 text-gray-900 placeholder-gray-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all duration-300 hover:scale-110 shadow-lg">
                <FaSearch className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="py-6 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-green-600">{placeholderDevices.length}</span> devices
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <FaSortAmountDown className="w-4 h-4 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-0 bg-transparent focus:outline-none focus:ring-0"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-32">
              {/* Close button for mobile */}
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors ${activeFilter === category.id ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {/* Price Quick Filters */}
                <div className="mt-4 space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.label}
                      className="block w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                      <span className="text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Condition</h3>
                <div className="space-y-2">
                  {conditions.map(condition => (
                    <label key={condition} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                      <span className="text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors">
                  Apply Filters
                </button>
                <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors">
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Device Grid */}
          <div className="lg:w-3/4">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${activeFilter === category.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className={`text-sm ${activeFilter === category.id ? 'text-green-100' : 'text-gray-500'}`}>
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeholderDevices.map(device => (
                <div key={device.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  {/* Device Image */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-8xl opacity-80">{device.image}</div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 space-y-2">
                      {device.isCertified && (
                        <span className="inline-block px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          Certified
                        </span>
                      )}
                      <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                        Save {calculateSavings(device.price, device.originalPrice)}%
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 space-y-2">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <FaHeart className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <FaShoppingCart className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Device Details */}
                  <div className="p-6">
                    {/* Category & Brand */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 uppercase tracking-wide">
                        {device.brand} • {device.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${device.stock < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {device.stock} in stock
                      </span>
                    </div>

                    {/* Device Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {device.name}
                    </h3>

                    {/* Condition */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${device.condition === 'Excellent' ? 'bg-green-100 text-green-800' : device.condition === 'Good' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {device.condition}
                      </span>
                    </div>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {device.specs.map((spec, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      {renderStars(device.rating)}
                      <span className="text-sm text-gray-500">({device.reviewCount} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">${device.price}</div>
                        <div className="text-sm text-gray-500 line-through">${device.originalPrice}</div>
                      </div>
                      
                      <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105">
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {placeholderDevices.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No devices found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters or search terms</p>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-colors ${page === 1 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Shop <span className="text-green-600">ReTech</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Certified quality, guaranteed savings, and peace of mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Quality</h3>
              <p className="text-gray-600">Every device undergoes 50+ point testing and certification</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">Up to 70% off retail prices with quality guarantees</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free returns on all certified devices</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Device?
            </h2>
            <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto">
              Sign up for an account to save favorites, track orders, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/customer-signup"
                className="px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                to="/contact-us"
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Need Help Choosing?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add Animation Styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}