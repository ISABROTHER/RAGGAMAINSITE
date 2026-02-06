// src/pages/home/StatsStrip.tsx
import React, { useState } from "react";
import { Search, Loader2, X, CheckCircle, User, MapPin, Activity } from "lucide-react";

// This is "Mock Data" to simulate how the system works for the demo.
// In the future, this would be replaced by a real Supabase database query.
const DEMO_RESULTS: Record<string, any> = {
  "default": {
    name: "Kwame Mensah",
    id: "23491005",
    station: "Roman Catholic Prim. Sch. A",
    status: "Verified Member",
    lastVoted: "2020 General Election",
    contributions: "Standard Tier"
  }
};

export function StatsStrip() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 1. Start Loading
    setIsLoading(true);
    setResult(null);

    // 2. Simulate a network request delay (1.5 seconds)
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we always return the default mock user
      // No matter what they type.
      setResult(DEMO_RESULTS["default"]);
    }, 1500);
  };

  const closeResult = () => {
    setResult(null);
    setQuery("");
  };

  return (
    <section
      className="text-white py-8 md:py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #004528, #006B3F, #004528)" // NDC green hue band
      }}
    >
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Side: Text Info */}
          <div className="text-center md:text-left flex-1 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400 uppercase tracking-tight">
              Constituency Data Portal
            </h2>
            <p className="text-amber-50 text-sm sm:text-base max-w-xl mx-auto md:mx-0 font-medium leading-relaxed opacity-90">
              Verify your membership status, check your polling station details, and access your constituency records securely.
            </p>
          </div>

          {/* Right Side: Search Interface */}
          <div className="w-full md:w-auto flex-1 max-w-lg relative">
            <form onSubmit={handleSearch} className="relative group z-20">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading || result}
                placeholder="Enter Voter ID or Name..."
                className="w-full h-14 pl-6 pr-36 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all font-medium disabled:opacity-50"
              />
              
              <button
                type="submit"
                disabled={isLoading || !!result}
                className="absolute right-2 top-2 bottom-2 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span className="uppercase tracking-wider text-sm">Check</span>
                  </>
                )}
              </button>
            </form>

            {/* Simulated Search Result Card (Pop-up) */}
            {result && (
              <div className="absolute top-full mt-4 left-0 right-0 bg-white rounded-xl shadow-2xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
                {/* Header */}
                <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold uppercase tracking-wide text-sm">Record Found</span>
                  </div>
                  <button onClick={closeResult} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 text-slate-800 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-slate-200">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{result.name}</h3>
                      <p className="text-sm text-slate-500 font-medium">ID: {result.id}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">
                        {result.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-500 mt-1" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Polling Station</p>
                        <p className="text-sm font-semibold text-slate-700">{result.station}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-amber-500 mt-1" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold">Last Activity</p>
                        <p className="text-sm font-semibold text-slate-700">{result.lastVoted}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}