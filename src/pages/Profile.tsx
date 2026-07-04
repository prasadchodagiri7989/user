import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/context/AuthContext";
import { useLoginHistory } from "@/hooks/use-courses";
import { Monitor, Smartphone, Globe } from "lucide-react";

const methodLabel = (method: string) =>
  method === "google" ? "Google" : "Email";

const formatIp = (ip: string) => {
  if (ip === "127.0.0.1" || ip === "::1") return "127.0.0.1 (Localhost)";
  return ip;
};

const deviceIcon = (ua: string | null) => {
  if (!ua) return <Globe className="h-3.5 w-3.5" />;
  if (/mobile|iphone|android/i.test(ua)) return <Smartphone className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
};

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, token } = useAuth();
  const { data: history = [], isLoading: historyLoading } = useLoginHistory(token);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Profile Info */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-xl font-bold">
                {initials}
              </div>
            )}
            <div>
              <h3 className="font-heading font-semibold text-card-foreground">{user?.name ?? "—"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
              <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                {user?.role ?? "student"}
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={user?.name ?? ""} className="bg-secondary border-0" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email ?? ""} className="bg-secondary border-0" readOnly />
            </div>
          </div>
          <Button>Save Changes</Button>
        </div>

        {/* Settings */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h2 className="font-heading text-lg font-semibold text-card-foreground">Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates about new courses</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about course progress</p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="outline">Change Password</Button>
          </div>
        </div>

        {/* Login Activity */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold text-card-foreground">Login Activity</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your 10 most recent sign-ins</p>
          </div>

          {historyLoading ? (
            <p className="text-sm text-muted-foreground">Loading activity…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No login history found.</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-4 rounded-lg bg-secondary/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-muted-foreground shrink-0">
                      {deviceIcon(entry.userAgent)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{formatIp(entry.ip)}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {entry.userAgent ?? "Unknown device"}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary mb-1">
                      {methodLabel(entry.method)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
