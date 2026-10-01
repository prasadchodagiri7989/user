import React from "react";
import {
  Layers, Database, Cpu, Zap, ShieldCheck,
  FileSpreadsheet, ArrowRight, CheckCircle2, ChevronRight
} from "lucide-react";

const PIPELINE_STEPS = [
  {
    step: "01",
    label: "MODEL",
    title: "Revit & IFC Ingestion",
    desc: "Multi-discipline model federation (Arch, Struct, MEP) with automated coordinate datum alignment.",
    icon: Layers,
    color: "cyan",
    badge: "LOD 200-400",
  },
  {
    step: "02",
    label: "EXTRACT",
    title: "Geometry & Parameter Mining",
    desc: "Mining schedules, spatial boundaries, wall materials, and property sets via high-speed Revit API.",
    icon: Database,
    color: "blue",
    badge: "100k+ Params/s",
  },
  {
    step: "03",
    label: "PROCESS",
    title: "Computational Dynamo Engine",
    desc: "Graph algorithms analyze rule-based standards, classification codes, and level-by-level relationships.",
    icon: Cpu,
    color: "violet",
    badge: "Graph Active",
  },
  {
    step: "04",
    label: "AUTOMATE",
    title: "Python Script Execution",
    desc: "Auto-generate sheet layouts, rename families, renumber rooms, and fix standard naming discrepancies.",
    icon: Zap,
    color: "amber",
    badge: "pyRevit Ready",
  },
  {
    step: "05",
    label: "VALIDATE",
    title: "Clash & Standard Audit",
    desc: "Automated clash matrix detection with clearance tolerance rules and ISO 19650 metadata verification.",
    icon: ShieldCheck,
    color: "emerald",
    badge: "99.2% Accuracy",
  },
  {
    step: "06",
    label: "OUTPUT",
    title: "BIM Deliverables & QTO",
    desc: "Export verified IFC 4.3 files, quantity takeoffs, COBie sheets, and live web dashboards for teams.",
    icon: FileSpreadsheet,
    color: "rose",
    badge: "Export Complete",
  },
];

export function BIMWorkflowPipeline() {
  return (
    <div className="w-full space-y-8">
      {/* Interactive Horizontal Pipeline Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative">
        {PIPELINE_STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 shadow-lg group flex flex-col justify-between"
            >
              {/* Step indicator tag */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  {s.step} {s.label}
                </span>
                <span className="text-[9px] font-mono text-slate-400 font-medium">{s.badge}</span>
              </div>

              {/* Icon & Title */}
              <div>
                <div className="h-10 w-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-300 group-hover:text-white group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white font-heading mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Connector thread indicator for next step */}
              {idx < PIPELINE_STEPS.length - 1 && (
                <div className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <span className="h-6 w-6 rounded-full bg-slate-900 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-[10px] shadow-sm">
                    ▸
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BIM Engineering Value Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400">Manual Work:</span>
          <span className="text-emerald-400 font-bold">-72%</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Model Accuracy:</span>
          <span className="text-cyan-400 font-bold">99.8%</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-slate-400">QTO Speed:</span>
          <span className="text-blue-400 font-bold">12x Faster</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-400" />
          <span className="text-slate-400">Clashes Prevented:</span>
          <span className="text-violet-400 font-bold">100% Audit</span>
        </div>
        <div className="col-span-2 md:col-span-1 flex items-center gap-2 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-slate-400">ISO 19650:</span>
          <span className="text-amber-400 font-bold">COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
