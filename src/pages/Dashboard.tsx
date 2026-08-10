import { AppLayout } from "@/components/AppLayout";
import { CourseCard } from "@/components/CourseCard";
import { useCourses, useSuspiciousLoginCheck } from "@/hooks/use-courses";
import { BookOpen, CheckCircle, TrendingUp, ShieldAlert, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Dashboard = () => {
  const { user, token, updateUser } = useAuth();
  const { data: courses = [], isLoading, refetch: refetchCourses } = useCourses(token);
  const { data: suspiciousData } = useSuspiciousLoginCheck(token);
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [batches, setBatches] = useState<{ id: string; name: string; description: string }[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [confirmingApproval, setConfirmingApproval] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const stats = [
    { icon: BookOpen,     label: "My Courses",        value: String(courses.length || "—") },
    { icon: CheckCircle,  label: "Completed Lessons",  value: "14" },
    { icon: TrendingUp,   label: "Learning Progress",  value: "42%" },
  ];

  // Fetch public batches when opening the modal
  const openApprovalModal = async () => {
    setShowApprovalModal(true);
    setLoadingBatches(true);
    setApprovalError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL as string;
      const res = await fetch(`${API_BASE}/auth/batches/public`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
        if (data.length > 0) {
          setSelectedBatchId(data[0].id);
        }
      } else {
        setApprovalError("Failed to fetch batches.");
      }
    } catch (err) {
      setApprovalError("Failed to fetch batches.");
    } finally {
      setLoadingBatches(false);
    }
  };

  const handleConfirmApproval = async () => {
    if (!selectedBatchId) return;
    setConfirmingApproval(true);
    setApprovalError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL as string;
      const res = await fetch(`${API_BASE}/auth/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ batchId: selectedBatchId }),
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        setShowApprovalModal(false);
        refetchCourses();
      } else {
        const errData = await res.json().catch(() => ({}));
        setApprovalError(errData.error || "Failed to approve account.");
      }
    } catch (err) {
      setApprovalError("Failed to approve account.");
    } finally {
      setConfirmingApproval(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
        
        {/* Pending Approval Banner */}
        {user?.status === 'pending' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20 p-5 md:p-6 select-none shadow-sm">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-300">Account Pending Approval</h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-400 max-w-2xl">
                Your account is currently pending administrator verification. You have access to try out the sample course below. To unlock full access, choose your batch.
              </p>
            </div>
            <button
              onClick={openApprovalModal}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg shrink-0"
            >
              Approve Account
            </button>
          </div>
        )}

        {/* Suspicious login banner */}
        {suspiciousData?.isNewDevice && !dismissedAlert && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">New sign-in from an unrecognised device</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Your account was accessed from a new IP{suspiciousData.ip ? ` (${suspiciousData.ip})` : ""}. If this wasn't you, please change your password immediately.
              </p>
            </div>
            <button
              onClick={() => setDismissedAlert(true)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-2 text-muted-foreground">Continue your learning journey.</p>
          <Progress value={42} className="mt-4 h-2 max-w-xs" />
          <p className="mt-2 text-xs text-muted-foreground">Overall progress: 42%</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-heading font-bold text-card-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Continue Learning */}
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-muted-foreground text-sm col-span-full">Loading courses...</p>
            ) : courses.length === 0 ? (
              <p className="text-muted-foreground text-sm col-span-full">No courses available yet.</p>
            ) : (
              courses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} actionLabel="Continue Learning" />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Self-Approval Batch Dialog */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-card-foreground">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading text-lg font-bold text-foreground">Select Batch & Confirm</h2>
              <button onClick={() => setShowApprovalModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingBatches ? (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" /> Fetching batches...
              </div>
            ) : approvalError && batches.length === 0 ? (
              <p className="text-sm text-red-500 py-4 text-center">{approvalError}</p>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Please select your batch from the list below to complete your activation and assign course syllabus permissions.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Select Batch</label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBatchId && (
                  <p className="text-[11px] text-muted-foreground italic bg-secondary/30 p-2 rounded-lg">
                    {batches.find(b => b.id === selectedBatchId)?.description || 'No description for this batch.'}
                  </p>
                )}

                {approvalError && (
                  <p className="text-xs text-red-600 font-medium">{approvalError}</p>
                )}

                <div className="flex gap-3 pt-2 border-t border-border">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmApproval}
                    disabled={confirmingApproval || !selectedBatchId}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/95 disabled:opacity-50 transition-colors shadow-md"
                  >
                    {confirmingApproval && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirm & Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </AppLayout>
  );
};

export default Dashboard;
