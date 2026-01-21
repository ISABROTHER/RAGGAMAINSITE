// src/pages/Admin.tsx
import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, LayoutDashboard, 
  Calendar, FileText, Settings, TrendingUp, Users, 
  DollarSign, Bell, ChevronRight, LogOut, Menu as MenuIcon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import type { Database } from '../lib/database.types';
import { motion } from 'framer-motion';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type Event = Database['public']['Tables']['events']['Row'];

export function Admin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'posts' | 'settings'>('overview');
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Stats
  const stats = [
    { label: 'Total Raised', value: 'GHS 450K', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Volunteers', value: '15.2K', change: '+5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Campaign Reach', value: '85%', change: '+2.4%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Issues', value: '24', change: '-8%', icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: eventsData } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      const { data: postsData } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      
      if (eventsData) setEvents(eventsData);
      if (postsData) setPosts(postsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const handleDelete = async (table: 'events' | 'blog_posts', id: string) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchData();
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: !post.published, published_at: !post.published ? new Date().toISOString() : null })
      .eq('id', post.id);
    if (!error) fetchData();
  };

  // --- INTERNAL COMPONENTS ---

  const NavItem = ({ id, label, icon: Icon, mobile = false }: { id: typeof activeTab, label: string, icon: any, mobile?: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center transition-all duration-200 font-medium group
        ${mobile 
          ? 'flex-col justify-center p-2 text-[10px]' 
          : 'w-full space-x-3 px-4 py-3.5 rounded-xl'
        }
        ${activeTab === id 
          ? (mobile ? 'text-[#CE1126]' : 'bg-[#CE1126] text-white shadow-lg shadow-red-900/20') 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      <Icon className={`${mobile ? 'w-6 h-6 mb-1' : 'w-5 h-5'} ${activeTab === id ? 'text-current' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span>{label}</span>
      {!mobile && activeTab === id && <ChevronRight className="w-4 h-4 ml-auto text-white/80" />}
    </button>
  );

  const StatCard = ({ stat }: { stat: typeof stats[0] }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
          <stat.icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {stat.change}
        </span>
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</h3>
      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans pb-20 lg:pb-0">
      
      {/* === SIDEBAR (Desktop Only) === */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 fixed h-full z-30">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#CE1126] flex items-center justify-center text-white font-black text-lg shadow-md">
              JD
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight text-lg">Hon. Ragga</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">My Page</p>
            </div>
          </div>
          <div className="h-px w-full bg-slate-100" />
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <NavItem id="overview" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="events" label="Events" icon={Calendar} />
          <NavItem id="posts" label="News & Updates" icon={FileText} />
          <NavItem id="settings" label="Settings" icon={Settings} />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 font-medium">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* === MOBILE BOTTOM NAVIGATION (Mobile Only) === */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around items-center pb-safe pt-1 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavItem id="overview" label="Home" icon={LayoutDashboard} mobile />
        <NavItem id="events" label="Events" icon={Calendar} mobile />
        <NavItem id="posts" label="News" icon={FileText} mobile />
        <NavItem id="settings" label="Settings" icon={Settings} mobile />
      </div>

      {/* === MAIN CONTENT AREA === */}
      <main className="flex-1 lg:ml-72 w-full pt-24 lg:pt-0">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {activeTab === 'overview' && 'Overview'}
                {activeTab === 'events' && 'Events Management'}
                {activeTab === 'posts' && 'Content Studio'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Manage your campaign activity and content.</p>
            </div>
            
            {(activeTab === 'events' || activeTab === 'posts') && (
              <Button size="md" className="bg-[#CE1126] hover:bg-[#A60D1E] text-white shadow-xl shadow-red-900/10 border-none rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Create New
              </Button>
            )}
          </div>

          {/* === TABS CONTENT === */}
          <div className="space-y-8">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Events Widget */}
                  <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-slate-900">Upcoming Events</h3>
                      <button onClick={() => setActiveTab('events')} className="text-sm font-bold text-[#CE1126] hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {events.slice(0, 3).map(evt => (
                        <div key={evt.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="w-14 h-14 bg-white rounded-xl flex flex-col items-center justify-center text-[#CE1126] font-bold shadow-sm flex-shrink-0 border border-red-100">
                            <span className="text-[10px] uppercase tracking-wide">{new Date(evt.event_date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-xl leading-none">{new Date(evt.event_date).getDate()}</span>
                          </div>
                          <div className="ml-4 min-w-0">
                            <h4 className="text-base font-bold text-slate-900 truncate">{evt.title}</h4>
                            <p className="text-sm text-slate-500 truncate">{evt.location}</p>
                          </div>
                        </div>
                      ))}
                      {events.length === 0 && <p className="text-slate-400 italic">No upcoming events.</p>}
                    </div>
                  </div>
                   {/* Posts Widget */}
                   <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-slate-900">Recent Updates</h3>
                      <button onClick={() => setActiveTab('posts')} className="text-sm font-bold text-[#CE1126] hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {posts.slice(0, 3).map(post => (
                        <div key={post.id} className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className={`w-2.5 h-2.5 mt-2 rounded-full mr-4 flex-shrink-0 ${post.published ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-amber-400'}`} />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{post.excerpt || 'No excerpt.'}</p>
                          </div>
                        </div>
                      ))}
                      {posts.length === 0 && <p className="text-slate-400 italic">No updates yet.</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. EVENTS TAB */}
            {activeTab === 'events' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-widest text-slate-500">
                        <th className="p-6 font-bold">Event Name</th>
                        <th className="p-6 font-bold hidden md:table-cell">Date & Time</th>
                        <th className="p-6 font-bold hidden sm:table-cell">Location</th>
                        <th className="p-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {events.map((event) => (
                        <tr key={event.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                            <div className="font-bold text-slate-900 text-lg">{event.title}</div>
                            <div className="md:hidden text-xs text-slate-500 mt-1">
                              {formatDate(event.event_date)} • {event.location}
                            </div>
                          </td>
                          <td className="p-6 text-sm text-slate-600 hidden md:table-cell font-medium">
                            {formatDate(event.event_date)}
                          </td>
                          <td className="p-6 text-sm text-slate-600 hidden sm:table-cell">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                              {event.location}
                            </div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Edit className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('events', event.id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 3. POSTS TAB */}
            {activeTab === 'posts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {post.image_url ? (
                        <img src={post.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                          <FileText className="w-16 h-16 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide backdrop-blur-md shadow-sm ${
                          post.published ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'
                        }`}>
                          {post.published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="text-[#CE1126]">{post.category || 'General'}</span>
                        <span>•</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <h3 className="font-black text-xl text-slate-900 mb-3 line-clamp-2 leading-tight">{post.title}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                        {post.excerpt || 'No excerpt provided.'}
                      </p>
                      <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                        <button 
                          onClick={() => togglePublish(post)}
                          className={`text-xs font-extrabold uppercase tracking-wide flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${post.published ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                        >
                          {post.published ? <><EyeOff className="w-4 h-4" /> Unpublish</> : <><Eye className="w-4 h-4" /> Publish</>}
                        </button>
                        <div className="flex gap-1">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete('blog_posts', post.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

             {/* 4. SETTINGS TAB */}
             {activeTab === 'settings' && (
              <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Settings className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Settings Unavailable</h3>
                <p className="text-slate-500 max-w-md mx-auto">This is a demo environment. User settings and configuration are disabled for this preview.</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}