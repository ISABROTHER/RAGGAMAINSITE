import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, ArrowUpRight, Download,
  Filter, CreditCard, Smartphone, BarChart3, Clock
} from 'lucide-react';

interface Contribution {
  id: string;
  project_id: string;
  donor_first_name: string;
  donor_last_name: string;
  donor_contact: string;
  amount_ghs: number;
  units_contributed: number;
  payment_reference: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
}

interface AdminFinancialsProps {
  contributions: Contribution[];
  projects: Project[];
}

type Period = '7d' | '30d' | '90d' | 'all';

export function AdminFinancials({ contributions, projects }: AdminFinancialsProps) {
  const [period, setPeriod] = useState<Period>('30d');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p.title])), [projects]);

  const filteredByPeriod = useMemo(() => {
    const now = Date.now();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : Infinity;
    const cutoff = now - days * 86400000;
    return contributions.filter(c => new Date(c.created_at).getTime() > cutoff);
  }, [contributions, period]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return filteredByPeriod;
    return filteredByPeriod.filter(c => c.status === statusFilter);
  }, [filteredByPeriod, statusFilter]);

  const completed = filtered.filter(c => c.status === 'completed');
  const totalRaised = completed.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const pending = filtered.filter(c => c.status === 'pending');
  const failed = filtered.filter(c => c.status === 'failed');
  const avgDonation = completed.length > 0 ? totalRaised / completed.length : 0;

  const byProject = useMemo(() => {
    const map = new Map<string, number>();
    completed.forEach(c => map.set(c.project_id, (map.get(c.project_id) || 0) + Number(c.amount_ghs)));
    return Array.from(map.entries())
      .map(([pid, total]) => ({ pid, title: projectMap.get(pid) || 'Unknown', total }))
      .sort((a, b) => b.total - a.total);
  }, [completed, projectMap]);

  const byMethod = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    completed.forEach(c => {
      const m = c.payment_method || 'Unknown';
      const prev = map.get(m) || { count: 0, total: 0 };
      map.set(m, { count: prev.count + 1, total: prev.total + Number(c.amount_ghs) });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [completed]);

  const formatGHS = (n: number) => `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const exportCSV = () => {
    const headers = 'Date,Donor,Contact,Amount (GHS),Method,Status,Project,Reference\n';
    const rows = filtered.map(c =>
      `${formatDate(c.created_at)},"${c.donor_first_name} ${c.donor_last_name}",${c.donor_contact},${c.amount_ghs},${c.payment_method},${c.status},"${projectMap.get(c.project_id) || ''}",${c.payment_reference}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Management</h2>
          <p className="text-slate-500 mt-1 font-medium">Donation tracking and analytics</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors">
          <Download className="w-4 h-4" />Export CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
          {(['7d', '30d', '90d', 'all'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === p ? 'bg-[#CE1126] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {['all', 'completed', 'pending', 'failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize ${statusFilter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
        {[
          { label: 'Total Raised', value: formatGHS(totalRaised), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Donation', value: formatGHS(avgDonation), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: pending.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Transactions', value: completed.length.toString(), icon: CreditCard, color: 'text-teal-600', bg: 'bg-teal-50' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xl md:text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-slate-900">By Project</h3>
          </div>
          {byProject.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-4">No data</p>
          ) : (
            <div className="space-y-3">
              {byProject.map(p => {
                const maxTotal = byProject[0]?.total || 1;
                return (
                  <div key={p.pid}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[60%]">{p.title}</span>
                      <span className="text-xs font-bold text-slate-900">{formatGHS(p.total)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(p.total / maxTotal) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">By Payment Method</h3>
          </div>
          {byMethod.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-4">No data</p>
          ) : (
            <div className="space-y-3">
              {byMethod.map(([method, data]) => (
                <div key={method} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    {method === 'MOMO' ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900">{method}</p>
                    <p className="text-[10px] text-slate-400">{data.count} transactions</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{formatGHS(data.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="p-4 font-bold">Donor</th>
                <th className="p-4 font-bold hidden sm:table-cell">Project</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold hidden md:table-cell">Method</th>
                <th className="p-4 font-bold hidden md:table-cell">Date</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 text-sm">No transactions found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-900">{c.donor_first_name} {c.donor_last_name}</p>
                    <p className="text-[10px] text-slate-400">{c.donor_contact}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600 hidden sm:table-cell truncate max-w-[160px]">{projectMap.get(c.project_id) || '-'}</td>
                  <td className="p-4 text-sm font-bold text-slate-900">{formatGHS(Number(c.amount_ghs))}</td>
                  <td className="p-4 hidden md:table-cell"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{c.payment_method}</span></td>
                  <td className="p-4 text-xs text-slate-500 hidden md:table-cell">{formatDate(c.created_at)}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'completed' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
