"use client";

import * as React from "react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  getAvailabilityForEducator,
  setAvailabilityForEducator,
} from "@/lib/mock-store";
import { generateWeeklySlots } from "@/mocks/availability";
import type { AvailabilitySlot } from "@/types/availability";

function formatDay(day: string) {
  const d = new Date(`${day}T00:00:00.000Z`);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function EducatorAvailabilityPage() {
  const educatorSlug = "rahul-iit-bombay";
  const [slots, setSlots] = React.useState<AvailabilitySlot[]>(
    () => getAvailabilityForEducator(educatorSlug)
  );

  function persist(next: AvailabilitySlot[]) {
    setSlots(next);
    setAvailabilityForEducator(educatorSlug, next);
  }

  const grouped = React.useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>();
    slots.forEach((s) => {
      const key = s.startTime.slice(0, 10);
      const prev = map.get(key) ?? [];
      prev.push(s);
      map.set(key, prev);
    });
    return Array.from(map.entries()).map(([day, items]) => ({
      day,
      items: items.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
  }, [slots]);

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="Availability"
        navItems={[
          { label: "Overview", href: "/dashboard/educator" },
          { label: "KYC", href: "/dashboard/educator/kyc" },
          { label: "Services", href: "/dashboard/educator/services" },
          { label: "Availability", href: "/dashboard/educator/availability" },
          { label: "Bookings", href: "/dashboard/educator/bookings" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)] flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground-strong">
              Weekly calendar
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => persist([])}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={() => persist(generateWeeklySlots({ days: 14 }))}
              >
                Seed slots
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              {grouped.slice(0, 8).map(({ day, items }) => (
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
                    {items.slice(0, 8).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() =>
                          persist(slots.filter((x) => x.id !== s.id))
                        }
                        className={[
                          "rounded-full px-3 py-2 text-xs font-semibold border transition-colors",
                          s.isBooked
                            ? "bg-surface-muted border-[rgba(16,19,34,0.12)] text-foreground-muted cursor-not-allowed"
                            : "bg-white border-[rgba(16,19,34,0.10)] hover:bg-surface-muted/60 text-foreground-strong",
                        ].join(" ")}
                        disabled={s.isBooked}
                        aria-label="Remove slot"
                      >
                        {formatTime(s.startTime)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const dayDate = new Date(`${day}T00:00:00.000Z`);
                        const s = new Date(dayDate);
                        s.setHours(12, 0, 0, 0);
                        const e = new Date(dayDate);
                        e.setHours(12, 30, 0, 0);
                        const slot: AvailabilitySlot = {
                          id: `slot_${day}_${Date.now()}`,
                          startTime: s.toISOString(),
                          endTime: e.toISOString(),
                          isBooked: false,
                        };
                        persist([slot, ...slots]);
                      }}
                    >
                      Add slot
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {slots.length === 0 && (
              <div className="mt-6 text-sm text-foreground-muted">
                No availability yet. Seed slots or add a slot to begin.
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


