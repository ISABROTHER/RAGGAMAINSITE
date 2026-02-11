import { useState, useEffect } from 'react';
import {
  LayoutDashboard, MessageSquare, Megaphone, FileText,
  CalendarDays, AlertTriangle, TrendingUp, Clock, MapPin
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
  { id: 'updates', label: 'Updates', icon: Megaphone },
  { id: 'issues', label: 'My Issues', icon: AlertTriangle },
  { id: 'events', label: 'Events', icon: CalendarDays },
];

export function ConstituentDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [evRes, issRes, postRes] = await Promise.all([
        supabase.from('events').select('*').order('event_date', { ascending: true }).limit(5),
        supabase.from('issues').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(5),
      ]);
      if (evRes.data) setEvents(evRes.data);
      if (issRes.data) setIssues(issRes.data);
      if (postRes.data) setPosts(postRes.data);
    };
    loadData();
  }, []);

  const quickStats = [
    { label: 'Open Issues', value: issues.filter(i => i.status === 'open').length.toString(), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Upcoming Events', value: events.filter(e => new Date(e.event_date) > new Date()).length.toString(), icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Latest News', value: posts.length.toString(), icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Community Score', value: '85%', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <DashboardShell
      navItems={NAV}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      accentColor="#16a34a"
      roleLabel="Constituent"
    >
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {profile?.full_name?.split(' ')[0] || 'Citizen'}
            </h2>
            <p className="text-slate-500 mt-1.5 font-medium">Stay connected with your constituency</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {quickStats.map(s => (
              <div key={s.label} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4">Upcoming Events</h3>
              {events.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 3).map(ev => (
                    <div key={ev.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center text-green-600 font-bold shadow-sm border border-green-100 shrink-0">
                        <span className="text-[9px] uppercase">{new Date(ev.event_date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-lg leading-none">{new Date(ev.event_date).getDate()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{ev.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <p className="text-xs text-slate-500 truncate">{ev.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <AnnouncementPanel />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-4">Latest News</h3>
            {posts.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No news yet</p>
            ) : (
              <div className="space-y-3">
                {posts.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.excerpt}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-[10px] text-slate-400">{new Date(p.published_at || p.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'messages' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Messages</h2>
          <MessagePanel />
        </motion.div>
      )}

      {activeTab === 'updates' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Announcements & Updates</h2>
          <AnnouncementPanel />
        </motion.div>
      )}

      {activeTab === 'issues' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Reported Issues</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {issues.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No issues reported yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {issues.map(issue => (
                  <div key={issue.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">{issue.category}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{issue.description}</p>
                        {issue.location && <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{issue.location}</p>}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
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

      {activeTab === 'events' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                {ev.image_url && <img src={ev.image_url} alt="" className="w-full h-40 object-cover" />}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-600">{new Date(ev.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{ev.title}</h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ev.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {ev.location}
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No events scheduled</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </DashboardShell>
  );
}
