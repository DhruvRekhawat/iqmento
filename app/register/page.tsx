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

  const { register } = useAuth();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<RegisterRole>("STUDENT");

  const landing = role === "EDUCATOR" ? "/dashboard/educator" : "/dashboard/student";

  return (
    <form
      className="mt-8 flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        register({ name, email, role });
        router.replace(next ? decodeURIComponent(next) : landing);
      }}
    >
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
                <Button type="submit" variant="accent" size="lg" className="w-full">
                  Create & continue
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
                Choose your role to unlock the right dashboard. (Frontend-only mock auth.)
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


