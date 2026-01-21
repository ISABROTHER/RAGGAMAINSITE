import { AboutHero } from './about/AboutHero';
import { AboutFullProfile } from './about/AboutFullProfile';

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <AboutFullProfile />
    </div>
  );
}
