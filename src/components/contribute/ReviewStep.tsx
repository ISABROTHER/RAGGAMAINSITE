import { ChevronLeft, Lock, BookOpen, User, Receipt, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayMethod } from './types';

const METHOD_LABELS: Record<PayMethod, string> = {
  MOMO: 'Mobile Money',
  CARD: 'Card Payment',
  BANK: 'Bank Transfer',
  APPLE_PAY: 'Apple Pay',
  CRYPTO: 'Cryptocurrency',
};

interface ReviewStepProps {
  amount: number;
  unitLabel: string;
  totalGHS: number;
  totalUSD: number;
  firstName: string;
  lastName: string;
  contact: string;
  payMethod: PayMethod;
  projectTitle: string;
  recognition: string;
  onBack: () => void;
  onPay: () => void;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function ReviewStep({
  amount, unitLabel, totalGHS, totalUSD,
  firstName, lastName, contact, payMethod,
  projectTitle, recognition, onBack, onPay,
}: ReviewStepProps) {
  const isLocal = payMethod === 'MOMO';
  const displayTotal = isLocal
    ? `GH\u20B5${totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const altLine = isLocal
    ? `That's approximately $${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`
    : `That's approximately GH\u20B5${totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })} in Ghanaian Cedis`;

  const displayName = recognition === 'anon' ? 'Anonymous Supporter'
    : recognition === 'first' ? firstName
    : `${firstName} ${lastName}`;

  return (
    <div className="flex flex-col min-h-0">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4 space-y-4"
      >
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5 mb-3 px-0.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Contributor</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-200">
            <SummaryRow label="Recognized as" value={displayName} />
            {contact && <SummaryRow label="Contact" value={contact} />}
            <SummaryRow label="Payment" value={METHOD_LABELS[payMethod]} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5 mb-3 px-0.5">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Order Summary</p>
          </div>
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
            <div className="p-5 space-y-3">
              <SummaryRow icon={BookOpen} label="Project" value={projectTitle} />
              <SummaryRow label="Quantity" value={`${amount.toLocaleString()} ${unitLabel}`} />
            </div>
            <div className="mx-5 border-t border-dashed border-slate-300" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
                <motion.p
                  key={displayTotal}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl font-extrabold text-slate-900 tabular-nums"
                >
                  {displayTotal}
                </motion.p>
              </div>
              <motion.p
                key={altLine}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] font-semibold text-red-500 text-right"
              >
                {altLine}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

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
          onClick={onPay}
          className="flutter-btn flex-1 py-5 bg-green-600 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 flex items-center justify-center gap-3 min-h-[60px]"
        >
          <Lock className="w-4 h-4" />
          Pay {displayTotal}
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.button>
      </div>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        <p className="text-[12px] text-slate-500 font-medium">{label}</p>
      </div>
      <p className="text-[12px] font-bold text-slate-800 text-right truncate max-w-[55%]">{value}</p>
    </div>
  );
}