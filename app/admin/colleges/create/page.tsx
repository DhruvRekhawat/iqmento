"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

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

export default function CreateCollegePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const { showToast, ToastElement } = useToast();

  async function handleSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast("College created successfully");
        setTimeout(() => router.push("/admin/colleges"), 1000);
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to create" }));
        showToast(err.error || "Failed to create college", "error");
      }
    } catch {
      showToast("Failed to create college", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminRoute>
      <DashboardShell title="Admin panel" subtitle="Create College" navItems={navItems}>
        <CollegeForm onSubmit={handleSubmit} isLoading={isLoading} />
        {ToastElement}
      </DashboardShell>
    </AdminRoute>
  );
}
