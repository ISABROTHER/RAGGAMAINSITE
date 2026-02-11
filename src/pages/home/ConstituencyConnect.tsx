import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Users,
  BellRing,
  ClipboardList
} from "lucide-react";

type ViewState = "intro" | "register" | "success";

const anim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25 },
};

const inputCls =
  "w-full px-3.5 py-3 bg-white/80 border border-slate-200 rounded-lg focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-slate-800 placeholder:text-slate-400";

export function ConstituencyConnect() {
  const [view, setView] = useState<ViewState>("intro");
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    phone: "",
    community: "",
    skill: ""
  });

  const reset = () => {
    setView("intro");
    setFormData({ firstName: "", surname: "", phone: "", community: "", skill: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("success");
  };

  return (
    <section className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Side: Info */}
          <div className="mb-10 lg:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Talent & Opportunity{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Hub
              </span>
            </h2>
            <p className="mt-4 text-slate-400 text-base md:text-lg leading-relaxed max-w-md">
              Are you a constituent of Cape Coast North? Register your profile in our community database to stay informed about jobs, skills training, and empowerment initiatives.
            </p>

            <div className="flex flex-col gap-4 mt-8">
              {[
                { label: "Skills Matching", desc: "Get notified when roles match your profession", icon: Briefcase },
                { label: "Direct Access", desc: "Be part of the MP's priority resource list", icon: Users },
                { label: "Community Alerts", desc: "Real-time updates on local opportunities", icon: BellRing },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Interactive Card */}
          <div className="w-full max-w-[440px] mx-auto lg:mr-0">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">
              <AnimatePresence mode="wait">
                
                {view === "intro" && (
                  <motion.div key="intro" {...anim} className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                      <ClipboardList className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Join the Database</h3>
                    <p className="text-slate-500 mb-8">Register your details today to ensure you don't miss out on community-specific opportunities.</p>
                    
                    <button 
                      onClick={() => setView("register")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 group"
                    >
                      <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Register My Profile
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                      Strictly for Cape Coast North Residents
                    </p>
                  </motion.div>
                )}

                {view === "register" && (
                  <motion.div key="register" {...anim} className="p-6 md:p-8">
                    <button onClick={reset} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm mb-6 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Constituent Registration</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="First Name" 
                          className={inputCls} 
                          required 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                        <input 
                          type="text" 
                          placeholder="Surname" 
                          className={inputCls} 
                          required 
                          value={formData.surname}
                          onChange={(e) => setFormData({...formData, surname: e.target.value})}
                        />
                      </div>
                      <input 
                        type="tel" 
                        placeholder="Phone Number (WhatsApp preferred)" 
                        className={inputCls} 
                        required 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Residential Community (e.g., Abura, Pedu)" 
                        className={inputCls} 
                        required 
                        value={formData.community}
                        onChange={(e) => setFormData({...formData, community: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Your Profession or Main Skill" 
                        className={inputCls} 
                        required 
                        value={formData.skill}
                        onChange={(e) => setFormData({...formData, skill: e.target.value})}
                      />
                      
                      <button 
                        type="submit" 
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-xl mt-2"
                      >
                        Submit Information
                      </button>
                    </form>
                  </motion.div>
                )}

                {view === "success" && (
                  <motion.div key="success" {...anim} className="p-10 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete</h3>
                    <p className="text-slate-500 mb-8">
                      Thank you, <span className="font-bold text-slate-900">{formData.firstName}</span>. Your details have been securely added to the Cape Coast North Talent Hub.
                    </p>
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 text-left mb-8 border border-slate-100">
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Assigned Area</p>
                        <p className="text-sm font-bold text-slate-800">{formData.community} Zone</p>
                      </div>
                    </div>
                    <button 
                      onClick={reset}
                      className="text-green-600 font-bold hover:text-green-700 transition-colors"
                    >
                      Done
                    </button>
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