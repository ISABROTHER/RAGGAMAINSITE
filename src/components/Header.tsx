// src/components/Header.tsx
import { useState, useEffect } from 'react';
import {
  Menu, X, Home, User, Users, HardHat, Award,
  Calendar, MessageSquareWarning,
  LayoutDashboard, LogIn, ChevronRight, Vote,
  UserCircle, Heart, LogOut
} from 'lucide-react';
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

  return (
    <div className="relative w-full">
      {/* Internal styles for animations to avoid external dependencies */}
      <style>{`
        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-menu-slide { animation: menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>

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
              {!mobileMenuOpen && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-[#CE1126] text-white shadow-xl border-2 border-white transition-transform active:scale-90"
                >
                  <Menu className="w-6 h-6" strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Overlay & Content */}
          {mobileMenuOpen && (
            <>
              {/* 1. Invisible Click Overlay */}
              <div
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-[60] bg-black/10 backdrop-blur-[2px] animate-fade-in"
              />

              {/* 2. The Frozen Menu Card */}
              <div
                className="fixed top-3 right-3 z-[70] w-[250px] origin-top-right animate-menu-slide"
              >
                <div className="flex flex-col relative bg-gradient-to-b from-[#CE1126]/95 to-[#CE1126]/80 backdrop-blur-2xl shadow-2xl border border-white/20 ring-1 ring-white/10 rounded-[20px] overflow-hidden max-h-[85vh]">
                  
                  {/* Compact Header: Label + Close Button */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                      <span className="text-white/90 text-[10px] font-black uppercase tracking-widest">
                          Menu
                      </span>
                      <button 
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
                      >
                          <X className="w-4 h-4" strokeWidth={3} />
                      </button>
                  </div>

                  {/* Scrollable Nav Items */}
                  <div className="overflow-y-auto py-2 px-2 space-y-1">
                    {mobileNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl w-full text-left transition-all active:scale-95 ${
                            isActive
                              ? 'bg-white text-[#CE1126] font-extrabold shadow-sm'
                              : 'text-white hover:bg-white/10 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#CE1126]' : 'text-white/70'}`} />
                            <span className="text-xs">{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact Footer: Sign In / Dashboard */}
                  <div className="p-2 border-t border-white/10 bg-black/5 shrink-0">
                      <div>
                          {user ? (
                          <div className="grid grid-cols-[1fr_auto] gap-2">
                              <button
                              onClick={() => handleNavClick('dashboard')}
                              className="bg-white text-[#CE1126] rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                              >
                                  <LayoutDashboard className="w-3.5 h-3.5" />
                                  <span className="font-black text-xs">DASHBOARD</span>
                              </button>
                              <button
                              onClick={async () => { await signOut(); handleNavClick('home'); }}
                              className="bg-white/10 text-white rounded-xl py-2.5 px-3 flex items-center justify-center hover:bg-white/20 transition-colors active:scale-95"
                              >
                                  <LogOut className="w-4 h-4" />
                              </button>
                          </div>
                          ) : (
                          <button
                              onClick={() => handleNavClick('login')}
                              className="w-full bg-white text-[#CE1126] rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                          >
                              <LogIn className="w-4 h-4" />
                              <span className="font-black text-xs">SIGN IN</span>
                          </button>
                          )}
                      </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </nav>
      </header>
    </div>
  );
} 