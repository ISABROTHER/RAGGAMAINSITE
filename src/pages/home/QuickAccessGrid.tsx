// src/pages/home/QuickAccessGrid.tsx
import React from "react";
import { MessageSquareWarning, HardHat, Users, Award, Heart, UserCircle, ArrowUpRight } from "lucide-react";

type QuickLink = {
  title: string;
  desc: string;
  icon: React.ElementType;
  image: string;
  route: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Ongoing Projects",
    desc: "Track infrastructure progress",
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

        {/* 2 Columns Mobile (Portrait Cards), 3 Columns Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {quickLinks.map((link, idx) => (
            <button 
              key={idx} 
              onClick={() => onNavigate(link.route)} 
              className={`
                group relative aspect-[4/5] overflow-hidden rounded-3xl 
                transition-all duration-300 active:scale-95 hover:shadow-2xl hover:-translate-y-1
                w-full text-left
              `}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={link.image} 
                  alt={link.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
              </div>

              {/* Content Overlay (Flutter/Modern Style) */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                
                {/* Top Icon Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>

                {/* Main Content */}
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-600/90 backdrop-blur-sm flex items-center justify-center mb-3 shadow-lg">
                    <link.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  
                  <h3 className="text-base md:text-2xl font-bold text-white leading-tight mb-1">
                    {link.title}
                  </h3>
                  
                  <p className="text-[10px] md:text-sm text-slate-300 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 transform translate-y-2 group-hover:translate-y-0">
                    {link.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}