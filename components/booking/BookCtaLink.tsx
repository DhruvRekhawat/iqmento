"use client";

import * as React from "react";
import Link from "next/link";

import { useAuth } from "@/lib/auth";

export function BookCtaLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const finalHref = isAuthenticated ? href : `/login?next=${encodeURIComponent(href)}`;
  return <Link href={finalHref}>{children}</Link>;
}


