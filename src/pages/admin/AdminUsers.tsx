import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, ShieldCheck, UserCheck, Search,
  ToggleLeft, ToggleRight, ChevronDown, X, Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  role: string;
  zone: string | null;
  is_active: boolean;
  created_at: string;
}

interface AdminUsersProps {
  users: Profile[];
  onRefresh: () => void;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700', icon: ShieldCheck },
  assemblyman: { label: 'Assemblyman', color: 'bg-blue-100 text-blue-700', icon: UserCheck },
  constituent: { label: 'Constituent', color: 'bg-green-100 text-green-700', icon: Users },
};

export function AdminUsers({ users, onRefresh }: AdminUsersProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editRole, setEditRole] = useState('');

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !search || (
        (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search)
      );
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.is_active : !u.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const toggleActive = async (u: Profile) => {
    await supabase.from('profiles').update({ is_active: !u.is_active }).eq('id', u.id);
    onRefresh();
  };

  const changeRole = async () => {
    if (!editingUser || !editRole) return;
    await supabase.from('profiles').update({ role: editRole }).eq('id', editingUser.id);
    setEditingUser(null);
    onRefresh();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h2>
        <p className="text-slate-500 mt-1 font-medium">{users.length} registered users</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
          const count = users.filter(u => u.role === key).length;
          const Icon = cfg.icon;
          return (
            <button key={key} onClick={() => setRoleFilter(roleFilter === key ? 'all' : key)} className={`bg-white p-4 rounded-2xl border text-center transition-all ${roleFilter === key ? 'border-slate-400 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
              <Icon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              <p className="text-xl font-black text-slate-900">{count}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{cfg.label}s</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300"
          />
        </div>
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize ${statusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Change Role</h3>
                <button onClick={() => setEditingUser(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <p className="text-sm text-slate-600 mb-4">Changing role for <span className="font-bold">{editingUser.full_name}</span></p>
              <select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-300 mb-4">
                {Object.entries(ROLE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={changeRole} className="flex-1 py-2.5 bg-[#CE1126] text-white font-bold text-sm rounded-lg">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-sm">No users match your filters</td></tr>
              ) : filtered.map(u => {
                const cfg = ROLE_CONFIG[u.role] || ROLE_CONFIG.constituent;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                          {(u.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{u.full_name || 'Unknown'}</p>
                          <p className="text-[10px] text-slate-400 sm:hidden">{u.email || u.phone || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <p className="text-sm text-slate-600 truncate">{u.email || '-'}</p>
                      {u.phone && <p className="text-[10px] text-slate-400">{u.phone}</p>}
                    </td>
                    <td className="p-4">
                      <button onClick={() => { setEditingUser(u); setEditRole(u.role); }} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color} hover:opacity-80 transition-opacity flex items-center gap-1`}>
                        {cfg.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="p-4 hidden md:table-cell text-xs text-slate-500">{formatDate(u.created_at)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => toggleActive(u)} className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title={u.is_active ? 'Deactivate' : 'Activate'}>
                        {u.is_active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
