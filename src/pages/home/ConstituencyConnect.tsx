import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  Fingerprint,
  Database,
  Globe,
  Users,
  CheckCircle2,
} from "lucide-react";

const MOCK_DB = [
  { id: "23491005", firstName: "Kwame", surname: "Mensah", year: "1985", pollingStation: "Roman Catholic Prim. Sch. A" },
  { id: "99283741", firstName: "Ama", surname: "Osei", year: "1992", pollingStation: "Methodist JHS B" },
];

type ViewState = "search" | "login" | "register" | "verified";
type SearchState = "idle" | "searching" | "found" | "not_found";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function GridPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cc-grid)" />
    </svg>
  );
}

const STATS = [
  { icon: Users, label: "Members Verified", value: 4820, suffix: "+" },
  { icon: Globe, label: "Polling Stations", value: 186, suffix: "" },
  { icon: Database, label: "Records Online", value: 12400, suffix: "+" },
];

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

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

  const inputClasses =
    "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all duration-200 text-sm text-slate-800 placeholder:text-slate-400";

  return (
    <section className="relative py-20 md:py-32 bg-slate-900 overflow-hidden">
      <GridPattern />

      <FloatingOrb className="w-72 h-72 bg-green-500/10 blur-3xl top-10 -left-20" />
      <FloatingOrb className="w-96 h-96 bg-emerald-500/8 blur-3xl -bottom-20 right-0" />
      <FloatingOrb className="w-40 h-40 bg-teal-400/10 blur-2xl top-1/2 left-1/3" />

      <div className="absolute top-20 left-[15%] w-1.5 h-1.5 bg-green-400/40 rounded-full" />
      <div className="absolute top-32 right-[20%] w-1 h-1 bg-emerald-400/30 rounded-full" />
      <div className="absolute bottom-24 left-[10%] w-2 h-2 bg-green-500/20 rounded-full" />
      <div className="absolute bottom-40 right-[30%] w-1 h-1 bg-teal-300/30 rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              Live Data Portal
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1]">
              Constituency
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Connect
              </span>
            </h2>

            <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-md">
              Instantly verify your membership, find your polling station, and access your constituency records in real time.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-300">
                      <stat.icon className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <p className="text-2xl md:text-3xl font-extrabold text-white tabular-nums">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center"
                  >
                    <span className="text-[10px] text-white font-bold">
                      {["KM", "AO", "JA", "FK"][i]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-sm">
                <span className="text-green-400 font-semibold">24 people</span> verified today
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/10 min-h-[420px] flex flex-col">
              <AnimatePresence mode="wait">
                {view === "search" && (
                  <SearchView
                    key="search"
                    query={query}
                    setQuery={setQuery}
                    searchState={searchState}
                    searchProgress={searchProgress}
                    foundUser={foundUser}
                    onSearch={handleSearch}
                    onLogin={() => setView("login")}
                    onRegister={() => setView("register")}
                    inputClasses={inputClasses}
                  />
                )}

                {view === "login" && (
                  <LoginView
                    key="login"
                    onBack={handleReset}
                    onLogin={handleLogin}
                    inputClasses={inputClasses}
                  />
                )}

                {view === "register" && (
                  <RegisterView
                    key="register"
                    onBack={handleReset}
                    inputClasses={inputClasses}
                  />
                )}

                {view === "verified" && foundUser && (
                  <VerifiedView
                    key="verified"
                    user={foundUser}
                    onClose={handleReset}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SearchView({
  query,
  setQuery,
  searchState,
  searchProgress,
  foundUser,
  onSearch,
  onLogin,
  onRegister,
  inputClasses,
}: {
  query: string;
  setQuery: (q: string) => void;
  searchState: SearchState;
  searchProgress: number;
  foundUser: typeof MOCK_DB[0] | null;
  onSearch: (e: React.FormEvent) => void;
  onLogin: () => void;
  onRegister: () => void;
  inputClasses: string;
}) {
  return (
    <motion.div {...cardVariants} className="p-7 sm:p-9 flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
          <Fingerprint className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Search Records</h3>
          <p className="text-xs text-slate-400">Enter a name to check the database</p>
        </div>
      </div>

      <form onSubmit={onSearch}>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {searchState === "searching" ? (
              <Loader2 className="w-4.5 h-4.5 text-green-600 animate-spin" />
            ) : (
              <Search className="w-4.5 h-4.5 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            )}
          </div>
          <input
            type="text"
            placeholder="Enter surname to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputClasses} !pl-11`}
          />
        </div>

        {searchState === "searching" && (
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
          className="mt-4 w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          {searchState === "searching" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Check Status
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex-1 flex flex-col justify-end">
        <AnimatePresence mode="wait">
          {searchState === "found" && foundUser && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-green-50 border border-green-200/60 p-5 rounded-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-600/25">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-green-900 text-sm">
                      {foundUser.firstName} {foundUser.surname}
                    </p>
                    <p className="text-green-700 text-xs mt-0.5">Born {foundUser.year}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
                <button
                  onClick={onLogin}
                  className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm"
                >
                  Login to View Full Details
                </button>
              </div>
            </motion.div>
          )}

          {searchState === "not_found" && (
            <motion.div
              key="not_found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-amber-50 border border-amber-200/60 p-5 rounded-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-amber-900 text-sm">Not Found</p>
                    <p className="text-amber-700 text-xs mt-0.5">
                      No record for "{query}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={onRegister}
                  className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm"
                >
                  Request to Join
                </button>
              </div>
            </motion.div>
          )}

          {searchState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 border border-dashed border-slate-200 rounded-xl"
            >
              <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                Try searching <span className="font-semibold text-slate-500">"Mensah"</span> or{" "}
                <span className="font-semibold text-slate-500">"Osei"</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function LoginView({
  onBack,
  onLogin,
  inputClasses,
}: {
  onBack: () => void;
  onLogin: (e: React.FormEvent) => void;
  inputClasses: string;
}) {
  return (
    <motion.div {...cardVariants} className="p-7 sm:p-9 flex-1 flex flex-col">
      <button
        onClick={onBack}
        type="button"
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm font-medium mb-8 transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-8 h-8 text-green-700" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Verify Identity</h3>
        <p className="text-slate-400 text-sm mt-1.5">Enter your credentials to continue</p>
      </div>

      <form onSubmit={onLogin} className="space-y-3 flex-1 flex flex-col">
        <input type="tel" placeholder="Phone Number" className={inputClasses} required />
        <input type="text" placeholder="Year of Birth" className={inputClasses} required />
        <input type="password" placeholder="Password" className={inputClasses} required />
        <div className="pt-2 mt-auto">
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-green-700/20 text-sm"
          >
            Verify & Login
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function RegisterView({
  onBack,
  inputClasses,
}: {
  onBack: () => void;
  inputClasses: string;
}) {
  return (
    <motion.div {...cardVariants} className="p-7 sm:p-9">
      <button
        onClick={onBack}
        type="button"
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <UserPlus className="w-8 h-8 text-amber-700" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Join the Network</h3>
        <p className="text-slate-400 text-sm mt-1.5">Provide your details for verification</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="First Name" className={inputClasses} />
          <input type="text" placeholder="Surname" className={inputClasses} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Year of Birth" className={inputClasses} />
          <input type="tel" placeholder="Phone Number" className={inputClasses} />
        </div>
        <input type="password" placeholder="Create Password" className={inputClasses} />

        <div className="pt-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Residence</p>
          <div className="space-y-3">
            <input type="text" placeholder="Where do you stay?" className={inputClasses} />
            <input type="text" placeholder="How long have you lived there?" className={inputClasses} />
          </div>
        </div>

        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-amber-600/20 text-sm mt-2">
          Submit Request
        </button>
      </div>
    </motion.div>
  );
}

function VerifiedView({
  user,
  onClose,
}: {
  user: typeof MOCK_DB[0];
  onClose: () => void;
}) {
  return (
    <motion.div {...cardVariants} className="flex-1 flex flex-col">
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-8 sm:p-10 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="verified-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#verified-dots)" />
          </svg>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-white/10"
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-extrabold uppercase tracking-wider"
          >
            {user.firstName} {user.surname}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-3 text-green-200 font-mono text-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span className="tracking-[0.2em]">{user.id}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Member
          </motion.div>
        </div>
      </div>

      <div className="p-7 sm:p-9 flex-1 flex flex-col">
        <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Assigned Polling Station
          </p>
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-sm">
            <MapPin className="w-4.5 h-4.5 text-green-600 flex-shrink-0" />
            {user.pollingStation}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-auto pt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-medium text-sm w-full py-2.5 rounded-xl hover:bg-slate-50"
        >
          <X className="w-4 h-4" />
          Close
        </button>
      </div>
    </motion.div>
  );
}
