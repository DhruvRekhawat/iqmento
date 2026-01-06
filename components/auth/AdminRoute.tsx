"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      const next = pathname ? encodeURIComponent(pathname) : "";
      router.replace(next ? `/login?next=${next}` : "/login");
      return;
    }
    if (role !== "ADMIN") {
      router.replace(role === "EDUCATOR" ? "/dashboard/educator" : "/dashboard/student");
    }
  }, [isAuthenticated, isHydrated, pathname, role, router]);

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;
  if (role !== "ADMIN") return null;
  return <>{children}</>;
}


