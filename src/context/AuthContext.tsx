import { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
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
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
