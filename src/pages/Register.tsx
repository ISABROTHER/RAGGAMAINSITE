import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export function Register({ onNavigate }: RegisterProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
        role: 'constituent',
      }).eq('id', session.user.id);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        {/* Ghana flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#006B3F]/[0.08] rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#FCD116]/[0.12] rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[420px] text-center"
          >
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-xl shadow-slate-200/40 p-8 sm:p-10 ring-1 ring-slate-900/[0.04]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-[#006B3F]/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-[#006B3F]" />
              </motion.div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Account Created</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Your account has been set up successfully. Sign in to access your dashboard.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('login')}
                className="flutter-btn w-full py-4 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#CE1126]/20 flex items-center justify-center gap-2.5 transition-colors"
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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Ghana flag stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
        <div className="flex-1 bg-[#006B3F]" />
      </div>

      {/* Background color blobs for frosted glass effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#006B3F]/[0.08] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#FCD116]/[0.12] rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#CE1126]/[0.06] rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#006B3F] text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute -inset-3 bg-gradient-to-br from-[#006B3F]/10 via-[#FCD116]/10 to-[#CE1126]/10 rounded-full blur-xl" />
              <img
                src="https://i.imgur.com/1GfnCQc.png"
                alt="Cape Coast North"
                className="relative h-20 sm:h-24 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Card — Frosted Glass */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-xl shadow-slate-200/40 p-5 sm:p-7 ring-1 ring-slate-900/[0.04]">
            {/* Green accent bar */}
            <div className="h-1 w-16 bg-gradient-to-r from-[#006B3F] to-[#006B3F]/40 rounded-full mx-auto -mt-1 mb-6" />

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#CE1126]/5 border border-[#CE1126]/15 text-[#CE1126] text-sm rounded-xl px-4 py-3 font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Kwame Mensah"
                  className="w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/40 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/40 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+233</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="24 123 4567"
                    className="w-full pl-16 pr-4 py-3.5 bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/40 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3.5 pr-12 bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/40 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-[#006B3F] transition-colors"
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
                          ? password.length >= 8 ? 'bg-[#006B3F]' : 'bg-[#FCD116]'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="flutter-btn w-full py-4 bg-[#006B3F] hover:bg-[#005a34] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#006B3F]/20 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
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

            <div className="mt-5 pt-4 border-t border-white/50 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => onNavigate('login')} className="font-bold text-[#006B3F] hover:text-[#CE1126] transition-colors">
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