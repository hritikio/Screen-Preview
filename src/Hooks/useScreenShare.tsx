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

      const [track] = mediaStream.getVideoTracks();

      track.onended = () => {
        cleanup();
        setstatus("stopped");
      };
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        setstatus("denied");
        setError("Screen sharing permission was denied.");
      } else if (err?.name === "AbortError" || err?.name === "NotFoundError") {
        setstatus("cancelled");
        setError("Screen selection was cancelled.");
      } else {
        setstatus("error");
        setError(
          `Screen sharing error: ${err?.message || "Unknown error occurred"}`,
        );
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
