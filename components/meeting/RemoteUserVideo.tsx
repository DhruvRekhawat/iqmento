"use client";

import * as React from "react";
import { RemoteVideoTrack, useRemoteAudioTracks, useRemoteUsers } from "agora-rtc-react";
import type { IRemoteVideoTrack } from "agora-rtc-sdk-ng";

interface RemoteUserVideoProps {
  user: ReturnType<typeof useRemoteUsers>[0];
  className?: string;
}

export function RemoteUserVideo({ user, className }: RemoteUserVideoProps) {
  const { audioTracks } = useRemoteAudioTracks([user]);

  React.useEffect(() => {
    if (audioTracks) {
      audioTracks.forEach((track) => {
        track.play();
      });
    }
    return () => {
      if (audioTracks) {
        audioTracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, [audioTracks]);

  const hasVideo = user.hasVideo;
  const videoTrack = user.videoTrack as IRemoteVideoTrack | undefined;

  if (!hasVideo || !videoTrack) {
    return (
      <div className={`flex items-center justify-center bg-black/40 ${className || ""}`}>
        <div className="text-sm text-white/60">
          {user.uid ? `User ${user.uid}` : "Remote user"} - Camera off
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <RemoteVideoTrack track={videoTrack as unknown as import("agora-rtc-react").IRemoteVideoTrack} play={true} className="w-full h-full object-cover" />
    </div>
  );
}

