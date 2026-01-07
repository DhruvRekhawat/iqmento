"use client";

import * as React from "react";
import { LocalVideoTrack, useLocalCameraTrack } from "agora-rtc-react";

interface LocalUserVideoProps {
  className?: string;
  muted?: boolean;
}

export function LocalUserVideo({ className, muted = false }: LocalUserVideoProps) {
  const { localCameraTrack, isLoading, error } = useLocalCameraTrack();

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-black/40 ${className || ""}`}>
        <div className="text-sm text-white/60">Camera error: {error.message}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/40 ${className || ""}`}>
        <div className="text-sm text-white/60">Loading camera...</div>
      </div>
    );
  }

  if (!localCameraTrack) {
    return (
      <div className={`flex items-center justify-center bg-black/40 ${className || ""}`}>
        <div className="text-sm text-white/60">Camera off</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <LocalVideoTrack track={localCameraTrack} play={true} className="w-full h-full object-cover" />
      {muted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-sm text-white/60">Camera off</div>
        </div>
      )}
    </div>
  );
}

