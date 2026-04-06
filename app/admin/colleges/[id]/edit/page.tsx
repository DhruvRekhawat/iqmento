"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CollegeForm } from "@/components/admin/CollegeForm";
import { useToast } from "@/components/admin/Toast";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Colleges", href: "/admin/colleges" },
  { label: "Alumni", href: "/admin/alumni" },
  { label: "Educators", href: "/admin/educators" },
  { label: "Bookings", href: "/admin/bookings" },
];

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function EditCollegePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = React.useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const { showToast, ToastElement } = useToast();

  React.useEffect(() => {
    async function fetchCollege() {
      try {
        const res = await fetch(`/api/admin/colleges/${id}`, { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          setInitialData(data.college);
        } else {
          showToast("College not found", "error");
          router.push("/admin/colleges");
        }
      } catch {
        showToast("Failed to load college", "error");
      } finally {
        setIsFetching(false);
      }
    }
    fetchCollege();
  }, [id, router, showToast]);

  async function handleSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/colleges/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast("College updated successfully");
        setTimeout(() => router.push("/admin/colleges"), 1000);
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to update" }));
        showToast(err.error || "Failed to update college", "error");
      }
    } catch {
      showToast("Failed to update college", "error");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <AdminRoute>
        <DashboardShell title="Admin panel" subtitle="Edit College" navItems={navItems}>
          <div className="text-center py-12 text-foreground-muted">Loading college data...</div>
        </DashboardShell>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <DashboardShell title="Admin panel" subtitle="Edit College" navItems={navItems}>
        {initialData && (
          <CollegeForm
            initialData={initialData as unknown as Parameters<typeof CollegeForm>[0]["initialData"]}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
        {ToastElement}
      </DashboardShell>
    </AdminRoute>
  );
}
