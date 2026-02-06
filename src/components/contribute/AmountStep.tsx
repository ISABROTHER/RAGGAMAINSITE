import { useRef, useState } from 'react';
import { Minus, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PRESETS } from './types';

interface AmountStepProps {
  amount: number;
  setAmount: (v: number) => void;
  totalGHS: number;
  totalUSD: number;
  unitLabel: string;
  maxUnits: number;
  onNext: () => void;
}

const IMPACT_TIERS = [
  { max: 10, label: 'A thoughtful start', emoji: '1 student helped' },
  { max: 50, label: 'Equipping a classroom', emoji: 'Up to 50 students' },
  { max: 200, label: 'Empowering a school', emoji: 'Full school covered' },
  { max: 1000, label: 'Transforming a community', emoji: 'Multiple schools' },
  { max: Infinity, label: 'Changing thousands of lives', emoji: 'Entire constituency' },
];

export function AmountStep({ amount, setAmount, totalGHS, totalUSD, unitLabel, maxUnits, onNext }: AmountStepProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const stopAdjust = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startAdjust = (dir: 'up' | 'down') => {
    stopAdjust();
    const step = amount >= 100 ? 10 : 1;
    const fn = () => setAmount(dir === 'up' ? Math.min(maxUnits, amount + step) : Math.max(1, amount - step));
    fn();
    intervalRef.current = setInterval(fn, 80);
  };

  const impact = IMPACT_TIERS.find(t => amount <= t.max) || IMPACT_TIERS[IMPACT_TIERS.length - 1];
  const progressPercent = Math.min(100, (amount / Math.min(maxUnits, 2000)) * 100);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 mb-3 px-0.5">Select Amount</p>
          <div className="grid grid-cols-3 gap-2.5">
            {PRESETS.map((n, i) => {
              const active = amount === n;
              return (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => setAmount(n)}
                  className={`flutter-btn relative py-4 rounded-2xl font-bold text-sm border-2 overflow-hidden ${
                    active
                      ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/25'
                      : 'border-slate-100 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="preset-glow"
                      className="absolute inset-0 bg-green-500 opacity-20"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{n.toLocaleString()}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className={`rounded-2xl p-5 transition-all duration-300 ${inputFocused ? 'bg-green-50/50 ring-2 ring-green-200/50' : 'bg-slate-50'}`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 mb-4">Custom Amount</p>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('down')}
              onTouchStart={() => startAdjust('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="flutter-btn w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <div className="flex-1 text-center">
              <div className="flex items-baseline justify-center gap-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount === 0 ? '' : amount.toLocaleString()}
                  onChange={e => {
                    const val = parseInt(e.target.value.replace(/,/g, ''));
                    setAmount(isNaN(val) ? 0 : Math.min(maxUnits, val));
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="bg-transparent text-4xl font-extrabold text-slate-900 outline-none w-28 text-center tabular-nums"
                  placeholder="0"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{unitLabel}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('up')}
              onTouchStart={() => startAdjust('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="flutter-btn w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="mt-4 px-1">
            <input
              type="range"
              min="1"
              max={Math.min(maxUnits, 2000)}
              step="1"
              value={amount}
              onChange={e => setAmount(parseInt(e.target.value))}
              className="w-full flutter-slider"
            />
          </div>
        </div>

        <motion.div
          key={impact.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-green-50 rounded-2xl p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-green-800">{impact.label}</p>
            <p className="text-[10px] text-green-600/70 font-medium">{impact.emoji}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-[3px] border-green-200 flex items-center justify-center shrink-0">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#dcfce7" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="14" fill="none" stroke="#16a34a" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="87.96"
                animate={{ strokeDashoffset: 87.96 - (87.96 * progressPercent) / 100 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </svg>
          </div>
        </motion.div>

        <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 flutter-shimmer-bg" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-1">Total</p>
              <motion.p
                key={totalGHS}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-extrabold text-white tabular-nums"
              >
                GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            </div>
            <div className="text-right space-y-0.5">
              <p className="text-[10px] text-white/25 font-medium tabular-nums">
                ~ ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
              </p>
              <p className="text-[10px] text-white/15 font-medium">
                GH₵{Number(totalGHS / (amount || 1)).toFixed(2)} / {unitLabel.replace(/s$/i, '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 pb-5 pt-2 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={amount < 1}
          className="flutter-btn w-full py-[18px] bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-[15px] tracking-wide shadow-lg shadow-green-600/20 disabled:shadow-none flex items-center justify-center gap-2.5"
        >
          Continue
          <ArrowRight className="w-[18px] h-[18px]" />
        </motion.button>
      </div>
    </div>
  );
}
