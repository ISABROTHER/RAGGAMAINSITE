// src/pages/home/HeroSection.tsx
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

// The text to type out
const TAGLINE_TEXT = "OBIARA KA HO (EVERYONE IS INVOLVED)";

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor(Math.random() * HERO_IMAGES.length)
  );
  
  // State for typewriter effect
  const [displayedText, setDisplayedText] = useState("");

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect logic
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= TAGLINE_TEXT.length) {
        setDisplayedText(TAGLINE_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Adjust speed here (lower number = faster typing)

    return () => clearInterval(typingInterval);
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

      <div className="absolute inset-0 flex flex-col justify-end pb-[12%] md:pb-[18%] pl-[2%] z-30">
        <div className="max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge Removed per previous instruction */}

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-1 max-w-3xl">
              Building the Constituency <br className="block md:hidden" />
              <span className="text-green-400">We Want Together</span>
            </h1>

            {/* Typewriter Animation Container */}
            <div className="h-8 md:h-10 mb-2 overflow-hidden flex items-center">
              <p className="text-base md:text-xl text-white/70 font-medium whitespace-nowrap truncate">
                {displayedText}
                {/* Blinking Cursor */}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block ml-1 w-0.5 h-5 bg-green-400 align-middle"
                />
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
                to="/ongoing-projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm rounded-xl border border-white/20 transition-all whitespace-nowrap"
              >
                Track Projects
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