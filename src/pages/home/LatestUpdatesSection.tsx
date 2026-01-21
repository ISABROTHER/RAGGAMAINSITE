// src/pages/home/LatestUpdatesSection.tsx
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Image as ImageIcon } from 'lucide-react';

export interface UpdateItem {
  id: number;
  date: string;
  title: string;
  images: string[]; // Changed to an array of strings
  category: string;
  content: React.ReactNode;
}

export const UPDATES: UpdateItem[] = [
  {
    id: 1,
    date: "December 2025",
    title: "Hon. Ragga Accounts to Constituents on Projects and Support in 2025",
    images: [
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800", // 1. Students/Scholarship
      "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=800", // 2. Desks
      "https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg?auto=compress&cs=tinysrgb&w=800", // 3. Market Women
      "https://images.pexels.com/photos/3845653/pexels-photo-3845653.jpeg?auto=compress&cs=tinysrgb&w=800", // 4. Health
      "https://images.pexels.com/photos/11022645/pexels-photo-11022645.jpeg?auto=compress&cs=tinysrgb&w=800", // 5. Borehole
      "https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg?auto=compress&cs=tinysrgb&w=800", // 6. Community
      "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800", // 7. Infrastructure
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800", // 8. Team
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800"  // 9. Success
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

// --- Internal Component to Handle the Slideshow ---
const NewsCard = ({ item, onNavigate }: { item: UpdateItem, onNavigate: (page: string, param?: string) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the card when clicking arrow
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <article 
      onClick={() => onNavigate('read-story', String(item.id))}
      className="w-[340px] md:w-[400px] flex-shrink-0 snap-start flex flex-col h-auto group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden bg-white border border-slate-100/50"
    >
      {/* Slideshow Image Area */}
      <div className="h-64 w-full overflow-hidden relative bg-slate-100">
        
        {/* The Image */}
        <img 
          src={item.images[currentImageIndex]} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-[#004528] text-[10px] font-extrabold uppercase tracking-wide shadow-sm z-10">
          {item.category}
        </div>

        {/* Photo Counter Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/50 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm z-10">
          <ImageIcon className="w-3 h-3" />
          <span>{currentImageIndex + 1}/{item.images.length}</span>
        </div>

        {/* Navigation Arrows (Only show if more than 1 image) */}
        {item.images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/90 hover:text-green-800 text-white backdrop-blur-md flex items-center justify-center transition-all z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/90 hover:text-green-800 text-white backdrop-blur-md flex items-center justify-center transition-all z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {/* Content Area */}
      <div className="bg-[#004528] p-5 md:p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 text-amber-400/90 text-xs font-bold uppercase tracking-wide mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <time>{item.date}</time>
          </div>
          <h3 className="text-white text-lg md:text-xl font-bold leading-snug mb-4 line-clamp-3 group-hover:text-amber-50 transition-colors">
            {item.title}
          </h3>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/10">
          <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-[#004528] text-xs font-extrabold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
            Read Full Update
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

// --- Main Section Component ---
interface LatestUpdatesSectionProps {
  onNavigate: (page: string, param?: string) => void;
}

export function LatestUpdatesSection({ onNavigate }: LatestUpdatesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; 
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-[#FFFDF7] border-b border-slate-100 relative z-10">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-green-800 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-3">
                PROJECT ACCOUNTABILITY
              </h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
                NEWS AND UPDATES
              </h2>
            </div>
            
            <div className="md:hidden flex items-center gap-1 text-slate-400 text-xs font-bold animate-pulse">
              <span>Swipe Photos</span>
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          
          <p className="text-slate-600 text-sm md:text-lg max-w-3xl leading-relaxed">
            Hon. Ragga accounts to his constituents on major projects, social interventions, 
            and support systems delivered across Cape Coast North in 2025.
          </p>
        </div>

        <div className="relative group/carousel flex justify-center md:justify-start">
          {/* Note: Scroll buttons hidden since we only have 1 card now, 
              but layout preserved for future additions */}
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-6 scrollbar-hide snap-x snap-mandatory scroll-pl-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {UPDATES.map((item) => (
              <NewsCard key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}