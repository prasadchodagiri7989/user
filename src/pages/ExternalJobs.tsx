import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  Calendar,
  ExternalLink,
  DollarSign,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  X,
  Eye,
  Globe,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ExternalJobItem {
  title: string;
  company: string;
  location?: string;
  site?: string;
  job_type?: string;
  is_remote?: boolean;
  salary?: {
    min_amount?: number | null;
    max_amount?: number | null;
    currency?: string;
    interval?: string;
  };
  min_amount?: number | null;
  max_amount?: number | null;
  currency?: string;
  interval?: string;
  date_posted?: string;
  job_url: string;
  job_url_direct?: string;
  description?: string;
  skills?: string[];
}

interface ExternalJobWebsiteData {
  id: string;
  title: string;
  description: string;
  jobsCount: number;
  jobs: ExternalJobItem[];
  createdAt: string;
  views: number;
}

const LOGO_COLORS = [
  { bg: "#d92d20", text: "#ffffff" },
  { bg: "#0f172a", text: "#ffffff" },
  { bg: "#1c1917", text: "#fde047" },
  { bg: "#0284c7", text: "#ffffff" },
  { bg: "#1e3a8a", text: "#ffffff" },
  { bg: "#0d9488", text: "#ffffff" },
  { bg: "#059669", text: "#ffffff" },
  { bg: "#4f46e5", text: "#ffffff" },
  { bg: "#18181b", text: "#38bdf8" },
];

function getCompanyColor(companyName: string) {
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function getCompanyInitials(name: string): string {
  if (!name) return "JB";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function formatSalary(job: ExternalJobItem) {
  const min = job.salary?.min_amount ?? job.min_amount;
  const max = job.salary?.max_amount ?? job.max_amount;
  const curr = job.salary?.currency || job.currency || "₹";
  const interval = job.salary?.interval || job.interval ? ` / ${job.salary?.interval || job.interval}` : "";

  if (!min && !max) return null;
  if (min && max) {
    return `${curr}${min.toLocaleString()} - ${curr}${max.toLocaleString()}${interval}`;
  }
  if (min) return `From ${curr}${min.toLocaleString()}${interval}`;
  return `Up to ${curr}${max?.toLocaleString()}${interval}`;
}

export default function ExternalJobs() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ExternalJobWebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modal
  const [selectedJob, setSelectedJob] = useState<ExternalJobItem | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/external-jobs/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "This jobs link does not exist or has expired." : "Failed to load jobs");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const filteredJobs = useMemo(() => {
    if (!data?.jobs) return [];
    const q = search.toLowerCase().trim();
    return data.jobs.filter((j) => {
      if (remoteOnly && !j.is_remote) return false;
      if (!q) return true;
      const t = (j.title || "").toLowerCase();
      const c = (j.company || "").toLowerCase();
      const l = (j.location || "").toLowerCase();
      const d = (j.description || "").toLowerCase();
      const s = (j.skills || []).join(" ").toLowerCase();
      return t.includes(q) || c.includes(q) || l.includes(q) || d.includes(q) || s.includes(q);
    });
  }, [data?.jobs, search, remoteOnly]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto animate-pulse">
            <Briefcase className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold text-slate-200">Loading published job opportunities...</p>
          <p className="text-sm text-slate-400">Connecting to BIM Era Academy live career portal</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <X className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Link Not Found</h2>
          <p className="text-slate-400 text-sm">{error || "This published external jobs website is unavailable."}</p>
          <div className="pt-2">
            <Link to="/">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white tracking-tight leading-none">BIM Era Academy</span>
              <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase mt-0.5">Career Opportunities</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className={cn(
                "rounded-xl border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold gap-1.5 transition-all",
                copiedLink && "border-emerald-500/50 bg-emerald-950/30 text-emerald-300"
              )}
            >
              {copiedLink ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedLink ? "Link Copied!" : "Share Link"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Curated Career Opportunities</span>
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            <span>{data.jobsCount} Positions</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {data.title}
              </h1>
              {data.description && (
                <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
                  {data.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-900/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl w-fit shrink-0">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Published {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-indigo-400" />
                <span>{data.views} Views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/70 border border-slate-800 p-3 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, company, skills, or city..."
              className="pl-10 bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-10 text-sm focus:border-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={remoteOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={cn(
                "rounded-xl h-10 text-xs font-semibold gap-1.5 transition-all",
                remoteOnly
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800"
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Remote Only</span>
            </Button>

            <span className="text-xs font-medium text-slate-400 px-2 whitespace-nowrap">
              Showing <strong className="text-white font-bold">{filteredJobs.length}</strong> of {data.jobsCount}
            </span>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 border border-slate-800/80 rounded-3xl space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-slate-300">No jobs match your filter criteria</p>
            <p className="text-xs text-slate-500">Try clearing or broadening your search terms.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setRemoteOnly(false);
              }}
              className="mt-2 rounded-xl text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job, idx) => {
              const color = getCompanyColor(job.company || "");
              const initials = getCompanyInitials(job.company || "");
              const sal = formatSalary(job);
              const applyHref = job.job_url_direct || job.job_url || "#";

              return (
                <div
                  key={`${job.job_url}-${idx}`}
                  className="group bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-black/20 hover:shadow-indigo-500/5 transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-md shrink-0"
                          style={{ backgroundColor: color.bg, color: color.text }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-400 truncate flex items-center gap-1.5">
                            <Building className="h-3 w-3 shrink-0 text-slate-500" />
                            <span className="truncate">{job.company}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
                            <span className="truncate">{job.location || (job.is_remote ? "Remote" : "Global")}</span>
                          </p>
                        </div>
                      </div>

                      {job.site && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
                          {job.site.replace("_", " ")}
                        </span>
                      )}
                    </div>

                    {/* Job Title */}
                    <div>
                      <h3
                        onClick={() => setSelectedJob(job)}
                        className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                        title={job.title}
                      >
                        {job.title}
                      </h3>

                      {sal && (
                        <p className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 shrink-0" />
                          <span>{sal}</span>
                        </p>
                      )}
                    </div>

                    {/* Description preview */}
                    {job.description && (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {job.description.replace(/Job Title:.*?\n+/gi, "").trim()}
                      </p>
                    )}

                    {/* Skills pills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
                          >
                            {sk}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                    <Button
                      onClick={() => setSelectedJob(job)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl h-9 text-xs font-semibold bg-slate-800/60 hover:bg-slate-800 border-slate-700/70 text-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      View Details
                    </Button>

                    <a
                      href={applyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 h-9 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all shrink-0"
                    >
                      <span>Apply</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {selectedJob.site || "External Opening"}
                  </span>
                  {selectedJob.is_remote && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Remote
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white pt-1">{selectedJob.title}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-3">
                  <span className="font-semibold text-slate-300">{selectedJob.company}</span>
                  <span>•</span>
                  <span>{selectedJob.location || "Location not specified"}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed">
              {formatSalary(selectedJob) && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Estimated Compensation</span>
                  <span className="text-sm font-bold text-emerald-400">{formatSalary(selectedJob)}</span>
                </div>
              )}

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills & Tools</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Description</h4>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto">
                  {selectedJob.description || "No full description provided. Click Apply below to view original vacancy on provider portal."}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedJob(null)}
                className="rounded-xl border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              >
                Close
              </Button>

              <a
                href={selectedJob.job_url_direct || selectedJob.job_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400 space-y-1">
        <p>Curated Career Opportunities & Live Industry Openings</p>
        <p>© {new Date().getFullYear()} BIM Era Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
