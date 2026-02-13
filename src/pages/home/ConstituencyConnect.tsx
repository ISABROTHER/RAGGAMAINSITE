// src/pages/home/ConstituencyConnect.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, ArrowLeft, ShieldCheck, Home, Globe, MessageSquare, Phone, Server, Search
} from "lucide-react";

const COMMUNITIES = [
  "Abura", "Adisadel", "Akotokyir", "Ankaful", "Antem", "Brabedze", 
  "Duakor", "Efutu", "Kakumdo", "Kwaprow", "Nkanfoa", "Nyinasin", 
  "Ola", "Pedu", "UCC"
].sort();

type ViewState = "search" | "searching" | "register" | "verified" | "results";
type ConstituentType = "Resident" | "Diaspora" | "Non-constituent";

const anim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const inputCls = "w-full px-3.5 py-3 bg-white/80 border border-slate-200 rounded-lg focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-slate-800 placeholder:text-slate-400";

// --- Loading Animation Component ---
function SearchLoadingBar({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="py-12 px-6 text-center relative overflow-hidden bg-white">
      <div className="relative z-20 flex flex-col items-center gap-4">
        <div className="relative">
          <Server className="w-10 h-10 text-green-600 animate-pulse" />
          <motion.div 
            className="absolute -inset-4 border-2 border-green-500/20 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Accessing AI Database</p>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <motion.div 
              className="h-full bg-green-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.3, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConstituencyConnect() {
  const [view, setView] = useState<ViewState>("search");
  const [showInfo, setShowInfo] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [userType, setUserType] = useState<ConstituentType | null>(null);

  const reset = () => {
    setView("search");
    setRegStep(1);
    setUserType(null);
  };

  const handleStartSearch = () => {
    setView("searching");
  };

  return (
    <section className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://i.imgur.com/5H0XBuV.jpeg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/85 backdrop-blur-sm mix-blend-multiply" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
            My <span className="text-green-300">Constituents</span>
          </h2>
          <p className="mt-4 text-green-50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium opacity-90">
            Cape Coast North constituents, register your details so my office can reach you and act on your issues. Obiara ka ho!
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[460px]">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
              <AnimatePresence mode="wait">
                
                {/* 1. INITIAL VIEW */}
                {view === "search" && (
                  <motion.div key="search" {...anim} className="p-5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        {/* ANIMATED AI LOGO */}
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden p-1">
                          <img 
                            src="https://cdn-icons-gif.flaticon.com/17556/17556437.gif" 
                            alt="AI Animated Logo" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">AI POWERED DATABASE</p>
                      </div>
                      <button onClick={() => setShowInfo(!showInfo)} className="px-3 py-1.5 rounded-lg border bg-green-50 border-green-200 text-green-700 text-[10px] font-bold uppercase hover:bg-green-100 transition-colors">
                        {showInfo ? "Close Info" : "Why Register?"}
                      </button>
                    </div>

                    {showInfo && (
                      <div className="bg-slate-50 rounded-xl p-4 mb-4 text-left space-y-4 border border-slate-100">
                         <div>
                            <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Purpose</h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed">We collect basic information to confirm you are a constituent and contact you when needed.</p>
                         </div>
                         <div>
                            <h4 className="font-bold text-green-700 uppercase text-[10px] mb-1">Benefits</h4>
                            <p className="text-[11px] text-slate-600 leading-relaxed">Stay informed when support or opportunities are available in the constituency.</p>
                         </div>
                         <div className="pt-2 border-t border-slate-200">
                            <p className="text-[10px] text-slate-400 italic">"We respect your privacy. Your details are used only for communication and updates."</p>
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 h-[52px]">
                      {/* ANIMATED SEARCH GIF BUTTON */}
                      <button 
                        onClick={handleStartSearch} 
                        className="relative h-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all group overflow-hidden"
                      >
                        <img 
                            src="https://cdn-icons-gif.flaticon.com/17569/17569494.gif" 
                            alt="Search Animation" 
                            className="w-8 h-8 object-contain"
                        />
                        <span className="text-xs font-black uppercase text-slate-700">Check Database</span>
                      </button>
                      
                      <button onClick={() => setView('register')} className="h-full flex items-center justify-center gap-2 bg-green-600 rounded-xl text-white font-black text-xs uppercase shadow-lg hover:bg-green-700 transition-colors">
                        <UserPlus className="w-3.5 h-3.5" /> Register Now
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. LOADING VIEW */}
                {view === "searching" && (
                  <motion.div key="searching" {...anim}>
                    <SearchLoadingBar onComplete={() => setView("results")} />
                  </motion.div>
                )}

                {/* 3. DATABASE SEARCH RESULTS */}
                {view === "results" && (
                  <motion.div key="results" {...anim} className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-slate-900 uppercase">Search the Records</p>
                      <input type="text" placeholder="Enter Voter ID or Phone Number" className={inputCls} />
                      <button className="w-full bg-green-600 text-white font-black py-3 rounded-xl text-xs uppercase shadow-lg">Find Record</button>
                    </div>
                    <button onClick={reset} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel Search</button>
                  </motion.div>
                )}

                {/* 4. REGISTRATION VIEW */}
                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-6 text-left">
                    <button onClick={reset} className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-black mb-6"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <h3 className="text-xs font-black text-slate-900 uppercase text-center mb-4 tracking-widest">Step 1: Who are you?</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => { setUserType("Resident"); setRegStep(2); }} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-green-500 transition-all active:scale-[0.98]">
                        <Home className="w-5 h-5 text-green-600" />
                        <p className="text-xs font-black text-slate-900 uppercase">I live in Cape Coast North</p>
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