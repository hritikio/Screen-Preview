import { useState, useEffect, useCallback, useRef } from "react";

export type ScreenShareStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "cancelled"
  | "denied"
  | "error"
  | "stopped";

export const useScreenShare = () => {
  const [status, setstatus] = useState<ScreenShareStatus>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const startScreenShare = useCallback(async () => {
    setError(null);
    setstatus("requesting");

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 30 },
        },
        audio: false,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setstatus("granted");

      console.log("Screen share started", mediaStream.getVideoTracks());

      const [track] = mediaStream.getVideoTracks();

      console.log("Track is ", track);
      console.log("track on ended is ", track.onended);
      console.log("track setting is ", track.getSettings());


      track.onended = () => {
        console.log("Screen share stopped");
        cleanup();
        setstatus("stopped");
      };
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        setstatus("denied");
      } else if (err?.name === "AbortError") {
        setstatus("cancelled");
      } else {
        setstatus("error");
        setError("Unknown screen sharing error");
      }
    }
  }, []);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    stream,
    error,
    startScreenShare,
  };
};
