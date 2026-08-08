"use client";

import { useEffect, useState } from "react";

interface AlertPayload {
  id: string;
  type: "error" | "success" | "warning";
  status?: number;
  message: string;
  detail?: string;
}

const TYPE_CONFIG = {
  error: {
    border: "border-rose-800/60",
    bg: "bg-rose-950/90",
    icon: "text-rose-400",
    badge: "bg-rose-900/60 text-rose-300 border-rose-700/40",
    bar: "bg-rose-500",
    label: "Error",
    svg: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  warning: {
    border: "border-amber-800/60",
    bg: "bg-amber-950/90",
    icon: "text-amber-400",
    badge: "bg-amber-900/60 text-amber-300 border-amber-700/40",
    bar: "bg-amber-500",
    label: "Peringatan",
    svg: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
      </svg>
    ),
  },
  success: {
    border: "border-emerald-800/60",
    bg: "bg-emerald-950/90",
    icon: "text-emerald-400",
    badge: "bg-emerald-900/60 text-emerald-300 border-emerald-700/40",
    bar: "bg-emerald-500",
    label: "Berhasil",
    svg: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
} as const;

const DISMISS_DURATION = 5000; // ms

export default function ApiAlert() {
  const [alerts, setAlerts] = useState<AlertPayload[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as Omit<AlertPayload, "id">;
      const id = Math.random().toString(36).slice(2);
      setAlerts((prev) => [...prev.slice(-3), { ...detail, id }]); // max 4 alerts

      // Auto-dismiss
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, DISMISS_DURATION);
    }

    window.addEventListener("api-alert", handler);
    return () => window.removeEventListener("api-alert", handler);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {alerts.map((alert) => {
        const cfg = TYPE_CONFIG[alert.type];
        return (
          <div
            key={alert.id}
            className={`pointer-events-auto relative overflow-hidden rounded-xl border ${cfg.border} ${cfg.bg} backdrop-blur-xl shadow-2xl animate-in slide-in-from-right-4 fade-in duration-300`}
          >
            {/* Progress bar (top) */}
            <div
              className={`absolute top-0 left-0 h-0.5 w-full ${cfg.bar} opacity-60`}
              style={{ animation: `shrink ${DISMISS_DURATION}ms linear forwards` }}
            />

            <div className="flex items-start gap-3 p-4 pr-10">
              {/* Icon */}
              <span className={cfg.icon}>{cfg.svg}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold text-zinc-200">
                    {cfg.label}
                  </span>
                  {alert.status && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${cfg.badge}`}
                    >
                      HTTP {alert.status}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-zinc-300 leading-snug">
                  {alert.message}
                </p>
                {alert.detail && (
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 font-mono truncate">
                    {alert.detail}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() =>
                  setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
                }
                className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Tutup notifikasi"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-in {
          animation: slideInFromRight 0.3s ease-out forwards;
        }
        @keyframes slideInFromRight {
          from { transform: translateX(calc(100% + 1rem)); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
