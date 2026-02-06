// src/pages/Polls.tsx
import { useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  Info, 
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
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- RESEARCH-BASED MOCK DATA ---
const INITIAL_QUADRATIC_POLLS = [
  {
    id: 'q1',
    question: "2026 Constituency Budget Allocation",
    description: "Distribute 100 Voice Credits. Cost = (Votes)². Example: 3 votes cost 9 credits. This ensures intense preferences are heard fairly.",
    options: [
      { id: 'health', text: "Smart Clinics & E-Health", spent: 0, icon: "🏥", color: "from-rose-500 to-pink-600", glow: "shadow-rose-500/20" },
      { id: 'edu', text: "STEM Coding Labs", spent: 0, icon: "🎓", color: "from-blue-500 to-indigo-600", glow: "shadow-blue-500/20" },
      { id: 'roads', text: "Solar Grid Expansion", spent: 0, icon: "💡", color: "from-amber-500 to-orange-600", glow: "shadow-amber-500/20" },
      { id: 'jobs', text: "Agro-AI Processing", spent: 0, icon: "农业", color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/20" },
    ]
  }
];

const COMMUNITY_CONSENSUS = {
  topic: "Modernization Consensus",
  summary: "AI synthesis of 1,200+ local voices suggests a 78% preference for cold-storage facilities over retail stalls.",
  lastUpdated: "Live Now"
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
      { date: "Dec 2025", event: "Roofing Installation Phase Complete", type: "Field Report" }
    ],
    notes: "Partitions are being installed using high-durability eco-materials."
  },
  {
    id: 2,
    promise: "1,000 School Desks",
    category: "Education",
    status: "Completed",
    progress: 100,
    verification: [
      { date: "Oct 2024", event: "Final Distribution Log Verified", type: "Inventory" }
    ],
    notes: "Full standardization across 15 basic schools successfully achieved."
  }
];

export function Polls() {
  const [activeTab, setActiveTab] = useState<'deliberation' | 'tracker'>('deliberation');
  const [credits, setCredits] = useState(100);
  const [pollOptions, setPollOptions] = useState(INITIAL_QUADRATIC_POLLS[0].options);
  const [expandedTracker, setExpandedTracker] = useState<number | null>(null);

  const handleAdjustCredit = (optionId: string, amount: number) => {
    const currentOption = pollOptions.find(o => o.id === optionId);
    if (!currentOption) return;

    const newSpent = Math.max(0, currentOption.spent + amount);
    const costChange = (newSpent * newSpent) - (currentOption.spent * currentOption.spent);

    if (credits - costChange >= 0) {
      setPollOptions(pollOptions.map(o => 
        o.id === optionId ? { ...o, spent: newSpent } : o
      ));
      setCredits(prev => prev - costChange);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-24 pb-24 md:pt-32">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- DYNAMIC HEADER --- */}
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
        </div>

        {/* --- MOBILE STICKY CREDIT BAR --- */}
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

        {/* --- TAB NAVIGATION (STYLISH) --- */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="bg-slate-200/40 p-1 rounded-[2rem] flex gap-1 backdrop-blur-sm border border-white w-full max-w-md">
            {[
              { id: 'deliberation', label: 'Voting', icon: Layers },
              { id: 'tracker', label: 'Progress', icon: ShieldCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[1.8rem] text-xs md:text-sm font-black transition-all duration-500
                  ${activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-xl shadow-slate-400/10 scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800'
                  }
                `}
              >
                <tab.icon className="w-4 h-4 md:w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'deliberation' && (
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* --- QUADRATIC VOTING PANEL --- */}
            <div className="lg:col-span-8 order-2 lg:order-1">
              <motion.div 
                layout
                className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 p-6 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
              >
                {/* Desktop Credit UI */}
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
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">{INITIAL_QUADRATIC_POLLS[0].question}</h2>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">{INITIAL_QUADRATIC_POLLS[0].description}</p>
                </div>

                <div className="grid gap-4 md:gap-6">
                  {pollOptions.map((option) => (
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
                              <span className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-widest">{option.spent} Votes</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Cost: {option.spent * option.spent} Credits</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 bg-white/50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-slate-100 sm:border-0">
                          <button 
                            onClick={() => handleAdjustCredit(option.id, -1)}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm active:scale-90"
                          >
                            <Minus className="w-5 h-5 md:w-6 h-6" />
                          </button>
                          <div className="w-10 text-center text-xl md:text-3xl font-black text-slate-900 tabular-nums">{option.spent}</div>
                          <button 
                            onClick={() => handleAdjustCredit(option.id, 1)}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-90"
                          >
                            <Plus className="w-5 h-5 md:w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-10 md:mt-12 bg-slate-900 text-white h-16 md:h-20 rounded-3xl font-black tracking-widest uppercase text-xs md:text-sm shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                  <Fingerprint className="w-5 h-5" /> Finalize My Decision
                </button>
              </motion.div>
            </div>

            {/* --- AI & INSIGHTS SIDEBAR --- */}
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
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Consensus: 78%</span>
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
                    { label: "Agro Hubs", val: 65, color: "bg-emerald-500" }
                  ].map(item => (
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

              {/* Delegated Proxy Card */}
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 group cursor-pointer hover:border-blue-300 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Liquid Delegation</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">Let a verified community leader manage your credits based on their expertise.</p>
                <div className="flex items-center justify-between font-black text-blue-600 text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                   Assign Proxy <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TRACKER TAB --- */}
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
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                        item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
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
                            {/* Vertical Line */}
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