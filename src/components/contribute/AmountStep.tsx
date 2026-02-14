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

export function AmountStep({ amount, setAmount, totalGHS, totalUSD, unitLabel, maxUnits, onNext }: AmountStepProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [inputFocused, setInputFocused] = useState(false);

  const stopAdjust = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startAdjust = (dir: 'up' | 'down') => {
    stopAdjust();
    const doStep = () => {
      setAmount((prev: number) => {
        const step = prev >= 100 ? 10 : 1;
        return dir === 'up' ? Math.min(maxUnits, prev + step) : Math.max(1, prev - step);
      });
    };
    doStep();
    intervalRef.current = setInterval(doStep, 80);
  };

  const sliderPercent = Math.min(100, (amount / maxUnits) * 100);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4">

        {/* Number display */}
        <div className={`rounded-xl px-4 py-3 mb-3 transition-all duration-300 ${inputFocused ? 'bg-green-50/50 ring-2 ring-green-300/30' : 'bg-slate-50'}`}>
          <div className="flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('down')}
              onTouchStart={() => startAdjust('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            <div className="flex items-baseline gap-1.5">
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
                className="bg-transparent text-2xl font-extrabold text-slate-900 outline-none text-right tabular-nums"
                style={{ width: `${Math.max(2, (amount || 0).toLocaleString().length) * 0.85}em` }}
                placeholder="0"
              />
              <span className="text-2xl font-extrabold text-slate-900">{unitLabel}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('up')}
              onTouchStart={() => startAdjust('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Visible styled slider */}
          <div className="mt-4 px-1">
            <div className="relative h-6 flex items-center">
              {/* Track background */}
              <div className="absolute inset-x-0 h-2 bg-slate-200 rounded-full" />
              {/* Track fill */}
              <motion.div
                className="absolute left-0 h-2 bg-green-500 rounded-full"
                animate={{ width: `${sliderPercent}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
              {/* Thumb */}
              <motion.div
                className="absolute w-5 h-5 bg-white border-[3px] border-green-500 rounded-full shadow-md cursor-grab active:cursor-grabbing"
                animate={{ left: `calc(${sliderPercent}% - 10px)` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
              {/* Invisible native input on top for interaction */}
              <input
                type="range"
                min="1"
                max={maxUnits}
                step="1"
                value={amount}
                onChange={e => setAmount(parseInt(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-grab active:cursor-grabbing"
              />
            </div>
            <div className="flex justify-between text-[9px] font-semibold text-slate-300 mt-1 px-0.5">
              <span>1</span>
              <span>{maxUnits.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick select presets */}
        <div className="mb-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2.5 px-0.5">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((n, i) => {
              const active = amount === n;
              return (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setAmount(n)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    active
                      ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-green-400'
                  }`}
                >
                  {n.toLocaleString()}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Total card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 flutter-shimmer-bg" />
          <div className="relative z-10">
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">Total</p>
            <div className="flex items-baseline justify-between">
              <motion.p
                key={`ghs-${totalGHS}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-extrabold text-white tabular-nums"
              >
                GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              <motion.p
                key={`usd-${totalUSD}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-extrabold text-green-400 tabular-nums"
              >
                ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={amount < 1}
          className="w-full py-4 bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-green-600/25 disabled:shadow-none flex items-center justify-center gap-2 min-h-[56px]"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}