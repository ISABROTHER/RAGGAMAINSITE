import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Bell, Database, Shield, Save, Loader2, CheckCircle2, MessageSquare, Plus, Star, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SettingSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SettingSection[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'communications', label: 'Communications', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Storage', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
];

type SmsSenderIdRow = {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export function AdminSettings() {
  const [section, setSection] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [siteName, setSiteName] = useState('Cape Coast North Constituency');
  const [siteDesc, setSiteDesc] = useState('Official constituency engagement portal');
  const [contactEmail, setContactEmail] = useState('info@ccnorth.gov.gh');
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyDonation, setNotifyDonation] = useState(true);
  const [notifyIssue, setNotifyIssue] = useState(true);
  const [emailDigest, setEmailDigest] = useState('daily');

  // SMS Sender IDs
  const [senderIds, setSenderIds] = useState<SmsSenderIdRow[]>([]);
  const [senderIdsLoading, setSenderIdsLoading] = useState(false);
  const [senderIdsError, setSenderIdsError] = useState<string | null>(null);
  const [newSenderIdName, setNewSenderIdName] = useState('');
  const [senderIdsSaving, setSenderIdsSaving] = useState(false);

  const canAddSenderId = useMemo(() => {
    const trimmed = newSenderIdName.trim();
    if (!trimmed) return false;
    return !senderIds.some(s => s.name.toLowerCase() === trimmed.toLowerCase());
  }, [newSenderIdName, senderIds]);

  const loadSenderIds = useCallback(async () => {
    setSenderIdsLoading(true);
    setSenderIdsError(null);
    const { data, error } = await supabase
      .from('sms_sender_ids')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      setSenderIdsError(error.message);
      setSenderIds([]);
      setSenderIdsLoading(false);
      return;
    }

    setSenderIds((data || []) as SmsSenderIdRow[]);
    setSenderIdsLoading(false);
  }, []);

  useEffect(() => {
    // Load sender IDs once (and whenever Supabase changes are made here)
    loadSenderIds();
  }, [loadSenderIds]);

  const addSenderId = async () => {
    const name = newSenderIdName.trim();
    if (!name) return;
    if (!canAddSenderId) return;

    setSenderIdsSaving(true);
    setSenderIdsError(null);

    // If this is the first sender ID, make it default.
    const makeDefault = senderIds.length === 0;
    const { error } = await supabase
      .from('sms_sender_ids')
      .insert({ name, is_default: makeDefault });

    if (error) {
      setSenderIdsError(error.message);
      setSenderIdsSaving(false);
      return;
    }

    setNewSenderIdName('');
    await loadSenderIds();
    setSenderIdsSaving(false);
  };

  const setDefaultSenderId = async (id: string) => {
    setSenderIdsSaving(true);
    setSenderIdsError(null);

    // Clear all defaults, then set the chosen one.
    const { error: clearErr } = await supabase
      .from('sms_sender_ids')
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq('is_default', true);

    if (clearErr) {
      setSenderIdsError(clearErr.message);
      setSenderIdsSaving(false);
      return;
    }

    const { error: setErr } = await supabase
      .from('sms_sender_ids')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (setErr) {
      setSenderIdsError(setErr.message);
      setSenderIdsSaving(false);
      return;
    }

    await loadSenderIds();
    setSenderIdsSaving(false);
  };

  const deleteSenderId = async (id: string) => {
    const isDefault = senderIds.find(s => s.id === id)?.is_default;
    setSenderIdsSaving(true);
    setSenderIdsError(null);

    const { error } = await supabase.from('sms_sender_ids').delete().eq('id', id);
    if (error) {
      setSenderIdsError(error.message);
      setSenderIdsSaving(false);
      return;
    }

    await loadSenderIds();

    // If they deleted the default and there are remaining IDs, pick the first alphabetically.
    if (isDefault) {
      const refreshed = await supabase
        .from('sms_sender_ids')
        .select('*')
        .order('name', { ascending: true })
        .limit(1);
      const next = (refreshed.data?.[0] as SmsSenderIdRow | undefined);
      if (next) await setDefaultSenderId(next.id);
    }

    setSenderIdsSaving(false);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
          <p className="text-slate-500 mt-1 font-medium">System configuration and preferences</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    section === s.id ? 'bg-[#CE1126] text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />{s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          {section === 'general' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Globe className="w-5 h-5 text-slate-400" />General Settings</h3>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Site Name</label>
                <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Site Description</label>
                <textarea value={siteDesc} onChange={e => setSiteDesc(e.target.value)} rows={2} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contact Email</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300" />
              </div>
            </div>
          )}

          {section === 'communications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-slate-400" />Communications</h3>
                  <p className="text-slate-500 mt-1 text-sm font-medium">Manage SMS sender IDs used in the Communication Hub.</p>
                </div>
                <button
                  type="button"
                  onClick={loadSenderIds}
                  disabled={senderIdsLoading || senderIdsSaving}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {senderIdsError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Could not load/save sender IDs</p>
                    <p className="text-xs font-medium mt-0.5">{senderIdsError}</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Add Sender ID</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={newSenderIdName}
                    onChange={e => setNewSenderIdName(e.target.value)}
                    placeholder="e.g., Hon. Ragga"
                    className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={addSenderId}
                    disabled={!canAddSenderId || senderIdsSaving}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
                  >
                    {senderIdsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add
                  </button>
                </div>
                {!canAddSenderId && newSenderIdName.trim() && (
                  <p className="text-xs font-semibold text-slate-500">That sender ID already exists.</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sender IDs</p>
                  {senderIdsLoading && <span className="text-xs font-semibold text-slate-400 flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading</span>}
                </div>

                {(!senderIdsLoading && senderIds.length === 0) && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <p className="text-sm font-semibold text-slate-700">No sender IDs found.</p>
                    <p className="text-xs text-slate-500 mt-1">Add one above. Recommended default: <span className="font-bold">Hon. Ragga</span>.</p>
                  </div>
                )}

                {senderIds.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                        {s.is_default && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Default</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">Used as the SMS sender name in the Communication Hub.</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDefaultSenderId(s.id)}
                        disabled={senderIdsSaving || s.is_default}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold border transition-colors disabled:opacity-50 ${
                          s.is_default ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${s.is_default ? 'fill-current' : ''}`} />
                        Default
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSenderId(s.id)}
                        disabled={senderIdsSaving}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Bell className="w-5 h-5 text-slate-400" />Notification Preferences</h3>
              {[
                { label: 'New user registrations', checked: notifyNewUser, onChange: setNotifyNewUser },
                { label: 'New donations received', checked: notifyDonation, onChange: setNotifyDonation },
                { label: 'New issues reported', checked: notifyIssue, onChange: setNotifyIssue },
              ].map(item => (
                <label key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <input type="checkbox" checked={item.checked} onChange={e => item.onChange(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-[#CE1126] focus:ring-[#CE1126]" />
                </label>
              ))}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Digest Frequency</label>
                <select value={emailDigest} onChange={e => setEmailDigest(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300">
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          )}

          {section === 'data' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Database className="w-5 h-5 text-slate-400" />Data & Storage</h3>
              <div className="space-y-3">
                {[
                  { label: 'Database Provider', value: 'Supabase (PostgreSQL)' },
                  { label: 'Storage', value: 'Supabase Storage' },
                  { label: 'Authentication', value: 'Supabase Auth' },
                  { label: 'Real-time', value: 'Supabase Realtime (WebSocket)' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">Data is automatically backed up by Supabase. Point-in-time recovery is available on Pro plans.</p>
            </div>
          )}

          {section === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Shield className="w-5 h-5 text-slate-400" />Security Settings</h3>
              <div className="space-y-3">
                {[
                  { label: 'Row Level Security (RLS)', value: 'Enabled on all tables', status: true },
                  { label: 'Authentication', value: 'Email/Password', status: true },
                  { label: 'Role-Based Access', value: '3 roles configured', status: true },
                  { label: 'Audit Logging', value: 'Active', status: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                      <p className="text-[10px] text-slate-400">{item.value}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
