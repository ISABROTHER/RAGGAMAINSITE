// src/pages/Volunteer.tsx

import { Construction, ArrowLeft } from 'lucide-react';

export function Volunteer() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 mb-6 shadow-sm">
          <Construction className="w-10 h-10" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          Page Under Construction
        </h1>

        {/* Copy */}
        <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
          This section is currently being rebuilt. Soon, you’ll be able to support
          CETRA2030, track contributions and volunteering, and see real-time impact
          across Cape Coast North.
        </p>

        {/* Back link */}
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#002B5B] hover:text-[#FF6B00] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <a href="/" className="underline-offset-4 hover:underline">
            Go back to the home page
          </a>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-slate-400">
          CETRA2030 · Cape Coast North · Prototype – Under Construction
        </p>
      </div>
    </div>
  );
}
