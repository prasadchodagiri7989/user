import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Camera, ShieldAlert, Sparkles, RefreshCw, AlertCircle, LogOut, Phone, CheckCircle2, ArrowRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL as string;

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, token, logout, updateUser, faceCaptured, setFaceCaptured } = useAuth();
  const location = useLocation();

  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [savingPhone, setSavingPhone] = useState(false);

  const hasPhone = Boolean(user?.phone && user.phone.trim().length > 0);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneInput.trim();
    if (!clean) {
      setPhoneError("Please enter your WhatsApp mobile number.");
      return;
    }
    if (!/^\+?[\d\s\-()]{7,20}$/.test(clean)) {
      setPhoneError("Please enter a valid phone number with 7 to 20 digits (e.g. +91 9876543210).");
      return;
    }

    try {
      setSavingPhone(true);
      setPhoneError(null);
      const res = await fetch(`${API_BASE}/auth/phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: clean }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save WhatsApp number.");
      }

      if (data.user) {
        updateUser(data.user);
      }
    } catch (err: any) {
      setPhoneError(err.message || "Network error. Failed to save phone number.");
    } finally {
      setSavingPhone(false);
    }
  };

  // Trigger camera startup when popup is shown and not captured yet
  useEffect(() => {
    if (!isAuthenticated || !hasPhone || faceCaptured) return;

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
  }, [isAuthenticated, hasPhone, faceCaptured]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. WhatsApp Mobile Number requirement check
  if (!hasPhone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-4 overflow-y-auto">
        <div className="w-full max-w-md border border-slate-800 bg-slate-900 shadow-2xl rounded-2xl p-6 relative overflow-hidden backdrop-blur-md text-white my-8">
          {/* Futuristic ambient blur background elements */}
          <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl -z-10" />
          <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl -z-10" />

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {/* WhatsApp SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.485 5.417 1.486 5.485 0 9.949-4.468 9.952-9.953.002-2.657-1.02-5.155-2.88-7.019C17.266 1.802 14.77 .78 12.01.78c-5.49 0-9.956 4.467-9.96 9.953-.002 1.93.504 3.814 1.468 5.464L2.5 21.5l5.247-1.376zM17.486 14.41c-.3-.15-1.77-.874-2.034-.969-.264-.096-.456-.145-.648.15-.191.294-.741.928-.908 1.11-.168.18-.337.2-.637.05-1.128-.567-2.08-1.002-2.905-2.422-.217-.373.217-.346.621-1.155.082-.165.041-.31-.02-.46-.062-.15-.54-1.3-.74-1.785-.195-.47-.417-.406-.57-.413-.147-.007-.317-.008-.487-.008-.17 0-.447.064-.68.312-.234.248-.894.874-.894 2.13 0 1.256.914 2.47 1.04 2.64.127.17 1.8 2.75 4.36 3.856.61.264 1.085.42 1.455.538.613.195 1.172.167 1.613.1.492-.074 1.77-.723 2.022-1.42.253-.697.253-1.295.177-1.42-.076-.127-.264-.2-.565-.35z" />
              </svg>
            </div>
            <h2 className="font-semibold text-xl tracking-tight">WhatsApp Number Required</h2>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              To access your student portal and courses, please provide your active WhatsApp mobile number.
            </p>
          </div>

          {phoneError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <span>{phoneError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSavePhone} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>WhatsApp Mobile Number</span>
                <span className="text-[11px] text-slate-500">Include country code</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="+91 9876543210"
                  autoFocus
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Course announcements, batch notifications, and login verifications will be sent to this number.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingPhone || !phoneInput.trim()}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-[0.98] disabled:opacity-50"
            >
              {savingPhone ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving WhatsApp Number…</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Out Option */}
          <div className="mt-4 pt-3 border-t border-slate-800/60">
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
