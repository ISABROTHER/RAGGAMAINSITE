import { useState, useEffect } from 'react';
import { LogOut, ChevronRight, ChevronLeft, Globe, Search, Bell, Menu } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();
  const activeLabel = navItems.find(n => n.id === activeTab)?.label || '';

  useEffect(() => {
    document.body.style.overflow = expanded ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setExpanded(false);
  };

  const filteredNav = searchQuery
    ? navItems.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : navItems;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      {/* Icon sidebar — only visible when NOT expanded */}
      <AnimatePresence>
        {!expanded && (
          <motion.aside
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-0 bottom-0 w-[60px] bg-white border-r border-slate-200 z-40 flex flex-col items-center py-3"
          >
            {/* Logo */}
            <div className="mb-2">
              <img src="https://i.imgur.com/1GfnCQc.png" alt="CCN" className="h-7 w-7 object-contain" />
            </div>

            <div className="w-8 h-px bg-slate-200 mb-2" />

            {/* Expand */}
            <button
              onClick={() => { setExpanded(true); setSearchQuery(''); }}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#CE1126] hover:bg-red-50 transition-colors mb-2"
              title="Expand menu"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>

            <div className="w-8 h-px bg-slate-200 mb-2" />

            {/* Nav icons */}
            <nav className="flex-1 flex flex-col items-center gap-0.5 overflow-y-auto w-full px-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={item.label}
                    className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      active
                        ? 'bg-[#CE1126] text-white'
                        : 'text-slate-400 hover:text-[#CE1126] hover:bg-red-50'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#CE1126] -ml-2" />
                    )}
                    <Icon className="w-[18px] h-[18px]" />
                  </button>
                );
              })}
            </nav>

            {/* Bottom icons */}
            <div className="flex flex-col items-center gap-0.5 mt-2">
              <div className="w-8 h-px bg-slate-200 mb-1" />
              <button
                onClick={() => navigate('/')}
                title="Back to Website"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#006B3F] hover:bg-green-50 transition-colors"
              >
                <Globe className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                title="Log Out"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-[#CE1126] hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
              <div className="w-8 h-px bg-slate-200 my-1" />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#CE1126] text-white font-bold text-[10px]"
                title={profile?.full_name || 'User'}
              >
                {initial}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Expanded sidebar — replaces icon bar */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setExpanded(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-200 shadow-xl z-50 flex flex-col"
            >
              {/* Header with close */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <img src="https://i.imgur.com/1GfnCQc.png" alt="CCN" className="h-7 w-7 object-contain" />
                  <span className="font-bold text-[#CE1126] text-sm">CCN Portal</span>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#CE1126] hover:bg-red-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* User */}
              <div className="px-4 py-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#CE1126] text-white font-bold text-xs shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate leading-tight">{profile?.full_name || 'User'}</p>
                    <p className="text-[10px] text-[#CE1126] font-medium uppercase tracking-wider">{roleLabel}</p>
                  </div>
                </div>
              </div>

              <div className="mx-3 h-px bg-slate-100 shrink-0" />

              {/* Search */}
              <div className="px-3 pt-2.5 pb-1 shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search menu..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#CE1126]/30 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-2.5 py-1.5 space-y-0.5 overflow-y-auto">
                {filteredNav.map(item => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center w-full px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                        active
                          ? 'bg-[#CE1126] text-white'
                          : 'text-slate-700 hover:bg-red-50 hover:text-[#CE1126]'
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="ml-3 truncate">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
                    </button>
                  );
                })}
                {searchQuery && filteredNav.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No results</p>
                )}
              </nav>

              {/* Bottom — close to bottom edge */}
              <div className="px-2.5 py-2 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => { setExpanded(false); navigate('/'); }}
                  className="flex items-center w-full px-3 py-2.5 rounded-lg text-[13px] text-slate-700 hover:bg-green-50 hover:text-[#006B3F] transition-colors font-medium"
                >
                  <Globe className="w-[18px] h-[18px] shrink-0 text-[#006B3F]" />
                  <span className="ml-3">Back to Website</span>
                </button>
                <button
                  onClick={async () => { setExpanded(false); await signOut(); navigate('/'); }}
                  className="flex items-center w-full px-3 py-2.5 rounded-lg text-[13px] text-slate-700 hover:bg-red-50 hover:text-[#CE1126] transition-colors font-medium"
                >
                  <LogOut className="w-[18px] h-[18px] shrink-0 text-[#CE1126]" />
                  <span className="ml-3">Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="fixed top-0 right-0 h-12 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 z-20 flex items-center px-4 sm:px-6 gap-3 transition-all duration-200" style={{ left: expanded ? 0 : 60 }}>
        <h2 className="font-bold text-slate-900 text-sm">{activeLabel}</h2>
        <div className="flex-1" />
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
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
            <button onClick={() => setSearchOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#CE1126] hover:bg-red-50 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          )}
        </AnimatePresence>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#CE1126] hover:bg-red-50 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CE1126] rounded-full" />
        </button>
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#CE1126] text-white font-bold text-[10px]">
            {initial}
          </div>
          <span className="text-xs font-medium text-slate-700 hidden xl:block">{profile?.full_name || 'User'}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 ml-[60px] w-full pt-12 transition-all duration-200" style={{ marginLeft: expanded ? 0 : 60 }}>
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