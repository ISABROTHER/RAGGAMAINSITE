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
  Info,
  Wifi,
  Activity
} from "lucide-react";

const MOCK_DB = [
  { id: "CCN-OPP-2024", firstName: "Kwame", surname: "Mensah", phone: "0241234567", skill: "Technical", community: "Abura" },
];

type ViewState = "search" | "searching" | "register" | "verified";

const inputCls =
  "w-full px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:border-green-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-white placeholder:text-white/50 backdrop-blur-md";

// INNOVATIVE LIVE SEARCH ANIMATION
function LiveSearchVisual() {
  return (
    <div className="py-10 px-6 flex flex-col items-center justify-center space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Animated Radar Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
            className="absolute w-12 h-12 border border-green-400 rounded-full"
          />
        ))}
        <div className="relative z-10 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
          <Activity className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs font-black text-green-400 uppercase tracking-[0.2em]"
        >
          Scanning Live Records
        </motion.p>
        <p className="text-[10px] text-white/40 mt-1 font-mono">ESTABLISHING ENCRYPTED LINK...</p>
      </div>
    </div>
  );
}

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<typeof MOCK_DB[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<ViewState>("search");
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<"check" | "register" | null>(null);

  const reset = () => {
    setQuery("");
    setFound(null);
    setNotFound(false);
    setView("search");
    setActiveTab(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setView("searching");
    setTimeout(() => {
        const q = query.toLowerCase();
        const r = MOCK_DB.find(u => u.surname.toLowerCase().includes(q) || u.phone.includes(q));
        if (r) setFound(r); else setNotFound(true);
        setView("search");
    }, 2500);
  };

  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* BACKGROUND WITH GREEN FROSTED OVERLAY */}
      <div className="absolute inset-0">
        <img
          src="https://i.imgur.com/5H0XBuV.jpeg"
          alt="Constituency Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            My <span className="text-green-400">Constituents</span>
          </h2>
          <div className="h-1 w-20 bg-green-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[460px]">
            {/* FROSTED GLASS CARD */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <AnimatePresence mode="wait">
                {view === "searching" ? (
                  <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LiveSearchVisual />
                  </motion.div>
                ) : (
                  <motion.div key="main" className="p-6">
                    {/* DYNAMIC HEADER */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                          {showInfo ? <Info className="w-5 h-5 text-white" /> : <Wifi className="w-5 h-5 text-white" />}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-white uppercase tracking-tight">
                            {showInfo ? "Why Register your Details" : "Live Portal Access"}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Database Live</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setShowInfo(!showInfo)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          showInfo ? "bg-white text-green-900 border-white" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        {showInfo ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                      </button>
                    </div>

                    {showInfo ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-left">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                          <div>
                            <h4 className="text-[11px] font-black text-green-400 uppercase mb-1">Purpose & Security</h4>
                            <p className="text-xs text-white/80 leading-relaxed">We confirm you are a constituent to respond to issues quickly. Your data is encrypted, stored securely, and used strictly for constituency support.</p>
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-green-400 uppercase mb-1">Direct Benefits</h4>
                            <p className="text-xs text-white/80 leading-relaxed">Verified members receive priority alerts for skills training, business support, and legislative updates directly from my office.</p>
                          </div>
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-[10px] text-white/40 italic">Not on a smartphone? Visit the Resource Hub in person for manual entry.</p>
                          </div>
                        </div>
                        <button onClick={() => setShowInfo(false)} className="w-full py-3 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl">Back to Database</button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {!activeTab && (
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setActiveTab('check')} className="group py-4 flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                              <Search className="w-5 h-5 text-green-400" />
                              <span className="text-[10px] font-black text-white uppercase tracking-wider">Check Database</span>
                            </button>
                            <button onClick={() => { setActiveTab('register'); setView('register'); }} className="group py-4 flex flex-col items-center gap-2 bg-green-500 border border-green-400 rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
                              <UserPlus className="w-5 h-5 text-white" />
                              <span className="text-[10px] font-black text-white uppercase tracking-wider">Register Now</span>
                            </button>
                          </div>
                        )}

                        {activeTab === 'check' && (
                          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSearch} className="space-y-3">
                            <div className="relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                              <input
                                type="text"
                                placeholder="Enter Name or Phone..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={inputCls + " pl-11"}
                                autoFocus
                              />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveTab(null)} type="button" className="flex-1 py-3.5 bg-white/5 text-white text-[10px] font-black uppercase rounded-xl">Cancel</button>
                                <button type="submit" disabled={!query.trim()} className="flex-[2] py-3.5 bg-green-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg">Run Search</button>
                            </div>
                          </motion.form>
                        )}

                        {/* Search Results */}
                        <AnimatePresence>
                          {found && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-left flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                                <UserCheck className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-black text-sm uppercase tracking-tight">{found.firstName} {found.surname}</p>
                                <p className="text-green-400 text-[9px] font-bold uppercase tracking-widest">Verified Constituent</p>
                              </div>
                              <CheckCircle2 className="w-6 h-6 text-green-400" />
                            </motion.div>
                          )}
                          {notFound && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-5 bg-white/5 border border-white/10 rounded-2xl text-left">
                                <p className="text-white/60 text-xs mb-3 font-medium text-center">No live record found for "{query}"</p>
                                <button onClick={() => setView('register')} className="w-full py-3 bg-white text-green-900 font-black text-[10px] uppercase rounded-xl">Add My Record Now</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Registration & Verified Views follow similar frosted glass styling... */}
                {view === "register" && (
                    <motion.div key="reg" className="p-6 text-left">
                        <button onClick={reset} className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase mb-6"><ArrowLeft className="w-4 h-4"/> Back</button>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" placeholder="First Name" className={inputCls}/>
                                <input type="text" placeholder="Surname" className={inputCls}/>
                            </div>
                            <input type="tel" placeholder="Phone (WhatsApp)" className={inputCls}/>
                            <input type="text" placeholder="Community" className={inputCls}/>
                            <button onClick={() => setView('verified')} className="w-full py-4 bg-green-500 text-white font-black text-xs uppercase rounded-xl mt-4 shadow-xl">Complete Registration</button>
                        </div>
                    </motion.div>
                )}

                {view === "verified" && (
                    <motion.div key="ver" className="p-10 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40">
                            <ShieldCheck className="w-10 h-10 text-white"/>
                        </div>
                        <h3 className="text-white font-black text-xl uppercase tracking-tighter mb-2">Access Granted</h3>
                        <p className="text-white/60 text-xs mb-8">Your profile is now live in the Cape Coast North database.</p>
                        <button onClick={reset} className="px-8 py-3 bg-white/10 text-white text-[10px] font-black uppercase rounded-full border border-white/20">Exit Portal</button>
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