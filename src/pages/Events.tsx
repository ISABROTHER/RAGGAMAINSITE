import { Calendar } from 'lucide-react';

export function Events() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 md:p-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
            <Calendar className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Under Construction
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-8">
            We're working hard to bring you the Events page. Check back soon!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
