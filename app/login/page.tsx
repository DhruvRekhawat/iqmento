"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PublicRoute } from "@/components/auth/PublicRoute";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";

  const { login, isLoading, user } = useAuth();

  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"phone" | "otp">("phone");

  // Redirect when user is authenticated
  React.useEffect(() => {
    if (user) {
      let redirectPath = "/dashboard/student";
      if (user.role === "EDUCATOR") {
        redirectPath = "/dashboard/educator";
      } else if (user.role === "ADMIN") {
        redirectPath = "/admin";
      }
      
      // Use next parameter if provided, otherwise use role-based redirect
      if (next) {
        try {
          const decodedNext = decodeURIComponent(next);
          router.replace(decodedNext);
        } catch {
          router.replace(redirectPath);
        }
      } else {
        router.replace(redirectPath);
      }
    }
  }, [user, next, router]);

  const validatePhone = (value: string): boolean => {
    // Remove non-digits
    const cleanPhone = value.replace(/\D/g, "");
    // Validate 10-digit Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone) {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleSendOtp = async () => {
    setError(null);
    if (!validatePhone(phone)) {
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    
    // Call API directly to get debug OTP in development
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      // Log debug OTP if available (for debugging, but don't auto-fill)
      if (data.debugOtp) {
        console.log("🔑 Debug OTP (for testing only):", data.debugOtp);
        if (data.smsError) {
          console.error("⚠️ SMS failed:", data.smsError);
          console.info("💡 You can manually enter the debug OTP above to test the flow");
        }
      }

      setStep("otp");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === "phone") {
      await handleSendOtp();
      return;
    }

    // OTP verification step
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const result = await login({ phone: cleanPhone, otp });
    if (result.error) {
      setError(result.error);
    }
    // Redirect will be handled by useEffect when user state updates
  };

  return (
    <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="radius-md border border-[rgba(120,53,44,0.25)] bg-[rgba(120,53,44,0.08)] p-3 text-sm text-foreground-strong">
          {error}
        </div>
      )}

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
          Phone Number
        </span>
        <input
          value={phone}
          onChange={(e) => {
            // Only allow digits, limit to 10
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setPhone(value);
            if (phoneError) {
              validatePhone(value);
            }
          }}
          onBlur={(e) => validatePhone(e.target.value)}
          type="tel"
          required
          placeholder="9876543210"
          maxLength={10}
          className={[
            "h-12 w-full radius-md border bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2",
            phoneError
              ? "border-[rgba(120,53,44,0.45)] focus-visible:ring-[rgba(120,53,44,0.35)]"
              : "border-[rgba(16,19,34,0.12)] focus-visible:ring-[rgba(35,81,119,0.35)]",
          ].join(" ")}
        />
        {phoneError && (
          <span className="text-xs text-[rgba(120,53,44,0.85)]">{phoneError}</span>
        )}
      </label>

      {step === "otp" && (
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
            Enter OTP
          </span>
          <input
            value={otp}
            onChange={(e) => {
              // Only allow digits, limit to 6
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            placeholder="123456"
            maxLength={6}
            className="h-12 w-full radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
          />
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span>OTP sent to {phone}</span>
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>
        </label>
      )}

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isLoading}>
          {isLoading 
            ? (step === "phone" ? "Sending OTP..." : "Verifying...")
            : (step === "phone" ? "Send OTP" : "Verify & Sign In")
          }
        </Button>
        {step === "otp" && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              setStep("phone");
              setOtp("");
            }}
          >
            Change Phone Number
          </Button>
        )}
        <Button asChild type="button" variant="outline" size="lg" className="w-full">
          <Link href="/register">Create an account</Link>
        </Button>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <main className="bg-surface min-h-[calc(100vh-0px)] py-16 sm:py-24">
        <Container className="max-w-[520px]">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-8 sm:p-10">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground-strong">
                Sign in
              </h1>
              <p className="text-sm text-foreground-muted">
                Sign in with your phone number to access your dashboard.
              </p>
            </div>

            <Suspense fallback={<div className="mt-8">Loading...</div>}>
              <LoginForm />
            </Suspense>

            <div className="mt-8 text-xs text-foreground-muted">
              Tip: Educator/Admin flows are available after registration or later admin tooling.
            </div>
          </div>
        </Container>
      </main>
    </PublicRoute>
  );
}


