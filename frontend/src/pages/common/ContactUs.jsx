import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUsers, FaTools, FaShippingFast } from 'react-icons/fa';
import logo from "../../assets/retech-logo.png";
import partnerHero from "../../assets/images/partner-hero.png";

export default function ContactUs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const contactInfo = [
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "General Inquiries",
      details: "info@retech.com",
      description: "For partnership and general questions"
    },
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: "Business Support",
      details: "+1 (555) 123-4567",
      description: "For shop owners and business partnerships"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Customer Support",
      details: "support@retech.com",
      description: "For device pickup and customer service"
    },
    {
      icon: <FaTools className="w-6 h-6" />,
      title: "Technical Support",
      details: "tech@retech.com",
      description: "For technical issues and platform support"
    }
  ];

  const businessTypes = [
    { value: "", label: "Select inquiry type" },
    { value: "shop_partnership", label: "Shop Partnership Inquiry" },
    { value: "device_pickup", label: "Schedule Device Pickup" },
    { value: "technical_support", label: "Technical Support" },
    { value: "business_integration", label: "Business Integration" },
    { value: "general", label: "General Inquiry" }
  ];

  const serviceAreas = [
    { area: "Device Collection", description: "Schedule pickup from your shop or home" },
    { area: "Quality Certification", description: "Get devices certified for resale" },
    { area: "Inventory Management", description: "Manage your refurbished inventory" },
    { area: "Business Dashboard", description: "Monitor sales and customer data" },
    { area: "Technical Training", description: "Learn refurbishment best practices" },
    { area: "Marketing Support", description: "Promote your refurbished products" }
  ];

  const faqs = [
    {
      question: "How can my shop partner with ReTech?",
      answer: "Any electronics shop can join our platform. We provide training, certification, and inventory management tools to help you refurbish and resell devices."
    },
    {
      question: "How does device collection work?",
      answer: "We partner with local shops to collect old devices from households. You can schedule pickups through our platform, and we handle the logistics and certification process."
    },
    {
      question: "What types of devices do you accept?",
      answer: "We accept smartphones, laptops, tablets, gaming consoles, and other consumer electronics. Devices should be complete (with batteries and chargers) for proper refurbishment."
    },
    {
      question: "How are refurbished devices certified?",
      answer: "All devices undergo rigorous 50+ point testing, data wiping, cosmetic refurbishment, and quality certification before being listed for sale on our platform."
    },
    {
      question: "What support do you provide to partner shops?",
      answer: "We offer technical training, marketing materials, inventory management tools, customer support, and access to our nationwide network of buyers."
    },
    {
      question: "How do payments work?",
      answer: "Partner shops receive payments for collected devices upfront, and earn commissions on refurbished sales. All transactions are processed securely through our platform."
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        inquiryType: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
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
          <Link to="/contact-us" className="text-green-600 font-medium border-b-2 border-green-600 pb-1">Partner With Us</Link>
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
      <header 
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: `url(${partnerHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50"></div>
        
        {/* Parallax effect */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center pt-8">
          <div className="animate-fade-in-down mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-500/30 border border-emerald-400/50 rounded-full text-emerald-200 text-sm font-semibold backdrop-blur-sm">
              PARTNERSHIP OPPORTUNITIES
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Partner <span className="text-emerald-300">With Us</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
            Connect with ReTech to transform electronic waste into sustainable business opportunities
          </p>
        </div>
      </header>

      {/* Contact Cards */}
      <section className="py-16 px-4 -mt-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{item.details}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Partnership Inquiry</h2>
                <p className="text-gray-600">
                  Interested in partnering with ReTech? Fill out this form and our business development team will contact you within 24 hours.
                </p>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 font-medium">Thank you! Our team will contact you shortly to discuss partnership opportunities.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business/Shop Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="ABC Electronics"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Inquiry *
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                  >
                    {businessTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    placeholder="Tell us about your business and how you'd like to partner with ReTech..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Request Partnership'
                  )}
                </button>
              </form>
            </div>

            {/* Services & Information */}
            <div className="space-y-8">
              {/* Services Overview */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Our Services for Partner Shops</h3>
                <p className="text-green-100 mb-8">
                  ReTech empowers electronics shops to participate in the circular economy with comprehensive support and tools.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serviceAreas.map((service, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="font-bold text-green-50 mb-1">{service.area}</div>
                      <div className="text-green-100 text-sm">{service.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">How ReTech Works</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Device Collection</h4>
                      <p className="text-gray-600 text-sm">Partner shops collect old devices from households in their area</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Quality Refurbishment</h4>
                      <p className="text-gray-600 text-sm">Devices are repaired, tested, and certified for resale</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Platform Listing</h4>
                      <p className="text-gray-600 text-sm">Certified devices are listed on our nationwide marketplace</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Revenue Sharing</h4>
                      <p className="text-gray-600 text-sm">Partner shops earn from device collection and refurbished sales</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Card */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Benefits for Partner Shops</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Additional revenue stream from device collection</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Access to nationwide refurbished electronics market</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Technical training and certification support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about partnering with ReTech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Q</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto">
              Join our network of partner shops and turn electronic waste into profitable, sustainable business opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/catalog"
                className="px-10 py-4 bg-white text-green-700 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Refurbished Catalog
              </Link>
              <button
                onClick={() => document.getElementById('name')?.focus()}
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Start Partnership Today
              </button>
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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}