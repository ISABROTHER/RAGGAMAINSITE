import { useState } from 'react';
import { LogOut, ChevronRight, ChevronLeft, Globe, MoreHorizontal, X } from 'lucide-react';
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
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();
  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-64';
  const mainMargin = collapsed ? 'lg:ml-[72px]' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans pb-16 lg:pb-0">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col ${sidebarWidth} bg-white border-r border-slate-200 fixed h-full z-30 transition-all duration-300`}>
        {/* Logo + Collapse toggle */}
        <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-5'} h-16 border-b border-slate-100`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="https://i.imgur.com/1GfnCQc.png"
                alt="CCN"
                className="h-8 w-8 object-contain shrink-0"
              />
              <span className="font-bold text-slate-900 text-sm truncate">CCN Portal</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User info */}
        <div className={`${collapsed ? 'px-2 py-4 flex justify-center' : 'px-5 py-4'}`}>
          {collapsed ? (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: accentColor }}
              title={profile?.full_name || 'User'}
            >
              {initial}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{profile?.full_name || 'User'}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{roleLabel}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mx-3 h-px bg-slate-100" />

        {/* Nav items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center w-full ${collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  active ? 'text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
                style={active ? { backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}30` } : undefined}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-current' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                {!collapsed && active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-3 border-t border-slate-100 space-y-0.5">
          <button
            onClick={() => navigate('/')}
            title={collapsed ? 'Back to Website' : undefined}
            className={`flex items-center w-full ${collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-sm text-slate-500 hover:text-[#006B3F] hover:bg-green-50 transition-colors font-medium`}
          >
            <Globe className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="ml-3">Back to Website</span>}
          </button>
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            title={collapsed ? 'Log Out' : undefined}
            className={`flex items-center w-full ${collapsed ? 'justify-center px-0' : 'px-3'} py-2.5 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around items-center pb-safe pt-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 4).map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setMobileMoreOpen(false); }}
              className={`flex flex-col justify-center items-center p-2 text-[10px] font-medium transition-all ${
                active ? 'font-bold' : 'text-slate-400'
              }`}
              style={active ? { color: accentColor } : undefined}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${active ? '' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className={`flex flex-col justify-center items-center p-2 text-[10px] font-medium transition-all ${mobileMoreOpen ? 'font-bold' : 'text-slate-400'}`}
          style={mobileMoreOpen ? { color: accentColor } : undefined}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </div>

      {/* Mobile More Menu */}
      {mobileMoreOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileMoreOpen(false)} />
          <div className="lg:hidden fixed bottom-14 left-3 right-3 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">Menu</span>
              <button onClick={() => setMobileMoreOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              {navItems.slice(4).map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); setMobileMoreOpen(false); }}
                    className={`flex items-center w-full gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                      active ? 'text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    style={active ? { backgroundColor: accentColor } : undefined}
                  >
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-current' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t border-slate-100">
              <button
                onClick={() => { setMobileMoreOpen(false); navigate('/'); }}
                className="flex items-center w-full gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-[#006B3F] transition-colors"
              >
                <Globe className="w-[18px] h-[18px] text-slate-400" />
                <span>Back to Website</span>
              </button>
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="flex items-center w-full gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-[18px] h-[18px] text-slate-400" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${mainMargin} w-full transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}