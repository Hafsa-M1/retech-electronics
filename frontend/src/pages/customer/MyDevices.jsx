import React from 'react';
import { Link } from 'react-router-dom';              // ← FIXED: import Link
import CustomerNavbar from '../../components/CustomerNavbar'; // adjust path if needed

export default function MyDevices() {
  return (
    <>
      <CustomerNavbar />

      <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Devices</h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <p className="text-xl text-gray-600 mb-6">
              Your submitted devices will appear here.
            </p>

            {/* Placeholder for future list */}
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                No devices submitted yet.
              </p>
              <Link
                to="/customer-submit-device"
                className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                Submit a New Device
              </Link>
            </div>

            {/* TODO later: Fetch and show list of submissions */}
          </div>
        </div>
      </div>
    </>
  );
}