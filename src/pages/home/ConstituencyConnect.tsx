import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserCheck,
  UserPlus,
  X,
  ShieldCheck,
  CreditCard,
  MapPin,
  Loader2,
  ArrowLeft,
  Users,
  Fingerprint,
} from "lucide-react";

const MOCK_DB = [
  { id: "23491005", firstName: "Kwame", surname: "Mensah", year: "1985", pollingStation: "Roman Catholic Prim. Sch. A" },
  { id: "99283741", firstName: "Ama", surname: "Osei", year: "1992", pollingStation: "Methodist JHS B" },
];

type ViewState = "search" | "login" | "register" | "verified";
type SearchState = "idle" | "searching" | "found" | "not_found";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  );
}

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [foundUser, setFoundUser] = useState<typeof MOCK_DB[0] | null>(null);
  const [view, setView] = useState<ViewState>("search");
  const [searchProgress, setSearchProgress] = useState(0);

  useEffect(() => {
    if (searchState !== "searching") {
      setSearchProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setSearchProgress((p) => Math.min(p + Math.random() * 30, 95));
    }, 200);
    return () => clearInterval(interval);
  }, [searchState]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchState("searching");
    setSearchProgress(0);

    setTimeout(() => {
      const result = MOCK_DB.find(
        (u) =>
          u.surname.toLowerCase().includes(query.toLowerCase()) ||
          u.firstName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchProgress(100);
      setTimeout(() => {
        if (result) {
          setFoundUser(result);
          setSearchState("found");
        } else {
          setSearchState("not_found");
        }
      }, 300);
    }, 1200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setView("verified");
  };

  const handleReset = () => {
    setQuery("");
    setSearchState("idle");
    setView("search");
    setFoundUser(null);
    setSearchProgress(0);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/60 via-white to-white" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-100/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <PulsingDot />
            Live Database
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Constituency Connect
          </h2>
          <p className="mt-3 text-slate-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Verify your membership and access your constituency details instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {view === "search" && (
              <motion.div key="search" {...scaleIn} className="p-6 sm:p-8 md:p-10">
                <form onSubmit={handleSearch} className="max-w-lg mx-auto">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {searchState === "searching" ? (
                        <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-green-600 transition-colors duration-200" />
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter surname to search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-base text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  {searchState === "searching" && (
                    <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${searchProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={searchState === "searching" || !query.trim()}
                    className="mt-4 w-full bg-green-700 hover:bg-green-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-green-700/20 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {searchState === "searching" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching Database...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4" />
                        Check Status
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 min-h-[60px]">
                  <AnimatePresence mode="wait">
                    {searchState === "found" && foundUser && (
                      <motion.div key="found" {...fadeUp} className="max-w-lg mx-auto">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/60 p-5 rounded-xl">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-green-600/30">
                              <UserCheck className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-green-900 text-sm uppercase tracking-wide">
                                Record Found
                              </h3>
                              <p className="text-green-800 mt-0.5 text-sm">
                                <span className="font-semibold">{foundUser.firstName} {foundUser.surname}</span> -- Born {foundUser.year}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setView("login")}
                            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm"
                          >
                            Login to Access Full Details
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {searchState === "not_found" && (
                      <motion.div key="not_found" {...fadeUp} className="max-w-lg mx-auto">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-5 rounded-xl">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-amber-500/30">
                              <UserPlus className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-amber-900 text-sm uppercase tracking-wide">
                                Not Found
                              </h3>
                              <p className="text-amber-800 mt-0.5 text-sm">
                                No record for "<span className="font-semibold">{query}</span>". You can request to join.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setView("register")}
                            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm"
                          >
                            Send Request to Join
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {searchState === "idle" && (
                      <motion.div key="idle" {...fadeUp} className="flex items-center justify-center gap-6 text-slate-400 pt-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="w-3.5 h-3.5" />
                          <span>Try "Mensah" or "Osei"</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {view === "login" && (
              <motion.div key="login" {...scaleIn} className="p-6 sm:p-8 md:p-10">
                <div className="max-w-sm mx-auto">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm font-medium mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to search
                  </button>

                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-7 h-7 text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Verify Your Identity</h3>
                    <p className="text-slate-500 text-sm mt-1">Enter your credentials to access details</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-3">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Year of Birth"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-green-700/20 text-sm mt-2"
                    >
                      Login
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {view === "register" && (
              <motion.div key="register" {...scaleIn} className="p-6 sm:p-8 md:p-10">
                <div className="max-w-md mx-auto">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm font-medium mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to search
                  </button>

                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-7 h-7 text-amber-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Join the Network</h3>
                    <p className="text-slate-500 text-sm mt-1">Provide your details for verification</p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm w-full"
                      />
                      <input
                        type="text"
                        placeholder="Surname"
                        className="px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Year of Birth"
                        className="px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm w-full"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm w-full"
                      />
                    </div>
                    <input
                      type="password"
                      placeholder="Create Password"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                    />

                    <div className="pt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Residence Information</p>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Where do you stay?"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="How long have you lived there?"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200/80 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>

                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-amber-600/20 text-sm mt-2">
                      Submit Request
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {view === "verified" && foundUser && (
              <motion.div key="verified" {...scaleIn} className="p-6 sm:p-8 md:p-12">
                <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30"
                  >
                    <ShieldCheck className="w-10 h-10 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-extrabold text-slate-900">Details Verified</h2>
                  <p className="text-slate-400 text-sm mt-1 mb-8">Access granted</p>

                  <div className="w-full rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="bg-gradient-to-br from-green-700 to-emerald-800 p-6 text-white">
                      <h3 className="text-xl font-black uppercase tracking-wide">
                        {foundUser.firstName} {foundUser.surname}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2 text-green-200 text-sm font-medium">
                        <CreditCard className="w-4 h-4" />
                        <span className="tracking-widest">{foundUser.id}</span>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Member
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Polling Station</p>
                      <div className="flex items-center justify-center gap-2 text-slate-800 font-semibold text-sm">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {foundUser.pollingStation}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="mt-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-medium text-sm px-5 py-2.5 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
