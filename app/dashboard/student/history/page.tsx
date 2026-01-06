"use client";

import * as React from "react";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getBookings } from "@/lib/mock-store";
import { useAuth } from "@/lib/auth";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function StudentHistoryPage() {
  const { user } = useAuth();
  const bookings = React.useMemo(() => getBookings(), []);
  const completed = bookings.filter(
    (b) => b.student.id === user?.id && b.status === "COMPLETED"
  );

  return (
    <AuthRoute>
      <DashboardShell
        title="Student dashboard"
        subtitle="History"
        navItems={[
          { label: "Overview", href: "/dashboard/student" },
          { label: "Bookings", href: "/dashboard/student/bookings" },
          { label: "History", href: "/dashboard/student/history" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
          <div className="text-sm font-semibold text-foreground-strong">Completed meetings</div>
          <div className="mt-4 grid gap-3">
            {completed.map((b) => (
              <div
                key={b.id}
                className="radius-md border border-[rgba(16,19,34,0.10)] bg-white p-4"
              >
                <div className="text-sm font-semibold text-foreground-strong">
                  {b.educator.name} · {b.service.title}
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
        </div>
      </DashboardShell>
    </AuthRoute>
  );
}


