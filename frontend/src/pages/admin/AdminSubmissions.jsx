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
  FaChevronLeft,
  FaChevronRight,
  FaAward,
  FaTools,
  FaBullhorn,
  FaHandshake,
} from "react-icons/fa";
import { STATUS_CFG, Badge } from "../../components/shared/StatusBadge";
import DetailModal from "../../components/shared/DetailModal";

// ─── helpers ─────────────────────────────────────────────────────────────────
const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

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

  // ─── Pagination state (drives the table only) ─────────────────────────────
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const PAGE_SIZE = 10;

  // ─── Stats state (drives the stat cards — always reflects the FULL dataset) ─
  const [stats, setStats] = useState({
    total_submissions: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    certified: 0,
    refurbishment: 0,
    published: 0,
    sold: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await makeApi(token).get(
        "/api/submissions/admin/stats/",
      );
      setStats({
        total_submissions: data.total_submissions ?? 0,
        pending: data.pending ?? 0,
        under_review: data.under_review ?? 0,
        approved: data.approved ?? 0,
        rejected: data.rejected ?? 0,
        certified: data.certified ?? 0,
        refurbishment: data.refurbishment ?? 0,
        published: data.published_for_sale ?? 0,
        sold: data.sold ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [token]);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "ALL") params.set("status", filter);
      params.set("page", page);

      const url = `/api/submissions/admin/all/?${params.toString()}`;
      const { data } = await makeApi(token).get(url);

      if (Array.isArray(data)) {
        // Fallback in case pagination isn't active for some reason
        setSubmissions(data);
        setCount(data.length);
        setHasNext(false);
        setHasPrevious(false);
      } else {
        setSubmissions(data.results ?? []);
        setCount(data.count ?? 0);
        setHasNext(Boolean(data.next));
        setHasPrevious(Boolean(data.previous));
      }
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setSubmissions([]);
      setCount(0);
      setHasNext(false);
      setHasPrevious(false);
    } finally {
      setLoading(false);
    }
  }, [token, filter, page]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset to page 1 whenever the filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleStatusChange = (id, newStatus) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );
    if (selected?.id === id) {
      setSelected((prev) => ({ ...prev, status: newStatus }));
    }
    // A status change affects the overall stats too, so refresh them
    fetchStats();
  };

  // Refresh both the current page and the stats
  const handleRefresh = () => {
    fetchSubmissions();
    fetchStats();
  };

  // Client-side search (within current page only)
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

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // Stat card counts now come from the stats endpoint — always full-dataset totals
  const counts = {
    ALL: stats.total_submissions,
    PENDING: stats.pending,
    UNDER_REVIEW: stats.under_review,
    APPROVED: stats.approved,
    REJECTED: stats.rejected,
    CERTIFIED: stats.certified,
    REFURBISH: stats.refurbishment,
    PUBLISHED: stats.published,
    SOLD: stats.sold,
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
    {
      key: "CERTIFIED",
      label: "Certified",
      icon: <FaAward />,
      color: "text-teal-700",
      bg: "bg-teal-50",
    },
    {
      key: "REFURBISH",
      label: "Refurbishment",
      icon: <FaTools />,
      color: "text-orange-700",
      bg: "bg-orange-50",
    },
    {
      key: "PUBLISHED",
      label: "Published",
      icon: <FaBullhorn />,
      color: "text-purple-700",
      bg: "bg-purple-50",
    },
    {
      key: "SOLD",
      label: "Sold",
      icon: <FaHandshake />,
      color: "text-gray-700",
      bg: "bg-gray-100",
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
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stat filter chips — always show FULL dataset counts from /stats/ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
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
                  ({count} total)
                </span>
              </h2>
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search this page…"
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

            {/* Pagination controls */}
            {!loading && count > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrevious}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft size={11} /> Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <FaChevronRight size={11} />
                  </button>
                </div>
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
          token={token}
          theme="emerald"
          imageBaseUrl="http://localhost:8000"
        />
      )}
    </>
  );
};

export default AdminSubmissions;
