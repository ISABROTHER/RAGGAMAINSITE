// src/pages/home/QuickAccessGrid.tsx
import React from "react";
import { MessageSquareWarning, HardHat, Users, Award, Heart, UserCircle } from "lucide-react";

type QuickLink = {
  title: string;
  mobileDesc: string;
  desc: string;
  icon: React.ElementType;
  bgClass: string;
  iconColor: string;
  route: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Ongoing Projects",
    mobileDesc: "Infrastructure",
    desc: "Track ongoing infrastructure developments and renovations.",
    icon: HardHat,
    bgClass: "from-amber-50 to-orange-50/50 border-orange-100",
    iconColor: "text-amber-600",
    route: "ongoing-projects"
  },
  {
    title: "Report Issue",
    mobileDesc: "Fix problems",
    desc: "Spot a problem? Report potholes or streetlights directly.",
    icon: MessageSquareWarning,
    bgClass: "from-emerald-50 to-teal-50/50 border-emerald-100",
    iconColor: "text-emerald-600",
    route: "issues"
  },
  {
    title: "Assemblymen",
    mobileDesc: "Local Reps",
    desc: "Meet the local representatives working with Hon. Ragga.",
    icon: Users,
    bgClass: "from-blue-50 to-indigo-50/50 border-blue-100",
    iconColor: "text-blue-600",
    route: "assemblymen"
  },
  {
    title: "Achievements",
    mobileDesc: "Track record",
    desc: "A record of promises kept: infrastructure, desks, and more.",
    icon: Award,
    bgClass: "from-purple-50 to-fuchsia-50/50 border-purple-100",
    iconColor: "text-purple-600",
    route: "achievements"
  },
  {
    title: "Support",
    mobileDesc: "Donate Books",
    desc: "Help us raise 200,000 exercise books for our students.",
    icon: Heart,
    bgClass: "from-rose-50 to-pink-50/50 border-rose-100",
    iconColor: "text-rose-600",
    route: "support"
  },
  {
    title: "Appointments",
    mobileDesc: "Book/Apply",
    desc: "Schedule meetings or submit job and grant applications.",
    icon: UserCircle,
    bgClass: "from-slate-50 to-gray-50/50 border-slate-200",
    iconColor: "text-slate-600",
    route: "appointments"
  }
];

interface QuickAccessGridProps {
  onNavigate: (page: string) => void;
}

export function QuickAccessGrid({ onNavigate }: QuickAccessGridProps) {
  return (
    <section className="relative z-20 -mt-12 md:-mt-20 pt-4 pb-10 md:pb-16 bg-white">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header Block: Left Aligned + Clean Text Style (No Pill) */}
        <div className="text-left mb-8 md:mb-14">
          
          {/* Eyebrow: Styled like Latest Updates section (Green, Bold, Uppercase) */}
          <h4 className="text-green-800 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
            Constituency Services
          </h4>

          {/* Main Title: Original Gradient & Animation */}
          <div className="mt-2 flex flex-col items-start justify-start group">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-left bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 bg-clip-text text-transparent uppercase">
              Information & Support
            </h2>
            <span className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all group-hover:w-32" />
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10">
          {quickLinks.map((link, idx) => (
            <button key={idx} onClick={() => onNavigate(link.route)} className={`group relative overflow-hidden rounded-xl md:rounded-3xl border ${link.bgClass} bg-gradient-to-br p-3 md:p-10 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all`}>
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl md:rounded-3xl flex items-center justify-center shadow-sm mb-2 md:mb-6 group-hover:scale-110"><link.icon className={`w-6 h-6 md:w-10 md:h-10 ${link.iconColor}`} /></div>
              <h3 className="text-xs sm:text-sm md:text-2xl font-bold text-slate-900 mb-1 md:mb-3 truncate w-full tracking-tight">{link.title}</h3>
              <p className="block md:hidden text-slate-500 text-[10px] leading-none font-medium">{link.mobileDesc}</p>
              <p className="hidden md:block text-slate-600 text-base leading-relaxed max-w-sm mx-auto">{link.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}