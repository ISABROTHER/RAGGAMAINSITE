import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Bell, Database, Shield, Save, Loader2, CheckCircle2 } from 'lucide-react';

interface SettingSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SECTIONS: SettingSection[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Storage', icon: Database },
  { id: 'security', label: 'Security', icon: Shield },
];

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
