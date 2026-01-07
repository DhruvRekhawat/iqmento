"use client";

import * as React from "react";
import { LayoutDashboard, ShieldCheck, Briefcase, Calendar, BookOpen } from "lucide-react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { Service } from "@/types/services";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type EditingService = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
};

export default function EducatorServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newService, setNewService] = React.useState<EditingService | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Fetch services
  React.useEffect(() => {
    if (!user) return;

    async function fetchServices() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/services", {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load services");
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [user]);

  function startAddingService() {
    setNewService({
      id: `new_${Date.now()}`,
      title: "",
      description: "",
      durationMinutes: 30,
      price: 0,
      active: true,
    });
  }

  function cancelAddingService() {
    setNewService(null);
  }

  async function saveNewService() {
    if (!newService) return;
    
    if (!newService.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch("/api/services", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newService.title,
          description: newService.description,
          durationMinutes: newService.durationMinutes,
          price: newService.price,
          active: newService.active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      const data = await response.json();
      setServices([data.service, ...services]);
      setNewService(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(id: string) {
    setEditingId(id);
  }

  function cancelEditing() {
    setEditingId(null);
    // Reload services to reset any changes
    if (user) {
      fetch("/api/services", { headers: getAuthHeaders() })
        .then((res) => res.json())
        .then((data) => setServices(data.services || []))
        .catch(() => {});
    }
  }

  async function saveEditing(id: string) {
    const service = services.find((s) => s.id === id);
    if (!service) return;

    if (!service.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await updateService(id, {
        title: service.title,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        active: service.active,
      });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateService(id: string, updates: Partial<Service>) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      const data = await response.json();
      setServices(services.map((s) => (s.id === id ? data.service : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service");
    }
  }

  async function deleteService(id: string) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service");
    }
  }

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="Services"
        navItems={[
          { label: "Overview", href: "/dashboard/educator", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "KYC", href: "/dashboard/educator/kyc", icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/educator/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Availability", href: "/dashboard/educator/availability", icon: <Calendar className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/educator/bookings", icon: <BookOpen className="w-5 h-5" /> },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)] flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-foreground-strong">Your services</div>
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={startAddingService}
              disabled={isLoading || newService !== null}
            >
              Add service
            </Button>
          </div>

          {error && (
            <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="p-6 text-sm text-foreground-muted text-center">
              Loading services...
            </div>
          )}
          <div className="divide-y divide-[rgba(16,19,34,0.06)]">
            {/* New Service Form */}
            {newService && (
              <div className="p-6 grid gap-4 lg:grid-cols-[1fr_220px] bg-primary-soft/30">
                <div className="flex flex-col gap-2">
                  <input
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    placeholder="Service title"
                    className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                  />
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows={2}
                    placeholder="Description (optional)"
                    className="radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Duration (min)
                      </span>
                      <input
                        value={newService.durationMinutes}
                        onChange={(e) => setNewService({ ...newService, durationMinutes: Number(e.target.value || 0) })}
                        type="number"
                        className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Price (₹)
                      </span>
                      <input
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: Number(e.target.value || 0) })}
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
                        {newService.active ? "Enabled" : "Disabled"}
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewService({ ...newService, active: !newService.active })}
                        className={[
                          "h-10 w-16 rounded-full border transition-colors relative",
                          newService.active
                            ? "bg-primary-soft border-[rgba(35,81,119,0.35)]"
                            : "bg-surface-muted border-[rgba(16,19,34,0.12)]",
                        ].join(" ")}
                        aria-label="Toggle service active"
                        aria-pressed={newService.active}
                      >
                        <span
                          className={[
                            "absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-soft transition-all duration-200 ease-in-out",
                            newService.active ? "translate-x-6" : "translate-x-0",
                          ].join(" ")}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="accent"
                      size="sm"
                      onClick={saveNewService}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelAddingService}
                      disabled={isSaving}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Services */}
            {services.map((s) => {
              const isEditing = editingId === s.id;
              return (
                <div key={s.id} className="p-6 grid gap-4 lg:grid-cols-[1fr_220px]">
                  <div className="flex flex-col gap-2">
                    <input
                      value={s.title}
                      onChange={(e) => {
                        const updated = { ...s, title: e.target.value };
                        setServices(services.map((x) => (x.id === s.id ? updated : x)));
                      }}
                      disabled={!isEditing}
                      className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-surface-muted disabled:cursor-not-allowed"
                    />
                    <textarea
                      value={s.description ?? ""}
                      onChange={(e) => {
                        const updated = { ...s, description: e.target.value };
                        setServices(services.map((x) => (x.id === s.id ? updated : x)));
                      }}
                      disabled={!isEditing}
                      rows={2}
                      className="radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-surface-muted disabled:cursor-not-allowed"
                      placeholder="Description (optional)"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                          Duration (min)
                        </span>
                        <input
                          value={s.durationMinutes}
                          onChange={(e) => {
                            const updated = { ...s, durationMinutes: Number(e.target.value || 0) };
                            setServices(services.map((x) => (x.id === s.id ? updated : x)));
                          }}
                          disabled={!isEditing}
                          type="number"
                          className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-surface-muted disabled:cursor-not-allowed"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                          Price (₹)
                        </span>
                        <input
                          value={s.price}
                          onChange={(e) => {
                            const updated = { ...s, price: Number(e.target.value || 0) };
                            setServices(services.map((x) => (x.id === s.id ? updated : x)));
                          }}
                          disabled={!isEditing}
                          type="number"
                          className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-surface-muted disabled:cursor-not-allowed"
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
                          onClick={() => {
                            const updated = { ...s, active: !s.active };
                            setServices(services.map((x) => (x.id === s.id ? updated : x)));
                            if (isEditing) {
                              // If editing, update immediately
                              updateService(s.id, { active: updated.active });
                            }
                          }}
                          className={[
                            "h-10 w-16 rounded-full border transition-colors relative",
                            s.active
                              ? "bg-primary-soft border-[rgba(35,81,119,0.35)]"
                              : "bg-surface-muted border-[rgba(16,19,34,0.12)]",
                          ].join(" ")}
                          aria-label="Toggle service active"
                          aria-pressed={s.active}
                        >
                          <span
                            className={[
                              "absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-soft transition-all duration-200 ease-in-out",
                              s.active ? "translate-x-6" : "translate-x-0",
                            ].join(" ")}
                          />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="accent"
                          size="sm"
                          onClick={() => saveEditing(s.id)}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="accent"
                          size="sm"
                          onClick={() => startEditing(s.id)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => deleteService(s.id)}
                          className="flex-1"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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


