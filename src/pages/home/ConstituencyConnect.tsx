// src/pages/home/ConstituencyConnect.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserCheck,
  UserPlus,
  X,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  Fingerprint,
  CheckCircle2,
  Database,
  Info,
  Server,
  Briefcase,
  GraduationCap
} from "lucide-react";

// Curated list of Cape Coast North Communities
const CC_NORTH_TOWNS = [
  "Abura", "Pedu", "Nkafoa", "Efutu", "Kakomdo", "Mempeasem", "Kwaprow", 
  "Kwesiprah", "Amamoma", "Apewosika", "Akotokyir", "Duakor", "Abakam", 
  "Ahenboboe", "Ola", "Ankaful", "Brabedze", "Nyinasin", "Koforidua", 
  "Ansapetu", "Nkokosa", "Esuekyir", "Ebubonko", "Dehia", "Mpeasem"
].sort();

const MOCK_DB = [
  { id: "CCN-OPP-2024", firstName: "Kwame", surname: "Mensah", phone: "0241234567", community: "Abura" },
];

type ViewState = "search" | "searching" | "register" | "verified";

const anim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const inputCls =
  "w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10 transition-all text-sm text-slate-800 placeholder:text-slate-400";

const labelCls = "text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block";

function SearchLoadingBar({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="py-8 px-6 text-center relative overflow-hidden rounded-xl bg-slate-50">
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.8)] z-10"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
      />
      <div className="relative z-20 flex flex-col items-center gap-4">
        <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <Server className="w-5 h-5 text-green-600 animate-pulse" />
        </div>
        <div className="space-y-1">
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Searching Hub...</p>
            <p className="text-[10px] text-green-600 font-mono">Encrypted Handshake</p>
        </div>
      </div>
    </div>
  );
}

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<typeof MOCK_DB[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<ViewState>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<"check" | "register" | null>(null);

  const reset = () => {
    setQuery("");
    setFound(null);
    setNotFound(false);
    setView("search");
    setSearchQuery("");
    setActiveTab(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchQuery(query.trim());
    setView("searching");
  };

  const handleSearchComplete = () => {
    const q = searchQuery.toLowerCase();
    const r = MOCK_DB.find(u => u.surname.toLowerCase().includes(q) || u.phone.includes(q));
    if (r) setFound(r); else setNotFound(true);
    setView("search");
  };

  return (
    <section className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://i.imgur.com/5H0XBuV.jpeg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/85 backdrop-blur-sm mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">
            My <span className="text-green-300">Constituents</span>
          </h2>
          <p className="mt-4 text-green-50 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-medium opacity-90">
            Join my database so we can support you when opportunities arise.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[460px]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <AnimatePresence mode="wait">
                
                {view === "searching" && (
                  <motion.div key="searching" {...anim}>
                    <SearchLoadingBar onComplete={handleSearchComplete} />
                  </motion.div>
                )}

                {view === "search" && (
                  <motion.div key="search" {...anim} className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                          {showInfo ? <Info className="w-4 h-4 text-white" /> : <Fingerprint className="w-4 h-4 text-white" />}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{showInfo ? "Information" : "Why Register?"}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowInfo(!showInfo)}
                        className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${showInfo ? "bg-slate-900 border-slate-900 text-white" : "bg-green-50 border-green-200 text-green-700"}`}
                      >
                        {showInfo ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{showInfo ? "Close" : "Why Register?"}</span>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {showInfo ? (
                        <motion.div key="info" {...anim} className="mb-2 text-left">
                          <div className="bg-slate-50 rounded-xl p-4 space-y-4 text-slate-800 text-[11px] leading-relaxed border border-slate-100">
                            <div>
                              <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Purpose & Privacy</h4>
                              <p>We confirm you are a constituent to respond to issues quickly. Information is used only for constituency work.</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Benefits</h4>
                              <p>Receive updates, opportunity alerts, and formal follow-ups on your concerns.</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {!activeTab && (
                              <div className="grid grid-cols-2 gap-3 h-[52px]">
                                <button onClick={() => setActiveTab('check')} className="relative h-full flex items-center justify-center gap-2 rounded-xl overflow-hidden group transition-all border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98]">
                                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#e2e8f0_0%,#22c55e_50%,#e2e8f0_100%)] animate-[spin_3s_linear_infinite] opacity-30" />
                                    <div className="relative z-10 flex items-center gap-2">
                                        <div className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider text-slate-700">Check Database</span>
                                    </div>
                                </button>
                                <button onClick={() => { setActiveTab('register'); setView('register'); }} className="h-full flex items-center justify-center gap-2 bg-green-600 border border-green-600 rounded-xl text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span className="text-xs font-black uppercase tracking-wider">Register Now</span>
                                </button>
                              </div>
                          )}

                          {activeTab === 'check' && (
                              <div className="relative">
                                  <button onClick={() => setActiveTab(null)} className="absolute -top-7 right-0 text-[9px] text-slate-400 uppercase font-black flex items-center gap-1">Cancel <X className="w-2.5 h-2.5" /></button>
                                  <form onSubmit={handleSearch}>
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <input type="text" placeholder="Name or phone number..." value={query} onChange={(e) => setQuery(e.target.value)} className={`${inputCls} !pl-9`} autoFocus />
                                    </div>
                                    <button type="submit" disabled={!query.trim()} className="mt-3 w-full bg-slate-900 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg">Verify Status</button>
                                  </form>
                              </div>
                          )}

                          <AnimatePresence mode="wait">
                            {found && (
                              <motion.div key="f" {...anim} className="mt-4 bg-green-50 border border-green-200/60 p-4 rounded-lg text-left">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center"><UserCheck className="w-4 h-4 text-white" /></div>
                                  <div className="flex-1 min-w-0"><p className="font-bold text-green-900 text-sm uppercase">{found.firstName} {found.surname}</p><p className="text-green-700 text-[10px] font-bold">MATCH FOUND</p></div>
                                </div>
                                <button onClick={() => setView("verified")} className="mt-3 w-full bg-green-700 text-white font-bold py-2.5 rounded-lg text-[10px] uppercase">Access Profile</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-5 text-left">
                    <button onClick={reset} className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-black mb-4"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>First Name</label>
                          <input type="text" className={inputCls} placeholder="Kwame" />
                        </div>
                        <div>
                          <label className={labelCls}>Surname</label>
                          <input type="text" className={inputCls} placeholder="Mensah" />
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>WhatsApp Number</label>
                        <input type="tel" className={inputCls} placeholder="024 XXX XXXX" />
                      </div>

                      <div>
                        <label className={labelCls}>Residential Area (Town)</label>
                        <select className={inputCls}>
                          <option value="">-- Select Community --</option>
                          {CC_NORTH_TOWNS.map(town => <option key={town} value={town}>{town}</option>)}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Are you a student?</label>
                          <div className="flex gap-2">
                            {["Yes", "No"].map(v => (
                              <button key={v} className="flex-1 py-2 border rounded-lg text-[10px] font-bold hover:bg-green-50 hover:border-green-200 transition-colors uppercase">{v}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Employed?</label>
                          <div className="flex gap-2">
                            {["Yes", "No"].map(v => (
                              <button key={v} className="flex-1 py-2 border rounded-lg text-[10px] font-bold hover:bg-green-50 hover:border-green-200 transition-colors uppercase">{v}</button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button onClick={() => setView("verified")} className="w-full bg-green-700 text-white font-black py-3.5 rounded-xl text-[10px] uppercase mt-2 shadow-lg shadow-green-700/20 flex items-center justify-center gap-2">
                        Complete Registration <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "verified" && (
                  <motion.div key="verified" {...anim}>
                    <div className="bg-green-600 p-8 text-center text-white"><ShieldCheck className="w-10 h-10 mx-auto mb-3" /><p className="text-lg font-black uppercase tracking-wider">Access Secured</p></div>
                    <div className="p-6">
                        <button onClick={reset} className="w-full text-slate-400 text-[10px] font-black uppercase">Close Access</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}