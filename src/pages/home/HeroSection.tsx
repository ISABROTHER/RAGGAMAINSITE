import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// --- MANUAL ADJUSTMENT SECTION ---
// Increase numbers to move DOWN, decrease (or use negative) to move UP
const VIBE_OFFSETS = {
  welcomePill: 0,   // Adjust "Welcome to the official website..."
  mainName: 0,      // Adjust "Hon. Dr. Kwamena Minta Nyarku"
  tagline: 0,       // Adjust the animated scrolling text
};

const HERO_IMAGES = [
  "https://i.imgur.com/XC8k4zQ.jpeg",
  "https://i.imgur.com/NSWtjdU.jpeg",
  "https://i.imgur.com/EqnSMPU.jpeg",
  "https://i.imgur.com/1P4hgqC.jpeg",
  "https://i.imgur.com/lUPM6jK.jpeg",
  "https://i.imgur.com/hmaoKHa.jpeg",
];

const TAGLINES = [
  "Building a Better Cape Coast North",
  "Every Voice Matters, Every Community Counts",
  "Transparent. Accountable. Results-Driven.",
  "Your MP, Working Tirelessly for You",
];

const STATS = [
  { label: "Communities", value: 107, suffix: "+" },
  { label: "Projects Delivered", value: 150, suffix: "+" },
  { label: "Active Initiatives", value: 12, suffix: "" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }, 600);
    return () => clearTimeout(timeout);
  }, [target]);

  return (
    <span className="text-2xl md:text-3xl font-black tabular-nums text-white">
      {count}
      {suffix}
    </span>
  );
}

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor(Math.random() * HERO_IMAGES.length)
  );
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[75vh] md:h-[92vh] overflow-hidden bg-slate-900">
      {HERO_IMAGES.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt="Hon. Dr. Kwamena Minta Nyarku"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out object-center md:object-[center_-200px]"
          style={{ opacity: idx === currentIndex ? 1 : 0 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Main Content Area */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 1. Pill Label */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3"
              style={{ transform: `translateY(${VIBE_OFFSETS.welcomePill}px)` }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
                Welcome to the official website of
              </span>
            </div>

            {/* 2. Main Name */}
            <h1 
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter sm:tracking-tight mb-3 max-w-3xl"
              style={{ transform: `translateY(${VIBE_OFFSETS.mainName}px)` }}
            >
              Hon. Dr. Kwamena{" "}
              <span className="text-green-400">Minta Nyarku</span>
            </h1>

            {/* 3. Animated Tagline */}
            <div 
              className="h-6 md:h-8 mb-5 overflow-hidden"
              style={{ transform: `translateY(${VIBE_OFFSETS.tagline}px)` }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-base md:text-xl text-white/70 font-medium"
                >
                  {TAGLINES[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* 4. Action Buttons (Position Fixed) */}
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                to="/issues"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5"
              >
                Report an Issue <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ongoing-projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/20 transition-all"
              >
                Track Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4 grid grid-cols-3 md:flex md:gap-16 items-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-[9px] md:text-[10px] text-white/50 font-bold uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-28 right-4 md:right-8 flex flex-col gap-1.5">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "h-8 bg-white"
                : "h-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}