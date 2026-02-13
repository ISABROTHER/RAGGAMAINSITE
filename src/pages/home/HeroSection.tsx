// src/pages/home/HeroSection.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_IMAGES = [
  "https://i.imgur.com/XC8k4zQ.jpeg",
  "https://i.imgur.com/NSWtjdU.jpeg",
  "https://i.imgur.com/EqnSMPU.jpeg",
  "https://i.imgur.com/1P4hgqC.jpeg",
  "https://i.imgur.com/lUPM6jK.jpeg",
  "https://i.imgur.com/hmaoKHa.jpeg",
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor(Math.random() * HERO_IMAGES.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
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

      <div className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
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

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-4 max-w-4xl">
              Building a Better <br/>
              Constituency Together
            </h1>

            <div className="mb-8">
                <p className="text-xl md:text-3xl text-green-400 font-black tracking-wide uppercase">
                  Obiara Ka Ho
                </p>
            </div>

            <div className="flex flex-wrap gap-3 items-start">
              <Link
                to="/issues"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5 whitespace-nowrap"
              >
                Report an Issue <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/achievements"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/20 transition-all whitespace-nowrap"
              >
                Achievements <Trophy className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

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