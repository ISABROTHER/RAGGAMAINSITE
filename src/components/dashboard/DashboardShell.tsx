import { useState, useEffect } from 'react';
import { LogOut, ChevronRight, ChevronLeft, Globe, Menu, X, Search, Bell } from 'lucide-react';
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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();
  const activeLabel = navItems.find(n => n.id === activeTab)?.label || '';

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  const filteredNav = searchQuery
    ? navItems.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems;

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo + toggle */}
      <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-between px-4'} h-14 border-b border-white/[0.06] shrink-0`}>
        {(isMobile || !collapsed) && (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="https://i.imgur.com/1GfnCQc.png" alt="CCN" className="h-7 w-7 object-contain shrink-0" />
            <span className="font-bold text-white text-sm truncate">CCN Portal</span>
          </div>
        )}
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/10 shrink-0">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* User */}
      <div className={`${collapsed && !isMobile ? 'px-2 py-3 flex justify-center' : 'px-4 py-3'} shrink-0`}>
        {collapsed && !isMobile ? (
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FCD116] text-[#1a1a2e] font-bold text-xs" title={profile?.full_name || 'User'}>
            {initial}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FCD116] text-[#1a1a2e] font-bold text-xs shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate leading-tight">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-[#FCD116] font-medium uppercase tracking-wider">{roleLabel}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-3 h-px bg-white/[0.06] shrink-0" />

      {/* Nav search */}
      {(isMobile || !collapsed) && (
        <div className="px-3 pt-2.5 pb-1 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="w-full pl-8 pr-3 py-2 bg-white/[0.06] border border-white/[0.06] rounded-lg text-xs text-white placeholder:text-white/30 focus:bg-white/10 focus:border-[#FCD116]/30 focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-1.5 space-y-0.5 overflow-y-auto">
        {filteredNav.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`relative flex items-center w-full ${collapsed && !isMobile ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group ${
                active
                  ? 'bg-white/[0.12] text-white'
                  : 'text-white hover:bg-white/[0.06]'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#FCD116]" />
              )}
              <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-[#FCD116]' : 'text-white/50 group-hover:text-white'}`} />
              {(isMobile || !collapsed) && <span className="ml-3 truncate">{item.label}</span>}
              {(isMobile || !collapsed) && active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#FCD116]/60" />}
            </button>
          );
        })}
        {searchQuery && filteredNav.length === 0 && (
          <p className="text-xs text-white/30 text-center py-4">No results</p>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-2.5 border-t border-white/[0.06] space-y-0.5 shrink-0">
        <button
          onClick={() => { setMobileOpen(false); navigate('/'); }}
          title={collapsed && !isMobile ? 'Back to Website' : undefined}
          className={`flex items-center w-full ${collapsed && !isMobile ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-[13px] text-white hover:bg-white/[0.06] transition-colors font-medium`}
        >
          <Globe className="w-[18px] h-[18px] shrink-0 text-[#006B3F]" />
          {(isMobile || !collapsed) && <span className="ml-3">Back to Website</span>}
        </button>
        <button
          onClick={async () => { setMobileOpen(false); await signOut(); navigate('/'); }}
          title={collapsed && !isMobile ? 'Log Out' : undefined}
          className={`flex items-center w-full ${collapsed && !isMobile ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-[13px] text-white hover:bg-[#CE1126]/30 transition-colors font-medium`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0 text-[#CE1126]" />
          {(isMobile || !collapsed) && <span className="ml-3">Log Out</span>}
        </button>
      </div>
    </>
  );

  const desktopWidth = collapsed ? 'w-[68px]' : 'w-60';
  const mainMargin = collapsed ? 'lg:ml-[68px]' : 'lg:ml-60';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile frosted top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-30 flex items-center px-3 gap-3">
        <button onClick={() => setMobileOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100/80 transition-colors active:scale-95">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <img src="https://i.imgur.com/1GfnCQc.png" alt="CCN" className="h-6 w-6 object-contain" />
          <span className="font-bold text-slate-900 text-sm truncate">{activeLabel}</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100/80 transition-colors relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CE1126] rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FCD116] text-[#1a1a2e] font-bold text-[10px]">
          {initial}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-[#1a1a2e] shadow-2xl flex flex-col"
            >
              {sidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col ${desktopWidth} bg-[#1a1a2e] fixed h-full z-30 transition-all duration-300`}>
        {sidebarContent(false)}
      </aside>

      {/* Desktop top bar */}
      <div className="hidden lg:flex fixed top-0 right-0 h-12 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-20 items-center px-6 gap-4 transition-all duration-300" style={{ marginLeft: collapsed ? 68 : 240, left: 0 }}>
        <h2 className="font-bold text-slate-900 text-sm">{activeLabel}</h2>
        <div className="flex-1" />
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  onBlur={() => setSearchOpen(false)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300"
                />
              </div>
            </motion.div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          )}
        </AnimatePresence>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CE1126] rounded-full" />
        </button>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FCD116] text-[#1a1a2e] font-bold text-[10px]">
            {initial}
          </div>
          <span className="text-xs font-medium text-slate-700 hidden xl:block">{profile?.full_name || 'User'}</span>
        </div>
      </div>

      {/* Main content */}
      <main className={`flex-1 ${mainMargin} w-full transition-all duration-300 pt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 lg:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}