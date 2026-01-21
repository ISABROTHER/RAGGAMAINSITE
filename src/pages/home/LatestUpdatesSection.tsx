// src/pages/home/LatestUpdatesSection.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Image as ImageIcon } from 'lucide-react';

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
        <p className="mb-6"><strong>Cape Coast North</strong> – In a comprehensive address to his constituents, Member of Parliament Hon. Dr. Kwamena Minta Nyarku has rendered an account of his stewardship for the year 2025.</p>
        <p className="mb-6">The MP highlighted key achievements including the 'Operation 1000 Desks' for basic schools, scholarship packages for over 500 tertiary students, and business support grants for market women. "We are committed to transparent leadership and ensuring that every resource benefits the people of Cape Coast North," Hon. Ragga stated.</p>
      </>
    )
  }
];

// --- Slideshow Component ---
const FeaturedSlideshow = ({ item, onNavigate }: { item: UpdateItem, onNavigate: (page: string, param?: string) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col lg:flex-row h-auto lg:h-[600px]">
      
      {/* LEFT: IMAGE AREA (Now much larger and fit to show full picture) */}
      <div className="relative w-full lg:w-3/5 h-[400px] lg:h-full bg-slate-900 group">
        
        {/* Background Blur Effect for Fill */}
        <div 
            className="absolute inset-0 opacity-50 blur-3xl scale-110 transition-all duration-700"
            style={{ 
                backgroundImage: `url(${item.images[currentImageIndex]})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        />

        {/* The Full Picture (Object Contain) */}
        <img 
          src={item.images[currentImageIndex]} 
          alt={item.title}
          className="relative w-full h-full object-contain z-10 transition-opacity duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-amber-400 text-[#004528] text-xs font-extrabold uppercase tracking-wide shadow-lg z-20">
          {item.category}
        </div>

        {/* Photo Counter */}
        <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md z-20 border border-white/10">
          <ImageIcon className="w-4 h-4" />
          <span>{currentImageIndex + 1} / {item.images.length}</span>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button 
              onClick={prevImage}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md flex items-center justify-center transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md flex items-center justify-center transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
        </div>

        {/* Mobile touch hint (optional) */}
        <div className="lg:hidden absolute bottom-4 right-4 text-white/50 text-[10px] uppercase font-bold tracking-widest z-20">
            Tap arrows to slide
        </div>
      </div>
      
      {/* RIGHT: CONTENT AREA */}
      <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white relative">
        <div className="absolute top-0 right-0 p-6 opacity-10">
            <img src="https://i.imgur.com/1GfnCQc.png" className="w-32 grayscale" alt="Watermark" />
        </div>

        <div className="flex items-center gap-3 text-amber-600 font-bold uppercase tracking-wider text-sm mb-6">
            <Calendar className="w-5 h-5" />
            <time>{item.date}</time>
        </div>

        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-6">
            {item.title}
        </h3>

        <div className="text-slate-600 leading-relaxed mb-8 text-lg">
            {item.content}
        </div>

        <button 
            onClick={() => onNavigate('read-story', String(item.id))}
            className="w-full sm:w-auto py-4 px-8 bg-[#004528] hover:bg-[#00331e] text-white font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all hover:gap-4 shadow-lg hover:shadow-green-900/20"
        >
            Read Full Update
            <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// --- Main Section Component ---
interface LatestUpdatesSectionProps {
  onNavigate: (page: string, param?: string) => void;
}

export function LatestUpdatesSection({ onNavigate }: LatestUpdatesSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-[#FFFDF7] relative z-10">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h4 className="text-green-800 font-extrabold text-sm uppercase tracking-[0.2em] mb-3">
            PROJECT ACCOUNTABILITY
          </h4>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
            NEWS AND UPDATES
          </h2>
          <div className="h-1.5 w-24 bg-amber-400 rounded-full md:mx-0 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg max-w-2xl md:mx-0 mx-auto">
            Hon. Ragga accounts to his constituents on major projects, social interventions, 
            and support systems delivered across Cape Coast North in 2025.
          </p>
        </div>

        {/* Single Featured Item */}
        <div className="mt-8">
            {UPDATES.map((item) => (
              <FeaturedSlideshow key={item.id} item={item} onNavigate={onNavigate} />
            ))}
        </div>

      </div>
    </section>
  );
}