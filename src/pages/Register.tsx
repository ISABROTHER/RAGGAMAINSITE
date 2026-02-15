import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export function Register({ onNavigate }: RegisterProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const initialHeight = window.innerHeight;
    const handleResize = () => setKeyboardOpen(window.innerHeight < initialHeight * 0.75);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    };
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedPhone = phone.replace(/\D/g, '');
    if (trimmedPhone.length < 9) {
      setError('Enter a valid phone number');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!recoveryEmail.includes('@')) {
      setError('Enter a valid recovery email');
      return;
    }

    setLoading(true);

    // Use phone-based email as Supabase auth identity
    const authEmail = `${trimmedPhone}@phone.ccn.local`;

    const { error: err } = await signUp(authEmail, password, {
      full_name: fullName,
      phone: trimmedPhone,
    });

    if (err) {
      if (err.toLowerCase().includes('already registered')) {
        setError('This phone number is already registered');
      } else {
        setError(err);
      }
      setLoading(false);
      return;
    }

    // Save full profile with recovery email
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update({
        full_name: fullName,
        phone: trimmedPhone,
        email: recoveryEmail,
        role: 'constituent',
      }).eq('id', session.user.id);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen min-h-[100dvh] bg-[#fafafa] flex flex-col relative overflow-hidden">
        <div className="fixed top-0 left-0 right-0 h-1 flex z-20">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        <div className="relative flex-1 flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[400px] text-center"
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/[0.04] p-7 sm:p-9">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-[#006B3F]/10 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-8 h-8 text-[#006B3F]" />
              </motion.div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Account Created</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                You can now sign in with your phone number and password.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('login')}
                className="w-full py-3.5 bg-[#CE1126] hover:bg-[#b30f21] active:bg-[#9a0d1c] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
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
    <div className="min-h-screen min-h-[100dvh] bg-[#fafafa] flex flex-col relative overflow-x-hidden overflow-y-auto">
      {/* Ghana flag stripe */}
      <div className="fixed top-0 left-0 right-0 h-1 flex z-20">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
        <div className="flex-1 bg-[#006B3F]" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-start sm:justify-center px-4 pt-8 pb-6 sm:py-12">
        <div className="w-full max-w-[400px]">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#006B3F] text-sm font-medium mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </motion.button>

          {/* Logo — collapses on keyboard */}
          <AnimatePresence>
            {!keyboardOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-6"
              >
                <img
                  src="https://i.imgur.com/1GfnCQc.png"
                  alt="Cape Coast North"
                  className="h-16 sm:h-20 object-contain mx-auto"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/[0.04] p-5 sm:p-6"
          >
            {/* Green top accent */}
            <div className="h-0.5 w-12 bg-[#006B3F] rounded-full mx-auto mb-5" />

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-100 text-[#CE1126] text-sm rounded-lg px-3.5 py-2.5 font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Kwame Mensah"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F] focus:outline-none focus:ring-2 focus:ring-[#006B3F]/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">+233</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    placeholder="24 123 4567"
                    className="w-full pl-14 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F] focus:outline-none focus:ring-2 focus:ring-[#006B3F]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-3 pr-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F] focus:outline-none focus:ring-2 focus:ring-[#006B3F]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006B3F] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                        password.length >= i * 2
                          ? password.length >= 8 ? 'bg-[#006B3F]' : 'bg-[#FCD116]'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Recovery email — security layer */}
              <div className="pt-2 mt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Shield className="w-3.5 h-3.5 text-[#006B3F]" />
                  <label className="text-xs font-semibold text-slate-700">Recovery Email</label>
                </div>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F] focus:outline-none focus:ring-2 focus:ring-[#006B3F]/15 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Used to recover your account if you forget your password</p>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-[#006B3F] hover:bg-[#005a34] active:bg-[#004d2d] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
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

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => onNavigate('login')} className="font-semibold text-[#006B3F] hover:text-[#005a34] transition-colors">
                  Sign in
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}