"use client";

import * as React from "react";
import { AgoraRTCProvider } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

export function AgoraProvider({ children }: { children: React.ReactNode }) {
  // Create Agora client instance only on client side
  const [client, setClient] = React.useState<ReturnType<typeof AgoraRTC.createClient> | null>(null);

  React.useEffect(() => {
    // Only create client in browser environment
    if (typeof window !== "undefined") {
      const agoraClient = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });
      setClient(agoraClient);
    }
  }, []);

  // Don't render until client is created (client-side only)
  if (!client) {
    return <>{children}</>;
  }

  return <AgoraRTCProvider client={client as unknown as import("agora-rtc-react").IAgoraRTCClient}>{children}</AgoraRTCProvider>;
}

