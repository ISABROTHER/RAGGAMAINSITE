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
} from "lucide-react";

const MOCK_DB = [
  { id: "CCN-001", firstName: "Kwame", surname: "Mensah", phone: "0241234567", skill: "Education", community: "Abura" },
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
  { label: "Connecting to database", icon: Database, duration: 600 },
  { label: "Scanning records", icon: ScanSearch, duration: 500 },
  { label: "Verifying match", icon: ShieldAlert, duration: 400 },
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
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md"
        >
          <Icon className="w-4 h-4 text-white" />
        </motion.div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">{SEARCH_STEPS[step].label}</p>
        </div>
        <span className="text-xs font-bold text-green-600">{Math.round(progress)}%</span>
      </div>
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-green-500"
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
    const r = MOCK_DB.find(u => u.surname.toLowerCase().includes(q) || u.phone.includes(q));
    if (r) setFound(r);
    else setNotFound(true);
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
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          
          <div className="lg:flex-1 lg:pt-4 mb-6 lg:mb-0">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Constituent <span className="text-green-400">Connect</span>
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
              Register your details to stay informed about community projects and opportunities in Cape Coast North.
            </p>

            <div className="hidden lg:flex flex-col gap-3 mt-8">
              {[
                { label: "Update Info", desc: "Keep your details current with the MP's office" },
                { label: "Opportunities", desc: "Get notified about local jobs and training" },
                { label: "Direct Access", desc: "Be part of the constituency database" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-[400px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {view === "searching" && (
                  <motion.div key="searching" {...anim}>
                    <SearchLoadingBar onComplete={handleSearchComplete} />
                  </motion.div>
                )}

                {view === "search" && (
                  <motion.div key="search" {...anim} className="p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
                        <Fingerprint className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Check Registration</p>
                        <p className="text-[10px] text-slate-400">Find your profile in the database</p>
                      </div>
                    </div>

                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                        className="mt-3 w-full bg-slate-900 text-white font-semibold py-2.5 rounded-lg transition-all text-sm"
                      >
                        Check Status
                      </button>
                    </form>

                    {found && (
                      <motion.div {...anim} className="mt-4 bg-green-50 border border-green-200/60 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <div className="flex-1">
                            <p className="font-bold text-green-900 text-sm">{found.firstName} {found.surname}</p>
                            <p className="text-green-700 text-xs">{found.community}</p>
                          </div>
                        </div>
                        <button onClick={() => setView("verified")} className="mt-3 w-full bg-green-700 text-white font-semibold py-2 rounded-lg text-sm">
                          View My Details
                        </button>
                      </motion.div>
                    )}
                    {notFound && (
                      <motion.div {...anim} className="mt-4 bg-amber-50 border border-amber-200/60 p-4 rounded-lg">
                        <p className="font-bold text-amber-900 text-sm mb-2">Not yet registered?</p>
                        <button onClick={() => setView("register")} className="w-full bg-amber-600 text-white font-semibold py-2 rounded-lg text-sm">
                          Add My Information
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-5">
                    <button onClick={reset} className="flex items-center gap-1 text-slate-400 text-sm mb-4">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <h3 className="text-base font-bold text-slate-900 mb-4">Add My Information</h3>
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input type="text" placeholder="First Name" className={inputCls} />
                        <input type="text" placeholder="Surname" className={inputCls} />
                      </div>
                      <input type="tel" placeholder="Phone Number" className={inputCls} />
                      <input type="text" placeholder="Community (e.g. Abura)" className={inputCls} />
                      <input type="text" placeholder="Skill or Area of Interest" className={inputCls} />
                      <button onClick={() => setView("verified")} className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg text-sm">
                        Submit Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "verified" && (
                  <motion.div key="verified" {...anim}>
                    <div className="bg-green-600 p-6 text-center text-white">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-lg font-bold">Profile Registered</p>
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase font-bold mt-2 inline-block">Verified</span>
                    </div>
                    <div className="p-5">
                      <div className="bg-slate-50 rounded-lg p-3 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-slate-800">Cape Coast North Registry</span>
                      </div>
                      <button onClick={reset} className="mt-3 w-full flex items-center justify-center gap-1 text-slate-400 text-sm">
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