import React from "react";

export function BIMBackgroundGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#030407]" />

      {/* SVG Architectural Coordinate & Drafting Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] stroke-cyan-400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 40px Minor Grid */}
          <pattern id="bim-minor-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="0.5" strokeDasharray="2 6" />
            <circle cx="0" cy="0" r="0.75" fill="currentColor" />
          </pattern>
          {/* 200px Major Structural Grid with Crosshairs */}
          <pattern id="bim-major-grid" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 200 0 L 0 0 0 200" fill="none" strokeWidth="1" />
            {/* Crosshair marks */}
            <path d="M -8 0 L 8 0 M 0 -8 L 0 8" strokeWidth="1" />
            <path d="M 192 0 L 208 0 M 200 -8 L 200 8" strokeWidth="1" />
            <path d="M -8 200 L 8 200 M 0 192 L 0 208" strokeWidth="1" />
            <path d="M 192 200 L 208 200 M 200 192 L 200 208" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#bim-minor-grid)" />
        <rect width="100%" height="100%" fill="url(#bim-major-grid)" />
      </svg>

      {/* Ambient Engineering Volumetric Glows */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse-glow" />
      <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-blue-600/12 blur-[160px] animate-pulse-glow" style={{ animationDelay: "2.5s" }} />
      <div className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] rounded-full bg-violet-600/10 blur-[150px] animate-pulse-glow" style={{ animationDelay: "5s" }} />

      {/* Faint Architectural Wireframe Geometry (3D Building Slabs & Columns) */}
      <svg
        className="absolute top-24 right-10 w-[500px] h-[500px] opacity-[0.06] text-cyan-300 hidden md:block"
        viewBox="0 0 500 500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {/* Isometric Building Mass wireframe */}
        <path d="M 250 80 L 400 165 L 400 365 L 250 450 L 100 365 L 100 165 Z" strokeDasharray="3 3" />
        <path d="M 250 80 L 250 450" />
        <path d="M 250 220 L 400 165" />
        <path d="M 250 220 L 100 165" />
        <path d="M 250 220 L 250 80" />
        {/* Floor slabs */}
        <path d="M 100 215 L 250 300 L 400 215" strokeDasharray="2 4" />
        <path d="M 100 265 L 250 350 L 400 265" strokeDasharray="2 4" />
        <path d="M 100 315 L 250 400 L 400 315" strokeDasharray="2 4" />
        {/* Structural axis markers */}
        <circle cx="250" cy="80" r="3" fill="currentColor" />
        <circle cx="400" cy="165" r="3" fill="currentColor" />
        <circle cx="100" cy="165" r="3" fill="currentColor" />
        <text x="260" y="75" fontSize="10" fontFamily="monospace" fill="currentColor">NODE_01 [0.0, 0.0, +48.5m]</text>
        <text x="350" y="380" fontSize="9" fontFamily="monospace" fill="currentColor">GRID_B4</text>
      </svg>

      {/* Faint Structural Plan Fragment (Left) */}
      <svg
        className="absolute top-[420px] left-6 w-[420px] h-[420px] opacity-[0.05] text-indigo-400 hidden lg:block"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect x="40" y="40" width="320" height="320" strokeDasharray="4 4" />
        <rect x="80" y="80" width="120" height="120" />
        <rect x="240" y="80" width="80" height="120" />
        <rect x="80" y="240" width="240" height="80" />
        {/* Dimension lines */}
        <line x1="40" y1="20" x2="360" y2="20" />
        <line x1="40" y1="15" x2="40" y2="25" />
        <line x1="360" y1="15" x2="360" y2="25" />
        <text x="180" y="15" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor">DIM: 32,000mm</text>
        {/* Grid Bubbles */}
        <circle cx="40" cy="380" r="10" />
        <text x="40" y="384" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor">A1</text>
        <circle cx="200" cy="380" r="10" />
        <text x="200" y="384" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor">A2</text>
        <circle cx="360" cy="380" r="10" />
        <text x="360" y="384" fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor">A3</text>
      </svg>

      {/* Subtle Coordinate Ticker Header Line */}
      <div className="absolute top-2 left-6 right-6 hidden md:flex justify-between items-center text-[10px] font-mono text-cyan-400/25 tracking-widest uppercase">
        <span>PROJECT_BASE_POINT: [E: 524102.40m, N: 2841094.20m, RL: +24.500m]</span>
        <span>REVIT_API_PIPELINE: ACTIVE • IFC_SCHEMA: IFC4X3_ADD2</span>
        <span>COORDINATION_TOLERANCE: 5.0mm • BIM_LOD: 400</span>
      </div>

      {/* Vignette Gradients for Legibility */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030407]/60 to-[#030407]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#030407]/40 via-transparent to-[#030407]" />
    </div>
  );
}
