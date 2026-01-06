"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      const next = pathname ? encodeURIComponent(pathname) : "";
      router.replace(next ? `/login?next=${next}` : "/login");
    }
  }, [isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}


