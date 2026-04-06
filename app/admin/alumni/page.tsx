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

const ALUMNI_CSV_COLUMNS = [
  "name", "slug", "headline", "bio", "course", "graduationYear",
  "currentCompany", "currentJobRole", "location", "jobLocation", "mail",
  "mobileNumber", "profileImageUrl", "heroImageUrl", "collegeName",
  "isBookable", "isFeatured", "heroTagline", "heroSummary", "overview",
  "stats", "focusAreas", "sessions", "highlights", "reviews", "resources",
  "featuredQuote", "bookingUrl", "questionUrl", "published",
];

type AlumniItem = {
  id: string;
  name: string;
  slug: string;
  headline: string | null;
  currentCompany: string | null;
  isFeatured: boolean;
  isBookable: boolean;
  published: boolean;
  college: { id: string; name: string } | null;
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function AdminAlumniPage() {
  const [alumni, setAlumni] = React.useState<AlumniItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [csvOpen, setCsvOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { showToast, ToastElement } = useToast();

  const fetchAlumni = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/alumni?${params}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAlumni(data.alumni);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Error fetching alumni:", err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  async function togglePublish(id: string, published: boolean) {
    const res = await fetch(`/api/admin/alumni/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) {
      showToast(published ? "Alumni unpublished" : "Alumni published");
      fetchAlumni();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/alumni/${deleteId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      showToast("Alumni deleted");
      setDeleteId(null);
      fetchAlumni();
    } else {
      showToast("Failed to delete alumni", "error");
    }
  }

  return (
    <AdminRoute>
      <DashboardShell title="Admin panel" subtitle="Alumni" navItems={navItems}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground-strong">Alumni</h2>
              <p className="text-sm text-foreground-muted">{total} total alumni</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCsvOpen(true)}>
                Bulk Upload
              </Button>
              <Link href="/admin/alumni/create">
                <Button variant="accent" size="sm">
                  Add Alumni
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search alumni by name, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Table */}
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12 text-foreground-muted">Loading...</div>
            ) : alumni.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-foreground-muted mb-4">No alumni found.</p>
                <Link href="/admin/alumni/create">
                  <Button variant="accent" size="sm">Add your first alumni</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(16,19,34,0.12)]">
                      {["Name", "Headline", "College", "Featured", "Bookable", "Published", "Actions"].map(
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
                    {alumni.map((alum) => (
                      <tr
                        key={alum.id}
                        className="border-b border-[rgba(16,19,34,0.08)] hover:bg-surface-muted/50"
                      >
                        <td className="py-3 px-4 text-sm text-foreground-strong font-medium">
                          {alum.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted max-w-[200px] truncate">
                          {alum.headline || "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {alum.college?.name || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              alum.isFeatured ? "bg-amber-400" : "bg-gray-300"
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              alum.isBookable ? "bg-emerald-400" : "bg-gray-300"
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => togglePublish(alum.id, alum.published)}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              alum.published
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {alum.published ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/alumni/${alum.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(alum.id)}
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
              <h3 className="text-lg font-semibold text-foreground-strong">Delete Alumni</h3>
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
          title="Alumni"
          endpoint="/api/admin/alumni/bulk"
          templateColumns={ALUMNI_CSV_COLUMNS}
          onComplete={fetchAlumni}
        />

        {ToastElement}
      </DashboardShell>
    </AdminRoute>
  );
}
