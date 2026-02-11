import { LogOut, ChevronRight } from 'lucide-react';
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

  const initial = (profile?.full_name || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans pb-20 lg:pb-0">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 fixed h-full z-30">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md`} style={{ backgroundColor: accentColor }}>
              {initial}
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight text-lg">{profile?.full_name || 'User'}</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{roleLabel}</p>
            </div>
          </div>
          <div className="h-px w-full bg-slate-100" />
        </div>
        <nav className="flex-1 px-6 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full space-x-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 group ${
                  active ? 'text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
                style={active ? { backgroundColor: accentColor, boxShadow: `0 8px 24px ${accentColor}33` } : undefined}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-current' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto text-white/80" />}
              </button>
            );
          })}
        </nav>
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around items-center pb-safe pt-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col justify-center items-center p-2 text-[10px] font-medium transition-all ${
                active ? 'font-bold' : 'text-slate-400'
              }`}
              style={active ? { color: accentColor } : undefined}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? '' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <main className="flex-1 lg:ml-72 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
