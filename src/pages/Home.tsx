// src/pages/Home.tsx
import { HeroSection } from "./home/HeroSection";
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
      
      {/* 2. Constituency Connect (Data Portal) */}
      <ConstituencyConnect />
      
      {/* 3. Latest News & Stories */}
      <LatestUpdatesSection onNavigate={onNavigate} />
      
      {/* 4. Constituency Priorities & Vision */}
      <PrioritiesSection onNavigate={onNavigate} />
    </div>
  );
}