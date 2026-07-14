import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/retech-logo.png";
import heroImage from "../../assets/images/hero-image.png";
import axios from "axios";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [popularCategories, setPopularCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-scroll-section]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Fetch Popular Categories from Django Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await axios.get(
          "http://127.0.0.1:8000/api/submissions/popular-categories/",
        );

        setPopularCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories:", error);

        // Fallback using your DEVICE_CATEGORIES
        setPopularCategories([
          {
            icon: "📱",
            name: "Smartphone",
            count: "250+",
            label: "devices available",
            color: "bg-gradient-to-r from-green-500 to-emerald-600",
          },
          {
            icon: "💻",
            name: "Laptop",
            count: "180+",
            label: "devices available",
            color: "bg-gradient-to-r from-blue-500 to-cyan-600",
          },
          {
            icon: "📟",
            name: "Tablet",
            count: "95+",
            label: "devices available",
            color: "bg-gradient-to-r from-purple-500 to-violet-600",
          },
          // Add more categories as needed
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const features = [
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Certified Quality",
      description:
        "Every device undergoes 50+ point inspection and 90-day warranty",
      gradient: "from-green-400 to-emerald-600",
      bg: "bg-gradient-to-br from-green-50 to-emerald-100",
      stats: "100% Tested",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Eco-Friendly",
      description: "Join us in reducing electronic waste and carbon footprint",
      gradient: "from-blue-400 to-cyan-600",
      bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
      stats: "85% Less CO₂",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: "Best Prices",
      description: "Premium refurbished tech at up to 70% off retail prices",
      gradient: "from-purple-400 to-violet-600",
      bg: "bg-gradient-to-br from-purple-50 to-violet-100",
      stats: "70% Off",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      title: "Free Returns",
      description: "30-day hassle-free returns if not satisfied",
      gradient: "from-orange-400 to-red-600",
      bg: "bg-gradient-to-br from-orange-50 to-red-100",
      stats: "30 Days",
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }

        .animate-rotate-in {
          animation: rotateIn 0.6s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }

        /* Scroll visibility states */
        .scroll-hidden {
          opacity: 0;
          transform: translateY(40px);
        }

        .scroll-visible {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scroll-item-hidden {
          opacity: 0;
          transform: translateX(-30px);
        }

        .scroll-item-visible {
          opacity: 1;
          transform: translateX(0);
          transition: all 0.6s ease-out;
        }

        .scroll-item-1 { transition-delay: 0.1s; }
        .scroll-item-2 { transition-delay: 0.2s; }
        .scroll-item-3 { transition-delay: 0.3s; }
        .scroll-item-4 { transition-delay: 0.4s; }

        .hover-lift {
          transition: all 0.3s ease-out;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        /* Scale up on scroll visibility */
        .scale-on-scroll {
          opacity: 0;
          transform: scale(0.9);
        }

        .scale-on-scroll-visible {
          opacity: 1;
          transform: scale(1);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .scale-item-1 { transition-delay: 0.1s; }
        .scale-item-2 { transition-delay: 0.2s; }
        .scale-item-3 { transition-delay: 0.3s; }
      `}</style>

      {/* Navbar with Mobile Menu */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-md"
        }`}
      >
        <div
          className="container mx-auto px-6 flex items-center justify-between"
          style={{ height: "80px" }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            style={{ marginLeft: "-50px", marginTop: "4mm" }}
          >
            <img
              src={logo}
              alt="ReTech Logo"
              className="h-32 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              Partner With Us
            </Link>
            <Link
              to="/catalog"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              Browse Catalog
            </Link>
            <Link
              to="/privacy-policy"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/customer-login"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
            >
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
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 z-50"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6h12v12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={toggleMobileMenu}
          >
            <div
              className="bg-white w-4/5 max-w-sm ml-auto h-full shadow-xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-8">
                <button onClick={toggleMobileMenu}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6h12v12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col space-y-6 text-lg">
                <Link
                  to="/"
                  onClick={toggleMobileMenu}
                  className="hover:text-green-600"
                >
                  Home
                </Link>
                <Link
                  to="/about-us"
                  onClick={toggleMobileMenu}
                  className="hover:text-green-600"
                >
                  About Us
                </Link>
                <Link
                  to="/contact-us"
                  onClick={toggleMobileMenu}
                  className="hover:text-green-600"
                >
                  Partner With Us
                </Link>
                <Link
                  to="/catalog"
                  onClick={toggleMobileMenu}
                  className="hover:text-green-600"
                >
                  Browse Catalog
                </Link>
                <Link
                  to="/privacy-policy"
                  onClick={toggleMobileMenu}
                  className="hover:text-green-600"
                >
                  Privacy Policy
                </Link>

                <div className="pt-6 border-t">
                  <Link
                    to="/customer-login"
                    onClick={toggleMobileMenu}
                    className="block mb-4 hover:text-green-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/customer-signup"
                    onClick={toggleMobileMenu}
                    className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section  */}
      <header className="relative min-h-screen pt-20 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-800/10 to-cyan-900/5"></div>

        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: `translateY(${scrollY * 0.4}px)`,
            transition: "transform 0.1s ease-out",
            opacity: 0.7,
          }}
        />

        {/* Enhanced Gradient Overlay - Softer and more balanced */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>

        {/* Floating Elements - Softer colors */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Hero Content - Improved colors for better readability */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pb-4">
          <div className="container mx-auto text-center">

            {/* Main Headline - Softer gradient */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-fade-in-up delay-200">
              <span className="bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
                ReTech
              </span>
            </h1>

            {/* Subheadline - Better contrast */}
            <p className="text-2xl md:text-4xl font-bold text-white mb-6 max-w-4xl mx-auto leading-snug drop-shadow-2xl animate-fade-in-up delay-300">
              Premium Refurbished Electronics
              <span className="block text-xl md:text-2xl font-normal text-emerald-100 mt-3 animate-fade-in-up delay-400">
                Affordable • Certified • Sustainable
              </span>
            </p>

            {/* Description - Improved readability */}
            <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg animate-fade-in-up delay-500">
              Discover like-new devices with full certification, extended
              warranties, and prices that make sense for your wallet and the
              planet.
            </p>

            {/* CTA Buttons - Improved contrast */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
              <Link
                to="/customer-signup"
                className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 min-w-[280px] text-center"
              >
                <span className="relative z-10">Start Your Tech Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/catalog"
                className="group relative px-10 py-5 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-bold text-lg rounded-2xl border-2 border-emerald-300/40 hover:border-emerald-300/60 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 min-w-[280px] text-center"
              >
                <span className="relative z-10">Explore Devices</span>
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Quick Stats - Better contrast */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up delay-600">
              {[
                { label: "Devices Sold", value: "10K+" },
                { label: "Happy Customers", value: "98%" },
                { label: "CO₂ Saved", value: "50T" },
                { label: "Avg Savings", value: "65%" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 backdrop-blur-md bg-white/10 rounded-2xl border border-emerald-300/20 animate-fade-in-scale"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="text-2xl font-bold text-emerald-200">
                    {stat.value}
                  </div>
                  <div className="text-sm text-emerald-100 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Better visibility */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-300/40 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-300 rounded-full mt-2"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4" data-scroll-section id="features">
        <div className="container mx-auto">
          <div
            className={`text-center mb-16 scroll-hidden ${visibleSections["features"] ? "scroll-visible" : ""}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ReTech
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We redefine what it means to buy refurbished electronics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group scale-on-scroll scale-item-${index + 1} ${visibleSections["features"] ? "scale-on-scroll-visible" : ""}`}
              >
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <span
                    className={`text-sm font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                  >
                    {feature.stats}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
        data-scroll-section
        id="categories"
      >
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 scroll-hidden ${visibleSections["categories"] ? "scroll-visible" : ""}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Categories
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of certified refurbished products
            </p>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {popularCategories.map((category, index) => (
                <Link
                  key={index}
                  to={`/catalog?category=${category.name}`}
                  className={`${category.color} rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden relative scroll-hidden scroll-item-${index + 1} ${visibleSections['categories'] ? 'scroll-item-visible' : ''}`}
                >
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-3xl">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                    <p className="text-white/90 mb-4">
                      {category.count} {category.label || 'devices available'}
                    </p>
                    <div className="flex items-center text-sm font-medium text-white">
                      Shop Now
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full"></div>
                    <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white rounded-full"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 0.1; }
        }
        
        .animate-slide-in {
          animation: slideIn 20s linear infinite;
        }
      `}</style>

      {/* Final CTA Section */}
      <section
        className="py-16 px-4 relative overflow-hidden"
        data-scroll-section
        id="cta"
      >
        <div className="container mx-auto">
          <div
            className={`bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-10 md:p-12 text-center shadow-2xl scroll-hidden relative overflow-hidden ${visibleSections["cta"] ? "scroll-visible" : ""}`}
          >
            {/* Modern pattern background */}
            <div className="absolute inset-0">
              <svg
                className="absolute inset-0 w-full h-full opacity-5"
                preserveAspectRatio="none"
                viewBox="0 0 1200 120"
              >
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="2" fill="white" />
                  </pattern>
                </defs>
                <rect width="1200" height="120" fill="url(#dots)" />
              </svg>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <h2
                className={`text-3xl md:text-5xl font-bold text-white mb-4 leading-tight ${visibleSections["cta"] ? "animate-fade-in-up delay-200" : ""}`}
              >
                Ready to Upgrade Your Tech?
              </h2>
              <p
                className={`text-lg text-white/90 mb-8 max-w-2xl mx-auto ${visibleSections["cta"] ? "animate-fade-in-up delay-300" : ""}`}
              >
                Join thousands of satisfied customers who chose quality,
                sustainability, and savings.
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 ${visibleSections["cta"] ? "animate-fade-in-up delay-400" : ""}`}
              >
                <Link
                  to="/customer-signup"
                  className="px-8 py-3 bg-white text-emerald-700 font-bold text-base rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/catalog"
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-base rounded-lg border border-white/40 transition-all duration-300 transform hover:scale-105"
                >
                  Explore Devices
                </Link>
              </div>
              <div
                className={`flex flex-wrap items-center justify-center gap-6 text-white/95 text-sm font-medium ${visibleSections["cta"] ? "animate-fade-in-up delay-500" : ""}`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>90-Day Warranty</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Free Returns</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Certified Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
