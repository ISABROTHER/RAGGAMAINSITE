import { useState, useEffect, useMemo } from 'react';
import {
  Users, UserCheck, TrendingUp, MapPin, Search, Phone,
  Mail, Filter, Clock, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface Constituent {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  zone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function AdminConstituents() {
  const [constituents, setConstituents] = useState<Constituent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, zone, avatar_url, is_active, created_at')
        .eq('role', 'constituent')
        .order('created_at', { ascending: false });
      if (data) setConstituents(data);
      setLoading(false);
    };
    load();
  }, []);

  const zones = useMemo(() => {
    const set = new Set<string>();
    constituents.forEach(c => { if (c.zone) set.add(c.zone); });
    return Array.from(set).sort();
  }, [constituents]);

  const filtered = useMemo(() => {
    return constituents.filter(c => {
      const q = search.toLowerCase();
      const matchesSearch = !search || (
        (c.full_name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(search) ||
        (c.zone || '').toLowerCase().includes(q)
      );
      const matchesZone = zoneFilter === 'all' || c.zone === zoneFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.is_active : !c.is_active);
      return matchesSearch && matchesZone && matchesStatus;
    });
  }, [constituents, search, zoneFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: constituents.length,
    active: constituents.filter(c => c.is_active).length,
    zones: new Set(constituents.filter(c => c.zone).map(c => c.zone)).size,
    recentWeek: constituents.filter(c => {
      return (Date.now() - new Date(c.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length,
  }), [constituents]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const getInitial = (name: string) => (name || 'U').charAt(0).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Constituents</h2>
        <p className="text-slate-500 mt-1 font-medium">
          {constituents.length} registered constituent{constituents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Total Constituents</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.active}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Active</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.zones}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Zones Covered</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.recentWeek}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">New This Week</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or zone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={zoneFilter}
              onChange={e => setZoneFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-slate-300 cursor-pointer"
            >
              <option value="all">All Zones</option>
              {zones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-0.5 bg-white rounded-xl border border-slate-200 p-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            {['all', 'active', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize ${
                  statusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
        {(search || zoneFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setZoneFilter('all'); setStatusFilter('all'); }}
            className="text-xs font-bold text-[#CE1126] hover:text-red-700 underline underline-offset-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#CE1126] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading constituents...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p className="font-bold text-slate-400">No constituents found</p>
          <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map(c => {
              const isOpen = expandedId === c.id;
              return (
                <motion.div key={c.id} layout className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : c.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                      {c.avatar_url ? (
                        <img src={c.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        getInitial(c.full_name)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{c.full_name || 'Unknown'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {c.zone && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            {c.zone}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          c.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3">
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#CE1126] transition-colors">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{c.email}</span>
                            </a>
                          )}
                          {c.phone && (
                            <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#CE1126] transition-colors">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{c.phone}</span>
                            </a>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>Joined {formatDate(c.created_at)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="p-4 font-bold">Constituent</th>
                    <th className="p-4 font-bold">Contact</th>
                    <th className="p-4 font-bold">Zone</th>
                    <th className="p-4 font-bold">Joined</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                            {c.avatar_url ? (
                              <img src={c.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                              getInitial(c.full_name)
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-900 truncate">{c.full_name || 'Unknown'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#CE1126] transition-colors">
                              <Mail className="w-3 h-3 text-slate-300" />
                              <span className="truncate max-w-[180px]">{c.email}</span>
                            </a>
                          )}
                          {c.phone && (
                            <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#CE1126] transition-colors">
                              <Phone className="w-3 h-3 text-slate-300" />
                              <span>{c.phone}</span>
                            </a>
                          )}
                          {!c.email && !c.phone && <span className="text-xs text-slate-300">—</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        {c.zone ? (
                          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                            {c.zone}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">Not set</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-500">{formatDate(c.created_at)}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#CE1126] hover:bg-red-50 transition-colors"
                              title="Call"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {c.email && (
                            <a
                              href={`mailto:${c.email}`}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#CE1126] hover:bg-red-50 transition-colors"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}