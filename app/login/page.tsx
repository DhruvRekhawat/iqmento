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

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login({ email, password });
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

      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-muted">
          Password
        </span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Enter your password"
          className="h-12 w-full radius-md border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
        />
      </label>

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
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
                Sign in with your email and password to access your dashboard.
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


