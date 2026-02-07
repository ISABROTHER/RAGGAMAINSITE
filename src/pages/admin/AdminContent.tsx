import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, FileText, Plus, Edit, Trash2, Eye, EyeOff,
  MapPin, Loader2, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminContentProps {
  events: any[];
  posts: any[];
  onRefresh: () => void;
}

type ContentTab = 'events' | 'posts';

const emptyEvent = { title: '', description: '', location: '', event_date: '', image_url: '', rsvp_enabled: true, max_attendees: '' };
const emptyPost = { title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'General', published: false };

export function AdminContent({ events, posts, onRefresh }: AdminContentProps) {
  const [tab, setTab] = useState<ContentTab>('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [postForm, setPostForm] = useState(emptyPost);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    onRefresh();
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    onRefresh();
  };

  const togglePublish = async (post: any) => {
    await supabase.from('blog_posts').update({ published: !post.published, published_at: !post.published ? new Date().toISOString() : null }).eq('id', post.id);
    onRefresh();
  };

  const openEditEvent = (ev: any) => {
    setEditId(ev.id);
    setEventForm({
      title: ev.title, description: ev.description, location: ev.location,
      event_date: new Date(ev.event_date).toISOString().slice(0, 16),
      image_url: ev.image_url || '', rsvp_enabled: ev.rsvp_enabled,
      max_attendees: ev.max_attendees?.toString() || '',
    });
    setShowEventForm(true);
  };

  const openEditPost = (p: any) => {
    setEditId(p.id);
    setPostForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
      image_url: p.image_url || '', category: p.category, published: p.published,
    });
    setShowPostForm(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title.trim()) return;
    setSaving(true);
    const payload = {
      title: eventForm.title, description: eventForm.description, location: eventForm.location,
      event_date: eventForm.event_date, image_url: eventForm.image_url || null,
      rsvp_enabled: eventForm.rsvp_enabled, max_attendees: eventForm.max_attendees ? Number(eventForm.max_attendees) : null,
    };
    if (editId) {
      await supabase.from('events').update(payload).eq('id', editId);
    } else {
      await supabase.from('events').insert(payload);
    }
    setSaving(false);
    setShowEventForm(false);
    setEditId(null);
    setEventForm(emptyEvent);
    onRefresh();
  };

  const savePost = async () => {
    if (!postForm.title.trim()) return;
    setSaving(true);
    const slug = postForm.slug || postForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = {
      title: postForm.title, slug, excerpt: postForm.excerpt, content: postForm.content,
      image_url: postForm.image_url || null, category: postForm.category,
      published: postForm.published, published_at: postForm.published ? new Date().toISOString() : null,
    };
    if (editId) {
      await supabase.from('blog_posts').update(payload).eq('id', editId);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }
    setSaving(false);
    setShowPostForm(false);
    setEditId(null);
    setPostForm(emptyPost);
    onRefresh();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Content Management</h2>
          <p className="text-slate-500 mt-1 font-medium">Events and news updates</p>
        </div>
        <button
          onClick={() => { tab === 'events' ? (setEditId(null), setEventForm(emptyEvent), setShowEventForm(true)) : (setEditId(null), setPostForm(emptyPost), setShowPostForm(true)); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
        >
          <Plus className="w-4 h-4" />New {tab === 'events' ? 'Event' : 'Post'}
        </button>
      </div>

      <div className="flex bg-white rounded-xl border border-slate-200 p-1 w-fit">
        {([['events', Calendar, `Events (${events.length})`], ['posts', FileText, `Posts (${posts.length})`]] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key as ContentTab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === key ? 'bg-[#CE1126] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {showEventForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit Event' : 'Create Event'}</h3>
            <button onClick={() => { setShowEventForm(false); setEditId(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
              <input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date & Time</label>
              <input type="datetime-local" value={eventForm.event_date} onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</label>
              <input value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Max Attendees</label>
              <input type="number" value={eventForm.max_attendees} onChange={e => setEventForm(f => ({ ...f, max_attendees: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Image URL</label>
              <input value={eventForm.image_url} onChange={e => setEventForm(f => ({ ...f, image_url: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowEventForm(false); setEditId(null); }} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={saveEvent} disabled={saving} className="px-6 py-2.5 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {showPostForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit Post' : 'Create Post'}</h3>
            <button onClick={() => { setShowPostForm(false); setEditId(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
              <input value={postForm.title} onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
              <select value={postForm.category} onChange={e => setPostForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300">
                {['General', 'Article', 'Press Release', 'Update', 'Announcement'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Excerpt</label>
              <input value={postForm.excerpt} onChange={e => setPostForm(f => ({ ...f, excerpt: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Content</label>
              <textarea value={postForm.content} onChange={e => setPostForm(f => ({ ...f, content: e.target.value }))} rows={6} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Image URL</label>
              <input value={postForm.image_url} onChange={e => setPostForm(f => ({ ...f, image_url: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowPostForm(false); setEditId(null); }} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={savePost} disabled={saving} className="px-6 py-2.5 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {tab === 'events' && (
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
                {events.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-sm">No events</td></tr>
                ) : events.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{ev.title}</p>
                      <p className="md:hidden text-xs text-slate-500 mt-0.5">{formatDate(ev.event_date)}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600 hidden md:table-cell">{formatDate(ev.event_date)}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600"><MapPin className="w-3 h-3" />{ev.location}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEditEvent(ev)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'posts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.length === 0 ? (
            <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No posts</p>
            </div>
          ) : posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-36 bg-slate-100">
                {post.image_url ? <img src={post.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FileText className="w-10 h-10 text-slate-200" /></div>}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${post.published ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'}`}>{post.published ? 'Live' : 'Draft'}</span>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-[#CE1126] uppercase tracking-wider mb-1">{post.category}</p>
                <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-3">{post.title}</h3>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button onClick={() => togglePublish(post)} className={`text-[10px] font-bold uppercase flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${post.published ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}>
                    {post.published ? <><EyeOff className="w-3.5 h-3.5" />Unpublish</> : <><Eye className="w-3.5 h-3.5" />Publish</>}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEditPost(post)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
