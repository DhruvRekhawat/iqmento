"use client";

import * as React from "react";
import Link from "next/link";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { getBookings, getKycStatus } from "@/lib/mock-store";
import { useAuth } from "@/lib/auth";

export default function EducatorDashboardPage() {
  const { user } = useAuth();
  const educatorSlug = "rahul-iit-bombay";
  const kycStatus = React.useMemo(() => getKycStatus(educatorSlug), [educatorSlug]);
  const bookings = React.useMemo(() => getBookings(), []);

  const todays = bookings.filter((b) => b.educator.slug === educatorSlug && b.status === "UPCOMING").slice(0, 3);
  const earnings = bookings
    .filter((b) => b.educator.slug === educatorSlug && b.status !== "CANCELLED")
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle={`Welcome${user?.name ? `, ${user.name}` : ""}`}
        navItems={[
          { label: "Overview", href: "/dashboard/educator" },
          { label: "KYC", href: "/dashboard/educator/kyc" },
          { label: "Services", href: "/dashboard/educator/services" },
          { label: "Availability", href: "/dashboard/educator/availability" },
          { label: "Bookings", href: "/dashboard/educator/bookings" },
        ]}
      >
        <div
          className={[
            "radius-lg border shadow-soft p-6",
            kycStatus === "APPROVED"
              ? "border-[rgba(26,138,123,0.25)] bg-[rgba(26,138,123,0.08)]"
              : kycStatus === "REJECTED"
              ? "border-[rgba(120,53,44,0.25)] bg-[rgba(120,53,44,0.08)]"
              : "border-[rgba(35,81,119,0.20)] bg-primary-soft",
          ].join(" ")}
        >
          <div className="text-sm font-semibold text-foreground-strong">
            Approval status: {kycStatus}
          </div>
          <div className="mt-2 text-sm text-foreground-muted">
            {kycStatus === "APPROVED"
              ? "You’re approved to accept bookings."
              : kycStatus === "REJECTED"
              ? "Your verification was rejected. Update details and resubmit."
              : "Your verification is pending review. You can still set up services and availability."}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/educator/kyc">View KYC</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Earnings (mock)
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">₹{earnings}</div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Today’s meetings
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">{todays.length}</div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Next steps
            </div>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="accent" size="sm" className="w-full">
                <Link href="/dashboard/educator/services">Manage services</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/educator/availability">Set availability</Link>
              </Button>
            </div>
          </div>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


