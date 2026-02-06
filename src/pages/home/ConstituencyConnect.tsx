// src/components/ConstituencySearch.tsx
import React, { useState } from "react";
import { Search, UserCheck, UserPlus, Lock, Phone, Calendar, MapPin, Clock, User } from "lucide-react";

// Mock Data for demonstration
const MOCK_DB = [
  { id: 1, firstName: "Kwame", surname: "Mensah", year: "1985" },
  { id: 2, firstName: "Ama", surname: "Osei", year: "1992" },
];

export function ConstituencySearch() {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<"idle" | "searching" | "found" | "not_found">("idle");
  const [foundUser, setFoundUser] = useState<{ surname: string; year: string } | null>(null);
  const [view, setView] = useState<"search" | "login" | "register">("search");

  // Handle Search Logic
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchState("searching");
    
    // Simulate API delay
    setTimeout(() => {
      const result = MOCK_DB.find((u) => 
        u.surname.toLowerCase().includes(query.toLowerCase()) || 
        u.firstName.toLowerCase().includes(query.toLowerCase())
      );

      if (result) {
        setFoundUser({ surname: result.surname, year: result.year });
        setSearchState("found");
      } else {
        setSearchState("not_found");
      }
    }, 800);
  };

  // Reset to start
  const handleReset = () => {
    setQuery("");
    setSearchState("idle");
    setView("search");
    setFoundUser(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      
      {/* --- INITIAL SEARCH VIEW --- */}
      {view === "search" && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-extrabold text-green-800 mb-2">Constituency Connect</h2>
            <p className="text-slate-500 mb-8">Search to see if you are in the registry.</p>

            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter your name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <button 
                type="submit"
                className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-700/20"
              >
                {searchState === "searching" ? "Searching..." : "Check Status"}
              </button>
            </form>
          </div>

          {/* --- RESULTS SECTION --- */}
          <div className="bg-slate-50 p-6 border-t border-slate-100 min-h-[200px] flex items-center justify-center">
            
            {searchState === "idle" && (
              <div className="text-slate-400 text-sm">Results will appear here</div>
            )}

            {/* OPTION 1: USER FOUND */}
            {searchState === "found" && foundUser && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-2xl border-l-4 border-green-500 shadow-sm flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">HON. RAGGA KNOWS YOU</h3>
                    <p className="text-slate-600">
                      Match found: <span className="font-semibold text-green-700">{foundUser.surname}</span> (Born {foundUser.year})
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">Want to see your full details?</p>
                  <button 
                    onClick={() => setView("login")}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Login to Access Full Details
                  </button>
                </div>
              </div>
            )}

            {/* OPTION 2: USER NOT FOUND */}
            {searchState === "not_found" && (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-sm flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <UserPlus className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Not in the System</h3>
                    <p className="text-slate-600 text-sm">
                      We couldn't find a record for "{query}".
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">Let us communicate with you.</p>
                  <button 
                    onClick={() => setView("register")}
                    className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Send Request to Join
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- LOGIN VIEW (If Found) --- */}
      {view === "login" && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Access Full Details</h3>
            <p className="text-slate-500 text-sm mt-1">Verify your identity to proceed</p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="tel" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="024 XXX XXXX" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="YYYY" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="••••••" />
              </div>
            </div>

            <button className="w-full bg-green-700 text-white font-bold py-4 rounded-xl mt-4 hover:bg-green-800 transition-colors">
              Login
            </button>
            <button onClick={handleReset} type="button" className="w-full text-slate-400 text-sm font-medium py-2 hover:text-slate-600">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* --- REGISTER VIEW (If Not Found) --- */}
      {view === "register" && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Let's Connect</h3>
            <p className="text-slate-500 text-sm mt-1">Please provide your details to join the network.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="Kwame" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Surname</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="Mensah" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="1990" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="024..." />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="password" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="Create a password" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 mt-2">
               <p className="text-xs text-green-700 font-bold uppercase mb-3">Residence Details</p>
               <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Where do you stay?</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="e.g. Adisadel Village, House No. 12" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">How long have you lived there?</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 focus:outline-none" placeholder="e.g. 10 years" />
                    </div>
                 </div>
               </div>
            </div>

            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
              Submit Request
            </button>
            <button onClick={handleReset} type="button" className="w-full text-slate-400 text-sm font-medium py-2 hover:text-slate-600">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 