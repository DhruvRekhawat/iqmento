"use client";

import * as React from "react";
import { LayoutDashboard, ShieldCheck, Briefcase, Calendar, BookOpen } from "lucide-react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AvailabilityManager } from "@/components/dashboard/AvailabilityManager";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { AvailabilitySlot } from "@/types/availability";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatDay(day: string) {
  const d = new Date(`${day}T00:00:00.000Z`);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function EducatorAvailabilityPage() {
  const { user } = useAuth();
  const [slots, setSlots] = React.useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSlots = React.useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/availability/slots", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }

      const data = await response.json();
      // Convert DB slots to AvailabilitySlot format
      const convertedSlots: AvailabilitySlot[] = (data.slots || []).map((s: { id: string; startTime: string; endTime: string; isBooked: boolean }) => ({
        id: s.id,
        startTime: new Date(s.startTime).toISOString(),
        endTime: new Date(s.endTime).toISOString(),
        isBooked: s.isBooked,
      }));
      
      setSlots(convertedSlots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slots");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  async function deleteSlot(slotId: string) {
    try {
      const response = await fetch(`/api/availability/slots?slotId=${slotId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete slot");
      }

      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slot");
    }
  }

  async function clearAvailableSlots() {
    try {
      const response = await fetch("/api/availability/slots?clearAvailable=true", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to clear slots");
      }

      await fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear slots");
    }
  }

  const grouped = React.useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    slots.forEach((s) => {
      const key = s.startTime.slice(0, 10);
      const prev = map.get(key) ?? [];
      prev.push(s);
      map.set(key, prev);
    });
    return Array.from(map.entries())
      .map(([day, items]) => ({
        day,
        items: items.sort((a, b) => a.startTime.localeCompare(b.startTime)),
      }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [slots]);

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="Availability"
        navItems={[
          { label: "Overview", href: "/dashboard/educator", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "KYC", href: "/dashboard/educator/kyc", icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/educator/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Availability", href: "/dashboard/educator/availability", icon: <Calendar className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/educator/bookings", icon: <BookOpen className="w-5 h-5" /> },
        ]}
      >
        <div className="space-y-6">
          {error && (
            <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <AvailabilityManager slots={slots} onSlotsChange={setSlots} onRuleAdded={fetchSlots} />
          </div>

          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
            <div className="p-6 border-b border-[rgba(16,19,34,0.08)] flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-foreground-strong">
                Generated Time Slots
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAvailableSlots}
                  disabled={isLoading}
                >
                  Clear Available
                </Button>
              </div>
            </div>

            <div className="p-6">
              {isLoading && (
                <div className="text-sm text-foreground-muted text-center py-8">
                  Loading slots...
                </div>
              )}
              {!isLoading && grouped.length > 0 ? (
                <div className="grid gap-5 lg:grid-cols-2">
                  {grouped.map(({ day, items }) => (
                    <div
                      key={day}
                      className="radius-lg border border-[rgba(16,19,34,0.10)] bg-white p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-foreground-strong">
                          {formatDay(day)}
                        </div>
                        <div className="text-xs text-foreground-muted">
                          {items.length} slots
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {items.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => deleteSlot(s.id)}
                            className={[
                              "rounded-full px-3 py-2 text-xs font-semibold border transition-colors",
                              s.isBooked
                                ? "bg-surface-muted border-[rgba(16,19,34,0.12)] text-foreground-muted cursor-not-allowed"
                                : "bg-white border-[rgba(16,19,34,0.10)] hover:bg-surface-muted/60 text-foreground-strong",
                            ].join(" ")}
                            disabled={s.isBooked || isLoading}
                            aria-label="Remove slot"
                          >
                            {formatTime(s.startTime)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-foreground-muted text-center py-8">
                  No time slots generated yet. Create an availability rule above to generate slots.
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


