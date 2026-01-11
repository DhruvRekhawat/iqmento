"use client";

import * as React from "react";
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

export default function EducatorKycPage() {
  const { user } = useAuth();
  const [status, setStatus] = React.useState<string>("PENDING");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  
  // Form fields
  const [college, setCollege] = React.useState("");
  const [graduationYear, setGraduationYear] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [documentFile, setDocumentFile] = React.useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;

    async function fetchKycStatus() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/kyc", {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setStatus(data.kycStatus || "PENDING");
          setCollege(data.college || "");
          setGraduationYear(data.graduationYear ? String(data.graduationYear) : "");
          setLinkedin(data.linkedin || "");
          setDocumentUrl(data.documentUrl || null);
        }
      } catch (err) {
        console.error("Error fetching KYC status:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchKycStatus();
  }, [user]);

  async function uploadDocument(file: File): Promise<string | null> {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload document");
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      alert(err instanceof Error ? err.message : "Failed to upload document");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  async function submitKycForm() {
    try {
      setIsSubmitting(true);

      // Upload document if a new file is selected
      let finalDocumentUrl = documentUrl;
      if (documentFile) {
        const uploadedUrl = await uploadDocument(documentFile);
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        finalDocumentUrl = uploadedUrl;
      }

      // Submit KYC form data
      const response = await fetch("/api/kyc", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          college: college || null,
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
          linkedin: linkedin || null,
          documentUrl: finalDocumentUrl,
          kycStatus: "PENDING", // Set to pending when submitting for review
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.kycStatus || "PENDING");
        setDocumentUrl(data.documentUrl || null);
        setDocumentFile(null);
        alert("KYC submitted successfully! It will be reviewed by an admin.");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit KYC");
      }
    } catch (err) {
      console.error("Error submitting KYC:", err);
      alert("Failed to submit KYC");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateKycStatus(newStatus: string) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/kyc", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ kycStatus: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.kycStatus || "PENDING");
      } else {
        alert("Failed to update KYC status");
      }
    } catch (err) {
      console.error("Error updating KYC:", err);
      alert("Failed to update KYC status");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EducatorRoute>
      <DashboardShell
        title="Educator dashboard"
        subtitle="KYC"
        navItems={[
          { label: "Overview", href: "/dashboard/educator", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "KYC", href: "/dashboard/educator/kyc", icon: <ShieldCheck className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/educator/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Availability", href: "/dashboard/educator/availability", icon: <Calendar className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/educator/bookings", icon: <BookOpen className="w-5 h-5" /> },
        ]}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr]">
          <section className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-sm font-semibold text-foreground-strong">Verification</div>
            <div className="mt-2 text-sm text-foreground-muted">
              Submit your KYC documents for verification. All documents are securely stored.
            </div>
            {status === "PENDING" && (
              <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                <p className="text-sm text-yellow-800">
                  Your KYC is currently under review. You cannot modify the form until the review is complete.
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  College
                </span>
                <input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g., IIT Bombay"
                  disabled={status === "PENDING"}
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  Graduation year
                </span>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="e.g., 2019"
                  min="1950"
                  max={new Date().getFullYear() + 5}
                  disabled={status === "PENDING"}
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  LinkedIn Profile URL
                </span>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  disabled={status === "PENDING"}
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  Verification Document
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocumentFile(file);
                    }
                  }}
                  disabled={status === "PENDING"}
                  className="h-12 radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm outline-none disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
                {documentFile && (
                  <div className="text-xs text-foreground-muted">
                    Selected: {documentFile.name} ({(documentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                {documentUrl && !documentFile && (
                  <div className="text-xs text-foreground-muted">
                    Current document: <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                  </div>
                )}
                <div className="text-xs text-foreground-muted mt-1">
                  Accepted formats: PDF, JPG, PNG, WEBP (max 10MB)
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={submitKycForm}
                disabled={isSubmitting || isLoading || isUploading || status === "PENDING"}
              >
                {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : "Submit for review"}
              </Button>
              {user?.role === "ADMIN" && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateKycStatus("APPROVED")}
                    disabled={isSubmitting || isLoading}
                  >
                    Mark approved (admin)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateKycStatus("REJECTED")}
                    disabled={isSubmitting || isLoading}
                  >
                    Mark rejected (admin)
                  </Button>
                </>
              )}
            </div>
          </section>

          <aside className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
              Status
            </div>
            {isLoading ? (
              <div className="mt-3 text-sm text-foreground-muted">Loading...</div>
            ) : (
              <>
                <div className="mt-3 text-2xl font-semibold text-foreground-strong">{status}</div>
                <div className="mt-2 text-sm text-foreground-muted">
                  {status === "APPROVED"
                    ? "You're verified."
                    : status === "REJECTED"
                    ? "Update details and resubmit."
                    : "Under review."}
                </div>
              </>
            )}
          </aside>
        </div>
      </DashboardShell>
    </EducatorRoute>
  );
}


