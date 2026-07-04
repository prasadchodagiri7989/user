import { AppLayout } from "@/components/AppLayout";
import { useAnnouncements, useMarkAnnouncementRead, useSuspiciousLoginCheck } from "@/hooks/use-courses";
import { Megaphone, ShieldAlert, X, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/lib/demo-data";

// ─── Announcement Detail Modal ────────────────────────────────────────────────

function AnnouncementModal({
  announcement,
  onClose,
}: {
  announcement: Announcement | null;
  onClose: () => void;
}) {
  if (!announcement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-border shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Megaphone className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              id="announcement-title"
              className="font-heading font-semibold text-foreground text-lg leading-tight"
            >
              {announcement.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {announcement.date || (announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "—")}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {announcement.description || "No additional details provided."}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const Announcements = () => {
  const { token } = useAuth();
  const { data: announcements = [] } = useAnnouncements(token);
  const markRead = useMarkAnnouncementRead(token);
  const { data: suspiciousData } = useSuspiciousLoginCheck(token);
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const unread = announcements.filter((a) => !a.isRead);
  const read   = announcements.filter((a) => a.isRead);

  const handleCardClick = (a: Announcement, isAlreadyRead: boolean) => {
    setSelectedAnnouncement(a);
    if (!isAlreadyRead) markRead.mutate(a.id);
  };

  return (
    <AppLayout>
      <AnnouncementModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />

      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
        {/* Suspicious login alert */}
        {suspiciousData?.isNewDevice && !dismissedAlert && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">New sign-in detected</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Your account was accessed from a new IP address
                {suspiciousData.ip ? ` (${suspiciousData.ip})` : ""}. If this was not you, contact your administrator immediately.
              </p>
            </div>
            <button
              onClick={() => setDismissedAlert(true)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 shrink-0"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Announcements</h1>
            <p className="mt-1 text-sm text-muted-foreground">Platform updates and news</p>
          </div>
          {unread.length > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground px-1.5">
              {unread.length} new
            </span>
          )}
        </div>

        {announcements.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
            No announcements yet.
          </div>
        )}

        {/* Unread */}
        {unread.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unread</h2>
            {unread.map((a) => (
              <button
                key={a.id}
                onClick={() => handleCardClick(a, false)}
                className="w-full text-left rounded-xl border border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors group focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-semibold text-foreground">{a.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{a.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                    <p className="mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to read more →
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Read */}
        {read.length > 0 && (
          <div className="space-y-3">
            {unread.length > 0 && (
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earlier</h2>
            )}
            {read.map((a) => (
              <button
                key={a.id}
                onClick={() => handleCardClick(a, true)}
                className={cn(
                  "w-full text-left rounded-xl border border-border bg-card p-5 opacity-70 hover:opacity-100 transition-opacity group focus:outline-none focus:ring-2 focus:ring-border"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-medium text-muted-foreground">{a.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{a.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to read →
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Announcements;
