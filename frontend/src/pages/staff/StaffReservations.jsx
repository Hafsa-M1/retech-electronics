// src/pages/staff/StaffReservations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffNavbar from '../../components/StaffNavbar';
import { FaCalendarAlt, FaUser, FaSync, FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function StaffReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Notification State
  const [notification, setNotification] = useState({
    show: false,
    type: '', // 'success' or 'error'
    message: ''
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('staffToken');
      const response = await axios.get(
        'http://localhost:8000/api/submissions/admin/reservations/',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(Array.isArray(response.data) ? response.data : response.data.results || []);
      setError('');
    } catch (err) {
      console.error('Failed to load reservations', err);
      setError('Unable to load current reservations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsSold = async (reservationId) => {
    if (!reservationId) return;

    setProcessingId(reservationId);

    try {
      const token = localStorage.getItem('staffToken');
      await axios.post(
        `http://localhost:8000/api/submissions/admin/reservations/${reservationId}/complete/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove from list
      setReservations(prev => prev.filter(r => r.id !== reservationId));

      // Show success notification
      setNotification({
        show: true,
        type: 'success',
        message: '✅ Reservation marked as sold successfully!'
      });

    } catch (err) {
      console.error(err);
      setNotification({
        show: true,
        type: 'error',
        message: '❌ Failed to mark as sold. Please try again.'
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Auto hide notification after 4 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNavbar />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Reservations</h1>
              <p className="text-gray-600 mt-2">
                Manage customer reservations for certified devices
              </p>
            </div>

            <button
              onClick={fetchReservations}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 transition font-medium shadow-sm"
            >
              <FaSync className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium shadow-md transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {notification.type === 'success' ? (
                <FaCheckCircle className="text-xl" />
              ) : (
                <FaTimesCircle className="text-xl" />
              )}
              <p>{notification.message}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
                <p className="mt-6 text-gray-600 text-lg">Loading reservations...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-12 text-center">
              <p className="text-red-700 text-xl">{error}</p>
              <button
                onClick={fetchReservations}
                className="mt-6 px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-3xl shadow p-16 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FaCalendarAlt className="text-5xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Reservations Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                When customers reserve devices from the catalog, they will appear here for you to manage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-8">
                    {/* Device Info */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        📱
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {reservation.device.brand} {reservation.device.model}
                          </h3>
                          <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            CERTIFIED
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {reservation.device.category} • Cert ID: {reservation.device.certificate_id || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <p className="text-sm text-gray-500">Estimated Price</p>
                      <p className="text-4xl font-bold text-emerald-600">
                        Rs. {reservation.device.estimated_price ? Number(reservation.device.estimated_price).toLocaleString() : '—'}
                      </p>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <FaUser className="text-emerald-600" />
                        <p className="font-semibold text-gray-900 text-lg">Reserving Customer</p>
                      </div>
                      <p className="text-xl font-medium text-gray-900">
                        {reservation.customer_name}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <FaPhone className="text-sm" />
                        {reservation.customer_email}
                      </p>
                    </div>

                    {/* Reservation Details */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="text-gray-500">Reserved On</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {new Date(reservation.reserved_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium text-emerald-600 mt-1">Active Reservation</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="border-t border-gray-100 bg-gray-50 px-8 py-5">
                    <button
                      onClick={() => markAsSold(reservation.id)}
                      disabled={processingId === reservation.id}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-2xl font-medium transition flex items-center justify-center gap-2"
                    >
                      {processingId === reservation.id ? (
                        <>Processing...</>
                      ) : (
                        <>✅ Mark as Sold</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}