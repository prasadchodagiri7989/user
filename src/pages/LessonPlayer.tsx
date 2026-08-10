import { useParams, useNavigate } from "react-router-dom";
import { useCourses, useMarkTopicComplete } from "@/hooks/use-courses";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import Discussions from "@/components/Discussions";

const LessonPlayer = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: courses, isLoading } = useCourses(token);
  const markComplete = useMarkTopicComplete(token);

  // Fetch replies activity for indicators
  const { data: repliesActivity = [] } = useQuery<any[]>({
    queryKey: ['replies-activity'],
    queryFn: () => apiFetch<any[]>(`${import.meta.env.VITE_API_URL}/discussions/replies-activity`),
    enabled: !!token,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-muted-foreground">Loading course...</div>;
  }

  const course = (courses || []).find((c) => c.id === courseId);
  if (!course) return <div className="flex items-center justify-center h-screen text-muted-foreground">Course not found.</div>;

  const allTopics = course.modules.flatMap((m) => m.topics);
  const currentIndex = allTopics.findIndex((t) => t.id === topicId);
  const currentTopic = allTopics[currentIndex];
  const prevTopic = allTopics[currentIndex - 1];
  const nextTopic = allTopics[currentIndex + 1];
  const completedCount = allTopics.filter((t) => t.completed).length;
  const hasVideo = !!(currentTopic && ((currentTopic.videoId && currentTopic.videoId.trim()) || (currentTopic.videoUrl && currentTopic.videoUrl.trim())));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-background transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:z-10",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <button onClick={() => navigate(`/courses/${courseId}`)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Course
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                {module.title}
              </p>
              <ul className="space-y-1">
                {module.topics.map((topic) => {
                  const hasUnreadReply = (repliesActivity || []).some((reply: any) => {
                    if (reply.topicId !== topic.id) return false;
                    const lastViewed = localStorage.getItem(`lastViewedDiscussion_${topic.id}`);
                    if (!lastViewed) return true;
                    return new Date(reply.createdAt) > new Date(lastViewed);
                  });

                  return (
                    <li
                      key={topic.id}
                      onClick={() => { navigate(`/lesson/${courseId}/${topic.id}`); setSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
                        topic.id === topicId ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {topic.completed ? <CheckCircle className="h-3.5 w-3.5 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                      <span className="truncate flex-1">{topic.title}</span>
                      {hasUnreadReply && (
                        <span 
                          className="h-2 w-2 rounded-full bg-red-500 shrink-0 animate-pulse" 
                          title="New reply in discussions" 
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{completedCount}/{allTopics.length}</span>
          </div>
          <Progress value={(completedCount / allTopics.length) * 100} className="h-1.5" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-heading text-sm font-semibold text-foreground truncate">{currentTopic?.title || "Lesson"}</span>
          <div className="ml-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 focus-entry">
          {hasVideo && (
            <VideoPlayer
              lessonId={currentTopic.id}
              url={currentTopic.videoUrl}
              title={currentTopic.title}
              thumbnailUrl={course.thumbnail}
              videoType={currentTopic.videoType}
            />
          )}

          {/* Notes */}
          <div className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">Lesson Notes</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none pt-2">
                {currentTopic?.notes ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: currentTopic.notes }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No notes have been added for this lesson yet.
                  </p>
                )}
              </div>

              {currentTopic?.attachments && currentTopic.attachments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border space-y-2 select-none">
                  <h4 className="text-sm font-semibold text-foreground">Attachments & Reference PDFs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTopic.attachments.map((att: any) => {
                      const downloadUrl = att.url.startsWith('http') 
                        ? att.url 
                        : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '')}${att.url}`;
                      return (
                        <a
                          key={att.id || att._id}
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors text-xs text-foreground font-medium"
                        >
                          <svg className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate flex-1">{att.name}</span>
                          <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              {prevTopic && (
                <Button variant="outline" onClick={() => navigate(`/lesson/${courseId}/${prevTopic.id}`)}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous Lesson
                </Button>
              )}
              <Button
                variant={currentTopic?.completed ? "default" : "secondary"}
                onClick={() => {
                  if (courseId && topicId) {
                    markComplete.mutate({ courseId, topicId });
                  }
                }}
                disabled={markComplete.isPending}
              >
                {currentTopic?.completed ? (
                  <><CheckCircle className="h-4 w-4 mr-1" /> Completed</>
                ) : (
                  "Mark as Complete"
                )}
              </Button>
              {nextTopic && (
                <Button onClick={() => navigate(`/lesson/${courseId}/${nextTopic.id}`)}>
                  Next Lesson <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            {/* Discussions Thread */}
            {courseId && topicId && (
              <Discussions courseId={courseId} topicId={topicId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
