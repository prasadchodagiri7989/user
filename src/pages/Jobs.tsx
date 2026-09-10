import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useJobs, UserJob } from "@/hooks/use-jobs";
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  Calendar,
  ExternalLink,
  Filter,
  DollarSign,
  Globe,
  Sparkles,
  X,
  Eye,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  linkedin: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-900" },
  indeed: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-900" },
  naukri: { bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-700 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-900" },
  glassdoor: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900" },
  zip_recruiter: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-400", border: "border-teal-200 dark:border-teal-900" },
  bayt: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900" },
};

function formatSalary(salary: UserJob["salary"]) {
  if (!salary || (!salary.min_amount && !salary.max_amount)) {
    return "Competitive";
  }
  const curr = salary.currency || "₹";
  const interval = salary.interval ? ` / ${salary.interval}` : "";
  if (salary.min_amount && salary.max_amount) {
    return `${curr}${salary.min_amount.toLocaleString()} - ${curr}${salary.max_amount.toLocaleString()}${interval}`;
  }
  if (salary.min_amount) {
    return `From ${curr}${salary.min_amount.toLocaleString()}${interval}`;
  }
  return `Up to ${curr}${salary.max_amount?.toLocaleString()}${interval}`;
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [site, setSite] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [isRemote, setIsRemote] = useState<string>("all");
  const [page, setPage] = useState(1);

  // Selected Job for Detail Modal
  const [selectedJob, setSelectedJob] = useState<UserJob | null>(null);

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      location: location.trim() || undefined,
      site: site !== "all" ? site : undefined,
      job_type: jobType !== "all" ? jobType : undefined,
      is_remote: isRemote === "all" ? undefined : isRemote === "true",
      page,
      limit: 12,
    }),
    [search, location, site, jobType, isRemote, page]
  );

  const { data, isLoading, isError, refetch } = useJobs(filters);

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setSite("all");
    setJobType("all");
    setIsRemote("all");
    setPage(1);
  };

  const hasActiveFilters = search || location || site !== "all" || jobType !== "all" || isRemote !== "all";

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/95 via-primary/85 to-indigo-900 p-8 md:p-10 text-primary-foreground shadow-xl">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Industry Placements & Live Opportunities</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Explore BIM & Tech Jobs
            </h1>
            <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed">
              Curated openings directly sourced from LinkedIn, Indeed, Naukri, and leading industry portals. Apply directly with one click.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Filter Opportunities
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job title, role, skills..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-10 text-sm"
              />
            </div>

            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location (e.g. India, Remote)..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-10 text-sm"
              />
            </div>

            {/* Platform Select */}
            <div>
              <select
                value={site}
                onChange={(e) => {
                  setSite(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Platforms</option>
                <option value="indeed">Indeed</option>
                <option value="linkedin">LinkedIn</option>
                <option value="naukri">Naukri</option>
                <option value="glassdoor">Glassdoor</option>
                <option value="zip_recruiter">ZipRecruiter</option>
                <option value="bayt">Bayt</option>
              </select>
            </div>

            {/* Job Type Select */}
            <div>
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Employment Types</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Remote Filter */}
            <div>
              <select
                value={isRemote}
                onChange={(e) => {
                  setIsRemote(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Workplace Modes</option>
                <option value="true">Remote Only</option>
                <option value="false">On-site / Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            <span>
              Showing <strong className="text-foreground">{data?.jobs?.length || 0}</strong> of{" "}
              <strong className="text-foreground">{data?.total || 0}</strong> verified jobs
            </span>
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border bg-card/60 p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
                <div className="h-16 rounded bg-muted/60" />
                <div className="flex justify-between pt-2">
                  <div className="h-8 w-24 rounded bg-muted" />
                  <div className="h-8 w-28 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-12 text-center">
            <p className="text-sm text-destructive font-medium">Failed to load jobs. Please try again later.</p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4">
              Try Again
            </Button>
          </div>
        ) : !data?.jobs?.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No jobs match your criteria</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Try broadening your search keywords, clearing location filters, or checking back soon for new postings.
            </p>
            {hasActiveFilters && (
              <Button onClick={handleResetFilters} variant="outline" size="sm" className="mt-2">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.jobs.map((job) => {
              const platformTheme =
                PLATFORM_COLORS[job.site?.toLowerCase()] || {
                  bg: "bg-secondary",
                  text: "text-foreground",
                  border: "border-border",
                };

              return (
                <div
                  key={job.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
                >
                  {/* Top: Company info & Platform badge */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      {/* Avatar / Logo Initials */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base shadow-xs">
                        {job.company ? job.company.charAt(0).toUpperCase() : <Building className="h-5 w-5" />}
                      </div>

                      {/* Source badge */}
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                          platformTheme.bg,
                          platformTheme.text,
                          platformTheme.border
                        )}
                      >
                        {job.site || "Portal"}
                      </span>
                    </div>

                    {/* Job Title & Company */}
                    <h3
                      onClick={() => setSelectedJob(job)}
                      className="font-heading font-bold text-foreground text-lg leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                      title={job.title}
                    >
                      {job.title}
                    </h3>

                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-1.5">
                      <Building className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{job.company || "Company Undisclosed"}</span>
                    </p>

                    {/* Meta Pills: Location & Work Mode */}
                    <div className="flex flex-wrap items-center gap-2 mt-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                        <MapPin className="h-3 w-3 shrink-0 text-primary/70" />
                        <span className="truncate max-w-[150px]">{job.location || "Remote / Unspecified"}</span>
                      </span>

                      {job.is_remote && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-lg">
                          <Globe className="h-3 w-3" />
                          Remote
                        </span>
                      )}

                      {job.job_type && (
                        <span className="inline-flex items-center text-[11px] font-medium text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-lg capitalize">
                          {job.job_type}
                        </span>
                      )}
                    </div>

                    {/* Salary & Description snippet */}
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{formatSalary(job.salary)}</span>
                      </div>

                      {job.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {job.description.replace(/<[^>]+>/g, "").slice(0, 160)}...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Posted Date & Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
                    {/* Posted Date */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                      <span>{job.date_posted ? `Posted: ${job.date_posted}` : "Recently posted"}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Details
                      </Button>

                      {/* Apply Here Button */}
                      <a
                        href={job.job_url_direct || job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary/90 shadow-xs transition-all duration-150 active:scale-95"
                      >
                        <span>Apply Here</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-xs font-medium text-muted-foreground px-3">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Job Details Modal */}
        {selectedJob && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedJob(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-start justify-between gap-4 bg-muted/20">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                      {selectedJob.site || "Job"}
                    </span>
                    {selectedJob.is_remote && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                        Remote Opportunity
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold font-heading text-foreground">{selectedJob.title}</h2>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4" />
                    <span>{selectedJob.company}</span>
                    <span>•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{selectedJob.location || "Location Not Specified"}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-foreground">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/40 p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Job Type</span>
                    <span className="font-bold text-foreground capitalize">{selectedJob.job_type || "Full-time"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Compensation</span>
                    <span className="font-bold text-foreground">{formatSalary(selectedJob.salary)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Date Posted</span>
                    <span className="font-bold text-foreground">{selectedJob.date_posted || "Recent"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-0.5">Workplace</span>
                    <span className="font-bold text-foreground">{selectedJob.is_remote ? "Remote" : "On-site"}</span>
                  </div>
                </div>

                {selectedJob.description && (
                  <div>
                    <h4 className="font-bold font-heading text-foreground mb-2">Job Description & Responsibilities</h4>
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed p-4 bg-muted/20 rounded-xl border border-border/50 max-h-72 overflow-y-auto">
                      {selectedJob.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>

                <a
                  href={selectedJob.job_url_direct || selectedJob.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95"
                >
                  <span>Apply on {selectedJob.site ? selectedJob.site.toUpperCase() : "Portal"}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
