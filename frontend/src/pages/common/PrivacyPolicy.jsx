import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaShieldAlt, FaUserLock, FaDatabase, FaEye, FaCookieBite, FaExchangeAlt } from 'react-icons/fa';
import logo from "../../assets/retech-logo.png";
import privacyHero from "../../assets/images/privacy-hero.png";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview');

  // Setup scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Observe all sections with scroll-animation class
    document.querySelectorAll('.scroll-animation').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSection]);

  const policySections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: '🔒',
      description: 'How we protect your information'
    },
    {
      id: 'data-collection',
      title: 'Data Collection',
      icon: '📊',
      description: 'What information we collect'
    },
    {
      id: 'data-use',
      title: 'Data Use',
      icon: '💼',
      description: 'How we use your data'
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      icon: '🤝',
      description: 'When we share information'
    },
    {
      id: 'cookies',
      title: 'Cookies',
      icon: '🍪',
      description: 'Our cookie policy'
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: '⚖️',
      description: 'Your privacy rights'
    }
  ];

  const privacyPrinciples = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Data Security",
      description: "We implement industry-standard security measures to protect your personal information"
    },
    {
      icon: <FaUserLock className="w-8 h-8" />,
      title: "User Control",
      description: "You have control over your personal data and privacy settings"
    },
    {
      icon: <FaDatabase className="w-8 h-8" />,
      title: "Transparency",
      description: "We clearly communicate what data we collect and why"
    },
    {
      icon: <FaEye className="w-8 h-8" />,
      title: "Limited Access",
      description: "Only authorized personnel have access to sensitive data"
    }
  ];

  const cookieTypes = [
    {
      name: "Essential Cookies",
      purpose: "Required for basic site functionality",
      examples: "Login sessions, security, shopping cart",
      duration: "Session or persistent"
    },
    {
      name: "Analytics Cookies",
      purpose: "Help us understand how visitors use our site",
      examples: "Page visits, device information, referral sources",
      duration: "Up to 2 years"
    },
    {
      name: "Preference Cookies",
      purpose: "Remember your settings and preferences",
      examples: "Language, region, display settings",
      duration: "Up to 1 year"
    },
    {
      name: "Marketing Cookies",
      purpose: "Show relevant advertisements",
      examples: "Retargeting, interest-based ads",
      duration: "Up to 90 days"
    }
  ];

  const userRights = [
    {
      right: "Right to Access",
      description: "You can request a copy of the personal data we hold about you"
    },
    {
      right: "Right to Rectification",
      description: "You can request correction of inaccurate or incomplete data"
    },
    {
      right: "Right to Erasure",
      description: "You can request deletion of your personal data under certain circumstances"
    },
    {
      right: "Right to Restrict Processing",
      description: "You can request limitation of how we use your data"
    },
    {
      right: "Right to Data Portability",
      description: "You can receive your data in a structured, commonly used format"
    },
    {
      right: "Right to Object",
      description: "You can object to certain types of data processing"
    }
  ];

  const dataCollectionPoints = [
    {
      point: "Account Registration",
      data: "Name, email, phone number, business details"
    },
    {
      point: "Device Collection",
      data: "Pickup address, device details, condition assessment"
    }
  ];

  const dataRecipients = [
    {
      recipient: "Service Providers",
      purpose: "Payment processing,  technical support",
      protection: "Contractual data protection agreements"
    },
    {
      recipient: "Business Partners",
      purpose: "Device refurbishment, certification, quality control",
      protection: "Limited data sharing with strict agreements"
    },
    {
      recipient: "Legal Authorities",
      purpose: "Compliance with laws, fraud prevention, security",
      protection: "Only when legally required"
    },
    {
      recipient: "Analytics Providers",
      purpose: "Website optimization, user experience improvement",
      protection: "Anonymized data only"
    }
  ];

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
          <Link to="/privacy-policy" className="text-green-600 font-medium border-b-2 border-green-600 pb-1">Privacy Policy</Link>
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
      <header 
        className="relative pt-32 pb-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${privacyHero})`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Privacy <span className="text-emerald-200">Policy</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Protecting your data while enabling sustainable electronics commerce
          </p>
        </div>
      </header>

      {/* Privacy Principles */}
      <section className="py-16 px-4 -mt-10 scroll-animation opacity-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {privacyPrinciples.map((principle, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
                  {principle.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{principle.title}</h3>
                <p className="text-gray-600 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 scroll-animation opacity-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-xl p-2 sticky top-32">
                {policySections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${activeSection === section.id ? 'bg-gradient-to-r from-green-50 to-emerald-100 border-l-4 border-green-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{section.icon}</div>
                      <div>
                        <h3 className="font-bold text-gray-900">{section.title}</h3>
                        <p className="text-gray-600 text-sm">{section.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {activeSection === 'overview' && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy Overview</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        At ReTech, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform for electronic device refurbishment and commerce.
                      </p>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Our Commitment</h3>
                        <p className="text-gray-700 mb-4">
                          We believe in transparency and user control over personal data. As a platform connecting device collectors, refurbishers, and buyers, we handle various types of data with the utmost care and security.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>We only collect data necessary for platform functionality</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>We implement industry-standard security measures</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>We provide clear options to manage your privacy preferences</span>
                          </li>
                        </ul>
                      </div>


                    </div>
                  </div>
                )}

                {activeSection === 'data-collection' && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Data We Collect</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        We collect information that you provide directly to us, information about your use of our services, and information from third-party sources.
                      </p>

                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Collection Points</h3>
                        <div className="space-y-4">
                          {dataCollectionPoints.map((point, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                              <div className="font-bold text-gray-900 mb-2">{point.point}</div>
                              <div className="text-gray-600 text-sm">{point.data}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Device-Specific Information</h3>
                        <p className="text-gray-700 mb-4">
                          For refurbishment purposes, we may collect:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <FaExchangeAlt className="w-4 h-4 text-blue-600 mr-2" />
                            <span>Device serial numbers and specifications</span>
                          </li>
                          <li className="flex items-center">
                            <FaExchangeAlt className="w-4 h-4 text-blue-600 mr-2" />
                            <span>Condition assessments and repair history</span>
                          </li>
                          <li className="flex items-center">
                            <FaExchangeAlt className="w-4 h-4 text-blue-600 mr-2" />
                            <span>Certification and testing results</span>
                          </li>
                          <li className="flex items-center">
                            <FaExchangeAlt className="w-4 h-4 text-blue-600 mr-2" />
                            <span>Data wiping and security certification</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'data-use' && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Data</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        We use the information we collect for various business purposes described below.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl">
                          <div className="text-2xl mb-4">🛠️</div>
                          <h3 className="font-bold text-lg mb-3">Platform Operations</h3>
                          <ul className="space-y-2 text-green-100 text-sm">
                            <li>• Manage user accounts and authentication</li>
                            <li>• Process device collection and refurbishment</li>
                            <li>• Provide customer support</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-xl">
                          <div className="text-2xl mb-4">📈</div>
                          <h3 className="font-bold text-lg mb-3">Service Improvement</h3>
                          <ul className="space-y-2 text-cyan-100 text-sm">
                            <li>• Enhance platform features and usability</li>
                            <li>• Analyze usage patterns and preferences</li>
                            <li>• Develop new services and offerings</li>
                            <li>• Ensure platform security and reliability</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Basis for Processing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-gray-900 mb-2">Contractual Necessity</div>
                            <p className="text-gray-600 text-sm">To fulfill our service agreements</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-gray-900 mb-2">Legal Obligation</div>
                            <p className="text-gray-600 text-sm">To comply with applicable laws</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="font-bold text-gray-900 mb-2">Legitimate Interest</div>
                            <p className="text-gray-600 text-sm">To improve and secure our services</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'data-sharing' && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sharing and Disclosure</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        We may share your information in the following circumstances:
                      </p>

                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Data Recipients</h3>
                        <div className="space-y-4">
                          {dataRecipients.map((recipient, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                              <div className="font-bold text-gray-900 mb-2">{recipient.recipient}</div>
                              <div className="text-gray-600 text-sm mb-2">{recipient.purpose}</div>
                              <div className="text-green-600 text-xs font-medium">{recipient.protection}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Important Notes</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-gray-700">We never sell your personal information to third parties</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-red-600 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-gray-700">Business partner data sharing is strictly limited to operational requirements</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'cookies' && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        We use cookies and similar tracking technologies to enhance your experience on our platform.
                      </p>

                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Cookie Types</h3>
                        <div className="space-y-4">
                          {cookieTypes.map((cookie, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-gray-900">{cookie.name}</div>
                                <div className="text-sm text-gray-500">{cookie.duration}</div>
                              </div>
                              <div className="text-gray-700 text-sm mb-2">{cookie.purpose}</div>
                              <div className="text-gray-600 text-xs">Examples: {cookie.examples}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Cookie Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">Browser Settings</h4>
                            <p className="text-gray-600 text-sm">
                              Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect your ability to use certain features of our platform.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">Platform Controls</h4>
                            <p className="text-gray-600 text-sm">
                              You can manage your cookie preferences through our platform settings. Essential cookies cannot be disabled as they are required for basic functionality.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'rights' && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-6">
                        Depending on your location, you may have certain rights regarding your personal information.
                      </p>

                      <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userRights.map((right, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                              <div className="font-bold text-gray-900 mb-2">{right.right}</div>
                              <p className="text-gray-600 text-sm">{right.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white scroll-animation opacity-0">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Additional Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h3>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. The specific retention periods depend on:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Legal and regulatory requirements</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Business needs and service continuity</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Device warranty and certification periods</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Your account status and preferences</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Updates</h3>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes through:
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-green-700 font-medium">Email notification</span>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-green-700 font-medium">Platform announcement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Add Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .scroll-animation {
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .scroll-animation.animate-in {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .prose {
          color: #374151;
        }
        
        .prose p {
          margin-bottom: 1rem;
        }
        
        .prose ul {
          list-style-type: none;
          padding-left: 0;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}