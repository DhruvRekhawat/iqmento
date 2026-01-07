/**
 * Agora utility functions
 */

export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  expirationTime: number;
}

/**
 * Request an Agora RTC token from the server
 */
export async function getAgoraToken(
  channelName: string,
  uid: number | string,
  role: "publisher" | "subscriber" = "publisher"
): Promise<AgoraTokenResponse> {
  // Get auth token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch("/api/agora/token", {
    method: "POST",
    headers,
    body: JSON.stringify({
      channelName,
      uid: typeof uid === "string" ? parseInt(uid, 10) || 0 : uid,
      role,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to get Agora token");
  }

  return response.json();
}

/**
 * Generate a stable numeric UID from a string (for consistent user identification)
 * Agora requires UID to be in range [0, 65535]
 */
export function generateUidFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Ensure positive number and within Agora's UID range [0, 65535]
  return Math.abs(hash) % 65536;
}

