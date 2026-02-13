// src/components/Header.tsx
import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Home, User, Users, HardHat, Award,
  Calendar, MessageSquareWarning,
  LayoutDashboard, LogIn, ChevronRight, Vote,
  UserCircle, Heart, LogOut, Sparkles
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

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

  // Original Header Dimensions
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
  ];

  const handleNavClick = (pageId: string) => {
    setMobileMenuOpen(false);
    onNavigate(pageId);
  };

  const containerVariants = {
    closed: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    },
    open: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30, staggerChildren: 0.07, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
                  height: `${headerHeightBase * 0.8 * logoScale}px`,
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[#CE1126] text-white border-l-4 border-black/10 shadow-lg active:scale-95 transition-all rounded-none"
              >
                <span className="font-black text-[10px] uppercase tracking-widest">MENU</span>
                {mobileMenuOpen ? <X className="w-4 h-4" strokeWidth={3} /> : <Menu className="w-4 h-4" strokeWidth={3} />}
              </button>
            </div>
          </div>

          {/* INNOVATIVE MOBILE DROPDOWN */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-[2px]"
                />
                
                <motion.div
                  ref={menuRef}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={containerVariants}
                  className="fixed right-3 z-[70] w-[320px] origin-top-right"
                  style={{ top: `${headerHeight + 6}px` }}
                >
                  <div className="flex flex-col relative bg-gradient-to-br from-[#CE1126]/95 via-[#b00e1f]/95 to-[#8a0b18]/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10">
                    
                    {/* AUTH ON TOP - CLEAN FUNCTIONAL */}
                    <motion.div 
                      variants={itemVariants}
                      className="relative p-4 bg-black/10 border-b border-white/10"
                    >
                        {user ? (
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-white text-sm font-bold leading-tight">{profile?.full_name || 'Constituent'}</p>
                                        <p className="text-white/60 text-[10px] uppercase tracking-wider">Active Member</p>
                                    </div>
                                    <button 
                                        onClick={async () => { await signOut(); handleNavClick('home'); }}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleNavClick('dashboard')}
                                    className="w-full py-3 bg-white text-[#CE1126] font-black text-xs uppercase tracking-widest rounded shadow-lg active:scale-[0.98] transition-transform"
                                >
                                    Open Dashboard
                                </button>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <button
                                    onClick={() => handleNavClick('login')}
                                    className="w-full py-3 bg-white text-[#CE1126] font-black text-xs uppercase tracking-widest rounded shadow-lg active:scale-[0.98] transition-transform"
                                >
                                    Sign In / Register
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* NAV LIST - INNOVATIVE SELECTION COLOURS */}
                    <div className="overflow-y-auto max-h-[55vh] p-2 space-y-1">
                      {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            variants={itemVariants}
                            onClick={() => handleNavClick(item.id)}
                            className={`group relative flex items-center justify-between px-4 py-3.5 rounded w-full text-left transition-all duration-300 ${
                              isActive
                                ? 'bg-white shadow-xl scale-[1.02]' 
                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3 relative z-10">
                              <Icon 
                                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                                    isActive ? 'text-[#CE1126]' : 'text-white/70'
                                }`} 
                                strokeWidth={isActive ? 3 : 2}
                              />
                              <span className={`text-[13px] uppercase tracking-wider ${
                                  isActive ? 'font-black text-[#CE1126]' : 'font-medium'
                              }`}>
                                {item.label}
                              </span>
                            </div>
                            
                            {/* LIVE ANIMATION INDICATOR */}
                            {isActive && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-2 h-2 rounded-full bg-[#CE1126] shadow-[0_0_8px_rgba(206,17,38,0.6)]"
                                />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </div>
  );
}