import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { AuthUser } from "@/context/AuthContext";
import { getDeviceInfo } from "@/lib/device-fingerprint";

const API_BASE = import.meta.env.VITE_API_URL as string;

/**
 * Landing page for the Google OAuth redirect.
 * URL: /auth/callback?token=<jwt>
 * Reads the token, decodes the payload, stores it, sends device fingerprint, then navigates to /dashboard.
 */
const AuthCallback = () => {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }

    (async () => {
      try {
        // JWT payload is base64url — decode without verifying (backend already verified)
        const payloadB64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));

        const user: AuthUser = {
          id:     payload.sub,
          name:   payload.name,
          email:  payload.email,
          role:   payload.role,
          avatar: payload.avatar ?? null,
        };

        login(token, user);

        // Non-blocking: send device fingerprint to backend to enrich login history
        getDeviceInfo().then((device) => {
          fetch(`${API_BASE}/auth/device`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(device),
          }).catch(() => {/* ignore */});
        }).catch(() => {/* ignore fingerprinting errors */});

        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/login?error=invalid_token", { replace: true });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing you in…</p>
    </div>
  );
};

export default AuthCallback;
