import { useRef, useState, useEffect } from 'react';
import { Minus, Plus, ArrowRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_AMOUNTS = [10, 50, 100, 200, 500, 1000];
const MAX_SLIDER = 50000;

const IMPACT_LINES: [number, string][] = [
  [1, 'One book, one spark of curiosity'],
  [10, 'A classroom shelf starts to fill'],
  [25, 'A child discovers a new world in pages'],
  [50, 'Half a class gets to read something new'],
  [100, 'An entire class gains a library'],
  [200, 'Two classrooms light up with knowledge'],
  [500, 'A whole school year of reading, unlocked'],
  [1000, "You're building a library from scratch"],
  [5000, 'A generation of readers begins here'],
  [10000, 'Transforming education across a community'],
  [50000, 'A legacy of learning for Cape Coast North'],
];

function getImpactLine(n: number): string {
  let line = IMPACT_LINES[0][1];
  for (const [threshold, text] of IMPACT_LINES) {
    if (n >= threshold) line = text;
  }
  return line;
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const amountRef = useRef(amount);
  amountRef.current = amount;
  const [inputFocused, setInputFocused] = useState(false);
  const [customText, setCustomText] = useState('');
  const [returningDonor, setReturningDonor] = useState<number | null>(null);

  // Returning donor detection
  useEffect(() => {
    try {
      const last = localStorage.getItem('last_donation_amount');
      if (last) {
        const val = parseInt(last);
        if (val > 0 && val <= maxUnits) {
          setReturningDonor(val);
          setAmount(val);
        }
      }
    } catch {}
  }, []);

  const stopAdjust = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startAdjust = (dir: 'up' | 'down') => {
    stopAdjust();
    const doStep = () => {
      const current = amountRef.current;
      const step = current >= 1000 ? 100 : current >= 100 ? 10 : 1;
      setAmount(dir === 'up' ? Math.min(maxUnits, current + step) : Math.max(1, current - step));
    };
    doStep();
    intervalRef.current = setInterval(doStep, 80);
  };

  const sliderMax = Math.min(maxUnits, MAX_SLIDER);
  const sliderPercent = Math.min(100, (amount / sliderMax) * 100);
  const displayLabel = amount === 1 ? unitLabel.replace(/s$/i, '') : unitLabel;

  const handleCustomInput = (raw: string) => {
    setCustomText(raw);
    const val = parseInt(raw.replace(/,/g, ''));
    if (!isNaN(val) && val > 0) {
      setAmount(Math.min(maxUnits, val));
    } else if (raw === '') {
      setAmount(0);
    }
  };

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pt-1 pb-3 space-y-3">

        {/* Emotional line */}
        <div className="text-center px-2">
          <p className="text-[12px] text-slate-500 leading-relaxed italic flex items-center justify-center gap-1.5">
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            You're one click away from putting smiles on the faces of our students.
          </p>
        </div>

        {/* Returning donor welcome */}
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

        {/* Number display */}
        <div className={`rounded-xl px-3 py-3 transition-all duration-300 ${inputFocused ? 'bg-green-50/50 ring-2 ring-green-300/30' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('down')}
              onTouchStart={() => startAdjust('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm active:bg-slate-50"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <div className="flex-1 flex items-baseline justify-center gap-1 min-w-0 overflow-hidden">
              <input
                type="text"
                inputMode="numeric"
                value={amount === 0 ? '' : amount.toLocaleString()}
                onChange={e => {
                  const val = parseInt(e.target.value.replace(/,/g, ''));
                  setAmount(isNaN(val) ? 0 : Math.min(maxUnits, Math.max(0, val)));
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => { setInputFocused(false); if (amount < 1) setAmount(1); }}
                className="bg-transparent text-2xl font-extrabold text-slate-900 outline-none text-right tabular-nums flex-shrink min-w-[50px] max-w-[120px]"
                style={{ fontSize: '24px' }}
                placeholder="0"
              />
              <span className="text-sm font-bold text-slate-500 flex-shrink-0 truncate">{displayLabel}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onMouseDown={() => startAdjust('up')}
              onTouchStart={() => startAdjust('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm active:bg-slate-50"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Impact line */}
        <AnimatePresence mode="wait">
          <motion.p
            key={getImpactLine(amount)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[11px] text-green-600 font-semibold text-center px-2"
          >
            {getImpactLine(amount)}
          </motion.p>
        </AnimatePresence>

        {/* Slider */}
        <div className="px-1">
          <div className="relative h-8 flex items-center">
            <div className="absolute inset-x-0 h-2 bg-slate-200 rounded-full" />
            <motion.div
              className="absolute left-0 h-2 bg-green-500 rounded-full"
              animate={{ width: `${sliderPercent}%` }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute w-6 h-6 bg-white border-[3px] border-green-500 rounded-full shadow-md"
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

        {/* Quick select */}
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_AMOUNTS.map((n, i) => {
            const active = amount === n;
            return (
              <motion.button
                key={n}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { setAmount(n); setCustomText(''); }}
                className={`py-2 rounded-lg text-[11px] font-bold border transition-all ${
                  active
                    ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {n.toLocaleString()}
              </motion.button>
            );
          })}
          <div className="col-span-2">
            <div className={`h-full py-1 px-3 rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all ${
              !QUICK_AMOUNTS.includes(amount) && amount > 0
                ? 'border-green-600 bg-green-600 shadow-sm shadow-green-600/20'
                : 'border-dashed border-slate-300 bg-white'
            }`}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Custom amount"
                value={!QUICK_AMOUNTS.includes(amount) && amount > 0 ? (customText || amount.toLocaleString()) : customText}
                onChange={e => handleCustomInput(e.target.value)}
                onFocus={() => {
                  if (!QUICK_AMOUNTS.includes(amount) && amount > 0) {
                    setCustomText(amount.toString());
                  }
                }}
                onBlur={() => { if (amount < 1) { setAmount(1); setCustomText(''); } }}
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

        {/* Total card */}
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

      {/* Continue button */}
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