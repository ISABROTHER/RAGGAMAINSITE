import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('233')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}


export function Login({ onNavigate }: LoginProps) {
  const { signIn } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

    const trimmed = identity.trim();
    if (!trimmed) {
      setError('Enter your phone number or email');
      return;
    }

    let identifier: string;

    // Email detected — use directly
    if (trimmed.includes('@') && trimmed.includes('.')) {
      identifier = trimmed.toLowerCase();
    } else {
      // Treat as phone number
      const normalized = normalizePhone(trimmed);
      if (normalized.length < 9) {
        setError('Enter a valid phone number or email address');
        return;
      }
      identifier = `${normalized}@phone.ccn.local`;
    }

    setLoading(true);
    const { error: err } = await signIn(identifier, password);
    if (err) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fafafa] flex flex-col relative overflow-x-hidden overflow-y-auto">
      <div className="fixed top-0 left-0 right-0 h-1 flex z-20">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-[#FCD116]" />
        <div className="flex-1 bg-[#006B3F]" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-start sm:justify-center px-4 pt-8 pb-6 sm:py-12">
        <div className="w-full max-w-[400px]">
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

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/[0.04] p-5 sm:p-6"
          >
            <div className="h-0.5 w-12 bg-[#006B3F] rounded-full mx-auto mb-5" />

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number or Email
                </label>
                <input
                  type="text"
                  value={identity}
                  onChange={e => setIdentity(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="e.g. 0241234567 or +233241234567"
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:bg-white focus:border-[#006B3F] focus:outline-none focus:ring-2 focus:ring-[#006B3F]/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
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
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-[#CE1126] hover:bg-[#b30f21] active:bg-[#9a0d1c] text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => onNavigate('register')} className="font-semibold text-[#006B3F] hover:text-[#005a34] transition-colors">
                  Create one
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}