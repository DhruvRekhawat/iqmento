"use client";

import * as React from "react";
import { LayoutDashboard, ShieldCheck, Briefcase, Calendar, BookOpen } from "lucide-react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
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

export default function EducatorKycPage() {
  const { user } = useAuth();
  const [status, setStatus] = React.useState<string>("PENDING");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    async function fetchKycStatus() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/kyc", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setStatus(data.kycStatus || "PENDING");
        }
      } catch (err) {
        console.error("Error fetching KYC status:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchKycStatus();
  }, [user]);

  async function updateKycStatus(newStatus: string) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/kyc", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ kycStatus: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.kycStatus || "PENDING");
      } else {
        alert("Failed to update KYC status");
      }
    } catch (err) {
      console.error("Error updating KYC:", err);
      alert("Failed to update KYC status");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="KYC"
        navItems={[
          { label: "Overview", href: "/dashboard/educator", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "KYC", href: "/dashboard/educator/kyc", icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/educator/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Availability", href: "/dashboard/educator/availability", icon: <Calendar className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/educator/bookings", icon: <BookOpen className="w-5 h-5" /> },
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
                onClick={() => updateKycStatus("PENDING")}
                disabled={isSubmitting || isLoading}
              >
                Submit for review
              </Button>
              {user?.role === "ADMIN" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateKycStatus("APPROVED")}
                    disabled={isSubmitting || isLoading}
                  >
                    Mark approved (admin)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateKycStatus("REJECTED")}
                    disabled={isSubmitting || isLoading}
                  >
                    Mark rejected (admin)
                  </Button>
                </>
              )}
            </div>
          </section>

          <aside className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Status
            </div>
            {isLoading ? (
              <div className="mt-3 text-sm text-foreground-muted">Loading...</div>
            ) : (
              <>
                <div className="mt-3 text-2xl font-semibold text-foreground-strong">{status}</div>
                <div className="mt-2 text-sm text-foreground-muted">
                  {status === "APPROVED"
                    ? "You're verified."
                    : status === "REJECTED"
                    ? "Update details and resubmit."
                    : "Under review."}
                </div>
              </>
            )}
          </aside>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


