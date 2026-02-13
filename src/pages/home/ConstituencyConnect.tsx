// src/pages/home/ConstituencyConnect.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, UserCheck, UserPlus, X, ShieldCheck, MapPin, 
  ArrowLeft, Fingerprint, Info, Server, Phone, CheckCircle2,
  Globe, UserMinus, ShieldQuestion
} from "lucide-react";

// Community List for Residents/Diaspora
const COMMUNITIES = ["Abura", "Adisadel", "Akotokyir", "Ankaful", "Antem", "Brabedze", "Duakor", "Efutu", "Kakumdo", "Kwaprow", "Nkanfoa", "Nyinasin", "Ola", "Pedu", "UCC"].sort();

type Category = "Resident" | "Diaspora" | "Non-Constituent";

export function ConstituencyConnect() {
  const [view, setView] = useState<"access" | "form" | "otp" | "verified">("access");
  const [category, setCategory] = useState<Category | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const reset = () => {
    setView("access");
    setCategory(null);
    setPhoneNumber("");
  };

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setView("form");
  };

  return (
    <section className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      {/* Background with Green Frosted Overlay */}
      <div className="absolute inset-0">
        <img src="https://i.imgur.com/5H0XBuV.jpeg" className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-green-900/85 backdrop-blur-sm mix-blend-multiply" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
            My <span className="text-green-300">Constituents</span>
          </h2>
          <p className="mt-4 text-green-50 text-sm opacity-90 max-w-lg mx-auto">
            Join the database to receive updates and access support opportunities.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            
            {/* --- STEP 1: CHOOSE CATEGORY --- */}
            {view === "access" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-black text-slate-900 uppercase">Database Access</p>
                  <button onClick={() => setShowInfo(!showInfo)} className="text-green-700 bg-green-50 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Why Register?
                  </button>
                </div>

                {showInfo && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="mb-6 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                    Your information is used only for constituency work and is not sold or published.
                  </motion.div>
                )}

                <div className="space-y-3">
                  <button onClick={() => handleCategorySelect("Resident")} className="w-full group relative flex items-center gap-4 p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 rounded-xl transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm"><MapPin className="w-5 h-5 text-green-600" /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">I live in Cape Coast North</p>
                      <p className="text-[10px] text-slate-500">Resident Constituent</p>
                    </div>
                  </button>

                  <button onClick={() => handleCategorySelect("Diaspora")} className="w-full group relative flex items-center gap-4 p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 rounded-xl transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm"><Globe className="w-5 h-5 text-blue-600" /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">Constituent living outside</p>
                      <p className="text-[10px] text-slate-500">Diaspora / Outside CC North</p>
                    </div>
                  </button>

                  <button onClick={() => handleCategorySelect("Non-Constituent")} className="w-full group relative flex items-center gap-4 p-4 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-300 rounded-xl transition-all text-left">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm"><UserMinus className="w-5 h-5 text-slate-500" /></div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">Not a constituent</p>
                      <p className="text-[10px] text-slate-500">Visitor / Business / Service</p>
                    </div>
                  </button>
                </div>
                <p className="mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center italic">One phone number per record</p>
              </div>
            )}

            {/* --- STEP 2: MINIMUM DETAILS FORM --- */}
            {view === "form" && (
              <div className="p-6 text-left">
                <button onClick={reset} className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase mb-4"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                <div className="mb-6 pb-4 border-b border-slate-100">
                  <p className="text-[10px] font-black text-green-600 uppercase">Step 2: Enter Details</p>
                  <h3 className="text-sm font-black text-slate-900 uppercase">You chose {category}</h3>
                </div>

                <div className="space-y-4">
                  <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                  <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" />

                  {/* Conditional Community Field */}
                  {category !== "Non-Constituent" && (
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none">
                      <option value="">Select Home Community</option>
                      {COMMUNITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}

                  {category === "Diaspora" && (
                    <input type="text" placeholder="Current City/Country" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  )}

                  {category === "Non-Constituent" && (
                    <input type="text" placeholder="Reason for Contact (Service/Business)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                  )}

                  <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Occupation (Optional)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {["Student", "Worker", "Business"].map(occ => (
                        <button key={occ} className="py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-green-600 hover:text-white transition-all">{occ}</button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => setView("otp")} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest mt-4">Verify & Submit</button>
                </div>
              </div>
            )}

            {/* --- STEP 3: OTP VERIFICATION --- */}
            {view === "otp" && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="w-8 h-8" /></div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Confirm Phone</h3>
                <p className="text-[11px] text-slate-500 mt-2 mb-6 leading-relaxed">We've sent a code to {phoneNumber}. Enter it below to verify your record.</p>
                
                <input type="text" maxLength={4} className="w-32 text-center text-2xl font-black tracking-[1em] border-b-2 border-slate-900 focus:outline-none mb-8" />
                
                <button onClick={() => setView("verified")} className="w-full bg-green-600 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest mb-4">Complete Registration</button>
                <button onClick={() => setView("form")} className="text-[10px] font-bold text-slate-400 uppercase underline">Wait, I made a mistake</button>
              </div>
            )}

            {/* --- SUCCESS VIEW --- */}
            {view === "verified" && (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-600/20"><CheckCircle2 className="w-12 h-12" /></div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Success!</h3>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">You are now registered as a {category}. We will reach out if verification is required.</p>
                <button onClick={reset} className="mt-8 text-xs font-black text-green-700 uppercase tracking-widest border-2 border-green-700 px-6 py-2 rounded-lg">Return Home</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}