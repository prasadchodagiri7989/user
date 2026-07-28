import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { clearSession } from "@/lib/api-client";
import { AlertCircle, Lock, VideoOff, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  lessonId: string;
  url?: string;
  className?: string;
}

const API_BASE = import.meta.env.VITE_API_URL as string;

export const VideoPlayer = ({ lessonId, url, className }: VideoPlayerProps) => {
  const { user, token } = useAuth();
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Video playback track state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Watermark state
  const [watermarkPos, setWatermarkPos] = useState({ top: 20, left: 20 });
  const [watermarkTime, setWatermarkTime] = useState<string>("");

  // Determine if it is a non-Bunny external video (like YouTube or Livid)
  const isYoutube = url && (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/"));
  const isLivid = url && url.includes("livid.com/watch/");
  const isExternalVideo = isYoutube || isLivid;

  // 1. Handle Signed URL fetching for Bunny Stream
  useEffect(() => {
    if (isExternalVideo || !lessonId) {
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setSignedUrl("");

    const fetchSignedUrl = async () => {
      try {
        const res = await fetch(`${API_BASE}/lessons/${lessonId}/video`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.status === 401) {
          if (isMounted) {
            clearSession();
            window.location.href = "/login";
          }
          return;
        }

        if (res.status === 403) {
          if (isMounted) {
            setError("You are not enrolled in this course.");
          }
          return;
        }

        if (res.status === 404) {
          if (isMounted) {
            setError("Video not found.");
          }
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setSignedUrl(data.url);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load video.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [lessonId, token, isExternalVideo]);

  // 2. Handle Watermark Position and Timestamp Rotation
  useEffect(() => {
    const updateWatermark = () => {
      // Constrain position between 10% and 80% to avoid clipping outside player bounds
      const top = Math.floor(Math.random() * 65) + 10;
      const left = Math.floor(Math.random() * 55) + 10;
      setWatermarkPos({ top, left });
      setWatermarkTime(new Date().toLocaleString());
    };

    updateWatermark();

    const interval = setInterval(updateWatermark, 20000); // Update every 20 seconds
    return () => clearInterval(interval);
  }, []);

  // 3. Command dispatcher via postMessage to play/pause the video iframe
  const sendPlayerCommand = (iframeEl: HTMLIFrameElement, command: "play" | "pause") => {
    if (!iframeEl.contentWindow) return;
    try {
      // Send multiple formats for maximum compatibility with different Player.js implementations
      iframeEl.contentWindow.postMessage(JSON.stringify({ method: command }), "*");
      iframeEl.contentWindow.postMessage(JSON.stringify({ api: command }), "*");
      iframeEl.contentWindow.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
      iframeEl.contentWindow.postMessage({ api: command }, "*");
      iframeEl.contentWindow.postMessage({ method: command }, "*");
    } catch (e) {
      console.warn("Unable to dispatch player command:", e);
    }
  };

  // 4. Click handlers on the transparent overlay
  const handleOverlayClick = () => {
    const iframeEl = document.getElementById("bunny-player") as HTMLIFrameElement | null;
    if (!iframeEl) return;

    const nextState = !isPlaying;
    setIsPlaying(nextState);
    sendPlayerCommand(iframeEl, nextState ? "play" : "pause");
  };

  const handleOverlayDoubleClick = () => {
    const container = document.getElementById("player-container");
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // 5. Resolve Embed URL for fallback/external players
  let embedUrl = signedUrl;
  let title = "Video Player";

  if (isExternalVideo && url) {
    if (isLivid) {
      embedUrl = url.replace("livid.com/watch/", "livid.com/embed/");
      title = "Livid Player";
    } else if (isYoutube) {
      embedUrl = url.replace("watch?v=", "embed/");
      if (url.includes("youtu.be/")) {
        const videoId = url.substring(url.lastIndexOf("/") + 1);
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      embedUrl += embedUrl.includes("?")
        ? "&rel=0&modestbranding=1"
        : "?rel=0&modestbranding=1";
      title = "YouTube Player";
    }
  } else {
    title = "Bunny Stream Secure Player";
  }

  // Render States
  return (
    <div
      id="player-container"
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-lg bg-black shadow-lg",
        className
      )}
    >
      {/* A. Loading Skeleton state */}
      {isLoading && (
        <div className="absolute inset-0 h-full w-full bg-slate-950 flex flex-col items-center justify-center gap-3 z-20">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Securing connection...</span>
        </div>
      )}

      {/* B. Error state display */}
      {!isLoading && error && (
        <div className="absolute inset-0 h-full w-full bg-slate-950 flex flex-col items-center justify-center text-center p-6 gap-3 z-20">
          {error.includes("enrolled") ? (
            <Lock className="h-12 w-12 text-rose-500 animate-bounce" />
          ) : (
            <VideoOff className="h-12 w-12 text-slate-500" />
          )}
          <h3 className="font-heading text-lg font-semibold text-slate-200">
            {error.includes("enrolled") ? "Access Restricted" : "Playback Error"}
          </h3>
          <p className="text-sm text-slate-400 max-w-xs">{error}</p>
        </div>
      )}

      {/* C. Video player rendering */}
      {!isLoading && !error && embedUrl && (
        <>
          <iframe
            id="bunny-player"
            src={embedUrl}
            title={title}
            className="absolute inset-0 h-full w-full border-0 z-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />

          {/* 
            Transparent security overlay covering the main video frame (top 85%).
            This blocks browser context menus (inspect options) and handles left-clicks to toggle playback.
            Leaves the bottom controls bar (bottom 15%) interactive for native seeking, volume, and settings.
          */}
          <div
            className="absolute top-0 left-0 w-full h-[85%] bg-transparent z-10 cursor-pointer"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={handleOverlayClick}
            onDoubleClick={handleOverlayDoubleClick}
          />

          {/* Watermark Overlay (15% opacity, dynamic position every 20s, mix-blend visible, click-through allowed) */}
          {user && (
            <div
              className="absolute font-sans text-[11px] md:text-[13px] font-semibold select-none pointer-events-none text-white/15 mix-blend-difference bg-black/10 px-2 py-1 rounded border border-white/5 transition-all duration-1000 ease-in-out z-10 whitespace-nowrap"
              style={{
                top: `${watermarkPos.top}%`,
                left: `${watermarkPos.left}%`,
              }}
            >
              <div className="leading-tight text-center">
                <p className="font-bold">{user.name}</p>
                <p className="text-[9px] md:text-[10px] opacity-80">{user.email}</p>
                <p className="text-[8px] md:text-[9px] opacity-60 font-mono mt-0.5">{watermarkTime}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* D. Fallback empty state */}
      {!isLoading && !error && !embedUrl && (
        <div className="absolute inset-0 h-full w-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-2 z-20">
          <AlertCircle className="h-10 w-10 text-slate-600" />
          <span className="text-sm">No video source specified.</span>
        </div>
      )}
    </div>
  );
};