// src/pages/admin/AdminSubmissions.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import {
  FaEye,
  FaSync,
  FaMobileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaTimes,
  FaImage,
  FaVideo,
} from "react-icons/fa";

// ─── helpers ─────────────────────────────────────────────────────────────────
const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const STATUS_CFG = {
  PENDING: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    dot: "bg-yellow-400",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-400",
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-400",
  },
};

const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ submission, onClose, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(submission.status);
  const token = localStorage.getItem("adminToken");

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await makeApi(token).patch(
        `/api/submissions/admin/${submission.id}/update/`,
        { status: newStatus },
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-lg">
                {submission.brand?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {submission.brand} {submission.model}
              </h2>
              <p className="text-sm text-gray-500">
                Submission #{submission.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Device Info */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Device Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Brand", submission.brand],
                ["Model", submission.model],
                ["Serial No.", submission.serial_number || "Not provided"],
                [
                  "Submitted",
                  new Date(submission.submission_date).toLocaleString(),
                ],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
                    {label}
                  </p>
                  <p className="text-sm text-gray-900 font-medium">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Customer
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {(submission.customer_name || submission.customer_email || "?")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {submission.customer_name || "—"}
                </p>
                <p className="text-sm text-gray-500">
                  {submission.customer_email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Condition Description
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {submission.condition_description}
              </p>
            </div>
          </div>

          {/* Photos */}
          {submission.photos?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaImage className="text-gray-400" />
                Photos ({submission.photos.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {submission.photos.map((photo) => (
                  <a
                    key={photo.id}
                    href={`http://localhost:8000${photo.image}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={`http://localhost:8000${photo.image}`}
                      alt="Device"
                      className="w-full h-36 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Video */}
          {submission.video && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaVideo className="text-gray-400" />
                Video
              </h3>
              <video
                controls
                className="w-full rounded-xl border border-gray-200"
              >
                <source src={`http://localhost:8000${submission.video}`} />
              </video>
            </div>
          )}

          {/* Status Update */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Update Status
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Current:</span>
              <Badge status={currentStatus} />
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <button
                  key={key}
                  disabled={updating || currentStatus === key}
                  onClick={() => updateStatus(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all
                    ${
                      currentStatus === key
                        ? `${cfg.bg} ${cfg.text} border-transparent cursor-default`
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 cursor-pointer"
                    }
                    ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
            {updating && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <span className="animate-spin inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full" />
                Updating…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
const AdminSubmissions = () => {
  const token = localStorage.getItem("adminToken");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filter === "ALL"
          ? "/api/submissions/admin/all/"
          : `/api/submissions/admin/all/?status=${filter}`;
      const { data } = await makeApi(token).get(url);
      setSubmissions(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = (id, newStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
    if (selected?.id === id) {
      setSelected((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Client-side search
  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.brand?.toLowerCase().includes(q) ||
      s.model?.toLowerCase().includes(q) ||
      s.customer_email?.toLowerCase().includes(q) ||
      s.customer_name?.toLowerCase().includes(q) ||
      s.serial_number?.toLowerCase().includes(q)
    );
  });

  // Summary counts from full list
  const counts = {
    ALL: submissions.length,
    PENDING: submissions.filter((s) => s.status === "PENDING").length,
    UNDER_REVIEW: submissions.filter((s) => s.status === "UNDER_REVIEW").length,
    APPROVED: submissions.filter((s) => s.status === "APPROVED").length,
    REJECTED: submissions.filter((s) => s.status === "REJECTED").length,
  };

  const FILTER_TABS = [
    {
      key: "ALL",
      label: "All",
      icon: <FaMobileAlt />,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    {
      key: "PENDING",
      label: "Pending",
      icon: <FaClock />,
      color: "text-yellow-700",
      bg: "bg-yellow-50",
    },
    {
      key: "UNDER_REVIEW",
      label: "Under Review",
      icon: <FaFilter />,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      key: "APPROVED",
      label: "Approved",
      icon: <FaCheckCircle />,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      key: "REJECTED",
      label: "Rejected",
      icon: <FaTimesCircle />,
      color: "text-red-700",
      bg: "bg-red-50",
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Page header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Device Submissions
              </h1>
              <p className="text-gray-500 mt-1">
                Review and manage all customer device submissions
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stat filter chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {FILTER_TABS.map(({ key, label, icon, color, bg }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-xl p-4 text-left border-2 transition-all shadow-sm hover:shadow-md
                  ${
                    filter === key
                      ? "border-emerald-500 bg-white shadow-md"
                      : `border-transparent ${bg} hover:border-gray-200`
                  }`}
              >
                <div className={`text-base mb-1 ${color}`}>{icon}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {counts[key]}
                </div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </button>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Search bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {filter === "ALL"
                  ? "All Submissions"
                  : `${STATUS_CFG[filter]?.label} Submissions`}
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filtered.length})
                </span>
              </h2>
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search device, customer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500 font-medium">
                  No submissions found
                </p>
                {search && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try a different search term
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "#",
                        "Device",
                        "Customer",
                        "Serial No.",
                        "Submitted",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((sub, i) => (
                      <tr
                        key={sub.id}
                        className={`hover:bg-emerald-50/30 transition-colors ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                        }`}
                      >
                        <td className="px-5 py-4 text-xs text-gray-400 font-mono">
                          #{sub.id}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-emerald-700 font-bold text-sm">
                                {sub.brand?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {sub.brand} {sub.model}
                              </p>
                              <p className="text-xs text-gray-400">
                                {sub.photos?.length || 0} photo
                                {sub.photos?.length !== 1 ? "s" : ""}
                                {sub.video ? " · video" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {sub.customer_name || "—"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {sub.customer_email || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 font-mono">
                          {sub.serial_number || "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(sub.submission_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge status={sub.status} />
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(sub)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <FaEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          submission={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default AdminSubmissions;
