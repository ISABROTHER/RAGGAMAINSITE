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
  ChevronRight
} from "lucide-react";

const MOCK_DB = [
  { id: "CCN-OPP-2024", firstName: "Kwame", surname: "Mensah", phone: "0241234567", skill: "Technical", community: "Abura" },
];

type ViewState = "search" | "searching" | "register" | "verified";

const anim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

const inputCls =
  "w-full px-3.5 py-3 bg-white/80 border border-slate-200 rounded-lg focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-slate-800 placeholder:text-slate-400";

const SEARCH_STEPS = [
  { label: "Connecting to Talent Hub", icon: Database, duration: 600 },
  { label: "Scanning skills records", icon: ScanSearch, duration: 500 },
  { label: "Verifying constituent match", icon: ShieldAlert, duration: 400 },
];

function SearchLoadingBar({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalElapsed = 0;
    const totalDuration = SEARCH_STEPS.reduce((s, st) => s + st.duration, 0);
    const interval = setInterval(() => {
      totalElapsed += 30;
      const pct = Math.min((totalElapsed / totalDuration) * 100, 100);
      setProgress(pct);

      let accumulated = 0;
      for (let i = 0; i < SEARCH_STEPS.length; i++) {
        accumulated += SEARCH_STEPS[i].duration;
        if (totalElapsed < accumulated) {
          setStep(i);
          break;
        }
      }

      if (totalElapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  const Icon = SEARCH_STEPS[step].icon;

  return (
    <motion.div {...anim} className="py-6 px-5">
      <div className="flex items-center gap-3 mb-5">
        <motion.div
          key={step}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/20"
        >
          <Icon className="w-4 h-4 text-white" />
        </motion.div>
        <div className="flex-1">
          <motion.p
            key={step}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold text-slate-800"
          >
            {SEARCH_STEPS[step].label}
          </motion.p>
          <p className="text-[11px] text-slate-400 font-mono">Step {step + 1} of 3</p>
        </div>
        <span className="text-xs font-bold text-green-600 tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<typeof MOCK_DB[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<ViewState>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const reset = () => {
    setQuery("");
    setFound(null);
    setNotFound(false);
    setView("search");
    setSearchQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchQuery(query.trim());
    setFound(null);
    setNotFound(false);
    setView("searching");
  };

  const handleSearchComplete = () => {
    const q = searchQuery.toLowerCase();
    const r = MOCK_DB.find(
      (u) =>
        u.surname.toLowerCase().includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
    if (r) {
      setFound(r);
    } else {
      setNotFound(true);
    }
    setView("search");
  };

  return (
    <section className="relative py-16 md:py-24 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* CENTERED HEADER */}
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Constituents</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
                Are you a student, business person, or resident in Cape Coast North? Join our database so we can build a better constituency together and support you when opportunities arise.
            </p>
            
            {/* INNOVATIVE INFO BUTTON */}
            <button 
                onClick={() => setShowInfo(true)}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-widest transition-all"
            >
                <Info className="w-4 h-4" />
                Why register?
            </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[450px]">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <AnimatePresence mode="wait">
                {view === "searching" && (
                  <motion.div key="searching" {...anim}>
                    <SearchLoadingBar onComplete={handleSearchComplete} />
                  </motion.div>
                )}

                {view === "search" && (
                  <motion.div key="search" {...anim} className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/20">
                          <Fingerprint className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-wide">Check or Register</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Search</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-200/60 text-green-700 px-3 py-1 rounded-full">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider">Active</span>
                      </div>
                    </div>

                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Name or phone number..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className={`${inputCls} !pl-10 !py-3.5`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!query.trim()}
                        className="mt-4 w-full bg-slate-900 hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10"
                      >
                        <Search className="w-4 h-4" />
                        Check Status
                      </button>
                    </form>

                    <AnimatePresence mode="wait">
                      {found && (
                        <motion.div key="f" {...anim} className="mt-6 bg-green-50 border border-green-200/60 p-5 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserCheck className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-green-900 text-sm uppercase">{found.firstName} {found.surname}</p>
                              <p className="text-green-700 text-[10px] font-bold uppercase tracking-widest">Verified Constituent</p>
                            </div>
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                          </div>
                          <button onClick={() => setView("verified")} className="mt-4 w-full bg-green-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest">
                            View Profile
                          </button>
                        </motion.div>
                      )}
                      {notFound && (
                        <motion.div key="nf" {...anim} className="mt-6 bg-amber-50 border border-amber-200/60 p-5 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserPlus className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-bold text-amber-900 text-xs">No record found for "{searchQuery}"</p>
                          </div>
                          <button onClick={() => setView("register")} className="mt-4 w-full bg-amber-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest">
                            Register Now
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-6 md:p-8">
                    <button onClick={reset} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6 transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-green-500/20">
                        <UserPlus className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Registration</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="First Name" className={inputCls} />
                        <input type="text" placeholder="Surname" className={inputCls} />
                      </div>
                      <input type="tel" placeholder="Phone (WhatsApp)" className={inputCls} />
                      <input type="text" placeholder="Residential Community" className={inputCls} />
                      <input type="text" placeholder="Profession or Skill" className={inputCls} />
                      <button onClick={() => setView("verified")} className="w-full bg-green-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] mt-2 shadow-lg shadow-green-700/20">
                        Submit
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "verified" && (
                  <motion.div key="verified" {...anim}>
                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-center text-white">
                      <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-xl font-black uppercase tracking-widest leading-none">Verified</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 bg-white/15 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Talent Hub
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 text-xs">
                        <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="font-bold text-slate-800 uppercase">Cape Coast North Resource Hub</span>
                      </div>
                      <button onClick={reset} className="mt-4 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest py-2 transition-colors">
                        <X className="w-4 h-4" /> Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* INFO MODAL (Innovative Frozen Glass) */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
            >
              <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setShowInfo(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-4 h-4 text-slate-600" />
                </button>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-green-600" />
                            Why we ask for details
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            We collect basic information to confirm you are a constituent, contact you when needed, and respond to your issues fairly and quickly.
                        </p>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                        <h4 className="text-xs font-black text-green-800 uppercase tracking-widest mb-4">What you get from registering</h4>
                        <ul className="space-y-3">
                            {[
                                "Receive regular constituency updates",
                                "Informed when support/opportunities are available",
                                "Your concerns recorded for follow up"
                            ].map((txt, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-green-700">
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                    {txt}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Protection</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Information is used only for constituency work. We do not sell, publish, or share it for marketing.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Registration</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Name and phone number are enough. Community and category can be added later.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Common Problems</h4>
                        <div className="grid gap-4">
                            {[
                                { t: "Duplicates", d: "We match records to prevent repeated entries." },
                                { t: "Wrong details", d: "You can update your information anytime." },
                                { t: "No smartphone", d: "Register through a support person at our office." },
                                { t: "Language", d: "We can assist in person if you need help." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase">{item.t}</p>
                                        <p className="text-xs text-slate-500">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-6">
                        <p className="text-xs font-bold leading-relaxed opacity-90">
                            If you hear nothing immediately, don't worry. Your record stays active. When relevant updates or support are available, my office will reach out.
                        </p>
                    </div>

                    <button 
                        onClick={() => setShowInfo(false)}
                        className="w-full py-4 bg-green-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-green-600/20"
                    >
                        Got it, thanks!
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}