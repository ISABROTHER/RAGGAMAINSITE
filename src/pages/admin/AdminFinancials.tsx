import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, Users, CreditCard, Smartphone,
  Download, ArrowUpRight, ArrowDownRight, ChevronRight,
  ArrowLeft, ShieldCheck, Copy, CheckCircle2, AlertTriangle,
  Zap, Target, Sparkles, Clock, Hash, Eye, Award
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
  slug: string;
  description: string;
  category: string;
  image_url: string | null;
  target_units: number;
  unit_label: string;
  unit_price_ghs: number;
  is_active: boolean;
  is_featured: boolean;
}

interface AdminFinancialsProps {
  contributions: Contribution[];
  projects: Project[];
}

type Period = '7d' | '30d' | '90d' | 'all';

// Mini donut SVG
function MiniDonut({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <circle
        cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 24 24)"
        className="transition-all duration-700"
      />
      <text x="24" y="26" textAnchor="middle" className="text-[9px] font-bold fill-slate-700">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

// Bar chart SVG
function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data, 1);
  const barW = 28;
  const gap = 12;
  const h = 160;
  const w = data.length * (barW + gap);
  const ySteps = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <svg width={Math.max(w + 40, 300)} height={h + 40} className="block">
        {/* Y axis labels */}
        {ySteps.map(s => {
          const y = h - h * s + 10;
          return (
            <g key={s}>
              <line x1="38" y1={y} x2={w + 40} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
              <text x="34" y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400">
                {Math.round(max * s / 1000)}k
              </text>
            </g>
          );
        })}
        {/* Bars */}
        {data.map((val, i) => {
          const barH = max > 0 ? (val / max) * h : 0;
          const x = 42 + i * (barW + gap);
          const y = h - barH + 10;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx="4" fill="#CE1126" opacity="0.85" className="hover:opacity-100 transition-opacity" />
              <text x={x + barW / 2} y={h + 24} textAnchor="middle" className="text-[9px] fill-slate-400">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function AdminFinancials({ contributions, projects }: AdminFinancialsProps) {
  const [period, setPeriod] = useState<Period>('30d');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const verified = useMemo(() =>
    contributions.filter(c => c.status === 'completed' && c.payment_reference), [contributions]
  );
  const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

  const filteredByPeriod = useMemo(() => {
    const now = Date.now();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : Infinity;
    return verified.filter(c => (now - new Date(c.created_at).getTime()) < days * 86400000);
  }, [verified, period]);

  const prevPeriod = useMemo(() => {
    const now = Date.now();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : Infinity;
    if (days === Infinity) return [];
    return verified.filter(c => {
      const t = now - new Date(c.created_at).getTime();
      return t >= days * 86400000 && t < days * 2 * 86400000;
    });
  }, [verified, period]);

  const totalRaised = filteredByPeriod.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const prevRaised = prevPeriod.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const raisedPct = prevRaised > 0 ? ((totalRaised - prevRaised) / prevRaised) * 100 : 0;

  const uniqueDonors = useMemo(() => new Set(filteredByPeriod.map(c => c.donor_contact)).size, [filteredByPeriod]);
  const prevDonors = useMemo(() => new Set(prevPeriod.map(c => c.donor_contact)).size, [prevPeriod]);
  const donorsPct = prevDonors > 0 ? ((uniqueDonors - prevDonors) / prevDonors) * 100 : 0;

  const avgDonation = filteredByPeriod.length > 0 ? totalRaised / filteredByPeriod.length : 0;
  const prevAvg = prevPeriod.length > 0 ? prevPeriod.reduce((s, c) => s + Number(c.amount_ghs), 0) / prevPeriod.length : 0;
  const avgPct = prevAvg > 0 ? ((avgDonation - prevAvg) / prevAvg) * 100 : 0;

  const pendingCount = contributions.filter(c => c.status === 'pending').length;

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const months: number[] = new Array(12).fill(0);
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    verified.forEach(c => {
      const m = new Date(c.created_at).getMonth();
      months[m] += Number(c.amount_ghs);
    });
    const currentMonth = new Date().getMonth();
    const startMonth = Math.max(0, currentMonth - 8);
    return {
      data: months.slice(startMonth, currentMonth + 1),
      labels: labels.slice(startMonth, currentMonth + 1),
    };
  }, [verified]);

  // By project
  const byProject = useMemo(() => {
    const map = new Map<string, { total: number; count: number; donors: Set<string> }>();
    filteredByPeriod.forEach(c => {
      const prev = map.get(c.project_id) || { total: 0, count: 0, donors: new Set<string>() };
      prev.total += Number(c.amount_ghs);
      prev.count += 1;
      prev.donors.add(c.donor_contact);
      map.set(c.project_id, prev);
    });
    return Array.from(map.entries()).map(([pid, d]) => {
      const proj = projectMap.get(pid);
      const targetGHS = proj ? proj.target_units * proj.unit_price_ghs : 0;
      return {
        pid, title: proj?.title || 'Unknown', project: proj,
        total: d.total, count: d.count, donors: d.donors.size,
        targetGHS, progress: targetGHS > 0 ? Math.min((d.total / targetGHS) * 100, 100) : 0,
      };
    }).sort((a, b) => b.total - a.total);
  }, [filteredByPeriod, projectMap]);

  // AI Insights
  const insights = useMemo(() => {
    const r: { icon: React.ElementType; color: string; bg: string; text: string }[] = [];
    if (byProject.length > 0) r.push({ icon: Award, color: 'text-green-600', bg: 'bg-green-50', text: `${byProject[0].title} leads with GHS ${byProject[0].total.toLocaleString()} from ${byProject[0].count} donations.` });
    if (raisedPct > 20) r.push({ icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', text: `Revenue up ${raisedPct.toFixed(0)}% — strong momentum. Consider a matching campaign.` });
    else if (raisedPct < -15) r.push({ icon: ArrowDownRight, color: 'text-red-500', bg: 'bg-red-50', text: `Revenue dropped ${Math.abs(raisedPct).toFixed(0)}%. Re-engage donors with outreach.` });
    const donorCounts = new Map<string, number>();
    filteredByPeriod.forEach(c => donorCounts.set(c.donor_contact, (donorCounts.get(c.donor_contact) || 0) + 1));
    const repeats = Array.from(donorCounts.values()).filter(v => v > 1).length;
    if (repeats > 0) r.push({ icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', text: `${repeats} repeat donor${repeats > 1 ? 's' : ''} — loyalty growing. Send thank-you messages.` });
    byProject.forEach(p => { if (p.progress >= 75 && p.progress < 100) r.push({ icon: Target, color: 'text-amber-600', bg: 'bg-amber-50', text: `${p.title} at ${p.progress.toFixed(0)}% — a push could close it.` }); });
    return r.slice(0, 4);
  }, [byProject, raisedPct, filteredByPeriod]);

  const fmtGHS = (n: number) => `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const copyRef = useCallback((ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  }, []);

  const exportCSV = () => {
    const h = 'Date,Donor,Contact,Amount,Method,Project,Paystack Ref\n';
    const rows = filteredByPeriod.map(c => `${fmtDate(c.created_at)},"${c.donor_first_name} ${c.donor_last_name}",${c.donor_contact},${c.amount_ghs},${c.payment_method},"${projectMap.get(c.project_id)?.title || ''}",${c.payment_reference}`).join('\n');
    const blob = new Blob([h + rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `donations-${period}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const ChangeBadge = ({ val }: { val: number }) => {
    if (val === 0) return null;
    const up = val > 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(val).toFixed(0)}% vs last period
      </span>
    );
  };

  // Project detail
  const selProject = selectedProjectId ? projectMap.get(selectedProjectId) : null;
  const projContribs = useMemo(() =>
    selectedProjectId ? filteredByPeriod.filter(c => c.project_id === selectedProjectId) : [],
    [selectedProjectId, filteredByPeriod]
  );
  const projTotal = projContribs.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const projDonors = new Set(projContribs.map(c => c.donor_contact)).size;
  const projTarget = selProject ? selProject.target_units * selProject.unit_price_ghs : 0;
  const projProg = projTarget > 0 ? Math.min((projTotal / projTarget) * 100, 100) : 0;

  // ====================== PROJECT DETAIL VIEW ======================
  if (showProjectDetail && selProject) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <button onClick={() => { setShowProjectDetail(false); setSelectedProjectId(null); }} className="flex items-center gap-1.5 text-slate-500 hover:text-[#CE1126] text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Donations
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-start gap-3 mb-4">
            {selProject.image_url && <img src={selProject.image_url} alt="" className="w-14 h-14 rounded-xl object-cover" />}
            <div>
              <h2 className="text-lg font-black text-slate-900">{selProject.title}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selProject.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {selProject.is_active ? 'Active' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700">{fmtGHS(projTotal)}</span>
              <span className="text-slate-400">{projTarget > 0 ? `${fmtGHS(projTarget)} target` : 'No target'}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${projProg}%` }} transition={{ duration: 0.8 }}
                className="h-full rounded-full" style={{ backgroundColor: projProg >= 100 ? '#006B3F' : '#CE1126' }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{projProg.toFixed(1)}% • {projContribs.length} donations • {projDonors} donors</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Donations', value: projContribs.length },
              { label: 'Donors', value: projDonors },
              { label: 'Average', value: projContribs.length > 0 ? fmtGHS(projTotal / projContribs.length) : '-' },
            ].map(s => (
              <div key={s.label} className="bg-[#f0f2f5] rounded-xl p-3 text-center">
                <p className="text-lg font-black text-slate-900">{s.value}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Donation History</h3>
            <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold"><ShieldCheck className="w-3 h-3" />Verified</span>
          </div>
          <div className="divide-y divide-slate-50">
            {projContribs.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">No verified donations</div>
            ) : projContribs.map(c => {
              const anon = c.donor_first_name.toLowerCase() === 'anonymous';
              return (
                <div key={c.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900">{anon ? 'Anonymous Donor' : `${c.donor_first_name} ${c.donor_last_name}`}</p>
                      {!anon && <p className="text-[10px] text-slate-400">{c.donor_contact}</p>}
                      <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDate(c.created_at)} {fmtTime(c.created_at)}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium flex items-center gap-1">
                          {c.payment_method === 'MOMO' ? <Smartphone className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}{c.payment_method}
                        </span>
                        <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{c.units_contributed} {selProject.unit_label}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-900">{fmtGHS(Number(c.amount_ghs))}</p>
                      <button onClick={() => copyRef(c.payment_reference)} className="flex items-center gap-1 text-[9px] text-slate-400 hover:text-[#CE1126] mt-1 ml-auto">
                        {copiedRef === c.payment_reference ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        {c.payment_reference.slice(0, 12)}...
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // ====================== OVERVIEW ======================
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />Paystack Verified Only
          </span>
          {pendingCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />{pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-xl border border-slate-200 p-0.5">
            {(['7d', '30d', '90d', 'all'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${period === p ? 'bg-[#CE1126] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                {p === 'all' ? 'All' : p}
              </button>
            ))}
          </div>
          <button onClick={exportCSV} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#CE1126] hover:border-[#CE1126]/30 transition-colors" title="Export CSV">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stat cards — 3 across like reference, stacked 1-col on small mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Raised', sub: `${filteredByPeriod.length} verified payments`, value: fmtGHS(totalRaised), change: raisedPct, color: '#006B3F', donutVal: totalRaised, donutMax: totalRaised + prevRaised || 1 },
          { label: 'Unique Donors', sub: `Avg ${fmtGHS(avgDonation)} each`, value: uniqueDonors.toString(), change: donorsPct, color: '#CE1126', donutVal: uniqueDonors, donutMax: uniqueDonors + prevDonors || 1 },
          { label: 'Avg Donation', sub: `From ${uniqueDonors} donors`, value: fmtGHS(avgDonation), change: avgPct, color: '#FCD116', donutVal: avgDonation, donutMax: avgDonation + prevAvg || 1 },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-500 font-medium">{s.label}</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
              <ChangeBadge val={s.change} />
            </div>
            <MiniDonut value={s.donutVal} max={s.donutMax} color={s.color} />
          </div>
        ))}
      </div>

      {/* Revenue chart + Top projects — side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar chart — 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-slate-900 text-sm">Total Revenue</h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-2xl font-black text-slate-900">{fmtGHS(totalRaised)}</p>
            <ChangeBadge val={raisedPct} />
          </div>
          {monthlyData.data.length > 0 ? (
            <BarChart data={monthlyData.data} labels={monthlyData.labels} />
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-slate-400">No data yet</div>
          )}
        </div>

        {/* Top projects — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Top Projects</h3>
          {byProject.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">No data</div>
          ) : (
            <div className="space-y-3">
              {byProject.slice(0, 6).map(p => (
                <button
                  key={p.pid}
                  onClick={() => { setSelectedProjectId(p.pid); setShowProjectDetail(true); }}
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[55%] group-hover:text-[#CE1126] transition-colors">{p.title}</span>
                    <span className="text-xs font-bold text-slate-900">{p.progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{
                      width: `${Math.max(p.progress, 2)}%`,
                      backgroundColor: p.progress >= 100 ? '#006B3F' : p.progress >= 75 ? '#FCD116' : '#CE1126',
                    }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h3 className="font-bold text-slate-900 text-sm">AI Insights</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {insights.map((ins, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${ins.bg}`}>
                <ins.icon className={`w-4 h-4 shrink-0 mt-0.5 ${ins.color}`} />
                <p className="text-xs text-slate-700 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction table — clean like reference */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Latest Donations</h3>
          <span className="text-[10px] text-slate-400">{filteredByPeriod.length} total</span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-4 py-3 font-bold">Donor</th>
                <th className="px-4 py-3 font-bold">Project</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredByPeriod.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">No verified transactions</td></tr>
              ) : filteredByPeriod.slice(0, 15).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => { setSelectedProjectId(c.project_id); setShowProjectDetail(true); }}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{c.donor_first_name} {c.donor_last_name}</p>
                    <p className="text-[10px] text-slate-400">{c.donor_contact}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate">{projectMap.get(c.project_id)?.title || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Verified
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">{fmtGHS(Number(c.amount_ghs))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-slate-50">
          {filteredByPeriod.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No verified transactions</div>
          ) : filteredByPeriod.slice(0, 15).map(c => (
            <div key={c.id} className="p-3 hover:bg-slate-50/50 transition-colors" onClick={() => { setSelectedProjectId(c.project_id); setShowProjectDetail(true); }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f0f2f5] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-500">{c.donor_first_name.charAt(0)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.donor_first_name} {c.donor_last_name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{projectMap.get(c.project_id)?.title || ''} • {fmtDate(c.created_at)}</p>
                </div>
                <p className="text-sm font-bold text-slate-900 shrink-0">{fmtGHS(Number(c.amount_ghs))}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredByPeriod.length > 15 && (
          <div className="p-3 text-center border-t border-slate-100">
            <span className="text-[10px] text-slate-400">Showing 15 of {filteredByPeriod.length} — Export for full list</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}