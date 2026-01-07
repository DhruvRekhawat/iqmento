"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, Calendar, History } from "lucide-react";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

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

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Array<{ id: string; status: string; educator: { name: string }; service: { title: string }; slot: { startTime: string } }>>([]);

  React.useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    }

    fetchBookings();
  }, [user]);

  const upcoming = bookings.filter((b) => b.status === "UPCOMING");
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const totalSessions = bookings.length;

  return (
    <AuthRoute>
      <DashboardShell
        title="Student dashboard"
        subtitle="Overview"
        navItems={[
          { label: "Overview", href: "/dashboard/student", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/student/bookings", icon: <Calendar className="w-5 h-5" /> },
          { label: "History", href: "/dashboard/student/history", icon: <History className="w-5 h-5" /> },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Total sessions
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">{totalSessions}</div>
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
                  <div className="mt-2 text-sm text-foreground-muted">{formatWhen(new Date(b.slot.startTime).toISOString())}</div>
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
                  <div className="mt-2 text-sm text-foreground-muted">{formatWhen(new Date(b.slot.startTime).toISOString())}</div>
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


