"use client";

import * as React from "react";
import Link from "next/link";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function AdminOverviewPage() {
  const [totalBookings, setTotalBookings] = React.useState(0);
  const [pendingKyc, setPendingKyc] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Fetch bookings
        const bookingsResponse = await fetch("/api/admin/bookings", {
          headers: getAuthHeaders(),
        });
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setTotalBookings(bookingsData.bookings?.length || 0);
        }

        // Fetch educators
        const educatorsResponse = await fetch("/api/admin/educators", {
          headers: getAuthHeaders(),
        });
        if (educatorsResponse.ok) {
          const educatorsData = await educatorsResponse.json();
          const pending = educatorsData.educators?.filter(
            (e: { kycStatus: string }) => e.kycStatus === "PENDING"
          ).length || 0;
          setPendingKyc(pending);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

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
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">
              {isLoading ? "..." : totalBookings}
            </div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Pending KYC
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">
              {isLoading ? "..." : pendingKyc}
            </div>
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


