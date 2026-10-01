import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/use-courses";
import { BIMCourseCard } from "@/components/bim/BIMCourseCard";
import { BIMBackgroundGrid } from "@/components/bim/BIMBackgroundGrid";
import { BIMNeonNetwork } from "@/components/bim/BIMNeonNetwork";
import { BIMWorkflowPipeline } from "@/components/bim/BIMWorkflowPipeline";
import {
  BookOpen, BarChart3, GraduationCap, ShieldCheck,
  CheckCircle2, ChevronDown, Sparkles, Star, Award,
  Zap, ArrowRight, Play, HelpCircle, Mail, Layers, Monitor, Code2, Users,
  Cpu, Database, Terminal, GitMerge, FileSpreadsheet, Box
} from "lucide-react";

// Interactive FAQ Data
// Interactive FAQ Data - BIM Automation Focused
const faqs = [
  {
    q: "Who are these BIM Automation courses designed for?",
    a: "Our programs are specifically built for civil engineers, architects, BIM modelers, coordinators, and MEP specialists looking to elevate their careers from manual drafting to high-paying computational BIM automation, Revit API scripting, and algorithmic design roles."
  },
  {
    q: "Do I need previous programming or Python experience to enroll?",
    a: "No prior coding background is required. Our curriculums start from Python and Dynamo fundamentals tailored strictly to AEC workflows, gradually leveling you up to build full-scale pyRevit add-ins, automated clash matrix scripts, and custom Revit API nodes."
  },
  {
    q: "Which BIM software and automation toolsets are covered?",
    a: "You will master Autodesk Revit (2024-2026), pyRevit, Dynamo Visual Programming, Navisworks Manage API, Python 3, OpenBIM / IFC 4.3 standards, and Autodesk Platform Services (APS / Forge) with production-ready repositories."
  },
  {
    q: "Are the BIM Automation credentials recognized by employers?",
    a: "Yes. Graduates receive verifiable, cryptographically signed credentials aligned with international ISO 19650 standards. Each certificate includes project review validation and direct LinkedIn integration trusted by leading AEC firms and EPC contractors globally."
  },
  {
    q: "Can I access the course material and script repos on mobile?",
    a: "Yes. The learning portal is fully responsive across mobile phones, tablets, and desktops. You can stream high-definition lectures, review code snippets, practice quizzes, and track your telemetry anywhere."
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const { data: courses = [] } = useCourses();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Strictly enforce Dark Mode across the entire landing page
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
    return () => {
      document.documentElement.classList.add("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030407] text-slate-100 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden font-sans">

      {/* ── 1. ARCHITECTURAL DRAFTING & COORDINATE GRID BACKGROUND ── */}
      <BIMBackgroundGrid />

      {/* ── FOREGROUND CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">

        {/* ── NAVBAR (Fully Mobile Responsive) ── */}
        <nav className="sticky top-0 z-50 flex h-16 sm:h-20 items-center justify-between border-b border-cyan-500/20 bg-[#030407]/90 backdrop-blur-xl px-3.5 sm:px-6 md:px-14 transition-all">
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => navigate("/")}>
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,229,255,0.4)] border border-cyan-400/40 shrink-0">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <span className="font-heading text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
                BIM Era Academy
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              </span>
              <p className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 tracking-wider uppercase font-semibold hidden xs:block">
                BIM // REVIT // AUTOMATION // TWIN
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-300">
            <a href="#network" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span className="text-cyan-400">01.</span> Pipeline
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span className="text-cyan-400">02.</span> Features
            </a>
            <a href="#courses" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span className="text-cyan-400">03.</span> Curriculums
            </a>
            <a href="#methodology" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span className="text-cyan-400">04.</span> Workflow
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span className="text-cyan-400">05.</span> FAQ
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-mono uppercase font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_25px_rgba(0,229,255,0.45)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Courses</span>
              <ArrowRight className="h-3.5 w-3.5 hidden xs:inline" />
            </button>
          </div>
        </nav>

        {/* ── HERO SECTION: Headline + 3D Neon Card Network (Mobile Optimized) ── */}
        <section className="relative pt-8 sm:pt-14 md:pt-20 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 text-center max-w-6xl mx-auto flex flex-col items-center w-full">
          {/* Engineering Release Pill */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-mono font-semibold mb-4 sm:mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)] max-w-full">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">BIM AUTOMATION &amp; COMPUTATIONAL ENGINEERING 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
            Master Revit API, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Dynamo &amp; BIM Automation.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans px-2">
            The specialized engineering academy engineered exclusively for <strong>BIM Automation</strong>. Master <strong>pyRevit plugins</strong>, <strong>Dynamo algorithms</strong>, <strong>Navisworks clash detection</strong>, and <strong>computational AEC pipelines</strong>.
          </p>

          {/* Action CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none">
            <button
              onClick={() => navigate("/courses")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-mono uppercase font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_35px_rgba(0,229,255,0.5)] hover:-translate-y-0.5"
            >
              <span>Explore BIM Curriculums</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-mono uppercase font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 border border-cyan-400/50 hover:border-cyan-300 transition-all shadow-[0_0_25px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <span>Start Your Career</span>
            </button>
          </div>

          {/* ── 3D / MOBILE RESPONSIVE BIM NEON NETWORK VISUAL ── */}
          <div id="network" className="w-full mt-8 sm:mt-10">
            <div className="flex items-center justify-center gap-2 mb-2 text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest px-2 text-center">
              <span>● INTERACTIVE BIM AUTOMATION MATRIX</span>
            </div>
            <BIMNeonNetwork />
          </div>

          {/* Live Telemetry Metric Bar (Mobile Responsive Grid) */}
          <div className="mt-8 sm:mt-12 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,229,255,0.1)]">
            <div className="p-2 sm:p-3 text-center border-r border-white/10">
              <p className="text-xl sm:text-3xl font-extrabold text-white font-heading">12,500+</p>
              <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">BIM Engineers</p>
            </div>
            <div className="p-2 sm:p-3 text-center sm:border-r border-white/10">
              <p className="text-xl sm:text-3xl font-extrabold text-cyan-400 font-heading">98.4%</p>
              <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">Completion Rate</p>
            </div>
            <div className="p-2 sm:p-3 text-center border-r border-white/10">
              <p className="text-xl sm:text-3xl font-extrabold text-blue-400 font-heading">40+</p>
              <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">Curriculums</p>
            </div>
            <div className="p-2 sm:p-3 text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-amber-400 font-heading">4.9 / 5.0</p>
              <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1 uppercase">Quality Rating</p>
            </div>
          </div>
        </section>

        {/* ── 2. SECTION: FEATURES & CAPABILITIES (6-Grid) ── */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-cyan-500/10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              BIM AUTOMATION CAPABILITIES
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-4">
              Engineered for Computational Precision
            </h2>
            <p className="text-slate-400 text-xs sm:text-base mt-2">
              Transforming manual drafting into scalable, automated, and proctored engineering masterclasses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Code2,
                color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
                title: "Revit API & pyRevit Plugins",
                desc: "Develop custom pyRevit add-ins, automated batch processors, and parametric modeling scripts directly accessing the Autodesk Revit API."
              },
              {
                icon: GitMerge,
                color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
                title: "Dynamo Algorithmic Design",
                desc: "Master visual programming nodes for automated element placement, adaptive facade computational geometry, and multi-discipline parameter syncing."
              },
              {
                icon: Zap,
                color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
                title: "Automated Clash Detection",
                desc: "Build automated Navisworks clash grouping algorithms, clearance tolerance rules, and instant BCF federated issue tracking."
              },
              {
                icon: Database,
                color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
                title: "Automated QTO & Data Mining",
                desc: "Extract accurate BOQs and material quantities directly from live BIM elements using high-speed parameter extraction into Excel & PowerBI."
              },
              {
                icon: Box,
                color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
                title: "IFC 4.3 & OpenBIM Standards",
                desc: "Automate schema validation, property set creation, and ISO 19650 compliance verification for seamless federated model exchanges."
              },
              {
                icon: Award,
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
                title: "Proctored BIM Certification",
                desc: "Earn industry-accredited BIM Automation credentials with real project submissions, proctored code reviews, and verifiable digital badges."
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group p-5 sm:p-7 rounded-3xl bg-slate-950/70 hover:bg-slate-950 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center border mb-5 sm:mb-6 ${f.color}`}>
                    <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 flex items-center text-xs font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span>EXPLORE AUTOMATION MODULE</span>
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. SECTION: METHODOLOGY & WORKFLOW PIPELINE ── */}
        <section id="methodology" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-cyan-500/10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold text-violet-400 tracking-wider uppercase bg-violet-500/10 border border-violet-500/30 px-3 py-1 rounded-full">
              ENGINEERING PIPELINE
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-4">
              From Raw Model to Automated Deliverables
            </h2>
            <p className="text-slate-400 text-xs sm:text-base mt-2">
              Our 6-stage computational pipeline taught across every BIM automation masterclass.
            </p>
          </div>

          <BIMWorkflowPipeline />
        </section>

        {/* ── 4. SECTION: FEATURED BIM AUTOMATION COURSES SHOWCASE ── */}
        <section id="courses" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-cyan-500/10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                BIM AUTOMATION CURRICULUMS
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-3">
                Master Computational Engineering
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">High-impact engineering courses with production Revit models and Python scripts.</p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View all courses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {courses.length > 0 ? (
              courses.slice(0, 3).map((course) => (
                <BIMCourseCard key={course.id} course={course} />
              ))
            ) : (
              /* Fallback rich showcase cards */
              [
                {
                  id: "1",
                  title: "Revit API & pyRevit Automation Masterclass",
                  description: "Build custom push-button tools, batch model processors, and automated parametric management using Python & C# for Autodesk Revit.",
                  lessonsCount: 48,
                  tag: "pyRevit // API 2026",
                },
                {
                  id: "2",
                  title: "Dynamo Computational BIM & Visual Scripting",
                  description: "Master algorithmic facade generation, level-by-level parameter mapping, and rule-based modeling routines without writing boilerplate code.",
                  lessonsCount: 42,
                  tag: "Dynamo 2.19",
                },
                {
                  id: "3",
                  title: "Navisworks API Clash Coordination & Automation",
                  description: "Automate interference matrix filters, batch clash report generation, 4D simulation timelines, and BCF issue resolution workflows.",
                  lessonsCount: 36,
                  tag: "Navisworks API",
                },
              ].map((c) => (
                <BIMCourseCard key={c.id} course={c} />
              ))
            )}
          </div>
        </section>

        {/* ── 5. SECTION: TESTIMONIALS (Telugu BIM Engineers) ── */}
        <section id="testimonials" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-cyan-500/10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              ALUMNI CAREER SUCCESS STORIES
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-4">
              Real Impact from Real BIM Automation Engineers
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Discover how learning Revit API and computational automation propelled careers across top global engineering firms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                name: "Vamsi Krishna",
                role: "Senior BIM Automation Lead, Hyderabad",
                quote: "The Python for Revit API and Dynamo scripting modules completely revolutionized how our engineering team delivers models. What used to take 3 days of manual renumbering and parameter auditing is now executed in 45 seconds using pyRevit scripts learned here.",
                stars: 5,
                initials: "VK",
              },
              {
                name: "Gayatri Devi",
                role: "BIM Coordinator & Digital Twin Specialist, Bengaluru",
                quote: "Transitioning from standard architectural drafting to automated BIM coordination changed my career trajectory. The clash matrix automation and automated QTO pipelines gave me the confidence to lead multinational high-rise projects.",
                stars: 5,
                initials: "GD",
              },
              {
                name: "Sriram Chowdary",
                role: "Structural Computational Engineer, Amaravati",
                quote: "The hands-on masterclass with real federated LOD 400 models and custom Dynamo nodes is unmatched. The proctored assessments and verifiable credentials landed me a direct senior specialist offer at a premier EPC firm.",
                stars: 5,
                initials: "SC",
              },
              {
                name: "Sanjay Varma",
                role: "Revit API & Automation Consultant, Visakhapatnam",
                quote: "Learning Revit API C# and pyRevit plugins from scratch was made so intuitive here. The academy focuses 100% on real-world industrial BIM automation rather than generic theory. Highest ROI engineering course I've ever taken.",
                stars: 5,
                initials: "SV",
              },
            ].map((t) => (
              <div key={t.name} className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-white/10 hover:border-cyan-400/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3.5">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-5">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. SECTION: INTERACTIVE FAQ (BIM Automation) ── */}
        <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full border-t border-cyan-500/10">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-4">
              Everything You Need to Know About BIM Automation
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-heading pr-2">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180 text-cyan-400" : "text-slate-400"}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. SECTION: CONVERSION BANNER ── */}
        <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full">
          <div className="relative rounded-3xl overflow-hidden p-7 sm:p-10 md:p-14 text-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-400/40 shadow-[0_0_60px_rgba(0,229,255,0.2)]">
            <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Ready to Accelerate Your Career in BIM Automation?
            </h2>
            <p className="mt-4 text-slate-300 text-xs sm:text-base max-w-xl mx-auto">
              Join thousands of forward-thinking engineers mastering Revit API, pyRevit, Dynamo, and automated clash coordination.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate("/courses")}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-2xl text-xs font-mono uppercase font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_35px_rgba(0,229,255,0.4)] hover:-translate-y-0.5"
              >
                Browse Curriculums Now
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 rounded-2xl text-xs font-mono uppercase font-bold text-white bg-slate-900 hover:bg-slate-800 border border-cyan-400/40 hover:border-cyan-300 transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                Start Your Career
              </button>
            </div>
          </div>
        </section>

        {/* ── 8. FOOTER ── */}
        <footer className="border-t border-cyan-500/10 bg-[#020306] mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-heading font-bold text-white text-base">BIM Era Academy</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                The global benchmark for computational AEC engineering, pyRevit tools, Dynamo algorithms, and BIM Automation.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-3 text-xs uppercase tracking-wider font-mono">Curriculums</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-sans">
                <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => navigate("/courses")}>Revit API &amp; pyRevit Automation</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => navigate("/courses")}>Dynamo Algorithmic Design</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => navigate("/courses")}>Navisworks API Clash Coordination</li>
                <li className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => navigate("/courses")}>Automated QTO &amp; OpenBIM</li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-3 text-xs uppercase tracking-wider font-mono">Platform</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-sans">
                <li><a href="#network" className="hover:text-cyan-400 transition-colors">3D BIM Matrix</a></li>
                <li><a href="#features" className="hover:text-cyan-400 transition-colors">Capabilities</a></li>
                <li><a href="#methodology" className="hover:text-cyan-400 transition-colors">Engineering Pipeline</a></li>
                <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-white mb-3 text-xs uppercase tracking-wider font-mono">Contact &amp; Inquiries</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <a href="mailto:bimerapvtltd@gmail.com" className="hover:text-white transition-colors">
                    bimerapvtltd@gmail.com
                  </a>
                </li>
                <li>BIM Era Pvt Ltd</li>
                <li>Computational Engineering Campus</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 py-6 px-4 sm:px-6 text-center text-xs font-mono text-slate-500">
            © 2026 BIM Era Academy (BIMERA Pvt Ltd). All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Landing;
