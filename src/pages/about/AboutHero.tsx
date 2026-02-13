// src/pages/about/AboutHero.tsx
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Target, Users, Sparkles } from 'lucide-react';

export function AboutHero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const stats = [
    { label: 'Years Experience', value: '15+', icon: Award },
    { label: 'Projects Completed', value: '200+', icon: Target },
    { label: 'Lives Impacted', value: '50k+', icon: Users },
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-slate-900">
      {/* 500x Innovation: Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(206,17,38,0.15),transparent_70%)]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Status Badge */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-6 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              OFFICIAL PROFILE
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Driving <span className="text-[#CE1126] inline-block relative">
                Change
                <motion.div 
                  className="absolute bottom-2 left-0 h-2 bg-white/20 w-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </span> <br />
              Through Vision
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
              Dedicated to the progress of our constituency through transparent leadership and sustainable community development.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-white"
                >
                  <div className="text-3xl font-black text-[#CE1126] mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* 500x Floating Element */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 shadow-2xl rounded-xl z-20 hidden lg:block"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <Sparkles className="w-6 h-6 text-[#CE1126]" />
                </div>
                <div>
                  <div className="text-slate-900 font-black text-lg leading-none">Honorable</div>
                  <div className="text-slate-500 text-sm">Constituency Leader</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}