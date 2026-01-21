// src/pages/home/LatestUpdatesSection.tsx
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

export interface UpdateItem {
  id: number;
  date: string;
  title: string;
  image: string;
  category: string;
  content: React.ReactNode;
}

export const UPDATES: UpdateItem[] = [
  {
    id: 1,
    date: "December 2025",
    title: "Hon. Ragga Accounts to Constituents on Projects and Support in 2025",
    image: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Accountability",
    content: (
      <>
        <p className="mb-6"><strong>Cape Coast North</strong> – In a comprehensive address to his constituents, Member of Parliament Hon. Dr. Kwamena Minta Nyarku has rendered an account of his stewardship for the year 2025.</p>
        <p className="mb-6">The MP highlighted key achievements including the 'Operation 1000 Desks' for basic schools, scholarship packages for over 500 tertiary students, and business support grants for market women. "We are committed to transparent leadership and ensuring that every resource benefits the people of Cape Coast North," Hon. Ragga stated.</p>
      </>
    )
  }
];

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
              <span>Slide</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          <p className="text-slate-600 text-sm md:text-lg max-w-3xl leading-relaxed">
            Hon. Ragga accounts to his constituents on major projects, social interventions, 
            and support systems delivered across Cape Coast North in 2025.
          </p>
        </div>

        <div className="relative group/carousel">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-[40%] -translate-y-1/2 -ml-3 md:-ml-6 z-30 bg-white/90 backdrop-blur-sm shadow-xl border border-slate-100 p-2 md:p-3 rounded-full text-slate-700 hover:text-green-700 hover:scale-110 transition-all flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-[40%] -translate-y-1/2 -mr-3 md:-mr-6 z-30 bg-white/90 backdrop-blur-sm shadow-xl border border-slate-100 p-2 md:p-3 rounded-full text-slate-700 hover:text-green-700 hover:scale-110 transition-all flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-6 scrollbar-hide snap-x snap-mandatory scroll-pl-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {UPDATES.map((item) => (
              <article 
                key={item.id} 
                onClick={() => onNavigate('read-story', String(item.id))}
                className="w-[280px] sm:w-[340px] md:w-[380px] flex-shrink-0 snap-start flex flex-col h-auto group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden bg-white border border-slate-100/50"
              >
                <div className="h-48 md:h-60 w-full overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-[#004528] text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
                    {item.category}
                  </div>
                </div>
                
                <div className="bg-[#004528] p-5 md:p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl pointer-events-none"></div>

                  <div>
                    <div className="flex items-center gap-2 text-amber-400/90 text-xs font-bold uppercase tracking-wide mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <time>{item.date}</time>
                    </div>
                    <h3 className="text-white text-base md:text-xl font-bold leading-snug mb-4 line-clamp-3 group-hover:text-amber-50 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-[#004528] text-xs font-extrabold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
                      Read Update
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}