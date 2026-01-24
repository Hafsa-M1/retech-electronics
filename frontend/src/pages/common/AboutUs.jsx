import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import logo from "../../assets/retech-logo.png";
import aboutHeroImage from "../../assets/images/about-hero.png";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('mission');
  const [visibleSections, setVisibleSections] = useState({});
  const observerRefs = useRef({});

  const projectDetails = {
    studentName: "Hafsa Mushtaq",
    university: "University of Moratuwa",
    course: "B.Sc. (Hons) in Information Technology and Management",
    projectLevel: "Level 3 Individual Project",
    academicYear: "2025-2026"
  };

  const features = [
    {
      icon: "🎯",
      title: "Project Mission",
      description: "To develop a full-stack e-commerce platform for refurbished electronics that promotes sustainability and accessibility."
    },
    {
      icon: "🎓",
      title: "Academic Focus",
      description: "Combining React frontend, Django backend, and PostgreSQL database to demonstrate comprehensive software development skills."
    },
    {
      icon: "♻️",
      title: "Sustainability Goal",
      description: "Promoting circular economy by extending device lifespans and reducing electronic waste."
    },
    {
      icon: "💻",
      title: "Technical Stack",
      description: "Modern web technologies including React, Tailwind CSS, Django REST Framework, and PostgreSQL."
    }
  ];

  const projectObjectives = [
    "Develop a responsive e-commerce platform with user authentication",
    "Implement product catalog with filtering and search functionality",
    "Create admin dashboard for inventory management",
    "Build secure payment gateway integration",
    "Design intuitive user interface with modern UX principles",
    "Implement order tracking and customer management system"
  ];

  const technologies = [
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
    { name: "Django", color: "bg-green-100 text-green-800" },
    { name: "Django REST", color: "bg-emerald-100 text-emerald-800" },
    { name: "PostgreSQL", color: "bg-indigo-100 text-indigo-800" },
    { name: "Vite", color: "bg-purple-100 text-purple-800" },
    { name: "JWT Auth", color: "bg-yellow-100 text-yellow-800" },
    { name: "Git", color: "bg-gray-100 text-gray-800" }
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

    // Observe all sections
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

        .animate-rotate-in {
          animation: rotateIn 0.6s ease-out forwards;
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
      `}</style>

      {/* Navbar - Same as Home */}
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

      {/* Hero Section with Image Background */}
      <header className="relative min-h-[60vh] pt-32 pb-20 flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutHeroImage})` }}
        />
        
        {/* Dark Overlay for better text readability */}
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
              {projectDetails.projectLevel} • {projectDetails.university}
            </p>
          </div>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg animate-fade-in-up delay-400">
            A Sustainable E-Commerce Platform for Refurbished Electronics
          </p>
        </div>
      </header>

      {/* Project Introduction */}
      <section className="py-20 px-4" data-scroll-section id="intro">
        <div className="container mx-auto max-w-6xl">
          <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl hover-lift scroll-hidden ${visibleSections['intro'] ? 'scroll-visible' : ''}`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className={`md:w-2/3 ${visibleSections['intro'] ? 'animate-fade-in-left delay-200' : ''}`}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Project Overview
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  ReTech is a comprehensive full-stack e-commerce platform developed as part of my Level 3 Individual Project at the University of Moratuwa. This project demonstrates the application of modern web development technologies to create a sustainable marketplace for refurbished electronics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`bg-white p-4 rounded-xl shadow-sm hover-lift scroll-item-hidden scroll-item-1 ${visibleSections['intro'] ? 'scroll-item-visible' : ''}`}>
                    <div className="font-bold text-gray-900">Student</div>
                    <div className="text-green-600 font-medium">{projectDetails.studentName}</div>
                  </div>
                  <div className={`bg-white p-4 rounded-xl shadow-sm hover-lift scroll-item-hidden scroll-item-2 ${visibleSections['intro'] ? 'scroll-item-visible' : ''}`}>
                    <div className="font-bold text-gray-900">Course</div>
                    <div className="text-green-600 font-medium">{projectDetails.course}</div>
                  </div>
                </div>
              </div>
              <div className={`md:w-1/3 ${visibleSections['intro'] ? 'animate-fade-in-right delay-200' : ''}`}>
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-8 rounded-2xl text-center shadow-lg hover-lift animate-bounce-in delay-300">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-xl font-bold mb-2">Academic Project</h3>
                  <p className="text-green-100">Demonstrating Full-Stack Development Skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section - Mission & Technical Details */}
      <section className="py-20 px-4" data-scroll-section id="tabs">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Tabs */}
            <div className={`md:w-2/5 scroll-hidden ${visibleSections['tabs'] ? 'scroll-visible' : ''}`}>
              <div className="bg-white rounded-2xl shadow-xl p-2 sticky top-32">
                {[
                  { id: 'mission', label: 'Project Mission', icon: '🎯' },
                  { id: 'tech', label: 'Technical Stack', icon: '💻' },
                  { id: 'features', label: 'Key Features', icon: '📋' }
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
                          {tab.id === 'mission' && 'Goals and objectives'}
                          {tab.id === 'tech' && 'Technologies used'}
                          {tab.id === 'features' && 'Project deliverables'}
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-down">Project Mission & Objectives</h2>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up delay-100">
                        The primary mission of ReTech is to create an innovative e-commerce solution that addresses both technological requirements and environmental concerns in the electronics industry.
                      </p>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl hover-lift animate-fade-in-up delay-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Objectives:</h3>
                        <ul className="space-y-3">
                          {projectObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start animate-fade-in-left scroll-item-hidden" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                              <svg className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl hover-lift animate-fade-in-up delay-500">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Outcomes:</h3>
                        <p className="text-gray-700">
                          This project demonstrates proficiency in full-stack development, database design, API integration, user experience design, and project management—skills essential for modern web development careers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="tab-content">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-down">Technical Architecture</h2>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up delay-100">
                        ReTech is built using a modern MERN-like stack with Django as the backend, providing a robust and scalable architecture for e-commerce applications.
                      </p>
                      
                      <div className="mb-8 animate-fade-in-up delay-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Stack:</h3>
                        <div className="flex flex-wrap gap-3">
                          {technologies.map((tech, index) => (
                            <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${tech.color} hover-lift animate-scale-in scroll-item-hidden`} style={{ animationDelay: `${0.2 + index * 0.08}s` }}>
                              {tech.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white hover-lift animate-fade-in-left delay-400 scroll-item-hidden">
                          <div className="text-3xl mb-2">⚛️</div>
                          <h4 className="font-bold text-lg">Frontend</h4>
                          <ul className="mt-3 space-y-2 text-sm">
                            <li>• React with Hooks & Context API</li>
                            <li>• Tailwind CSS for styling</li>
                            <li>• React Router for navigation</li>
                            <li>• Responsive design</li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white hover-lift animate-fade-in-right delay-400 scroll-item-hidden">
                          <div className="text-3xl mb-2">🐍</div>
                          <h4 className="font-bold text-lg">Backend</h4>
                          <ul className="mt-3 space-y-2 text-sm">
                            <li>• Django REST Framework</li>
                            <li>• JWT Authentication</li>
                            <li>• PostgreSQL Database</li>
                            <li>• RESTful API Design</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="tab-content">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in-down">System Features</h2>
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up delay-100">
                        The ReTech platform includes comprehensive features for both customers and administrators, creating a complete e-commerce ecosystem.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover-lift animate-bounce-in scroll-item-hidden" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                            <div className="text-3xl mb-4 animate-bounce">
                              {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl hover-lift animate-fade-in-up delay-600">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Additional Features:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            "User Authentication & Authorization",
                            "Product Catalog with Filters",
                            "Shopping Cart & Checkout",
                            "Order Management System"
                          ].map((feature, index) => (
                            <li key={index} className="flex items-center animate-fade-in-left scroll-item-hidden" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                              <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Project Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white" data-scroll-section id="why">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 scroll-hidden ${visibleSections['why'] ? 'scroll-visible' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why <span className="text-green-600">ReTech</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Addressing Real-World Problems Through Academic Excellence
            </p>
          </div>

          <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 hover-lift scroll-hidden ${visibleSections['why'] ? 'scroll-visible' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`${visibleSections['why'] ? 'animate-fade-in-left delay-300' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h3>
                <ul className="space-y-3">
                  {[
                    "Growing electronic waste with 53.6 million metric tons generated globally in 2019",
                    "High cost of new electronics limiting accessibility",
                    "Lack of trusted platforms for refurbished electronics"
                  ].map((problem, index) => (
                    <li key={index} className={`flex items-start scroll-item-hidden scroll-item-${index + 1} ${visibleSections['why'] ? 'scroll-item-visible' : ''}`}>
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        ⚠️
                      </div>
                      <span className="text-gray-700">{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${visibleSections['why'] ? 'animate-fade-in-right delay-300' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                <ul className="space-y-3">
                  {[
                    "Promoting circular economy through device refurbishment",
                    "Making technology accessible with affordable pricing",
                    "Building trust through quality assurance and warranties"
                  ].map((solution, index) => (
                    <li key={index} className={`flex items-start scroll-item-hidden scroll-item-${index + 1} ${visibleSections['why'] ? 'scroll-item-visible' : ''}`}>
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        ✅
                      </div>
                      <span className="text-gray-700">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      
    </div>
  );
}