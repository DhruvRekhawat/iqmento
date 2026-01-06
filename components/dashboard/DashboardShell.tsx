"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

type NavItem = {
  label: string;
  href: string;
};

export function DashboardShell({
  title,
  subtitle,
  navItems,
  children,
}: {
  title: string;
  subtitle?: string;
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[calc(100vh-0px)] bg-surface">
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-[rgba(16,19,34,0.08)]">
        <Container className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <div className="text-lg font-semibold tracking-tight text-foreground-strong">
                {title}
              </div>
              {subtitle ? (
                <div className="text-sm text-foreground-muted">{subtitle}</div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-sm text-foreground-muted">
                {user?.name}
              </div>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] border transition-colors",
                    active
                      ? "bg-primary-soft border-[rgba(35,81,119,0.35)] text-foreground-strong"
                      : "bg-white/60 border-[rgba(16,19,34,0.10)] text-foreground-muted hover:bg-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </Container>
      </header>

      <main className="py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}


