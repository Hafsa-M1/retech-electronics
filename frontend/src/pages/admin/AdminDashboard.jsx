// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaMobileAlt, FaUsers, FaCheckCircle, FaClock,
  FaTimesCircle, FaSearch, FaEye, FaEdit, FaTrash,
} from "react-icons/fa";
import AdminNavbar from "../../components/AdminNavbar";

const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const STATUS_CFG = {
  PENDING:      { label: "Pending",      bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-400" },
  UNDER_REVIEW: { label: "Under Review", bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-400"   },
  APPROVED:     { label: "Approved",     bg: "bg-green-100",  text: "text-green-800",  dot: "bg-green-500"  },
  REJECTED:     { label: "Rejected",     bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-400"    },
};

const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = makeApi(token);
        const [statsRes, subsRes] = await Promise.all([
          api.get("/api/submissions/admin/stats/"),
          api.get("/api/submissions/admin/all/"),
        ]);
        setStats(statsRes.data);
        const all = Array.isArray(subsRes.data) ? subsRes.data : subsRes.data.results ?? [];
        setRecentSubmissions(all.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const statCards = [
    { title: "Total Submissions", value: stats?.total_submissions ?? "—", icon: <FaMobileAlt />, color: "bg-blue-500"   },
    { title: "Pending Review",    value: stats?.pending          ?? "—", icon: <FaClock />,      color: "bg-yellow-500" },
    { title: "Approved",          value: stats?.approved         ?? "—", icon: <FaCheckCircle />,color: "bg-green-500"  },
    { title: "Staff Accounts",    value: stats?.staff_count      ?? "—", icon: <FaUsers />,      color: "bg-purple-500" },
  ];

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-6">

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's what's happening with ReTech today.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl text-white text-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent submissions table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Device Submissions</h2>
                <p className="text-sm text-gray-500">Latest submissions awaiting review</p>
              </div>
              <Link
                to="/admin/submissions"
                className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1"
              >
                View All <span>→</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["Device", "Customer", "Submitted", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-700 font-bold">{sub.brand?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{sub.brand} {sub.model}</p>
                            <p className="text-xs text-gray-400">
                              {sub.photos?.length || 0} photo{sub.photos?.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{sub.customer_name || "—"}</p>
                        <p className="text-xs text-gray-400">{sub.customer_email || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(sub.submission_date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4"><Badge status={sub.status} /></td>
                      <td className="px-6 py-4">
                        <Link
                          to="/admin/submissions"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors w-fit"
                        >
                          <FaEye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentSubmissions.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">📱</div>
                  <p className="text-gray-500 font-medium">No submissions yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/submissions"
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-xl font-bold mb-2">Review Submissions</h3>
              <p className="text-white/80 mb-4 text-sm">Review pending device submissions and update their status</p>
              <span className="text-sm font-semibold">Go to Submissions →</span>
            </Link>

            <Link
              to="/admin/staff"
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-xl font-bold mb-2">Manage Staff</h3>
              <p className="text-white/80 mb-4 text-sm">Create and manage staff accounts with different roles</p>
              <span className="text-sm font-semibold">Manage Staff →</span>
            </Link>

            <Link
              to="/admin/devices"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="text-xl font-bold mb-2">Catalog Management</h3>
              <p className="text-white/80 mb-4 text-sm">Manage device listings and inventory in the public catalog</p>
              <span className="text-sm font-semibold">Manage Catalog →</span>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;