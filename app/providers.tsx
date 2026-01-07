"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { AuthProvider } from "@/lib/auth";

// Dynamically import AgoraProvider with SSR disabled since it uses browser-only APIs
const AgoraProvider = dynamic(
  () => import("@/components/meeting/AgoraProvider").then((mod) => mod.AgoraProvider),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AgoraProvider>{children}</AgoraProvider>
    </AuthProvider>
  );
}


