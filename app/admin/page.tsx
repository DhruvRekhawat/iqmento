"use client";

import * as React from "react";

import { AdminRoute } from "@/components/auth/AdminRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type TrialCall = {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type Question = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  educator?: {
    id: string;
    name: string | null;
    email: string;
    educatorSlug: string | null;
  };
};

export default function AdminOverviewPage() {
  const [totalBookings, setTotalBookings] = React.useState(0);
  const [pendingKyc, setPendingKyc] = React.useState(0);
  const [totalTrialCalls, setTotalTrialCalls] = React.useState(0);
  const [trialCalls, setTrialCalls] = React.useState<TrialCall[]>([]);
  const [totalQuestions, setTotalQuestions] = React.useState(0);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Fetch bookings
        const bookingsResponse = await fetch("/api/admin/bookings", {
          headers: getAuthHeaders(),
        });
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setTotalBookings(bookingsData.bookings?.length || 0);
        }

        // Fetch educators
        const educatorsResponse = await fetch("/api/admin/educators", {
          headers: getAuthHeaders(),
        });
        if (educatorsResponse.ok) {
          const educatorsData = await educatorsResponse.json();
          const pending = educatorsData.educators?.filter(
            (e: { kycStatus: string }) => e.kycStatus === "PENDING"
          ).length || 0;
          setPendingKyc(pending);
        }

        // Fetch trial calls
        const trialCallsResponse = await fetch("/api/trial-calls", {
          headers: getAuthHeaders(),
        });
        if (trialCallsResponse.ok) {
          const trialCallsData = await trialCallsResponse.json();
          setTrialCalls(trialCallsData.trialCalls || []);
          setTotalTrialCalls(trialCallsData.trialCalls?.length || 0);
        }

        // Fetch questions
        const questionsResponse = await fetch("/api/questions", {
          headers: getAuthHeaders(),
        });
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData.questions || []);
          setTotalQuestions(questionsData.questions?.length || 0);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <AdminRoute>
      <DashboardShell
        title="Admin panel"
        subtitle="Overview"
        navItems={[
          { label: "Overview", href: "/admin" },
          { label: "Educators", href: "/admin/educators" },
          { label: "Bookings", href: "/admin/bookings" },
        ]}
      >
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                Total bookings
              </div>
              <div className="mt-2 text-3xl font-semibold text-foreground-strong">
                {isLoading ? "..." : totalBookings}
              </div>
            </div>
            <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                Pending KYC
              </div>
              <div className="mt-2 text-3xl font-semibold text-foreground-strong">
                {isLoading ? "..." : pendingKyc}
              </div>
            </div>
            <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                Trial Calls
              </div>
              <div className="mt-2 text-3xl font-semibold text-foreground-strong">
                {isLoading ? "..." : totalTrialCalls}
              </div>
            </div>
            <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                Questions
              </div>
              <div className="mt-2 text-3xl font-semibold text-foreground-strong">
                {isLoading ? "..." : totalQuestions}
              </div>
            </div>
          </div>

          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <h2 className="text-lg font-semibold text-foreground-strong mb-4">
              Recent Questions
            </h2>
            {isLoading ? (
              <div className="text-center py-8 text-foreground-muted">Loading...</div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-foreground-muted">
                No questions yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(16,19,34,0.12)]">
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Message
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Educator
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr
                        key={question.id}
                        className="border-b border-[rgba(16,19,34,0.08)] hover:bg-surface-muted/50"
                      >
                        <td className="py-3 px-4 text-sm text-foreground-strong font-medium">
                          {question.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          <a
                            href={`mailto:${question.email}`}
                            className="text-primary hover:underline"
                          >
                            {question.email}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          <a
                            href={`tel:${question.phone}`}
                            className="text-primary hover:underline"
                          >
                            {question.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted max-w-xs truncate">
                          {question.message}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {question.educator?.name || question.educator?.email || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {new Date(question.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <h2 className="text-lg font-semibold text-foreground-strong mb-4">
              Recent Trial Call Requests
            </h2>
            {isLoading ? (
              <div className="text-center py-8 text-foreground-muted">Loading...</div>
            ) : trialCalls.length === 0 ? (
              <div className="text-center py-8 text-foreground-muted">
                No trial call requests yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(16,19,34,0.12)]">
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialCalls.map((trialCall) => (
                      <tr
                        key={trialCall.id}
                        className="border-b border-[rgba(16,19,34,0.08)] hover:bg-surface-muted/50"
                      >
                        <td className="py-3 px-4 text-sm text-foreground-strong font-medium">
                          {trialCall.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          <a
                            href={`mailto:${trialCall.email}`}
                            className="text-primary hover:underline"
                          >
                            {trialCall.email}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          <a
                            href={`tel:${trialCall.phone}`}
                            className="text-primary hover:underline"
                          >
                            {trialCall.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {trialCall.description || (
                            <span className="italic">No description</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground-muted">
                          {new Date(trialCall.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    </AdminRoute>
  );
}


