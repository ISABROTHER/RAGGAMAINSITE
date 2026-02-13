// src/components/Header.tsx
import { useState, useEffect } from 'react';
import {
  Menu, X, Home, User, Users, HardHat, Award,
  Calendar, MessageSquareWarning,
  LayoutDashboard, LogIn, ChevronRight, Vote,
  UserCircle, Heart, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
    { id: 'projects', label: 'Projects' },
    { id: 'events', label: 'Events' },
    { id: 'polls', label: 'Polls' },
    ...(user
      ? [{ id: 'dashboard', label: profile?.full_name || 'Dashboard' }]
      : [{ id: 'login', label: 'Sign In' }]
    ),
  ];

  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'support', label: 'Support Ragga', icon: Heart },
    { id: 'about', label: 'About Profile', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'assemblymen', label: 'Assemblymen', icon: Users },
    { id: 'projects', label: 'Projects', icon: HardHat },
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
    closed: { scale: 0.95, opacity: 0, y: -10, transition: { duration: 0.2 } },
    open: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
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
            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 group transition-transform hover:scale-[1.01] focus:outline-none"
              style={{
                position: 'relative',
                top: `${logoTopOffset + logoVerticalAdjust}px`,
                left: `${logoLeftAdjust}px`,
                bottom: `${logoBottomOffset}px`
              }}
            >
              <img
                src="https://i.imgur.com/1GfnCQc.png"
                alt="Logo"
                className="object-contain"
                style={{
                  height: `${headerHeight * 0.8 * logoScale}px`,
                  width: 'auto',
                  transform: `scale(${logoScale})`
                }}
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center" style={{ gap: `${desktopNavGap}px` }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                    currentPage === item.id
                      ? 'bg-blue-900 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                  } ${
                    item.id === 'dashboard' || item.id === 'login'
                      ? 'border-2 border-red-100 text-red-700'
                      : ''
                  }`}
                  style={{
                    padding: `${desktopNavPaddingY}px ${desktopNavPaddingX}px`,
                    fontSize: `${desktopNavFontSize}px`
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden relative z-50">
              <AnimatePresence>
                {!mobileMenuOpen && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-[#CE1126] text-white shadow-xl border-2 border-white"
                  >
                    <Menu className="w-6 h-6" strokeWidth={3} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Overlay & Content */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* 1. Invisible Click Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 z-[60] bg-black/10 backdrop-blur-[2px]"
                />

                {/* 2. The Frozen Menu Card */}
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuVariants}
                  className="fixed top-3 right-3 z-[70] w-[230px] origin-top-right"
                >
                  <div className="flex flex-col relative bg-gradient-to-b from-[#CE1126]/95 to-[#CE1126]/85 backdrop-blur-2xl shadow-2xl border border-white/20 ring-1 ring-white/10 rounded-[18px] overflow-hidden max-h-[85vh]">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/20 shrink-0 bg-black/5">
                        <span className="text-white/90 text-[10px] font-black uppercase tracking-widest pl-1">
                            Menu
                        </span>
                        <button 
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white border border-white/10"
                        >
                            <X className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                    </div>

                    {/* Nav Items with FAINT LINES */}
                    <div className="overflow-y-auto">
                      {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            variants={itemVariants}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center justify-between px-4 py-2 w-full text-left transition-all border-b border-white/10 last:border-0 ${
                              isActive
                                ? 'bg-white/10 text-white font-extrabold'
                                : 'text-white hover:bg-white/5 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                              <span className="text-[11px] uppercase tracking-wide">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-3 h-3 text-white" />}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Footer: Sign In / Dashboard */}
                    <div className="border-t border-white/20 bg-black/10 shrink-0">
                        <motion.div variants={itemVariants}>
                            {user ? (
                            <div className="flex divide-x divide-white/20">
                                <button
                                onClick={() => handleNavClick('dashboard')}
                                className="flex-1 py-2.5 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                                >
                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                    <span className="font-bold text-[10px] uppercase">Dashboard</span>
                                </button>
                                <button
                                onClick={async () => { await signOut(); handleNavClick('home'); }}
                                className="px-3 py-2.5 flex items-center justify-center hover:bg-red-900/30 transition-colors text-white"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            ) : (
                            <button
                                onClick={() => handleNavClick('login')}
                                className="w-full py-2.5 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors text-white"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span className="font-bold text-[10px] uppercase">Sign In</span>
                            </button>
                            )}
                        </motion.div>
                    </div>

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Marquee Bar */}
      <div
        className="bg-red-600 h-5 overflow-hidden relative flex items-center"
        style={{ marginTop: `${headerHeight}px` }}
      >
        <div className="marquee-track absolute top-0 left-0 h-full flex items-center whitespace-nowrap font-bold text-white text-[0.65rem] tracking-widest uppercase">
          <span>
            SUPPORT HON. RAGGA’S OPERATION 1000 DESKS FOR STUDENTS 'II' OBIARA KA HO 'II'
          </span>
        </div>
      </div>
    </div>
  );
}