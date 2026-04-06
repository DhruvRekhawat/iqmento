"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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

export default function CreateAlumniPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [colleges, setColleges] = React.useState<{ id: string; name: string }[]>([]);
  const { showToast, ToastElement } = useToast();

  React.useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch("/api/admin/colleges?pageSize=200", { headers: getAuthHeaders() });
        if (res.ok) {
          const data = await res.json();
          setColleges(data.colleges.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
        }
      } catch {
        // Colleges are optional for the form
      }
    }
    fetchColleges();
  }, []);

  async function handleSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/alumni", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast("Alumni created successfully");
        setTimeout(() => router.push("/admin/alumni"), 1000);
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to create" }));
        showToast(err.error || "Failed to create alumni", "error");
      }
    } catch {
      showToast("Failed to create alumni", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminRoute>
      <DashboardShell title="Admin panel" subtitle="Create Alumni" navItems={navItems}>
        <AlumniForm colleges={colleges} onSubmit={handleSubmit} isLoading={isLoading} />
        {ToastElement}
      </DashboardShell>
    </AdminRoute>
  );
}
