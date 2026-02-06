// src/components/Header.tsx
import { useState } from 'react';
import {
  Menu, X, Home, User, Users, HardHat, Award,
  Calendar, MessageSquareWarning,
  LayoutDashboard, LogIn, ChevronRight, Vote,
  UserCircle, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerHeightBase = 90; 
  const headerScale = 1.1; 
  const headerHeight = headerHeightBase * headerScale;

  const logoScale = 1.2; 
  const logoTopOffset = 8; 
  const logoBottomOffset = 2; 
  const logoVerticalAdjust = -1; 
  const logoLeftAdjust = 15; 

  const desktopNavGap = 12;
  const desktopNavPaddingY = 8; 
  const desktopNavPaddingX = 12; 
  const desktopNavFontSize = 14; 

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'achievements', label: 'Impact' }, 
    { id: 'support', label: 'Support' }, 
    { id: 'assemblymen', label: 'Assemblymen' },
    { id: 'ongoing-projects', label: 'Projects' },
    { id: 'events', label: 'Events' },
    { id: 'polls', label: 'Polls' },
    { id: 'admin', label: 'My Page' }, 
  ];

  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'support', label: 'Support Ragga', icon: Heart },
    { id: 'about', label: 'About Profile', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award }, 
    { id: 'assemblymen', label: 'Assemblymen', icon: Users },
    { id: 'ongoing-projects', label: 'Projects', icon: HardHat },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'polls', label: 'Polls & Tracker', icon: Vote },
    { id: 'issues', label: 'Report Issue', icon: MessageSquareWarning },
    { id: 'appointments', label: 'Book Appointment', icon: UserCircle },
  ];

  const handleNavClick = (pageId: string) => {
    setMobileMenuOpen(false);
    onNavigate(pageId);
  };

  const menuVariants = {
    closed: { scale: 0.9, opacity: 0, transition: { type: "spring" as const, stiffness: 300, damping: 35 } },
    open: { scale: 1, opacity: 1, transition: { type: "spring" as const, stiffness: 200, damping: 25 } }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative w-full">
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl"
        style={{ height: `${headerHeight}px` }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
          <div className="flex justify-between items-center h-full">
            <button onClick={() => handleNavClick('home')} className="flex items-center space-x-3 group transition-transform hover:scale-[1.01] focus:outline-none" style={{ position: 'relative', top: `${logoTopOffset + logoVerticalAdjust}px`, left: `${logoLeftAdjust}px`, bottom: `${logoBottomOffset}px` }}>
              <img src="https://i.imgur.com/1GfnCQc.png" alt="Logo" className="object-contain" style={{ height: `${headerHeight * 0.8 * logoScale}px`, width: 'auto', transform: `scale(${logoScale})` }} />
            </button>
            <div className="hidden md:flex items-center" style={{ gap: `${desktopNavGap}px` }}>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => handleNavClick(item.id)} className={`rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${currentPage === item.id ? 'bg-blue-900 text-white shadow-lg shadow-blue-500/50' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'} ${item.id === 'admin' ? 'border-2 border-red-100 text-red-700' : ''}`} style={{ padding: `${desktopNavPaddingY}px ${desktopNavPaddingX}px`, fontSize: `${desktopNavFontSize}px` }}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="md:hidden relative z-50">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#CE1126] text-white shadow-xl border-4 border-white ${mobileMenuOpen ? 'rotate-90' : ''}`}>
                {mobileMenuOpen ? <X className="w-7 h-7" strokeWidth={3} /> : <Menu className="w-7 h-7" strokeWidth={3} />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial="closed" animate="open" exit="closed" variants={menuVariants} className="md:hidden absolute top-[10px] right-[10px] w-[300px] origin-top-right">
                <div className="relative bg-[#CE1126] pt-24 pb-6 px-6 shadow-2xl h-full w-full overflow-hidden border-4 border-white/20 rounded-[40px] max-h-[85vh] overflow-y-auto">
                  <motion.div variants={itemVariants} className="mb-6 relative z-10">
                    <button onClick={() => handleNavClick('admin')} className="w-full bg-white text-[#CE1126] rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-black text-xl">MY PAGE</span>
                      </div>
                      <LogIn className="w-5 h-5" />
                    </button>
                  </motion.div>
                  <div className="flex flex-col space-y-2.5 relative z-10 pb-4">
                    {mobileNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <motion.button key={item.id} variants={itemVariants} onClick={() => handleNavClick(item.id)} className={`flex items-center justify-between px-5 py-3.5 rounded-xl w-full text-left transition-all ${isActive ? 'bg-white text-[#CE1126] font-extrabold translate-x-2' : 'bg-white/90 text-slate-800 font-semibold'}`}>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-[#CE1126]' : 'text-slate-400'}`} />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      <div className="bg-red-600 h-5 overflow-hidden relative flex items-center" style={{ marginTop: `${headerHeight}px` }}>
        <div className="marquee-track absolute top-0 left-0 h-full flex items-center whitespace-nowrap font-bold text-white text-[0.65rem] tracking-widest uppercase">
          <span>SUPPORT HON. RAGGA'S OPERATION 1000 DESKS FOR STUDENTS 'II' OBIARA KA HO 'II'</span>
          <span>SUPPORT HON. RAGGA'S OPERATION 1000 DESKS FOR STUDENTS 'II' OBIARA KA HO 'II'</span>
        </div>
      </div>
    </div>
  );
}