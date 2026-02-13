// src/pages/home/LatestUpdatesSection.tsx
import React, { useState } from 'react';
import { Calendar, ArrowRight, Image as ImageIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { AnimatedSection } from "../../components/AnimatedSection";

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
    content: (
      <>
        <p>
          Discover the latest progress and development initiatives led by Hon. Dr. Kwamena Minta Nyarku (Ragga) across the Cape Coast North constituency.
        </p>
      </>
    )
  }
];

// --- Gallery Component ---
const GalleryViewer = ({ images, title }: { images: string[], title: string }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextImage = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Active Image Stage - PORTRAIT ASPECT RATIO (4:5) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 shadow-sm group">
        
        {/* 1. Blurred Background Layer (Fills the portrait space) */}
        <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-60 scale-110"
            style={{ backgroundImage: `url(${images[activeIdx]})` }}
        />

        {/* 2. Sharp Foreground Image (Full Display - No Cropping) */}
        <img 
          src={images[activeIdx]} 
          alt={`View ${activeIdx + 1}`} 
          className="relative w-full h-full object-contain z-10 transition-all duration-500"
        />
        
        {/* Navigation Overlays */}
        <div className="absolute inset-0 flex items-center justify-between p-2 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="p-3 rounded-full bg-black/30 text-white hover:bg-black/60 backdrop-blur-md transition-all shadow-lg"
              aria-label="Previous image"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="p-3 rounded-full bg-black/30 text-white hover:bg-black/60 backdrop-blur-md transition-all shadow-lg"
              aria-label="Next image"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-xs font-bold rounded-lg backdrop-blur-md flex items-center gap-2 pointer-events-none z-20">
            <ImageIcon className="w-4 h-4" />
            {activeIdx + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        <div className="flex gap-2 min-w-min">
            {images.map((img, idx) => (
                <button 
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeIdx === idx ? 'border-amber-500 shadow-md scale-105 z-10 ring-2 ring-amber-500/50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Section Component ---
interface LatestUpdatesSectionProps {
  onNavigate: (page: string, param?: string) => void;
}

export function LatestUpdatesSection({ onNavigate }: LatestUpdatesSectionProps) {
  const item = UPDATES[0]; // We only have one featured update

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-100 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-4 md:pb-6">
            <div>
                <h4 className="text-green-700 font-extrabold text-xs uppercase tracking-widest mb-2">
                    Latest Activity
                </h4>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    News & Updates
                </h2>
            </div>
            <div className="hidden md:block">
                 <button 
                    onClick={() => onNavigate('read-story', String(item.id))}
                    className="text-sm font-bold text-slate-500 hover:text-green-700 flex items-center gap-2 transition-colors"
                >
                    View All Stories <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Main Content Card - Mobile First Order */}
        <AnimatedSection>
          <div className="bg-slate-50 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-10 border border-slate-200/60 shadow-xl shadow-slate-200/40">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16">
                  
                  {/* MOBILE ORDER: 1 (Gallery Top) */}
                  <div className="order-1 lg:order-2 relative w-full">
                      <GalleryViewer images={item.images} title={item.title} />
                  </div>

                  {/* MOBILE ORDER: 2 (Text Bottom) */}
                  <div className="order-2 lg:order-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-[10px] font-extrabold uppercase tracking-wide rounded-full">
                              {item.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wide">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{item.date}</span>
                          </div>
                      </div>

                      <h3 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight mb-4 md:mb-6">
                          {item.title}
                      </h3>

                      <div className="text-slate-600 leading-relaxed text-base md:text-lg mb-6 md:mb-8">
                          {item.content}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                          <button 
                              onClick={() => onNavigate('read-story', String(item.id))}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-800 hover:bg-green-900 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-green-900/20 w-full sm:w-auto"
                          >
                              Read Full Report
                              <ArrowRight className="w-4 h-4" />
                          </button>
                      </div>
                  </div>

              </div>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}