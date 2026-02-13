// src/pages/about/AboutHero.tsx
import React from 'react';

export function AboutHero() {
  const heroDesktopUrl = "https://i.imgur.com/6rWU7qN.png";
  const heroMobileUrl = "https://i.imgur.com/abKZDVv.png";

  return (
    <section className="w-full bg-slate-50 relative overflow-hidden">
      {/* Mobile Hero: Natural height to prevent cropping on phones */}
      <div className="block md:hidden w-full relative">
        <img
          src={heroMobileUrl}
          alt="Cape Coast North Leadership"
          className="w-full h-auto object-cover"
        />
        {/* Subtle gradient overlay for better text contrast if needed later */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Desktop Hero: Fixed substantial height with perfect centering */}
      <div className="hidden md:block w-full h-[500px] lg:h-[600px] xl:h-[650px] relative">
        <img
          src={heroDesktopUrl}
          alt="Cape Coast North Leadership"
          className="w-full h-full object-cover object-[center_25%]" 
        />
        {/* Cinematic Shadow Overlay at the bottom to blend into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
      </div> 
    </section>
  );
}