// src/components/Footer.tsx
import React from "react";
import { Instagram, Linkedin, Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white px-4 md:px-8 pb-0 pt-0 border-t border-gray-100">
      <div className="container mx-auto max-w-7xl">
        
        {/* --- SINGLE RED BAR (Socials + Copyright) --- */}
        <div className="w-full bg-[#CE1126] rounded-t-2xl md:rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden mt-6 md:mb-6">
             {/* Decorative Circles */}
             <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
             
             {/* LEFT SIDE: Follow Us + Icons */}
             <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 z-10">
               <span className="font-bold text-white font-[Outfit] text-lg whitespace-nowrap">Follow Us</span>
               
               <div className="flex items-center gap-2">
                  <SocialIcon href="#" icon={Facebook} label="Facebook" />
                  <SocialIcon href="#" icon={Twitter} label="Twitter" />
                  <SocialIcon href="#" icon={Instagram} label="Instagram" />
                  <SocialIcon href="#" icon={Linkedin} label="LinkedIn" />
                  <SocialIcon href="#" icon={Youtube} label="YouTube" />
                  <SocialIcon href="#" icon={({ className }: { className: string }) => (
                    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.6 5.82s.51.5 0 0A4.27 4.27 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.59 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 2.59-2.59c.42 0 .82.1 1.18.28V8.81a6.34 6.34 0 0 0-4.27-1.45A6.35 6.35 0 0 0 3 15.71a6.35 6.35 0 0 0 6.36 6.35 6.36 6.36 0 0 0 6.36-6.35V9.42c0-1.4.44-2.73 1.24-3.6z"/>
                    </svg>
                  )} label="TikTok" />
               </div>
             </div>

             {/* RIGHT SIDE: Copyright & Candidate Info */}
             <div className="mt-4 md:mt-0 text-white/80 text-xs md:text-sm font-medium z-10 text-center md:text-right">
                <div>&copy; {currentYear} Hon. Dr. Kwamena Minta Nyarku. All Rights Reserved.</div>
                <div className="opacity-75">Member of Parliament for Cape Coast North</div>
             </div>
        </div>

      </div>
    </footer>
  );
}

// Helper Component for Social Icons
const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:text-[#CE1126] transition-all duration-300 group"
    aria-label={label}
  >
    <Icon className="w-5 h-5 text-white group-hover:text-[#CE1126] transition-colors" />
  </a>
);

export default Footer;