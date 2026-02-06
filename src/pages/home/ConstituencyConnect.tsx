import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserCheck,
  UserPlus,
  X,
  ShieldCheck,
  MapPin,
  Loader2,
  ArrowLeft,
  Fingerprint,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

const MOCK_DB = [
  { id: "23491005", firstName: "Kwame", surname: "Mensah", phone: "0241234567", year: "1985", pollingStation: "Roman Catholic Prim. Sch. A" },
  { id: "99283741", firstName: "Ama", surname: "Osei", phone: "0209876543", year: "1992", pollingStation: "Methodist JHS B" },
  { id: "30587612", firstName: "Kofi", surname: "Adjei", phone: "0576040260", year: "1990", pollingStation: "D/A Primary Sch. C" },
];

type ViewState = "search" | "login" | "register" | "verified";

const anim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

const inputCls =
  "w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/10 transition-all text-sm text-slate-800 placeholder:text-slate-400";

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<typeof MOCK_DB[0] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<ViewState>("search");

  const reset = () => {
    setQuery("");
    setSearching(false);
    setFound(null);
    setNotFound(false);
    setView("search");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setFound(null);
    setNotFound(false);
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const r = MOCK_DB.find(
        (u) =>
          u.surname.toLowerCase().includes(q) ||
          u.firstName.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
      setSearching(false);
      if (r) setFound(r);
      else setNotFound(true);
    }, 900);
  };

  return (
    <section className="py-14 md:py-20 bg-slate-900">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            Live Portal
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Constituency{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
            Verify your membership, find your polling station, and access constituency records instantly.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl shadow-black/15 overflow-hidden">
          <AnimatePresence mode="wait">
            {view === "search" && (
              <motion.div key="search" {...anim} className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-green-700" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Search Records</p>
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
                    disabled={searching || !query.trim()}
                    className="mt-3 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    {searching ? "Searching..." : "Check Status"}
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
                          <p className="font-bold text-green-900 text-sm">{found.firstName} {found.surname}</p>
                          <p className="text-green-700 text-xs">Born {found.year}</p>
                        </div>
                        <CheckCircle2 className="w-4.5 h-4.5 text-green-500 flex-shrink-0" />
                      </div>
                      <button onClick={() => setView("login")} className="mt-3 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-all text-sm">
                        Login to View Details
                      </button>
                    </motion.div>
                  )}
                  {notFound && (
                    <motion.div key="nf" {...anim} className="mt-4 bg-amber-50 border border-amber-200/60 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserPlus className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-bold text-amber-900 text-sm">No record for "{query}"</p>
                      </div>
                      <button onClick={() => setView("register")} className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition-all text-sm">
                        Request to Join
                      </button>
                    </motion.div>
                  )}
                  {!found && !notFound && !searching && (
                    <motion.p key="hint" {...anim} className="mt-4 text-center text-xs text-slate-400 py-3">
                      Try <span className="font-semibold text-slate-500">"Mensah"</span>, <span className="font-semibold text-slate-500">"Osei"</span> or <span className="font-semibold text-slate-500">"0576040260"</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {view === "login" && (
              <motion.div key="login" {...anim} className="p-5">
                <button onClick={reset} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="text-center mb-5">
                  <ShieldCheck className="w-7 h-7 text-green-700 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-slate-900">Verify Identity</h3>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setView("verified"); }} className="space-y-2.5">
                  <input type="tel" placeholder="Phone Number" className={inputCls} required />
                  <input type="text" placeholder="Year of Birth" className={inputCls} required />
                  <input type="password" placeholder="Password" className={inputCls} required />
                  <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-all text-sm mt-1">
                    Verify & Login
                  </button>
                </form>
              </motion.div>
            )}

            {view === "register" && (
              <motion.div key="register" {...anim} className="p-5">
                <button onClick={reset} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-5">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="text-center mb-5">
                  <UserPlus className="w-7 h-7 text-amber-700 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-slate-900">Join the Network</h3>
                </div>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <input type="text" placeholder="First Name" className={inputCls} />
                    <input type="text" placeholder="Surname" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input type="text" placeholder="Year of Birth" className={inputCls} />
                    <input type="tel" placeholder="Phone" className={inputCls} />
                  </div>
                  <input type="password" placeholder="Create Password" className={inputCls} />
                  <input type="text" placeholder="Where do you stay?" className={inputCls} />
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition-all text-sm">
                    Submit Request
                  </button>
                </div>
              </motion.div>
            )}

            {view === "verified" && found && (
              <motion.div key="verified" {...anim}>
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-center text-white">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                    <ShieldCheck className="w-8 h-8 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-lg font-extrabold uppercase tracking-wider">{found.firstName} {found.surname}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1.5 text-green-200 font-mono text-xs">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="tracking-widest">{found.id}</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <div className="p-5">
                  <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{found.pollingStation}</span>
                  </div>
                  <button onClick={reset} className="mt-3 w-full flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm py-2">
                    <X className="w-3.5 h-3.5" /> Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
