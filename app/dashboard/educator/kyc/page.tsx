"use client";

import * as React from "react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { getKycStatus, setKycStatus } from "@/lib/mock-store";

export default function EducatorKycPage() {
  const educatorSlug = "rahul-iit-bombay";
  const [status, setStatus] = React.useState(() => getKycStatus(educatorSlug));

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="KYC"
        navItems={[
          { label: "Overview", href: "/dashboard/educator" },
          { label: "KYC", href: "/dashboard/educator/kyc" },
          { label: "Services", href: "/dashboard/educator/services" },
          { label: "Availability", href: "/dashboard/educator/availability" },
          { label: "Bookings", href: "/dashboard/educator/bookings" },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr]">
          <section className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-sm font-semibold text-foreground-strong">Verification</div>
            <div className="mt-2 text-sm text-foreground-muted">
              Mock KYC form — no uploads are sent anywhere.
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  College
                </span>
                <input
                  defaultValue="IIT Bombay"
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  Graduation year
                </span>
                <input
                  defaultValue="2019"
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                />
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  LinkedIn
                </span>
                <input
                  defaultValue="https://linkedin.com/in/demo"
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                />
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  Document upload (mock)
                </span>
                <input
                  type="file"
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={() => {
                  setKycStatus(educatorSlug, "PENDING");
                  setStatus("PENDING");
                }}
              >
                Submit for review
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setKycStatus(educatorSlug, "APPROVED");
                  setStatus("APPROVED");
                }}
              >
                Mark approved (admin mock)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setKycStatus(educatorSlug, "REJECTED");
                  setStatus("REJECTED");
                }}
              >
                Mark rejected (admin mock)
              </Button>
            </div>
          </section>

          <aside className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Status
            </div>
            <div className="mt-3 text-2xl font-semibold text-foreground-strong">{status}</div>
            <div className="mt-2 text-sm text-foreground-muted">
              {status === "APPROVED"
                ? "You’re verified."
                : status === "REJECTED"
                ? "Update details and resubmit."
                : "Under review."}
            </div>
          </aside>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


