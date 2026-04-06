"use client";

import * as React from "react";
import Link from "next/link";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CsvUploadDialog } from "@/components/admin/CsvUploadDialog";
import { useToast } from "@/components/admin/Toast";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Colleges", href: "/admin/colleges" },
  { label: "Alumni", href: "/admin/alumni" },
  { label: "Educators", href: "/admin/educators" },
  { label: "Bookings", href: "/admin/bookings" },
];

const COLLEGE_CSV_COLUMNS = [
  "name", "shortName", "slug", "location", "collegeType", "collegeTier", "rating",
  "heroImageUrl", "about", "hero", "courses", "admission", "recruiters",
  "reviews", "faqs", "metaTitle", "metaDescription", "published",
];

type College = {
  id: string;
  name: string;
  slug: string;
  location: string;
  collegeType: string | null;
  collegeTier: string | null;
  rating: number | null;
  published: boolean;
  _count: { alumni: number };
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function AdminCollegesPage() {
  const [colleges, setColleges] = React.useState<College[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [csvOpen, setCsvOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { showToast, ToastElement } = useToast();

  const fetchColleges = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/colleges?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Error fetching colleges:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  async function togglePublish(id: string, published: boolean) {
    const res = await fetch(`/api/admin/colleges/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) {
      showToast(published ? "College unpublished" : "College published");
      fetchColleges();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/colleges/${deleteId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      showToast("College deleted");
      setDeleteId(null);
      fetchColleges();
    } else {
      showToast("Failed to delete college", "error");
    }
  }

  return (
    <AdminRoute>
      <DashboardShell title="Admin panel" subtitle="Colleges" navItems={navItems}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground-strong">Colleges</h2>
              <p className="text-sm text-foreground-muted">{total} total colleges</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCsvOpen(true)}>
                Bulk Upload
              </Button>
              <Link href="/admin/colleges/create">
                <Button variant="accent" size="sm">
                  Add College
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search colleges by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Table */}
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12 text-foreground-muted">Loading...</div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground-muted mb-4">No colleges found.</p>
                <Link href="/admin/colleges/create">
                  <Button variant="accent" size="sm">Add your first college</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(16,19,34,0.12)]">
                      {["Name", "Location", "Type", "Tier", "Rating", "Alumni", "Published", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {colleges.map((college) => (
                      <tr
                        key={college.id}
                        className="border-b border-[rgba(16,19,34,0.08)] hover:bg-surface-muted/50"
                      >
                        <td className="py-3 px-4 text-sm text-foreground-strong font-medium">
                          {college.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">{college.location}</td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {college.collegeType || "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {college.collegeTier || "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {college.rating ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {college._count.alumni}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => togglePublish(college.id, college.published)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              college.published
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {college.published ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/colleges/${college.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(college.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Delete confirmation */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="radius-lg bg-surface-strong shadow-card p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-semibold text-foreground-strong">Delete College</h3>
              <p className="text-sm text-foreground-muted">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <CsvUploadDialog
          open={csvOpen}
          onOpenChange={setCsvOpen}
          title="Colleges"
          endpoint="/api/admin/colleges/bulk"
          templateColumns={COLLEGE_CSV_COLUMNS}
          onComplete={fetchColleges}
        />

        {ToastElement}
      </DashboardShell>
    </AdminRoute>
  );
}
