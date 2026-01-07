"use client";

import * as React from "react";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

type Booking = {
  id: string;
  status: string;
  student: { id: string; name: string | null; email: string };
  educator: { id: string; name: string | null; email: string; educatorSlug: string | null };
  service: { id: string; title: string; description: string | null };
  slot: { id: string; startTime: string; endTime: string };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [status, setStatus] = React.useState<"ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED">("ALL");

  React.useEffect(() => {
    async function fetchBookings() {
      try {
        setIsLoading(true);
        const url = status === "ALL" 
          ? "/api/admin/bookings"
          : `/api/admin/bookings?status=${status}`;
        
        const response = await fetch(url, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [status]);

  const filtered = bookings;

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
            {isLoading ? (
              <div className="p-6 text-sm text-foreground-muted text-center">Loading bookings...</div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-foreground-muted text-center">No bookings found.</div>
            ) : (
              filtered.map((b) => (
                <div key={b.id} className="p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-semibold text-foreground-strong">
                      {b.student.name || b.student.email} → {b.educator.name || b.educator.email} · {b.service.title}
                    </div>
                    <div className="text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                  </div>
                  <span className="rounded-full bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-strong">
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </DashboardShell>
    </AdminRoute>
  );
}


