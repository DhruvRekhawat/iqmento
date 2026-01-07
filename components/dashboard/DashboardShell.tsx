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
  icon?: React.ReactNode;
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
    <div className="min-h-[calc(100vh-0px)] bg-surface pb-20 md:pb-10">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap gap-2 mt-4">
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

      <main className="py-6 md:py-10">
        <Container>{children}</Container>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-[rgba(16,19,34,0.08)] md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[60px]",
                  active
                    ? "bg-primary-soft text-foreground-strong"
                    : "text-foreground-muted"
                )}
              >
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}


