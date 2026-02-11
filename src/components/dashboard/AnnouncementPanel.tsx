import { useState, useEffect, useCallback } from 'react';
import { Megaphone, Pin, Loader2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Announcement {
  id: string;
  author_id: string;
  title: string;
  body: string;
  target_role: string;
  is_pinned: boolean;
  created_at: string;
  author_name?: string;
}

export function AnnouncementPanel({ canPost = false }: { canPost?: boolean }) {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [posting, setPosting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (data) {
      const authorIds = [...new Set(data.map(a => a.author_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', authorIds);
      const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
      setItems(data.map(a => ({ ...a, author_name: nameMap.get(a.author_id) || 'Unknown' })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  useEffect(() => {
    const channel = supabase
      .channel('announcements-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncements();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAnnouncements]);

  const handlePost = async () => {
    if (!user || !title.trim() || !body.trim()) return;
    setPosting(true);
    await supabase.from('announcements').insert({
      author_id: user.id,
      title,
      body,
      target_role: target,
    });
    setPosting(false);
    setShowForm(false);
    setTitle('');
    setBody('');
    fetchAnnouncements();
  };

  const roleLabel = (r: string) => {
    const map: Record<string, string> = { all: 'Everyone', constituent: 'Constituents', assemblyman: 'Assemblymen', admin: 'Admins' };
    return map[r] || r;
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">Announcements</h3>
        </div>
        {canPost && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? 'Cancel' : 'Post'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-amber-50/50 border-b border-amber-100 space-y-3">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Announcement title..."
                className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-300"
              />
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your announcement..."
                rows={3}
                className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-300 resize-none"
              />
              <div className="flex items-center gap-3">
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  className="px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="all">Everyone</option>
                  <option value="constituent">Constituents only</option>
                  <option value="assemblyman">Assemblymen only</option>
                  <option value="admin">Admins only</option>
                </select>
                <button
                  onClick={handlePost}
                  disabled={posting || !title.trim() || !body.trim()}
                  className="ml-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Megaphone className="w-3.5 h-3.5" />}
                  Publish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-slate-300 animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Megaphone className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm font-medium">No announcements</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`p-4 border-b border-slate-50 ${item.is_pinned ? 'bg-amber-50/30' : ''}`}>
              <div className="flex items-start gap-2 mb-1">
                {item.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(item.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 font-medium">{item.author_name}</span>
                    <span className="text-[10px] text-slate-300">|</span>
                    <span className="text-[10px] text-slate-400 font-medium">For: {roleLabel(item.target_role)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}