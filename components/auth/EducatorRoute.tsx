"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

export function EducatorRoute({ children }: { children: React.ReactNode }) {
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
    if (role !== "EDUCATOR") {
      router.replace(role === "ADMIN" ? "/admin" : "/dashboard/student");
    }
  }, [isAuthenticated, isHydrated, pathname, role, router]);

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;
  if (role !== "EDUCATOR") return null;
  return <>{children}</>;
}


