// src/components/shared/DetailModal.jsx
import { useState } from "react";
import axios from "axios";
import { FaTimes, FaImage, FaVideo } from "react-icons/fa";
import { STATUS_CFG, Badge } from "./StatusBadge";

const makeApi = (token) =>
  axios.create({
    baseURL: "http://localhost:8000",
    headers: { Authorization: `Bearer ${token}` },
  });

const THEME_CFG = {
  emerald: {
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    avatarGradient: "from-emerald-400 to-teal-500",
    headerBorder: "border-gray-200",
  },
  blue: {
    iconBg: "bg-blue-100",
    iconText: "text-blue-700",
    avatarGradient: "from-blue-400 to-indigo-500",
    headerBorder: "border-gray-100",
  },
};

const DetailModal = ({
  submission,
  onClose,
  onStatusChange,
  token,
  theme = "emerald",
  imageBaseUrl = "",
}) => {
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(submission.status);
  const t = THEME_CFG[theme] || THEME_CFG.emerald;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.headerBorder} sticky top-0 bg-white rounded-t-2xl z-10`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${t.iconBg} rounded-xl flex items-center justify-center`}>
              <span className={`${t.iconText} font-bold text-lg`}>
                {submission.brand?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {submission.brand} {submission.model}
              </h2>
              <p className="text-sm text-gray-500">Submission #{submission.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
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
                ["Submitted", new Date(submission.submission_date).toLocaleString()],
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
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Customer
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${t.avatarGradient} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {(submission.customer_name || submission.customer_email || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {submission.customer_name || "—"}
                </p>
                <p className="text-sm text-gray-500">{submission.customer_email || "—"}</p>
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
                    href={`${imageBaseUrl}${photo.image}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={`${imageBaseUrl}${photo.image}`}
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
              <video controls className="w-full rounded-xl border border-gray-200">
                <source src={`${imageBaseUrl}${submission.video}`} />
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
                    ${currentStatus === key
                      ? `${cfg.bg} ${cfg.text} border-transparent cursor-default`
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 cursor-pointer"}
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

export default DetailModal;