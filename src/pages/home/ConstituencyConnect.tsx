// src/components/ConstituencySearch.tsx
import React, { useState } from "react";
import { Search, UserCheck, UserPlus, Phone, Calendar, MapPin, Clock, X, ShieldCheck, CreditCard } from "lucide-react";

// Mock Database - Try searching for "Mensah" or "Osei"
const MOCK_DB = [
  { id: "23491005", firstName: "Kwame", surname: "Mensah", year: "1985", pollingStation: "Roman Catholic Prim. Sch. A" },
  { id: "99283741", firstName: "Ama", surname: "Osei", year: "1992", pollingStation: "Methodist JHS B" },
];

export default function ConstituencySearch() {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<"idle" | "searching" | "found" | "not_found">("idle");
  const [foundUser, setFoundUser] = useState<typeof MOCK_DB[0] | null>(null);
  const [view, setView] = useState<"search" | "login" | "register" | "verified">("search");

  // Handle Search
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
        setFoundUser(result);
        setSearchState("found");
      } else {
        setSearchState("not_found");
      }
    }, 1200);
  };

  // Handle Login (Simulated)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login -> go to Verified view
    setView("verified");
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
        <div className="p-8 md:p-12 bg-white animate-in zoom-in-95 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Access Details</h3>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="tel" placeholder="Phone Number" className="w-full p-3 bg-slate-50 border rounded-xl focus:border-green-500 outline-none" required />
            <input type="text" placeholder="Year of Birth" className="w-full p-3 bg-slate-50 border rounded-xl focus:border-green-500 outline-none" required />
            <input type="password" placeholder="Password" className="w-full p-3 bg-slate-50 border rounded-xl focus:border-green-500 outline-none" required />
            
            <button type="submit" className="w-full bg-green-700 text-white font-bold py-4 rounded-xl hover:bg-green-800">
              Login
            </button>
            <button onClick={handleReset} type="button" className="w-full text-slate-400 py-2 hover:text-slate-600">
              Cancel
            </button>
          </form>
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

      {/* --- 4. DETAILS VERIFIED VIEW --- */}
      {view === "verified" && foundUser && (
        <div className="p-8 md:p-12 bg-white animate-in zoom-in-95 flex flex-col items-center text-center max-w-md mx-auto">
          
          {/* Green Check Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50">
            <ShieldCheck className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-extrabold text-green-900 mb-1">Details Verified</h2>
          <p className="text-slate-400 text-sm mb-8">Access granted</p>

          {/* User Card */}
          <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {foundUser.firstName} {foundUser.surname}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mt-2 text-slate-500 font-medium">
                <CreditCard className="w-4 h-4" />
                <span>ID: <span className="text-slate-900 font-bold tracking-widest">{foundUser.id}</span></span>
              </div>
              
              <div className="mt-4 inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Member
              </div>
            </div>

            <div className="p-4 bg-white">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Polling Station</p>
              <div className="flex items-center justify-center gap-2 text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-green-600" />
                {foundUser.pollingStation}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={handleReset}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors font-medium px-6 py-3 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
            <span>Close</span>
          </button>
        </div>
      )}
    </div>
  );
}