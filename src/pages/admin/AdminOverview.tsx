import { motion } from 'framer-motion';
import {
  Users, DollarSign, TrendingUp, Bell,
  FolderOpen, BarChart3, ArrowUpRight, ArrowDownRight,
  CalendarDays, MapPin, Clock
} from 'lucide-react';

interface AdminOverviewProps {
  stats: {
    totalUsers: number;
    totalRaised: number;
    activeProjects: number;
    pendingIssues: number;
    totalContributions: number;
  };
  events: any[];
  users: any[];
  contributions: any[];
  onTabChange: (tab: string) => void;
}

function formatGHS(amount: number) {
  return `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AdminOverview({ stats, events, users, contributions, onTabChange }: AdminOverviewProps) {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers.toString(), change: '+12%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Funds Raised', value: formatGHS(stats.totalRaised), change: '+8%', up: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Projects', value: stats.activeProjects.toString(), change: '+2', up: true, icon: FolderOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Open Issues', value: stats.pendingIssues.toString(), change: '-3', up: false, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const recentDonations = contributions.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Admin Overview</h2>
        <p className="text-slate-500 mt-1.5 font-medium">Full system management at a glance</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
        {cards.map(s => (
          <div key={s.label} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${s.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900">{s.value}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-900">Recent Donations</h3>
            <button onClick={() => onTabChange('financials')} className="text-sm font-bold text-[#CE1126]">View All</button>
          </div>
          <div className="space-y-2.5">
            {recentDonations.length === 0 ? (
              <p className="text-slate-400 italic text-sm py-4 text-center">No donations yet</p>
            ) : recentDonations.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm shrink-0">
                  {(c.donor_first_name || 'D').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{c.donor_first_name} {c.donor_last_name}</p>
                  <p className="text-[10px] text-slate-400">{formatDate(c.created_at)}</p>
                </div>
                <span className="text-sm font-black text-green-600">{formatGHS(Number(c.amount_ghs))}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-900">Upcoming Events</h3>
            <button onClick={() => onTabChange('content')} className="text-sm font-bold text-[#CE1126]">View All</button>
          </div>
          <div className="space-y-2.5">
            {events.length === 0 ? (
              <p className="text-slate-400 italic text-sm py-4 text-center">No events</p>
            ) : events.slice(0, 4).map(ev => (
              <div key={ev.id} className="flex items-center p-3 bg-slate-50 rounded-xl">
                <div className="w-11 h-11 bg-white rounded-xl flex flex-col items-center justify-center text-[#CE1126] font-bold shadow-sm border border-red-100 shrink-0">
                  <span className="text-[8px] uppercase leading-none">{new Date(ev.event_date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-base leading-none">{new Date(ev.event_date).getDate()}</span>
                </div>
                <div className="ml-2.5 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{ev.title}</p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-900">New Users</h3>
            <button onClick={() => onTabChange('users')} className="text-sm font-bold text-[#CE1126]">View All</button>
          </div>
          <div className="space-y-2.5">
            {users.length === 0 ? (
              <p className="text-slate-400 italic text-sm py-4 text-center">No users</p>
            ) : users.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-[#CE1126] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {(u.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{u.full_name || 'Unknown'}</p>
                  <p className="text-[10px] text-slate-400">{u.email || u.phone || '-'}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'assemblyman' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#CE1126]" />
          <h3 className="font-bold text-lg text-slate-900">Quick Stats</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Contributions', value: stats.totalContributions },
            { label: 'Avg Donation', value: stats.totalContributions > 0 ? formatGHS(Math.round(stats.totalRaised / stats.totalContributions)) : 'GHS 0' },
            { label: 'This Month', value: contributions.filter(c => new Date(c.created_at) > new Date(Date.now() - 30 * 86400000)).length },
            { label: 'Conversion Rate', value: stats.totalUsers > 0 ? `${Math.round((stats.totalContributions / stats.totalUsers) * 100)}%` : '0%' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-xl font-black text-slate-900">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
