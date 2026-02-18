import { ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayMethod, PAY_METHODS } from './types';

const MomoLogo = () => (
  <svg viewBox="0 0 40 24" className="h-5"><rect width="40" height="24" rx="4" fill="#FFCB05"/><text x="20" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#003B6F">MoMo</text></svg>
);
const VisaLogo = () => (
  <svg viewBox="0 0 40 24" className="h-5"><rect width="40" height="24" rx="4" fill="#1A1F71"/><text x="20" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontStyle="italic">VISA</text></svg>
);
const BankLogo = () => (
  <svg viewBox="0 0 40 24" className="h-5"><rect width="40" height="24" rx="4" fill="#059669"/><text x="20" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">BANK</text></svg>
);
const ApplePayLogo = () => (
  <svg viewBox="0 0 40 24" className="h-5">
    <rect width="40" height="24" rx="4" fill="#000"/>
    <text x="20" y="10" textAnchor="middle" fontSize="7" fontWeight="600" fill="#fff"></text>
    <text x="20" y="17" textAnchor="middle" fontSize="7" fontWeight="600" fill="#fff">Pay</text>
    <text x="12" y="12" textAnchor="middle" fontSize="10" fontWeight="400" fill="#fff"></text>
  </svg>
);
const CryptoLogo = () => (
  <svg viewBox="0 0 40 24" className="h-5">
    <rect width="40" height="24" rx="4" fill="#F7931A"/>
    <text x="20" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">₿</text>
  </svg>
);

const LOGO_MAP: Record<PayMethod, React.FC> = {
  MOMO: MomoLogo,
  CARD: VisaLogo,
  BANK: BankLogo,
  APPLE_PAY: ApplePayLogo,
  CRYPTO: CryptoLogo,
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
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4">
        <div className="space-y-2">
          {PAY_METHODS.map((m, i) => {
            const Logo = LOGO_MAP[m.key];
            const active = payMethod === m.key;
            return (
              <motion.button
                key={m.key}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                onClick={() => setPayMethod(m.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  active
                    ? `${m.activeBg} ${m.activeRing} ring-2`
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  active ? 'bg-white shadow-sm' : 'bg-slate-50'
                }`}>
                  <Logo />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-bold transition-colors leading-tight ${active ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5 tracking-wide">{m.logos}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                  active ? 'border-green-600 bg-green-600' : 'border-slate-300'
                }`}>
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom flex gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="flutter-btn w-14 h-14 shrink-0 border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:border-slate-300 hover:bg-slate-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="flutter-btn flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 flex items-center justify-center gap-3 min-h-[56px]"
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
