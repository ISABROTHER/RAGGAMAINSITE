// src/pages/home/HeroSection.tsx
import React, { useEffect, useState } from "react";

const HERO_IMAGES = [
  "https://i.imgur.com/XC8k4zQ.jpeg",
  "https://i.imgur.com/NSWtjdU.jpeg",
  "https://i.imgur.com/EqnSMPU.jpeg",
  "https://i.imgur.com/1P4hgqC.jpeg",
  "https://i.imgur.com/lUPM6jK.jpeg",
  "https://i.imgur.com/hmaoKHa.jpeg"
];

// DESKTOP HERO POSITION (EDIT THIS ONLY FOR WEB)
const HERO_POSITION = "center -200px";

// MOBILE VERTICAL OFFSET (EDIT THIS ONLY FOR PHONE)
// 0 = current, negative = pull image UP, positive = push image DOWN
const MOBILE_Y_OFFSET = 0;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor(Math.random() * HERO_IMAGES.length)
  );

  // Change image every 3 seconds with smooth cross-fade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full">
      {/* Mobile: maintain natural height using an invisible spacer image */}
      <div className="block md:hidden w-full bg-white overflow-hidden relative">
        {/* Spacer to keep the original height */}
        <img
          src={HERO_IMAGES[0]}
          alt=""
          className="w-full h-auto invisible"
        />

        {/* Cross-fade stack */}
        {HERO_IMAGES.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Hon. Dr. Kwamena Minta Nyarku"
            className="absolute top-0 left-0 w-full h-auto transition-opacity duration-800 ease-in-out"
            style={{
              opacity: idx === currentIndex ? 1 : 0,
              transform: `translateY(${MOBILE_Y_OFFSET}px)`
            }}
          />
        ))}
      </div>

      {/* Desktop: large hero with controlled crop, cross-fade */}
      <div className="hidden md:block w-full h-[90vh] overflow-hidden bg-white relative">
        {HERO_IMAGES.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt="Hon. Dr. Kwamena Minta Nyarku"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ease-in-out"
            style={{
              opacity: idx === currentIndex ? 1 : 0,
              objectPosition: HERO_POSITION
            }}
          />
        ))}
      </div>

      {/* Slider indicators (6 dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
        {HERO_IMAGES.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full border border-white/60 ${
              idx === currentIndex ? "bg-white" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
