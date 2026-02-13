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

  // Innovation: Close on outside click
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

  const headerHeight = 90 * 1.1;

  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'support', label: 'Support Ragga', icon: Heart },
    { id: 'about', label: 'About Profile', icon: User },
    { id: 'achievements', label: 'Impact', icon: Award },
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

  return (
    <div className="relative w-full">
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl"
        style={{ height: `${headerHeight}px` }}
      >
        <nav className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center relative">
          {/* Logo */}
          <button onClick={() => handleNavClick('home')} className="focus:outline-none">
            <img
              src="https://i.imgur.com/1GfnCQc.png"
              alt="Logo"
              className="object-contain"
              style={{ height: `${headerHeight * 0.7}px` }}
            />
          </button>

          {/* Innovative Rectangular Menu Trigger */}
          <div className="md:hidden relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#CE1126] text-white shadow-lg active:scale-95 transition-all rounded-none border-l-4 border-white/20"
            >
              <span className="font-black text-[10px] tracking-tighter uppercase">Menu</span>
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* The Dropdown: Innovative Floating Glass Card */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-2 w-[220px] z-[60] origin-top-right"
                >
                  <div className="bg-[#CE1126]/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-sm overflow-hidden">
                    <div className="py-2 px-1 grid grid-cols-1 gap-0.5">
                      {mobileNavItems.map((item, i) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center gap-3 px-4 py-3 text-left transition-all ${
                            currentPage === item.id 
                              ? 'bg-white text-[#CE1126] font-bold' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          <item.icon className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                          <span className="text-[11px] uppercase tracking-wide">{item.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Compact Footer Action */}
                    <div className="p-2 bg-black/20 border-t border-white/10">
                      {user ? (
                        <button
                          onClick={() => handleNavClick('dashboard')}
                          className="w-full bg-white text-[#CE1126] py-2.5 flex items-center justify-center gap-2 rounded-none font-black text-[10px]"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          DASHBOARD
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNavClick('login')}
                          className="w-full bg-white text-[#CE1126] py-2.5 flex items-center justify-center gap-2 rounded-none font-black text-[10px]"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          SIGN IN
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>
    </div>
  );
}