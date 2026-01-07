"use client";

import * as React from "react";
import Link from "next/link";
import Script from "next/script";
import { useParams, useRouter } from "next/navigation";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { createOrderId } from "@/lib/razorpay";
import type { AvailabilitySlot } from "@/types/availability";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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
  const [educator, setEducator] = React.useState<{ id: string; name: string; slug: string } | null>(null);
  const [services, setServices] = React.useState<Array<{ id: string; title: string; price: number }>>([]);
  const [slots, setSlots] = React.useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Check if Razorpay is loaded
  React.useEffect(() => {
    const checkRazorpay = () => {
      if (typeof window !== "undefined" && (window as { Razorpay?: unknown }).Razorpay) {
        // Razorpay is loaded
      }
    };

    // Check immediately
    checkRazorpay();

    // Check periodically in case script loads after component mounts
    const interval = setInterval(checkRazorpay, 100);

    // Cleanup after 5 seconds (script should load by then)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Fetch educator, services, and slots from database
  React.useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch educator by slug
        const educatorResponse = await fetch(`/api/educators/${alumniSlug}`);
        if (educatorResponse.ok) {
          const educatorData = await educatorResponse.json();
          setEducator({
            id: educatorData.educator.id,
            name: educatorData.educator.name || "Educator",
            slug: alumniSlug,
          });
        }
        
        // Fetch services and slots for this educator slug
        const [servicesResponse, slotsResponse] = await Promise.all([
          fetch(`/api/services?educatorSlug=${alumniSlug}`, {
            headers: getAuthHeaders(),
          }),
          fetch(`/api/availability/slots?educatorSlug=${alumniSlug}&onlyAvailable=true`, {
            headers: getAuthHeaders(),
          }),
        ]);
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
        
          if (slotsResponse.ok) {
          const slotsData = await slotsResponse.json();
          // Convert slots
          const convertedSlots: AvailabilitySlot[] = (slotsData.slots || [])
            .map((s: { id: string; startTime: string; endTime: string; isBooked: boolean }) => ({
              id: s.id,
              startTime: new Date(s.startTime).toISOString(),
              endTime: new Date(s.endTime).toISOString(),
              isBooked: s.isBooked,
            }));
          
          setSlots(convertedSlots);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [alumniSlug]);

  const service = services.find((s) => s.id === serviceId) ?? services[0];
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
                {educator?.name || alumniSlug}
                {service ? ` · ${service.title}` : ""}
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/alumni/${alumniSlug}`}>Back to profile</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <section className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}
              {isLoading && step === 1 && (
                <div className="mb-4 text-sm text-foreground-muted text-center">
                  Loading availability...
                </div>
              )}
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
                      disabled={!canGoStep4 || isLoading}
                      onClick={async () => {
                        if (!user || !service || !selectedSlot) return;

                        try {
                          setIsLoading(true);
                          setError(null);

                          // Check if Razorpay is loaded
                          if (typeof window === "undefined" || !(window as { Razorpay?: unknown }).Razorpay) {
                            throw new Error("Razorpay SDK not loaded. Please refresh the page.");
                          }

                          // Create Razorpay order
                          const orderId = await createOrderId(service.price, "INR");
                          console.log("Order created:", orderId);

                          const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
                          if (!razorpayKeyId) {
                            console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID is not set in environment variables");
                            throw new Error("Razorpay key not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local file.");
                          }

                          // Razorpay checkout options
                          const options = {
                            key: razorpayKeyId,
                            amount: service.price * 100, // Convert to paise
                            currency: "INR",
                            name: "IQMENTO",
                            description: `Payment for ${service.title}`,
                            order_id: orderId,
                            handler: async function (response: { razorpay_payment_id: string; razorpay_signature: string }) {
                              try {
                                setIsLoading(true);
                                // Verify payment
                                const verifyResponse = await fetch("/api/verifyOrder", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    razorpay_order_id: orderId,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                  }),
                                });

                                if (!verifyResponse.ok) {
                                  const verifyError = await verifyResponse.json();
                                  throw new Error(verifyError.error || "Payment verification failed");
                                }

                                const verifyData = await verifyResponse.json();
                                if (!verifyData.success) {
                                  throw new Error("Payment verification failed");
                                }

                                // Create booking with payment details
                                const bookingResponse = await fetch("/api/bookings", {
                                  method: "POST",
                                  headers: getAuthHeaders(),
                                  body: JSON.stringify({
                                    serviceId: service.id,
                                    slotId: selectedSlot.id,
                                    razorpayOrderId: orderId,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpaySignature: response.razorpay_signature,
                                  }),
                                });

                                if (!bookingResponse.ok) {
                                  const bookingError = await bookingResponse.json();
                                  throw new Error(bookingError.error || "Failed to create booking");
                                }

                                setStep(4);
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Payment failed");
                                alert(err instanceof Error ? err.message : "Payment failed. Please try again.");
                              } finally {
                                setIsLoading(false);
                              }
                            },
                            prefill: {
                              name: user.name || "",
                              email: user.email || "",
                            },
                            theme: {
                              color: "#3399cc",
                            },
                          };

                          // Open Razorpay checkout
                          console.log("Opening Razorpay checkout with options:", {
                            key: razorpayKeyId?.substring(0, 10) + "...",
                            amount: options.amount,
                            order_id: orderId,
                          });
                          
                          const razorpay = new (window as unknown as { Razorpay: new (options: unknown) => { open: () => void; on: (event: string, handler: () => void) => void } }).Razorpay(options);
                          razorpay.on("payment.failed", function () {
                            setError("Payment failed. Please try again.");
                            alert("Payment failed. Please try again.");
                            setIsLoading(false);
                            console.error("Payment failed");
                          });
                          
                          try {
                            razorpay.open();
                            console.log("Razorpay checkout opened successfully");
                          } catch (openError) {
                            console.error("Error opening Razorpay checkout:", openError);
                            throw new Error("Failed to open payment gateway. Please try again.");
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Failed to initiate payment");
                          alert(err instanceof Error ? err.message : "Failed to initiate payment");
                          setIsLoading(false);
                        }
                      }}
                    >
                      {isLoading ? "Processing..." : "Pay & Confirm"}
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
                    {/* Meeting link will be available after booking is created */}
                  </div>
                </div>
              )}
            </section>

            <aside className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                Details
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="text-sm font-semibold text-foreground-strong">{educator?.name || alumniSlug}</div>
                <div className="text-sm text-foreground-muted">Mentor</div>
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
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => {
            // Razorpay loaded
          }}
          onError={() => {
            setError("Failed to load Razorpay SDK");
          }}
        />
      </main>
    </AuthRoute>
  );
}


