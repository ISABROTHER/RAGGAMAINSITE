import { useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import {
  ArrowRight,
  Briefcase,
  Rocket,
  Laptop,
  Landmark,
  GraduationCap,
  Banknote,
  LayoutDashboard,
  Eye,
  Target,
} from 'lucide-react';

// Helper component for animated sections (copied from project pattern)
const AnimatedSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-section-enter');
          entry.target.classList.remove('opacity-0', 'translate-y-5');
          observer.unobserve(entry.target); // Animate only once
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.classList.add('opacity-0', 'translate-y-5');
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Data for the 7 Pillars
const pillars = [
  {
    icon: Briefcase,
    title: 'Cape Works Initiative (CWI)',
    description: 'Youth working, Cape Coast shining.',
    imageUrl: 'https://images.pexels.com/photos/6567674/pexels-photo-6567674.jpeg', // Image 1
  },
  {
    icon: Rocket,
    title: 'Cape Innovates Accelerator (CIA)',
    description: 'Turning local ideas into global businesses.',
    imageUrl: 'https://images.pexels.com/photos/11535807/pexels-photo-11535807.jpeg', // Image 2
  },
  {
    icon: Laptop,
    title: 'Digital Cape Project (DCP)',
    description: 'Train local, work global.',
    imageUrl: 'https://images.pexels.com/photos/2306222/pexels-photo-2306222.jpeg', // Image 3
  },
  {
    icon: Landmark,
    title: 'Heritage Jobs 360 (HJ360)',
    description: 'Our history, our hustle.',
    imageUrl: 'https://images.pexels.com/photos/1422408/pexels-photo-1422408.jpeg', // Image 4
  },
  {
    icon: GraduationCap,
    title: 'Classroom to Career (C2C)',
    description: 'No graduate left idle.',
    imageUrl: 'https://images.pexels.com/photos/6567674/pexels-photo-6567674.jpeg', // Image 1 (reused)
  },
  {
    icon: Banknote,
    title: 'Cape Coast North Youth Development Fund (CCNYDF)',
    description: 'Funding the next generation of entrepreneurs.',
    imageUrl: 'https://images.pexels.com/photos/11535807/pexels-photo-11535807.jpeg', // Image 2 (reused)
  },
  {
    icon: LayoutDashboard,
    title: 'Cape Impact Dashboard (CID)',
    description: 'Tracking our progress, ensuring accountability.',
    imageUrl: 'https://images.pexels.com/photos/2306222/pexels-photo-2306222.jpeg', // Image 3 (reused)
  },
];

export function Events() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* 1. Hero Section */}
      <section className="bg-[#002B5B] text-white py-24 md:py-32">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              CETRA2030
            </h1>
            <p className="mt-2 text-2xl md:text-4xl font-medium text-gray-300">
              Cape Coast North Youth Employment Transformation Agenda
            </p>
            <h2 className="mt-6 text-3xl md:text-5xl font-bold text-[#FF6B00]">
              "Every Youth Productive by 2030."
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-200">
              A bold, non-partisan agenda to build a self-sustaining youth economy 
              through innovation, skills, and entrepreneurship.
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                className="bg-[#FF6B00] hover:bg-[#E66000] focus:ring-[#FF6B00] text-white shadow-lg"
              >
                Explore Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 2. Programs Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#002B5B]">
                The 7 Pillars of CETRA2030
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                A comprehensive strategy for youth empowerment and job creation.
              </p>
            </div>
          </AnimatedSection>

          {/* --- CARD DESIGN with Specific Images + Gradient Overlay --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <AnimatedSection key={pillar.title} delay={200 + index * 50}>
                <div className="relative aspect-[4/3] rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  
                  {/* Background Picture */}
                  <img 
                    src={pillar.imageUrl} 
                    alt={pillar.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />

                  {/* Gradient Overlay for Text (Dark Green at bottom, transparent middle/top) */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#002B5B] via-[#002B5B]/0 to-transparent" />

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-gray-200">
                      {pillar.description}
                    </p>
                  </div>

                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Section */}
      <section className="py-20 md:py-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={100}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#002B5B] mb-2">
                    Our Vision
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To make every youth in Cape Coast North employable, empowered, 
                    or earning by 2030.
                  </p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#002B5B] mb-2">
                    Our Mission
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To build a self-sustaining youth economy through innovation, 
                    skills, and entrepreneurship.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 4. Call-to-Action Section */}
      <section className="bg-[#002B5B] text-white py-20 md:py-24">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Join the CETRA2030 Movement
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              This agenda belongs to all of us. Whether you are a business leader, 
              an investor, an educator, or a passionate resident, we need your 
              partnership to bring this vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#FF6B00] hover:bg-[#E66000] focus:ring-[#FF6B00] text-white shadow-lg"
              >
                Partner With Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#002B5B] focus:ring-white"
              >
                See Impact Dashboard
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 5. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold text-gray-200">
            Office of the Member of Parliament, Cape Coast North Constituency
          </p>
          <p className="text-sm mt-1">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>
      </footer>

      {/* CSS for animations */}
      <style>{`
        .animate-section-enter {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}