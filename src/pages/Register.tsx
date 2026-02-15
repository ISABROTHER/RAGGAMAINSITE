import { useState, useEffect } from 'react';
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
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Detect mobile keyboard open/close
  useEffect(() => {
    const initialHeight = window.innerHeight;
    const handleResize = () => {
      const isKeyboard = window.innerHeight < initialHeight * 0.75;
      setKeyboardOpen(isKeyboard);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll focused input into view on mobile
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

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
      <div className="min-h-screen min-h-[100dvh] bg-white flex flex-col relative overflow-hidden">
        {/* Ghana flag stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#006B3F]/[0.07] rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#FCD116]/[0.10] rounded-full blur-3xl" />
        </div>

        <div className="relative flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px] text-center"
          >
            <div className="bg-[#f0f7f4]/80 backdrop-blur-2xl rounded-3xl border border-[#006B3F]/[0.08] shadow-xl shadow-[#006B3F]/[0.06] p-8 sm:p-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-[#006B3F]/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-[#006B3F]" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-2xl font-black text-slate-900 mb-3"
              >
                Account Created
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-slate-500 text-sm leading-relaxed mb-8"
              >
                Your account has been set up successfully. Sign in to access your dashboard.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
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
    <div className="min-h-screen min-h-[100dvh] bg-white flex flex-col relative overflow-x-hidden overflow-y-auto">
      {/* Ghana flag stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 bg-[#CE1126] origin-left"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex-1 bg-[#FCD116] origin-left"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex-1 bg-[#006B3F] origin-left"
        />
      </div>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#006B3F]/[0.07] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#FCD116]/[0.10] rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#CE1126]/[0.04] rounded-full blur-3xl"
        />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-start sm:justify-center px-4 py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#006B3F] text-sm font-medium mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </motion.button>

          {/* Logo — hides when keyboard is open on mobile */}
          <AnimatePresence>
            {!keyboardOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="text-center mb-6"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 bg-gradient-to-br from-[#006B3F]/10 via-[#FCD116]/10 to-[#CE1126]/10 rounded-full blur-xl"
                  />
                  <img
                    src="https://i.imgur.com/1GfnCQc.png"
                    alt="Cape Coast North"
                    className="relative h-16 sm:h-24 object-contain mx-auto"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card — Tinted Frosted Glass */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#f0f7f4]/80 backdrop-blur-2xl rounded-3xl border border-[#006B3F]/[0.08] shadow-xl shadow-[#006B3F]/[0.06] p-5 sm:p-7"
          >
            {/* Green accent bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-1 w-16 bg-gradient-to-r from-[#006B3F] to-[#FCD116]/60 rounded-full mx-auto -mt-1 mb-6 origin-left"
            />

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-[#CE1126]/[0.06] border border-[#CE1126]/15 text-[#CE1126] text-sm rounded-xl px-4 py-3 font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-[11px] font-bold text-[#006B3F]/60 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Kwame Mensah"
                  className="w-full px-4 py-3.5 bg-white/70 border border-[#006B3F]/[0.08] rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/30 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all duration-200"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
              >
                <label className="block text-[11px] font-bold text-[#006B3F]/60 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 bg-white/70 border border-[#006B3F]/[0.08] rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/30 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all duration-200"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
              >
                <label className="block text-[11px] font-bold text-[#006B3F]/60 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+233</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="24 123 4567"
                    className="w-full pl-16 pr-4 py-3.5 bg-white/70 border border-[#006B3F]/[0.08] rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/30 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all duration-200"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44 }}
              >
                <label className="block text-[11px] font-bold text-[#006B3F]/60 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3.5 pr-12 bg-white/70 border border-[#006B3F]/[0.08] rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F]/30 focus:outline-none focus:ring-2 focus:ring-[#006B3F]/10 transition-all duration-200"
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
                    <motion.div
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 origin-left ${
                        password.length >= i * 2
                          ? password.length >= 8 ? 'bg-[#006B3F]' : 'bg-[#FCD116]'
                          : 'bg-[#006B3F]/[0.08]'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
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

            <div className="mt-5 pt-4 border-t border-[#006B3F]/[0.06] text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => onNavigate('login')} className="font-bold text-[#006B3F] hover:text-[#CE1126] transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}