import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, FolderOpen, DollarSign, Users,
  FileText, AlertTriangle,
  Shield, Settings, MapPin, Clock, Bell, UserCheck, Award, Calendar, Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { AdminOverview } from './admin/AdminOverview';
import { AdminProjects } from './admin/AdminProjects';
import { AdminFinancials } from './admin/AdminFinancials';
import { AdminUsers } from './admin/AdminUsers';
import { AdminContent } from './admin/AdminContent';
import { AdminSecurity } from './admin/AdminSecurity';
import { AdminSettings } from './admin/AdminSettings';
import { AdminAssemblymen } from './admin/AdminAssemblymen';
import { AdminAchievements } from './admin/AdminAchievements';
import { AdminAppointments } from './admin/AdminAppointments';
import { AdminCommHub } from './admin/AdminCommHub';

const ALL_NAV = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'donations', label: 'Donations', icon: DollarSign },
  { id: 'assemblymen', label: 'Assemblymen', icon: UserCheck },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'issues', label: 'Issues', icon: AlertTriangle },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'comms', label: 'Comm Hub', icon: Radio },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const VIEWER_NAV = [
  { id: 'donations', label: 'Donations', icon: DollarSign },
];

export function Admin() {
  const { profile } = useAuth();
  const isViewer = profile?.role === 'viewer';
  const NAV = useMemo(() => isViewer ? VIEWER_NAV : ALL_NAV, [isViewer]);
  const [activeTab, setActiveTab] = useState(isViewer ? 'donations' : 'overview');
  const [events, setEvents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [evRes, postRes, userRes, issRes, projRes, contRes] = await Promise.all([
      supabase.from('events').select('*').order('event_date', { ascending: true }),
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('issues').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('contributions').select('*').neq('is_seed', true).order('created_at', { ascending: false }),
    ]);
    if (evRes.data) setEvents(evRes.data);
    if (postRes.data) setPosts(postRes.data);
    if (userRes.data) setAllUsers(userRes.data);
    if (issRes.data) setIssues(issRes.data);
    if (projRes.data) setProjects(projRes.data);
    if (contRes.data) setContributions(contRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (isViewer && activeTab !== 'donations') {
      setActiveTab('donations');
    }
  }, [isViewer, activeTab]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-live-contributions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contributions' }, () => { fetchData(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  const completedContribs = contributions.filter((c: any) => c.status === 'completed');
  const totalRaised = completedContribs.reduce((s: number, c: any) => s + Number(c.amount_ghs), 0);
  const activeProjects = projects.filter((p: any) => (p.status || 'active') === 'active').length;
  const pendingIssues = issues.filter((i: any) => i.status === 'open').length;

  const overviewStats = {
    totalUsers: allUsers.length,
    totalRaised,
    activeProjects,
    pendingIssues,
    totalContributions: completedContribs.length,
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <DashboardShell
      navItems={NAV}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      accentColor="#CE1126"
      roleLabel={isViewer ? "Viewer" : "Administrator"}
    >
      {activeTab === 'overview' && (
        <AdminOverview stats={overviewStats} events={events} users={allUsers} contributions={contributions} onTabChange={setActiveTab} />
      )}
      {activeTab === 'projects' && (
        <AdminProjects projects={projects} contributions={contributions} onRefresh={fetchData} />
      )}
      {activeTab === 'donations' && (
        <AdminFinancials contributions={contributions} projects={projects} />
      )}
      {activeTab === 'assemblymen' && <AdminAssemblymen />}
      {activeTab === 'achievements' && <AdminAchievements />}
      {activeTab === 'appointments' && <AdminAppointments />}
      {activeTab === 'users' && (
        <AdminUsers users={allUsers} onRefresh={fetchData} />
      )}
      {activeTab === 'content' && (
        <AdminContent events={events} posts={posts} onRefresh={fetchData} />
      )}
      {activeTab === 'comms' && <AdminCommHub />}
      {activeTab === 'issues' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">All Issues</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {issues.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No issues reported</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {issues.map((issue: any) => (
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
      {activeTab === 'security' && <AdminSecurity />}
      {activeTab === 'settings' && <AdminSettings />}
    </DashboardShell>
  );
}