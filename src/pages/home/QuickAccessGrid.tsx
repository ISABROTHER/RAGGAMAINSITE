// src/pages/home/QuickAccessGrid.tsx
import React from "react";
import { MessageSquareWarning, HardHat, Users, Award, Heart, UserCircle, ArrowRight } from "lucide-react";

type QuickLink = {
  title: string;
  desc: string;
  icon: React.ElementType;
  image: string;
  route: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Projects",
    desc: "Infrastructure progress",
    icon: HardHat,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
    route: "ongoing-projects"
  },
  {
    title: "Report Issue",
    desc: "Fix potholes & lights",
    icon: MessageSquareWarning,
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?auto=format&fit=crop&q=80&w=600",
    route: "issues"
  },
  {
    title: "Assemblymen",
    desc: "Know your local reps",
    icon: Users,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600",
    route: "assemblymen"
  },
  {
    title: "Achievements",
    desc: "Our track record",
    icon: Award,
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=600",
    route: "achievements"
  },
  {
    title: "Support",
    desc: "Donate to education",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600",
    route: "support"
  },
  {
    title: "Appointments",
    desc: "Book a meeting",
    icon: UserCircle,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    route: "appointments"
  }
];

interface QuickAccessGridProps {
  onNavigate: (page: string) => void;
}

export function QuickAccessGrid({ onNavigate }: QuickAccessGridProps) {
  return (
    <section className="relative z-20 -mt-8 md:-mt-16 pt-4 pb-10 md:pb-20 bg-white">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-left mb-8 md:mb-12">
          <h4 className="text-green-800 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-3">
            Constituency Services
          </h4>
          <div className="mt-2 flex flex-col items-start justify-start group">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-left bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 bg-clip-text text-transparent uppercase">
              Information & Support
            </h2>
            <span className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all group-hover:w-32" />
          </div>
        </div>

        {/* Grid: 2 Columns on Mobile, 3 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {quickLinks.map((link, idx) => (
            <button 
              key={idx} 
              onClick={() => onNavigate(link.route)} 
              className={`
                group relative aspect-[4/5] overflow-hidden rounded-none 
                transition-all duration-300 active:scale-95 hover:shadow-2xl hover:-translate-y-1
                w-full text-left bg-slate-100 shadow-md
              `}
            >
              {/* Top: The Picture */}
              <div className="absolute inset-0 h-full w-full">
                <img 
                  src={link.image} 
                  alt={link.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle gradient overlay to make image pop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Bottom: The "Part that contains name" with PROPER RED */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="
                  bg-gradient-to-r from-red-600/95 to-red-700/95
                  backdrop-blur-md border border-white/10 
                  rounded-none p-4 shadow-lg
                  transform transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600
                  flex items-center justify-between gap-3
                ">
                  {/* Text Content - Removed truncate so text wraps */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-2xl font-bold text-white leading-tight break-words">
                      {link.title}
                    </h3>
                    <p className="text-[10px] md:text-sm text-white/90 font-medium mt-1 break-words leading-snug">
                      {link.desc}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 bg-white/20 p-1.5 rounded-full group-hover:bg-white text-white group-hover:text-red-600 transition-colors">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}