import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, ArrowLeft, Users, Landmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

const ROLES = [
  { key: 'constituent', label: 'Constituent', desc: 'Community member', icon: Users, color: 'bg-green-600' },
  { key: 'assemblyman', label: 'Assemblyman', desc: 'Assembly representative', icon: Landmark, color: 'bg-blue-600' },
  { key: 'admin', label: 'Administrator', desc: 'System manager', icon: ShieldCheck, color: 'bg-[#CE1126]' },
] as const;

export function Register({ onNavigate }: RegisterProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('constituent');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error: err } = await signUp(email, password, { full_name: fullName, phone });

    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update({
        full_name: fullName,
        phone,
        email,
        role,
      }).eq('id', session.user.id);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[400px] text-center"
          >
            <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-3">Account Created</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Your account has been set up successfully. Sign in to access your {role} dashboard.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('login')}
                className="flutter-btn w-full py-4 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2.5 transition-colors"
              >
                Go to Sign In
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#CE1126]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </button>

          <div className="text-center mb-6">
            <img
              src="https://i.imgur.com/1GfnCQc.png"
              alt="Cape Coast North"
              className="h-16 sm:h-20 object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Join the Network</h1>
            <p className="text-slate-400 mt-1.5 text-sm">Create your constituency account</p>
          </div>

          <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-7">
            <div className="mb-5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  const active = role === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key)}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                        active
                          ? 'bg-white/10 border-white/25 text-white'
                          : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/15 hover:text-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${active ? r.color : 'bg-white/5'} flex items-center justify-center transition-colors`}>
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <span className="text-[11px] font-bold leading-tight">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-4 py-3 font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Kwame Mensah"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="024 123 4567"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3.5 pr-12 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= i * 2
                          ? password.length >= 8 ? 'bg-green-500' : 'bg-amber-400'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="flutter-btn w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => onNavigate('login')} className="font-bold text-white hover:text-[#CE1126] transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
