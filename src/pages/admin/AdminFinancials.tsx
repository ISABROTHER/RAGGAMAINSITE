import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, Users, CreditCard, Smartphone, BarChart3,
  Download, Filter, ArrowUpRight, ArrowDownRight, ChevronRight,
  ArrowLeft, ShieldCheck, Copy, CheckCircle2, AlertTriangle,
  Zap, Target, Eye, Sparkles, Clock, Hash, Award
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
type View = 'overview' | 'project';

export function AdminFinancials({ contributions, projects }: AdminFinancialsProps) {
  const [period, setPeriod] = useState<Period>('30d');
  const [view, setView] = useState<View>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // ONLY verified/completed Paystack transactions
  const verified = useMemo(() =>
    contributions.filter(c => c.status === 'completed' && c.payment_reference),
    [contributions]
  );

  const projectMap = useMemo(() => new Map(projects.map(p => [p.id, p])), [projects]);

  const filteredByPeriod = useMemo(() => {
    const now = Date.now();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : Infinity;
    const cutoff = now - days * 86400000;
    return verified.filter(c => new Date(c.created_at).getTime() > cutoff);
  }, [verified, period]);

  // Previous period for comparison
  const prevPeriod = useMemo(() => {
    const now = Date.now();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : Infinity;
    if (days === Infinity) return [];
    const cutoff = now - days * 86400000;
    const prevCutoff = now - days * 2 * 86400000;
    return verified.filter(c => {
      const t = new Date(c.created_at).getTime();
      return t > prevCutoff && t <= cutoff;
    });
  }, [verified, period]);

  // Core metrics
  const totalRaised = filteredByPeriod.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const prevRaised = prevPeriod.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const raisedChange = prevRaised > 0 ? ((totalRaised - prevRaised) / prevRaised) * 100 : 0;

  const uniqueDonors = useMemo(() => new Set(filteredByPeriod.map(c => c.donor_contact)).size, [filteredByPeriod]);
  const prevDonors = useMemo(() => new Set(prevPeriod.map(c => c.donor_contact)).size, [prevPeriod]);
  const donorsChange = prevDonors > 0 ? ((uniqueDonors - prevDonors) / prevDonors) * 100 : 0;

  const avgDonation = filteredByPeriod.length > 0 ? totalRaised / filteredByPeriod.length : 0;
  const prevAvg = prevPeriod.length > 0 ? prevPeriod.reduce((s, c) => s + Number(c.amount_ghs), 0) / prevPeriod.length : 0;
  const avgChange = prevAvg > 0 ? ((avgDonation - prevAvg) / prevAvg) * 100 : 0;

  const countChange = prevPeriod.length > 0 ? ((filteredByPeriod.length - prevPeriod.length) / prevPeriod.length) * 100 : 0;

  // By project breakdown
  const byProject = useMemo(() => {
    const map = new Map<string, { total: number; count: number; donors: Set<string> }>();
    filteredByPeriod.forEach(c => {
      const prev = map.get(c.project_id) || { total: 0, count: 0, donors: new Set<string>() };
      prev.total += Number(c.amount_ghs);
      prev.count += 1;
      prev.donors.add(c.donor_contact);
      map.set(c.project_id, prev);
    });
    return Array.from(map.entries()).map(([pid, data]) => {
      const proj = projectMap.get(pid);
      const targetGHS = proj ? proj.target_units * proj.unit_price_ghs : 0;
      return {
        pid,
        title: proj?.title || 'Unknown Project',
        project: proj,
        total: data.total,
        count: data.count,
        donors: data.donors.size,
        targetGHS,
        progress: targetGHS > 0 ? Math.min((data.total / targetGHS) * 100, 100) : 0,
      };
    }).sort((a, b) => b.total - a.total);
  }, [filteredByPeriod, projectMap]);

  // Daily trend for sparkline
  const dailyTrend = useMemo(() => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 60;
    const buckets: number[] = new Array(days).fill(0);
    const now = Date.now();
    filteredByPeriod.forEach(c => {
      const age = Math.floor((now - new Date(c.created_at).getTime()) / 86400000);
      if (age < days) buckets[days - 1 - age] += Number(c.amount_ghs);
    });
    return buckets;
  }, [filteredByPeriod, period]);

  // AI Insights
  const insights = useMemo(() => {
    const result: { icon: React.ElementType; color: string; text: string; type: 'success' | 'warning' | 'info' }[] = [];

    // Top project
    if (byProject.length > 0) {
      const top = byProject[0];
      result.push({
        icon: Award,
        color: 'text-green-600',
        text: `${top.title} is your top earner with GHS ${top.total.toLocaleString()} from ${top.count} donations.`,
        type: 'success',
      });
    }

    // Momentum
    if (raisedChange > 20) {
      result.push({
        icon: TrendingUp,
        color: 'text-green-600',
        text: `Fundraising is up ${raisedChange.toFixed(0)}% — strong momentum. Consider launching a matching campaign.`,
        type: 'success',
      });
    } else if (raisedChange < -15) {
      result.push({
        icon: ArrowDownRight,
        color: 'text-red-500',
        text: `Revenue dropped ${Math.abs(raisedChange).toFixed(0)}% vs last period. Consider outreach to re-engage donors.`,
        type: 'warning',
      });
    }

    // Repeat donors
    const donorCounts = new Map<string, number>();
    filteredByPeriod.forEach(c => donorCounts.set(c.donor_contact, (donorCounts.get(c.donor_contact) || 0) + 1));
    const repeatDonors = Array.from(donorCounts.values()).filter(v => v > 1).length;
    if (repeatDonors > 0) {
      result.push({
        icon: Users,
        color: 'text-blue-600',
        text: `${repeatDonors} repeat donor${repeatDonors > 1 ? 's' : ''} detected — loyalty is building. Consider a thank-you campaign.`,
        type: 'info',
      });
    }

    // Near-target projects
    byProject.forEach(p => {
      if (p.progress >= 75 && p.progress < 100) {
        result.push({
          icon: Target,
          color: 'text-amber-600',
          text: `${p.title} is ${p.progress.toFixed(0)}% funded — a push could close the gap.`,
          type: 'info',
        });
      }
    });

    // Duplicate detection
    const refCounts = new Map<string, number>();
    filteredByPeriod.forEach(c => refCounts.set(c.payment_reference, (refCounts.get(c.payment_reference) || 0) + 1));
    const dupes = Array.from(refCounts.values()).filter(v => v > 1).length;
    if (dupes > 0) {
      result.push({
        icon: AlertTriangle,
        color: 'text-red-500',
        text: `${dupes} duplicate payment reference${dupes > 1 ? 's' : ''} detected — review for potential issues.`,
        type: 'warning',
      });
    }

    // Average donation trend
    if (avgChange > 10) {
      result.push({
        icon: Zap,
        color: 'text-purple-600',
        text: `Average donation increased ${avgChange.toFixed(0)}% — donors are giving more per transaction.`,
        type: 'success',
      });
    }

    return result.slice(0, 4);
  }, [byProject, raisedChange, avgChange, filteredByPeriod]);

  // Pending/failed from all contributions (not just verified)
  const pendingCount = contributions.filter(c => c.status === 'pending').length;
  const failedCount = contributions.filter(c => c.status === 'failed').length;

  const formatGHS = (n: number) => `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const copyRef = useCallback((ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  }, []);

  // Sparkline SVG
  const Sparkline = ({ data, color = '#CE1126' }: { data: number[]; color?: string }) => {
    if (data.length === 0 || data.every(d => d === 0)) return null;
    const max = Math.max(...data, 1);
    const w = 120;
    const h = 32;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
    return (
      <svg width={w} height={h} className="opacity-60">
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      </svg>
    );
  };

  const exportCSV = () => {
    const headers = 'Date,Time,Donor,Contact,Amount (GHS),Method,Project,Paystack Ref,Status\n';
    const rows = filteredByPeriod.map(c =>
      `${formatDate(c.created_at)},${formatTime(c.created_at)},"${c.donor_first_name} ${c.donor_last_name}",${c.donor_contact},${c.amount_ghs},${c.payment_method},"${projectMap.get(c.project_id)?.title || ''}",${c.payment_reference},${c.status}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verified-donations-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Project detail view
  const selectedProject = selectedProjectId ? projectMap.get(selectedProjectId) : null;
  const projectContribs = useMemo(() =>
    selectedProjectId ? filteredByPeriod.filter(c => c.project_id === selectedProjectId) : [],
    [selectedProjectId, filteredByPeriod]
  );
  const projectTotal = projectContribs.reduce((s, c) => s + Number(c.amount_ghs), 0);
  const projectDonors = new Set(projectContribs.map(c => c.donor_contact)).size;
  const projectTarget = selectedProject ? selectedProject.target_units * selectedProject.unit_price_ghs : 0;
  const projectProgress = projectTarget > 0 ? Math.min((projectTotal / projectTarget) * 100, 100) : 0;

  // Change badge
  const ChangeBadge = ({ value }: { value: number }) => {
    if (value === 0) return null;
    const up = value > 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
        {up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
        {Math.abs(value).toFixed(0)}%
      </span>
    );
  };

  // PROJECT DETAIL VIEW
  if (view === 'project' && selectedProject) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {/* Back */}
        <button onClick={() => { setView('overview'); setSelectedProjectId(null); }} className="flex items-center gap-1.5 text-slate-500 hover:text-[#CE1126] text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Donations
        </button>

        {/* Project header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            {selectedProject.image_url && (
              <img src={selectedProject.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black text-slate-900 leading-tight">{selectedProject.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedProject.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {selectedProject.is_active ? 'Active' : 'Closed'}
                </span>
                <span className="text-[10px] text-slate-400">{selectedProject.category}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">{formatGHS(projectTotal)} raised</span>
              <span className="text-xs text-slate-400">{projectTarget > 0 ? `${formatGHS(projectTarget)} target` : 'No target set'}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${projectProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: projectProgress >= 100 ? '#006B3F' : '#CE1126' }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{projectProgress.toFixed(1)}% of target • {projectContribs.length} donations • {projectDonors} donors</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-slate-900">{projectContribs.length}</p>
              <p className="text-[10px] text-slate-500 font-medium">Donations</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-slate-900">{projectDonors}</p>
              <p className="text-[10px] text-slate-500 font-medium">Donors</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-lg font-black text-slate-900">{projectContribs.length > 0 ? formatGHS(projectTotal / projectContribs.length) : 'GHS 0'}</p>
              <p className="text-[10px] text-slate-500 font-medium">Average</p>
            </div>
          </div>
        </div>

        {/* Donation history */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Donation History</h3>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
              <ShieldCheck className="w-3 h-3" />
              Paystack Verified
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {projectContribs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No verified donations yet</div>
            ) : projectContribs.map(c => {
              const isAnon = c.donor_first_name.toLowerCase() === 'anonymous';
              return (
                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-900">
                          {isAnon ? 'Anonymous Donor' : `${c.donor_first_name} ${c.donor_last_name}`}
                        </p>
                        {isAnon && <Eye className="w-3 h-3 text-slate-400" />}
                      </div>
                      {!isAnon && <p className="text-[10px] text-slate-400 mb-1">{c.donor_contact}</p>}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(c.created_at)} {formatTime(c.created_at)}
                        </span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                          {c.payment_method === 'MOMO' ? <Smartphone className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                          {c.payment_method}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {c.units_contributed} {projectMap.get(c.project_id)?.unit_label || 'units'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-slate-900">{formatGHS(Number(c.amount_ghs))}</p>
                      <button
                        onClick={() => copyRef(c.payment_reference)}
                        className="inline-flex items-center gap-1 text-[9px] text-slate-400 hover:text-[#CE1126] mt-1 transition-colors"
                        title="Copy Paystack reference"
                      >
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

  // OVERVIEW
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Donations</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Paystack Verified
            </span>
          </div>
          <p className="text-slate-500 mt-0.5 text-sm">Only verified payments shown</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors">
          <Download className="w-3.5 h-3.5" />Export CSV
        </button>
      </div>

      {/* Period + alerts */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-0.5 bg-white rounded-xl border border-slate-200 p-0.5">
          {(['7d', '30d', '90d', 'all'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === p ? 'bg-[#CE1126] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />{pendingCount} pending
          </span>
        )}
        {failedCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />{failedCount} failed
          </span>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Raised', value: formatGHS(totalRaised), change: raisedChange, icon: DollarSign, color: '#006B3F', sparkData: dailyTrend },
          { label: 'Contributions', value: filteredByPeriod.length.toString(), change: countChange, icon: CreditCard, color: '#CE1126', sparkData: null },
          { label: 'Unique Donors', value: uniqueDonors.toString(), change: donorsChange, icon: Users, color: '#2563eb', sparkData: null },
          { label: 'Avg Donation', value: formatGHS(avgDonation), change: avgChange, icon: TrendingUp, color: '#7c3aed', sparkData: null },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}10`, color: s.color }}>
                <s.icon className="w-[18px] h-[18px]" />
              </div>
              <ChangeBadge value={s.change} />
            </div>
            <p className="text-xl font-black text-slate-900 leading-tight">{s.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-500 font-medium">{s.label}</p>
              {s.sparkData && <Sparkline data={s.sparkData} color={s.color} />}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Insights</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {insights.map((ins, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${
                ins.type === 'warning' ? 'bg-red-50/50' : ins.type === 'success' ? 'bg-green-50/50' : 'bg-blue-50/50'
              }`}>
                <ins.icon className={`w-4 h-4 shrink-0 mt-0.5 ${ins.color}`} />
                <p className="text-xs text-slate-700 leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#CE1126]" />
          <h3 className="font-bold text-slate-900 text-sm">By Project</h3>
          <span className="text-[10px] text-slate-400 ml-auto">{byProject.length} projects</span>
        </div>
        <div className="divide-y divide-slate-50">
          {byProject.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No project donations in this period</div>
          ) : byProject.map(p => (
            <button
              key={p.pid}
              onClick={() => { setSelectedProjectId(p.pid); setView('project'); }}
              className="w-full p-4 hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-[#CE1126] transition-colors">{p.title}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                    <span>{p.count} donations</span>
                    <span>{p.donors} donors</span>
                    {p.project?.is_active ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-slate-400">Closed</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <p className="text-sm font-black text-slate-900">{formatGHS(p.total)}</p>
                    {p.targetGHS > 0 && (
                      <p className="text-[10px] text-slate-400">{p.progress.toFixed(0)}% of target</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#CE1126] transition-colors" />
                </div>
              </div>
              {p.targetGHS > 0 && (
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${p.progress}%`,
                      backgroundColor: p.progress >= 100 ? '#006B3F' : p.progress >= 75 ? '#FCD116' : '#CE1126',
                    }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Recent Verified Transactions</h3>
          <span className="text-[10px] text-slate-400">{filteredByPeriod.length} total</span>
        </div>
        <div className="divide-y divide-slate-50">
          {filteredByPeriod.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No verified transactions</div>
          ) : filteredByPeriod.slice(0, 20).map(c => {
            const isAnon = c.donor_first_name.toLowerCase() === 'anonymous';
            return (
              <div key={c.id} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-slate-500">
                      {isAnon ? '?' : c.donor_first_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {isAnon ? 'Anonymous' : `${c.donor_first_name} ${c.donor_last_name}`}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {projectMap.get(c.project_id)?.title || 'Unknown'} • {formatDate(c.created_at)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">{formatGHS(Number(c.amount_ghs))}</p>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{c.payment_method}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredByPeriod.length > 20 && (
          <div className="p-3 text-center border-t border-slate-100">
            <span className="text-xs text-slate-400">Showing 20 of {filteredByPeriod.length} — Export CSV for full list</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}