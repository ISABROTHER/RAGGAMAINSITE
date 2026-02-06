import { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Loader2, CheckCircle2, ShieldCheck, Smartphone, CreditCard, Landmark, Apple, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import Paystack from '@paystack/inline-js';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  target_units: number;
  unit_label: string;
  unit_price_ghs: number;
}

interface ContributeModalProps {
  project: Project;
  onClose: () => void;
}

type PayMethod = 'MOMO' | 'CARD' | 'BANK' | 'APPLE';

const PRESETS = [100, 500, 1000, 5000];

const PAY_METHODS: { key: PayMethod; label: string; icon: React.ElementType; activeClass: string }[] = [
  { key: 'MOMO', label: 'MoMo', icon: Smartphone, activeClass: 'border-yellow-400 bg-yellow-50' },
  { key: 'CARD', label: 'Card', icon: CreditCard, activeClass: 'border-blue-600 bg-blue-50' },
  { key: 'BANK', label: 'Bank', icon: Landmark, activeClass: 'border-slate-400 bg-slate-50' },
  { key: 'APPLE', label: 'Apple Pay', icon: Apple, activeClass: 'border-slate-900 bg-slate-900 text-white' },
];

export function ContributeModal({ project, onClose }: ContributeModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(100);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('MOMO');
  const [processing, setProcessing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(15.20);
  const [error, setError] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAdjust = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startAdjust = (dir: 'up' | 'down') => {
    stopAdjust();
    const fn = () => setAmount(prev => dir === 'up' ? Math.min(project.target_units, prev + 1) : Math.max(1, prev - 1));
    fn();
    intervalRef.current = setInterval(fn, 60);
  };

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d?.rates?.GHS) setExchangeRate(d.rates.GHS); })
      .catch(() => {});
    return () => stopAdjust();
  }, []);

  const totalGHS = amount * project.unit_price_ghs;
  const totalUSD = totalGHS / (exchangeRate || 15.20);

  const canProceedStep1 = amount >= 1;
  const canProceedStep2 = firstName.trim() && lastName.trim() && contact.trim();

  const handlePay = async () => {
    if (!canProceedStep2) { setError('Please fill in all fields'); return; }
    setError('');
    setProcessing(true);

    const reference = 'BK_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);

    try {
      await supabase.from('contributions').insert({
        project_id: project.id,
        donor_first_name: firstName.trim(),
        donor_last_name: lastName.trim(),
        donor_contact: contact.trim(),
        amount_ghs: totalGHS,
        units_contributed: amount,
        payment_reference: reference,
        payment_method: payMethod,
        status: 'pending',
      });

      const email = payMethod === 'MOMO'
        ? `${contact.replace(/[^0-9]/g, '') || '0000000000'}@momo.com`
        : contact.trim();

      const channelMap: Record<PayMethod, string[]> = {
        MOMO: ['mobile_money'],
        CARD: ['card'],
        BANK: ['bank_transfer'],
        APPLE: ['apple_pay'],
      };

      const popup = new Paystack();
      popup.newTransaction({
        key: 'pk_test_0384219b0cda58507d42d42605bf6844211579cb',
        email,
        amount: Math.round(totalGHS * 100),
        currency: 'GHS',
        reference,
        channels: channelMap[payMethod],
        metadata: {
          custom_fields: [
            { display_name: 'Donor', variable_name: 'donor', value: `${firstName} ${lastName}` },
            { display_name: 'Books', variable_name: 'books', value: amount.toString() },
            { display_name: 'Project', variable_name: 'project', value: project.title },
          ]
        },
        onSuccess: async () => {
          await supabase
            .from('contributions')
            .update({ status: 'completed' })
            .eq('payment_reference', reference);
          setProcessing(false);
          setStep(3);
        },
        onCancel: async () => {
          await supabase
            .from('contributions')
            .update({ status: 'failed' })
            .eq('payment_reference', reference);
          setProcessing(false);
        },
        onError: async () => {
          await supabase
            .from('contributions')
            .update({ status: 'failed' })
            .eq('payment_reference', reference);
          setProcessing(false);
          setError('Payment failed. Please try again.');
        },
      });
    } catch {
      setProcessing(false);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Contribute</h2>
              <p className="text-[10px] text-slate-400 font-medium">{project.title}</p>
            </div>
          </div>
          {!processing && (
            <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        <StepIndicator current={step} />

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
          {processing ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Redirecting to secure payment...</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <Step1
                  amount={amount}
                  setAmount={setAmount}
                  totalGHS={totalGHS}
                  totalUSD={totalUSD}
                  unitLabel={project.unit_label}
                  maxUnits={project.target_units}
                  startAdjust={startAdjust}
                  stopAdjust={stopAdjust}
                  canProceed={canProceedStep1}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step2
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
                  contact={contact}
                  setContact={setContact}
                  payMethod={payMethod}
                  setPayMethod={setPayMethod}
                  totalGHS={totalGHS}
                  amount={amount}
                  unitLabel={project.unit_label}
                  error={error}
                  onBack={() => { setError(''); setStep(1); }}
                  onPay={handlePay}
                  canProceed={canProceedStep2}
                />
              )}
              {step === 3 && (
                <Step3 amount={amount} unitLabel={project.unit_label} onClose={handleClose} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ['Amount', 'Details', 'Done'];
  return (
    <div className="flex items-center gap-0 px-6 py-4 shrink-0">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                isDone ? 'bg-green-600 text-white' : isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                isActive ? 'text-slate-900' : 'text-slate-300'
              }`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-colors duration-300 ${
                isDone ? 'bg-green-600' : 'bg-slate-100'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface Step1Props {
  amount: number;
  setAmount: (v: number) => void;
  totalGHS: number;
  totalUSD: number;
  unitLabel: string;
  maxUnits: number;
  startAdjust: (dir: 'up' | 'down') => void;
  stopAdjust: () => void;
  canProceed: boolean;
  onNext: () => void;
}

function Step1({ amount, setAmount, totalGHS, totalUSD, unitLabel, maxUnits, startAdjust, stopAdjust, canProceed, onNext }: Step1Props) {
  return (
    <div className="space-y-5 pt-2 animate-in fade-in duration-300">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map(n => (
          <button
            key={n}
            onClick={() => setAmount(n)}
            className={`py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200 ${
              amount === n ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            {n.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={amount === 0 ? '' : amount.toLocaleString()}
              onChange={e => {
                const val = parseInt(e.target.value.replace(/,/g, ''));
                setAmount(isNaN(val) ? 0 : Math.min(maxUnits, val));
              }}
              className="bg-transparent text-2xl font-extrabold text-slate-900 outline-none w-28 text-center"
              placeholder="0"
            />
            <span className="text-sm font-bold text-slate-400 uppercase">{unitLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onMouseDown={() => startAdjust('down')}
              onTouchStart={() => startAdjust('down')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onMouseDown={() => startAdjust('up')}
              onTouchStart={() => startAdjust('up')}
              onMouseUp={stopAdjust}
              onMouseLeave={stopAdjust}
              onTouchEnd={stopAdjust}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          type="range"
          min="1"
          max={maxUnits}
          step="1"
          value={amount}
          onChange={e => setAmount(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-green-600"
        />
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 text-center">
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Total</p>
        <p className="text-2xl font-extrabold text-white">GH₵{totalGHS.toLocaleString()}</p>
        <p className="text-[10px] text-white/30 font-medium mt-1">
          ≈ ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

interface Step2Props {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  contact: string;
  setContact: (v: string) => void;
  payMethod: PayMethod;
  setPayMethod: (v: PayMethod) => void;
  totalGHS: number;
  amount: number;
  unitLabel: string;
  error: string;
  onBack: () => void;
  onPay: () => void;
  canProceed: boolean;
}

function Step2({ firstName, setFirstName, lastName, setLastName, contact, setContact, payMethod, setPayMethod, totalGHS, amount, unitLabel, error, onBack, onPay, canProceed }: Step2Props) {
  return (
    <div className="space-y-5 pt-2 animate-in fade-in duration-300">
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Your Impact</p>
          <p className="text-sm font-extrabold text-green-800">{amount.toLocaleString()} {unitLabel}</p>
        </div>
        <p className="text-lg font-extrabold text-green-700">GH₵{totalGHS.toLocaleString()}</p>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">Payment Method</label>
        <div className="grid grid-cols-4 gap-2">
          {PAY_METHODS.map(m => {
            const isActive = payMethod === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setPayMethod(m.key)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-200 ${
                  isActive ? m.activeClass : 'border-slate-100 text-slate-400'
                }`}
              >
                <m.icon className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">First Name</label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Surname</label>
            <input
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
            {payMethod === 'MOMO' ? 'MoMo Number' : 'Email Address'}
          </label>
          <input
            type={payMethod === 'MOMO' ? 'tel' : 'email'}
            placeholder={payMethod === 'MOMO' ? '024 XXX XXXX' : 'you@email.com'}
            value={contact}
            onChange={e => setContact(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium text-center">{error}</p>
      )}

      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
        Secured by Paystack. Your data is encrypted.
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="w-1/3 py-4 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={onPay}
          disabled={!canProceed}
          className="w-2/3 py-4 bg-green-600 hover:bg-green-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Pay GH₵{totalGHS.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

function Step3({ amount, unitLabel, onClose }: { amount: number; unitLabel: string; onClose: () => void }) {
  return (
    <div className="py-10 text-center animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-2">Thank You!</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed">
        Your contribution of <span className="font-bold text-green-700">{amount.toLocaleString()} {unitLabel}</span> has been received. You are helping build a brighter future.
      </p>
      <button
        onClick={onClose}
        className="w-full py-4 border border-slate-200 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
