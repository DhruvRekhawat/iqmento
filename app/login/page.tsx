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

  const { login } = useAuth();

  const [email, setEmail] = React.useState("");

  return (
    <form
      className="mt-8 flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        login({ email, role: "STUDENT" });
        router.replace(next ? decodeURIComponent(next) : "/dashboard/student");
      }}
    >
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

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="accent" size="lg" className="w-full">
          Continue
        </Button>
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
                Use your email to access your dashboard. This is frontend-only mock auth.
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


