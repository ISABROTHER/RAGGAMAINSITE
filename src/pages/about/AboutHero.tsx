// src/pages/about/AboutHero.tsx
import React from 'react';
import { Award, Target, Users } from 'lucide-react';

export function AboutHero() {
  const stats = [
    { label: 'Years Experience', value: '15+', icon: Award },
    { label: 'Projects Completed', value: '200+', icon: Target },
    { label: 'Lives Impacted', value: '50k+', icon: Users },
  ];

  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(206,17,38,0.1),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Driving <span className="text-[#CE1126]">Change</span> <br />
              Through Vision
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-lg">
              Dedicated to the progress of our constituency through transparent leadership and sustainable community development.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-white">
                  <div className="text-3xl font-black text-[#CE1126] mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}