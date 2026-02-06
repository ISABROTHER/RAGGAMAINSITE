import { useRef } from 'react';
import { Minus, Plus, ArrowRight, BookOpen } from 'lucide-react';
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

  const stopAdjust = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startAdjust = (dir: 'up' | 'down') => {
    stopAdjust();
    const fn = () => setAmount(dir === 'up' ? Math.min(maxUnits, amount + 1) : Math.max(1, amount - 1));
    fn();
    intervalRef.current = setInterval(fn, 60);
  };

  const impactMessage = amount <= 10
    ? 'A thoughtful start'
    : amount <= 50
      ? 'Equipping a classroom'
      : amount <= 200
        ? 'Empowering a school'
        : amount <= 1000
          ? 'Transforming a community'
          : 'Changing thousands of lives';

  return (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Quick Select</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map(n => (
            <button
              key={n}
              onClick={() => setAmount(n)}
              className={`py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200 ${
                amount === n
                  ? 'border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/20'
                  : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              {n.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Or enter custom amount</p>
        <div className="flex items-center justify-between">
          <button
            onMouseDown={() => startAdjust('down')}
            onTouchStart={() => startAdjust('down')}
            onMouseUp={stopAdjust}
            onMouseLeave={stopAdjust}
            onTouchEnd={stopAdjust}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 active:scale-90 transition-transform hover:border-slate-300"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <div className="flex items-baseline justify-center gap-1.5">
              <input
                type="text"
                inputMode="numeric"
                value={amount === 0 ? '' : amount.toLocaleString()}
                onChange={e => {
                  const val = parseInt(e.target.value.replace(/,/g, ''));
                  setAmount(isNaN(val) ? 0 : Math.min(maxUnits, val));
                }}
                className="bg-transparent text-3xl font-extrabold text-slate-900 outline-none w-32 text-center"
                placeholder="0"
              />
              <span className="text-sm font-bold text-slate-300 uppercase">{unitLabel}</span>
            </div>
          </div>
          <button
            onMouseDown={() => startAdjust('up')}
            onTouchStart={() => startAdjust('up')}
            onMouseUp={stopAdjust}
            onMouseLeave={stopAdjust}
            onTouchEnd={stopAdjust}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 active:scale-90 transition-transform hover:border-slate-300"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <input
          type="range"
          min="1"
          max={Math.min(maxUnits, 20000)}
          step="1"
          value={amount}
          onChange={e => setAmount(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex items-center justify-center gap-2 pt-1">
          <BookOpen className="w-3.5 h-3.5 text-green-600" />
          <p className="text-xs font-semibold text-green-700">{impactMessage}</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Total Amount</p>
            <p className="text-2xl font-extrabold text-white">
              GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30 font-medium">
              ≈ ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
            </p>
            <p className="text-[10px] text-white/20 font-medium mt-0.5">
              GH₵{Number(totalGHS / amount || 0).toFixed(2)} / {unitLabel.slice(0, -1)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={amount < 1}
        className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
