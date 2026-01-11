"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Briefcase, Calendar, BookOpen } from "lucide-react";

import { EducatorRoute } from "@/components/auth/EducatorRoute";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type Question = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export default function EducatorDashboardPage() {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = React.useState<string>("PENDING");
  const [bookings, setBookings] = React.useState<Array<{ id: string; status: string; service: { price: number } | null }>>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        // Fetch KYC status
        const kycResponse = await fetch("/api/kyc", {
          headers: getAuthHeaders(),
        });
        if (kycResponse.ok) {
          const kycData = await kycResponse.json();
          setKycStatus(kycData.kycStatus || "PENDING");
        }

        // Fetch bookings
        const bookingsResponse = await fetch("/api/bookings", {
          headers: getAuthHeaders(),
        });
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.bookings || []);
        }

        // Fetch questions
        setIsLoadingQuestions(true);
        const questionsResponse = await fetch("/api/questions", {
          headers: getAuthHeaders(),
        });
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData.questions || []);
        }
        setIsLoadingQuestions(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setIsLoadingQuestions(false);
      }
    }

    fetchData();
  }, [user]);

  const todays = bookings.filter((b) => b.status === "UPCOMING").slice(0, 3);
  const earnings = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle={`Welcome${user?.name ? `, ${user.name}` : ""}`}
        navItems={[
          { label: "Overview", href: "/dashboard/educator", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "KYC", href: "/dashboard/educator/kyc", icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/educator/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Availability", href: "/dashboard/educator/availability", icon: <Calendar className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/educator/bookings", icon: <BookOpen className="w-5 h-5" /> },
        ]}
      >
        <div
          className={[
            "radius-lg border shadow-soft p-6",
            kycStatus === "APPROVED"
              ? "border-[rgba(26,138,123,0.25)] bg-[rgba(26,138,123,0.08)]"
              : kycStatus === "REJECTED"
              ? "border-[rgba(120,53,44,0.25)] bg-[rgba(120,53,44,0.08)]"
              : "border-[rgba(35,81,119,0.20)] bg-primary-soft",
          ].join(" ")}
        >
          <div className="text-sm font-semibold text-foreground-strong">
            Approval status: {kycStatus}
          </div>
          <div className="mt-2 text-sm text-foreground-muted">
            {kycStatus === "APPROVED"
              ? "You’re approved to accept bookings."
              : kycStatus === "REJECTED"
              ? "Your verification was rejected. Update details and resubmit."
              : "Your verification is pending review. You can still set up services and availability."}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/educator/kyc">View KYC</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Earnings
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">₹{earnings}</div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Today’s meetings
            </div>
            <div className="mt-2 text-3xl font-semibold text-foreground-strong">{todays.length}</div>
          </div>
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Next steps
            </div>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="accent" size="sm" className="w-full">
                <Link href="/dashboard/educator/services">Manage services</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/educator/availability">Set availability</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
          <h2 className="text-lg font-semibold text-foreground-strong mb-4">
            Questions from Students
          </h2>
          {isLoadingQuestions ? (
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
                      <td className="py-3 px-4 text-sm text-foreground-muted max-w-xs">
                        {question.message}
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
      </DashboardShell>
    </EducatorRoute>
  );
}


