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
  ArrowRight
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
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-10 md:mb-16">
          <h4 className="text-green-800 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-3">
            My Vision
          </h4>
          <div className="mt-4 flex flex-col items-start justify-start group">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-left bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 bg-clip-text text-transparent">
              My Priorities
            </h3>
            <span className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 motion-safe:transition-all motion-safe:duration-500 group-hover:w-32" />
          </div>
          <p className="mt-6 text-base md:text-lg text-slate-600 max-w-3xl mr-auto leading-relaxed">
            We are building a community where opportunity is shared, education is accessible, and healthcare is a right, not a privilege.
          </p>
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
                className={`w-full flex items-stretch gap-4 rounded-2xl border ${priority.accentBorder} bg-white overflow-hidden shadow-sm motion-safe:transition-all motion-safe:duration-200 active:scale-[0.98]`}
              >
                <div className="relative w-28 min-w-[7rem] h-28 overflow-hidden">
                  <img src={priority.image} alt={priority.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-4 pr-4 text-left">
                  <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">{priority.title}</h4>
                  {/* Updated Text: Bolder and Red Color */}
                  <p className="text-[11px] font-black text-red-600 mt-1 uppercase tracking-wide">
                    <Counter end={achievementCounts[priority.id]} /> initiatives delivered
                  </p>
                  <p className="text-xs text-slate-600 leading-snug mt-1 line-clamp-2">{priority.desc}</p>
                  <span className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-700 group">
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
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-20 p-4 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border-2 border-red-600 text-red-600 hover:border-green-600 hover:text-green-600 hover:bg-green-50 hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none">
              <ChevronLeft className="w-7 h-7" strokeWidth={3} />
            </button>
          )}

          {canScrollRight && (
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-20 p-4 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border-2 border-red-600 text-red-600 hover:border-green-600 hover:text-green-600 hover:bg-green-50 hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none">
              <ChevronRight className="w-7 h-7" strokeWidth={3} />
            </button>
          )}

          <div ref={scrollRef} onScroll={checkScroll} className="flex gap-8 overflow-x-auto pb-12 pt-4 snap-x scrollbar-hide scroll-smooth relative z-10" style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}>
            {priorities.map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.id} className="snap-center flex-shrink-0 w-[350px] lg:w-[400px] xl:w-[450px] group bg-slate-50 rounded-3xl p-6 xl:p-8 border border-slate-100 hover:shadow-2xl hover:shadow-slate-900/5 motion-safe:transition-all motion-safe:duration-300 hover:-translate-y-2 flex flex-col">
                  <div className="mb-6 rounded-2xl overflow-hidden h-48 xl:h-56 w-full relative shadow-inner">
                    <img src={priority.image} alt={priority.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">
                      <Icon className={`w-4 h-4 ${priority.accentText}`} />
                      <span className="text-xs font-bold text-slate-800">{priority.subtitle}</span>
                    </div>
                  </div>

                  <h4 className="text-2xl font-extrabold text-slate-900 mb-2">{priority.title}</h4>
                  {/* Updated Text: Bolder and Red Color */}
                  <p className="text-sm font-black text-red-600 mb-3 uppercase tracking-wide">
                    <Counter end={achievementCounts[priority.id]} /> initiatives delivered
                  </p>
                  <p className="text-slate-600 mb-6 leading-relaxed text-base flex-1">{priority.desc}</p>
                  <button onClick={() => onNavigate("achievements")} className="font-bold inline-flex items-center text-base text-emerald-700 group-hover:underline decoration-2 underline-offset-4">
                    View Details 
                    <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}