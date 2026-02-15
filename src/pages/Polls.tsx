import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  History,
  TrendingUp,
  MessageSquareQuote,
  Cpu,
  Fingerprint,
  Layers,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Lock,
  Wallet,
  CheckCircle2,
  Users,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

function getSessionId(): string {
  let id = localStorage.getItem('ccn_poll_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ccn_poll_session', id);
  }
  return id;
}

const POLL_OPTIONS = [
  { id: 'health', text: "Smart Clinics & E-Health", icon: "🏥", color: "from-rose-500 to-pink-600", glow: "shadow-rose-500/20", barColor: "bg-rose-500" },
  { id: 'edu', text: "STEM Coding Labs", icon: "🎓", color: "from-blue-500 to-sky-600", glow: "shadow-blue-500/20", barColor: "bg-blue-500" },
  { id: 'roads', text: "Solar Grid Expansion", icon: "💡", color: "from-amber-500 to-orange-600", glow: "shadow-amber-500/20", barColor: "bg-amber-500" },
  { id: 'jobs', text: "Agro-AI Processing", icon: "🌾", color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/20", barColor: "bg-emerald-500" },
];

const POLL_ID = 'budget-2026';

const COMMUNITY_CONSENSUS = {
  topic: "Modernization Consensus",
  summary: "AI synthesis of 1,200+ local voices suggests a 78% preference for cold-storage facilities over retail stalls.",
  lastUpdated: "Live Now",
};

const ASSURANCES = [
  {
    id: 1,
    promise: "Kwaprow Community Market",
    category: "Infrastructure",
    status: "On Track",
    progress: 65,
    verification: [
      { date: "Oct 2025", event: "Structural Integrity Audit Passed", type: "Official" },
      { date: "Dec 2025", event: "Roofing Installation Phase Complete", type: "Field Report" },
    ],
    notes: "Partitions are being installed using high-durability eco-materials.",
  },
  {
    id: 2,
    promise: "1,000 School Desks",
    category: "Education",
    status: "Completed",
    progress: 100,
    verification: [
      { date: "Oct 2024", event: "Final Distribution Log Verified", type: "Inventory" },
    ],
    notes: "Full standardization across 15 basic schools successfully achieved.",
  },
];

interface CommunityTotals {
  [key: string]: number;
}

export function Polls() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 md:p-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
            <BarChart3 className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Under Construction
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-8">
            We're working hard to bring you the Polls & Tracker page. Check back soon!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PollsOld() {
  const [activeTab, setActiveTab] = useState<'deliberation' | 'tracker'>('deliberation');
  const [credits, setCredits] = useState(100);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    () => Object.fromEntries(POLL_OPTIONS.map(o => [o.id, 0]))
  );
  const [expandedTracker, setExpandedTracker] = useState<number | null>(null);

  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [communityTotals, setCommunityTotals] = useState<CommunityTotals>({});
  const [totalVoters, setTotalVoters] = useState(0);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    loadMyVote();
    loadCommunityResults();
  }, []);

  async function loadMyVote() {
    try {
      const { data } = await supabase
        .from('poll_votes')
        .select('allocations, total_credits_used')
        .eq('session_id', getSessionId())
        .eq('poll_id', POLL_ID)
        .maybeSingle();

      if (data) {
        const allocs = data.allocations as Record<string, number>;
        setAllocations(allocs);
        setCredits(100 - (data.total_credits_used as number));
        setHasVoted(true);
        setSubmitted(true);
      }
    } catch {
      /* ignore */
    }
  }

  async function loadCommunityResults() {
    setLoadingResults(true);
    try {
      const { data } = await supabase
        .from('poll_votes')
        .select('allocations')
        .eq('poll_id', POLL_ID);

      if (data && data.length > 0) {
        const totals: CommunityTotals = {};
        data.forEach((row) => {
          const allocs = row.allocations as Record<string, number>;
          Object.entries(allocs).forEach(([k, v]) => {
            totals[k] = (totals[k] || 0) + v;
          });
        });
        setCommunityTotals(totals);
        setTotalVoters(data.length);
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingResults(false);
    }
  }

  const handleAdjustCredit = (optionId: string, amount: number) => {
    const current = allocations[optionId] || 0;
    const newVotes = Math.max(0, current + amount);
    const costChange = (newVotes * newVotes) - (current * current);

    if (credits - costChange >= 0) {
      setAllocations(prev => ({ ...prev, [optionId]: newVotes }));
      setCredits(prev => prev - costChange);
    }
  };

  async function handleFinalize() {
    setSubmitting(true);
    try {
      const totalUsed = 100 - credits;
      await supabase.from('poll_votes').upsert(
        {
          session_id: getSessionId(),
          poll_id: POLL_ID,
          allocations,
          total_credits_used: totalUsed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id,poll_id' }
      );
      setHasVoted(true);
      setSubmitted(true);
      await loadCommunityResults();
    } catch (err) {
      console.error('Vote submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChangeVote() {
    setSubmitted(false);
  }

  const communityGrandTotal = Object.values(communityTotals).reduce((s, v) => s + v, 0) || 1;

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-24 md:pt-32">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="mb-12 md:mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">The 2026 Agenda</span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-4">
            Democracy <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Hub.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-base md:text-xl font-medium px-4">
            Directly influence policy using Voice Credits and monitor progress with real-time audit trails.
          </p>

          {totalVoters > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold"
            >
              <Users className="w-3.5 h-3.5" />
              {totalVoters} {totalVoters === 1 ? 'citizen has' : 'citizens have'} voted
            </motion.div>
          )}
        </div>

        <div className="md:hidden sticky top-24 z-40 mb-8">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center justify-between mx-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Available</div>
                <div className="text-xl font-black text-white leading-none">{credits} Credits</div>
              </div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white/70">
              Budgeted: {100 - credits}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12 md:mb-16">
          <div className="bg-slate-200/40 p-1 rounded-[2rem] flex gap-1 backdrop-blur-sm border border-white w-full max-w-md">
            {[
              { id: 'deliberation', label: 'Voting', icon: Layers },
              { id: 'tracker', label: 'Progress', icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[1.8rem] text-xs md:text-sm font-black transition-all duration-500 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xl shadow-slate-400/10 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'deliberation' && (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 order-2 lg:order-1">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 p-6 md:p-12 shadow-2xl shadow-slate-200/50"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Vote Recorded</h2>
                        </div>
                        <p className="text-slate-500 font-medium text-sm">Your voice matters. Here's how the community stands:</p>
                      </div>
                      <button
                        onClick={handleChangeVote}
                        className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" /> Change Vote
                      </button>
                    </div>

                    <div className="space-y-6 mb-8">
                      {loadingResults ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                      ) : POLL_OPTIONS.map((option) => {
                        const communityVotes = communityTotals[option.id] || 0;
                        const communityPct = Math.round((communityVotes / communityGrandTotal) * 100);
                        const myVotes = allocations[option.id] || 0;

                        return (
                          <div key={option.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{option.icon}</span>
                                <span className="text-sm md:text-base font-black text-slate-900">{option.text}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-bold">
                                <span className="text-slate-400">You: {myVotes}</span>
                                <span className="text-blue-600">{communityPct}%</span>
                              </div>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${communityPct}%` }}
                                transition={{ duration: 0.8, ease: 'circOut' }}
                                className={`h-full ${option.barColor} rounded-full`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <BarChart3 className="w-4 h-4" />
                        {totalVoters} total {totalVoters === 1 ? 'voter' : 'voters'}
                      </div>
                      <button
                        onClick={handleChangeVote}
                        className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Change Vote
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="voting"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 p-6 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
                  >
                    <div className="hidden md:block absolute top-0 right-0 p-12">
                      <div className="bg-slate-900 text-white px-8 py-6 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-center">
                        <span className="text-4xl font-black tracking-tighter mb-1">{credits}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Voice Credits</span>
                        <div className="mt-4 w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: `${credits}%` }}
                            className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="max-w-xl mb-10 md:mb-16">
                      <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">2026 Constituency Budget Allocation</h2>
                      <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                        Distribute 100 Voice Credits. Cost = (Votes)2. Example: 3 votes cost 9 credits. This ensures intense preferences are heard fairly.
                      </p>
                    </div>

                    <div className="grid gap-4 md:gap-6">
                      {POLL_OPTIONS.map((option) => (
                        <div
                          key={option.id}
                          className="group relative bg-slate-50/50 rounded-[2rem] p-5 md:p-8 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl md:text-4xl shadow-xl ${option.glow} transform group-hover:scale-110 transition-transform`}>
                                {option.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg md:text-2xl font-black text-slate-900 leading-tight">{option.text}</h4>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                  <span className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-widest">{allocations[option.id]} Votes</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cost: {(allocations[option.id] || 0) ** 2} Credits</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 bg-white/50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-slate-100 sm:border-0">
                              <button
                                onClick={() => handleAdjustCredit(option.id, -1)}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-90"
                              >
                                <Minus className="w-5 h-5 md:w-6 md:h-6" />
                              </button>
                              <div className="w-10 text-center text-xl md:text-3xl font-black text-slate-900 tabular-nums">{allocations[option.id]}</div>
                              <button
                                onClick={() => handleAdjustCredit(option.id, 1)}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-90"
                              >
                                <Plus className="w-5 h-5 md:w-6 md:h-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleFinalize}
                      disabled={submitting || credits === 100}
                      className="w-full mt-10 md:mt-12 bg-slate-900 text-white h-16 md:h-20 rounded-3xl font-black tracking-widest uppercase text-xs md:text-sm shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900 disabled:hover:translate-y-0"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-5 h-5" /> {hasVoted ? 'Update My Decision' : 'Finalize My Decision'}
                        </>
                      )}
                    </button>

                    {credits === 100 && (
                      <p className="text-center mt-4 text-xs text-slate-400 font-medium">
                        Allocate at least 1 vote to submit your decision
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/20 blur-[80px]" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">AI Intelligence</h4>
                    <p className="text-sm font-bold">Community Consensus</p>
                  </div>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 italic text-white/90 text-sm leading-relaxed shadow-inner">
                    <MessageSquareQuote className="w-6 h-6 text-blue-400 mb-3 opacity-50" />
                    "{COMMUNITY_CONSENSUS.summary}"
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2">
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Consensus: 78%
                    </span>
                    <span>{COMMUNITY_CONSENSUS.lastUpdated}</span>
                  </div>
                </div>
              </motion.div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" /> Topic Momentum
                </h4>
                <div className="space-y-8">
                  {[
                    { label: "STEM Labs", val: 88, color: "bg-blue-500" },
                    { label: "Road Grading", val: 42, color: "bg-slate-200" },
                    { label: "Agro Hubs", val: 65, color: "bg-emerald-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[11px] font-black text-slate-900 uppercase mb-2 px-1">
                        <span>{item.label}</span>
                        <span>{item.val}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.val}%` }}
                          className={`h-full ${item.color} rounded-full shadow-[0_0_8px_rgba(0,0,0,0.05)]`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 group cursor-pointer hover:border-blue-300 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Liquid Delegation</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
                  Let a verified community leader manage your credits based on their expertise.
                </p>
                <div className="flex items-center justify-between font-black text-blue-600 text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Assign Proxy <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="grid gap-6 md:gap-8">
            {ASSURANCES.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden group"
              >
                <div className="p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{item.promise}</h3>
                    <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-2xl">{item.notes}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                    <div className="w-full sm:w-56">
                      <div className="flex justify-between text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">
                        <span>Fulfillment</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-slate-900 shadow-lg shadow-slate-900/10'}`}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedTracker(expandedTracker === item.id ? null : item.id)}
                      className="w-full sm:w-auto h-16 md:h-20 px-10 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl"
                    >
                      {expandedTracker === item.id ? 'Close' : 'Audit'} Evidence
                      <History className={`w-4 h-4 transition-transform ${expandedTracker === item.id ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTracker === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50/80 backdrop-blur-sm border-t border-slate-100"
                    >
                      <div className="p-8 md:p-16">
                        <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-12">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" /> Multi-Source Audit Log
                        </div>
                        <div className="grid gap-12 relative">
                          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-200" />
                          {item.verification.map((v, i) => (
                            <div key={i} className="flex gap-10 relative group/step">
                              <div className="w-10 h-10 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center z-10 group-hover/step:border-blue-500 transition-all group-hover/step:scale-110 shadow-sm">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover/step:bg-blue-500 transition-colors" />
                              </div>
                              <div className="flex-1">
                                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{v.type} Verification</div>
                                <div className="text-lg md:text-xl font-black text-slate-800 mb-1">{v.event}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase">{v.date}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
