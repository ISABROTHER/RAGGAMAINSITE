import { ArrowLeft, Lock, Smartphone, CreditCard, Landmark } from 'lucide-react';
import { PayMethod } from './types';

const METHOD_LABELS: Record<PayMethod, { label: string; icon: React.ElementType }> = {
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

export function ReviewStep({
  amount, unitLabel, totalGHS,
  firstName, lastName, contact, payMethod,
  projectTitle, onBack, onPay,
}: ReviewStepProps) {
  const method = METHOD_LABELS[payMethod];
  const MethodIcon = method.icon;

  return (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Order Summary</p>

        <div className="bg-slate-50 rounded-2xl overflow-hidden">
          <div className="p-4 space-y-3">
            <Row label="Project" value={projectTitle} />
            <Row label="Quantity" value={`${amount.toLocaleString()} ${unitLabel}`} />
            <Row label="Rate" value={`GH₵${(totalGHS / amount).toFixed(2)} per ${unitLabel.slice(0, -1)}`} />
          </div>
          <div className="border-t border-slate-200/60 border-dashed" />
          <div className="p-4 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
            <p className="text-xl font-extrabold text-slate-900">
              GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Contributor</p>
        <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
          <Row label="Name" value={`${firstName} ${lastName}`} />
          <Row label="Contact" value={contact} />
          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-slate-400 font-medium">Payment</p>
            <div className="flex items-center gap-2">
              <MethodIcon className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-[11px] font-bold text-slate-700">{method.label}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
        <p className="text-xs text-green-700 font-semibold leading-relaxed">
          You are about to contribute <span className="font-extrabold">{amount.toLocaleString()} {unitLabel}</span> to students in Cape Coast North.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="w-12 h-12 shrink-0 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onPay}
          className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
        >
          <Lock className="w-3.5 h-3.5" />
          Confirm & Pay GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[11px] text-slate-400 font-medium">{label}</p>
      <p className="text-[11px] font-bold text-slate-700 text-right max-w-[60%] truncate">{value}</p>
    </div>
  );
}
