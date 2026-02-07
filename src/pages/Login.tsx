import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onNavigate: (page: string) => void;
}

type AuthMethod = 'email' | 'phone';

export function Login({ onNavigate }: LoginProps) {
  const { signIn } = useAuth();
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const identifier = method === 'email' ? email : `${phone}@phone.ccn.local`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: err } = await signIn(identifier, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#CE1126]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-600/10 rounded-full blur-3xl" />
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

          <div className="text-center mb-8">
            <img
              src="https://i.imgur.com/1GfnCQc.png"
              alt="Cape Coast North"
              className="h-20 sm:h-24 object-contain mx-auto mb-5"
            />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-2 text-sm">Sign in to your constituency portal</p>
          </div>

          <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 p-5 sm:p-7">
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              {([
                { key: 'email' as AuthMethod, label: 'Email', icon: Mail },
                { key: 'phone' as AuthMethod, label: 'Phone', icon: Phone },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setMethod(key); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    method === key
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <AnimatePresence mode="wait">
                {method === 'email' ? (
                  <motion.div
                    key="email-field"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required={method === 'email'}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone-field"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">+233</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required={method === 'phone'}
                        autoComplete="tel"
                        placeholder="24 123 4567"
                        className="w-full pl-16 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-500 focus:bg-white/10 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="flutter-btn w-full py-4 bg-[#CE1126] hover:bg-[#a60d1e] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
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

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => onNavigate('register')} className="font-bold text-white hover:text-[#CE1126] transition-colors">
                  Create one
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-6">
            Cape Coast North Constituency Portal
          </p>
        </motion.div>
      </div>
    </div>
  );
}
