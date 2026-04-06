"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AlumniForm } from "@/components/admin/AlumniForm";
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

export default function EditAlumniPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = React.useState<Record<string, unknown> | null>(null);
  const [colleges, setColleges] = React.useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const { showToast, ToastElement } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [alumniRes, collegesRes] = await Promise.all([
          fetch(`/api/admin/alumni/${id}`, { headers: getAuthHeaders() }),
          fetch("/api/admin/colleges?pageSize=200", { headers: getAuthHeaders() }),
        ]);

        if (alumniRes.ok) {
          const data = await alumniRes.json();
          setInitialData(data.alumni);
        } else {
          showToast("Alumni not found", "error");
          router.push("/admin/alumni");
        }

        if (collegesRes.ok) {
          const data = await collegesRes.json();
          setColleges(data.colleges.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      } catch {
        showToast("Failed to load data", "error");
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [id, router, showToast]);

  async function handleSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/alumni/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast("Alumni updated successfully");
        setTimeout(() => router.push("/admin/alumni"), 1000);
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to update" }));
        showToast(err.error || "Failed to update alumni", "error");
      }
    } catch {
      showToast("Failed to update alumni", "error");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <AdminRoute>
        <DashboardShell title="Admin panel" subtitle="Edit Alumni" navItems={navItems}>
          <div className="text-center py-12 text-foreground-muted">Loading alumni data...</div>
        </DashboardShell>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <DashboardShell title="Admin panel" subtitle="Edit Alumni" navItems={navItems}>
        {initialData && (
          <AlumniForm
            initialData={initialData as unknown as Parameters<typeof AlumniForm>[0]["initialData"]}
            colleges={colleges}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
        {ToastElement}
      </DashboardShell>
    </AdminRoute>
  );
}
