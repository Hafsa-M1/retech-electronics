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
    photos: [],
    video: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError('Maximum 4 photos allowed');
      return;
    }
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file is too large (max 50MB allowed)');
        e.target.value = '';
        return;
      }
      setFormData((prev) => ({ ...prev, video: file }));
      setError('');
    } else {
      // If user clears the file input
      setFormData((prev) => ({ ...prev, video: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    setSuccess('');

    // Client-side required fields
    const required = ['brand', 'model', 'condition_description'];
    const missing = required.filter((f) => !formData[f]?.trim());
    if (missing.length > 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('brand', formData.brand);
      data.append('model', formData.model);
      data.append('condition_description', formData.condition_description || 'No additional description');

      if (formData.serial_number?.trim()) {
        data.append('serial_number', formData.serial_number);
      }

      // Photos (multiple)
      formData.photos.forEach((photo) => {
        data.append('photo_files', photo);
      });

      // Video – ONLY append if a real file is selected
      if (formData.video instanceof File && formData.video.size > 0) {
        data.append('video', formData.video);
      }

      // Debug: log FormData contents
      console.log('Submitting FormData:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      const response = await axios.post(
        'http://localhost:8000/api/submissions/',
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('customerToken')}`,
          },
        }
      );

      setSuccess('Device submitted successfully! Redirecting...');
      setTimeout(() => navigate('/customer-my-devices'), 2000);

      // Clear form
      setFormData({
        brand: '',
        model: '',
        condition_description: '',
        serial_number: '',
        photos: [],
        video: null,
      });
    } catch (err) {
      console.error('Submission error:', err);

      let msg = 'Failed to submit device. Please try again.';
      const newFieldErrors = {};

      if (err.response?.status === 400 && err.response.data) {
        const data = err.response.data;
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            newFieldErrors[key] = data[key][0];
          }
        });

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
          msg = 'Please correct the highlighted fields.';
        } else if (data.detail) {
          msg = data.detail;
        } else if (data.non_field_errors) {
          msg = data.non_field_errors[0];
        }
      } else if (err.response) {
        msg = err.response.data?.detail || `Server error (${err.response.status})`;
      } else if (err.request) {
        msg = 'No response from server – check if backend is running.';
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomerNavbar />

      <div className="min-h-screen bg-gray-50 py-6 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Form Column */}
            <div className="lg:col-span-2 px-8 py-10">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Submit Your Device</h1>
                  <p className="text-gray-600 mb-6">Provide accurate details to help us evaluate and certify your device quickly.</p>
                </div>
                <div className="text-4xl">📤</div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`mt-1 block w-full rounded-lg border ${fieldErrors.brand ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2.5 px-4 transition-colors bg-white`}
                  placeholder="e.g. Apple, Samsung, Huawei"
                  required
                />
                {fieldErrors.brand && <p className="mt-1 text-sm text-red-600">{fieldErrors.brand}</p>}
              </div>

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
                  className={`mt-1 block w-full rounded-lg border ${fieldErrors.model ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2.5 px-4 transition-colors`}
                  placeholder="e.g. iPhone 13, Galaxy S22"
                  required
                />
                {fieldErrors.model && <p className="mt-1 text-sm text-red-600">{fieldErrors.model}</p>}
              </div>

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
                  className={`mt-1 block w-full rounded-lg border ${fieldErrors.condition_description ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-3 px-4 transition-colors`}
                  placeholder="e.g. Minor scratches on back, screen perfect, battery health 85%..."
                  required
                />
                {fieldErrors.condition_description && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.condition_description}</p>
                )}
              </div>

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
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2.5 px-4 transition-colors"
                  placeholder="e.g. F17KX123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos (up to 4)</label>
                <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Drag & drop photos here, or click to browse</p>
                  <input type="file" id="photos" accept="image/*" multiple onChange={handlePhotosChange} className="mx-auto" />
                  <p className="mt-2 text-xs text-gray-500">Max 4 photos • Each under 5MB</p>
                </div>
                {fieldErrors.photo_files && <p className="mt-1 text-sm text-red-600">{fieldErrors.photo_files}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional Video</label>
                <div className="mt-1 border border-gray-200 rounded-lg p-3 bg-white">
                  <input type="file" id="video" accept="video/*" onChange={handleVideoChange} />
                  <p className="mt-2 text-xs text-gray-500">Recommended: 10–60s • Max 50MB</p>
                </div>
                {fieldErrors.video && <p className="mt-1 text-sm text-red-600">{fieldErrors.video}</p>}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold transition-all duration-300 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Device for Evaluation'}
                </button>
              </div>
            </form>
            </div>

            {/* Sidebar Column */}
            <aside className="hidden lg:block lg:col-span-1 bg-gradient-to-b from-emerald-50 to-white p-6 border-l border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tips for a faster review</h3>
                <ul className="mt-3 text-sm text-gray-600 space-y-2">
                  <li>Include clear photos of front, back & ports.</li>
                  <li>Record a short video showing device power on.</li>
                  <li>Note any functional issues in the description.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">What we look for</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Battery health • Screen condition • Cameras</div>
                  <div>Buttons & ports • Sensors • Storage</div>
                </div>
              </div>

              <div className="mt-auto text-xs text-gray-500">
                Submitting accurate info speeds up certification and increases offer accuracy.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitDevice;