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
  Info
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
    <section className="relative py-10 md:py-16 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">
            My <span className="text-green-400">Constituents</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Are you a student in cape coast north, business person or resident? Let me know so we can build a constituency together and support you when there is an opportunity.
          </p>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all"
          >
            <Info className="w-4 h-4" />
            {showInfo ? "Hide info" : "Why register?"}
          </button>
        </div>

        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-10 bg-white rounded-2xl p-6 md:p-8 shadow-xl max-w-3xl mx-auto overflow-hidden"
          >
            <div className="space-y-6 text-slate-800">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-700 uppercase text-xs mb-2">Why we ask for your details</h4>
                  <p className="text-xs leading-relaxed">We collect basic information to confirm you are a constituent, contact you when needed, and respond to your issues fairly and quickly.</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700 uppercase text-xs mb-2">What you get from registering</h4>
                  <p className="text-xs leading-relaxed">You can receive updates, be informed when support or opportunities are available, and have your concerns recorded for follow up.</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700 uppercase text-xs mb-2">How we protect your information</h4>
                  <p className="text-xs leading-relaxed">Your information is used only by my office for constituency work. We do not sell it, publish it, or share it for marketing.</p>
                </div>
                <div>
                  <h4 className="font-bold text-green-700 uppercase text-xs mb-2">What to register</h4>
                  <p className="text-xs leading-relaxed">Name and phone number are enough to start. You can add your community and category later.</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-green-700 uppercase text-xs mb-3">Common problems</h4>
                <div className="grid md:grid-cols-2 gap-4 text-[10px]">
                  <p><strong>Duplicates:</strong> We match records to prevent repeated entries.</p>
                  <p><strong>Wrong details:</strong> Update your info anytime.</p>
                  <p><strong>Verification:</strong> We may contact you to confirm community.</p>
                  <p><strong>No smartphone:</strong> Register through a support person at our office.</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-[10px] italic">
                If you register and hear nothing, your record stays active. My office will reach out when there is a relevant update.
              </div>
              <p className="text-[10px] font-bold text-red-600">Report an issue: Use the platform to submit. If urgent, contact my office directly.</p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[400px]">
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
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/20">
                          <Fingerprint className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight uppercase">Database Access</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Enter name or phone number..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          className={`${inputCls} !pl-9`}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!query.trim()}
                        className="mt-3 w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Check Status
                      </button>
                    </form>

                    <AnimatePresence mode="wait">
                      {found && (
                        <motion.div key="f" {...anim} className="mt-4 bg-green-50 border border-green-200/60 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserCheck className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-green-900 text-sm uppercase">{found.firstName} {found.surname}</p>
                              <p className="text-green-700 text-[10px] font-bold">REGISTERED</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          </div>
                          <button onClick={() => setView("verified")} className="mt-3 w-full bg-green-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase">
                            View Details
                          </button>
                        </motion.div>
                      )}
                      {notFound && (
                        <motion.div key="nf" {...anim} className="mt-4 bg-amber-50 border border-amber-200/60 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserPlus className="w-4 h-4 text-white" />
                            </div>
                            <p className="font-bold text-amber-900 text-xs">Not found: "{searchQuery}"</p>
                          </div>
                          <button onClick={() => setView("register")} className="mt-3 w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg text-xs uppercase">
                            Register My Info
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-5">
                    <button onClick={reset} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-[10px] uppercase font-bold mb-5 transition-colors">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <div className="text-center mb-5">
                      <h3 className="text-sm font-bold text-slate-900 uppercase">Registration</h3>
                    </div>
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input type="text" placeholder="First Name" className={inputCls} />
                        <input type="text" placeholder="Surname" className={inputCls} />
                      </div>
                      <input type="tel" placeholder="Phone (WhatsApp)" className={inputCls} />
                      <input type="text" placeholder="Residential Community" className={inputCls} />
                      <input type="text" placeholder="Profession or Skill" className={inputCls} />
                      <button onClick={() => setView("verified")} className="w-full bg-green-700 text-white font-bold py-2.5 rounded-lg text-xs uppercase mt-1">
                        Submit Information
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "verified" && (
                  <motion.div key="verified" {...anim}>
                    <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-center text-white">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-3" />
                      <p className="text-lg font-black uppercase tracking-wider">Profile Verified</p>
                    </div>
                    <div className="p-5">
                      <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-2 text-[10px] font-bold uppercase">
                        <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Cape Coast North Resource Hub</span>
                      </div>
                      <button onClick={reset} className="mt-3 w-full flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase py-2 transition-colors">
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