// src/pages/home/HeroSection.tsx
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative min-h-[85vh] flex items-center pt-16 overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.imgur.com/KzS632U.jpeg"
          alt="Hon. Dr. Kwamena Minta Nyarku"
          className="w-full h-full object-cover object-top opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
              Obiara Ka Ho (Everyone is Involved)
            </span>
          </div>

          {/* UPDATED HEADLINE */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
            Building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Constituency We Want Together
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
            Empowering Cape Coast North through transparent leadership, 
            inclusive development, and dedicated service to every constituent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-xl shadow-green-900/20">
              Explore Projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all backdrop-blur-md border border-white/10 flex items-center justify-center gap-2">
              View Achievements
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl md:text-3xl font-black text-white">180+</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Student Grants</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-white">GH₵50k+</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">School Support</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-black text-white">10+</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Key Projects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}