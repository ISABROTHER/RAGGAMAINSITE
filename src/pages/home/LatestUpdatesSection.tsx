// src/pages/home/LatestUpdatesSection.tsx
import React, { useState } from 'react';
import { Calendar, ArrowRight, Image as ImageIcon, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UpdateItem {
  id: number;
  date: string;
  title: string;
  images: string[]; 
  category: string;
  content: React.ReactNode;
}

export const UPDATES: UpdateItem[] = [
  {
    id: 1,
    date: "December 2025",
    title: "Hon. Ragga Accounts to Constituents on Projects and Support in 2025",
    images: [
      "https://i.imgur.com/XoqlsAC.jpeg",
      "https://i.imgur.com/OqsIcji.jpeg",
      "https://i.imgur.com/yZ9V6M2.jpeg",
      "https://i.imgur.com/L6nJMP5.jpeg",
      "https://i.imgur.com/veGAIOC.jpeg",
      "https://i.imgur.com/aFuPALQ.jpeg",
      "https://i.imgur.com/3HDhGUz.jpeg",
      "https://i.imgur.com/ZaoXlVe.jpeg",
      "https://i.imgur.com/d0KGtX4.jpeg",
      "https://i.imgur.com/bYQKQgG.jpeg",
      "https://i.imgur.com/yXrt70N.jpeg",
      "https://i.imgur.com/8j8Gls6.jpeg",
      "https://i.imgur.com/2PVKXWQ.jpeg"
    ],
    category: "Accountability",
    content: null // Keeping it clean per your previous request
  }
];

const GalleryViewer = ({ images }: { images: string[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextImage = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full group">
      {/* Main Feature Container */}
      <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeIdx}
            src={images[activeIdx]} 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Glass Overlay Controls */}
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between z-20">
            <div className="flex gap-2">
                <button onClick={prevImage} className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                {activeIdx + 1} <span className="text-white/40 mx-1">/</span> {images.length}
            </div>
        </div>
      </div>

      {/* Modern Thumbnail Strip */}
      <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide px-1">
        {images.slice(0, 6).map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden transition-all duration-300 ${activeIdx === idx ? 'ring-2 ring-green-500 scale-105 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
        {images.length > 6 && (
            <div className="flex-shrink-0 w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                +{images.length - 6}
            </div>
        )}
      </div>
    </div>
  );
};

export function LatestUpdatesSection({ onNavigate }: LatestUpdatesSectionProps) {
  const item = UPDATES[0];

  return (
    <section className="py-20 md:py-28 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Innovative Header Design */}
        <div className="relative mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="relative">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <span className="w-12 h-[2px] bg-green-600 rounded-full" />
                        <span className="text-green-700 font-black text-xs uppercase tracking-[0.3em]">The Ragga Report</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        Latest <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Milestones.</span>
                    </h2>
                </div>
                <button 
                    onClick={() => onNavigate('read-story', String(item.id))}
                    className="group flex items-center gap-4 text-slate-400 hover:text-green-700 transition-colors"
                >
                    <span className="text-xs font-black uppercase tracking-widest">Explore Archive</span>
                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-green-600 group-hover:bg-green-50 transition-all">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
        </div>

        {/* Content Template: "The Feature Card" */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Visuals (Col 1-7) */}
            <div className="lg:col-span-7">
                <GalleryViewer images={item.images} />
            </div>

            {/* Right Column: Information (Col 8-12) */}
            <div className="lg:col-span-5 lg:pl-8">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative">
                    <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-50" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published</span>
                                <span className="text-sm font-bold text-slate-900">{item.date}</span>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</span>
                                <span className="text-sm font-bold text-green-600">{item.category}</span>
                            </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-8">
                            {item.title}
                        </h3>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                                <p className="text-slate-500 font-medium text-sm leading-relaxed italic">
                                    "This report outlines the tangible results achieved through collective effort in Cape Coast North."
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={() => onNavigate('read-story', String(item.id))}
                            className="w-full py-5 bg-slate-900 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            Read Full Report
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Social Proof Mini-Card */}
                <div className="mt-6 flex items-center justify-between p-6 bg-green-600 rounded-3xl text-white shadow-xl shadow-green-900/10">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-green-600 bg-green-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} />
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-green-600 bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                            +1k
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Join the discussion</span>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}

interface LatestUpdatesSectionProps {
  onNavigate: (page: string, param?: string) => void;
}