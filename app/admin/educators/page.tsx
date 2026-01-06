"use client";

import * as React from "react";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { readMockStore, setKycStatus } from "@/lib/mock-store";
import { mockAlumni } from "@/mocks/alumni";

export default function AdminEducatorsPage() {
  const [store, setStore] = React.useState(() => readMockStore());

  const educators = mockAlumni;

  return (
    <AdminRoute>
      <DashboardShell
        title="Admin panel"
        subtitle="Educators"
        navItems={[
          { label: "Overview", href: "/admin" },
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
                {educators.map((e) => {
                  const status = store.kycStatusByEducatorSlug[e.slug] ?? "PENDING";
                  return (
                    <tr key={e.slug} className="border-b border-[rgba(16,19,34,0.06)]">
                      <td className="p-4 font-semibold text-foreground-strong">{e.name}</td>
                      <td className="p-4 text-foreground-muted">{e.college.name}</td>
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
                            onClick={() => {
                              setKycStatus(e.slug, "APPROVED");
                              setStore(readMockStore());
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setKycStatus(e.slug, "REJECTED");
                              setStore(readMockStore());
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardShell>
    </AdminRoute>
  );
}


