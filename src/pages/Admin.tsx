import { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Eye, EyeOff, LayoutDashboard,
  Calendar, FileText, Settings, TrendingUp, Users,
  DollarSign, Bell, MessageSquare, Megaphone,
  MapPin, ShieldCheck, UserCheck, Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import type { Database } from '../lib/database.types';
import { motion } from 'framer-motion';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { MessagePanel } from '../components/dashboard/MessagePanel';
import { AnnouncementPanel } from '../components/dashboard/AnnouncementPanel';
import { useAuth } from '../contexts/AuthContext';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'posts', label: 'Content', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

const SECONDARY_NAV = [
  { id: 'announcements', label: 'Announce', icon: Megaphone },
  { id: 'issues', label: 'Issues', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Admin() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: 'Total Users', value: allUsers.length.toString(), change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Raised', value: 'GHS 450K', change: '+5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Campaign Reach', value: '85%', change: '+2.4%', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Pending Issues', value: issues.filter(i => i.status === 'open').length.toString(), change: '-8%', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [evRes, postRes, userRes, issRes] = await Promise.all([
      supabase.from('events').select('*').order('event_date', { ascending: false }),
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('issues').select('*').order('created_at', { ascending: false }),
    ]);
    if (evRes.data) setEvents(evRes.data);
    if (postRes.data) setPosts(postRes.data);
    if (userRes.data) setAllUsers(userRes.data);
    if (issRes.data) setIssues(issRes.data);
    setLoading(false);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDelete = async (table: 'events' | 'blog_posts', id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from('blog_posts').update({ published: !post.published, published_at: !post.published ? new Date().toISOString() : null }).eq('id', post.id);
    fetchData();
  };

  const allNavItems = [...NAV, ...SECONDARY_NAV];

  const roleColor = (r: string) => {
    if (r === 'admin') return 'bg-red-100 text-red-700';
    if (r === 'assemblyman') return 'bg-blue-100 text-blue-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <DashboardShell
      navItems={allNavItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      accentColor="#CE1126"
      roleLabel="Administrator"
    >
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Admin Overview
            </h2>
            <p className="text-slate-500 mt-1.5 font-medium">Full system management</p>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
            {stats.map(s => (
              <div key={s.label} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}><s.icon className="w-5 h-5" /></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.change}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900">{s.value}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-900">Upcoming Events</h3>
                <button onClick={() => setActiveTab('events')} className="text-sm font-bold text-[#CE1126]">View All</button>
              </div>
              <div className="space-y-3">
                {events.slice(0, 3).map(ev => (
                  <div key={ev.id} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center text-[#CE1126] font-bold shadow-sm border border-red-100 shrink-0">
                      <span className="text-[9px] uppercase">{new Date(ev.event_date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg leading-none">{new Date(ev.event_date).getDate()}</span>
                    </div>
                    <div className="ml-3 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{ev.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{ev.location}</p>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-slate-400 italic text-sm">No events</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-900">Recent Users</h3>
                <button onClick={() => setActiveTab('users')} className="text-sm font-bold text-[#CE1126]">View All</button>
              </div>
              <div className="space-y-2.5">
                {allUsers.slice(0, 4).map(u => (
                  <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-[#CE1126] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {(u.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{u.full_name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-400">{u.email || u.phone || 'No contact'}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>{u.role}</span>
                  </div>
                ))}
                {allUsers.length === 0 && <p className="text-slate-400 italic text-sm">No users</p>}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h2>
              <p className="text-slate-500 mt-1 font-medium">{allUsers.length} registered users</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['admin', 'assemblyman', 'constituent'].map(r => {
              const count = allUsers.filter(u => u.role === r).length;
              const icons: Record<string, React.ElementType> = { admin: ShieldCheck, assemblyman: UserCheck, constituent: Users };
              const Icon = icons[r];
              return (
                <div key={r} className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p className="text-xl font-black text-slate-900">{count}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{r}s</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="p-4 font-bold">User</th>
                    <th className="p-4 font-bold hidden sm:table-cell">Contact</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold hidden md:table-cell">Joined</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {(u.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{u.full_name || 'Unknown'}</p>
                            <p className="text-[10px] text-slate-400 sm:hidden">{u.email || u.phone || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-sm text-slate-600">{u.email || u.phone || '-'}</td>
                      <td className="p-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>{u.role}</span></td>
                      <td className="p-4 hidden md:table-cell text-xs text-slate-500">{formatDate(u.created_at)}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'events' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Events Management</h2>
            <Button size="md" className="bg-[#CE1126] hover:bg-[#A60D1E] text-white border-none rounded-xl shadow-lg">
              <Plus className="w-4 h-4 mr-2" />Create New
            </Button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="p-4 font-bold">Event</th>
                    <th className="p-4 font-bold hidden md:table-cell">Date</th>
                    <th className="p-4 font-bold hidden sm:table-cell">Location</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{ev.title}</p>
                        <p className="md:hidden text-xs text-slate-500 mt-0.5">{formatDate(ev.event_date)}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600 hidden md:table-cell">{formatDate(ev.event_date)}</td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                          <MapPin className="w-3 h-3" />{ev.location}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('events', ev.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'posts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Content Studio</h2>
            <Button size="md" className="bg-[#CE1126] hover:bg-[#A60D1E] text-white border-none rounded-xl shadow-lg">
              <Plus className="w-4 h-4 mr-2" />Create New
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-40 bg-slate-100">
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText className="w-12 h-12 opacity-20" /></div>
                  )}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${post.published ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'}`}>
                    {post.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-[#CE1126] uppercase tracking-wider mb-1">{post.category || 'General'}</p>
                  <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-3">{post.title}</h3>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button onClick={() => togglePublish(post)} className={`text-[10px] font-bold uppercase flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${post.published ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                      {post.published ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                    </button>
                    <div className="flex gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('blog_posts', post.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          <AnnouncementPanel canPost />
        </motion.div>
      )}

      {activeTab === 'issues' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">All Issues</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {issues.length === 0 ? (
              <div className="p-12 text-center text-slate-400"><Bell className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">No issues</p></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {issues.map(issue => (
                  <div key={issue.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${issue.priority === 'high' ? 'bg-red-500' : issue.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                          <p className="text-sm font-bold text-slate-900">{issue.category}</p>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{issue.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          {issue.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{issue.location}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(issue.created_at)}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                        issue.status === 'resolved' ? 'bg-green-100 text-green-700' : issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>{issue.status?.replace('_', ' ') || 'open'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">Settings</h3>
            <p className="text-slate-500 max-w-md mx-auto">System settings and configuration will be available here.</p>
          </div>
        </motion.div>
      )}
    </DashboardShell>
  );
}
