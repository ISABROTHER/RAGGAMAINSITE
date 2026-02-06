// src/pages/home/ConstituencyConnect.tsx
import React, { useState } from "react";
import { Search, Loader2, X, CheckCircle, User, MapPin } from "lucide-react";

// Mock Data for Demo
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

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      setResult(DEMO_RESULTS["default"]);
    }, 1500);
  };

  const closeResult = () => {
    setResult(null);
    setQuery("");
  };

  return (
    <section
      className="text-white py-6 md:py-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #004528, #006B3F, #004528)" // NDC green hue band
      }}
    >
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left Side: MP's Message */}
          <div className="text-center md:text-left flex-1 space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 uppercase tracking-tight">
              Constituency Connect
            </h2>
            <div>
              <p className="text-amber-50 text-sm sm:text-base max-w-xl mx-auto md:mx-0 font-medium leading-relaxed opacity-90">
                To serve you better, I must know you. Verify your details here to ensure you are included in our development plans. Together, we move forward!
              </p>
            </div>
          </div>

          {/* Right Side: Search Interface (Flutter Style) */}
          <div className="w-full md:w-auto flex-1 max-w-lg relative">
            <form onSubmit={handleSearch} className="relative z-20 bg-white/5 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
              <div className="relative flex items-center">
                
                {/* Flutter-style Floating Label Input */}
                <div className="relative w-full">
                  <input
                    type="tel"
                    id="phone_input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isLoading || result}
                    className="peer block w-full px-0 py-2.5 text-base text-white bg-transparent border-0 border-b-2 border-white/40 appearance-none focus:outline-none focus:ring-0 focus:border-amber-400 transition-colors"
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone_input"
                    className="absolute text-sm text-white/60 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-amber-400 peer-focus:scale-75 peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-white/60"
                  >
                    Enter Telephone Number
                  </label>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  disabled={isLoading || !!result}
                  className="ml-4 p-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white rounded-full shadow-md transition-all hover:shadow-lg active:scale-95 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Result Modal - Displays Centered on Screen (No longer beneath the input) */}
      {result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-bold uppercase tracking-wide text-sm">Details Verified</span>
              </div>
              <button 
                onClick={closeResult} 
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-slate-800 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-slate-200">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{result.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">ID: {result.id}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase">
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Polling Station</p>
                    <p className="text-base font-semibold text-slate-700 leading-tight">{result.station}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={closeResult}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}