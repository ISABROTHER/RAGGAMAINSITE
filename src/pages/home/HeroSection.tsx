import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
    <span className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums text-white">
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
    <section className="relative w-full h-[80vh] md:h-[92vh] overflow-hidden bg-slate-900">
      {HERO_IMAGES.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt="Hon. Dr. Kwamena Minta Nyarku"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out object-center md:object-[center_-200px]"
          style={{ opacity: idx === currentIndex ? 1 : 0 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-32 md:pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
                Cape Coast North Constituency
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-4 max-w-3xl">
              Hon. Dr. Kwamena{" "}
              <span className="text-green-400">Minta Nyarku</span>
            </h1>

            <div className="h-8 md:h-10 mb-8 overflow-hidden">
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

            <div className="flex flex-wrap gap-3">
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

      {/* Stats Bar - Positioned at bottom with better padding */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg border-t border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
          <div className="grid grid-cols-3 gap-4 md:flex md:gap-20">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center md:items-start">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-[8px] md:text-[10px] text-white/60 font-black uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators - Moved up to not overlap stats */}
      <div className="absolute bottom-32 right-4 md:right-8 flex flex-col gap-2 z-20">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "h-6 md:h-8 bg-green-400"
                : "h-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}