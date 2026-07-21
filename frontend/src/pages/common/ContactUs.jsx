
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from "../../assets/retech-logo.png";
import partnerHero from "../../assets/images/partner-hero.png";

export default function ContactUs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceAreas = [
    { area: "Device Collection",    description: "Collect devices for refurbishment and resale" },
    { area: "Quality Certification", description: "Get devices certified for resale" },
    { area: "Business Dashboard",   description: "Monitor sales and customer data" },
    { area: "Marketing Support",    description: "Promote your refurbished products" },
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
      answer: "Devices are certified after undergoing standardized diagnostic testing conducted by shop staff. Devices that successfully pass the required functional checks are issued a unique certification ID, which serves as verifiable proof of quality before being listed for sale."
    },
  ];

  const steps = [
    { num: "1", color: "from-green-500 to-emerald-500",   title: "Device Collection",    desc: "Partner shops collect old devices from households in their area" },
    { num: "2", color: "from-blue-500 to-cyan-500",       title: "Quality Refurbishment", desc: "Devices are repaired, tested, and certified for resale" },
    { num: "3", color: "from-purple-500 to-violet-500",   title: "Platform Listing",      desc: "Certified devices are listed on our nationwide marketplace" },
    { num: "4", color: "from-orange-500 to-red-500",      title: "Revenue Sharing",       desc: "Partner shops earn from device collection and refurbished sales" },
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-white">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-20 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center h-full -ml-4" style={{ marginTop: '4mm' }}>
          <img src={logo} alt="ReTech Logo" className="h-32 w-auto object-contain" />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/"               className="text-gray-700 hover:text-green-600 font-medium">Home</Link>
          <Link to="/about-us"       className="text-gray-700 hover:text-green-600 font-medium">About Us</Link>
          <Link to="/contact-us"     className="text-green-600 font-medium border-b-2 border-green-600 pb-1">Partner With Us</Link>
          <Link to="/privacy-policy" className="text-gray-700 hover:text-green-600 font-medium">Privacy Policy</Link>
          <Link to="/catalog"        className="text-gray-700 hover:text-green-600 font-medium">Browse Catalog</Link>
          <Link to="/customer-login" className="text-gray-700 hover:text-green-600 font-medium">Login</Link>
          <Link to="/customer-signup" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm">Sign Up</Link>
        </div>
        <button className="md:hidden text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <header
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ backgroundImage: `url(${partnerHero})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50" />
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
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

      {/* ── Contact + Services ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — Contact card + How it works */}
            <div className="flex flex-col gap-8">

              {/* Contact card */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Get In Touch</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Interested in partnering with ReTech? Reach out to our business development team and we'll get back to you within 24 hours.
                </p>

                {/* Email */}
                <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl mb-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email Us</p>
                    <a href="mailto:uomvms@gmail.com" className="text-lg font-bold text-green-700 hover:text-green-800 transition-colors">
                      uomvms@gmail.com
                    </a>
                    <p className="text-xs text-gray-400 mt-0.5">We respond within 24 hours</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Location</p>
                    <p className="text-sm text-gray-500">Sri Lanka</p>
                  </div>
                </div>      
              </div>

              {/* How It Works */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">How ReTech Works</h3>
                <div className="space-y-5">
                  {steps.map(({ num, color, title, desc }) => (
                    <div key={num} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold">{num}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-0.5">{title}</h4>
                        <p className="text-gray-500 text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Services + Benefits */}
            <div className="flex flex-col gap-8">

              {/* Services Overview */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">Our Services for Partner Shops</h3>
                <p className="text-green-100 mb-6 text-sm leading-relaxed">
                  ReTech empowers electronics shops to participate in the circular economy with comprehensive support and tools.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceAreas.map((service) => (
                    <div key={service.area} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="font-bold text-green-50 mb-1 text-sm">{service.area}</div>
                      <div className="text-green-100 text-xs">{service.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Benefits for Partner Shops</h3>
                <ul className="space-y-4">
                  {[
                    "Additional revenue stream from device collection",
                    "Access to nationwide refurbished electronics market",
                    "Device certification support",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
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
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">Q</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes fadeIn      { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0);  } }
        @keyframes fadeInDown  { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:translateY(0);  } }
        @keyframes fadeInUp    { from { opacity:0; transform:translateY(30px);  } to { opacity:1; transform:translateY(0);  } }
        .animate-fade-in       { animation: fadeIn      0.6s ease-out forwards; }
        .animate-fade-in-down  { animation: fadeInDown  0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .animate-fade-in-up    { animation: fadeInUp    0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; opacity:0; }
      `}</style>
    </div>
  );
}
