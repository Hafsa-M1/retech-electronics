// src/pages/admin/AdminStaff.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import {
  FaPlus, FaSync, FaUsers, FaUserCheck, FaUserSlash,
  FaSearch, FaTimes, FaEye, FaEyeSlash, FaCrown, FaShieldAlt, FaEnvelope,
} from "react-icons/fa";

// ─── API helper ───────────────────────────────────────────────────────────────
const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

// ─── Avatar initials ──────────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const colors = [
    "from-violet-400 to-purple-600",
    "from-blue-400 to-indigo-600",
    "from-emerald-400 to-teal-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-500",
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
      {initials}
    </div>
  );
};

// ─── Form field wrapper ───────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900
      focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100
      transition-colors placeholder-gray-400 ${className}`}
    {...props}
  />
);

// ─── Create Staff Modal ───────────────────────────────────────────────────────
const CreateStaffModal = ({ open, onClose, onCreated }) => {
  const token = localStorage.getItem("adminToken");
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", password: "",
  });
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess]     = useState(null);

  const reset = () => {
    setForm({ first_name: "", last_name: "", email: "", phone: "", password: "" });
    setErrors({});
    setSuccess(null);
    setShowPassword(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const { data } = await makeApi(token).post("/api/users/admin/staff/create/", form);
      setSuccess(data);
      onCreated(data.user);
    } catch (err) {
      if (err.response?.data) {
        const errs = {};
        Object.entries(err.response.data).forEach(([k, v]) => {
          errs[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(errs);
      } else {
        setErrors({ non_field_errors: "Something went wrong. Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaUsers className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Create Staff Account</h2>
              <p className="text-xs text-gray-400">Login credentials will be emailed automatically</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {/* ── Success state ── */}
          {success ? (
            <div>
              {/* Email sent confirmation */}
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-5">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">Account created &amp; email sent!</p>
                  <p className="text-xs text-green-700 mt-1 leading-relaxed">
                    Login credentials have been automatically emailed to{" "}
                    <span className="font-semibold">{success.user.email}</span>.
                    The staff member can log in directly from the link in the email.
                  </p>
                </div>
              </div>

              {/* Summary card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-5 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account Summary</p>
                {[
                  ["Name",  `${success.user.first_name} ${success.user.last_name}`],
                  ["Email", success.user.email],
                  ["Role",  success.user.role],
                  ["Status", success.user.is_active ? "Active" : "Inactive"],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Create Another
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit}>
              {/* Email auto-send notice */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl mb-5">
                <FaEnvelope className="text-blue-400 flex-shrink-0" size={13} />
                <p className="text-xs text-blue-700">
                  Login credentials will be automatically emailed to the staff member upon account creation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4">
                <Field label="First Name" required error={errors.first_name}>
                  <Input
                    value={form.first_name}
                    onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                    placeholder="Jane"
                    required
                  />
                </Field>
                <Field label="Last Name" required error={errors.last_name}>
                  <Input
                    value={form.last_name}
                    onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                    placeholder="Doe"
                    required
                  />
                </Field>
              </div>

              <Field label="Email Address" required error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="jane.doe@retech.com"
                  required
                />
              </Field>

              <Field label="Phone Number" error={errors.phone}>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                />
              </Field>

              <Field label="Temporary Password" required error={errors.password}>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </Field>

              {errors.non_field_errors && (
                <p className="text-sm text-red-500 mb-4">{errors.non_field_errors}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all
                    ${submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating &amp; Sending Email…
                    </span>
                  ) : "Create Account & Send Email"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Confirm dialog ───────────────────────────────────────────────────────────
const ConfirmDialog = ({ open, title, message, confirmLabel, confirmColor, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold text-white ${confirmColor}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
const AdminStaff = () => {
  const token = localStorage.getItem("adminToken");
  const [staff, setStaff]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterActive, setFilterActive] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [toggling, setToggling]     = useState(null);
  const [confirm, setConfirm]       = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await makeApi(token).get("/api/users/admin/staff/");
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const handleCreated = (newUser) => setStaff((prev) => [newUser, ...prev]);

  const handleToggle = async (member) => {
    setConfirm(null);
    setToggling(member.id);
    try {
      const { data } = await makeApi(token).patch(`/api/users/admin/staff/${member.id}/toggle/`);
      setStaff((prev) => prev.map((s) => s.id === member.id ? { ...s, is_active: data.is_active } : s));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update account status.");
    } finally {
      setToggling(null);
    }
  };

  const filtered = staff.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q);
    const matchActive =
      filterActive === "ALL" ||
      (filterActive === "ACTIVE"   && s.is_active) ||
      (filterActive === "INACTIVE" && !s.is_active);
    return matchSearch && matchActive;
  });

  const counts = {
    total:    staff.length,
    active:   staff.filter((s) => s.is_active).length,
    inactive: staff.filter((s) => !s.is_active).length,
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-6">

          {/* Page header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-500 mt-1">Create accounts - credentials are emailed automatically</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchStaff} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                <FaSync className={loading ? "animate-spin" : ""} /> Refresh
              </button>
              <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <FaPlus /> Create Staff
              </button>
            </div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { key: "ALL",      label: "Total Staff", value: counts.total,    icon: <FaUsers />,     color: "text-purple-600", bg: "bg-purple-50" },
              { key: "ACTIVE",   label: "Active",      value: counts.active,   icon: <FaUserCheck />, color: "text-green-600",  bg: "bg-green-50"  },
              { key: "INACTIVE", label: "Inactive",    value: counts.inactive, icon: <FaUserSlash />, color: "text-red-600",    bg: "bg-red-50"    },
            ].map(({ key, label, value, icon, color, bg }) => (
              <button key={key} onClick={() => setFilterActive(key)}
                className={`rounded-xl p-4 text-left border-2 transition-all shadow-sm hover:shadow-md
                  ${filterActive === key ? "border-purple-400 bg-white shadow-purple-100" : `border-transparent ${bg} hover:border-gray-200`}`}
              >
                <div className={`text-lg mb-2 ${color}`}>{icon}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-bold text-gray-800">
                {filterActive === "ALL" ? "All Staff" : filterActive === "ACTIVE" ? "Active Staff" : "Inactive Staff"}
                <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
              </h2>
              <div className="relative w-full sm:w-72">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                <input type="text" placeholder="Search name, email, phone…" value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-500 font-medium text-lg">
                  {search ? "No staff found matching your search" : "No staff accounts yet"}
                </p>
                {!search && (
                  <button onClick={() => setShowCreate(true)} className="mt-4 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                    Create First Staff Account
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Staff Member", "Contact", "Role", "Status", "Joined", "Last Login", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((member, i) => (
                      <tr key={member.id} className={`hover:bg-purple-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={`${member.first_name} ${member.last_name}`} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-gray-900">{member.first_name} {member.last_name}</p>
                                {member.is_superuser && <FaCrown className="text-amber-500 text-xs" title="Admin" />}
                              </div>
                              <p className="text-xs text-gray-400 font-mono">ID #{member.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700">{member.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{member.phone || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${member.is_superuser ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"}`}>
                            {member.is_superuser ? <><FaCrown size={9} /> Admin</> : <><FaShieldAlt size={9} /> Staff</>}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${member.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${member.is_active ? "bg-green-500" : "bg-red-400"}`} />
                            {member.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(member.date_joined).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {member.last_login
                            ? new Date(member.last_login).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                            : <span className="text-gray-300 italic text-xs">Never</span>}
                        </td>
                        <td className="px-5 py-4">
                          {member.is_superuser ? (
                            <span className="text-xs text-gray-300 italic">Protected</span>
                          ) : (
                            <button
                              disabled={toggling === member.id}
                              onClick={() => setConfirm(member)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                                ${member.is_active ? "bg-red-50 hover:bg-red-100 text-red-600" : "bg-green-50 hover:bg-green-100 text-green-700"}
                                ${toggling === member.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {toggling === member.id
                                ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                : member.is_active
                                  ? <><FaUserSlash size={11} /> Deactivate</>
                                  : <><FaUserCheck size={11} /> Activate</>}
                            </button>
                          )}
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

      <CreateStaffModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.is_active ? "Deactivate Account?" : "Activate Account?"}
        message={confirm?.is_active
          ? `${confirm?.first_name} ${confirm?.last_name} will no longer be able to log in.`
          : `${confirm?.first_name} ${confirm?.last_name} will regain access to the system.`}
        confirmLabel={confirm?.is_active ? "Deactivate" : "Activate"}
        confirmColor={confirm?.is_active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
        onConfirm={() => handleToggle(confirm)}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
};

export default AdminStaff;