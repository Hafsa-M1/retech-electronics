// src/pages/common/PublicDeviceDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function PublicDeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isReserving, setIsReserving] = useState(false);

  const isCustomerLoggedIn = !!localStorage.getItem('customerToken');

  const handleReserve = async () => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      setMessage({ type: 'error', text: 'Please login before reserving a device.' });
      return;
    }

    setIsReserving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        `http://localhost:8000/api/submissions/public/catalog/${id}/reserve/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: 'success', text: response.data.message || 'Device reserved successfully.' });
    } catch (err) {
      const serverMessage = err.response?.data?.error || 'Failed to reserve the device.';
      setMessage({ type: 'error', text: serverMessage });
      console.error(err);
    } finally {
      setIsReserving(false);
    }
  };

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/submissions/public/catalog/${id}/`
        );

        setDevice(response.data);
      } catch (err) {
        setError("Failed to load device details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading device details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  if (!device)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Device not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8"
        >
          <FaArrowLeft /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div className="bg-white rounded-3xl shadow-xl p-8 flex items-center justify-center min-h-[500px] border">
            {device.photos?.length > 0 ? (
              <img
                src={device.photos[0].image}
                alt={device.brand}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-9xl">📱</div>
            )}
          </div>

          {/* DETAILS */}
          <div>

            {/* CERTIFICATION HEADER */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                CERTIFIED
              </span>

              {device.certificate_id && (
                <span className="text-sm text-gray-500">
                  ID: {device.certificate_id}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {device.brand} {device.model}
            </h1>

            <p className="text-xl text-gray-600 mb-2">
              {device.category || "Certified Device"}
            </p>
            {device.serial_number && (
              <p className="text-sm text-gray-500 mb-4">
                Serial: {device.serial_number}
              </p>
            )}
            {device.condition_description && (
              <p className="text-gray-600 mb-6">
                {device.condition_description}
              </p>
            )}

            <div className="text-5xl font-bold text-emerald-600 mb-8">
              ₹{device.estimated_price
                ? Number(device.estimated_price).toLocaleString()
                : 'Contact for Price'}
            </div>

            {/*  DIAGNOSTIC RESULTS  */}
            <div className="bg-white p-5 rounded-2xl mb-6 border">
              <h3 className="text-lg font-semibold mb-4">
                Diagnostic Results
              </h3>

              {device.diagnostic_results && Object.keys(device.diagnostic_results).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(device.diagnostic_results).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
                      >
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                        {value ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <FaCheckCircle /> Pass
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <FaTimesCircle /> Fail
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No diagnostic data available. This device was published without a recorded diagnostic checklist.
                </p>
              )}
            </div>

            {/*  STAFF DIAGNOSTIC NOTES */}
            {device.diagnostic_notes && (
              <div className="bg-gray-50 p-5 rounded-2xl mb-6">
                <h4 className="font-medium mb-2">Diagnostic Notes</h4>
                <p className="text-gray-600 text-sm">
                  {device.diagnostic_notes}
                </p>
              </div>
            )}

            {/* CERTIFICATION NOTES */}
            {device.final_notes && (
              <div className="bg-gray-50 p-5 rounded-2xl mb-8">
                <h4 className="font-medium mb-2">Certification Notes</h4>
                <p className="text-gray-600 text-sm">
                  {device.final_notes}
                </p>
              </div>
            )}

            {/* RESERVE BUTTON */}
            {message.text && (
              <div className={`mb-4 rounded-2xl p-4 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-4">
              {isCustomerLoggedIn ? (
                <button
                  onClick={handleReserve}
                  disabled={isReserving}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-2xl"
                >
                  {isReserving ? 'Reserving...' : 'Reserve This Device'}
                </button>
              ) : (
                <Link
                  to="/customer-login"
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl text-center"
                >
                  Login to Reserve
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}