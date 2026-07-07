// src/components/shared/StatusBadge.jsx

export const STATUS_CFG = {
  PENDING:      { label: "Pending",      bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-400" },
  UNDER_REVIEW: { label: "Under Review", bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-400"   },
  APPROVED:     { label: "Approved",     bg: "bg-green-100",  text: "text-green-800",  dot: "bg-green-500"  },
  REJECTED:     { label: "Rejected",     bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-400"    },
};

export const Badge = ({ status }) => {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};