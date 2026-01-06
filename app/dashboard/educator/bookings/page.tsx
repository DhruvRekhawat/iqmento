"use client";

import * as React from "react";
import Link from "next/link";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { getBookings } from "@/lib/mock-store";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function EducatorBookingsPage() {
  const educatorSlug = "rahul-iit-bombay";
  const bookings = React.useMemo(() => getBookings(), []);
  const upcoming = bookings.filter((b) => b.educator.slug === educatorSlug && b.status === "UPCOMING");

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="Bookings"
        navItems={[
          { label: "Overview", href: "/dashboard/educator" },
          { label: "KYC", href: "/dashboard/educator/kyc" },
          { label: "Services", href: "/dashboard/educator/services" },
          { label: "Availability", href: "/dashboard/educator/availability" },
          { label: "Bookings", href: "/dashboard/educator/bookings" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)]">
            <div className="text-sm font-semibold text-foreground-strong">Upcoming bookings</div>
          </div>

          <div className="divide-y divide-[rgba(16,19,34,0.06)]">
            {upcoming.map((b) => (
              <div key={b.id} className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-foreground-strong">
                    {b.student.name} · {b.service.title}
                  </div>
                  <div className="text-sm text-foreground-muted">{formatWhen(b.slot.startTime)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild variant="accent" size="sm">
                    <Link href={`/meeting/${b.id}`}>Join meeting</Link>
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Cancel (mock)
                  </Button>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <div className="p-6 text-sm text-foreground-muted">
                No upcoming bookings yet.
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


