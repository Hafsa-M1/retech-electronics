import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaLock as FaLockIcon, FaCheck, FaTimes } from 'react-icons/fa';
import logo from "../../assets/retech-logo.png";

export default function CustomerLogin() {
  const navigate = useNavigate(); // Step 2: Initialize navigate

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const benefits = [
    { icon: "💰", title: "Best Prices", description: "Save up to 70% on certified devices" },
    { icon: "✅", title: "Certified Quality", description: "50+ point diagnostic tests" },
    { icon: "🛡️", title: "90-Day Warranty", description: "Full warranty on all purchases" },
    { icon: "⚡", title: "Fast Access", description: "Instant access to inventory" }
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Demo login validation
      if (formData.email === 'demo@error.com') {
        setLoginError('Invalid email or password. Please try again.');
        showNotification('error', 'Invalid email or password. Please try again.');
      } else {
        // Show success notification before redirecting
        showNotification('success', 'Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 1500);
      }
    }, 1500);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate password reset
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotPassword(false);
      showNotification('success', 'Password reset link has been sent to your email!');
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-50 via-white to-emerald-50">
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md h-20 flex items-center justify-between px-6 border-b border-gray-200 shadow-sm">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ReTech Logo" className="h-30 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <span className="text-gray-600 font-medium">New to ReTech?</span>
          <Link
            to="/customer-signup"
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20"
          >
            Create Account
          </Link>
        </div>
      </nav>

      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Left Side - Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors group">
                  <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Home</span>
                </Link>
              </div>

              {/* Form Header */}
              <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Back</span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Sign in to your account to continue trading refurbished electronics
                </p>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-800 font-medium">{loginError}</span>
                  </div>
                </div>
              )}

              {/* Login Form */}
              {!forgotPassword ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FaLock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Password"
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="w-5 h-5 text-emerald-600 bg-gray-50 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-gray-700">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </span>
                      ) : (
                        <>
                          <span>Log In</span>
                          <FaArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                // Forgot Password Form (unchanged)
                <form onSubmit={handleResetPassword}>
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-emerald-800 mb-2">Reset Your Password</h3>
                      <p className="text-emerald-700 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="resetEmail"
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setForgotPassword(false)}
                        className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-all duration-300"
                      >
                        Back to Login
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Reset Password'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/customer-signup" className="text-emerald-600 hover:text-emerald-700 font-bold underline">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="relative overflow-hidden rounded-3xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
              
              {/* Animated Background Elements */}
              <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Content */}
              <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">
                    Your Benefits
                  </h2>
                  
                  <p className="text-gray-300 text-base">
                    Continue your journey with certified refurbished electronics
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {benefit.icon}
                      </div>
                      <h3 className="text-sm font-bold mb-1 text-white">{benefit.title}</h3>
                      <p className="text-gray-400 text-xs">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-emerald-300">10K+</div>
                      <div className="text-xs text-gray-400">Active Users</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-300">98%</div>
                      <div className="text-xs text-gray-400">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-300">24/7</div>
                      <div className="text-xs text-gray-400">Support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-emerald-300">70%</div>
                      <div className="text-xs text-gray-400">Avg Savings</div>
                    </div>
                  </div>
                </div>

                {/* Quick Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-3">What happens when you sign in:</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-400/50">
                      <FaArrowRight className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-gray-300">Access your saved devices and wishlist</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-400/50">
                      <FaArrowRight className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-gray-300">View your order history and track shipments</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-400/50">
                      <FaArrowRight className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-gray-300">Manage your account settings and preferences</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-emerald-500/30 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-400/50">
                      <FaArrowRight className="w-3 h-3 text-emerald-300" />
                    </div>
                    <span className="text-gray-300">Get personalized recommendations</span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-10 pt-6 border-t border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/50">
                      <FaLockIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Secure Login</div>
                      <div className="text-sm text-gray-400">Your data is protected with 256-bit encryption</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (unchanged) */}
      <div className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            By signing in, you agree to our{' '}
            <Link to="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 underline">
              Privacy Policy
            </Link>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Need help?{' '}
            <Link to="/contact-us" className="text-emerald-600 hover:text-emerald-700 underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
