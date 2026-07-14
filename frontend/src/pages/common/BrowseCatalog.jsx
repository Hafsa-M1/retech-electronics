// src/pages/common/BrowseCatalog.jsx
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSync } from "react-icons/fa";

export default function Catalog() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Get category from URL query parameter
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  // Fetch Published Devices
  const fetchPublishedDevices = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await axios.get(
        "http://localhost:8000/api/submissions/public/catalog/",
      );
      setDevices(
        Array.isArray(response.data)
          ? response.data
          : (response.data.results ?? []),
      );
    } catch (err) {
      console.error("Failed to fetch catalog devices", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPublishedDevices();
  }, [fetchPublishedDevices]);

  // Filter & Sort
  const filteredDevices = devices
    .filter((device) => {
      const query = searchQuery.toLowerCase().trim();

      // Category Filter from URL (?category=Smartphone)
      const matchesCategory =
        !selectedCategory ||
        (device.category &&
          device.category.toLowerCase() === selectedCategory.toLowerCase());

      // Search Filter
      const matchesSearch =
        !query ||
        (device.brand?.toLowerCase() || "").includes(query) ||
        (device.model?.toLowerCase() || "").includes(query);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low")
        return (a.estimated_price || 0) - (b.estimated_price || 0);
      if (sortBy === "price-high")
        return (b.estimated_price || 0) - (a.estimated_price || 0);
      return new Date(b.submission_date) - new Date(a.submission_date);
    });

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="relative pt-24 pb-20 bg-gradient-to-br from-gray-900 to-emerald-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Certified Catalog
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Quality refurbished electronics — Certified and Ready for you
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Available Devices
          </h2>

          {selectedCategory && (
            <p className="text-emerald-600 font-medium">
              Showing <span className="font-semibold">{selectedCategory}s</span>{" "}
              •{" "}
              <button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-gray-700 underline ml-2"
              >
                Clear Filter
              </button>
            </p>
          )}

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-5 py-3 border border-gray-300 rounded-xl w-80 focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={() => fetchPublishedDevices(false)}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FaSync className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-600">
            Loading published devices...
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No devices have been published to the catalog yet.
            <br />
            Staff needs to certify and publish devices first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {device.photos && device.photos.length > 0 ? (
                    <img
                      src={device.photos[0].image}
                      alt={device.brand}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">📱</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg leading-tight">
                      {device.brand} {device.model}
                    </h3>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                      CERTIFIED
                    </span>
                  </div>

                  {device.certificate_id && (
                    <p className="text-xs text-gray-500 mb-3">
                      Cert ID: {device.certificate_id}
                    </p>
                  )}

                  {device.category && (
                    <p className="text-sm text-gray-600 mb-4">
                      {device.category}
                    </p>
                  )}

                  <div className="text-3xl font-bold text-emerald-600 mb-5">
                    {device.estimated_price
                      ? `LKR ${Number(device.estimated_price).toLocaleString()}`
                      : "—"}
                  </div>

                  <Link
                    to={`/device/${device.id}`}
                    className="block w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
