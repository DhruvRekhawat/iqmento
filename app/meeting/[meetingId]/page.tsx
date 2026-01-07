"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { Button } from "@/components/ui/button";
import { VideoCall } from "@/components/meeting/VideoCall";
import { useAuth } from "@/lib/auth";
import { getAgoraToken, generateUidFromString } from "@/lib/agora";

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("iqmento.auth.token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function MeetingPage() {
  const params = useParams<{ meetingId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const meetingId = params.meetingId;

  const [booking, setBooking] = React.useState<{ id: string; studentId: string; educatorId: string; service: { title: string } | null; educator: { name: string } | null; slot: { startTime: string } | null } | null>(null);
  const [tokenData, setTokenData] = React.useState<{
    token: string;
    appId: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Find booking and validate access
  React.useEffect(() => {
    if (!user || !meetingId) return;

    async function fetchBooking() {
      try {
        setIsLoading(true);
        
        // Fetch booking from API
        const response = await fetch(`/api/bookings/${meetingId}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Booking not found");
          } else if (response.status === 403) {
            setError("You don't have access to this meeting");
          } else {
            setError("Failed to load booking");
          }
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const foundBooking = data.booking;

        // Additional validation
        if (!user || (foundBooking.studentId !== user.id && foundBooking.educatorId !== user.id)) {
          setError("You don't have access to this meeting");
          setIsLoading(false);
          return;
        }

        setBooking(foundBooking);

        // Generate token
        const channelName = foundBooking.id; // Use booking ID as channel name for privacy
        const uid = generateUidFromString(user.id);

        const tokenResponse = await getAgoraToken(channelName, uid, "publisher");
        setTokenData({
          token: tokenResponse.token,
          appId: tokenResponse.appId,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize meeting:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize meeting");
        setIsLoading(false);
      }
    }

    fetchBooking();
  }, [user, meetingId]);

  const handleLeave = () => {
    // Redirect based on user role
    const redirectPath = user?.role === "EDUCATOR" ? "/dashboard/educator/bookings" : "/dashboard/student/bookings";
    router.push(redirectPath);
  };

  if (isLoading) {
    return (
      <AuthRoute>
        <main className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Initializing meeting...</div>
            <div className="text-sm text-white/60">Please wait</div>
          </div>
        </main>
      </AuthRoute>
    );
  }

  if (error || !booking || !tokenData) {
    return (
      <AuthRoute>
        <main className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2 text-red-400">Error</div>
            <div className="text-sm text-white/60 mb-4">{error || "Failed to load meeting"}</div>
            <Button asChild variant="glass" size="sm" className="border-white/20 text-white/90">
              <Link href={user?.role === "EDUCATOR" ? "/dashboard/educator/bookings" : "/dashboard/student/bookings"}>
                Back to bookings
              </Link>
            </Button>
          </div>
        </main>
      </AuthRoute>
    );
  }

  const uid = generateUidFromString(user!.id);

  // Format scheduled time
  const formatScheduledTime = (startTime: string) => {
    try {
      const date = new Date(startTime);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "";
    }
  };

  const scheduledTime = booking?.slot?.startTime ? formatScheduledTime(booking.slot.startTime) : "";

  return (
    <AuthRoute>
      <main className="bg-black text-white min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 px-6 py-4">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <span>{booking?.service?.title || "Service"}</span>
              <span className="text-white/40">|</span>
              <span className="text-white/80">{booking?.educator?.name || "Educator"}</span>
            </div>
            <div className="flex items-center gap-4">
              {scheduledTime && (
                <div className="text-sm text-white/60 hidden sm:block">{scheduledTime}</div>
              )}
              <Button asChild variant="glass" size="sm" className="border-white/20 text-white/90">
                <Link href={user?.role === "EDUCATOR" ? "/dashboard/educator/bookings" : "/dashboard/student/bookings"}>
                  Back to bookings
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Video Section - Almost Full Screen */}
        <div className="flex-1 flex flex-col min-h-0">
          <VideoCall
            appId={tokenData.appId}
            channelName={booking.id}
            token={tokenData.token}
            uid={uid}
            onLeave={handleLeave}
          />
        </div>
      </main>
    </AuthRoute>
  );
}


