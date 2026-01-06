"use client";

import * as React from "react";
import Link from "next/link";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useParams } from "next/navigation";

import { AuthRoute } from "@/components/auth/AuthRoute";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function MeetingPage() {
  const params = useParams<{ meetingId: string }>();
  const meetingId = params.meetingId;

  const [micOn, setMicOn] = React.useState(true);
  const [camOn, setCamOn] = React.useState(true);

  return (
    <AuthRoute>
      <main className="bg-black text-white min-h-[calc(100vh-0px)] py-10 sm:py-14">
        <Container className="max-w-[1100px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">Meeting</h1>
              <p className="text-sm text-white/65">Meeting ID: {meetingId}</p>
            </div>
            <Button asChild variant="glass" size="sm" className="border-white/20 text-white/90">
              <Link href="/dashboard/student/bookings">Back to bookings</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
            <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-video overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
                    {camOn ? "Video tile (You)" : "Camera off"}
                  </div>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-white/60">
                    Remote tile (placeholder)
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="glass"
                  size="icon"
                  className="border-white/20 text-white"
                  onClick={() => setMicOn((v) => !v)}
                  aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  type="button"
                  variant="glass"
                  size="icon"
                  className="border-white/20 text-white"
                  onClick={() => setCamOn((v) => !v)}
                  aria-label={camOn ? "Turn off camera" : "Turn on camera"}
                >
                  {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                <Button
                  asChild
                  variant="accent"
                  size="md"
                  className="px-6"
                >
                  <Link href="/dashboard/student/bookings">
                    <span className="inline-flex items-center gap-2">
                      <PhoneOff className="h-4 w-4" />
                      Leave
                    </span>
                  </Link>
                </Button>
              </div>
            </section>

            <aside className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                Meeting info
              </div>
              <div className="mt-4 grid gap-3 text-sm text-white/70">
                <div className="rounded-[16px] border border-white/10 bg-black/30 p-4">
                  <div className="text-white/85 font-semibold">Channel</div>
                  <div className="mt-1 break-all">{meetingId}</div>
                </div>
                <div className="rounded-[16px] border border-white/10 bg-black/30 p-4">
                  <div className="text-white/85 font-semibold">Status</div>
                  <div className="mt-1">Mock Agora UI (no real video)</div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </AuthRoute>
  );
}


