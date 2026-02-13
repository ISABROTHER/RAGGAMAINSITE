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
    content: null
  }
];

const GalleryViewer = ({ images }: { images: string[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextImage = () => setActiveIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg group">
        <img 
          src={images[activeIdx]} 
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={prevImage} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextImage} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-[10px] font-bold rounded-md backdrop-blur-sm">
            {activeIdx + 1} / {images.length}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeIdx === idx ? 'border-green-600 scale-105' : 'border-transparent opacity-50'}`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export function LatestUpdatesSection({ onNavigate }: { onNavigate: (page: string, param?: string) => void }) {
  const item = UPDATES[0];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-100 pb-8">
            <div>
                <h4 className="text-green-700 font-bold text-xs uppercase tracking-[0.2em] mb-3">Latest Activity</h4>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">News & Updates</h2>
            </div>
            <button 
                onClick={() => onNavigate('read-story', String(item.id))}
                className="mt-4 md:mt-0 text-sm font-bold text-slate-400 hover:text-green-700 flex items-center gap-2 transition-colors"
            >
                View Archive <ArrowRight className="w-4 h-4" />
            </button>
        </div>

        <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <GalleryViewer images={item.images} />
                
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">{item.category}</span>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            <span>{item.date}</span>
                        </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                        {item.title}
                    </h3>

                    {/* Faint Divider Lines Style */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => onNavigate('read-story', String(item.id))}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-700/20"
                        >
                            Read Full Report
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedSection>

      </div>
    </section>
  );
}