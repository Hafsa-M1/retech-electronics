import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerNavbar from '../../components/CustomerNavbar'; // Adjust path if needed

const SubmitDevice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    condition_description: '',
    serial_number: '',
    photos: [], // will handle files separately
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photos: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic client-side validation
    if (!formData.brand || !formData.model || !formData.condition_description) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Placeholder API call – backend endpoint doesn't exist yet
      const response = await axios.post(
        'http://localhost:8000/api/submissions/', // ← Update port if Django runs on different port
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('customerToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Device submitted successfully! Redirecting...');
      setTimeout(() => navigate('/customer-my-devices'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Failed to submit device. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar – same as dashboard */}
      <CustomerNavbar />

      {/* Main content – push down to avoid overlap with fixed navbar */}
      <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Submit Your Device</h1>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Please provide accurate details about the device you wish to submit for evaluation and potential refurbishment. 
              All submissions are reviewed by our team.
            </p>

            {/* Error / Success Messages */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2.5 px-4 border transition-colors"
                  placeholder="e.g. Apple, Samsung, Huawei"
                  required
                />
              </div>

              {/* Model */}
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2.5 px-4 border transition-colors"
                  placeholder="e.g. iPhone 13, Galaxy S22, Mate 50 Pro"
                  required
                />
              </div>

              {/* Condition Description */}
              <div>
                <label htmlFor="condition_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe the current condition <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="condition_description"
                  name="condition_description"
                  rows={5}
                  value={formData.condition_description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-3 px-4 border transition-colors"
                  placeholder="e.g. Minor scratches on back, screen perfect, battery health 85%, fully functional except charging port is loose..."
                  required
                />
              </div>

              {/* Serial Number / IMEI (optional) */}
              <div>
                <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number / IMEI (optional)
                </label>
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2.5 px-4 border transition-colors"
                  placeholder="e.g. F17KX123456789"
                />
              </div>

              {/* Photos */}
              <div>
                <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload photos (up to 4)
                </label>
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2.5 file:px-5
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-emerald-50 file:text-emerald-700
                    hover:file:bg-emerald-100
                    file:transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Max 4 photos • Each under 5MB • Good lighting, multiple angles recommended
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3.5 px-6 border border-transparent rounded-xl shadow-md text-white font-semibold text-base transition-all duration-300
                    ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Device for Evaluation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitDevice;