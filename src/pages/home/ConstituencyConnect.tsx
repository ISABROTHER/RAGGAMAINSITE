import React, { useState } from "react";
import { Search, UserCheck, UserPlus, Lock, Phone, Calendar, MapPin, Clock } from "lucide-react";

// Mock Database - Try searching for "Mensah" or "Osei"
const MOCK_DB = [
  { id: 1, firstName: "Kwame", surname: "Mensah", year: "1985" },
  { id: 2, firstName: "Ama", surname: "Osei", year: "1992" },
];

export function ConstituencyConnect() {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<"idle" | "searching" | "found" | "not_found">("idle");
  const [foundUser, setFoundUser] = useState<{ surname: string; year: string } | null>(null);
  const [view, setView] = useState<"search" | "login" | "register">("search");

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchState("searching");
    
    // Simulate finding a user after 1.5 seconds
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
    }, 1500);
  };

  const handleReset = () => {
    setQuery("");
    setSearchState("idle");
    setView("search");
    setFoundUser(null);
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden my-8">
      
      {/* --- 1. SEARCH VIEW --- */}
      {view === "search" && (
        <div className="p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 uppercase tracking-wide mb-2">
              Constituency Connect
            </h2>
            <p className="text-slate-500">Search to verify your membership status.</p>
          </div>

          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-green-600 transition-colors" />
              <input
                type="text"
                placeholder="Enter Surname (Try 'Mensah')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-lg"
              />
            </div>
            <button 
              type="submit"
              disabled={searchState === "searching"}
              className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-700/20 disabled:opacity-70"
            >
              {searchState === "searching" ? "Searching Database..." : "Check Status"}
            </button>
          </form>

          {/* Search Results Area */}
          <div className="mt-8 min-h-[100px] flex items-center justify-center">
            
            {/* FOUND STATE */}
            {searchState === "found" && foundUser && (
              <div className="w-full max-w-lg bg-green-50 border border-green-100 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-800">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-green-900">HON. RAGGA KNOWS YOU</h3>
                    <p className="text-green-800">Match: <strong>{foundUser.surname}</strong> (Born {foundUser.year})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setView("login")}
                  className="w-full bg-green-800 text-white font-bold py-3 rounded-xl hover:bg-green-900 transition-colors"
                >
                  Login to Access Full Details
                </button>
              </div>
            )}

            {/* NOT FOUND STATE */}
            {searchState === "not_found" && (
              <div className="w-full max-w-lg bg-red-50 border border-red-100 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center text-red-800">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-red-900">Not in System</h3>
                    <p className="text-red-800 text-sm">We couldn't find a record for "{query}".</p>
                  </div>
                </div>
                <p className="text-sm text-red-700/80 mb-3 text-center">Let us communicate with you.</p>
                <button 
                  onClick={() => setView("register")}
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Send Request to Join
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- 2. LOGIN VIEW --- */}
      {view === "login" && (
        <div className="p-8 md:p-12 bg-white animate-in zoom-in-95">
          <h3 className="text-2xl font-bold text-center mb-6">Access Details</h3>
          <div className="space-y-4 max-w-md mx-auto">
            <input type="tel" placeholder="Phone Number" className="w-full p-3 bg-slate-50 border rounded-xl" />
            <input type="text" placeholder="Year of Birth" className="w-full p-3 bg-slate-50 border rounded-xl" />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-50 border rounded-xl" />
            <button className="w-full bg-green-700 text-white font-bold py-4 rounded-xl">Login</button>
            <button onClick={handleReset} className="w-full text-slate-400 py-2">Cancel</button>
          </div>
        </div>
      )}

      {/* --- 3. REGISTER VIEW --- */}
      {view === "register" && (
        <div className="p-6 md:p-10 bg-white animate-in zoom-in-95">
          <h3 className="text-2xl font-bold text-center mb-2">Join the Network</h3>
          <p className="text-center text-slate-500 mb-6 text-sm">Full details required for verification.</p>
          
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="First Name" className="p-3 bg-slate-50 border rounded-xl w-full" />
              <input type="text" placeholder="Surname" className="p-3 bg-slate-50 border rounded-xl w-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Year of Birth" className="p-3 bg-slate-50 border rounded-xl w-full" />
              <input type="tel" placeholder="Phone Number" className="p-3 bg-slate-50 border rounded-xl w-full" />
            </div>
            <input type="password" placeholder="Create Password" className="w-full p-3 bg-slate-50 border rounded-xl" />
            
            <div className="pt-2 border-t mt-2">
              <p className="text-xs font-bold text-green-700 mb-2 uppercase">Residence Info</p>
              <input type="text" placeholder="Where do you stay?" className="w-full p-3 bg-slate-50 border rounded-xl mb-3" />
              <input type="text" placeholder="How long have you lived there?" className="w-full p-3 bg-slate-50 border rounded-xl" />
            </div>

            <button className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 mt-4">Submit Request</button>
            <button onClick={handleReset} className="w-full text-slate-400 py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}  