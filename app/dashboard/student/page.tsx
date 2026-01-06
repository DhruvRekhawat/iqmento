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

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const bookings = React.useMemo(() => getBookings(), []);

  const myBookings = bookings.filter((b) => b.student.id === user?.id);
  const upcoming = myBookings.filter((b) => b.status === "UPCOMING");
  const completed = myBookings.filter((b) => b.status === "COMPLETED");

  const totalSessions = myBookings.length;
  const totalSpent = myBookings.reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  return (
    <AuthRoute>
      <DashboardShell
        title="Student dashboard"
        subtitle="Overview"
        navItems={[
          { label: "Overview", href: "/dashboard/student" },
          { label: "Bookings", href: "/dashboard/student/bookings" },
          { label: "History", href: "/dashboard/student/history" },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Total sessions
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">{totalSessions}</div>
          </div>

          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Total spent (mock)
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">₹{totalSpent}</div>
          </div>

          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Next action
            </div>
            <div className="mt-4">
              <Button asChild variant="accent" size="md" className="w-full">
                <Link href="/alumni">Browse mentors</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-foreground-strong">Upcoming meetings</div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/student/bookings">View all</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3">
              {upcoming.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="radius-md border border-[rgba(16,19,34,0.10)] bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground-strong">
                      {b.educator.name} · {b.service.title}
                    </div>
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-strong">
                      Upcoming
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                </div>
              ))}
              {upcoming.length === 0 && (
                <div className="text-sm text-foreground-muted">No upcoming meetings yet.</div>
              )}
            </div>
          </section>

          <section className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-foreground-strong">Past meetings</div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/student/history">View history</Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3">
              {completed.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="radius-md border border-[rgba(16,19,34,0.10)] bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground-strong">
                      {b.educator.name} · {b.service.title}
                    </div>
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-strong">
                      Completed
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                </div>
              ))}
              {completed.length === 0 && (
                <div className="text-sm text-foreground-muted">No completed meetings yet.</div>
              )}
            </div>
          </section>
        </div>
      </DashboardShell>
    </AuthRoute>
  );
}


