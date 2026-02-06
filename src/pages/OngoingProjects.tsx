import { useState } from 'react';
import { HardHat, MapPin, Calendar, ArrowRight, Activity, Zap, ChevronDown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../components/AnimatedSection';
import { Link } from 'react-router-dom';

interface Milestone {
  pct: number;
  label: string;
  date: string;
  done: boolean;
}

interface Project {
  id: number;
  title: string;
  category: string;
  progress: number;
  location: string;
  timeline: string;
  image: string;
  description: string;
  milestones: Milestone[];
  updates: { date: string; text: string }[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Pedu Park Astro-Turf",
    category: "Sports & Youth",
    progress: 45,
    location: "Pedu",
    timeline: "March 2026",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2029&auto=format&fit=crop",
    description: "Transformation of the community park into a world-class sporting facility with floodlights and spectator stands.",
    milestones: [
      { pct: 0, label: "Ground-breaking", date: "Jun 2025", done: true },
      { pct: 25, label: "Foundation & Drainage", date: "Sep 2025", done: true },
      { pct: 50, label: "Turf Installation", date: "Dec 2025", done: false },
      { pct: 75, label: "Floodlights & Stands", date: "Feb 2026", done: false },
      { pct: 100, label: "Completion", date: "Mar 2026", done: false },
    ],
    updates: [
      { date: "Jan 2026", text: "Drainage system 80% complete, turf materials ordered" },
      { date: "Dec 2025", text: "Foundation work completed ahead of schedule" },
      { date: "Sep 2025", text: "Ground-breaking ceremony held with community leaders" },
    ],
  },
  {
    id: 2,
    title: "Abura Health Center Wing",
    category: "Healthcare",
    progress: 85,
    location: "Abura",
    timeline: "Feb 2026",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop",
    description: "Expansion of the existing health facility to include a dedicated maternal ward and emergency unit.",
    milestones: [
      { pct: 0, label: "Approval & Design", date: "Mar 2025", done: true },
      { pct: 25, label: "Foundation", date: "May 2025", done: true },
      { pct: 50, label: "Structural Work", date: "Aug 2025", done: true },
      { pct: 75, label: "Roofing & Finishing", date: "Nov 2025", done: true },
      { pct: 100, label: "Equipping & Handover", date: "Feb 2026", done: false },
    ],
    updates: [
      { date: "Jan 2026", text: "Medical equipment procurement in final stage" },
      { date: "Dec 2025", text: "Interior finishing and painting completed" },
      { date: "Nov 2025", text: "Roofing installation completed successfully" },
    ],
  },
  {
    id: 3,
    title: "Cape Coast North ICT Hub",
    category: "Education/Tech",
    progress: 30,
    location: "UCC Area",
    timeline: "July 2026",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    description: "A state-of-the-art digital learning center equipped with high-speed internet for youth skill development.",
    milestones: [
      { pct: 0, label: "Land Secured", date: "Aug 2025", done: true },
      { pct: 25, label: "Foundation", date: "Nov 2025", done: true },
      { pct: 50, label: "Structure & Wiring", date: "Mar 2026", done: false },
      { pct: 75, label: "Equipment Install", date: "May 2026", done: false },
      { pct: 100, label: "Launch", date: "Jul 2026", done: false },
    ],
    updates: [
      { date: "Jan 2026", text: "Block work progressing, first floor columns complete" },
      { date: "Nov 2025", text: "Foundation poured, curing in progress" },
    ],
  },
];

function getStatusInfo(progress: number) {
  if (progress >= 85) return { label: "Almost Complete", color: "text-emerald-600", bg: "bg-emerald-500", dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" };
  if (progress >= 40) return { label: "On Track", color: "text-green-600", bg: "bg-green-500", dot: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" };
  return { label: "In Progress", color: "text-blue-600", bg: "bg-blue-500", dot: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" };
}

export function OngoingProjects() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative mb-20 overflow-hidden">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-b border-slate-200 pb-16">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-[11px] font-black uppercase tracking-widest mb-8 border border-green-100 shadow-sm">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Live Development Tracker
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-none uppercase tracking-tighter mb-6">
                  On-Going <br />
                  <span className="text-green-700 underline decoration-green-200 decoration-8 underline-offset-8">Impact.</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                  Real-time updates on infrastructure and initiatives transforming Cape Coast North into a modern hub for all.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 lg:w-1/3">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                  <p className="text-5xl font-black text-slate-900 mb-1">{projects.length}</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Sites</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
                  <Zap className="absolute top-2 right-2 w-12 h-12 text-green-500/10 group-hover:text-green-500/20 transition-colors" />
                  <p className="text-5xl font-black text-green-500 mb-1">
                    {Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)}%
                  </p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg. Progress</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, index) => {
            const status = getStatusInfo(project.progress);
            const isExpanded = expandedId === project.id;

            return (
              <AnimatedSection key={project.id} delay={index * 150}>
                <div className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)] transition-all duration-700 border border-slate-100 flex flex-col h-full">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent" />
                    <div className="absolute top-8 left-8">
                      <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{project.location}</span>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight uppercase group-hover:text-green-700 transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed mb-10 font-medium">
                      {project.description}
                    </p>

                    <div className="mt-auto space-y-5 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. {project.timeline}</span>
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">{project.progress}%</span>
                      </div>

                      <div className="relative h-3 w-full bg-slate-200/50 rounded-full overflow-visible">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "circOut" }}
                          className={`h-full ${status.bg} rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]`}
                        />
                        {project.milestones.map((m) => (
                          <div
                            key={m.pct}
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                            style={{ left: `${m.pct}%` }}
                            title={`${m.label} - ${m.date}`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${m.done ? 'bg-green-500' : 'bg-slate-300'} transition-colors`} />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                          <span className={status.color}>{status.label}</span>
                        </div>
                        <span className="text-slate-300 mx-1">|</span>
                        <span className="text-slate-400">{project.milestones.filter(m => m.done).length}/{project.milestones.length} milestones</span>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : project.id)}
                        className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-green-700 uppercase tracking-widest transition-colors"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        {isExpanded ? 'Hide' : 'View'} Timeline
                      </button>
                      <button className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-xl group/btn">
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-8 space-y-6">
                            <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> Project Milestones
                              </h4>
                              <div className="relative pl-6 space-y-4">
                                <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-slate-200" />
                                {project.milestones.map((m, i) => (
                                  <div key={i} className="flex items-start gap-4 relative">
                                    <div className={`absolute left-[-15px] w-3 h-3 rounded-full border-2 border-white z-10 ${m.done ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    <div className="flex-1 ml-2">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm font-bold ${m.done ? 'text-slate-900' : 'text-slate-400'}`}>{m.label}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{m.date}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> Recent Updates
                              </h4>
                              <div className="space-y-3">
                                {project.updates.map((u, i) => (
                                  <div key={i} className="flex gap-3 items-start">
                                    <span className="text-[10px] font-black text-green-600 uppercase whitespace-nowrap mt-0.5">{u.date}</span>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{u.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={500}>
          <div className="mt-24 rounded-[4rem] bg-slate-950 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-green-600/10 rounded-full blur-[120px]" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <HardHat className="w-16 h-16 text-green-500 mx-auto mb-10 opacity-80" />
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                Community Driven <br />Development
              </h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
                Development works best when we listen to your needs. Have feedback on current projects or suggestions for your community?
              </p>
              <Link
                to="/issues"
                className="inline-block px-12 py-5 bg-green-600 text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl hover:bg-white hover:text-slate-950 transition-all duration-500 active:scale-95 shadow-2xl shadow-green-900/30"
              >
                Share Feedback
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
