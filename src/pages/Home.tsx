// src/pages/Home.tsx
import { HeroSection } from "./home/HeroSection";
import { QuickAccessGrid } from "./home/QuickAccessGrid";
import { ConstituencyConnect } from "./home/ConstituencyConnect";
import { LatestUpdatesSection } from "./home/LatestUpdatesSection";
import { PrioritiesSection } from "./home/PrioritiesSection";

interface HomeProps {
  onNavigate: (page: string, param?: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. Hero / Introduction */}
      <HeroSection />

      {/* 2. Quick Links to Services */}
      <QuickAccessGrid onNavigate={onNavigate} />
      
      {/* 3. Constituency Connect (Data Portal) */}
      <ConstituencyConnect />
      
      {/* 4. Latest News & Stories */}
      <LatestUpdatesSection onNavigate={onNavigate} />
      
      {/* 5. Constituency Priorities & Vision */}
      <PrioritiesSection onNavigate={onNavigate} />
    </div>
  );
}