import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, BookOpen, ArrowRight, ShieldCheck, Cpu, Code2, Sparkles } from "lucide-react";

export interface BIMCourseCardData {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  lessonsCount?: number;
  tag?: string;
  progress?: number;
}

interface BIMCourseCardProps {
  course: BIMCourseCardData;
}

const API_BASE = import.meta.env.VITE_API_URL as string;
const BACKEND_URL = API_BASE ? API_BASE.replace('/api', '') : 'http://localhost:5000';

const getThumbnailUrl = (thumbnail?: string) => {
  if (!thumbnail) return '';
  if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) return thumbnail;
  return `${BACKEND_URL}${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`;
};

export function BIMCourseCard({ course }: BIMCourseCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const thumbUrl = getThumbnailUrl(course.thumbnail);

  // Derive an aesthetic tag if not explicitly supplied
  const tag = course.tag || (
    course.title.toLowerCase().includes("python") ? "PYTHON // PYREVIT" :
    course.title.toLowerCase().includes("dynamo") ? "DYNAMO 2.19" :
    course.title.toLowerCase().includes("clash") || course.title.toLowerCase().includes("navisworks") ? "NAVISWORKS API" :
    "BIM AUTOMATION"
  );

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="group relative rounded-3xl bg-slate-950/80 hover:bg-slate-950/95 border border-cyan-500/20 hover:border-cyan-400/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_35px_rgba(0,229,255,0.22)] cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top Neon Sweep on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Media Thumbnail Container with blueprint overlay */}
        <div className="relative aspect-[16/9] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 overflow-hidden mb-4.5 flex items-center justify-center">
          {thumbUrl && !imgError ? (
            <img
              src={thumbUrl}
              alt={course.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-950/40 via-slate-900 to-blue-950/40 p-4">
              {/* Subtle background coordinate blueprint lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e5ff0d_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff0d_1px,transparent_1px)] bg-[size:16px_16px]" />
              <div className="relative h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                <Layers className="h-6 w-6" />
              </div>
              <span className="relative mt-2 text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest font-semibold">
                LOD 400 // DIGITAL TWIN
              </span>
            </div>
          )}

          {/* Badge Tag */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold text-cyan-300 bg-slate-950/90 border border-cyan-400/40 backdrop-blur-md shadow-md">
              {tag}
            </span>
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-white text-base sm:text-lg group-hover:text-cyan-300 transition-colors line-clamp-1">
            {course.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {course.description}
          </p>
        </div>
      </div>

      {/* Meta Footer & CTA */}
      <div className="mt-5 pt-3.5 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            {course.lessonsCount ? `${course.lessonsCount} Modules` : "Comprehensive Syllabus"}
          </span>
          <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            ISO 19650
          </span>
        </div>

        {/* Dedicated Neon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${course.id}`);
          }}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-slate-200 bg-slate-900/90 hover:bg-cyan-400 hover:text-black border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-[0_0_15px_rgba(0,229,255,0.08)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
        >
          <span>Explore Curriculum</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
