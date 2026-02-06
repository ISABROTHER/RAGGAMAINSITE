// src/pages/Home.tsx
import { HeroSection } from "./home/HeroSection";
import { QuickAccessGrid } from "./home/QuickAccessGrid";
import { StatsStrip } from "./home/StatsStrip";
import { LatestUpdatesSection } from "./home/LatestUpdatesSection";
import { PrioritiesSection } from "./home/PrioritiesSection";

interface HomeProps {
  onNavigate: (page: string, param?: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Campaign Banner - Only on Home */}
      <div className="bg-red-700 text-white px-4 py-3 text-center font-bold uppercase tracking-wider text-sm md:text-base">
        SUPPORT HON. RAGGA’S OPERATION 1000 DESKS FOR STUDENTS 'II' OBIARA K
      </div>

      {/* 1. Hero / Introduction */}
      <HeroSection />

      {/* 2. Quick Links to Services */}
      <QuickAccessGrid onNavigate={onNavigate} />
      
      {/* 3. Campaign Statistics Counter */}
      <StatsStrip />
      
      {/* 4. Latest News & Stories */}
      <LatestUpdatesSection onNavigate={onNavigate} />
      
      {/* 5. Constituency Priorities & Vision */}
      <PrioritiesSection onNavigate={onNavigate} />
    </div>
  );
}