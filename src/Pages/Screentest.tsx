import { useEffect, useState, useRef } from "react";
import { useScreenShare } from "../Hooks/useScreenShare";
import Button from "../Components/Button";

type ScreenMeta = {
  width?: number;
  height?: number;
  frameRate?: number;
  displaySurface?: string;
};

const Screentest = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { status, stream, error, startScreenShare } = useScreenShare();
  const [meta, setMeta] = useState<ScreenMeta | null>(null);

  useEffect(() => {
    if (!stream || !videoRef.current) return;

    videoRef.current.srcObject = stream;

    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    setMeta({
      width: settings.width,
      height: settings.height,
      frameRate: settings.frameRate,
      displaySurface: settings.displaySurface,
    });
  }, [stream]);

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold">Screen Share Test</h2>

        {/* IDLE */}
        <Button
          onClick={startScreenShare}
          size="lg"
          disabled={status !== "idle"}
        >
          {status === "requesting"
            ? "Waiting for permission..."
            : "Start Screen Share"}
        </Button>

        {status === "requesting" && (
          <p className="text-blue-600">Waiting for screen selection…</p>
        )}

        {status === "denied" && (
          <p className="text-red-600">Permission denied.</p>
        )}

        {status === "cancelled" && (
          <p className="text-yellow-600">Screen selection cancelled.</p>
        )}

        {status === "error" && <p className="text-red-600">{error}</p>}

        {status === "granted" && (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">Screen stream active</p>

            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full rounded-lg border"
            />

            {meta && (
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Resolution:</strong> {meta.width} × {meta.height}
                </p>

                {meta.frameRate && (
                  <p>
                    <strong>Frame rate:</strong> {meta.frameRate} fps
                  </p>
                )}

                {meta.displaySurface && (
                  <p>
                    <strong>Display type:</strong> {meta.displaySurface}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {status === "stopped" && (
          <div className="space-y-4">
            <p className="text-gray-600">Screen sharing stopped.</p>

            <div className="flex gap-4">
              <Button onClick={startScreenShare} size="lg">
                Retry Screen Test
              </Button>
              <Button onClick={() => window.history.back()} size="lg">
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screentest;
