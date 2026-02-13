// src/pages/home/PrioritiesSection.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  BookOpen,
  HeartPulse,
  Briefcase,
  Construction,
  Sprout,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Quote
} from "lucide-react";
import { achievementCounts } from "../../data/achievements";

interface PrioritiesSectionProps {
  onNavigate: (page: string) => void;
}

type Priority = {
  id: keyof typeof achievementCounts;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  image: string;
};

const priorities: Priority[] = [
  {
    id: "education",
    title: "Educational Support",
    subtitle: "Educational Support",
    desc: "Supporting quality education, digital literacy, and youth skills training.",
    icon: BookOpen,
    accentBg: "bg-blue-100",
    accentText: "text-blue-700",
    accentBorder: "border-blue-200",
    image: "https://i.imgur.com/Ozjnrli.jpeg"
  },
  {
    id: "health",
    title: "Health & Sanitation",
    subtitle: "Health & Sanitation",
    desc: "Expanding access to healthcare and clean water for all.",
    icon: HeartPulse,
    accentBg: "bg-green-100",
    accentText: "text-green-700",
    accentBorder: "border-green-200",
    image: "https://i.imgur.com/XmWnKbH.jpeg"
  },
  {
    id: "employment",
    title: "Job Creation",
    subtitle: "Job Creation",
    desc: "Creating jobs and empowering local businesses.",
    icon: Briefcase,
    accentBg: "bg-amber-100",
    accentText: "text-amber-700",
    accentBorder: "border-amber-200",
    image: "https://i.imgur.com/saQoFLV.png"
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    subtitle: "Infrastructure",
    desc: "Improving roads, electrification, and connectivity.",
    icon: Construction,
    accentBg: "bg-slate-100",
    accentText: "text-slate-800",
    accentBorder: "border-slate-300",
    image: "https://i.imgur.com/AZqDymE.jpeg"
  },
  {
    id: "agriculture",
    title: "Agri-Development",
    subtitle: "Agri-Development",
    desc: "Supporting farmers with tools, training, and market access.",
    icon: Sprout,
    accentBg: "bg-emerald-100",
    accentText: "text-emerald-700",
    accentBorder: "border-emerald-200",
    image: "https://i.imgur.com/TZ4jIJA.jpeg"
  }
];

// Simple Counter Component for Animation
function Counter({ end, duration = 2000 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count}</>;
}

export function PrioritiesSection({ onNavigate }: PrioritiesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 420;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-left mb-12 md:mb-20">
          <h4 className="text-green-800 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-green-600"></span>
            My Vision
          </h4>
          <div className="mt-4 flex flex-col items-start justify-start group mb-8">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-left bg-gradient-to-r from-slate-900 via-green-800 to-slate-900 bg-clip-text text-transparent uppercase leading-tight">
              My Priorities
            </h3>
          </div>

          {/* PRIORITY VISION BOX - FROSTED GLASS EFFECT */}
          <div className="relative group max-w-4xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl border border-green-100 rounded-xl p-6 md:p-8 shadow-xl">
              <Quote className="absolute top-4 left-4 w-8 h-8 text-green-200 -z-10 opacity-50 rotate-180" />
              <p className="text-base md:text-xl text-slate-700 leading-relaxed font-medium">
                "With the support of government and collaboration with the municipal assembly, I remain focused on building a constituency where <span className="text-green-700 font-bold">opportunity is shared</span>, <span className="text-green-700 font-bold">education is accessible</span>, and <span className="text-green-700 font-bold">healthcare is a right</span>, not a privilege."
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-[2px] w-12 bg-green-500"></div>
                <span className="text-xs font-black text-green-800 uppercase tracking-wider">Hon. Dr. Kwamena Minta Nyarku</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            MOBILE LAYOUT
           ========================= */}
        <div className="md:hidden space-y-4">
          {priorities.map((priority) => {
            const Icon = priority.icon;
            return (
              <button
                key={priority.id}
                type="button"
                onClick={() => onNavigate("achievements")}
                className={`w-full flex flex-col gap-0 rounded-2xl border ${priority.accentBorder} bg-white overflow-hidden shadow-sm motion-safe:transition-all motion-safe:duration-200 active:scale-[0.98]`}
              >
                <div className="relative w-full h-40 overflow-hidden">
                  <img src={priority.image} alt={priority.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h4 className="text-lg font-bold text-white leading-tight uppercase shadow-black drop-shadow-md">{priority.title}</h4>
                  </div>
                </div>
                <div className="p-5 text-left bg-white">
                  <p className="text-[10px] font-black text-red-600 mb-2 uppercase tracking-wide bg-red-50 inline-block px-2 py-1 rounded">
                    <Counter end={achievementCounts[priority.id]} />+ ACHIEVEMENTS
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">{priority.desc}</p>
                  <span className="inline-flex items-center text-xs font-bold text-green-700 group uppercase bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    View Details
                    <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* =========================
            DESKTOP LAYOUT
           ========================= */}
        <div className="hidden md:block relative group/section">
          
          {canScrollLeft && (
            <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 text-slate-700 hover:text-green-600 hover:scale-110 transition-all duration-300">
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>
          )}

          {canScrollRight && (
            <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 text-slate-700 hover:text-green-600 hover:scale-110 transition-all duration-300">
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          )}

          <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto pb-12 pt-4 snap-x scrollbar-hide scroll-smooth relative z-10" style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}>
            {priorities.map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.id} className="snap-center flex-shrink-0 w-[380px] group bg-white rounded-[2rem] p-0 border border-slate-200 hover:border-green-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] motion-safe:transition-all motion-safe:duration-300 flex flex-col overflow-hidden">
                  <div className="h-56 w-full relative overflow-hidden">
                    <img src={priority.image} alt={priority.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <span className="p-1.5 bg-green-500 rounded-lg">
                                <Icon className="w-3 h-3 text-white" />
                            </span>
                            <span className="text-[10px] font-bold text-green-300 uppercase tracking-wider">{priority.subtitle}</span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase leading-none drop-shadow-lg">{priority.title}</h4>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 bg-white relative">
                    <div className="absolute -top-6 right-6 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Counter end={achievementCounts[priority.id]} />+ ACHIEVEMENTS
                    </div>
                    
                    <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-1 pt-2">{priority.desc}</p>
                    
                    <div className="pt-4 border-t border-slate-100 mt-auto">
                        <button onClick={() => onNavigate("achievements")} className="w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-bold text-xs uppercase hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2 group/btn">
                            View Achievements 
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}