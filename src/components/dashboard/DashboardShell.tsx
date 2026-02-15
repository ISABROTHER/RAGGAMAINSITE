import { useState, useEffect } from 'react';
import { LogOut, ChevronRight, ChevronLeft, Globe, Menu, X } from 'lucide-react';
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

  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo + toggle */}
      <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center px-2' : 'justify-between px-4'} h-14 border-b border-slate-100 shrink-0`}>
        {(isMobile || !collapsed) && (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="https://i.imgur.com/1GfnCQc.png" alt="CCN" className="h-7 w-7 object-contain shrink-0" />
            <span className="font-bold text-slate-900 text-sm truncate">CCN Portal</span>
          </div>
        )}
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* User */}
      <div className={`${collapsed && !isMobile ? 'px-2 py-3 flex justify-center' : 'px-4 py-3'} shrink-0`}>
        {collapsed && !isMobile ? (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: accentColor }} title={profile?.full_name || 'User'}>
            {initial}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ backgroundColor: accentColor }}>
              {initial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate leading-tight">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{roleLabel}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mx-3 h-px bg-slate-100 shrink-0" />

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={collapsed && !isMobile ? item.label : undefined}
              className={`flex items-center w-full ${collapsed && !isMobile ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group ${
                active ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={active ? { backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}30` } : undefined}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-current' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {(isMobile || !collapsed) && <span className="ml-3 truncate">{item.label}</span>}
              {(isMobile || !collapsed) && active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-2.5 border-t border-slate-100 space-y-0.5 shrink-0">
        <button
          onClick={() => { setMobileOpen(false); navigate('/'); }}
          title={collapsed && !isMobile ? 'Back to Website' : undefined}
          className={`flex items-center w-full ${collapsed && !isMobile ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-[13px] text-slate-500 hover:text-[#006B3F] hover:bg-green-50 transition-colors font-medium`}
        >
          <Globe className="w-[18px] h-[18px] shrink-0" />
          {(isMobile || !collapsed) && <span className="ml-3">Back to Website</span>}
        </button>
        <button
          onClick={async () => { setMobileOpen(false); await signOut(); navigate('/'); }}
          title={collapsed && !isMobile ? 'Log Out' : undefined}
          className={`flex items-center w-full ${collapsed && !isMobile ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-[13px] text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {(isMobile || !collapsed) && <span className="ml-3">Log Out</span>}
        </button>
      </div>
    </>
  );

  const desktopWidth = collapsed ? 'w-[68px]' : 'w-60';
  const mainMargin = collapsed ? 'lg:ml-[68px]' : 'lg:ml-60';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-12 bg-white border-b border-slate-200 z-30 flex items-center px-3 gap-3">
        <button onClick={() => setMobileOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <img src="https://i.imgur.com/1GfnCQc.png" alt="CCN" className="h-6 w-6 object-contain" />
        <span className="font-bold text-slate-900 text-sm">CCN Portal</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px]" style={{ backgroundColor: accentColor }}>
            {initial}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col animate-[slideIn_0.2s_ease-out]">
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col ${desktopWidth} bg-white border-r border-slate-200 fixed h-full z-30 transition-all duration-300`}>
        {sidebarContent(false)}
      </aside>

      {/* Main */}
      <main className={`flex-1 ${mainMargin} w-full transition-all duration-300 pt-12 lg:pt-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 lg:py-8">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}