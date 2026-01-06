"use client";

import * as React from "react";
import Link from "next/link";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { getBookings, readMockStore } from "@/lib/mock-store";

export default function AdminOverviewPage() {
  const bookings = React.useMemo(() => getBookings(), []);
  const store = React.useMemo(() => readMockStore(), []);

  const pendingKyc = Object.values(store.kycStatusByEducatorSlug).filter((s) => s === "PENDING").length;
  const totalBookings = bookings.length;

  return (
    <AdminRoute>
      <DashboardShell
        title="Admin panel"
        subtitle="Overview"
        navItems={[
          { label: "Overview", href: "/admin" },
          { label: "Educators", href: "/admin/educators" },
          { label: "Bookings", href: "/admin/bookings" },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Total bookings
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">{totalBookings}</div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Pending KYC
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">{pendingKyc}</div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Actions
            </div>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="accent" size="sm" className="w-full">
                <Link href="/admin/educators">Review educators</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/bookings">View bookings</Link>
              </Button>
            </div>
          </div>
        </div>
      </DashboardShell>
    </AdminRoute>
  );
}


