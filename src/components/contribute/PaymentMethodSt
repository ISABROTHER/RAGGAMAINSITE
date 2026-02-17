import { ChevronLeft, Smartphone, CreditCard, Landmark, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayMethod, PAY_METHODS } from './types';

const PAY_ICONS: Record<PayMethod, React.ElementType> = {
  MOMO: Smartphone,
  CARD: CreditCard,
  BANK: Landmark,
};

interface PaymentMethodStepProps {
  payMethod: PayMethod;
  setPayMethod: (v: PayMethod) => void;
  onBack: () => void;
  onNext: () => void;
}

export function PaymentMethodStep({ payMethod, setPayMethod, onBack, onNext }: PaymentMethodStepProps) {
  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2 px-0.5">How would you like to pay?</p>
          <p className="text-[11px] text-slate-400 mb-5 px-0.5">Select your preferred payment method below</p>
          <div className="space-y-3">
            {PAY_METHODS.map((m, i) => {
              const Icon = PAY_ICONS[m.key];
              const active = payMethod === m.key;
              return (
                <motion.button
                  key={m.key}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => setPayMethod(m.key)}
                  className={`flutter-card w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left min-h-[72px] ${
                    active
                      ? `${m.activeBg} ${m.activeRing} ring-2`
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    active ? 'bg-white shadow-md' : 'bg-slate-50'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${active ? m.activeColor : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[15px] font-bold transition-colors leading-tight ${active ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{m.sublabel}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    active ? 'border-green-600 bg-green-600' : 'border-slate-300'
                  }`}>
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="w-3 h-3 bg-white rounded-full"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom flex gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="flutter-btn w-16 h-16 shrink-0 border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:border-slate-300 hover:bg-slate-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="flutter-btn flex-1 py-5 bg-green-600 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 flex items-center justify-center gap-3 min-h-[60px]"
        >
          Continue
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
} 