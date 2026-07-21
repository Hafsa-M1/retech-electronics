import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaCheck, FaBuilding, FaTimes } from 'react-icons/fa';
import logo from "../../assets/retech-logo.png";

export default function CustomerSignup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Account Details" },
    { number: 3, title: "Business Info" }
  ];

  const benefits = [
    { icon: "💰", title: "Exclusive Deals", description: "Get special prices on certified refurbished devices" },
    { icon: "🔧", title: "Quality Certification", description: "Diagnostic tests ensure device reliability" },
  ];

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  const hideNotification = () => {
    setNotification({ show: false, type: '', message: '' });
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email': {
        const trimmedValue = value?.trim() || '';
        if (!trimmedValue) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Email is invalid';
        return '';
      }
      case 'phone': {
        const trimmedValue = value?.trim() || '';
        if (!/^\d*$/.test(trimmedValue)) return 'Phone number must contain only digits';
        if (!trimmedValue) return 'Phone number is required';
        if (trimmedValue.length > 10) return 'Phone number must be at most 10 digits';
        return '';
      }
      default:
        return '';
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        const emailError = validateField('email', formData.email);
        if (emailError) newErrors.email = emailError;
        const phoneError = validateField('phone', formData.phone);
        if (phoneError) newErrors.phone = phoneError;
        break;
      case 2:
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 3:
        if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    if (name === 'email' || name === 'phone') {
      const nextValue = name === 'phone' ? fieldValue.replace(/\D/g, '').slice(0, 10) : fieldValue;
      setFormData(prev => ({
        ...prev,
        [name]: nextValue
      }));
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, nextValue)
      }));
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps before submitting
    const step1Valid = validateStep();
    if (!step1Valid) {
      if (errors.firstName || errors.lastName || errors.email || errors.phone) {
        setActiveStep(1);
        return;
      }
    }
    
    // Validate step 2
    const step2Valid = validateStep();
    if (!step2Valid) {
      if (errors.password || errors.confirmPassword) {
        setActiveStep(2);
        return;
      }
    }
    
    // Validate step 3
    const step3Valid = validateStep();
    if (!step3Valid) {
      if (errors.acceptTerms) {
        setActiveStep(3);
        return;
      }
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for backend
      const requestData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        business_name: formData.businessName || '',
      };

      const response = await fetch('http://127.0.0.1:8000/api/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show custom success notification
        showNotification('success', data.message || '🎉 Account created successfully! Welcome to ReTech!');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          businessName: '',
          acceptTerms: false
        });
        setActiveStep(1);
        
        // Redirect to login page after successful signup
        setTimeout(() => {
          navigate('/customer-login');
        }, 3000);
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach(key => {
            const fieldMap = {
              'first_name': 'firstName',
              'last_name': 'lastName',
              'business_name': 'businessName',
              'confirm_password': 'confirmPassword',
              'accept_terms': 'acceptTerms'
            };
            const frontendKey = fieldMap[key] || key;
            backendErrors[frontendKey] = data.errors[key].join(' ');
          });
          setErrors(backendErrors);
          
          // Determine which step to show based on errors
          if (backendErrors.firstName || backendErrors.lastName || backendErrors.email || backendErrors.phone) {
            setActiveStep(1);
          } else if (backendErrors.password || backendErrors.confirmPassword) {
            setActiveStep(2);
          } else if (backendErrors.acceptTerms || backendErrors.businessName) {
            setActiveStep(3);
          }
          
          // Show error notification
          showNotification('error', 'Please fix the errors in the form.');
        } else {
          showNotification('error', data.error || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'Something went wrong. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (activeStep < 3) {
        setActiveStep(activeStep + 1);
      }
    } else {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      showNotification('error', 'Please fix the errors before continuing.');
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      setErrors({});
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaUser className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.firstName}</p>}
              </div>
              
              <div className="relative">
                <FaUser className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.lastName}</p>}
              </div>
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
            </div>

            <div className="relative">
              <FaPhone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                required
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 ml-2">{errors.phone}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="relative">
              <FaLock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>}
              <div className="mt-2 text-xs text-gray-400">
                Password must contain at least 8 characters with uppercase, lowercase, and numbers
              </div>
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-4 h-4 rounded-full border ${formData.password.length >= 8 ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}></div>
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-4 h-4 rounded-full border ${/[A-Z]/.test(formData.password) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}></div>
                <span>One uppercase letter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-4 h-4 rounded-full border ${/[a-z]/.test(formData.password) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}></div>
                <span>One lowercase letter</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-4 h-4 rounded-full border ${/[0-9]/.test(formData.password) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}></div>
                <span>One number</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="relative">
              <FaBuilding className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Business/Shop Name (Optional)"
                className={`w-full pl-12 pr-4 py-4 bg-white/5 border ${errors.businessName ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
              />
              {errors.businessName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.businessName}</p>}
              <p className="text-xs text-gray-400 mt-2 ml-2">
                Optional: Provide if you're registering as a business
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className={`mt-1 w-5 h-5 text-emerald-600 bg-gray-800 ${errors.acceptTerms ? 'border-red-500' : 'border-gray-700'} rounded focus:ring-emerald-500 focus:ring-offset-gray-900`}
                required
              />
              <label className="text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/privacy-policy" className="text-emerald-400 hover:text-emerald-300 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy-policy" className="text-emerald-400 hover:text-emerald-300 underline">
                  Privacy Policy
                </Link>
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-xs mt-1 ml-2">{errors.acceptTerms}</p>}
            </div>

            {/* Note about pickup service */}
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
              <h3 className="text-blue-300 font-medium mb-2">📦 Pickup Service Information</h3>
              <p className="text-sm text-gray-300">
                Since we don't offer delivery, you'll need to pick up your purchases from our store location. 
                We'll contact you via email/phone for pickup arrangements after purchase.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-24 right-4 z-50 max-w-md ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        } text-white p-4 rounded-xl shadow-2xl animate-slide-in`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`mt-1 p-1 rounded-full ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                {notification.type === 'success' ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <FaTimes className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {notification.type === 'success' ? 'Success!' : 'Error!'}
                </p>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
            </div>
            <button
              onClick={hideNotification}
              className="text-white/80 hover:text-white ml-4"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full ${notification.type === 'success' ? 'bg-emerald-300' : 'bg-red-300'} animate-progress`}
              style={{ animationDuration: '5s' }}
            ></div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md h-20 flex items-center justify-between px-6 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="ReTech Logo"
            className="h-30 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/customer-login" className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all duration-300">
            Already have an account?
          </Link>
          <Link
            to="/customer-login"
            className="px-6 py-2.5 border border-emerald-500 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Side - Form */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700">
              {/* Progress Steps */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex flex-col items-center relative">
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step.number === activeStep 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' 
                          : step.number < activeStep 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                      }`}>
                        {step.number < activeStep ? (
                          <FaCheck className="w-5 h-5" />
                        ) : (
                          <span className="font-bold">{step.number}</span>
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium transition-colors ${
                        step.number === activeStep ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`absolute h-0.5 w-1/4 translate-x-12 mt-6 ${
                          step.number < activeStep ? 'bg-emerald-500' : 'bg-gray-700'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Header */}
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Join <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">ReTech</span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Create your account to start trading refurbished electronics
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="mt-10 flex gap-4">
                  {activeStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Back
                    </button>
                  )}
                  
                  {activeStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating Account...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  )}
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/customer-login" className="text-emerald-400 hover:text-emerald-300 font-medium underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/10"></div>
              
              {/* Animated Background Elements */}
              <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Content */}
              <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-center">
                <div className="mb-8">
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Why Join <span className="text-emerald-300">ReTech?</span>
                  </h2>
                  
                  <p className="text-gray-300 text-sm md:text-base">
                    Exclusive benefits and certified refurbished devices
                  </p>
                </div>

                {/* Benefits Grid - More Compact */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="text-2xl mb-2">{benefit.icon}</div>
                      <h3 className="text-sm font-bold text-white">{benefit.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                {/* What You Get - Minimal */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">Certified refurbished devices</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">Store pickup service only</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">24/7 customer support</span>
                  </div>
                </div>

                {/* Pickup Information */}
                <div className="mt-8 p-4 bg-emerald-900/20 border border-emerald-700/30 rounded-xl">
                  <h3 className="text-emerald-300 font-medium mb-2">📍 Store Pickup Only</h3>
                  <p className="text-sm text-gray-300">
                    All purchases require in-store pickup. Our location details will be provided after registration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="mt-2">Need help? <Link to="/contact-us" className="text-emerald-400 hover:text-emerald-300 underline">Contact Support</Link></p>
          <p className="mt-2 text-xs text-gray-500">Note: Delivery service is not available. All items require store pickup.</p>
        </div>
      </div>

      {/* Add Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-progress {
          animation: progress 5s linear forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(17, 24, 39, 0.5) inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        .progress-bar {
          width: ${((activeStep - 1) / (steps.length - 1)) * 100}%;
          transition: width 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}