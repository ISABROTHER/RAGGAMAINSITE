import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export function AboutHero() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-600/20 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-600/10 backdrop-blur-sm border border-green-500/20 px-4 py-2 rounded-full mb-6">
            <User className="w-4 h-4 text-green-400" />
            <span className="text-green-300 font-bold text-sm uppercase tracking-wider">About the Honorable</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Hon. Dr. Kwamena <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Minta Nyarku
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Member of Parliament for Cape Coast North Constituency
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-bold text-slate-400">
            <span className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">National Democratic Congress</span>
            <span className="px-4 py-2 bg-green-600/20 text-green-300 rounded-lg border border-green-500/20">Obiara Ka Ho</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
    </div>
  );
}
