import { useState, useEffect } from 'react';
import {
  LayoutDashboard, MessageSquare, Megaphone, Users,
  AlertTriangle, CalendarDays, TrendingUp, BarChart3,
  MapPin, FileText, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { MessagePanel } from '../components/dashboard/MessagePanel';
import { AnnouncementPanel } from '../components/dashboard/AnnouncementPanel';

const NAV = [
  { id: 'overview', label: 'Home', icon: LayoutDashboard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'announcements', label: 'Announce', icon: Megaphone },
  { id: 'issues', label: 'Issues', icon: AlertTriangle },
  { id: 'constituents', label: 'People', icon: Users },
];

export function AssemblymanDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [issues, setIssues] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [constituents, setConstituents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [issRes, evRes, constRes, postRes] = await Promise.all([
        supabase.from('issues').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('event_date', { ascending: false }).limit(5),
        supabase.from('profiles').select('id, full_name, phone, zone, role, created_at').eq('role', 'constituent'),
        supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(5),
      ]);
      if (issRes.data) setIssues(issRes.data);
      if (evRes.data) setEvents(evRes.data);
      if (constRes.data) setConstituents(constRes.data);
      if (postRes.data) setPosts(postRes.data);
    };
    loadData();
  }, []);

  const openIssues = issues.filter(i => i.status === 'open').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;

  const stats = [
    { label: 'Constituents', value: constituents.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open Issues', value: openIssues.toString(), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: inProgressIssues.toString(), icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Events', value: events.length.toString(), icon: CalendarDays, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const priorityCounts = {
    high: issues.filter(i => i.priority === 'high').length,
    medium: issues.filter(i => i.priority === 'medium').length,
    low: issues.filter(i => i.priority === 'low').length,
  };

  return (
    <DashboardShell
      navItems={NAV}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      accentColor="#2563eb"
      roleLabel="Assemblyman"
    >
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome, Hon. {profile?.full_name?.split(' ').slice(-1)[0] || 'Representative'}
            </h2>
            <p className="text-slate-500 mt-1.5 font-medium">Your constituency at a glance</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {stats.map(s => (
              <div key={s.label} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Issues by Priority</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'High', count: priorityCounts.high, color: 'bg-red-500', total: issues.length },
                  { label: 'Medium', count: priorityCounts.medium, color: 'bg-amber-500', total: issues.length },
                  { label: 'Low', count: priorityCounts.low, color: 'bg-green-500', total: issues.length },
                ].map(p => (
                  <div key={p.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-600">{p.label}</span>
                      <span className="text-xs font-bold text-slate-900">{p.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${p.color} rounded-full transition-all`} style={{ width: `${p.total ? (p.count / p.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4">Recent Issues</h3>
              <div className="space-y-2.5">
                {issues.slice(0, 4).map(i => (
                  <div key={i.id} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${i.priority === 'high' ? 'bg-red-500' : i.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">{i.category}</p>
                      <p className="text-[11px] text-slate-500 truncate">{i.description}</p>
                    </div>
                  </div>
                ))}
                {issues.length === 0 && <p className="text-sm text-slate-400 italic">No issues reported</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4">Latest News</h3>
              <div className="space-y-2.5">
                {posts.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                    <FileText className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <p className="text-[10px] text-slate-400">{new Date(p.published_at || p.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && <p className="text-sm text-slate-400 italic">No updates</p>}
              </div>
            </div>
          </div>

          <AnnouncementPanel canPost />
        </motion.div>
      )}

      {activeTab === 'messages' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Messages</h2>
          <MessagePanel />
        </motion.div>
      )}

      {activeTab === 'announcements' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Announcements</h2>
          <p className="text-slate-500 font-medium">Post announcements to constituents and other members</p>
          <AnnouncementPanel canPost />
        </motion.div>
      )}

      {activeTab === 'issues' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Constituency Issues</h2>
            <span className="text-sm font-bold text-slate-500">{issues.length} total</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {issues.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No issues reported</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {issues.map(issue => (
                  <div key={issue.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${issue.priority === 'high' ? 'bg-red-500' : issue.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                          <p className="text-sm font-bold text-slate-900">{issue.category}</p>
                          {issue.subcategory && <span className="text-[10px] text-slate-400 font-medium">/ {issue.subcategory}</span>}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{issue.description}</p>
                        {issue.location && (
                          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{issue.location}
                          </p>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-700'
                        : issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                        {issue.status?.replace('_', ' ') || 'open'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'constituents' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Constituents</h2>
            <span className="text-sm font-bold text-slate-500">{constituents.length} members</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {constituents.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No constituents registered yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {constituents.map(c => (
                  <div key={c.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                      {(c.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{c.full_name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{c.phone || 'No phone'}{c.zone ? ` | ${c.zone}` : ''}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </DashboardShell>
  );
}