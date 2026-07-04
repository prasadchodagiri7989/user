import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, Announcement } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api-client";

const API_BASE = import.meta.env.VITE_API_URL as string;

export interface LoginHistoryEntry {
  id: string;
  ip: string;
  userAgent: string | null;
  method: "email" | "google";
  createdAt: string;
}

export const useCourses = (token?: string | null) => {
  return useQuery({
    queryKey: ['courses', token ?? null],
    queryFn: () => apiFetch<Course[]>(`${API_BASE}/courses`),
  });
};

export const useAnnouncements = (token?: string | null) => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiFetch<Announcement[]>(`${API_BASE}/announcements`),
  });
};

export const useLoginHistory = (token: string | null) => {
  return useQuery({
    queryKey: ['loginHistory'],
    enabled: !!token,
    queryFn: () => apiFetch<LoginHistoryEntry[]>(`${API_BASE}/auth/login-history`),
  });
};

export const useMarkTopicComplete = (token: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, topicId }: { courseId: string; topicId: string }) =>
      apiFetch<{ courseId: string; completedTopics: string[]; progress: number }>(
        `${API_BASE}/progress/${courseId}/topics/${topicId}/toggle`,
        { method: 'POST' }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// ── Announcement helpers ──────────────────────────────────────────────────────

export const useUnreadAnnouncementsCount = (token: string | null) => {
  return useQuery({
    queryKey: ['unread-announcements'],
    enabled: !!token,
    refetchInterval: 60_000,
    queryFn: () => apiFetch<{ count: number }>(`${API_BASE}/announcements/unread-count`),
  });
};

export const useMarkAnnouncementRead = (token: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (announcementId: string) =>
      apiFetch(`${API_BASE}/announcements/${announcementId}/read`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['unread-announcements'] });
    },
  });
};

// ── Suspicious login check ────────────────────────────────────────────────────

export interface SuspiciousCheckResult {
  isNewDevice: boolean;
  ip?: string;
  method?: string;
  createdAt?: string;
}

export const useSuspiciousLoginCheck = (token: string | null) => {
  return useQuery({
    queryKey: ['suspicious-check'],
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      apiFetch<SuspiciousCheckResult>(`${API_BASE}/auth/suspicious-check`).catch(() => ({ isNewDevice: false })),
  });
};
