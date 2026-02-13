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
  ScanSearch,
  ShieldAlert,
  Info,
  Server
} from "lucide-react";

// --- Mock DB ---
const MOCK_DB = [
  { id: "CCN-OPP-2024", firstName: "Kwame", surname: "Mensah", phone: "0241234567", skill: "Technical", community: "Abura" },
];

type ViewState = "search" | "searching" | "register" | "verified";

const anim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const inputCls =
  "w-full px-3.5 py-3 bg-white/80 border border-slate-200 rounded-lg focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-slate-800 placeholder:text-slate-400";

// --- INNOVATIVE LIVE SEARCH ANIMATION ---
function SearchLoadingBar({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="py-8 px-6 text-center relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.8)] z-10"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
      />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50"></div>

      <div className="relative z-20 flex flex-col items-center gap-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-slate-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <Server className="w-6 h-6 text-green-600 animate-pulse" />
        </div>
        
        <div className="space-y-1">
            <motion.p 
                className="text-xs font-black text-slate-900 uppercase tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Connecting to Hub...
            </motion.p>
            <p className="text-[10px] text-green-600 font-mono">
                Verifying Constituent ID
            </p>
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
      {/* BACKGROUND IMAGE WITH GREEN FROSTED OVERLAY */}
      <div className="absolute inset-0">
        <img
          src="https://i.imgur.com/5H0XBuV.jpeg"
          alt="Constituency Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900/85 backdrop-blur-sm mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">
            My <span className="text-green-300">Constituents</span>
          </h2>
          <p className="mt-4 text-green-50 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-medium opacity-90">
            Are you a student, business person or resident in Cape Coast North? Join my database so we can support you when opportunities arise.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[440px]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <AnimatePresence mode="wait">
                
                {view === "searching" && (
                  <motion.div key="searching" {...anim}>
                    <SearchLoadingBar onComplete={handleSearchComplete} />
                  </motion.div>
                )}

                {view === "search" && (
                  <motion.div key="search" {...anim} className="p-5">
                    
                    {/* Header: Modified as requested */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
                          {showInfo ? <Info className="w-4 h-4 text-white" /> : <Fingerprint className="w-4 h-4 text-white" />}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            {showInfo ? "Information" : "Database Access"}
                          </p>
                          {/* SYSTEM LIVE REMOVED */}
                        </div>
                      </div>
                      
                      {/* TOGGLE BUTTON: Now says "Why Register?" */}
                      <button 
                        onClick={() => setShowInfo(!showInfo)}
                        className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          showInfo ? "bg-slate-900 border-slate-900 text-white" : "bg-green-50 border-green-200 text-green-700"
                        }`}
                      >
                        {showInfo ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{showInfo ? "Close" : "Why Register?"}</span>
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {/* INFO CONTENT */}
                      {showInfo ? (
                        <motion.div key="info" {...anim} className="overflow-hidden mb-2">
                          <div className="bg-slate-50 rounded-xl p-4 space-y-4 text-slate-800 text-[11px] leading-relaxed border border-slate-100 text-left">
                            <div>
                              <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Purpose</h4>
                              <p>We collect basic information to confirm you are a constituent, contact you when needed, and respond to your issues fairly and quickly.</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Benefits</h4>
                              <p>You can receive updates, be informed when support or opportunities are available, and have your concerns recorded for follow up.</p>
                            </div>
                            <div>
                              <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Privacy</h4>
                              <p>Your information is used only by my office for constituency work. We do not sell it, publish it, or share it for marketing.</p>
                            </div>
                            <div className="border-t border-slate-200 pt-3">
                                <p className="font-bold mb-1">Common Questions:</p>
                                <ul className="list-disc pl-3 space-y-1 opacity-90">
                                <li><strong>Duplicates:</strong> We match records automatically.</li>
                                <li><strong>Wrong details:</strong> Update your info anytime.</li>
                                <li><strong>No smartphone:</strong> Register at our office.</li>
                                </ul>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          
                          {/* TWO BUTTONS ON ONE LINE */}
                          {!activeTab && (
                              <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setActiveTab('check')}
                                    className="py-3.5 flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-200 transition-colors"
                                >
                                    <Search className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-xs font-black uppercase tracking-wider">Check Database</span>
                                </button>
                                
                                <button 
                                    onClick={() => { setActiveTab('register'); setView('register'); }}
                                    className="py-3.5 flex items-center justify-center gap-2 bg-green-600 border border-green-600 rounded-xl text-white hover:bg-green-700 transition-colors"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span className="text-xs font-black uppercase tracking-wider">Register Now</span>
                                </button>
                              </div>
                          )}

                          {/* SEARCH INPUT */}
                          {activeTab === 'check' && (
                              <div className="relative">
                                  <button onClick={() => setActiveTab(null)} className="absolute -top-7 right-0 text-[9px] text-slate-400 uppercase font-black flex items-center gap-1">
                                    Cancel <X className="w-2.5 h-2.5" />
                                  </button>
                                  <form onSubmit={handleSearch}>
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <input
                                        type="text"
                                        placeholder="Name or phone number..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className={`${inputCls} !pl-9`}
                                        autoFocus
                                      />
                                    </div>
                                    <button
                                      type="submit"
                                      disabled={!query.trim()}
                                      className="mt-3 w-full bg-slate-900 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                      Verify Status
                                    </button>
                                  </form>
                              </div>
                          )}

                          {/* RESULTS */}
                          <AnimatePresence mode="wait">
                            {found && (
                              <motion.div key="f" {...anim} className="mt-4 bg-green-50 border border-green-200/60 p-4 rounded-lg text-left">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
                                    <UserCheck className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-bold text-green-900 text-sm uppercase">{found.firstName} {found.surname}</p>
                                    <p className="text-green-700 text-[10px] font-bold">MATCH FOUND</p>
                                  </div>
                                </div>
                                <button onClick={() => setView("verified")} className="mt-3 w-full bg-green-700 text-white font-bold py-2.5 rounded-lg text-[10px] uppercase">
                                  Access Profile
                                </button>
                              </motion.div>
                            )}
                            {notFound && (
                              <motion.div key="nf" {...anim} className="mt-4 bg-amber-50 border border-amber-200/60 p-4 rounded-lg text-left">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-white" />
                                  </div>
                                  <p className="font-bold text-amber-900 text-xs">No record for "{searchQuery}"</p>
                                </div>
                                <button onClick={() => setView("register")} className="mt-3 w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg text-[10px] uppercase">
                                  Create Record
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* VIEW: REGISTER */}
                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-5 text-left">
                    <button onClick={reset} className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-black mb-5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input type="text" placeholder="First Name" className={inputCls} />
                        <input type="text" placeholder="Surname" className={inputCls} />
                      </div>
                      <input type="tel" placeholder="Phone Number" className={inputCls} />
                      <input type="text" placeholder="Residential Community" className={inputCls} />
                      <button onClick={() => setView("verified")} className="w-full bg-green-700 text-white font-black py-3 rounded-xl text-[10px] uppercase mt-2">
                        Submit Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* VIEW: VERIFIED */}
                {view === "verified" && (
                  <motion.div key="verified" {...anim}>
                    <div className="bg-green-600 p-6 text-center text-white">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-3" />
                      <p className="text-lg font-black uppercase tracking-wider">Access Verified</p>
                    </div>
                    <div className="p-5">
                      <button onClick={reset} className="w-full flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-black uppercase py-2">
                        <X className="w-3.5 h-3.5" /> Close
                      </button>
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