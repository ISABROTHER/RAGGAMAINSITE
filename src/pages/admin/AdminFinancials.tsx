// src/components/Header.tsx
import { useState, useEffect, useRef } from 'react';
import {
  Menu as MenuIcon, X, Home, User, Users, HardHat, Award,
  Calendar, MessageSquareWarning, Vote, Heart, LogOut, LayoutDashboard
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // --- DIMENSIONS: MAXIMUM SIZE & EDGE ALIGNMENT ---
  const headerHeightBase = 115; 
  const headerHeight = headerHeightBase;

  const logoScale = 1.5; 
  const logoTopOffset = 10;
  const logoBottomOffset = 4;
  const logoVerticalAdjust = -2;
  const logoLeftAdjust = 0; // MOVED TO THE EDGE

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
    ...(user ? [{ id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard }] : []),
  ];

  const handleNavClick = (pageId: string) => {
    setMobileMenuOpen(false);
    onNavigate(pageId);
  };

  const containerVariants = {
    closed: { opacity: 0, scale: 0.95, y: 10, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30, staggerChildren: 0.07, delayChildren: 0.1 } }
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
            
            {/* Logo: Pushed to Edge with transformOrigin */}
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
                  transformOrigin: 'left center' // Keeps the left edge static while scaling
                }}
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-full font-bold transition-all duration-300 whitespace-nowrap px-3 py-2 text-[15px] ${
                    currentPage === item.id
                      ? 'bg-blue-900 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle (Stays Right) */}
            <div className="md:hidden relative z-50">
              <button
                onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 shadow-lg ${
                  mobileMenuOpen ? 'bg-[#CE1126] text-white' : 'bg-white text-[#CE1126] border border-gray-100'
                }`}
              >
                <div className="mb-[2px]">
                  {mobileMenuOpen ? <X className="w-7 h-7" strokeWidth={3} /> : <MenuIcon className="w-7 h-7" strokeWidth={3} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">MENU</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-[2px]" />
                <motion.div
                  ref={menuRef}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={containerVariants}
                  className="fixed right-4 z-[70] w-[320px] origin-top-right"
                  style={{ top: `${headerHeight + 8}px` }} 
                >
                  <div className="flex flex-col relative bg-gradient-to-br from-[#CE1126]/95 via-[#b00e1f]/95 to-[#8a0b18]/95 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                    <motion.div variants={itemVariants} className="p-5 bg-black/10 border-b border-white/10">
                        {user ? (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-white text-sm font-bold">{profile?.full_name || 'Constituent'}</p>
                                        <p className="text-white/60 text-[10px] uppercase">Active</p>
                                    </div>
                                    <button onClick={async () => { await signOut(); handleNavClick('home'); }} className="p-2 rounded-full bg-white/10 text-white"><LogOut className="w-4 h-4" /></button>
                                </div>
                                <button
                                    onClick={() => handleNavClick('dashboard')}
                                    className="w-full py-2.5 bg-white text-[#CE1126] font-bold text-xs uppercase rounded-lg shadow-lg flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    My Dashboard
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => handleNavClick('login')} className="w-full py-3.5 bg-white text-[#CE1126] font-black text-xs uppercase rounded shadow-lg">Sign In</button>
                        )}
                    </motion.div>
                    <div className="overflow-y-auto max-h-[55vh] p-2.5 space-y-1.5">
                      {mobileNavItems.map((item) => (
                        <motion.button
                          key={item.id}
                          variants={itemVariants}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center justify-between px-4 py-4 rounded-xl w-full text-left transition-all ${currentPage === item.id ? 'bg-white text-[#CE1126]' : 'text-white/80 hover:bg-white/5'}`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="text-[13px] uppercase tracking-wider font-bold">{item.label}</span>
                          </div>
                        </motion.button>
                      ))}
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