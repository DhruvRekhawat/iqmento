"use client";

import * as React from "react";
import { Calendar, Clock, DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AvailabilitySlot } from "@/types/availability";

interface AvailabilityRule {
  id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc. Empty means specific dates
  specificDates?: string[]; // ISO date strings
  startTime: string; // HH:mm format
  durationMinutes: number;
  price: number;
}

interface AvailabilityManagerProps {
  slots: AvailabilitySlot[];
  onSlotsChange: (slots: AvailabilitySlot[]) => void;
  onRuleAdded?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function AvailabilityManager({ onSlotsChange, onRuleAdded }: AvailabilityManagerProps) {
  const [rules, setRules] = React.useState<AvailabilityRule[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoadingRules, setIsLoadingRules] = React.useState(true);

  // Load rules from API
  React.useEffect(() => {
    async function fetchRules() {
      try {
        setIsLoadingRules(true);
        const response = await fetch("/api/availability/rules", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          const convertedRules: AvailabilityRule[] = (data.rules || []).map((r: { id: string; startDate: string; endDate: string; daysOfWeek: string; specificDates: string | null; startTime: string; durationMinutes: number; price: number }) => ({
            id: r.id,
            startDate: new Date(r.startDate).toISOString().split("T")[0],
            endDate: new Date(r.endDate).toISOString().split("T")[0],
            daysOfWeek: JSON.parse(r.daysOfWeek || "[]"),
            specificDates: r.specificDates ? JSON.parse(r.specificDates) : undefined,
            startTime: r.startTime,
            durationMinutes: r.durationMinutes,
            price: r.price,
          }));
          setRules(convertedRules);
        }
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setIsLoadingRules(false);
      }
    }

    fetchRules();
  }, []);
  const [formData, setFormData] = React.useState<Partial<AvailabilityRule>>({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    daysOfWeek: [],
    startTime: "09:00",
    durationMinutes: 30,
    price: 0,
  });

  // Note: Slot generation is now handled server-side via API

  const handleAddRule = async () => {
    if (!formData.startDate || !formData.endDate || !formData.startTime) return;
    
    try {
      const response = await fetch("/api/availability/rules", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          startDate: formData.startDate,
          endDate: formData.endDate,
          daysOfWeek: formData.daysOfWeek || [],
          specificDates: formData.specificDates,
          startTime: formData.startTime,
          durationMinutes: formData.durationMinutes || 30,
          price: formData.price || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create rule");
      }

      const data = await response.json();
      const newRule: AvailabilityRule = {
        id: data.rule.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        daysOfWeek: formData.daysOfWeek || [],
        specificDates: formData.specificDates,
        startTime: formData.startTime,
        durationMinutes: formData.durationMinutes || 30,
        price: formData.price || 0,
      };
      
      setRules([...rules, newRule]);
      setFormData({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        daysOfWeek: [],
        startTime: "09:00",
        durationMinutes: 30,
        price: 0,
      });
      setShowForm(false);
      
      // Generate slots from this rule
      await generateSlotsFromRule(data.rule.id);
      
      if (onRuleAdded) {
        onRuleAdded();
      }
    } catch (error) {
      console.error("Error creating rule:", error);
      alert("Failed to create rule. Please try again.");
    }
  };

  const generateSlotsFromRule = async (ruleId: string) => {
    try {
      const response = await fetch("/api/availability/slots", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ruleId,
          clearExisting: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate slots");
      }

      const data = await response.json();
      // Convert DB slots to AvailabilitySlot format
      const convertedSlots: AvailabilitySlot[] = data.slots.map((s: { id: string; startTime: string; endTime: string; isBooked: boolean }) => ({
        id: s.id,
        startTime: new Date(s.startTime).toISOString(),
        endTime: new Date(s.endTime).toISOString(),
        isBooked: s.isBooked,
      }));
      
      onSlotsChange(convertedSlots);
    } catch (error) {
      console.error("Error generating slots:", error);
    }
  };

  const handleRemoveRule = async (id: string) => {
    try {
      const response = await fetch(`/api/availability/rules/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete rule");
      }

      setRules(rules.filter((r) => r.id !== id));
      
      if (onRuleAdded) {
        onRuleAdded();
      }
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Failed to delete rule. Please try again.");
    }
  };

  const toggleDayOfWeek = (day: number) => {
    const current = formData.daysOfWeek || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setFormData({ ...formData, daysOfWeek: updated, specificDates: undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground-strong">Availability Rules</h3>
          <p className="mt-1 text-xs text-foreground-muted">
            Create rules to automatically generate available time slots
          </p>
        </div>
        <Button
          type="button"
          variant="accent"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Rule"}
        </Button>
      </div>

      {showForm && (
        <div className="radius-lg border border-[rgba(16,19,34,0.12)] bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Start Date
              </span>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                End Date
              </span>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
              />
            </label>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted block mb-2">
              Days of Week (or leave empty for specific dates)
            </span>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDayOfWeek(day.value)}
                  className={[
                    "px-3 py-2 rounded-full text-xs font-semibold border transition-colors",
                    formData.daysOfWeek?.includes(day.value)
                      ? "bg-primary-soft border-[rgba(35,81,119,0.35)] text-foreground-strong"
                      : "bg-white border-[rgba(16,19,34,0.10)] text-foreground-muted hover:bg-surface-muted/60",
                  ].join(" ")}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Start Time
              </span>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Duration (min)
              </span>
              <input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                }
                min="15"
                step="15"
                className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                Price (₹)
              </span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min="0"
                className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
              />
            </label>
          </div>

          <Button type="button" variant="accent" size="sm" onClick={handleAddRule} className="w-full">
            Add Rule
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {isLoadingRules && (
          <div className="text-sm text-foreground-muted text-center py-4">
            Loading rules...
          </div>
        )}
        {!isLoadingRules && rules.map((rule) => {
          const daysLabel =
            rule.daysOfWeek.length > 0
              ? rule.daysOfWeek
                  .map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label)
                  .join(", ")
              : rule.specificDates
              ? `${rule.specificDates.length} specific dates`
              : "No days selected";
          
          return (
            <div
              key={rule.id}
              className="radius-lg border border-[rgba(16,19,34,0.12)] bg-white p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                <div className="text-sm font-semibold text-foreground-strong">
                  {new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-foreground-muted">
                  {daysLabel} · {rule.startTime} · {rule.durationMinutes} min · ₹{rule.price}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRule(rule.id)}
                className="p-2 hover:bg-surface-muted rounded-lg transition-colors"
                aria-label="Remove rule"
              >
                <X className="w-4 h-4 text-foreground-muted" />
              </button>
            </div>
          );
        })}
        {!isLoadingRules && rules.length === 0 && (
          <div className="text-sm text-foreground-muted text-center py-8">
            No availability rules yet. Add a rule to generate time slots automatically.
          </div>
        )}
      </div>
    </div>
  );
}

