import { useState } from "react";
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
  const { user, token, updateUser } = useAuth();
  const { data: history = [], isLoading: historyLoading } = useLoginHistory(token);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePhone = async () => {
    if (!phoneNumber.trim()) {
      setPhoneMsg({ type: 'error', text: 'WhatsApp number cannot be empty' });
      return;
    }
    if (!/^\+?[\d\s\-()]{7,20}$/.test(phoneNumber.trim())) {
      setPhoneMsg({ type: 'error', text: 'Please enter a valid phone number (min 7 digits)' });
      return;
    }

    try {
      setPhoneSaving(true);
      setPhoneMsg(null);
      const API_BASE = import.meta.env.VITE_API_URL as string;
      const res = await fetch(`${API_BASE}/auth/phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update phone');
      if (data.user) updateUser(data.user);
      setPhoneMsg({ type: 'success', text: 'WhatsApp number updated successfully!' });
      setEditingPhone(false);
    } catch (err: any) {
      setPhoneMsg({ type: 'error', text: err.message || 'Error updating phone' });
    } finally {
      setPhoneSaving(false);
    }
  };

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
              <Input defaultValue={user?.name ?? ""} className="bg-secondary border-0" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email ?? ""} className="bg-secondary border-0" readOnly />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-semibold">WhatsApp Number</span>
                  <span className="text-[11px] text-muted-foreground font-normal">(Required for portal access)</span>
                </Label>
                {!editingPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneNumber(user?.phone || "");
                      setEditingPhone(true);
                      setPhoneMsg(null);
                    }}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingPhone ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 9876543210"
                      className="bg-secondary border-0 flex-1"
                      autoFocus
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUpdatePhone}
                      disabled={phoneSaving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {phoneSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPhone(false);
                        setPhoneNumber(user?.phone || "");
                        setPhoneMsg(null);
                      }}
                      disabled={phoneSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Input
                  value={user?.phone || "No WhatsApp number provided"}
                  className="bg-secondary border-0 text-foreground"
                  readOnly
                />
              )}
              {phoneMsg && (
                <p className={`text-xs mt-1 ${phoneMsg.type === 'success' ? 'text-emerald-500' : 'text-destructive'}`}>
                  {phoneMsg.text}
                </p>
              )}
            </div>
          </div>
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
