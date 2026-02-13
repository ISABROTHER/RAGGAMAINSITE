// src/pages/home/QuickAccessGrid.tsx
import React from "react";
import { motion } from "framer-motion";
import { MessageSquareWarning, HardHat, Users, Award, Heart, UserCircle } from "lucide-react";

type QuickLink = {
  title: string;
  desc: string;
  icon: React.ElementType;
  image: string;
  route: string;
  imgPosition?: string;
};

const quickLinks: QuickLink[] = [
  {
    title: "Projects",
    desc: "Ongoing projects",
    icon: HardHat,
    image: "https://i.imgur.com/jdIxXwk.jpeg", 
    route: "ongoing-projects"
  },
  {
    title: "Report Issue",
    desc: "Report any issue",
    icon: MessageSquareWarning,
    image: "https://i.imgur.com/vt0bGZx.jpeg", 
    route: "issues"
  },
  {
    title: "Assemblymen",
    desc: "Know your local reps",
    icon: Users,
    image: "https://mrh.gov.gh/wp-content/uploads/2022/10/sino-cape-coast-2.jpg", 
    route: "assemblymen"
  },
  {
    title: "Achievements",
    desc: "Our track record",
    icon: Award,
    image: "https://i.imgur.com/RRiZZkS.jpeg", 
    route: "achievements"
  },
  {
    title: "Donation",
    desc: "Be part of a change",
    icon: Heart,
    image: "https://i.imgur.com/eF6PPA9.jpeg", 
    route: "support",
    imgPosition: "object-top" 
  },
  {
    title: "Appointments",
    desc: "Ready to listen",
    icon: UserCircle,
    image: "https://i.imgur.com/BkoisB5.jpeg", 
    route: "appointments"
  }
];

interface QuickAccessGridProps {
  onNavigate: (page: string) => void;
}

// Animation variants for the container (stagger effect)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function QuickAccessGrid({ onNavigate }: QuickAccessGridProps) {
  return (
    <section className="relative z-20 -mt-8 md:-mt-16 pt-4 pb-10 md:pb-20 bg-white overflow-hidden">
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header Block with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h4 className="text-green-800 font-extrabold text-xs md:text-sm uppercase tracking-widest mb-0 inline-block">
            Constituency Services
          </h4>
          <div className="mt-0 flex flex-col items-center justify-center group">
            <h2 className="
              text-[5.5vw] sm:text-4xl md:text-5xl 
              font-extrabold tracking-tight 
              bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 
              bg-clip-text text-transparent uppercase
              whitespace-nowrap leading-tight
            ">
              Information & Support
            </h2>
            <span className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all group-hover:w-32" />
          </div>
        </motion.div>

        {/* Animated Grid Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 items-start"
        >
          {quickLinks.map((link, idx) => (
            <motion.button 
              key={idx} 
              variants={itemVariants}
              onClick={() => onNavigate(link.route)} 
              className={`
                group relative aspect-[4/5] overflow-hidden rounded-none 
                transition-all duration-300 active:scale-95 hover:shadow-2xl hover:-translate-y-1
                w-full text-left bg-slate-100 shadow-md block
              `}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 h-full w-full">
                <img 
                  src={link.image} 
                  alt={link.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${link.imgPosition || 'object-center'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Text Layer */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="
                  bg-gradient-to-r from-red-600/95 to-red-700/95
                  backdrop-blur-md border border-white/10 
                  rounded-none px-3 py-2.5 shadow-lg
                  transform transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600
                ">
                  <h3 className="text-sm sm:text-base md:text-2xl font-bold text-white leading-tight whitespace-nowrap truncate">
                    {link.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-white/90 font-medium mt-0.5 whitespace-nowrap truncate leading-snug">
                    {link.desc}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 