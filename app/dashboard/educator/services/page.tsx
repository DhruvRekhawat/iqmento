"use client";

import * as React from "react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { getServicesForEducator, setServicesForEducator } from "@/lib/mock-store";
import type { Service } from "@/types/services";

export default function EducatorServicesPage() {
  const educatorSlug = "rahul-iit-bombay";
  const [services, setServices] = React.useState<Service[]>(
    () => getServicesForEducator(educatorSlug)
  );

  function persist(next: Service[]) {
    setServices(next);
    setServicesForEducator(educatorSlug, next);
  }

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="Services"
        navItems={[
          { label: "Overview", href: "/dashboard/educator" },
          { label: "KYC", href: "/dashboard/educator/kyc" },
          { label: "Services", href: "/dashboard/educator/services" },
          { label: "Availability", href: "/dashboard/educator/availability" },
          { label: "Bookings", href: "/dashboard/educator/bookings" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)] flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground-strong">Your services</div>
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={() => {
                const next: Service = {
                  id: `s_${Date.now()}`,
                  title: "New service",
                  description: "",
                  durationMinutes: 30,
                  price: 999,
                  active: true,
                };
                persist([next, ...services]);
              }}
            >
              Add service
            </Button>
          </div>

          <div className="divide-y divide-[rgba(16,19,34,0.06)]">
            {services.map((s) => (
              <div key={s.id} className="p-6 grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="flex flex-col gap-2">
                  <input
                    value={s.title}
                    onChange={(e) =>
                      persist(services.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))
                    }
                    className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                  />
                  <textarea
                    value={s.description ?? ""}
                    onChange={(e) =>
                      persist(
                        services.map((x) =>
                          x.id === s.id ? { ...x, description: e.target.value } : x
                        )
                      )
                    }
                    rows={2}
                    className="radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                    placeholder="Description (optional)"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Duration (min)
                      </span>
                      <input
                        value={s.durationMinutes}
                        onChange={(e) =>
                          persist(
                            services.map((x) =>
                              x.id === s.id
                                ? { ...x, durationMinutes: Number(e.target.value || 0) }
                                : x
                            )
                          )
                        }
                        type="number"
                        className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Price (₹)
                      </span>
                      <input
                        value={s.price}
                        onChange={(e) =>
                          persist(
                            services.map((x) =>
                              x.id === s.id ? { ...x, price: Number(e.target.value || 0) } : x
                            )
                          )
                        }
                        type="number"
                        className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="radius-md border border-[rgba(16,19,34,0.12)] bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                      Active
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-foreground-strong">
                        {s.active ? "Enabled" : "Disabled"}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          persist(services.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)))
                        }
                        className={[
                          "h-10 w-16 rounded-full border transition-colors relative",
                          s.active
                            ? "bg-primary-soft border-[rgba(35,81,119,0.35)]"
                            : "bg-surface-muted border-[rgba(16,19,34,0.12)]",
                        ].join(" ")}
                        aria-label="Toggle service active"
                      >
                        <span
                          className={[
                            "absolute top-1 h-8 w-8 rounded-full bg-white shadow-soft transition-transform",
                            s.active ? "translate-x-7" : "translate-x-1",
                          ].join(" ")}
                        />
                      </button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => persist(services.filter((x) => x.id !== s.id))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="p-6 text-sm text-foreground-muted">
                No services yet. Add your first service.
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


