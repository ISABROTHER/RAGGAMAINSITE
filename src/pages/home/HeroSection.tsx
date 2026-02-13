// src/pages/home/HeroSection.tsx
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative min-h-[85vh] flex items-center pt-16 overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imgur.com/vH984Yq.jpeg" 
          alt="Hon. Dr. Kwamena Minta Nyarku" 
          className="w-full h-full object-cover object-top opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">
              Member of Parliament • Cape Coast North
            </span>
          </div>

          {/* Heading - UPDATED TEXT */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
            Building the <span className="text-green-500">Constituency</span> we want Together.
          </h1>

          {/* Slogan - UPDATED TEXT */}
          <p className="text-xl md:text-2xl font-bold text-slate-300 mb-8 flex items-center gap-3">
            Obiara Ka Ho! <span className="text-sm font-medium text-slate-400 italic">(Everyone is Involved)</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-green-600/20">
              Report an Issue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all backdrop-blur-sm">
              My Achievements
            </button>
          </div>

          {/* Stats/Points */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10">
            <div>
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Accountability</span>
              </div>
              <p className="text-slate-400 text-xs">Direct feedback sessions</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Visibility</span>
              </div>
              <p className="text-slate-400 text-xs">Present in the community</p>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Development</span>
              </div>
              <p className="text-slate-400 text-xs">Focused on infrastructure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}