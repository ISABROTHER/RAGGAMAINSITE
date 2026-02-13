// src/components/Header.tsx
import { useState, useEffect, useRef } from 'react';
import {
  Menu as MenuIcon, X, Home, User, Users, HardHat, Award,
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

  // ENLARGED LOGO & HEADER DIMENSIONS
  const headerHeightBase = 110; // Increased base height to fit larger logo
  const headerScale = 1.0; 
  const headerHeight = headerHeightBase * headerScale;

  const logoScale = 1.4; // 40% Increase for prominence
  const logoTopOffset = 10;
  const logoBottomOffset = 4;
  const logoVerticalAdjust = -2;
  const logoLeftAdjust = 15;

  const desktopNavGap = 16;
  const desktopNavPaddingY = 10;
  const desktopNavPaddingX = 14;
  const desktopNavFontSize = 15;

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
            {/* Enlarged Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 group transition-transform hover:scale-[1.02] focus:outline-none"
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
                  height: `${headerHeightBase * 0.75 * logoScale}px`,
                  width: 'auto',
                  transformOrigin: 'left center'
                }}
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center" style={{ gap: `${desktopNavGap}px` }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-full font-bold transition-all duration-300 whitespace-nowrap ${
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

            {/* Mobile Menu Toggle - Stacked Design */}
            <div className="md:hidden relative z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 shadow-lg ${
                  mobileMenuOpen 
                    ? 'bg-[#CE1126] text-white shadow-inner' 
                    : 'bg-white text-[#CE1126] border border-gray-100'
                }`}
              >
                <div className="mb-[2px]">
                    {mobileMenuOpen ? (
                        <X className="w-7 h-7" strokeWidth={3} />
                    ) : (
                        <MenuIcon className="w-7 h-7" strokeWidth={3} />
                    )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter leading-none">
                    MENU
                </span>
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
                  className="fixed right-4 z-[70] w-[320px] origin-top-right"
                  style={{ top: `${headerHeight + 8}px` }} 
                >
                  <div className="flex flex-col relative bg-gradient-to-br from-[#CE1126]/95 via-[#b00e1f]/95 to-[#8a0b18]/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10">
                    
                    {/* AUTH ON TOP */}
                    <motion.div 
                      variants={itemVariants}
                      className="relative p-5 bg-black/10 border-b border-white/10"
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
                                        className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleNavClick('dashboard')}
                                    className="w-full py-3.5 bg-white text-[#CE1126] font-black text-xs uppercase tracking-widest rounded shadow-lg active:scale-[0.98] transition-transform"
                                >
                                    Open Dashboard
                                </button>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <button
                                    onClick={() => handleNavClick('login')}
                                    className="w-full py-3.5 bg-white text-[#CE1126] font-black text-xs uppercase tracking-widest rounded shadow-lg active:scale-[0.98] transition-transform"
                                >
                                    Sign In / Register
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* NAV LIST */}
                    <div className="overflow-y-auto max-h-[55vh] p-2.5 space-y-1.5">
                      {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            variants={itemVariants}
                            onClick={() => handleNavClick(item.id)}
                            className={`group relative flex items-center justify-between px-4 py-4 rounded-xl w-full text-left transition-all duration-300 ${
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
                            
                            {isActive && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-2.5 h-2.5 rounded-full bg-[#CE1126]"
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
      <div style={{ height: `${headerHeight}px` }} />
    </div>
  );
}