import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/lib/demo-data";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  actionLabel?: string;
}

export function CourseCard({ course, showProgress = true, actionLabel = "View Course" }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card hover-lift cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-heading text-base font-semibold text-card-foreground">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{course.lessonsCount} lessons</span>
          {showProgress && <span>{course.progress}%</span>}
        </div>
        {showProgress && (
          <Progress value={course.progress} className="h-1.5" />
        )}
        <Button
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${course.id}`);
          }}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
