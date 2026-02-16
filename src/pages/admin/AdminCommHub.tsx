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

interface SmsSenderId {
  id: string;
  name: string;
  is_default: boolean;
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
  const [senderIds, setSenderIds] = useState<SmsSenderId[]>([]);
  const [senderName, setSenderName] = useState('Hon. Ragga');
  const [senderIdsLoading, setSenderIdsLoading] = useState(false);
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

  const loadSenderIds = useCallback(async () => {
    // Sender IDs are stored in Supabase so they can be managed from the dashboard.
    setSenderIdsLoading(true);
    const { data, error } = await supabase
      .from('sms_sender_ids')
      .select('id, name, is_default')
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });

    if (!error && data) {
      const rows = data as SmsSenderId[];
      setSenderIds(rows);
      const preferred = rows.find(r => r.is_default)?.name || rows[0]?.name;
      if (preferred) setSenderName(preferred);
    }

    // If the table doesn't exist yet or RLS blocks access, we gracefully fall back to the current state value.
    setSenderIdsLoading(false);
  }, []);

  useEffect(() => { loadRecipients(); }, [loadRecipients]);
  useEffect(() => { loadSenderIds(); }, [loadSenderIds]);
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

  const charCount = useMemo(() => messageContent.length, [messageContent]);
  const isOverCharLimit = channel === 'sms' && charCount > SMS_CHAR_LIMIT;

  /* ------------------------------------------------------------------ */
  /*  Actions                                                           */
  /* ------------------------------------------------------------------ */

  const toggleRecipient = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    const all = filteredRecipients.map(r => r.id);
    setSelectedIds(prev => {
      const next = new Set(prev);
      const allSelected = all.every(id => next.has(id));
      if (allSelected) all.forEach(id => next.delete(id));
      else all.forEach(id => next.add(id));
      return next;
    });
  };

  const clearCompose = () => {
    setSelectedIds(new Set());
    setMessageContent('');
    setSubject('');
    setRecipientSearch('');
    setZoneFilter('all');
    setRoleFilter('all');
  };

  const handleSend = async () => {
    if (!user) return;
    if (selectedIds.size === 0) return;
    if (!messageContent.trim()) return;

    setSending(true);
    setSendResult(null);

    try {
      if (channel === 'sms') {
        const phones = selectedRecipients
          .filter(r => !!r.phone)
          .map(r => ({ phone: r.phone!, name: r.full_name }));

        const result = await sendViaSMS(phones, messageContent, senderName);

        // log to DB (messages table) as SMS record(s)
        if (result.success) {
          const rows = phones.map(p => ({
            sender_id: user.id,
            recipient_id: null,
            subject: p.phone,
            body: `${messageContent}||NAME||${p.name}`,
            message_type: 'sms',
            priority: 'sent',
          }));
          await supabase.from('messages').insert(rows as any);
          setSendResult({ type: 'success', text: `SMS sent (${result.sent || phones.length})` });
        } else {
          setSendResult({ type: 'error', text: result.error || 'SMS failed' });
        }
      } else {
        // In-app message(s)
        const rows = selectedRecipients.map(r => ({
          sender_id: user!.id,
          recipient_id: r.id,
          subject: subject || '(No Subject)',
          body: messageContent,
          message_type: 'direct',
          priority: 'normal'
        }));
        const { error } = await supabase.from('messages').insert(rows as any);
        if (error) setSendResult({ type: 'error', text: error.message });
        else setSendResult({ type: 'success', text: `Message sent to ${selectedIds.size} recipient(s)` });
      }

      clearCompose();
    } catch (e: any) {
      setSendResult({ type: 'error', text: e?.message || 'Unexpected error' });
    } finally {
      setSending(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Templates                                                         */
  /* ------------------------------------------------------------------ */

  const saveTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) return;
    const { error } = await supabase.from('announcements').insert({
      author_id: user?.id,
      title: newTemplate.name.trim(),
      body: newTemplate.content.trim(),
      target_role: '__template__',
      is_pinned: false
    } as any);
    if (!error) {
      setNewTemplate({ name: '', content: '' });
      setShowTemplateForm(false);
      loadTemplates();
    }
  };

  const deleteTemplate = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    loadTemplates();
  };

  const useTemplate = (t: Template) => {
    setActiveView('compose');
    setMessageContent(t.content);
  };

  /* ------------------------------------------------------------------ */
  /*  Announcements                                                     */
  /* ------------------------------------------------------------------ */

  const postAnnouncement = async () => {
    if (!user) return;
    if (!annTitle.trim() || !annBody.trim()) return;
    setAnnPosting(true);
    const { error } = await supabase.from('announcements').insert({
      author_id: user.id,
      title: annTitle.trim(),
      body: annBody.trim(),
      target_role: annTarget,
      is_pinned: false
    } as any);
    if (!error) {
      setAnnTitle('');
      setAnnBody('');
      setAnnTarget('all');
      setShowAnnounceForm(false);
      loadAnnouncements();
    }
    setAnnPosting(false);
  };

  const togglePin = async (a: Announcement) => {
    await supabase.from('announcements').update({ is_pinned: !a.is_pinned } as any).eq('id', a.id);
    loadAnnouncements();
  };

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                           */
  /* ------------------------------------------------------------------ */

  const roleLabel = (role: string) => {
    if (role === 'all') return 'All';
    if (role === 'admin') return 'Admins';
    if (role === 'assemblyman') return 'Assemblymen';
    if (role === 'constituent') return 'Constituents';
    return role;
  };

  const timeAgo = (iso: string) => {
    const d = new Date(iso).getTime();
    const diff = Date.now() - d;
    const mins = Math.round(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.round(hrs / 24);
    return `${days}d`;
  };

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Communication Hub</h2>
          <p className="text-slate-500 mt-1 font-medium">SMS, in-app messages, templates and announcements</p>
        </div>

        <div className="flex items-center gap-2">
          {(['compose', 'history', 'templates', 'announcements'] as TabView[]).map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                activeView === v ? 'text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              style={activeView === v ? { backgroundColor: ACCENT } : undefined}
            >
              {v === 'compose' && <span className="inline-flex items-center gap-2"><MessageSquare className="w-4 h-4" />Compose</span>}
              {v === 'history' && <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" />History</span>}
              {v === 'templates' && <span className="inline-flex items-center gap-2"><FileText className="w-4 h-4" />Templates</span>}
              {v === 'announcements' && <span className="inline-flex items-center gap-2"><Megaphone className="w-4 h-4" />Announcements</span>}
            </button>
          ))}
        </div>
      </div>

      {/* =============== COMPOSE =============== */}
      {activeView === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recipient Picker */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Recipients
              </h3>
              <button
                onClick={toggleAllFiltered}
                className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Toggle All
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  value={recipientSearch}
                  onChange={e => setRecipientSearch(e.target.value)}
                  placeholder="Search name, phone, zone..."
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={zoneFilter}
                  onChange={e => setZoneFilter(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">All zones</option>
                  {zones.map(z => <option key={z} value={z}>{z}</option>)}
                </select>

                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">All roles</option>
                  <option value="constituent">Constituent</option>
                  <option value="assemblyman">Assemblyman</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[520px] overflow-auto divide-y divide-slate-100">
              {filteredRecipients.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="font-bold">No recipients found</p>
                  <p className="text-xs mt-1">Adjust filters or search terms</p>
                </div>
              ) : (
                filteredRecipients.map(r => {
                  const selected = selectedIds.has(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRecipient(r.id)}
                      className={`w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors ${
                        selected ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        selected ? 'bg-[#CE1126] border-[#CE1126]' : 'border-slate-300'
                      }`}>
                        {selected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{r.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {channel === 'sms'
                            ? (r.phone || 'No phone')
                            : (r.email || 'No email')}
                          {r.zone ? ` • ${r.zone}` : ''}
                        </p>
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                        {r.role}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Composer */}
          <div className="space-y-4">
            {/* Channel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {channel === 'sms' ? <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" />SMS</span> : <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" />In-App</span>}
                </button>

                <AnimatePresence>
                  {showPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      {(['sms', 'in-app'] as ComposeChannel[]).map(ch => (
                        <button
                          key={ch}
                          onClick={() => { setChannel(ch); setShowPicker(false); }}
                          className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${
                            channel === ch ? 'border-transparent text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          style={channel === ch ? { backgroundColor: ACCENT } : undefined}
                        >
                          {ch === 'sms' ? <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" />SMS</span> : <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" />In-App</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Selected</p>
                <p className="text-sm font-black text-slate-900">{selectedIds.size}</p>
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {sendResult && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-3 rounded-2xl border flex items-center gap-2 ${
                    sendResult.type === 'success'
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      : 'bg-red-50 border-red-100 text-red-700'
                  }`}
                >
                  {sendResult.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <p className="text-sm font-bold">{sendResult.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message box */}
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
                  <div className="flex items-center gap-2">
                    {senderIds.length > 0 ? (
                      <select
                        value={senderName}
                        onChange={e => setSenderName(e.target.value)}
                        disabled={senderIdsLoading}
                        className="text-[13px] font-black text-slate-900 bg-transparent outline-none"
                        aria-label="SMS Sender ID"
                      >
                        {senderIds.map(s => (
                          <option key={s.id} value={s.name}>{s.name}{s.is_default ? ' (Default)' : ''}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[13px] font-black text-slate-900">{senderName}</span>
                    )}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Send */}
            <button onClick={handleSend} disabled={sending || selectedIds.size === 0 || !messageContent.trim() || isOverCharLimit} className="w-full py-4 rounded-2xl text-[15px] font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2" style={{ backgroundColor: ACCENT }}>
              {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {sending ? 'Sending...' : `Send ${channel === 'sms' ? 'SMS' : 'Message'} to ${selectedIds.size} Recipient${selectedIds.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* =============== HISTORY =============== */}
      {/* (rest of file unchanged) */}
      {/* NOTE: Keep your existing remainder of AdminCommHub.tsx below this point exactly as it currently is in your project. */}
    </motion.div>
  );
}
