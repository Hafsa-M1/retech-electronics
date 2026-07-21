import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from "../../assets/retech-logo.png";
import aboutHeroImage from "../../assets/images/about-hero.png";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('mission');
  const [visibleSections, setVisibleSections] = useState({});
  const observerRefs = useRef({});

  const features = [
    {
      icon: "🎯",
      title: "Our Mission",
      description: "To create a trusted marketplace for refurbished electronics that promotes sustainability and makes technology accessible to everyone."
    },
    {
      icon: "♻️",
      title: "Sustainability",
      description: "Extending device lifespans and reducing electronic waste through quality refurbishment and responsible recycling."
    },
    {
      icon: "🔒",
      title: "Quality Assurance",
      description: "Every device undergoes rigorous testing, certification, and comes with a warranty for customer peace of mind."
    },
    {
      icon: "💰",
      title: "Affordable Tech",
      description: "Making high-quality electronics accessible with prices up to 70% lower than new devices."
    }
  ];

  const keyFeatures = [
    "Advanced product catalog",
    "Secure user authentication",
    "Customer support system",
    "Device certification process",
  ];

  const technologies = [
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
    { name: "Django", color: "bg-green-100 text-green-800" },
    { name: "Django REST", color: "bg-emerald-100 text-emerald-800" },
    { name: "PostgreSQL", color: "bg-indigo-100 text-indigo-800" },
    { name: "JWT Auth", color: "bg-yellow-100 text-yellow-800" },
    { name: "REST API", color: "bg-purple-100 text-purple-800" },
    { name: "Responsive Design", color: "bg-pink-100 text-pink-800" }
  ];

  // Intersection Observer for scroll animations
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

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
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

        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }

        .hover-lift {
          transition: all 0.3s ease-out;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .tab-content {
          animation: fadeInUp 0.5s ease-out forwards;
        }

        /* Scroll animation states */
        .scroll-hidden {
          opacity: 0;
          transform: translateY(50px);
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

        /* Stagger effect for list items */
        .scroll-item-1 { transition-delay: 0.1s; }
        .scroll-item-2 { transition-delay: 0.2s; }
        .scroll-item-3 { transition-delay: 0.3s; }
        .scroll-item-4 { transition-delay: 0.4s; }
        .scroll-item-5 { transition-delay: 0.5s; }
        .scroll-item-6 { transition-delay: 0.6s; }

        /* Feature cards */
        .feature-card {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .feature-card-visible {
          opacity: 1;
          transform: scale(1);
        }

        .feature-card:nth-child(1) { transition-delay: 0.1s; }
        .feature-card:nth-child(2) { transition-delay: 0.2s; }
        .feature-card:nth-child(3) { transition-delay: 0.3s; }
        .feature-card:nth-child(4) { transition-delay: 0.4s; }
      `}</style>

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
          <Link to="/about-us" className="text-green-600 font-medium border-b-2 border-green-600 pb-1">About Us</Link>
          <Link to="/contact-us" className="text-gray-700 hover:text-green-600 font-medium">Partner With Us</Link>
          <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 font-medium">Privacy Policy</Link>
          <Link to="/catalog" className="text-gray-700 hover:text-green-600 font-medium">Browse Catalog</Link>
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
      <header className="relative min-h-[60vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutHeroImage})` }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl animate-fade-in-down">
            About <span className="text-emerald-300">ReTech</span>
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30 animate-fade-in-up delay-200">
            <p className="text-lg text-white font-medium">
              Sustainable Electronics Marketplace
            </p>
          </div>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg animate-fade-in-up delay-400">
            Transforming the way people buy and sell refurbished electronics
          </p>
        </div>
      </header>

      {/* Platform Introduction */}
      <section className="py-20 px-4" data-scroll-section id="intro">
        <div className="container mx-auto max-w-6xl">
          <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl hover-lift scroll-hidden ${visibleSections['intro'] ? 'scroll-visible' : ''}`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className={`md:w-2/3 ${visibleSections['intro'] ? 'animate-fade-in-left delay-200' : ''}`}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  The ReTech Platform
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  ReTech is a comprehensive e-commerce platform dedicated to refurbished electronics. We connect buyers with certified, high-quality refurbished devices while promoting sustainability and reducing electronic waste.
                </p>
                
              </div>
              <div className={`md:w-1/3 ${visibleSections['intro'] ? 'animate-fade-in-right delay-200' : ''}`}>
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-8 rounded-2xl text-center shadow-lg hover-lift animate-bounce-in delay-300">
                  <div className="text-4xl mb-4">♻️</div>
                  <h3 className="text-xl font-bold mb-2">Sustainable Choice</h3>
                  <p className="text-green-100">Every purchase helps reduce e-waste</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 px-4" data-scroll-section id="tabs">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Tabs */}
            <div className={`md:w-2/5 scroll-hidden ${visibleSections['tabs'] ? 'scroll-visible' : ''}`}>
              <div className="bg-white rounded-2xl shadow-xl p-2 sticky top-32">
                {[
                  { id: 'mission', label: 'Our Mission', icon: '🎯' },
                  { id: 'tech', label: 'Technology', icon: '💻' },
                  { id: 'features', label: 'Platform Features', icon: '📋' }
                ].map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-6 rounded-xl transition-all hover-lift animate-fade-in-up scroll-item-hidden scroll-item-${index + 1} ${visibleSections['tabs'] ? 'scroll-item-visible' : ''} ${activeTab === tab.id ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-green-600 text-white scale-110' : 'bg-gray-100 text-gray-600'}`}>
                        {tab.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{tab.label}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {tab.id === 'mission' && 'Values and goals'}
                          {tab.id === 'tech' && 'Built with modern tech'}
                          {tab.id === 'features' && 'What makes us unique'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Content */}
            <div className={`md:w-3/5 scroll-hidden ${visibleSections['tabs'] ? 'scroll-visible' : ''}`}>
              <div className="bg-white rounded-2xl shadow-xl p-8 hover-lift">
                {activeTab === 'mission' && (
                  <div className="tab-content">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-down">Our Mission & Values</h2>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up delay-100">
                        At ReTech, we're driven by a dual mission: to make quality electronics accessible to everyone while promoting environmental sustainability through responsible consumption.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                          <div 
                            key={index} 
                            className={`feature-card bg-white border border-gray-200 rounded-xl p-6 hover-lift ${visibleSections['tabs'] ? 'feature-card-visible' : ''}`}
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                          >
                            <div className="text-3xl mb-4">
                              {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl hover-lift animate-fade-in-up delay-500">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Promise:</h3>
                        <p className="text-gray-700">
                          Every device sold on ReTech undergoes 50+ point diagnostic tests, professional refurbishment, and comes with a minimum 90-day warranty. We stand behind every product we sell.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="tab-content">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-down">Built With Modern Technology</h2>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up delay-100">
                        ReTech is built on a robust, scalable technology stack designed to provide a seamless shopping experience while ensuring security and reliability.
                      </p>
                      
                      <div className="mb-8 animate-fade-in-up delay-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Stack:</h3>
                        <div className="flex flex-wrap gap-3">
                          {technologies.map((tech, index) => (
                            <span 
                              key={index} 
                              className={`px-4 py-2 rounded-full text-sm font-medium ${tech.color} hover-lift ${visibleSections['tabs'] ? 'animate-scale-in' : ''}`} 
                              style={{ animationDelay: `${0.2 + index * 0.08}s` }}
                            >
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="tab-content">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-down">Platform Features</h2>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up delay-100">
                        ReTech offers a comprehensive set of features designed to make buying and selling refurbished electronics safe, easy, and enjoyable.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {keyFeatures.map((feature, index) => (
                          <div 
                            key={index} 
                            className={`bg-white border border-gray-200 rounded-xl p-4 hover-lift flex items-start space-x-3 ${visibleSections['tabs'] ? 'animate-fade-in-left' : ''}`}
                            style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                          >
                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              ✓
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ReTech */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white" data-scroll-section id="why">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 scroll-hidden ${visibleSections['why'] ? 'scroll-visible' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-green-600">ReTech</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The smart choice for refurbished electronics
            </p>
          </div>

          <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 scroll-hidden ${visibleSections['why'] ? 'scroll-visible' : ''}`}>
            <div className={`bg-white rounded-2xl p-8 shadow-xl hover-lift animate-fade-in-up ${visibleSections['why'] ? 'animate-fade-in-up delay-100' : ''}`}>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Save Money</h3>
              <p className="text-gray-600">
                Get premium devices at up to 70% off retail prices without compromising on quality or performance.
              </p>
            </div>

            <div className={`bg-white rounded-2xl p-8 shadow-xl hover-lift animate-fade-in-up ${visibleSections['why'] ? 'animate-fade-in-up delay-300' : ''}`}>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                ♻️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Help The Planet</h3>
              <p className="text-gray-600">
                Every purchase reduces electronic waste and supports the circular economy. Choose sustainability without sacrifice.
              </p>
            </div>

            <div className={`bg-white rounded-2xl p-8 shadow-xl hover-lift animate-fade-in-up ${visibleSections['why'] ? 'animate-fade-in-up delay-500' : ''}`}>
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shop With Confidence</h3>
              <p className="text-gray-600">
                All devices are certified and tested. Your satisfaction is our priority.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className={`text-center mt-16 animate-fade-in-up delay-700 ${visibleSections['why'] ? 'animate-fade-in-up' : ''}`}>
            <Link
              to="/customer-signup"
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Join ReTech Today
            </Link>
            <p className="text-gray-600 mt-4">
              Start shopping sustainable electronics or become a seller
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}