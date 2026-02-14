import { useRef, useState } from 'react';
import { Minus, Plus, ArrowRight } from 'lucide-react';
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

const IMPACT_MAP: Record<number, string> = {
  10: '1 student helped',
  50: 'A full classroom',
  100: '2 classrooms covered',
  200: 'An entire school',
  500: 'Multiple schools',
  1000: 'Transforming a community',
};

export function AmountStep({ amount, setAmount, totalGHS, totalUSD, unitLabel, maxUnits, onNext }: AmountStepProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const isCustom = !PRESETS.includes(amount);

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

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4">

        {/* Big number display */}
        <div className={`rounded-2xl p-5 mb-5 text-center transition-all duration-300 ${inputFocused ? 'bg-green-50/60 ring-2 ring-green-300/40' : 'bg-slate-50'}`}>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3">How many {unitLabel}?</p>
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onMouseDown={() => startAdjust('down')}
              onTouchStart={() => startAdjust('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm active:bg-slate-50"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
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
              className="bg-transparent text-4xl font-extrabold text-slate-900 outline-none w-[120px] text-center tabular-nums"
              placeholder="0"
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onMouseDown={() => startAdjust('up')}
              onTouchStart={() => startAdjust('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm active:bg-slate-50"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          {/* Inline total */}
          <motion.p
            key={totalGHS}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-slate-400 font-semibold mt-2 tabular-nums"
          >
            GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })} · ~${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </motion.p>
        </div>

        {/* Quick select — presets with impact */}
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 px-0.5">Quick Select</p>
        <div className="grid grid-cols-2 gap-2.5">
          {PRESETS.map((n, i) => {
            const active = amount === n;
            return (
              <motion.button
                key={n}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setAmount(n)}
                className={`text-left px-4 py-3.5 rounded-xl border transition-all ${
                  active
                    ? 'border-green-600 bg-green-600 shadow-lg shadow-green-600/20'
                    : 'border-slate-150 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`text-base font-extrabold tabular-nums ${active ? 'text-white' : 'text-slate-800'}`}>
                  {n.toLocaleString()}
                </span>
                <span className={`block text-[10px] font-medium mt-0.5 ${active ? 'text-white/70' : 'text-slate-400'}`}>
                  {IMPACT_MAP[n]}
                </span>
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* Continue */}
      <div className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={amount < 1}
          className="w-full py-4 bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-green-600/25 disabled:shadow-none flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}