"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PublicRoute } from "@/components/auth/PublicRoute";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

type RegisterRole = Extract<UserRole, "STUDENT" | "EDUCATOR">;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";

  const { register, isLoading } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [role, setRole] = React.useState<RegisterRole>("STUDENT");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await register({ name, email, password, role });
    if (result.error) {
      setError(result.error);
      return;
    }

    const landing = role === "EDUCATOR" ? "/dashboard/educator" : "/dashboard/student";
    router.replace(next ? decodeURIComponent(next) : landing);
  };

  return (
    <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
      {error && (
        <div className="radius-md border border-[rgba(120,53,44,0.25)] bg-[rgba(120,53,44,0.08)] p-3 text-sm text-foreground-strong">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Your name"
            className="h-12 w-full radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
            Email
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 w-full radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
            Password
          </span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="At least 6 characters"
            minLength={6}
            className="h-12 w-full radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
            Confirm Password
          </span>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            placeholder="Confirm your password"
            minLength={6}
            className="h-12 w-full radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
          />
        </label>
      </div>

              <fieldset className="flex flex-col gap-3">
                <legend className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
                  Role
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRole("STUDENT")}
                    className={[
                      "radius-md border p-4 text-left transition-colors",
                      role === "STUDENT"
                        ? "border-[rgba(35,81,119,0.45)] bg-primary-soft"
                        : "border-[rgba(16,19,34,0.12)] bg-white hover:bg-surface-muted/60",
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold text-foreground-strong">Student</div>
                    <div className="mt-1 text-xs text-foreground-muted">
                      Book sessions, manage bookings, meeting history.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("EDUCATOR")}
                    className={[
                      "radius-md border p-4 text-left transition-colors",
                      role === "EDUCATOR"
                        ? "border-[rgba(35,81,119,0.45)] bg-primary-soft"
                        : "border-[rgba(16,19,34,0.12)] bg-white hover:bg-surface-muted/60",
                    ].join(" ")}
                  >
                    <div className="text-sm font-semibold text-foreground-strong">Educator</div>
                    <div className="mt-1 text-xs text-foreground-muted">
                      Add services, manage availability, handle bookings.
                    </div>
                  </button>
                </div>
              </fieldset>

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create & continue"}
        </Button>
        <Button asChild type="button" variant="outline" size="lg" className="w-full">
          <Link href="/login">Already have an account?</Link>
        </Button>
      </div>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <PublicRoute>
      <main className="bg-surface min-h-[calc(100vh-0px)] py-16 sm:py-24">
        <Container className="max-w-[620px]">
          <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-8 sm:p-10">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground-strong">
                Create account
              </h1>
              <p className="text-sm text-foreground-muted">
                Choose your role to unlock the right dashboard. Create an account with email and password.
              </p>
            </div>

            <Suspense fallback={<div className="mt-8">Loading...</div>}>
              <RegisterForm />
            </Suspense>
          </div>
        </Container>
      </main>
    </PublicRoute>
  );
}


