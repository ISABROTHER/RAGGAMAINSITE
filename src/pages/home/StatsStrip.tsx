// src/pages/home/StatsStrip.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";

export function StatsStrip() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // In a real app, this would query the backend
    console.log("Searching for:", query);
    alert(`Search feature coming soon! You typed: ${query}`);
  };

  return (
    <section
      className="text-white py-6 md:py-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #004528, #006B3F, #004528)" // NDC green hue band
      }}
    >
      <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          
          {/* Text / Info Side */}
          <div className="text-center md:text-left flex-1 space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 uppercase tracking-tight">
              Constituency Data Portal
            </h2>
            <p className="text-amber-50 text-sm sm:text-base max-w-xl mx-auto md:mx-0 font-medium leading-relaxed">
              Access your personal records and verify the information stored about you in the MP's constituency database.
            </p>
          </div>

          {/* Interaction / Search Side */}
          <div className="w-full md:w-auto flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Voter ID or Full Name..."
                className="w-full h-12 md:h-14 pl-5 pr-32 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-amber-400 focus:bg-white/20 transition-all font-medium"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 md:px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-md transition-all shadow-lg flex items-center gap-2 group-hover:scale-[1.02]"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base uppercase tracking-wider">Check</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}