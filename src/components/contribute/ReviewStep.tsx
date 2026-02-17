import { ChevronLeft, Lock, Smartphone, CreditCard, Landmark, BookOpen, User, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayMethod } from './types';

const METHOD_META: Record<PayMethod, { label: string; icon: React.ElementType }> = {
  MOMO: { label: 'Mobile Money', icon: Smartphone },
  CARD: { label: 'Card Payment', icon: CreditCard },
  BANK: { label: 'Bank Transfer', icon: Landmark },
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
  projectTitle, onBack, onPay,
}: ReviewStepProps) {
  const method = METHOD_META[payMethod];
  const MethodIcon = method.icon;

  return (
    <div className="flex flex-col min-h-0">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4 space-y-5"
      >
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5 mb-4 px-0.5">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Order Summary</p>
          </div>
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
            <div className="p-6 space-y-4">
              <SummaryRow icon={BookOpen} label="Project" value={projectTitle} />
              <SummaryRow label="Quantity" value={`${amount.toLocaleString()} ${unitLabel}`} />
              <SummaryRow label="Rate" value={`GH₵${(totalGHS / amount).toFixed(2)} / ${unitLabel.replace(/s$/i, '')}`} />
            </div>
            <div className="mx-6 border-t border-dashed border-slate-300" />
            <div className="p-6 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
              <div className="text-right">
                <p className="text-2xl sm:text-xl font-extrabold text-slate-900 tabular-nums">
                  GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] font-bold text-slate-400 tabular-nums mt-0.5">
                  ≈ ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5 mb-4 px-0.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Contributor</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-200">
            <SummaryRow label="Name" value={`${firstName} ${lastName}`} />
            <SummaryRow label="Contact" value={contact} />
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-slate-500 font-medium">Payment</p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <MethodIcon className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-[12px] font-bold text-slate-700">{method.label}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-2xl p-6 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-[14px] text-green-900 font-semibold leading-relaxed">
            You are about to contribute{' '}
            <span className="font-extrabold">{amount.toLocaleString()} {unitLabel}</span>{' '}
            to students in Cape Coast North.
          </p>
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
          Pay GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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