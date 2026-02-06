// src/pages/about/AboutHero.tsx

export function AboutHero() {
  const heroDesktopUrl = "https://i.imgur.com/6rWU7qN.png";
  const heroMobileUrl = "https://i.imgur.com/abKZDVv.png";

  return (
    <section className="w-full bg-slate-50">
      {/* Mobile hero: Natural height to prevent cropping */}
      <div className="block md:hidden w-full">
        <img
          src={heroMobileUrl}
          alt="Cape Coast North Leadership"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Desktop hero: Fixed height banner */}
      <div className="hidden md:block relative w-full h-[420px] lg:h-[520px]">
        <img
          src={heroDesktopUrl}
          alt="Cape Coast North Leadership"
          className="w-full h-full object-cover object-center"
        />
      </div> 
    </section>
  );
}