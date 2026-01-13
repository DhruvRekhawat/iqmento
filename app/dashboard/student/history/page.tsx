"use client";

import * as React from "react";
import { LayoutDashboard, Calendar, History } from "lucide-react";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function StudentHistoryPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Array<{
    id: string;
    status: string;
    student: { id: string; name: string | null };
    educator: { name: string | null };
    service: { title: string };
    slot: { startTime: string };
  }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/bookings?status=COMPLETED", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  const completed = bookings.filter((b) => b.student.id === user?.id);

  return (
    <AuthRoute>
      <DashboardShell
        title="Student dashboard"
        subtitle="History"
        navItems={[
          { label: "Overview", href: "/dashboard/student", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/student/bookings", icon: <Calendar className="w-5 h-5" /> },
          { label: "History", href: "/dashboard/student/history", icon: <History className="w-5 h-5" /> },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
          <div className="text-sm font-semibold text-foreground-strong">Completed meetings</div>
          {isLoading && (
            <div className="mt-4 text-sm text-foreground-muted">Loading...</div>
          )}
          {error && (
            <div className="mt-4 text-sm text-red-600">Error: {error}</div>
          )}
          {!isLoading && !error && (
            <div className="mt-4 grid gap-3">
              {completed.map((b) => (
                <div
                  key={b.id}
                  className="radius-md border border-[rgba(16,19,34,0.10)] bg-white p-4"
                >
                  <div className="text-sm font-semibold text-foreground-strong">
                    {b.educator.name || "Unknown Educator"} · {b.service.title}
                  </div>
                  <div className="mt-2 text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                  <div className="mt-3 text-xs text-foreground-muted">
                    Feedback: (placeholder)
                  </div>
                </div>
              ))}
              {completed.length === 0 && (
                <div className="text-sm text-foreground-muted">No completed meetings yet.</div>
              )}
            </div>
          )}
        </div>
      </DashboardShell>
    </AuthRoute>
  );
}


