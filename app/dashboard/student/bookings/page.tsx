"use client";

import * as React from "react";
import Link from "next/link";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { getBookings } from "@/lib/mock-store";
import { useAuth } from "@/lib/auth";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function statusPill(status: string) {
  if (status === "UPCOMING") return "bg-primary-soft text-foreground-strong";
  if (status === "COMPLETED") return "bg-surface-muted text-foreground-strong";
  return "bg-[rgba(120,53,44,0.10)] text-foreground-strong";
}

export default function StudentBookingsPage() {
  const { user } = useAuth();
  const bookings = React.useMemo(() => getBookings(), []);
  const myBookings = bookings.filter((b) => b.student.id === user?.id);

  return (
    <AuthRoute>
      <DashboardShell
        title="Student dashboard"
        subtitle="Bookings"
        navItems={[
          { label: "Overview", href: "/dashboard/student" },
          { label: "Bookings", href: "/dashboard/student/bookings" },
          { label: "History", href: "/dashboard/student/history" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)] flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground-strong">Your bookings</div>
            <Button asChild variant="accent" size="sm">
              <Link href="/alumni">Book another</Link>
            </Button>
          </div>

          <div className="divide-y divide-[rgba(16,19,34,0.06)]">
            {myBookings.map((b) => (
              <div key={b.id} className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-foreground-strong">
                    {b.educator.name} · {b.service.title}
                  </div>
                  <div className="text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
                      statusPill(b.status),
                    ].join(" ")}
                  >
                    {b.status}
                  </span>
                  {b.status === "UPCOMING" ? (
                    <Button asChild variant="accent" size="sm">
                      <Link href={`/meeting/${b.id}`}>Join meeting</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/student/history">View details</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {myBookings.length === 0 && (
              <div className="p-6 text-sm text-foreground-muted">
                No bookings yet.
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </AuthRoute>
  );
}


