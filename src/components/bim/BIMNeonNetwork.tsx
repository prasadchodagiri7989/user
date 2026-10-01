import React, { useState, useEffect, useRef } from "react";
import {
  Layers, Code2, ShieldCheck, Cpu, Database,
  FileCheck2, GitMerge, Terminal, Zap, ArrowRight,
  Boxes, Server, CheckCircle2, Activity
} from "lucide-react";

// Card Definitions with real BIM automation data
export interface BIMCardData {
  id: string;
  category: "model" | "dynamo" | "python" | "clash" | "qto" | "data" | "ifc" | "api" | "validation" | "twin" | "engine";
  title: string;
  codeName?: string;
  badge: string;
  badgeColor: string;
  glowColor: "cyan" | "blue" | "violet" | "emerald" | "amber";
  connectedTo: string[]; // Node IDs connected to this
  x: number; // Percent position (0 - 100)
  y: number; // Percent position (0 - 100)
  depthZ: number; // Depth offset in px
  rotX?: number;
  rotY?: number;
}

const CARDS: BIMCardData[] = [
  {
    id: "engine",
    category: "engine",
    title: "BIM AUTOMATION ENGINE",
    codeName: "CORE_PIPELINE_V2",
    badge: "ENGINE ACTIVE",
    badgeColor: "text-cyan-300 bg-cyan-500/20 border-cyan-400/50",
    glowColor: "cyan",
    connectedTo: ["revit", "dynamo", "python", "clash", "qto", "ifc"],
    x: 50,
    y: 44,
    depthZ: 40,
    rotX: 2,
    rotY: -1,
  },
  {
    id: "revit",
    category: "model",
    title: "REVIT MODEL",
    codeName: "ARCH_STR_FEDERATED.rvt",
    badge: "SYNCED",
    badgeColor: "text-blue-300 bg-blue-500/20 border-blue-400/40",
    glowColor: "blue",
    connectedTo: ["engine", "dynamo", "data"],
    x: 20,
    y: 12,
    depthZ: 25,
    rotX: 3,
    rotY: 4,
  },
  {
    id: "dynamo",
    category: "dynamo",
    title: "DYNAMO AUTOMATION",
    codeName: "graph_clash_sorter.dyn",
    badge: "WORKFLOW ACTIVE",
    badgeColor: "text-amber-300 bg-amber-500/20 border-amber-400/40",
    glowColor: "amber",
    connectedTo: ["engine", "python"],
    x: 80,
    y: 14,
    depthZ: 20,
    rotX: 4,
    rotY: -5,
  },
  {
    id: "python",
    category: "python",
    title: "PYTHON ENGINE",
    codeName: "pyrevit_batch_param.py",
    badge: "98% EXECUTION",
    badgeColor: "text-emerald-300 bg-emerald-500/20 border-emerald-400/40",
    glowColor: "emerald",
    connectedTo: ["engine", "api"],
    x: 14,
    y: 48,
    depthZ: 30,
    rotX: -2,
    rotY: 6,
  },
  {
    id: "clash",
    category: "clash",
    title: "CLASH DETECTION",
    codeName: "MEP_vs_STRUCTURAL",
    badge: "8 RESOLVED / 12",
    badgeColor: "text-rose-300 bg-rose-500/20 border-rose-400/40",
    glowColor: "violet",
    connectedTo: ["engine", "validation"],
    x: 84,
    y: 46,
    depthZ: 35,
    rotX: -3,
    rotY: -4,
  },
  {
    id: "qto",
    category: "qto",
    title: "QUANTITY TAKEOFF",
    codeName: "BOQ_EXTRACT_LIVE",
    badge: "AUTO EXTRACTED",
    badgeColor: "text-cyan-300 bg-cyan-500/20 border-cyan-400/40",
    glowColor: "cyan",
    connectedTo: ["engine", "ifc"],
    x: 24,
    y: 82,
    depthZ: 15,
    rotX: -4,
    rotY: 2,
  },
  {
    id: "ifc",
    category: "ifc",
    title: "OPEN BIM / IFC 4.3",
    codeName: "EXPRESS_MVD_VERIFIED",
    badge: "VALIDATED (94%)",
    badgeColor: "text-violet-300 bg-violet-500/20 border-violet-400/40",
    glowColor: "violet",
    connectedTo: ["engine", "twin"],
    x: 74,
    y: 80,
    depthZ: 20,
    rotX: -5,
    rotY: -3,
  },
];

export function BIMNeonNetwork() {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({
        x: Math.max(-1, Math.min(1, xNorm)) * 14,
        y: Math.max(-1, Math.min(1, yNorm)) * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Compute connections between cards
  const activeCard = CARDS.find((c) => c.id === activeHoverId);
  const activeConnections = activeCard ? [activeCard.id, ...activeCard.connectedTo] : [];

  return (
    <div className="w-full select-none">
      {/* ── MOBILE RESPONSIVE BIM NETWORK (sm:hidden) ── */}
      <div className="w-full sm:hidden flex flex-col items-center gap-2.5 px-2 py-2">
        {/* Node 1: Revit Model */}
        <div className="w-full max-w-sm p-3.5 rounded-2xl bg-slate-950/90 border border-blue-500/40 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">🏢</span>
              <h4 className="text-xs font-bold text-white font-heading">REVIT MODEL (LOD 400)</h4>
            </div>
            <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/40">
              ● SYNCED
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/70 p-2 rounded-xl border border-white/5">
            <span>Elements: <strong className="text-white">12,482</strong></span>
            <span>Families: <strong className="text-white">1,284</strong></span>
            <span>Levels: <strong className="text-white">18</strong></span>
          </div>
        </div>

        {/* Connecting neon indicator */}
        <div className="flex flex-col items-center -my-0.5">
          <div className="w-[2px] h-5 bg-gradient-to-b from-blue-400 to-cyan-400 shadow-[0_0_8px_#00E5FF]" />
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00E5FF] animate-ping" />
        </div>

        {/* Node 2: Central BIM Automation Engine */}
        <div className="w-full max-w-sm p-4 rounded-3xl bg-slate-950/95 border-2 border-cyan-400/70 shadow-[0_0_35px_rgba(0,229,255,0.35)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <Cpu className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-white font-heading">BIM AUTOMATION ENGINE</h3>
                <p className="text-[9px] font-mono text-cyan-400">CORE PIPELINE V2</p>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold uppercase">
              ONLINE
            </span>
          </div>
          <div className="py-2.5 space-y-1.5 text-[10px] font-mono">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/70 border border-white/5">
              <span className="text-slate-300">Revit API → Extract Params</span>
              <span className="text-emerald-400 font-bold">100% OK</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/70 border border-white/5">
              <span className="text-slate-300">Dynamo Graph → Clash Filter</span>
              <span className="text-cyan-400 font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/70 border border-white/5">
              <span className="text-slate-300">Python Sandbox → QTO &amp; IFC</span>
              <span className="text-amber-400 font-bold">SYNCED</span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>1.2 GB/s Throughput</span>
            <span className="text-cyan-400">LATENCY: 12ms</span>
          </div>
        </div>

        {/* Connecting neon split indicator */}
        <div className="flex flex-col items-center -my-0.5">
          <div className="w-[2px] h-5 bg-gradient-to-b from-cyan-400 to-violet-400 shadow-[0_0_8px_#8B5CF6]" />
          <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_#8B5CF6] animate-ping" />
        </div>

        {/* Node 3 & 4: Python & Clash (Grid 2-col) */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-emerald-500/40 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <h4 className="text-[11px] font-bold text-white font-heading">PYTHON ENGINE</h4>
            </div>
            <div className="text-[9px] font-mono text-emerald-300 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
              <p>pyRevit 2026</p>
              <p className="text-[8px] text-emerald-400">98% Exec Pass</p>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-rose-500/40 backdrop-blur-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap className="h-3.5 w-3.5 text-rose-400" />
              <h4 className="text-[11px] font-bold text-white font-heading">CLASH MATRIX</h4>
            </div>
            <div className="text-[9px] font-mono text-rose-300 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
              <p>Navisworks API</p>
              <p className="text-[8px] text-rose-400">8/12 Resolved</p>
            </div>
          </div>
        </div>

        {/* Connecting neon indicator */}
        <div className="flex flex-col items-center -my-0.5">
          <div className="w-[2px] h-4 bg-gradient-to-b from-violet-400 to-cyan-400" />
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </div>

        {/* Node 5: QTO & IFC Export */}
        <div className="w-full max-w-sm p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <div>
              <h5 className="text-[11px] font-bold text-white font-heading">AUTO QTO &amp; OPEN BIM</h5>
              <p className="text-[9px] font-mono text-slate-400">842 m³ Concrete • IFC 4.3 ISO 16739-1</p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40 font-bold">
            EXTRACTED
          </span>
        </div>
      </div>

      {/* ── TABLET / DESKTOP 3D PARALLAX CANVASES (hidden sm:flex) ── */}
      <div
        ref={containerRef}
        className="relative w-full hidden sm:flex min-h-[620px] md:min-h-[720px] perspective-[1200px] items-center justify-center overflow-hidden"
      >
      {/* ── 3D Parallax Canvas ── */}
      <div
        className="relative w-full max-w-6xl h-[620px] md:h-[700px] transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${-mouseOffset.y * 0.4}deg) rotateY(${mouseOffset.x * 0.5}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── SVG NEON THREADS & DATA PARTICLES ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Neon Glow Filters */}
            <filter id="neon-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Draw Curved Connection Lines between Nodes */}
          {/* Revit (200, 100) -> Engine (500, 310) */}
          <g>
            <path
              id="path-revit-engine"
              d="M 230 140 C 230 250, 470 200, 470 280"
              fill="none"
              stroke={activeConnections.includes("revit") ? "#00E5FF" : "rgba(0, 229, 255, 0.35)"}
              strokeWidth={activeConnections.includes("revit") ? "2.5" : "1.5"}
              strokeDasharray={activeConnections.includes("revit") ? "none" : "5 5"}
              filter="url(#neon-cyan)"
              className="transition-all duration-300"
            />
            <circle r="3.5" fill="#00E5FF" filter="url(#neon-cyan)">
              <animateMotion dur="6s" repeatCount="indefinite" path="M 230 140 C 230 250, 470 200, 470 280" />
            </circle>
          </g>

          {/* Dynamo (780, 150) -> Engine (530, 290) */}
          <g>
            <path
              id="path-dynamo-engine"
              d="M 770 160 C 650 180, 560 220, 530 280"
              fill="none"
              stroke={activeConnections.includes("dynamo") ? "#38BDF8" : "rgba(56, 189, 248, 0.35)"}
              strokeWidth={activeConnections.includes("dynamo") ? "2.5" : "1.5"}
              filter="url(#neon-blue)"
              className="transition-all duration-300"
            />
            <circle r="3.5" fill="#38BDF8" filter="url(#neon-blue)">
              <animateMotion dur="7s" repeatCount="indefinite" path="M 770 160 C 650 180, 560 220, 530 280" />
            </circle>
          </g>

          {/* Python (170, 340) -> Engine (460, 330) */}
          <g>
            <path
              id="path-python-engine"
              d="M 220 350 C 320 350, 380 340, 450 330"
              fill="none"
              stroke={activeConnections.includes("python") ? "#10B981" : "rgba(16, 185, 129, 0.35)"}
              strokeWidth={activeConnections.includes("python") ? "2.5" : "1.5"}
              strokeDasharray="4 4"
              className="transition-all duration-300"
            />
            <circle r="3.5" fill="#34D399">
              <animateMotion dur="5s" repeatCount="indefinite" path="M 220 350 C 320 350, 380 340, 450 330" />
            </circle>
          </g>

          {/* Engine (550, 340) -> Clash (800, 340) */}
          <g>
            <path
              id="path-engine-clash"
              d="M 550 340 C 640 340, 710 340, 780 340"
              fill="none"
              stroke={activeConnections.includes("clash") ? "#F43F5E" : "rgba(244, 63, 94, 0.35)"}
              strokeWidth={activeConnections.includes("clash") ? "2.5" : "1.5"}
              className="transition-all duration-300"
            />
            <circle r="3.5" fill="#FB7185">
              <animateMotion dur="8s" repeatCount="indefinite" path="M 550 340 C 640 340, 710 340, 780 340" />
            </circle>
          </g>

          {/* Engine (470, 390) -> QTO (270, 560) */}
          <g>
            <path
              id="path-engine-qto"
              d="M 480 390 C 450 480, 350 510, 270 560"
              fill="none"
              stroke={activeConnections.includes("qto") ? "#00E5FF" : "rgba(0, 229, 255, 0.3)"}
              strokeWidth={activeConnections.includes("qto") ? "2.5" : "1.5"}
              filter="url(#neon-cyan)"
              className="transition-all duration-300"
            />
            <circle r="3.5" fill="#00E5FF" filter="url(#neon-cyan)">
              <animateMotion dur="6.5s" repeatCount="indefinite" path="M 480 390 C 450 480, 350 510, 270 560" />
            </circle>
          </g>

          {/* Engine (530, 390) -> IFC (720, 550) */}
          <g>
            <path
              id="path-engine-ifc"
              d="M 530 390 C 580 480, 650 500, 720 550"
              fill="none"
              stroke={activeConnections.includes("ifc") ? "#8B5CF6" : "rgba(139, 92, 246, 0.3)"}
              strokeWidth={activeConnections.includes("ifc") ? "2.5" : "1.5"}
              className="transition-all duration-300"
            />
            <circle r="3.5" fill="#A78BFA">
              <animateMotion dur="9s" repeatCount="indefinite" path="M 530 390 C 580 480, 650 500, 720 550" />
            </circle>
          </g>
        </svg>

        {/* ── CENTRAL HERO AUTOMATION ENGINE CARD ── */}
        <div
          onMouseEnter={() => setActiveHoverId("engine")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-30 transition-all duration-500 ease-out cursor-pointer group"
          style={{
            left: "50%",
            top: "45%",
            transform: `translate(-50%, -50%) translateZ(45px) rotateX(1deg) rotateY(${mouseOffset.x * 0.2}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="w-[295px] xs:w-[320px] sm:w-[360px] md:w-[410px] p-5 sm:p-6 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(0,229,255,0.35)] group-hover:shadow-[0_0_80px_rgba(0,229,255,0.55)] group-hover:border-cyan-300 transition-all relative overflow-hidden">
            {/* Top Glowing Sweep Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  <Cpu className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-heading flex items-center gap-1.5">
                    BIM AUTOMATION ENGINE
                  </h3>
                  <p className="text-[10px] font-mono text-cyan-400/80">REVI_API // COMPUTATIONAL_HUB</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                ONLINE
              </span>
            </div>

            {/* Pipeline Matrix Nodes */}
            <div className="py-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="text-cyan-400">▸</span> Revit Model → Parameter Extraction
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">100% OK</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="text-cyan-400">▸</span> Dynamo Graph → Clash Filtering
                </span>
                <span className="text-cyan-400 text-[10px] font-bold">RUNNING</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-white/5">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="text-cyan-400">▸</span> Python Sandbox → QTO & IFC Export
                </span>
                <span className="text-amber-400 text-[10px] font-bold">SYNCING</span>
              </div>
            </div>

            {/* Footer Telemetry */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-cyan-400" />
                Throughput: <strong className="text-white font-mono">1.2GB/s</strong>
              </span>
              <span className="text-cyan-400 font-mono text-[10px]">LATENCY: 12ms</span>
            </div>
          </div>
        </div>

        {/* ── CARD 1: REVIT MODEL (Top-Left) ── */}
        <div
          onMouseEnter={() => setActiveHoverId("revit")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-20 transition-all duration-300 cursor-pointer hidden sm:block"
          style={{
            left: "18%",
            top: "14%",
            transform: `translate(-50%, -50%) translateZ(25px) rotateX(${mouseOffset.y * 0.15}deg) rotateY(${-mouseOffset.x * 0.15}deg)`,
          }}
        >
          <div className={`w-64 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border ${activeHoverId === "revit" ? "border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)]" : "border-white/10"} hover:border-blue-400/70 transition-all`}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🏢</span>
                <h4 className="text-xs font-bold text-white font-heading">REVIT MODEL</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded border border-blue-400/30">
                ● SYNCED
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mb-3">CENTRAL_PROJECT_LOD400</p>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono bg-slate-900/60 p-2 rounded-xl border border-white/5">
              <div>
                <p className="text-slate-400">Elements</p>
                <p className="font-bold text-white">12,482</p>
              </div>
              <div>
                <p className="text-slate-400">Families</p>
                <p className="font-bold text-white">1,284</p>
              </div>
              <div>
                <p className="text-slate-400">Levels</p>
                <p className="font-bold text-white">18</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 2: DYNAMO WORKFLOW (Top-Right) ── */}
        <div
          onMouseEnter={() => setActiveHoverId("dynamo")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-20 transition-all duration-300 cursor-pointer hidden sm:block"
          style={{
            left: "82%",
            top: "16%",
            transform: `translate(-50%, -50%) translateZ(20px) rotateX(${mouseOffset.y * 0.15}deg) rotateY(${mouseOffset.x * 0.15}deg)`,
          }}
        >
          <div className={`w-64 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border ${activeHoverId === "dynamo" ? "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]" : "border-white/10"} hover:border-amber-400/70 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <GitMerge className="h-3.5 w-3.5 text-amber-400" />
                <h4 className="text-xs font-bold text-white font-heading">DYNAMO WORKFLOW</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                ACTIVE
              </span>
            </div>
            {/* Visual Node Graph representation */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 my-2 flex items-center justify-between text-[9px] font-mono">
              <span className="p-1 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">Select.Elements</span>
              <span className="text-amber-400">──►</span>
              <span className="p-1 rounded bg-slate-800 text-amber-300 border border-amber-500/30">Filter.Rule</span>
              <span className="text-amber-400">──►</span>
              <span className="p-1 rounded bg-slate-800 text-emerald-300 border border-emerald-500/30">Set.Param</span>
            </div>
            <p className="text-[9px] text-slate-400 text-right font-mono">Nodes: 48 • Execution: 0.4s</p>
          </div>
        </div>

        {/* ── CARD 3: PYTHON AUTOMATION (Mid-Left) ── */}
        <div
          onMouseEnter={() => setActiveHoverId("python")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-20 transition-all duration-300 cursor-pointer hidden md:block"
          style={{
            left: "14%",
            top: "52%",
            transform: `translate(-50%, -50%) translateZ(30px) rotateX(${mouseOffset.y * 0.15}deg)`,
          }}
        >
          <div className={`w-64 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border ${activeHoverId === "python" ? "border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]" : "border-white/10"} hover:border-emerald-400/70 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <h4 className="text-xs font-bold text-white font-heading">PYTHON ENGINE</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-400/30">
                98% PASS
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-[9px] text-emerald-300 space-y-1">
              <p>&gt; automate_model(LOD=400)</p>
              <p className="text-cyan-300">&gt; update_parameters(sync=True)</p>
              <p className="text-amber-300">&gt; export_ifc_dataset()</p>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-mono">Revit API 2026 // pyRevit</p>
          </div>
        </div>

        {/* ── CARD 4: CLASH DETECTION (Mid-Right) ── */}
        <div
          onMouseEnter={() => setActiveHoverId("clash")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-20 transition-all duration-300 cursor-pointer hidden md:block"
          style={{
            left: "86%",
            top: "50%",
            transform: `translate(-50%, -50%) translateZ(35px) rotateX(${mouseOffset.y * 0.15}deg)`,
          }}
        >
          <div className={`w-64 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border ${activeHoverId === "clash" ? "border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]" : "border-white/10"} hover:border-rose-400/70 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-rose-400" />
                <h4 className="text-xs font-bold text-white font-heading">CLASH DETECTION</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-400/30">
                8 RESOLVED
              </span>
            </div>
            {/* Visual Intersecting Geometry */}
            <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-around my-2 text-center text-[10px] font-mono">
              <div>
                <p className="text-rose-400 font-bold">12</p>
                <p className="text-[8px] text-slate-400">Detected</p>
              </div>
              <span className="text-slate-600">|</span>
              <div>
                <p className="text-emerald-400 font-bold">8</p>
                <p className="text-[8px] text-slate-400">Resolved</p>
              </div>
              <span className="text-slate-600">|</span>
              <div>
                <p className="text-amber-400 font-bold">4</p>
                <p className="text-[8px] text-slate-400">Active</p>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-mono">Tolerance: 5.0mm • Navisworks</p>
          </div>
        </div>

        {/* ── CARD 5: QUANTITY TAKEOFF (Bottom-Left) ── */}
        <div
          onMouseEnter={() => setActiveHoverId("qto")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-20 transition-all duration-300 cursor-pointer hidden lg:block"
          style={{
            left: "22%",
            top: "84%",
            transform: `translate(-50%, -50%) translateZ(15px) rotateX(${mouseOffset.y * 0.15}deg)`,
          }}
        >
          <div className={`w-64 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border ${activeHoverId === "qto" ? "border-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.4)]" : "border-white/10"} hover:border-cyan-400/70 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                <h4 className="text-xs font-bold text-white font-heading">QUANTITY TAKEOFF</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-400/30">
                AUTO EXTRACT
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono bg-slate-900/60 p-2 rounded-xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-slate-400">Concrete:</span>
                <span className="text-white font-bold">842 m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Steel:</span>
                <span className="text-white font-bold">96.4 t</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doors:</span>
                <span className="text-white font-bold">124</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Windows:</span>
                <span className="text-white font-bold">286</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 6: OPEN BIM / IFC 4.3 (Bottom-Right) ── */}
        <div
          onMouseEnter={() => setActiveHoverId("ifc")}
          onMouseLeave={() => setActiveHoverId(null)}
          className="absolute z-20 transition-all duration-300 cursor-pointer hidden lg:block"
          style={{
            left: "76%",
            top: "82%",
            transform: `translate(-50%, -50%) translateZ(20px) rotateX(${mouseOffset.y * 0.15}deg)`,
          }}
        >
          <div className={`w-64 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border ${activeHoverId === "ifc" ? "border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.4)]" : "border-white/10"} hover:border-violet-400/70 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-violet-400" />
                <h4 className="text-xs font-bold text-white font-heading">OPEN BIM / IFC 4.3</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-violet-400 bg-violet-500/20 px-1.5 py-0.5 rounded border border-violet-400/30">
                VALIDATED
              </span>
            </div>
            <div className="space-y-1.5 text-[9px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span>EXPORT PIPELINE:</span>
                <span className="text-violet-300 font-bold">94%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 border border-white/5 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full w-[94%]" />
              </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-mono">ISO 16739-1 Compliant</p>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
