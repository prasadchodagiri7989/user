import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { CourseCard } from "@/components/CourseCard";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = 'default' | 'alpha' | 'progress-asc' | 'progress-desc';

const Courses = () => {
  const [search, setSearch]         = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort]             = useState<SortOption>('default');
  const [progressMin, setProgressMin] = useState(0);
  const [progressMax, setProgressMax] = useState(100);
  const { token } = useAuth();
  const { data: courses, isLoading } = useCourses(token);

  const hasActiveFilters = sort !== 'default' || progressMin !== 0 || progressMax !== 100;

  const filtered = useMemo(() => {
    let list = courses ?? [];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.modules?.some(m =>
          m.title.toLowerCase().includes(q) ||
          m.topics?.some(t =>
            t.title.toLowerCase().includes(q) ||
            (t.notes ?? '').toLowerCase().includes(q)
          )
        )
      );
    }

    // Progress filter
    list = list.filter(c => {
      const p = c.progress ?? 0;
      return p >= progressMin && p <= progressMax;
    });

    // Sort
    const out = [...list];
    if (sort === 'alpha')          out.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'progress-asc')   out.sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0));
    if (sort === 'progress-desc')  out.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));

    return out;
  }, [courses, search, sort, progressMin, progressMax]);

  const resetFilters = () => {
    setSearch('');
    setSort('default');
    setProgressMin(0);
    setProgressMax(100);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Loading courses...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">Browse all available courses</p>
        </div>

        {/* Search + filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search title, description, topics, notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 bg-secondary border-0"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(v => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              showFilters ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                !
              </span>
            )}
          </button>

          {(hasActiveFilters || search) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          )}

          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} of {(courses ?? []).length} courses
          </span>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-secondary/50 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="default">Default order</option>
                <option value="alpha">Title A→Z</option>
                <option value="progress-desc">Progress: High → Low</option>
                <option value="progress-asc">Progress: Low → High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Progress: {progressMin}% – {progressMax}%
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progressMin}
                  onChange={(e) => setProgressMin(Math.min(Number(e.target.value), progressMax))}
                  className="flex-1 accent-primary"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progressMax}
                  onChange={(e) => setProgressMax(Math.max(Number(e.target.value), progressMin))}
                  className="flex-1 accent-primary"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
            <Search className="h-8 w-8 opacity-30" />
            <p className="text-sm">
              {(courses ?? []).length === 0
                ? 'No courses available yet.'
                : 'No courses match your search or filters.'}
            </p>
            {(search || hasActiveFilters) && (
              <button onClick={resetFilters} className="mt-1 text-xs underline text-primary">
                Clear all
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Courses;

