import { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  status?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "sl_token";
const USER_KEY  = "sl_user";

/** Returns true if a JWT token string is expired */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const expiresAt = localStorage.getItem("sl_session_expires_at");
    if (t && (isTokenExpired(t) || (expiresAt && Date.now() >= Number(expiresAt)))) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem("sl_session_expires_at");
      localStorage.removeItem("sl_face_captured");
      return null;
    }
    return t;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const expiresAt = localStorage.getItem("sl_session_expires_at");
    if (t && (isTokenExpired(t) || (expiresAt && Date.now() >= Number(expiresAt)))) return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  // Periodically check token & session expiry (every 10 seconds for snappy updates)
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const expiresAt = localStorage.getItem("sl_session_expires_at");
      const isSessionExpired = expiresAt ? Date.now() >= Number(expiresAt) : false;

      if (isTokenExpired(token) || isSessionExpired) {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem("sl_session_expires_at");
        localStorage.removeItem("sl_face_captured");
        window.location.href = "/login";
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [token]);

  // Poll for approval status if status is 'pending'
  useEffect(() => {
    if (!token || user?.status !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL as string;
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const updatedUser = await res.json();
          if (updatedUser.status !== 'pending') {
            setUser(updatedUser);
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
          }
        }
      } catch (err) {
        console.error("Error polling user status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token, user?.status]);

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem("sl_session_expires_at", String(Date.now() + 4 * 60 * 60 * 1000));
    localStorage.setItem("sl_face_captured", "false");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("sl_session_expires_at");
    localStorage.removeItem("sl_face_captured");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
      {user?.status === 'pending' && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 text-white">
          <div className="w-full max-w-md border border-slate-800 bg-slate-900 shadow-2xl rounded-2xl p-6 relative overflow-hidden text-center space-y-4">
            <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
            <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl -z-10" />
            
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 animate-pulse mx-auto">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h2 className="font-semibold text-xl tracking-tight">Access Pending Approval</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              admin need to approve your access request, please contact admin.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking approval status automatically...
            </div>
            <button
              onClick={logout}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 hover:underline focus:outline-none"
            >
              Sign out / Use another account
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
