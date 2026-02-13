// src/pages/home/HeroSection.tsx
import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imgur.com/5H0XBuV.jpeg" 
          alt="Cape Coast North" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
        
        {/* Name Tag */}
        <motion_div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8"
        >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-50 text-xs md:text-sm font-bold uppercase tracking-widest">
                Hon. Dr. Kwamena Minta Nyarku (Ragga)
            </span>
        </motion_div>

        {/* Main Headline - UPDATED TEXT */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Building the Constituency <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            We Want Together
          </span>
        </h1>

        {/* Subtitle / Slogan - UPDATED TEXT */}
        <p className="text-xl md:text-2xl text-slate-200 font-medium mb-10 max-w-2xl mx-auto">
          <span className="text-green-400 font-black uppercase tracking-widest">Obiara Ka Do</span> 
          <span className="mx-3 opacity-50">|</span> 
          Everyone is Involved
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2">
                Read Manifesto <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold uppercase tracking-widest rounded-xl transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                Join the Movement
            </button>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>

    </section>
  );
}

// Simple Framer Motion Wrapper for the animation effect shown above
const motion_div = ({ children, className, initial, animate }: any) => (
    <div className={`${className} transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        {children}
    </div>
);