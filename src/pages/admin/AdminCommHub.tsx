import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Send, RefreshCw, MessageSquare, Clock, CheckCircle,
  XCircle, Plus, ChevronRight, ChevronLeft, AlertCircle,
  Search, Users, Megaphone, Pin, X, Loader2, Phone,
  FileText, Mail, MailOpen, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Recipient {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  zone: string | null;
  role: string;
}

interface SMSRecord {
  id: string;
  recipient_phone: string;
  recipient_name: string;
  content: string;
  status: string;
  created_at: string;
}

interface InAppMessage {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string;
  body: string;
  is_read: boolean;
  message_type: string;
  priority: string;
  created_at: string;
  sender_name?: string;
}

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

interface Template {
  id: string;
  name: string;
  content: string;
}

type TabView = 'compose' | 'history' | 'templates' | 'announcements';
type ComposeChannel = 'sms' | 'in-app';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ACCENT = '#CE1126';
const SMS_CHAR_LIMIT = 160;

/* ------------------------------------------------------------------ */
/*  SMS via Supabase Edge Function → SMSOnlineGH                       */
/* ------------------------------------------------------------------ */

async function sendViaSMS(
  recipients: { phone: string; name: string }[],
  message: string,
  senderName: string
): Promise<{ success: boolean; sent?: number; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: 'Not authenticated' };

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sms`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipients, message, senderName }),
    }
  );

  const data = await res.json();
  return data;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AdminCommHub() {
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<TabView>('compose');

  // Compose
  const [channel, setChannel] = useState<ComposeChannel>('sms');
  const [allRecipients, setAllRecipients] = useState<Recipient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [recipientSearch, setRecipientSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const [senderName] = useState('CCN Admin');
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // History
  const [smsHistory, setSmsHistory] = useState<SMSRecord[]>([]);
  const [inAppMessages, setInAppMessages] = useState<InAppMessage[]>([]);
  const [historyTab, setHistoryTab] = useState<'sms' | 'in-app'>('sms');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedInApp, setSelectedInApp] = useState<InAppMessage | null>(null);

  // Templates
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annTarget, setAnnTarget] = useState('all');
  const [annPosting, setAnnPosting] = useState(false);

  /* ---- Data loaders ---- */

  const loadRecipients = useCallback(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, phone, email, zone, role')
      .eq('is_active', true)
      .order('full_name');
    if (data) setAllRecipients(data as Recipient[]);
  }, []);

  const loadSmsHistory = useCallback(async () => {
    setHistoryLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('message_type', 'sms')
      .order('created_at', { ascending: false })
      .limit(200);
    if (data) {
      setSmsHistory(data.map((m: any) => ({
        id: m.id,
        recipient_phone: m.subject || '',
        recipient_name: m.body?.split('||NAME||')[1] || m.subject || '',
        content: m.body?.split('||NAME||')[0] || m.body || '',
        status: m.priority || 'sent',
        created_at: m.created_at,
      })));
    }
    setHistoryLoading(false);
  }, []);

  const loadInAppMessages = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
      .neq('message_type', 'sms')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) {
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', senderIds);
      const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
      setInAppMessages(data.map(m => ({ ...m, sender_name: nameMap.get(m.sender_id) || 'Unknown' })));
    }
    setHistoryLoading(false);
  }, [user]);

  const loadTemplates = useCallback(async () => {
    const { data } = await supabase.from('announcements').select('*').eq('target_role', '__template__').order('created_at', { ascending: false });
    if (data) setTemplates(data.map(d => ({ id: d.id, name: d.title, content: d.body })));
  }, []);

  const loadAnnouncements = useCallback(async () => {
    setAnnouncementsLoading(true);
    const { data } = await supabase.from('announcements').select('*').neq('target_role', '__template__').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    if (data) {
      const authorIds = [...new Set(data.map(a => a.author_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', authorIds);
      const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
      setAnnouncements(data.map(a => ({ ...a, author_name: nameMap.get(a.author_id) || 'Unknown' })));
    }
    setAnnouncementsLoading(false);
  }, []);

  useEffect(() => { loadRecipients(); }, [loadRecipients]);
  useEffect(() => {
    if (activeView === 'history') { loadSmsHistory(); loadInAppMessages(); }
    if (activeView === 'templates') loadTemplates();
    if (activeView === 'announcements') loadAnnouncements();
  }, [activeView, loadSmsHistory, loadInAppMessages, loadTemplates, loadAnnouncements]);

  /* ---- Derived ---- */

  const zones = useMemo(() => {
    const s = new Set<string>();
    allRecipients.forEach(r => { if (r.zone) s.add(r.zone); });
    return Array.from(s).sort();
  }, [allRecipients]);

  const filteredRecipients = useMemo(() => {
    return allRecipients.filter(r => {
      const q = recipientSearch.toLowerCase();
      const matchSearch = !recipientSearch || r.full_name.toLowerCase().includes(q) || (r.phone || '').includes(recipientSearch) || (r.zone || '').toLowerCase().includes(q);
      const matchZone = zoneFilter === 'all' || r.zone === zoneFilter;
      const matchRole = roleFilter === 'all' || r.role === roleFilter;
      const hasPhone = channel === 'sms' ? !!r.phone : true;
      return matchSearch && matchZone && matchRole && hasPhone;
    });
  }, [allRecipients, recipientSearch, zoneFilter, roleFilter, channel]);

  const selectedRecipients = useMemo(() => allRecipients.filter(r => selectedIds.has(r.id)), [allRecipients, selectedIds]);
  const charCount = messageContent.length;
  const isOverCharLimit = channel === 'sms' && charCount > SMS_CHAR_LIMIT;

  const filteredSmsHistory = useMemo(() => {
    if (!historySearch) return smsHistory;
    const q = historySearch.toLowerCase();
    return smsHistory.filter(m => m.recipient_phone.includes(historySearch) || m.recipient_name.toLowerCase().includes(q) || m.content.toLowerCase().includes(q));
  }, [smsHistory, historySearch]);

  /* ---- Actions ---- */

  const toggleRecipient = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const selectAll = () => setSelectedIds(new Set(filteredRecipients.map(r => r.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !messageContent.trim()) return;
    if (isOverCharLimit) return;
    setSending(true);
    setSendResult(null);
    try {
      if (channel === 'sms') {
        const phones = selectedRecipients.filter(r => r.phone).map(r => ({ phone: r.phone!, name: r.full_name }));
        const result = await sendViaSMS(phones, messageContent, senderName);
        if (result.success) {
          setSendResult({ type: 'success', text: `SMS sent to ${result.sent || phones.length} recipient${(result.sent || phones.length) !== 1 ? 's' : ''}` });
        } else {
          setSendResult({ type: 'error', text: result.error || 'Failed to send SMS' });
        }
      } else {
        const rows = selectedRecipients.map(r => ({ sender_id: user!.id, recipient_id: r.id, subject: subject || '(No Subject)', body: messageContent, message_type: 'direct', priority: 'normal' }));
        const { error } = await supabase.from('messages').insert(rows);
        if (!error) setSendResult({ type: 'success', text: `Message sent to ${selectedRecipients.length} recipient${selectedRecipients.length !== 1 ? 's' : ''}` });
        else setSendResult({ type: 'error', text: 'Failed to send messages' });
      }
      setMessageContent('');
      setSubject('');
      setSelectedIds(new Set());
    } catch {
      setSendResult({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSending(false);
    }
  };

  const saveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content || !user) return;
    await supabase.from('announcements').insert({ author_id: user.id, title: newTemplate.name, body: newTemplate.content, target_role: '__template__' });
    setNewTemplate({ name: '', content: '' });
    setShowTemplateForm(false);
    loadTemplates();
  };

  const useTemplate = (t: Template) => { setMessageContent(t.content); setActiveView('compose'); };
  const deleteTemplate = async (id: string) => { await supabase.from('announcements').delete().eq('id', id); loadTemplates(); };

  const postAnnouncement = async () => {
    if (!user || !annTitle.trim() || !annBody.trim()) return;
    setAnnPosting(true);
    await supabase.from('announcements').insert({ author_id: user.id, title: annTitle, body: annBody, target_role: annTarget });
    setAnnPosting(false);
    setShowAnnounceForm(false);
    setAnnTitle('');
    setAnnBody('');
    loadAnnouncements();
  };

  const togglePin = async (a: Announcement) => { await supabase.from('announcements').update({ is_pinned: !a.is_pinned }).eq('id', a.id); loadAnnouncements(); };

  const openInAppDetail = async (msg: InAppMessage) => {
    setSelectedInApp(msg);
    if (!msg.is_read && msg.recipient_id === user?.id) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
      setInAppMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  /* ---- Helpers ---- */

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const roleLabel = (r: string) => ({ all: 'Everyone', constituent: 'Constituents', assemblyman: 'Assemblymen', admin: 'Admins' }[r] || r);

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Communication Hub</h2>
          <p className="text-slate-500 mt-1 font-medium">SMS, Messages & Announcements</p>
        </div>
        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100">
          <MessageSquare className="w-5 h-5" style={{ color: ACCENT }} />
        </div>
      </div>

      {/* Segmented Control */}
      <div className="bg-slate-200 p-1 rounded-xl flex">
        {([
          { id: 'compose' as TabView, label: 'Compose' },
          { id: 'history' as TabView, label: 'History' },
          { id: 'templates' as TabView, label: 'Templates' },
          { id: 'announcements' as TabView, label: 'Announce' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveView(tab.id); setSelectedInApp(null); }}
            className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all duration-200 ${activeView === tab.id ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            style={{ backgroundColor: activeView === tab.id ? ACCENT : 'transparent' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =============== COMPOSE =============== */}
      {activeView === 'compose' && (
        <div className="space-y-5">
          {/* Channel toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-1 flex">
            {(['sms', 'in-app'] as ComposeChannel[]).map(ch => (
              <button key={ch} onClick={() => { setChannel(ch); clearSelection(); }} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${channel === ch ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                {ch === 'sms' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {ch === 'sms' ? 'SMS' : 'In-App Message'}
              </button>
            ))}
          </div>

          {/* Result banner */}
          <AnimatePresence>
            {sendResult && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`p-4 rounded-2xl flex items-center gap-3 ${sendResult.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {sendResult.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                <p className={`text-sm font-bold flex-1 ${sendResult.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>{sendResult.text}</p>
                <button onClick={() => setSendResult(null)} className="p-1 hover:bg-white/50 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recipients */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Recipients ({selectedIds.size} selected)</label>
                <button onClick={() => setShowPicker(!showPicker)} className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1 hover:opacity-80" style={{ color: ACCENT }}>
                  <Users className="w-3.5 h-3.5" />{showPicker ? 'Close' : 'Choose'}
                </button>
              </div>
              {selectedRecipients.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedRecipients.slice(0, 8).map(r => (
                    <span key={r.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[11px] font-bold rounded-lg" style={{ color: ACCENT }}>
                      {r.full_name}
                      <button onClick={() => toggleRecipient(r.id)} className="hover:bg-red-100 rounded p-0.5"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedRecipients.length > 8 && <span className="text-[11px] font-bold text-slate-400 px-2 py-1">+{selectedRecipients.length - 8} more</span>}
                </div>
              ) : (
                <p className="text-sm text-slate-300 font-medium">No recipients selected — click Choose above</p>
              )}
            </div>

            <AnimatePresence>
              {showPicker && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input value={recipientSearch} onChange={e => setRecipientSearch(e.target.value)} placeholder="Search name, phone, zone..." className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
                      </div>
                      <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none">
                        <option value="all">All Zones</option>
                        {zones.map(z => <option key={z} value={z}>{z}</option>)}
                      </select>
                      <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none">
                        <option value="all">All Roles</option>
                        <option value="constituent">Constituents</option>
                        <option value="assemblyman">Assemblymen</option>
                        <option value="admin">Admins</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filteredRecipients.length} available</span>
                      <div className="flex gap-2">
                        <button onClick={selectAll} className="text-[11px] font-bold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">Select All ({filteredRecipients.length})</button>
                        {selectedIds.size > 0 && <button onClick={clearSelection} className="text-[11px] font-bold px-3 py-1 rounded-lg text-red-600 bg-red-50 hover:bg-red-100">Clear</button>}
                      </div>
                    </div>
                    <div className="max-h-[240px] overflow-y-auto bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                      {filteredRecipients.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm font-medium">{channel === 'sms' ? 'No recipients with phone numbers' : 'No recipients found'}</div>
                      ) : filteredRecipients.map(r => (
                        <label key={r.id} className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${selectedIds.has(r.id) ? 'bg-red-50/40' : 'hover:bg-slate-50'}`}>
                          <input type="checkbox" checked={selectedIds.has(r.id)} onChange={() => toggleRecipient(r.id)} className="w-4 h-4 rounded border-slate-300 accent-[#CE1126]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{r.full_name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              {r.phone && <span>{r.phone}</span>}
                              {r.zone && <span className="font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{r.zone}</span>}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-300 uppercase">{r.role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {channel === 'in-app' && (
              <div className="p-5 border-b border-slate-100">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 block">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject..." className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none border border-slate-100 focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all" />
              </div>
            )}
            <div className={`p-5 transition-colors ${isOverCharLimit ? 'bg-red-50/30' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-[11px] font-black uppercase tracking-wider ${isOverCharLimit ? 'text-red-600' : 'text-slate-500'}`}>Message</label>
                {channel === 'sms' && <span className={`text-[10px] font-black uppercase tracking-wider ${isOverCharLimit ? 'text-red-600' : 'text-slate-400'}`}>{charCount} / {SMS_CHAR_LIMIT}</span>}
              </div>
              <textarea value={messageContent} onChange={e => setMessageContent(e.target.value)} placeholder={channel === 'sms' ? 'Type your SMS (max 160 chars)...' : 'Type your message...'} rows={channel === 'sms' ? 4 : 6} className={`w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium outline-none border border-slate-100 resize-none focus:ring-2 transition-all ${isOverCharLimit ? 'text-red-900 focus:ring-red-200' : 'text-slate-900 focus:ring-red-100'}`} />
              {isOverCharLimit && (
                <div className="flex items-center gap-2 mt-3 p-2.5 bg-red-100 rounded-xl text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span className="text-[11px] font-bold">Exceeds {SMS_CHAR_LIMIT} character SMS limit</span>
                </div>
              )}
            </div>
            {channel === 'sms' && (
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[13px] font-medium text-slate-500">Sender ID</span>
                <span className="text-[13px] font-black text-slate-900 flex items-center gap-1.5">{senderName}<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /></span>
              </div>
            )}
          </div>

          {/* Send */}
          <button onClick={handleSend} disabled={sending || selectedIds.size === 0 || !messageContent.trim() || isOverCharLimit} className="w-full py-4 rounded-2xl text-[15px] font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2" style={{ backgroundColor: ACCENT }}>
            {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {sending ? 'Sending...' : `Send ${channel === 'sms' ? 'SMS' : 'Message'} to ${selectedIds.size} Recipient${selectedIds.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* =============== HISTORY =============== */}
      {activeView === 'history' && (
        <div className="space-y-4">
          {selectedInApp ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-slate-100">
                <button onClick={() => setSelectedInApp(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
                <h3 className="font-bold text-slate-900 truncate flex-1">{selectedInApp.subject}</h3>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div><p className="text-sm font-bold text-slate-900">{selectedInApp.sender_name}</p><p className="text-[11px] text-slate-400">{new Date(selectedInApp.created_at).toLocaleString()}</p></div>
                  {selectedInApp.priority === 'urgent' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">URGENT</span>}
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedInApp.body}</div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-1 flex">
                <button onClick={() => setHistoryTab('sms')} className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${historyTab === 'sms' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}><Phone className="w-3.5 h-3.5" /> SMS Log</button>
                <button onClick={() => setHistoryTab('in-app')} className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${historyTab === 'in-app' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}><Mail className="w-3.5 h-3.5" /> In-App</button>
              </div>

              {historyTab === 'sms' && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search SMS history..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300" />
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {historyLoading ? (
                      <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-slate-300 animate-spin mx-auto" /></div>
                    ) : filteredSmsHistory.length === 0 ? (
                      <div className="p-12 text-center"><Phone className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="font-bold text-slate-400">No SMS history</p><p className="text-xs text-slate-300 mt-1">Sent messages will appear here</p></div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {filteredSmsHistory.map(msg => {
                          const isExp = expandedHistoryId === msg.id;
                          const isFailed = msg.status === 'failed';
                          return (
                            <div key={msg.id}>
                              <button onClick={() => setExpandedHistoryId(isExp ? null : msg.id)} className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${isFailed ? 'bg-red-500' : 'bg-green-500'}`}>{isFailed ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}</div>
                                  <div><p className="text-sm font-bold text-slate-900">{msg.recipient_phone}</p><p className="text-[11px] text-slate-400 truncate max-w-[200px]">{msg.content}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{timeAgo(msg.created_at)}</span>
                                  <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${isExp ? 'rotate-90' : ''}`} />
                                </div>
                              </button>
                              <AnimatePresence>
                                {isExp && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="bg-slate-50 px-5 py-4 border-t border-slate-100">
                                      <div className="flex items-start gap-3 mb-3"><div className="w-1 min-h-[30px] rounded-full" style={{ backgroundColor: ACCENT }} /><p className="text-sm text-slate-700 leading-relaxed italic">"{msg.content}"</p></div>
                                      <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span className="font-bold flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${isFailed ? 'bg-red-500' : 'bg-green-500'}`} />{isFailed ? 'Failed' : 'Delivered'}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(msg.created_at)}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {historyTab === 'in-app' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {historyLoading ? (
                    <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-slate-300 animate-spin mx-auto" /></div>
                  ) : inAppMessages.length === 0 ? (
                    <div className="p-12 text-center"><Mail className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="font-bold text-slate-400">No messages</p></div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {inAppMessages.map(msg => (
                        <button key={msg.id} onClick={() => openInAppDetail(msg)} className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!msg.is_read && msg.recipient_id === user?.id ? 'bg-red-50/30' : ''}`}>
                          <div className="mt-1.5">{msg.is_read || msg.sender_id === user?.id ? <MailOpen className="w-4 h-4 text-slate-300" /> : <Circle className="w-3 h-3 fill-current" style={{ color: ACCENT }} />}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm truncate ${!msg.is_read && msg.recipient_id === user?.id ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{msg.sender_id === user?.id ? `To: ${msg.recipient_id?.slice(0, 8)}...` : msg.sender_name}</p>
                              <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(msg.created_at)}</span>
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{msg.subject}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* =============== TEMPLATES =============== */}
      {activeView === 'templates' && (
        <div className="space-y-4">
          <button onClick={() => setShowTemplateForm(!showTemplateForm)} className="w-full py-4 rounded-2xl bg-white border-2 border-dashed border-slate-200 font-bold text-[14px] flex items-center justify-center gap-2 hover:border-red-200 hover:bg-red-50/30 transition-all" style={{ color: ACCENT }}>
            {showTemplateForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showTemplateForm ? 'Cancel' : 'Create New Template'}
          </button>
          <AnimatePresence>
            {showTemplateForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Template Name</label><input value={newTemplate.name} onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })} placeholder="e.g. Community Meeting Reminder" className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none border border-slate-100 focus:ring-2 focus:ring-red-100" /></div>
                  <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Content</label><textarea value={newTemplate.content} onChange={e => setNewTemplate({ ...newTemplate, content: e.target.value })} placeholder="Write your template message..." rows={4} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-900 outline-none resize-none border border-slate-100 focus:ring-2 focus:ring-red-100" /></div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowTemplateForm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200">Cancel</button>
                    <button onClick={saveTemplate} disabled={!newTemplate.name || !newTemplate.content} className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50" style={{ backgroundColor: ACCENT }}>Save Template</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {templates.length === 0 ? (
              <div className="p-12 text-center"><FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="font-bold text-slate-400">No templates yet</p><p className="text-xs text-slate-300 mt-1">Create reusable message templates</p></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {templates.map(t => (
                  <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <button onClick={() => useTemplate(t)} className="flex-1 text-left min-w-0"><h4 className="text-[15px] font-bold text-slate-900 mb-0.5">{t.name}</h4><p className="text-[13px] text-slate-400 line-clamp-1">{t.content}</p></button>
                    <div className="flex items-center gap-2 ml-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => useTemplate(t)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">Use</button>
                      <button onClick={() => deleteTemplate(t.id)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =============== ANNOUNCEMENTS =============== */}
      {activeView === 'announcements' && (
        <div className="space-y-4">
          <button onClick={() => setShowAnnounceForm(!showAnnounceForm)} className="w-full py-4 rounded-2xl bg-white border-2 border-dashed border-slate-200 font-bold text-[14px] flex items-center justify-center gap-2 hover:border-amber-200 hover:bg-amber-50/30 transition-all" style={{ color: '#D97706' }}>
            {showAnnounceForm ? <X className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
            {showAnnounceForm ? 'Cancel' : 'Post Announcement'}
          </button>
          <AnimatePresence>
            {showAnnounceForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-4 bg-amber-50/30">
                  <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label><input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title..." className="w-full px-4 py-3 bg-white rounded-xl text-sm font-medium text-slate-900 outline-none border border-amber-200 focus:ring-2 focus:ring-amber-100" /></div>
                  <div><label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Message</label><textarea value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder="Write your announcement..." rows={4} className="w-full px-4 py-3 bg-white rounded-xl text-sm font-medium text-slate-900 outline-none resize-none border border-amber-200 focus:ring-2 focus:ring-amber-100" /></div>
                  <div className="flex items-center gap-3">
                    <select value={annTarget} onChange={e => setAnnTarget(e.target.value)} className="px-3 py-2.5 bg-white border border-amber-200 rounded-lg text-sm font-medium focus:outline-none">
                      <option value="all">Everyone</option><option value="constituent">Constituents only</option><option value="assemblyman">Assemblymen only</option><option value="admin">Admins only</option>
                    </select>
                    <button onClick={postAnnouncement} disabled={annPosting || !annTitle.trim() || !annBody.trim()} className="ml-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl disabled:opacity-50 transition-colors flex items-center gap-1.5">
                      {annPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}Publish
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {announcementsLoading ? (
              <div className="p-12 text-center"><Loader2 className="w-6 h-6 text-slate-300 animate-spin mx-auto" /></div>
            ) : announcements.length === 0 ? (
              <div className="p-12 text-center"><Megaphone className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="font-bold text-slate-400">No announcements</p></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {announcements.map(a => (
                  <div key={a.id} className={`p-4 ${a.is_pinned ? 'bg-amber-50/30' : ''}`}>
                    <div className="flex items-start gap-2">
                      {a.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{a.title}</h4>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => togglePin(a)} className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.is_pinned ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}>{a.is_pinned ? 'Unpin' : 'Pin'}</button>
                            <span className="text-[10px] text-slate-400">{timeAgo(a.created_at)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.body}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-slate-400 font-medium">{a.author_name}</span>
                          <span className="text-[10px] text-slate-300">·</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{roleLabel(a.target_role)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}