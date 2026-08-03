import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { clearSession } from "@/lib/api-client";
import { AlertCircle, Lock, VideoOff, Loader2, Play } from "lucide-react";

interface VideoPlayerProps {
  lessonId: string;
  url?: string;
  title?: string;
  thumbnailUrl?: string;
  className?: string;
}

const API_BASE = import.meta.env.VITE_API_URL as string;

export const VideoPlayer = ({
  lessonId,
  url,
  title,
  thumbnailUrl,
  className,
}: VideoPlayerProps) => {
  const { user, token } = useAuth();
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User interaction and intersection states
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video playback track state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Watermark state
  const [watermarkPos, setWatermarkPos] = useState({ top: 20, left: 20 });
  const [watermarkTime, setWatermarkTime] = useState<string>("");

  // Determine if it is a non-Bunny external video (like YouTube or Livid)
  const isYoutube = url && (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/"));
  const isLivid = url && url.includes("livid.com/watch/");
  const isExternalVideo = isYoutube || isLivid;

  // 0. Handle Viewport Intersection
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 1. Handle Signed URL fetching for Bunny Stream (only after user plays and is visible)
  useEffect(() => {
    if (isExternalVideo || !lessonId || !hasInteracted || !isIntersecting) {
      return;
    }
    if (signedUrl) {
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
  }, [lessonId, token, isExternalVideo, hasInteracted, isIntersecting, signedUrl]);

  // 2. Handle Watermark Position and Timestamp Rotation (only once played)
  useEffect(() => {
    if (!hasInteracted) return;
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
  }, [hasInteracted]);

  // Global coordination listener to pause and unmount this player when another player starts
  useEffect(() => {
    const handleOtherPlay = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.lessonId !== lessonId) {
        setIsPlaying(false);
        setHasInteracted(false);
      }
    };

    window.addEventListener("skylearn-play-video", handleOtherPlay);
    return () => {
      window.removeEventListener("skylearn-play-video", handleOtherPlay);
    };
  }, [lessonId]);

  const handlePlayStart = () => {
    setHasInteracted(true);
    window.dispatchEvent(new CustomEvent("skylearn-play-video", { detail: { lessonId } }));
  };

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
      container.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  };

  // 5. Resolve Embed URL for fallback/external players
  let embedUrl = signedUrl;
  let titleText = title || "Video Player";

  if (isExternalVideo && url) {
    if (isLivid) {
      embedUrl = url.replace("livid.com/watch/", "livid.com/embed/");
      titleText = title || "Livid Player";
    } else if (isYoutube) {
      embedUrl = url.replace("watch?v=", "embed/");
      if (url.includes("youtu.be/")) {
        const videoId = url.substring(url.lastIndexOf("/") + 1);
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      embedUrl += embedUrl.includes("?")
        ? "&rel=0&modestbranding=1"
        : "?rel=0&modestbranding=1";
      titleText = title || "YouTube Player";
    }
  } else {
    titleText = title || "Bunny Stream Secure Player";
  }

  // Append autoplay and preload parameters appropriately once interacted
  if (hasInteracted && embedUrl) {
    if (isYoutube) {
      embedUrl += embedUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
    } else {
      embedUrl += embedUrl.includes("?")
        ? "&autoplay=true&preload=false"
        : "?autoplay=true&preload=false";
    }
  }

  // Render States
  return (
    <div
      ref={containerRef}
      id="player-container"
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-lg bg-black shadow-lg",
        className
      )}
    >
      {/* 1. Custom Beautiful Placeholder State */}
      {!hasInteracted && (
        <div
          onClick={handlePlayStart}
          className="absolute inset-0 w-full h-full bg-slate-950 flex flex-col items-center justify-center cursor-pointer group select-none z-20"
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={titleText}
              className="absolute inset-0 w-full h-full object-cover opacity-45 transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/80 z-0" />

          {/* Central Glassmorphic Play Trigger */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:scale-110">
              <Play className="h-6 w-6 md:h-8 md:w-8 text-white fill-white transition-all duration-300 group-hover:text-primary-foreground" />
            </div>
            {title && (
              <h4 className="font-heading text-sm md:text-base font-semibold text-slate-200 tracking-wide px-6 text-center transition-colors group-hover:text-primary">
                {title}
              </h4>
            )}
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
              Click to load and play
            </span>
          </div>
        </div>
      )}

      {/* A. Loading Skeleton state */}
      {hasInteracted && isLoading && (
        <div className="absolute inset-0 h-full w-full bg-slate-950 flex flex-col items-center justify-center gap-3 z-20">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Securing connection...</span>
        </div>
      )}

      {/* B. Error state display */}
      {hasInteracted && !isLoading && error && (
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
      {hasInteracted && !isLoading && !error && embedUrl && (
        <>
          <iframe
            id="bunny-player"
            src={embedUrl}
            title={titleText}
            className="absolute inset-0 h-full w-full border-0 z-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            loading="lazy"
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
      {hasInteracted && !isLoading && !error && !embedUrl && (
        <div className="absolute inset-0 h-full w-full bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-2 z-20">
          <AlertCircle className="h-10 w-10 text-slate-600" />
          <span className="text-sm">No video source specified.</span>
        </div>
      )}
    </div>
  );
};