import { Smartphone, CreditCard, Landmark, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { PayMethod, PAY_METHODS } from './types';

const PAY_ICONS: Record<PayMethod, React.ElementType> = {
  MOMO: Smartphone,
  CARD: CreditCard,
  BANK: Landmark,
};

interface DetailsStepProps {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  contact: string;
  setContact: (v: string) => void;
  payMethod: PayMethod;
  setPayMethod: (v: PayMethod) => void;
  error: string;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export function DetailsStep({
  firstName, setFirstName, lastName, setLastName,
  contact, setContact, payMethod, setPayMethod,
  error, onBack, onNext, canProceed,
}: DetailsStepProps) {
  return (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Your Details</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">First Name</label>
              <input
                type="text"
                placeholder="Kwame"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Surname</label>
              <input
                type="text"
                placeholder="Mensah"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
              {payMethod === 'MOMO' ? 'Mobile Money Number' : 'Email Address'}
            </label>
            <input
              type={payMethod === 'MOMO' ? 'tel' : 'email'}
              placeholder={payMethod === 'MOMO' ? '024 XXX XXXX' : 'you@email.com'}
              value={contact}
              onChange={e => setContact(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Payment Method</p>
        <div className="space-y-2">
          {PAY_METHODS.map(m => {
            const Icon = PAY_ICONS[m.key];
            const isActive = payMethod === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setPayMethod(m.key)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  isActive ? m.activeClass : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-white' : 'bg-slate-50'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? m.color : 'text-slate-400'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{m.sublabel}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isActive ? 'border-green-600' : 'border-slate-200'
                }`}>
                  {isActive && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
        <span>256-bit encrypted. Secured by Paystack.</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="w-12 h-12 shrink-0 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 py-3.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Review Order
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
