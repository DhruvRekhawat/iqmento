"use client";

import * as React from "react";
import Link from "next/link";
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

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function EducatorBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Array<{ id: string; student: { name: string }; service: { title: string }; slot: { startTime: string } }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/bookings?status=UPCOMING", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  const upcoming = bookings;

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="Bookings"
        navItems={[
          { label: "Overview", href: "/dashboard/educator", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "KYC", href: "/dashboard/educator/kyc", icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/educator/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Availability", href: "/dashboard/educator/availability", icon: <Calendar className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/educator/bookings", icon: <BookOpen className="w-5 h-5" /> },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)]">
            <div className="text-sm font-semibold text-foreground-strong">Upcoming bookings</div>
          </div>

          {error && (
            <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="p-6 text-sm text-foreground-muted text-center">
              Loading bookings...
            </div>
          )}
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/bookings/${b.id}`, {
                          method: "PUT",
                          headers: getAuthHeaders(),
                          body: JSON.stringify({ status: "CANCELLED" }),
                        });
                        if (response.ok) {
                          setBookings(bookings.filter((booking) => booking.id !== b.id));
                        }
                      } catch (err) {
                        console.error("Failed to cancel booking:", err);
                      }
                    }}
                  >
                    Cancel
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


