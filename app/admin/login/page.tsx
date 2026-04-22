"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const { loginWithEmail, logout, isLoading } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await loginWithEmail({ email, password });

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.user?.role !== "ADMIN") {
      logout();
      setError("Admin access only. Use the main site to sign in.");
      return;
    }

    const redirectTo = next ? decodeURIComponent(next) : "/admin";
    router.replace(redirectTo);
  };

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-[rgba(120,53,44,0.25)] bg-[rgba(120,53,44,0.08)] p-3 text-sm text-foreground-strong">
          {error}
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground-muted">
          Email
        </span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="admin@example.com"
          className="h-[52px] w-full rounded-xl border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground-muted">
          Password
        </span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Your password"
          className="h-[52px] w-full rounded-xl border border-[rgba(16,19,34,0.12)] bg-white px-4 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)]"
        />
      </label>

      <div className="flex flex-col gap-3 mt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="h-[52px] w-full rounded-none bg-gradient-to-r from-[#6a5af9] to-[#8b6ef7] text-white text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <Link
          href="/"
          className="h-[52px] w-full rounded-none border border-[rgba(16,19,34,0.15)] bg-white text-sm font-medium text-foreground hover:bg-[rgba(16,19,34,0.03)] transition-colors flex items-center justify-center"
        >
          Back to home
        </Link>
      </div>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-[#eef1f8] flex items-center justify-center py-16 sm:py-24">
      <div className="w-full max-w-[420px] px-4">
        <div className="rounded-2xl bg-white border border-[rgba(16,19,34,0.08)] shadow-[0_8px_40px_rgba(16,19,34,0.10)] p-8 sm:p-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground-strong">
              Admin sign in
            </h1>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Sign in with your admin email and password.
            </p>
          </div>

          <Suspense fallback={<div className="mt-8">Loading...</div>}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}