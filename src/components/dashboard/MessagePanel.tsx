import { useState, useEffect, useCallback } from 'react';
import { Send, Inbox, Mail, MailOpen, ChevronLeft, Loader2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
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

interface ComposeData {
  recipientId: string;
  recipientName: string;
  subject: string;
  body: string;
}

export function MessagePanel() {
  const { user } = useAuth();
  const [view, setView] = useState<'inbox' | 'compose' | 'detail'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ id: string; full_name: string; role: string }[]>([]);
  const [compose, setCompose] = useState<ComposeData>({ recipientId: '', recipientName: '', subject: '', body: '' });
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (data) {
      const senderIds = [...new Set(data.map(m => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);

      const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
      setMessages(data.map(m => ({ ...m, sender_name: nameMap.get(m.sender_id) || 'Unknown' })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=eq.${user.id}` }, () => {
        fetchMessages();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, fetchMessages]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, role').neq('id', user?.id || '');
    if (data) setUsers(data);
  };

  const openCompose = () => {
    fetchUsers();
    setCompose({ recipientId: '', recipientName: '', subject: '', body: '' });
    setView('compose');
  };

  const openMessage = async (msg: Message) => {
    setSelectedMsg(msg);
    setView('detail');
    if (!msg.is_read && msg.recipient_id === user?.id) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const handleSend = async () => {
    if (!user || !compose.recipientId || !compose.body.trim()) return;
    setSending(true);
    await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: compose.recipientId,
      subject: compose.subject || '(No Subject)',
      body: compose.body,
      message_type: 'direct',
    });
    setSending(false);
    fetchMessages();
    setView('inbox');
  };

  const unreadCount = messages.filter(m => !m.is_read && m.recipient_id === user?.id).length;
  const inboxMessages = messages.filter(m => m.recipient_id === user?.id);
  const sentMessages = messages.filter(m => m.sender_id === user?.id && m.recipient_id !== user?.id);

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-[500px] flex flex-col">
      <AnimatePresence mode="wait">
        {view === 'inbox' && (
          <motion.div key="inbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-900">Messages</h3>
                {unreadCount > 0 && (
                  <span className="bg-[#CE1126] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unreadCount}</span>
                )}
              </div>
              <button onClick={openCompose} className="flex items-center gap-1.5 text-sm font-semibold text-[#CE1126] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                <Send className="w-3.5 h-3.5" />
                New
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 text-slate-300 animate-spin" /></div>
              ) : inboxMessages.length === 0 && sentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Mail className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No messages yet</p>
                </div>
              ) : (
                <div>
                  {inboxMessages.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">Inbox</p>
                      {inboxMessages.map(msg => (
                        <button
                          key={msg.id}
                          onClick={() => openMessage(msg)}
                          className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!msg.is_read ? 'bg-blue-50/40' : ''}`}
                        >
                          <div className="mt-1.5">{msg.is_read ? <MailOpen className="w-4 h-4 text-slate-300" /> : <Circle className="w-3 h-3 text-[#CE1126] fill-current" />}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm truncate ${msg.is_read ? 'text-slate-600' : 'text-slate-900 font-bold'}`}>{msg.sender_name}</p>
                              <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(msg.created_at)}</span>
                            </div>
                            <p className={`text-xs truncate mt-0.5 ${msg.is_read ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>{msg.subject}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {sentMessages.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">Sent</p>
                      {sentMessages.map(msg => (
                        <button key={msg.id} onClick={() => openMessage(msg)} className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-slate-500 truncate">To: {msg.recipient_id?.slice(0, 8)}...</p>
                            <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(msg.created_at)}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{msg.subject}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {view === 'compose' && (
          <motion.div key="compose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-4 border-b border-slate-100">
              <button onClick={() => setView('inbox')} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
              <h3 className="font-bold text-slate-900">New Message</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">To</label>
                <select
                  value={compose.recipientId}
                  onChange={e => setCompose(p => ({ ...p, recipientId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300"
                >
                  <option value="">Select recipient...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  value={compose.subject}
                  onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Message subject..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  value={compose.body}
                  onChange={e => setCompose(p => ({ ...p, body: e.target.value }))}
                  placeholder="Type your message..."
                  rows={6}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleSend}
                disabled={sending || !compose.recipientId || !compose.body.trim()}
                className="w-full py-3 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </div>
          </motion.div>
        )}

        {view === 'detail' && selectedMsg && (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-4 border-b border-slate-100">
              <button onClick={() => { setView('inbox'); setSelectedMsg(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
              <h3 className="font-bold text-slate-900 truncate flex-1">{selectedMsg.subject}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedMsg.sender_name}</p>
                  <p className="text-[11px] text-slate-400">{new Date(selectedMsg.created_at).toLocaleString()}</p>
                </div>
                {selectedMsg.priority === 'urgent' && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">URGENT</span>
                )}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedMsg.body}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
