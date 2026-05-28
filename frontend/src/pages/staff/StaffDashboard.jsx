// src/pages/staff/StaffDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMobileAlt, FaClock, FaCheckCircle, FaTimesCircle,
  FaHourglassHalf, FaEye, FaSearch, FaTimes, FaSync,
  FaSignOutAlt, FaImage, FaVideo, FaFilter,
} from "react-icons/fa";

import StaffNavbar from "../../components/StaffNavbar";

// ─── API helper ───────────────────────────────────────────────────────────────
const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

// ─── Status config ────────────────────────────────────────────────────────────
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
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, loading }) => (
  <div className={`${bg} rounded-xl p-5 border border-white/60`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        {loading
          ? <div className="h-8 w-12 bg-white/60 rounded animate-pulse" />
          : <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>}
      </div>
      <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </div>
);

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ submission, onClose, onStatusChange, token }) => {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(submission.status);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await makeApi(token).patch(
        `/api/submissions/admin/${submission.id}/update/`,
        { status: newStatus }
      );
      setCurrentStatus(newStatus);
      onStatusChange(submission.id, newStatus);
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-blue-700 font-bold text-lg">{submission.brand?.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{submission.brand} {submission.model}</h2>
              <p className="text-sm text-gray-400">Submission #{submission.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Device details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Device Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Brand",      submission.brand],
                ["Model",      submission.model],
                ["Serial No.", submission.serial_number || "Not provided"],
                ["Submitted",  new Date(submission.submission_date).toLocaleString()],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">{label}</p>
                  <p className="text-sm text-gray-900 font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer</h3>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {(submission.customer_name || submission.customer_email || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{submission.customer_name || "—"}</p>
                <p className="text-sm text-gray-500">{submission.customer_email || "—"}</p>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Condition Description</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{submission.condition_description}</p>
            </div>
          </div>

          {/* Photos & Video */}
          {submission.photos?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaImage className="text-gray-400" /> Photos ({submission.photos.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {submission.photos.map((photo) => (
                  <a key={photo.id} href={photo.image} target="_blank" rel="noreferrer">
                    <img src={photo.image} alt="Device" className="w-full h-36 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {submission.video && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaVideo className="text-gray-400" /> Video
              </h3>
              <video controls className="w-full rounded-xl border border-gray-200">
                <source src={submission.video} />
              </video>
            </div>
          )}

          {/* Status update */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Update Status</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-500">Current:</span>
              <Badge status={currentStatus} />
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <button
                  key={key}
                  disabled={updating || currentStatus === key}
                  onClick={() => updateStatus(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all
                    ${currentStatus === key
                      ? `${cfg.bg} ${cfg.text} border-transparent cursor-default`
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 cursor-pointer"}`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
const StaffDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("staffToken");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [staffName, setStaffName] = useState("Staff");

  // Redirect if no token
  useEffect(() => {
    if (!token) navigate("/staff/login");
  }, [token, navigate]);

  // Fetch current user name
  useEffect(() => {
    if (!token) return;
    makeApi(token).get("/api/users/me/")
      .then(({ data }) => setStaffName(data.first_name || "Staff"))
      .catch(() => {});
  }, [token]);

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = filter === "ALL"
        ? "/api/submissions/admin/all/"
        : `/api/submissions/admin/all/?status=${filter}`;
      const { data } = await makeApi(token).get(url);
      setSubmissions(Array.isArray(data) ? data : data.results ?? []);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleStatusChange = (id, newStatus) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffRefreshToken");
    navigate("/staff/login");
  };

  // Filtered submissions
  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    return (
      s.brand?.toLowerCase().includes(q) ||
      s.model?.toLowerCase().includes(q) ||
      s.customer_email?.toLowerCase().includes(q) ||
      s.customer_name?.toLowerCase().includes(q) ||
      s.serial_number?.toLowerCase().includes(q)
    );
  });

  const counts = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === "PENDING").length,
    under_review: submissions.filter(s => s.status === "UNDER_REVIEW").length,
    approved: submissions.filter(s => s.status === "APPROVED").length,
    rejected: submissions.filter(s => s.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Staff Navbar */}
      <StaffNavbar />

      {/* Main Content with padding for fixed navbar */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-6">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Device Submissions</h1>
            <p className="text-gray-500 mt-1 text-sm">Review and process incoming customer device submissions</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total",        value: counts.total,        icon: <FaMobileAlt />,    color: "bg-gray-500",   bg: "bg-gray-50",    key: "ALL"          },
              { label: "Pending",      value: counts.pending,      icon: <FaClock />,        color: "bg-yellow-500", bg: "bg-yellow-50",  key: "PENDING"      },
              { label: "Under Review", value: counts.under_review, icon: <FaHourglassHalf />,color: "bg-blue-500",   bg: "bg-blue-50",    key: "UNDER_REVIEW" },
              { label: "Approved",     value: counts.approved,     icon: <FaCheckCircle />,  color: "bg-green-500",  bg: "bg-green-50",   key: "APPROVED"     },
              { label: "Rejected",     value: counts.rejected,     icon: <FaTimesCircle />,  color: "bg-red-500",    bg: "bg-red-50",     key: "REJECTED"     },
            ].map(({ label, value, icon, color, bg, key }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`text-left rounded-xl p-4 border-2 transition-all
                  ${filter === key ? "border-blue-400 bg-white shadow-sm shadow-blue-100" : `border-transparent ${bg}`}`}
              >
                <div className={`${color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm mb-2`}>{icon}</div>
                <div className="text-xl font-bold text-gray-900">{loading ? "—" : value}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </button>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-base font-bold text-gray-800">
                {filter === "ALL" ? "All Submissions" : `${STATUS_CFG[filter]?.label} Submissions`}
                <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                  <input
                    type="text" placeholder="Search device, customer…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <FaTimes size={11} />
                    </button>
                  )}
                </div>
                <button onClick={fetchSubmissions} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                  <FaSync className={loading ? "animate-spin" : ""} size={13} />
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500 font-medium">
                  {search ? "No submissions match your search" : "No submissions found"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Device", "Customer", "Serial No.", "Submitted", "Status", "Action"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((sub, i) => (
                      <tr key={sub.id} className={`hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                        <td className="px-5 py-4 text-xs text-gray-400 font-mono">#{sub.id}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-700 font-bold text-xs">{sub.brand?.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{sub.brand} {sub.model}</p>
                              <p className="text-xs text-gray-400">
                                {sub.photos?.length || 0} photo{sub.photos?.length !== 1 ? "s" : ""}
                                {sub.video ? " · video" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">{sub.customer_name || "—"}</p>
                          <p className="text-xs text-gray-400">{sub.customer_email || "—"}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 font-mono">{sub.serial_number || "—"}</td>
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(sub.submission_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4"><Badge status={sub.status} /></td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(sub)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <FaEye size={11} /> Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info note */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            As a staff member you can review submissions and update their status. For account management, contact your administrator.
          </p>

        </div>
      </main>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          submission={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(id, status) => {
            handleStatusChange(id, status);
            setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
          }}
          token={token}
        />
      )}
    </div>
  );
};

export default StaffDashboard;