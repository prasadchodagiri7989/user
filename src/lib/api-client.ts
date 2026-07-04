const TOKEN_KEY = "sl_token";
const USER_KEY  = "sl_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Fetch wrapper that automatically clears the session and redirects to /login
 * when the server returns 401 Unauthorized (expired/invalid token).
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401 || res.status === 403) {
    // Check the error body to differentiate "blocked" vs. "token expired"
    const body = await res.json().catch(() => ({})) as { error?: string };
    const isBlocked = body.error?.toLowerCase().includes("blocked");
    clearSession();
    window.location.href = isBlocked
      ? "/login?error=account_blocked"
      : "/login";
    throw new Error(body.error ?? "Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
