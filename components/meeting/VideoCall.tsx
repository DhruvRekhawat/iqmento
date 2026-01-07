"use client";

import * as React from "react";
import {
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { LocalUserVideo } from "./LocalUserVideo";
import { RemoteUserVideo } from "./RemoteUserVideo";
import { Button } from "@/components/ui/button";

interface VideoCallProps {
  appId: string;
  channelName: string;
  token: string;
  uid: number | string;
  onLeave?: () => void;
}

export function VideoCall({ appId, channelName, token, uid, onLeave }: VideoCallProps) {
  const [micEnabled, setMicEnabled] = React.useState(true);
  const [cameraEnabled, setCameraEnabled] = React.useState(true);

  // Join channel
  const { isConnected, error: joinError } = useJoin({
    appid: appId,
    channel: channelName,
    token: token || null,
    uid: typeof uid === "string" ? parseInt(uid, 10) || 0 : uid,
  });

  // Local tracks
  const { localMicrophoneTrack, isLoading: micLoading } = useLocalMicrophoneTrack(micEnabled);
  const { localCameraTrack, isLoading: camLoading } = useLocalCameraTrack(cameraEnabled);

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Play remote audio tracks
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

  const toggleMic = () => {
    setMicEnabled((prev) => !prev);
  };

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev);
  };

  const handleLeave = () => {
    if (onLeave) {
      onLeave();
    }
  };

  if (joinError) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-sm text-white/80">Error joining channel: {joinError.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 min-h-0">
      {/* Video grid - Almost full screen */}
      <div className="flex-1 grid gap-4 p-4 sm:p-6 sm:grid-cols-2 min-h-0">
        {/* Local user video */}
        <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black/40 min-h-[300px]">
          <LocalUserVideo
            className="w-full h-full object-cover"
            muted={!cameraEnabled}
          />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white">
            You {micEnabled ? "" : "(muted)"}
          </div>
        </div>

        {/* Remote users */}
        {remoteUsers.length === 0 ? (
          <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black/40 min-h-[300px]">
            <div className="absolute inset-0 flex items-center justify-center text-base text-white/60">
              Waiting for others to join...
            </div>
          </div>
        ) : (
          remoteUsers.map((user) => (
            <div
              key={user.uid}
              className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black/40 min-h-[300px]"
            >
              <RemoteUserVideo user={user} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white">
                User {user.uid}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Controls - Fixed at bottom */}
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-sm px-6 py-4">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-center gap-4">
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="h-12 w-12 border-white/20 text-white hover:bg-white/10"
            onClick={toggleMic}
            aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="h-12 w-12 border-white/20 text-white hover:bg-white/10"
            onClick={toggleCamera}
            aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {cameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            variant="accent"
            size="lg"
            className="h-12 px-8"
            onClick={handleLeave}
          >
            <span className="inline-flex items-center gap-2">
              <PhoneOff className="h-5 w-5" />
              Leave
            </span>
          </Button>
        </div>
        {/* Status - Subtle */}
        {(micLoading || camLoading || !isConnected) && (
          <div className="text-center text-xs text-white/50 mt-3">
            {!isConnected && <span>Connecting...</span>}
            {micLoading && <span className="ml-2">Loading microphone...</span>}
            {camLoading && <span className="ml-2">Loading camera...</span>}
          </div>
        )}
      </div>
    </div>
  );
}

