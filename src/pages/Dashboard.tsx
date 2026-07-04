import { AppLayout } from "@/components/AppLayout";
import { CourseCard } from "@/components/CourseCard";
import { useCourses, useSuspiciousLoginCheck } from "@/hooks/use-courses";
import { BookOpen, CheckCircle, TrendingUp, ShieldAlert, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Dashboard = () => {
  const { user, token } = useAuth();
  const { data: courses = [], isLoading } = useCourses(token);
  const { data: suspiciousData } = useSuspiciousLoginCheck(token);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const stats = [
    { icon: BookOpen,     label: "My Courses",        value: String(courses.length || "—") },
    { icon: CheckCircle,  label: "Completed Lessons",  value: "14" },
    { icon: TrendingUp,   label: "Learning Progress",  value: "42%" },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
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
    </AppLayout>
  );
};

export default Dashboard;
