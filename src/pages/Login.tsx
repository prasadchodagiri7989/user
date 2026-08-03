import { useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL as string;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const oauthError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const errorMessage =
    oauthError === "oauth_failed" ? "Google sign-in failed. Please try again." :
      oauthError === "invalid_token" ? "Authentication error. Please try again." :
        oauthError === "account_blocked" ? "Your account has been blocked by administrator." :
          error || null;

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Login failed. Please verify credentials.");
      }

      const { token, user } = await response.json();
      login(token, user);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-lg p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">BIM Era Academy</h1>
            <p className="text-sm text-muted-foreground">
              Your focused learning environment
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive text-center">
              {errorMessage}
            </div>
          )}

          {/* Google Sign In */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => { window.location.href = `${API_BASE}/auth/google`; }}
              className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-secondary hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-border" />
            <span className="absolute bg-card px-3 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Not Registered Yet?
            </span>
          </div>

          <a
            href="https://wa.me/919133665544?text=Hello%2C%20I%20would%20like%20to%20register%20and%20purchase%20a%20course%20on%20BIM%20Era%20Academy."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-md active:scale-[0.98] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="shrink-0">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.485 5.417 1.486 5.485 0 9.949-4.468 9.952-9.953.002-2.657-1.02-5.155-2.88-7.019C17.266 1.802 14.77 .78 12.01.78c-5.49 0-9.956 4.467-9.96 9.953-.002 1.93.504 3.814 1.468 5.464L2.5 21.5l5.247-1.376zM17.486 14.41c-.3-.15-1.77-.874-2.034-.969-.264-.096-.456-.145-.648.15-.191.294-.741.928-.908 1.11-.168.18-.337.2-.637.05-1.128-.567-2.08-1.002-2.905-2.422-.217-.373.217-.346.621-1.155.082-.165.041-.31-.02-.46-.062-.15-.54-1.3-.74-1.785-.195-.47-.417-.406-.57-.413-.147-.007-.317-.008-.487-.008-.17 0-.447.064-.68.312-.234.248-.894.874-.894 2.13 0 1.256.914 2.47 1.04 2.64.127.17 1.8 2.75 4.36 3.856.61.264 1.085.42 1.455.538.613.195 1.172.167 1.613.1.492-.074 1.77-.723 2.022-1.42.253-.697.253-1.295.177-1.42-.076-.127-.264-.2-.565-.35z" />
            </svg>
            <span>Register via WhatsApp</span>
          </a>

        </div>
      </div>
    </div>
  );
};

export default Login;
