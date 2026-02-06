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
  amount, unitLabel, totalGHS,
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
        className="flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-4 space-y-4"
      >
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5 mb-3 px-0.5">
            <Receipt className="w-3.5 h-3.5 text-slate-300" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">Order Summary</p>
          </div>
          <div className="bg-slate-50 rounded-2xl overflow-hidden">
            <div className="p-5 space-y-3.5">
              <SummaryRow icon={BookOpen} label="Project" value={projectTitle} />
              <SummaryRow label="Quantity" value={`${amount.toLocaleString()} ${unitLabel}`} />
              <SummaryRow label="Rate" value={`GH₵${(totalGHS / amount).toFixed(2)} / ${unitLabel.replace(/s$/i, '')}`} />
            </div>
            <div className="mx-5 border-t border-dashed border-slate-200" />
            <div className="p-5 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-xl font-extrabold text-slate-900 tabular-nums">
                GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2.5 mb-3 px-0.5">
            <User className="w-3.5 h-3.5 text-slate-300" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">Contributor</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
            <SummaryRow label="Name" value={`${firstName} ${lastName}`} />
            <SummaryRow label="Contact" value={contact} />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-400 font-medium">Payment</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-sm">
                  <MethodIcon className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <p className="text-[11px] font-bold text-slate-700">{method.label}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-[13px] text-green-800 font-semibold leading-relaxed">
            You are about to contribute{' '}
            <span className="font-extrabold">{amount.toLocaleString()} {unitLabel}</span>{' '}
            to students in Cape Coast North.
          </p>
        </motion.div>
      </motion.div>

      <div className="shrink-0 px-5 pb-5 pt-2 safe-bottom flex gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flutter-btn w-14 h-14 shrink-0 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onPay}
          className="flutter-btn flex-1 py-[18px] bg-green-600 text-white rounded-2xl font-bold text-[15px] tracking-wide shadow-lg shadow-green-600/20 flex items-center justify-center gap-2.5"
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
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <p className="text-[11px] text-slate-400 font-medium">{label}</p>
      </div>
      <p className="text-[11px] font-bold text-slate-700 text-right truncate max-w-[55%]">{value}</p>
    </div>
  );
}
