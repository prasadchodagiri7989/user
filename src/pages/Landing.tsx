import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/use-courses";
import { CourseCard } from "@/components/CourseCard";
import { BookOpen, BarChart3, GraduationCap, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: BookOpen, title: "Structured Learning", description: "Carefully organized modules and topics guide your learning path." },
  { icon: BarChart3, title: "Track Progress", description: "Visual indicators keep you informed of your advancement." },
  { icon: GraduationCap, title: "Interactive Lessons", description: "Engage with rich content designed for deep understanding." },
];

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data: courses = [] } = useCourses();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 md:px-12">
        <span className="font-heading text-xl font-bold text-primary">Cificap</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-30 dark:opacity-15" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-36 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in-up">
            Learn Smarter with Structured Courses
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            A serene, distraction-free environment designed for deep focus and meaningful progress in your learning journey.
          </p>
          <div className="mt-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" onClick={() => navigate("/courses")} className="px-8 text-base">
              Browse Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          Everything you need to focus
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Course Preview */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          Explore our courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="font-heading font-semibold text-card-foreground mb-3">About</h4>
            <p className="text-muted-foreground">A focused learning platform built for clarity.</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-card-foreground mb-3">Courses</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Browse All</li><li>Categories</li><li>New Releases</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-card-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Help Center</li><li>FAQ</li><li>Community</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-card-foreground mb-3">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>hello@cificap.io</li><li>Twitter</li>
            </ul>
          </div>
          
        </div>
        <div className="border-t border-border text-center py-4 text-xs text-muted-foreground">
          © 2026 Cificap. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
