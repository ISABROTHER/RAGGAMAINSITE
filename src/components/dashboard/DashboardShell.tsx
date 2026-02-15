import { useState, useEffect } from 'react';
import { LogOut, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardShellProps {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor: string;
  roleLabel: string;
  children: React.ReactNode;
}

export function DashboardShell({ navItems, activeTab, onTabChange, accentColor, roleLabel, children }: DashboardShellProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();
  const activeLabel = navItems.find(n => n.id === activeTab)?.label || 'Dashboard';

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = (id: string) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  const sidebarInner = (
    <>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: accentColor }}>
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 text-sm truncate">{profile?.full_name || 'User'}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>{roleLabel}</p>
          </div>
        </div>
      </div>

      <div className="mx-4 h-px bg-slate-100" />

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={active ? { backgroundColor: accentColor } : undefined}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
        <button
          onClick={() => { setMobileOpen(false); navigate('/'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-green-50 hover:text-[#006B3F] transition-colors"
        >
          <Globe className="w-[18px] h-[18px]" />
          <span>Back to Website</span>
        </button>
        <button
          onClick={async () => { setMobileOpen(false); await signOut(); navigate('/'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-[#CE1126] transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-white fixed top-0 left-0 bottom-0 z-30 border-r border-slate-200/70">
        {sidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200/70 z-30 flex items-center px-4 gap-3">
        <button onClick={() => setMobileOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 -ml-1">
          <Menu className="w-5 h-5" />
        </button>
        <p className="font-bold text-slate-900 text-sm flex-1 truncate">{activeLabel}</p>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[10px]" style={{ backgroundColor: accentColor }}>
          {initial}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute left-0 top-0 bottom-0 w-[260px] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex justify-end px-3 pt-3">
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarInner}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-[220px] pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 lg:py-7">
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-black text-slate-900">{activeLabel}</h1>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}