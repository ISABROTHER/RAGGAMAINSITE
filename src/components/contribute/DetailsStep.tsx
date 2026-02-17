import { useState } from 'react';
import { Smartphone, CreditCard, Landmark, ChevronLeft, ArrowRight, ShieldCheck, User, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-2 pb-4 space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4 px-0.5">Your Details</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FloatingInput
                icon={User}
                label="First Name"
                value={firstName}
                onChange={setFirstName}
                placeholder="Kwame"
                focused={focusedField === 'firstName'}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
              />
              <FloatingInput
                icon={User}
                label="Surname"
                value={lastName}
                onChange={setLastName}
                placeholder="Mensah"
                focused={focusedField === 'lastName'}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <FloatingInput
              icon={payMethod === 'MOMO' ? Phone : Mail}
              label={payMethod === 'MOMO' ? 'Mobile Money Number' : 'Email Address'}
              value={contact}
              onChange={setContact}
              placeholder={payMethod === 'MOMO' ? '024 XXX XXXX' : 'you@email.com'}
              type={payMethod === 'MOMO' ? 'tel' : 'email'}
              inputMode={payMethod === 'MOMO' ? 'tel' : 'email'}
              focused={focusedField === 'contact'}
              onFocus={() => setFocusedField('contact')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4 px-0.5">Payment Method</p>
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <p className="text-xs text-red-600 font-semibold">{error}</p>
          </motion.div>
        )}

        <div className="flex items-center gap-3 px-1">
          <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-[10px] text-slate-500 font-medium leading-relaxed">
            256-bit encrypted. Your data is secured by Paystack.
          </span>
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
          disabled={!canProceed}
          className="flutter-btn flex-1 py-5 bg-green-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 disabled:shadow-none flex items-center justify-center gap-3 min-h-[60px]"
        >
          Review Order
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

function FloatingInput({
  icon: Icon, label, value, onChange, placeholder, type = 'text', inputMode,
  focused, onFocus, onBlur,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  inputMode?: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const hasValue = value.length > 0;
  return (
    <div className="relative">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
        focused ? 'text-green-600' : 'text-slate-400'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        inputMode={inputMode as React.HTMLAttributes<HTMLInputElement>['inputMode']}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`flutter-input w-full pl-12 pr-4 py-5 bg-slate-50 border-2 rounded-2xl font-medium text-[15px] text-slate-900 outline-none placeholder:text-slate-400 min-h-[60px] ${
          focused ? 'border-green-500 bg-white shadow-sm' : hasValue ? 'border-slate-200 bg-white' : 'border-slate-200'
        }`}
      />
      <motion.label
        initial={false}
        animate={{
          y: focused || hasValue ? -30 : 0,
          scale: focused || hasValue ? 0.75 : 1,
          opacity: focused || hasValue ? 1 : 0,
        }}
        className="absolute left-12 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-green-600 origin-left pointer-events-none bg-white px-1"
      >
        {label}
      </motion.label>
    </div>
  );
}