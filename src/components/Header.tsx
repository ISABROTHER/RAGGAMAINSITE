// src/components/Header.tsx
import { useState, useEffect, useRef } from 'react';
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

  // RESTORED ORIGINAL DIMENSIONS
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

  return (
    <div className="relative w-full">
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl"
        style={{ height: `${headerHeight}px` }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
          <div className="flex justify-between items-center h-full">
            {/* Logo - Restored Original Positioning */}
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

            {/* Desktop Navigation - Restored Original Styling */}
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

            {/* Mobile Menu Toggle - Innovative Rectangular Design */}
            <div className="md:hidden relative z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-[#CE1126] text-white border border-[#b00e1f] shadow-md hover:bg-[#b00e1f] transition-colors rounded-none"
              >
                <span className="font-bold text-[10px] uppercase tracking-tighter">MENU</span>
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" strokeWidth={3} />}
              </button>
            </div>
          </div>

          {/* Innovative Mobile Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/5"
                />
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="fixed right-3 z-[70] w-[240px] origin-top-right shadow-2xl"
                  style={{ top: `${headerHeight + 2}px` }}
                >
                  <div className="flex flex-col bg-gradient-to-b from-[#CE1126]/95 to-[#b00e1f]/95 backdrop-blur-xl border border-white/20 rounded-sm overflow-hidden max-h-[75vh]">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 shrink-0">
                      <span className="text-white/80 text-[9px] font-bold uppercase tracking-widest">Navigation</span>
                    </div>
                    <div className="overflow-y-auto py-1 px-1.5 space-y-0.5">
                      {mobileNavItems.map((item, i) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-none w-full text-left transition-all ${
                            currentPage === item.id
                              ? 'bg-white text-[#CE1126] font-bold shadow-sm'
                              : 'text-white hover:bg-white/10 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <item.icon className={`w-3.5 h-3.5 ${currentPage === item.id ? 'text-[#CE1126]' : 'text-white/60'}`} />
                            <span className="text-[11px] uppercase tracking-wide">{item.label}</span>
                          </div>
                          {currentPage === item.id && <ChevronRight className="w-3 h-3 opacity-50" />}
                        </motion.button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-white/10 bg-black/10">
                      {user ? (
                        <button
                          onClick={() => handleNavClick('dashboard')}
                          className="w-full bg-white text-[#CE1126] py-2 px-3 flex items-center justify-center gap-2 rounded-none font-bold text-[10px]"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          DASHBOARD
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNavClick('login')}
                          className="w-full bg-white text-[#CE1126] py-2 px-3 flex items-center justify-center gap-2 rounded-none font-bold text-[10px]"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          SIGN IN
                        </button>
                      )}
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