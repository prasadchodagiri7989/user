import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { data: courses, isLoading, error } = useCourses(token);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Loading course...</div>
      </AppLayout>
    );
  }

  if (error || !courses) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Error loading course.</div>
      </AppLayout>
    );
  }

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Course not found.</div>
      </AppLayout>
    );
  }

  const completedTopics = course.modules.reduce((acc, m) => acc + m.topics.filter((t) => t.completed).length, 0);
  const totalTopics = course.modules.reduce((acc, m) => acc + m.topics.length, 0);

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
        <button onClick={() => navigate("/courses")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </button>

        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl">
          <img src={course.thumbnail} alt={course.title} className="w-full h-48 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-foreground/40 flex items-end p-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-background">{course.title}</h1>
              <p className="text-sm text-background/80 mt-1">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{completedTopics} of {totalTopics} topics completed</p>
            <Progress value={course.progress} className="h-2 w-48" />
          </div>
          <Button onClick={() => navigate(`/lesson/${course.id}/${course.modules[0]?.topics[0]?.id || ""}`)}>
            Start Learning
          </Button>
        </div>

        {/* Modules */}
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Course Content</h2>
          <Accordion type="multiple" defaultValue={course.modules.map((m) => m.id)} className="space-y-3">
            {course.modules.map((module) => (
              <AccordionItem key={module.id} value={module.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-sm font-heading font-semibold hover:no-underline">
                  {module.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ul className="space-y-2">
                    {module.topics.map((topic) => (
                      <li
                        key={topic.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                        onClick={() => navigate(`/lesson/${course.id}/${topic.id}`)}
                      >
                        {topic.completed ? (
                          <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm text-card-foreground">{topic.title}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseDetails;
