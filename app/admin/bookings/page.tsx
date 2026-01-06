"use client";

import * as React from "react";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getBookings } from "@/lib/mock-store";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminBookingsPage() {
  const bookings = React.useMemo(() => getBookings(), []);
  const [status, setStatus] = React.useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");

  const filtered = bookings.filter((b) => (status === "ALL" ? true : b.status === status));

  return (
    <AdminRoute>
      <DashboardShell
        title="Admin panel"
        subtitle="Bookings"
        navItems={[
          { label: "Overview", href: "/admin" },
          { label: "Educators", href: "/admin/educators" },
          { label: "Bookings", href: "/admin/bookings" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)] flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground-strong">All bookings</div>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "UPCOMING", "COMPLETED", "CANCELLED"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={[
                    "rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] border transition-colors",
                    status === s
                      ? "bg-primary-soft border-[rgba(35,81,119,0.35)] text-foreground-strong"
                      : "bg-white border-[rgba(16,19,34,0.10)] text-foreground-muted hover:bg-surface-muted/60",
                  ].join(" ")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[rgba(16,19,34,0.06)]">
            {filtered.map((b) => (
              <div key={b.id} className="p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-foreground-strong">
                    {b.student.name} → {b.educator.name} · {b.service.title}
                  </div>
                  <div className="text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                </div>
                <span className="rounded-full bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-strong">
                  {b.status}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-sm text-foreground-muted">No bookings found.</div>
            )}
          </div>
        </div>
      </DashboardShell>
    </AdminRoute>
  );
}


