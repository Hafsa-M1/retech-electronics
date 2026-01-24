import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from "../../assets/retech-logo.png";
import heroImage from "../../assets/images/hero-image.png";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-scroll-section]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Certified Quality",
      description: "Every device undergoes 50+ point inspection and 90-day warranty",
      gradient: "from-green-400 to-emerald-600",
      bg: "bg-gradient-to-br from-green-50 to-emerald-100",
      stats: "100% Tested"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Eco-Friendly",
      description: "Join us in reducing electronic waste and carbon footprint",
      gradient: "from-blue-400 to-cyan-600",
      bg: "bg-gradient-to-br from-blue-50 to-cyan-100",
      stats: "85% Less CO₂"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Best Prices",
      description: "Premium refurbished tech at up to 70% off retail prices",
      gradient: "from-purple-400 to-violet-600",
      bg: "bg-gradient-to-br from-purple-50 to-violet-100",
      stats: "70% Off"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Free Returns",
      description: "30-day hassle-free returns if not satisfied",
      gradient: "from-orange-400 to-red-600",
      bg: "bg-gradient-to-br from-orange-50 to-red-100",
      stats: "30 Days"
    }
  ];

  const popularCategories = [
    { 
      icon: "📱", 
      name: "Smartphones", 
      count: "250+", 
      color: "bg-gradient-to-r from-green-500 to-emerald-600" 
    },
    { 
      icon: "💻", 
      name: "Laptops", 
      count: "180+", 
      color: "bg-gradient-to-r from-blue-500 to-cyan-600" 
    },
    { 
      icon: "🎧", 
      name: "Accessories", 
      count: "120+", 
      color: "bg-gradient-to-r from-purple-500 to-violet-600" 
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

      {/* Navbar with scroll effect */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white shadow-md'
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
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

      {/* Hero Section */}
      <header className="relative min-h-screen pt-20 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/5 to-purple-400/10"></div>
        
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: `translateY(${scrollY * 0.4}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Hero Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="container mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-green-400/50 animate-fade-in-up delay-100">
              <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-green-100">Trusted by 10,000+ Customers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight animate-fade-in-up delay-200">
              <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
                ReTech
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-2xl md:text-4xl font-bold text-white mb-6 max-w-4xl mx-auto leading-snug drop-shadow-2xl animate-fade-in-up delay-300">
              Premium Refurbished Electronics
              <span className="block text-xl md:text-2xl font-normal text-emerald-200 mt-2 animate-fade-in-up delay-400">
                Affordable • Certified • Sustainable
              </span>
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg animate-fade-in-up delay-500">
              Discover like-new devices with full certification, extended warranties, and prices that make sense for your wallet and the planet.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
              <Link
                to="/customer-signup"
                className="group relative px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 min-w-[280px] text-center"
              >
                <span className="relative z-10">Start Your Tech Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/catalog"
                className="group relative px-10 py-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold text-lg rounded-2xl border-2 border-white/40 hover:border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 min-w-[280px] text-center"
              >
                <span className="relative z-10">Explore Devices</span>
                <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up delay-600">
              {[
                { label: "Devices Sold", value: "10K+" },
                { label: "Happy Customers", value: "98%" },
                { label: "CO₂ Saved", value: "50T" },
                { label: "Avg Savings", value: "65%" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 animate-fade-in-scale" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <div className="text-2xl font-bold text-emerald-200">{stat.value}</div>
                  <div className="text-sm text-gray-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4" data-scroll-section id="features">
        <div className="container mx-auto">
          <div className={`text-center mb-16 scroll-hidden ${visibleSections['features'] ? 'scroll-visible' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">ReTech</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We redefine what it means to buy refurbished electronics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group scale-on-scroll scale-item-${index + 1} ${visibleSections['features'] ? 'scale-on-scroll-visible' : ''}`}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  <span className={`text-sm font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.stats}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Certified & Tested
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white" data-scroll-section id="categories">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 scroll-hidden ${visibleSections['categories'] ? 'scroll-visible' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of certified refurbished products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {popularCategories.map((category, index) => (
              <Link
                key={index}
                to="/catalog"
                className={`${category.color} rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden relative scroll-hidden scroll-item-${index + 1} ${visibleSections['categories'] ? 'scroll-item-visible' : ''}`}
              >
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-3xl">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                  <p className="text-white/90 mb-4">{category.count} devices available</p>
                  <div className="flex items-center text-sm font-medium text-white">
                    Shop Now
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4" data-scroll-section id="cta">
        <div className="container mx-auto">
          <div className={`bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-3xl p-12 md:p-16 text-center shadow-2xl scroll-hidden ${visibleSections['cta'] ? 'scroll-visible' : ''}`}>
            <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 ${visibleSections['cta'] ? 'animate-fade-in-left delay-200' : ''}`}>
              Ready to Upgrade Your Tech?
            </h2>
            <p className={`text-xl text-white/95 mb-10 max-w-2xl mx-auto ${visibleSections['cta'] ? 'animate-fade-in-right delay-300' : ''}`}>
              Join thousands of satisfied customers who chose quality, sustainability, and savings.
            </p>
            <div className={`flex flex-col sm:flex-row gap-6 justify-center ${visibleSections['cta'] ? 'animate-fade-in-up delay-400' : ''}`}>
              <Link
                to="/catalog"
                className="px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Browse All Devices
              </Link>
              <Link
                to="/customer-signup"
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Create Free Account
              </Link>
            </div>
            <div className={`mt-10 flex flex-wrap items-center justify-center gap-6 text-white/95 font-medium ${visibleSections['cta'] ? 'animate-fade-in-up delay-500' : ''}`}>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>90-Day Warranty</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Free Returns</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Certified Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}