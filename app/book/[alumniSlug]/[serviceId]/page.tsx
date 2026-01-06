"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  getAvailabilityForEducator,
  getServicesForEducator,
  upsertBooking,
} from "@/lib/mock-store";
import { mockAlumni } from "@/mocks/alumni";
import type { AvailabilitySlot } from "@/types/availability";
import type { Booking } from "@/types/bookings";

type Step = 1 | 2 | 3 | 4;

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTimeLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function groupByDay(slots: AvailabilitySlot[]) {
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
}

export default function BookingFlowPage() {
  const router = useRouter();
  const params = useParams<{ alumniSlug: string; serviceId: string }>();
  const alumniSlug = params.alumniSlug;
  const serviceId = params.serviceId;

  const { user } = useAuth();

  const educator =
    mockAlumni.find((a) => a.slug === alumniSlug) ||
    ({
      id: alumniSlug,
      slug: alumniSlug,
      name: alumniSlug,
      isBookable: true,
      college: { id: "c", name: "College", slug: "college", location: "" },
      services: [],
      stats: { sessions: 0, rating: 0 },
    } as const);

  const services = React.useMemo(() => getServicesForEducator(alumniSlug), [alumniSlug]);
  const service = services.find((s) => s.id === serviceId) ?? services[0];

  const slots = React.useMemo(
    () => getAvailabilityForEducator(alumniSlug).filter((s) => !s.isBooked),
    [alumniSlug]
  );
  const grouped = React.useMemo(() => groupByDay(slots), [slots]);

  const [step, setStep] = React.useState<Step>(1);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(grouped[0]?.day ?? null);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | null>(null);
  const selectedSlot = React.useMemo(
    () => slots.find((s) => s.id === selectedSlotId) ?? null,
    [selectedSlotId, slots]
  );

  const priceLabel = service ? `₹${service.price}` : "—";

  const canGoStep2 = Boolean(selectedDay);
  const canGoStep3 = Boolean(selectedSlot);
  const canGoStep4 = Boolean(service && selectedSlot && user);

  return (
    <AuthRoute>
      <main className="bg-surface min-h-[calc(100vh-0px)] py-10 sm:py-14">
        <Container className="max-w-[980px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground-strong">
                Book session
              </h1>
              <p className="text-sm text-foreground-muted">
                {educator.name}
                {service ? ` · ${service.title}` : ""}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/alumni/${alumniSlug}`}>Back to profile</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <section className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  Step {step} of 4
                </div>
                <div className="text-sm text-foreground-muted">
                  {step === 1 && "Select date"}
                  {step === 2 && "Select time slot"}
                  {step === 3 && "Summary"}
                  {step === 4 && "Confirmed"}
                </div>
              </div>

              {step === 1 && (
                <div className="mt-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {grouped.slice(0, 9).map(({ day }) => {
                      const firstSlot = slots.find((s) => s.startTime.startsWith(day));
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setSelectedDay(day);
                            setSelectedSlotId(null);
                          }}
                          className={[
                            "radius-md border p-4 text-left transition-colors",
                            selectedDay === day
                              ? "border-[rgba(35,81,119,0.45)] bg-primary-soft"
                              : "border-[rgba(16,19,34,0.12)] bg-white hover:bg-surface-muted/60",
                          ].join(" ")}
                        >
                          <div className="text-sm font-semibold text-foreground-strong">
                            {firstSlot ? formatDateLabel(firstSlot.startTime) : day}
                          </div>
                          <div className="mt-1 text-xs text-foreground-muted">
                            {slots.filter((s) => s.startTime.startsWith(day)).length} slots
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      variant="accent"
                      size="md"
                      disabled={!canGoStep2}
                      onClick={() => setStep(2)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mt-6">
                  <div className="text-sm font-semibold text-foreground-strong">
                    {selectedDay ? formatDateLabel(`${selectedDay}T00:00:00.000Z`) : "Select a day"}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {slots
                      .filter((s) => (selectedDay ? s.startTime.startsWith(selectedDay) : true))
                      .slice(0, 12)
                      .map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedSlotId(s.id)}
                          className={[
                            "radius-md border px-4 py-3 text-left transition-colors",
                            selectedSlotId === s.id
                              ? "border-[rgba(35,81,119,0.45)] bg-primary-soft"
                              : "border-[rgba(16,19,34,0.12)] bg-white hover:bg-surface-muted/60",
                          ].join(" ")}
                        >
                          <div className="text-sm font-semibold text-foreground-strong">
                            {formatTimeLabel(s.startTime)}
                          </div>
                          <div className="mt-0.5 text-xs text-foreground-muted">30 min</div>
                        </button>
                      ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" size="md" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      size="md"
                      disabled={!canGoStep3}
                      onClick={() => setStep(3)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-6">
                  <div className="radius-md border border-[rgba(16,19,34,0.12)] bg-white p-5">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-semibold text-foreground-strong">
                        Booking summary
                      </div>
                      <div className="text-sm text-foreground-muted">
                        {service?.title} · {priceLabel}
                      </div>
                      {selectedSlot && (
                        <div className="text-sm text-foreground-muted">
                          {formatDateLabel(selectedSlot.startTime)} · {formatTimeLabel(selectedSlot.startTime)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" size="md" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      size="md"
                      disabled={!canGoStep4}
                      onClick={() => {
                        if (!user || !service || !selectedSlot) return;

                        const booking: Booking = {
                          id: `bk_${Date.now()}`,
                          student: user,
                          educator,
                          service,
                          slot: { ...selectedSlot, isBooked: true },
                          status: "UPCOMING",
                        };
                        upsertBooking(booking);
                        setStep(4);
                      }}
                    >
                      Confirm booking
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="mt-6">
                  <div className="radius-md border border-[rgba(16,19,34,0.12)] bg-primary-soft p-6">
                    <div className="text-sm font-semibold text-foreground-strong">
                      Booking confirmed
                    </div>
                    <div className="mt-2 text-sm text-foreground-muted">
                      Your meeting is scheduled. You can join when it’s live from your bookings.
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => router.replace("/dashboard/student/bookings")}
                    >
                      Go to bookings
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      size="md"
                      onClick={() => router.replace(`/meeting/mock_${Date.now()}`)}
                    >
                      Open meeting (placeholder)
                    </Button>
                  </div>
                </div>
              )}
            </section>

            <aside className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                Details
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="text-sm font-semibold text-foreground-strong">{educator.name}</div>
                <div className="text-sm text-foreground-muted">{educator.headline || "Mentor"}</div>
                <div className="mt-2 radius-md border border-[rgba(16,19,34,0.12)] bg-white p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                    Price
                  </div>
                  <div className="mt-1 text-lg font-semibold text-foreground-strong">
                    {priceLabel}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </AuthRoute>
  );
}


