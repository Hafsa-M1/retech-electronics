// src/pages/admin/AdminStatistics.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import {
  FaUsers,
  FaMobileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaShieldAlt,
  FaStore,
  FaMicrochip,
  FaDatabase,
  FaRegStar,
  FaCalendarAlt,
  FaCrown,
  FaRegClock,
  FaRegChartBar,
} from "react-icons/fa";

const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const CATEGORY_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

export default function AdminStatistics() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState({ trend: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [hoveredCard, setHoveredCard] = useState(null);

  const token = localStorage.getItem("adminToken");

  const fetchStatistics = useCallback(async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    try {
      setLoading(true);
      const api = makeApi(token);
      const [statsRes, analyticsRes] = await Promise.all([
        api.get("/api/submissions/admin/stats/"),
        api.get(`/api/submissions/admin/analytics/?period=${selectedPeriod}`),
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      if (err.response?.status === 401) {
        // Token missing/expired/invalid — clear it and send back to login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        navigate("/admin/login");
        return;
      }
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, selectedPeriod, navigate]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const trendData = analytics.trend || [];
  const categoryData = analytics.categories || [];
  const totalCategoryCount = categoryData.reduce((sum, c) => sum + c.count, 0);

  const getMaxTrendValue = () => {
    if (trendData.length === 0) return 1;
    return Math.max(...trendData.map((t) => t.count), 1);
  };

  const StatCard = ({ title, value, icon, color, bgColor, index }) => (
    <div
      className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${bgColor}`}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${color} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}
          >
            {React.cloneElement(icon, { className: `w-6 h-6 ${color}` })}
          </div>
        </div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p
          className={`text-3xl font-bold ${color} transition-all duration-300 ${
            hoveredCard === index ? "scale-110 origin-left" : ""
          }`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );

  // Real trend bar chart — built from /admin/analytics/
  const TrendBarChart = () => {
    if (trendData.length === 0) {
      return (
        <div className="h-80 mt-4 flex items-center justify-center text-gray-400 text-sm">
          No submissions in this period yet.
        </div>
      );
    }
    const maxValue = getMaxTrendValue();
    return (
      <div className="h-80 mt-4">
        <div className="flex h-full items-end gap-2">
          {trendData.map((point, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-2 group"
            >
              <div className="relative w-full flex justify-center">
                <div
                  className="bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-700 cursor-pointer relative w-full max-w-[48px]"
                  style={{
                    height: `${Math.max((point.count / maxValue) * 250, 8)}px`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {point.count}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Real category pie chart — built from /admin/analytics/
  const CategoryPieChart = () => {
    if (categoryData.length === 0 || totalCategoryCount === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          No submissions yet.
        </div>
      );
    }

    let currentAngle = 0;
    const slices = categoryData.map((item, idx) => {
      const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
      const percentage = (item.count / totalCategoryCount) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + percentage;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 128 + 100 * Math.cos(startRad);
      const y1 = 128 + 100 * Math.sin(startRad);
      const x2 = 128 + 100 * Math.cos(endRad);
      const y2 = 128 + 100 * Math.sin(endRad);

      const largeArcFlag = percentage > 180 ? 1 : 0;

      return {
        ...item,
        color,
        path: `M 128 128 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      };
    });

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90">
            {slices.map((slice, idx) => (
              <path
                key={idx}
                d={slice.path}
                fill={slice.color}
                className="transition-opacity duration-300 cursor-pointer hover:opacity-80"
              />
            ))}
            <circle cx="128" cy="128" r="60" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {totalCategoryCount}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {slices.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-semibold text-gray-900">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaMicrochip className="text-indigo-400 w-8 h-8 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">
            Loading dashboard statistics...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Fetching latest device certification data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center border border-gray-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-red-600 w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchStatistics}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <FaSync className="inline mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <AdminNavbar />

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <FaCrown className="text-white w-5 h-5" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <FaRegClock className="w-4 h-4" />
                Device certification analytics & insights
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex bg-white rounded-xl shadow-md border border-gray-200 p-1">
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === period
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchStatistics}
                className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-gray-700"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              index={0}
              title="Total Submissions"
              value={stats?.total_submissions || 0}
              icon={<FaMobileAlt className="w-8 h-8" />}
              color="text-indigo-600"
              bgColor="hover:bg-indigo-50/50"
            />
            <StatCard
              index={1}
              title="Pending Review"
              value={stats?.pending || 0}
              icon={<FaClock className="w-8 h-8" />}
              color="text-amber-600"
              bgColor="hover:bg-amber-50/50"
            />
            <StatCard
              index={2}
              title="Certified Devices"
              value={stats?.certified || 0}
              icon={<FaCheckCircle className="w-8 h-8" />}
              color="text-emerald-600"
              bgColor="hover:bg-emerald-50/50"
            />
            <StatCard
              index={3}
              title="Published to Catalog"
              value={stats?.published_for_sale || 0}
              icon={<FaStore className="w-8 h-8" />}
              color="text-purple-600"
              bgColor="hover:bg-purple-50/50"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Submission Trends
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Submissions received over the selected period
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <FaRegChartBar className="text-indigo-600 w-5 h-5" />
                </div>
              </div>
              <TrendBarChart />
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Device Categories
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Breakdown by device category
                  </p>
                </div>
                <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <FaMicrochip className="text-purple-600 w-5 h-5" />
                </div>
              </div>
              <CategoryPieChart />
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              index={4}
              title="Total Customers"
              value={stats?.total_customers || 0}
              icon={<FaUsers className="w-8 h-8" />}
              color="text-blue-600"
              bgColor="hover:bg-blue-50/50"
            />
            <StatCard
              index={5}
              title="Staff Members"
              value={stats?.total_staff || 0}
              icon={<FaShieldAlt className="w-8 h-8" />}
              color="text-violet-600"
              bgColor="hover:bg-violet-50/50"
            />
            <StatCard
              index={6}
              title="Rejected Devices"
              value={stats?.rejected || 0}
              icon={<FaTimesCircle className="w-8 h-8" />}
              color="text-red-600"
              bgColor="hover:bg-red-50/50"
            />
          </div>

          {/* Detailed Report Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Detailed Report
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete breakdown of all submissions
                    </p>
                  </div>
                  <FaDatabase className="text-gray-400 w-5 h-5" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      {
                        label: "Total Submissions",
                        value: stats?.total_submissions,
                      },
                      { label: "Pending", value: stats?.pending },
                      { label: "Under Review", value: stats?.under_review },
                      { label: "Approved", value: stats?.approved },
                      { label: "Certified", value: stats?.certified },
                      { label: "Refurbishment", value: stats?.refurbishment },
                      { label: "Rejected", value: stats?.rejected },
                      {
                        label: "Published to Catalog",
                        value: stats?.published_for_sale,
                      },
                    ].map((item, index) => {
                      const percentage = stats?.total_submissions
                        ? (
                            ((item.value || 0) / stats.total_submissions) *
                            100
                          ).toFixed(1)
                        : "0";
                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            {item.label}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-900 text-lg">
                            {(item.value || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-sm text-gray-500 font-medium">
                                {percentage}%
                              </span>
                              <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Summary Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <FaStore className="text-purple-600 w-6 h-6" />
                  <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                    Market Ready
                  </span>
                </div>
                <p className="text-3xl font-bold text-purple-700">
                  {(stats?.published_for_sale || 0).toLocaleString()}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Devices available in catalog
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <FaRegStar className="text-blue-600 w-6 h-6" />
                  <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    Rejection Rate
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {stats?.total_submissions
                    ? Math.round(
                        ((stats?.rejected || 0) / stats.total_submissions) *
                          100,
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Of all submissions rejected
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm border-t border-gray-200 pt-6 gap-3">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="w-3 h-3" />
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}