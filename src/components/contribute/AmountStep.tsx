import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AmountStepProps {
  amount: number;
  setAmount: (v: number) => void;
  totalGHS: number;
  totalUSD: number;
  unitLabel: string;
  maxUnits: number;
  onNext: () => void;
}

const SUGGESTIONS = [
  { value: 10, label: '10', note: 'Helps 1 student' },
  { value: 50, label: '50', note: 'A full classroom' },
  { value: 100, label: '100', note: '2 classrooms' },
  { value: 500, label: '500', note: 'An entire school' },
];

const getImpactMessage = (amount: number): string => {
  if (amount === 0) return '';
  if (amount <= 10) return `That's amazing — you'll help a student start their term right! 📖`;
  if (amount <= 50) return `Wow! You're equipping an entire classroom with books! 🏫`;
  if (amount <= 200) return `Incredible — that covers multiple classrooms! 🌟`;
  if (amount <= 500) return `You're transforming an entire school! 🎓`;
  if (amount <= 1000) return `A true champion — multiple schools will benefit! 🏆`;
  return `You're changing thousands of lives across Cape Coast North! 💛`;
};

export function AmountStep({ amount, setAmount, totalGHS, totalUSD, unitLabel, onNext }: AmountStepProps) {
  const [hasChosen, setHasChosen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleSelect = (value: number) => {
    setAmount(value);
    setHasChosen(true);
    setShowCustom(false);
  };

  const handleCustomSubmit = () => {
    const val = parseInt(customValue.replace(/,/g, ''));
    if (!isNaN(val) && val >= 1) {
      setAmount(val);
      setHasChosen(true);
    }
  };

  const impactMessage = getImpactMessage(amount);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-3 pb-4">

        {/* Chat bubbles */}
        <div className="space-y-3">

          {/* Bot message 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-2.5 items-end"
          >
            <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
              R
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
              <p className="text-[13px] text-slate-700 leading-relaxed">
                How many <span className="font-bold text-slate-900">{unitLabel}</span> would you like to donate? 📚
              </p>
            </div>
          </motion.div>

          {/* Suggestion chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="pl-9"
          >
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => {
                const active = amount === s.value && hasChosen;
                return (
                  <motion.button
                    key={s.value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(s.value)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                      active
                        ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-green-400'
                    }`}
                  >
                    {s.label} {unitLabel}
                  </motion.button>
                );
              })}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowCustom(true); setHasChosen(false); }}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  showCustom
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-400 border-dashed border-slate-300 hover:border-slate-400'
                }`}
              >
                Other amount
              </motion.button>
            </div>
          </motion.div>

          {/* Custom input — appears as user typing */}
          <AnimatePresence>
            {showCustom && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex justify-end"
              >
                <div className="bg-green-600 rounded-2xl rounded-br-md px-4 py-3 flex items-center gap-2 max-w-[70%]">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Type amount..."
                    value={customValue}
                    onChange={e => setCustomValue(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={e => { if (e.key === 'Enter') handleCustomSubmit(); }}
                    autoFocus
                    className="bg-transparent text-white placeholder:text-white/50 text-sm font-bold outline-none w-20 tabular-nums"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User's choice — appears as their reply */}
          <AnimatePresence>
            {hasChosen && amount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end"
              >
                <div className="bg-green-600 rounded-2xl rounded-br-md px-4 py-3 max-w-[70%]">
                  <p className="text-sm font-bold text-white">
                    {amount.toLocaleString()} {unitLabel} ✓
                  </p>
                  <p className="text-[10px] text-white/60 mt-0.5 tabular-nums">
                    GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })} · ~${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bot impact response */}
          <AnimatePresence>
            {hasChosen && amount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex gap-2.5 items-end"
              >
                <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
                  R
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                  <p className="text-[13px] text-slate-700 leading-relaxed">
                    {impactMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Continue */}
      <AnimatePresence>
        {hasChosen && amount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom"
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-slate-900/15 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}