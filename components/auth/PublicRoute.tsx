"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

function defaultLanding(role: string | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "EDUCATOR") return "/dashboard/educator";
  if (role === "STUDENT") return "/dashboard/student";
  return "/";
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, isHydrated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) {
      router.replace(defaultLanding(role));
    }
  }, [isAuthenticated, isHydrated, role, router]);

  if (!isHydrated) return null;
  if (isAuthenticated) return null;
  return <>{children}</>;
}


