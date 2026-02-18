import { useRef, useState, useEffect, useCallback } from 'react';
import { Minus, Plus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_AMOUNTS = [10, 50, 100, 200, 500, 1000];
const ABSOLUTE_MAX = 500000;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

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
  const effectiveMax = Math.max(maxUnits || ABSOLUTE_MAX, ABSOLUTE_MAX);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const amountRef = useRef(amount);
  amountRef.current = amount;

  const [mainInputText, setMainInputText] = useState(amount > 0 ? amount.toString() : '');
  const [mainFocused, setMainFocused] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customFocused, setCustomFocused] = useState(false);
  const [returningDonor, setReturningDonor] = useState<number | null>(null);

  useEffect(() => {
    if (!mainFocused) {
      setMainInputText(amount > 0 ? amount.toLocaleString() : '');
    }
  }, [amount, mainFocused]);

  useEffect(() => {
    if (!customFocused && !QUICK_AMOUNTS.includes(amount) && amount > 0) {
      setCustomText(amount.toLocaleString());
    }
  }, [amount, customFocused]);

  useEffect(() => {
    try {
      const last = localStorage.getItem('last_donation_amount');
      if (last) {
        const val = parseInt(last);
        if (val > 0 && val <= effectiveMax) {
          setReturningDonor(val);
          setAmount(val);
        }
      }
    } catch {}
  }, []);

  const stopAdjust = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stepOnce = useCallback((dir: 'up' | 'down') => {
    const current = amountRef.current;
    const step = current >= 1000 ? 100 : current >= 100 ? 10 : 1;
    const next = dir === 'up'
      ? clamp(current + step, 1, effectiveMax)
      : clamp(current - step, 1, effectiveMax);
    setAmount(next);
  }, [effectiveMax, setAmount]);

  const startHold = useCallback((dir: 'up' | 'down') => {
    stopAdjust();
    intervalRef.current = setInterval(() => stepOnce(dir), 80);
  }, [stopAdjust, stepOnce]);

  useEffect(() => {
    return stopAdjust;
  }, [stopAdjust]);

  const sliderMax = Math.min(effectiveMax, 50000);
  const sliderPercent = Math.min(100, (amount / sliderMax) * 100);
  const displayLabel = amount === 1 ? unitLabel.replace(/s$/i, '') : unitLabel;
  const isCustom = !QUICK_AMOUNTS.includes(amount) && amount > 0;

  const handleMainChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    setMainInputText(cleaned);
    const val = parseInt(cleaned);
    if (!isNaN(val) && val > 0) {
      setAmount(clamp(val, 1, effectiveMax));
    } else if (cleaned === '') {
      setAmount(0);
    }
  };

  const handleCustomChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, '');
    setCustomText(cleaned);
    const val = parseInt(cleaned);
    if (!isNaN(val) && val > 0) {
      setAmount(clamp(val, 1, effectiveMax));
    } else if (cleaned === '') {
      setAmount(0);
    }
  };

  const selectQuick = (n: number) => {
    setAmount(n);
    setCustomText('');
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pt-2 pb-3 space-y-3">

        <AnimatePresence>
          {returningDonor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-center"
            >
              <p className="text-[10px] text-amber-700 font-medium">
                Welcome back! We've set your last donation of {returningDonor.toLocaleString()} {unitLabel}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`rounded-xl px-2 py-3 transition-all duration-300 ${mainFocused ? 'bg-green-50/50 ring-2 ring-green-300/30' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => stepOnce('down')}
              onMouseDown={() => startHold('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchStart={() => startHold('down')}
              onTouchEnd={stopAdjust}
              className="-ml-3 w-12 h-12 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:bg-slate-100 active:scale-90 transition-all select-none touch-manipulation"
            >
              <Minus className="w-5 h-5 pointer-events-none" />
            </button>
            <div className="flex-1 flex items-baseline justify-center gap-1 min-w-0 overflow-hidden">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={mainInputText}
                onChange={e => handleMainChange(e.target.value)}
                onFocus={() => {
                  setMainFocused(true);
                  setMainInputText(amount > 0 ? amount.toString() : '');
                }}
                onBlur={() => {
                  setMainFocused(false);
                  if (amount < 1) setAmount(1);
                }}
                className="bg-transparent text-2xl font-extrabold text-slate-900 outline-none text-right tabular-nums flex-shrink min-w-[50px] max-w-[120px]"
                style={{ fontSize: '24px' }}
                placeholder="0"
              />
              <span className="text-sm font-bold text-slate-500 flex-shrink-0 truncate">{displayLabel}</span>
            </div>
            <button
              type="button"
              onClick={() => stepOnce('up')}
              onMouseDown={() => startHold('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchStart={() => startHold('up')}
              onTouchEnd={stopAdjust}
              className="-mr-3 w-12 h-12 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm active:bg-slate-100 active:scale-90 transition-all select-none touch-manipulation"
            >
              <Plus className="w-5 h-5 pointer-events-none" />
            </button>
          </div>
        </div>

        <div className="px-1">
          <div className="relative h-8 flex items-center">
            <div className="absolute inset-x-0 h-2 bg-slate-200 rounded-full" />
            <motion.div
              className="absolute left-0 h-2 bg-green-500 rounded-full"
              animate={{ width: `${sliderPercent}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute w-6 h-6 bg-white border-[3px] border-green-500 rounded-full shadow-md pointer-events-none"
              animate={{ left: `calc(${sliderPercent}% - 12px)` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            <input
              type="range"
              min="1"
              max={sliderMax}
              step={amount >= 1000 ? 100 : amount >= 100 ? 10 : 1}
              value={Math.min(amount, sliderMax)}
              onChange={e => setAmount(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-grab active:cursor-grabbing"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-semibold text-slate-300 mt-0.5 px-0.5">
            <span>1</span>
            <span>{sliderMax.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_AMOUNTS.map((n, i) => {
            const active = amount === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => selectQuick(n)}
                className={`py-2.5 rounded-lg text-[11px] font-bold border transition-all active:scale-95 touch-manipulation ${
                  active
                    ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {n.toLocaleString()}
              </button>
            );
          })}
          <div className="col-span-2">
            <div className={`h-full py-1 px-3 rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all ${
              isCustom
                ? 'border-green-600 bg-green-600 shadow-sm shadow-green-600/20'
                : 'border-dashed border-slate-300 bg-white'
            }`}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Custom amount"
                value={customFocused ? customText : (isCustom ? amount.toLocaleString() : '')}
                onChange={e => handleCustomChange(e.target.value)}
                onFocus={() => {
                  setCustomFocused(true);
                  setCustomText(isCustom ? amount.toString() : '');
                }}
                onBlur={() => {
                  setCustomFocused(false);
                  if (amount < 1) { setAmount(1); setCustomText(''); }
                }}
                style={{ fontSize: '16px' }}
                className={`w-full text-center text-[11px] bg-transparent outline-none tabular-nums touch-manipulation ${
                  isCustom
                    ? 'text-white placeholder:text-white/50'
                    : 'text-slate-600 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 flutter-shimmer-bg" />
          <div className="relative z-10">
            <p className="text-[8px] text-white font-bold uppercase tracking-[0.2em] mb-1.5 underline" style={{ textDecorationColor: '#fbbf24' }}>Total</p>
            <div className="flex items-baseline justify-between">
              <motion.p
                key={`usd-${totalUSD}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-extrabold text-white tabular-nums"
              >
                ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              <div className="text-right">
                <p className="text-[7px] font-bold text-white/50 uppercase tracking-wider mb-0.5">Amount in Ghanaian Cedis</p>
                <motion.p
                  key={`ghs-${totalGHS}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-amber-400 tabular-nums"
                >
                  GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={amount < 1}
          className="flutter-btn w-full py-4 bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 disabled:shadow-none flex items-center justify-center gap-3 min-h-[56px]"
        >
          Continue
          <motion.span
            animate={amount >= 1 ? { x: [0, 6, 0] } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}
