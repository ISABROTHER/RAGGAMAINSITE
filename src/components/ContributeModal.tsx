import { useState, useEffect } from 'react';
import { X, Loader2, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import Paystack from '@paystack/inline-js';
import { supabase } from '../lib/supabase';
import { AmountStep } from './contribute/AmountStep';
import { DetailsStep } from './contribute/DetailsStep';
import { ReviewStep } from './contribute/ReviewStep';
import { SuccessStep } from './contribute/SuccessStep';
import type { PayMethod } from './contribute/types';

interface Project {
  id: string;
  title: string;
  slug: string;
  target_units: number;
  unit_label: string;
  unit_price_ghs: number;
}

interface ContributeModalProps {
  project: Project;
  onClose: () => void;
}

type ModalState = 'form' | 'processing' | 'success' | 'failed';

const STEPS = ['Amount', 'Details', 'Review', 'Done'];

export function ContributeModal({ project, onClose }: ContributeModalProps) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(200);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('MOMO');
  const [exchangeRate, setExchangeRate] = useState(15.20);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState<ModalState>('form');
  const [reference, setReference] = useState('');

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d?.rates?.GHS) setExchangeRate(d.rates.GHS); })
      .catch(() => {});

    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const totalGHS = amount * project.unit_price_ghs;
  const totalUSD = totalGHS / (exchangeRate || 15.20);
  const canProceedStep2 = firstName.trim().length >= 2 && lastName.trim().length >= 2 && contact.trim().length >= 5;

  const handlePay = async () => {
    setError('');
    setModalState('processing');

    const ref = 'BK_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
    setReference(ref);

    try {
      await supabase.from('contributions').insert({
        project_id: project.id,
        donor_first_name: firstName.trim(),
        donor_last_name: lastName.trim(),
        donor_contact: contact.trim(),
        amount_ghs: totalGHS,
        units_contributed: amount,
        payment_reference: ref,
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
      };

      const popup = new Paystack();
      popup.newTransaction({
        key: 'pk_test_0384219b0cda58507d42d42605bf6844211579cb',
        email,
        amount: Math.round(totalGHS * 100),
        currency: 'GHS',
        reference: ref,
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
            .eq('payment_reference', ref);
          setModalState('success');
          setStep(4);
        },
        onCancel: async () => {
          await supabase
            .from('contributions')
            .update({ status: 'failed' })
            .eq('payment_reference', ref);
          setModalState('form');
          setStep(3);
        },
        onError: async () => {
          await supabase
            .from('contributions')
            .update({ status: 'failed' })
            .eq('payment_reference', ref);
          setModalState('failed');
        },
      });
    } catch {
      setModalState('failed');
    }
  };

  const handleRetry = () => {
    setModalState('form');
    setStep(3);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={modalState === 'form' ? onClose : undefined} />

      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[94vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-green-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Contribute</h2>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">{project.title}</p>
            </div>
          </div>
          {modalState === 'form' && (
            <button onClick={onClose} className="p-2 -mr-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-300" />
            </button>
          )}
        </div>

        {modalState !== 'failed' && <StepBar current={step} />}

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
          {modalState === 'processing' && <ProcessingState />}

          {modalState === 'failed' && <FailedState onRetry={handleRetry} onClose={onClose} />}

          {modalState === 'form' && step === 1 && (
            <AmountStep
              amount={amount}
              setAmount={setAmount}
              totalGHS={totalGHS}
              totalUSD={totalUSD}
              unitLabel={project.unit_label}
              maxUnits={project.target_units}
              onNext={() => { setError(''); setStep(2); }}
            />
          )}

          {modalState === 'form' && step === 2 && (
            <DetailsStep
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              contact={contact}
              setContact={setContact}
              payMethod={payMethod}
              setPayMethod={setPayMethod}
              error={error}
              onBack={() => setStep(1)}
              onNext={() => {
                if (!canProceedStep2) {
                  setError('Please fill in all fields correctly.');
                  return;
                }
                setError('');
                setStep(3);
              }}
              canProceed={canProceedStep2}
            />
          )}

          {modalState === 'form' && step === 3 && (
            <ReviewStep
              amount={amount}
              unitLabel={project.unit_label}
              totalGHS={totalGHS}
              firstName={firstName}
              lastName={lastName}
              contact={contact}
              payMethod={payMethod}
              projectTitle={project.title}
              onBack={() => setStep(2)}
              onPay={handlePay}
            />
          )}

          {modalState === 'success' && step === 4 && (
            <SuccessStep
              amount={amount}
              unitLabel={project.unit_label}
              totalGHS={totalGHS}
              firstName={firstName}
              projectTitle={project.title}
              projectSlug={project.slug}
              reference={reference}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 px-6 py-3 shrink-0">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isActive = num === current;
        const isDone = num < current;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300 ${
                isDone ? 'bg-green-600 text-white' : isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'
              }`}>
                {isDone ? <CheckCircle2 className="w-3 h-3" /> : num}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                isActive ? 'text-slate-700' : isDone ? 'text-green-600' : 'text-slate-300'
              }`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${
                isDone ? 'bg-green-400' : 'bg-slate-100'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProcessingState() {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 bg-green-600 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-slate-900 mb-1">Processing Payment</p>
        <p className="text-xs text-slate-400">Complete the payment on the popup window.</p>
        <p className="text-[10px] text-slate-300 mt-2">Do not close this window.</p>
      </div>
    </div>
  );
}

function FailedState({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-5">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-lg font-extrabold text-slate-900 mb-1">Payment Failed</p>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          Something went wrong with your payment. No money has been deducted.
        </p>
      </div>
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
