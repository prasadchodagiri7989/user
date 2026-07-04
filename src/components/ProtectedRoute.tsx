import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Camera, ShieldAlert, Sparkles, RefreshCw, AlertCircle, LogOut } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL as string;

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, logout } = useAuth();
  const location = useLocation();

  // State to track if face capture is completed for the current session
  const [faceCaptured, setFaceCaptured] = useState(() => {
    return localStorage.getItem("sl_face_captured") === "true";
  });

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Trigger camera startup when popup is shown and not captured yet
  useEffect(() => {
    if (!isAuthenticated || faceCaptured) return;

    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        setIsCapturing(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" }
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error("Camera startup failed:", err);
        setCameraError(err.message || "Failed to access webcam. Please verify permissions.");
      } finally {
        setIsCapturing(false);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isAuthenticated, faceCaptured]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle capture image from active camera stream
  const handleCapture = async () => {
    if (!videoRef.current || !stream) return;

    try {
      setUploading(true);
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw the current video frame onto canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      await uploadFaceImage(dataUrl);
    } catch (err: any) {
      alert("Error capturing image: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  // Handle simulating face capture (developer test mode fallback)
  const handleSimulateCapture = async () => {
    try {
      setUploading(true);
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Draw premium simulation card template
        const grad = ctx.createRadialGradient(320, 240, 50, 320, 240, 300);
        grad.addColorStop(0, "#1e1b4b");
        grad.addColorStop(1, "#030712");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 640, 480);

        // Grid scanlines
        ctx.strokeStyle = "rgba(99, 102, 241, 0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 640; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 480);
          ctx.stroke();
        }
        for (let j = 0; j < 480; j += 20) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(640, j);
          ctx.stroke();
        }

        // Camera focus bracket borders
        ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
        ctx.lineWidth = 4;
        ctx.strokeRect(200, 100, 240, 280);

        // Face guidelines outline
        ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
        ctx.beginPath();
        ctx.arc(320, 220, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 6;
        ctx.stroke();

        // Simulated shoulders
        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.beginPath();
        ctx.ellipse(320, 390, 160, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Text labels
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SIMULATED FACE CARD", 320, 430);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText("Sandbox / Development Test Mode", 320, 455);
      }

      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      await uploadFaceImage(dataUrl);
    } catch (err: any) {
      alert("Simulation failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  // Upload image buffer string to backend capture route
  const uploadFaceImage = async (dataUrl: string) => {
    const response = await fetch(`${API_BASE}/auth/capture-face`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image: dataUrl }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to upload face image");
    }

    // Capture success! Clear tracks, update state
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    localStorage.setItem("sl_face_captured", "true");
    setFaceCaptured(true);
  };

  // Show webcam popup if user is logged in but hasn't completed capture for this session
  if (!faceCaptured) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 overflow-y-auto">
        <div className="w-full max-w-md border border-slate-800 bg-slate-900 shadow-2xl rounded-2xl p-6 relative overflow-hidden backdrop-blur-md text-white my-8">
          {/* Futuristic ambient blur background element */}
          <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl -z-10" />

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 animate-pulse">
              <Camera className="h-6 w-6" />
            </div>
            <h2 className="font-semibold text-xl tracking-tight">Verify Face Identity</h2>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Every login success requires capturing your face card to proceed to your learning portal.
            </p>
          </div>

          {/* Live webcam feed area */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center group mb-6 shadow-inner">
            {cameraError ? (
              <div className="p-4 text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
                <p className="text-xs text-red-300 font-medium">Camera access blocked or unavailable</p>
                <p className="text-[11px] text-slate-500 max-w-[280px] mx-auto leading-normal">
                  Ensure your webcam is connected and the browser has permission to access it.
                </p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {/* Futurisic focus box brackets */}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/20 flex items-center justify-center">
                  <div className="w-[140px] h-[160px] border-2 border-indigo-500/40 rounded-full relative flex items-center justify-center">
                    {/* Pulsing focal scanline */}
                    <div className="absolute inset-x-0 h-0.5 bg-indigo-400/60 shadow-[0_0_8px_rgba(99,102,241,0.8)] top-0 animate-bounce" />
                    <Sparkles className="h-4 w-4 text-indigo-400/60" />
                  </div>
                </div>

                {isCapturing && (
                  <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center backdrop-blur-sm">
                    <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls button actions */}
          <div className="space-y-3">
            {!cameraError && (
              <button
                type="button"
                onClick={handleCapture}
                disabled={isCapturing || uploading || !stream}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 active:scale-[0.98] disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Uploading face card…</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    <span>Capture Face Card</span>
                  </>
                )}
              </button>
            )}

            {/* Test Simulation mode option fallback when camera fails or for developer test checks */}
            {(cameraError || import.meta.env.DEV) && (
              <button
                type="button"
                onClick={handleSimulateCapture}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-slate-700/40 active:scale-[0.98] disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" />
                )}
                <span>Simulate Face Capture (Test Mode)</span>
              </button>
            )}

            {/* Logout/Exit fallback */}
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 py-1 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Cancel & Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
