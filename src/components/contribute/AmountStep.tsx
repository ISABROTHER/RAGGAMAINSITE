import { useRef, useState } from 'react';
import { Minus, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const QUICK_AMOUNTS = [10, 50, 100, 200, 500];

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
  const amountRef = useRef(amount);
  amountRef.current = amount;
  const [inputFocused, setInputFocused] = useState(false);

  const stopAdjust = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startAdjust = (dir: 'up' | 'down') => {
    stopAdjust();
    const doStep = () => {
      const current = amountRef.current;
      const step = current >= 100 ? 10 : 1;
      setAmount(dir === 'up' ? Math.min(maxUnits, current + step) : Math.max(1, current - step));
    };
    doStep();
    intervalRef.current = setInterval(doStep, 80);
  };

  const sliderPercent = Math.min(100, (amount / maxUnits) * 100);
  const displayLabel = amount === 1 ? unitLabel.replace(/s$/i, '') : unitLabel;

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pt-2 pb-3 space-y-3">

        {/* Number display — compact row */}
        <div className={`rounded-xl px-3 py-3 transition-all duration-300 ${inputFocused ? 'bg-green-50/50 ring-2 ring-green-300/30' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('down')}
              onTouchStart={() => startAdjust('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-9 h-9 flex-shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            <div className="flex-1 flex items-baseline justify-center gap-1 min-w-0 overflow-hidden">
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
                className="bg-transparent text-xl font-extrabold text-slate-900 outline-none text-right tabular-nums flex-shrink min-w-[40px] max-w-[100px]"
                style={{ fontSize: '20px' }}
                placeholder="0"
              />
              <span className="text-base font-extrabold text-slate-900 flex-shrink-0 truncate">{displayLabel}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('up')}
              onTouchStart={() => startAdjust('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-9 h-9 flex-shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Slider */}
        <div className="px-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">Drag to adjust</p>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[8px] text-slate-300"
            >
              ← →
            </motion.span>
          </div>
          <div className="relative h-7 flex items-center">
            <div className="absolute inset-x-0 h-2 bg-slate-200 rounded-full" />
            <motion.div
              className="absolute left-0 h-2 bg-green-500 rounded-full"
              animate={{ width: `${sliderPercent}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute w-5 h-5 bg-white border-[3px] border-green-500 rounded-full shadow-md"
              animate={{
                left: `calc(${sliderPercent}% - 10px)`,
                boxShadow: [
                  '0 2px 6px rgba(22, 163, 74, 0.2)',
                  '0 2px 12px rgba(22, 163, 74, 0.4)',
                  '0 2px 6px rgba(22, 163, 74, 0.2)',
                ],
              }}
              transition={{
                left: { duration: 0.15, ease: 'easeOut' },
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            <input
              type="range"
              min="1"
              max={maxUnits}
              step="1"
              value={amount}
              onChange={e => setAmount(parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-grab"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-semibold text-slate-300 mt-0.5 px-0.5">
            <span>1</span>
            <span>{maxUnits.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick select */}
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 px-0.5">Quick Select</p>
          <div className="grid grid-cols-3 gap-1.5">
            {QUICK_AMOUNTS.map((n, i) => {
              const active = amount === n;
              return (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setAmount(n)}
                  className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                    active
                      ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {n.toLocaleString()}
                </motion.button>
              );
            })}
            <div className={`py-0.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all ${
              !QUICK_AMOUNTS.includes(amount) && amount > 0
                ? 'border-green-600 bg-green-600 shadow-sm shadow-green-600/20'
                : 'border-dashed border-slate-300 bg-white'
            }`}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={!QUICK_AMOUNTS.includes(amount) && amount > 0 ? amount.toLocaleString() : ''}
                onChange={e => {
                  const val = parseInt(e.target.value.replace(/,/g, ''));
                  setAmount(isNaN(val) ? 0 : Math.min(maxUnits, val));
                }}
                style={{ fontSize: '16px' }}
                className={`w-full text-center text-[11px] bg-transparent outline-none tabular-nums ${
                  !QUICK_AMOUNTS.includes(amount) && amount > 0
                    ? 'text-white placeholder:text-white/50'
                    : 'text-slate-600 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Total card — USD prominent, GHS secondary */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 flutter-shimmer-bg" />
          <div className="relative z-10">
            <p className="text-[8px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1.5">Total</p>
            <div className="flex items-baseline justify-between">
              <motion.p
                key={`usd-${totalUSD}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-extrabold text-white tabular-nums"
              >
                ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
              <motion.p
                key={`ghs-${totalGHS}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-amber-400 tabular-nums"
              >
                ≈ GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue button — same design as DetailsStep */}
      <div className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={amount < 1}
          className="flutter-btn w-full py-5 bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 disabled:shadow-none flex items-center justify-center gap-3 min-h-[60px]"
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