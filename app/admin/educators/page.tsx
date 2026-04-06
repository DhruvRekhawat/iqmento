"use client";

import * as React from "react";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type Educator = {
  id: string;
  name: string | null;
  email: string;
  educatorSlug: string | null;
  kycStatus: string | null;
  kycCollege: string | null;
  kycGraduationYear: number | null;
  kycLinkedin: string | null;
  kycDocumentUrl: string | null;
};

export default function AdminEducatorsPage() {
  const [educators, setEducators] = React.useState<Educator[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchEducators() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/educators", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setEducators(data.educators || []);
        }
      } catch (err) {
        console.error("Error fetching educators:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEducators();
  }, []);

  async function updateKycStatus(educatorId: string, status: string) {
    try {
      setUpdatingId(educatorId);
      const response = await fetch("/api/admin/kyc", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ educatorId, kycStatus: status }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update the educator in the list
        setEducators((prev) =>
          prev.map((e) => (e.id === educatorId ? data.educator : e))
        );
      } else {
        alert("Failed to update KYC status");
      }
    } catch (err) {
      console.error("Error updating KYC status:", err);
      alert("Failed to update KYC status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminRoute>
      <DashboardShell
        title="Admin panel"
        subtitle="Educators"
        navItems={[
          { label: "Overview", href: "/admin" },
          { label: "Colleges", href: "/admin/colleges" },
          { label: "Alumni", href: "/admin/alumni" },
          { label: "Educators", href: "/admin/educators" },
          { label: "Bookings", href: "/admin/bookings" },
        ]}
      >
        <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft overflow-hidden">
          <div className="p-6 border-b border-[rgba(16,19,34,0.08)]">
            <div className="text-sm font-semibold text-foreground-strong">Educator approvals</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-[0.22em] text-foreground-muted">
                <tr className="border-b border-[rgba(16,19,34,0.06)]">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">College</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-foreground-muted">
                      Loading educators...
                    </td>
                  </tr>
                ) : educators.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-foreground-muted">
                      No educators found.
                    </td>
                  </tr>
                ) : (
                  educators.map((e) => {
                    const status = e.kycStatus || "PENDING";
                    const isUpdating = updatingId === e.id;
                    return (
                      <tr key={e.id} className="border-b border-[rgba(16,19,34,0.06)]">
                        <td className="p-4 font-semibold text-foreground-strong">
                          {e.name || e.email}
                        </td>
                        <td className="p-4 text-foreground-muted">
                          {e.kycCollege || "Not provided"}
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground-strong">
                            {status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateKycStatus(e.id, "APPROVED")}
                              disabled={isUpdating}
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateKycStatus(e.id, "REJECTED")}
                              disabled={isUpdating}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardShell>
    </AdminRoute>
  );
}


