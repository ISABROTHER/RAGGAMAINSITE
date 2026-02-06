// src/pages/OngoingProjects.tsx
import { HardHat, MapPin, Calendar, CheckCircle2, ArrowRight, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection } from '../components/AnimatedSection';

const projects = [
  {
    id: 1,
    title: "Pedu Park Astro-Turf",
    category: "Sports & Youth",
    progress: 45,
    location: "Pedu",
    timeline: "March 2026",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2029&auto=format&fit=crop",
    description: "Transformation of the community park into a world-class sporting facility with floodlights and spectator stands."
  },
  {
    id: 2,
    title: "Abura Health Center Wing",
    category: "Healthcare",
    progress: 85,
    location: "Abura",
    timeline: "Dec 2025",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop",
    description: "Expansion of the existing health facility to include a dedicated maternal ward and emergency unit."
  },
  {
    id: 3,
    title: "Cape Coast North ICT Hub",
    category: "Education/Tech",
    progress: 30,
    location: "UCC Area",
    timeline: "July 2026",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    description: "A state-of-the-art digital learning center equipped with high-speed internet for youth skill development."
  }
];

export function OngoingProjects() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- MODERN HERO SECTION --- */}
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
                  <p className="text-5xl font-black text-slate-900 mb-1">12</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Sites</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
                  <Zap className="absolute top-2 right-2 w-12 h-12 text-green-500/10 group-hover:text-green-500/20 transition-colors" />
                  <p className="text-5xl font-black text-green-500 mb-1">85%</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg. Progress</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* --- PROJECT GRID --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, index) => (
            <AnimatedSection key={project.id} delay={index * 150}>
              <div className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(22,163,74,0.12)] transition-all duration-700 border border-slate-100 flex flex-col h-full">
                
                {/* Image Wrap */}
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent" />
                  
                  {/* Category Float */}
                  <div className="absolute top-8 left-8">
                    <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl">
                      {project.category}
                    </span>
                  </div>

                  {/* Location Float */}
                  <div className="absolute bottom-8 left-8 flex items-center gap-2 text-white">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{project.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight uppercase group-hover:text-green-700 transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed mb-10 font-medium">
                    {project.description}
                  </p>

                  {/* Modern Progress Dashboard */}
                  <div className="mt-auto space-y-5 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. {project.timeline}</span>
                      </div>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">{project.progress}%</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="h-2.5 w-full bg-slate-200/50 rounded-full overflow-hidden p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${project.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-black text-green-700 uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      On Schedule
                    </span>
                    <button className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-xl group/btn">
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* --- CALL TO ACTION --- */}
        <AnimatedSection delay={500}>
          <div className="mt-24 rounded-[4rem] bg-slate-950 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-green-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <HardHat className="w-16 h-16 text-green-500 mx-auto mb-10 opacity-80" />
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                Community Driven <br />Development
              </h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
                Development works best when we listen to your needs. Have feedback on current projects or suggestions for your community?
              </p>
              <button className="px-12 py-5 bg-green-600 text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl hover:bg-white hover:text-slate-950 transition-all duration-500 active:scale-95 shadow-2xl shadow-green-900/30">
                Contact Office
              </button>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}