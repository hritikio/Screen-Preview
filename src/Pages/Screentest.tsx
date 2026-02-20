import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenShare } from "../Hooks/useScreenShare";
import Button from "../Components/Button";

type ScreenMeta = {
  width?: number;
  height?: number;
  frameRate?: number;
  displaySurface?: string;
};

const Screentest = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { status, stream, error, startScreenShare } = useScreenShare();
  const [meta, setMeta] = useState<ScreenMeta | null>(null);

  // Set up video stream and extract metadata
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

  // Clear video element when stream stops
  useEffect(() => {
    if (status === "stopped" && videoRef.current) {
      videoRef.current.srcObject = null;
      setMeta(null);
    }
  }, [status]);

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Screen Share Test
          </h1>
          <button
            onClick={handleBackHome}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors flex items-center gap-1.5"
          >
            <span>←</span> Back to Home
          </button>
        </div>

        {(status === "idle" || status === "requesting") && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="max-w-lg">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">
                Ready to share
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Click below to start sharing your screen. You'll be able to
                select which tab, window, or entire screen to share.
              </p>
              <Button
                onClick={startScreenShare}
                size="lg"
                disabled={status === "requesting"}
              >
                {status === "requesting"
                  ? "Opening selector..."
                  : "Start Screen Share"}
              </Button>
              {status === "requesting" && (
                <p className="text-sm text-slate-500 mt-4 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></span>
                  Waiting for selection
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error states */}
        {status === "denied" && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="max-w-lg">
              <h3 className="text-lg font-semibold  mb-2 text-red-600">
                Permission denied
              </h3>
              <p className="text-slate-600 mb-6">
                Screen sharing permission was denied. Please try again and allow
                access when prompted.
              </p>
              <Button onClick={startScreenShare} size="lg">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {status === "cancelled" && (
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8">
            <div className="max-w-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Selection cancelled
              </h3>
              <p className="text-slate-600 mb-6">
                You cancelled the screen selection. Ready to try again when you
                are.
              </p>
              <Button onClick={startScreenShare} size="lg">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="max-w-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Error occurred
              </h3>
              <p className="text-slate-600 mb-6 break-words">{error}</p>
              <Button onClick={startScreenShare} size="lg">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Active screen sharing */}
        {status === "granted" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-700 font-medium">Live</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video bg-black"
              />
            </div>

            {meta && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                  Stream Information
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border-l-2 border-slate-900 pl-4">
                    <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                      Resolution
                    </dt>
                    <dd className="text-lg font-semibold text-slate-900">
                      {meta.width} × {meta.height}
                    </dd>
                  </div>
                  {meta.frameRate && (
                    <div className="border-l-2 border-slate-900 pl-4">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Frame Rate
                      </dt>
                      <dd className="text-lg font-semibold text-slate-900">
                        {meta.frameRate} fps
                      </dd>
                    </div>
                  )}
                  {meta.displaySurface && (
                    <div className="border-l-2 border-slate-900 pl-4">
                      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Display Type
                      </dt>
                      <dd className="text-lg font-semibold text-slate-900">
                        {meta.displaySurface === "monitor"
                          ? "Entire Screen"
                          : meta.displaySurface === "window"
                            ? "Window"
                            : meta.displaySurface === "browser"
                              ? "Tab"
                              : meta.displaySurface}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        )}

        {/* Stopped state */}
        {status === "stopped" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="max-w-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Sharing stopped
              </h3>
              <p className="text-slate-600 mb-6">
                Screen sharing has ended. Start a new session or return home.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button onClick={startScreenShare} size="lg">
                  Start New Session
                </Button>
                <button
                  onClick={handleBackHome}
                  className="px-8 py-3 text-base bg-slate-100 text-slate-700 rounded-md font-medium hover:bg-slate-200 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screentest;
