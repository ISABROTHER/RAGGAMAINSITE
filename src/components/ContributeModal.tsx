import { useState, useEffect, useRef } from 'react';
import { X, Loader2, BookOpen, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const STEP_LABELS = ['Amount', 'Details', 'Review', 'Done'];

export function ContributeModal({ project, onClose }: ContributeModalProps) {
  const [step, setStep] = useState(1);
  const prevStep = useRef(1);
  const [amount, setAmount] = useState(100);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('MOMO');
  const [exchangeRate, setExchangeRate] = useState(11.00);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState<ModalState>('form');
  const [reference, setReference] = useState('');

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://v6.exchangerate-api.com/v6/latest/USD');
        const d = await res.json();
        if (d?.conversion_rates?.GHS > 5 && d.conversion_rates.GHS < 30) { setExchangeRate(d.conversion_rates.GHS); return; }
      } catch {}
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const d = await res.json();
        if (d?.rates?.GHS > 5 && d.rates.GHS < 30) { setExchangeRate(d.rates.GHS); return; }
      } catch {}
      try {
        const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
        const d = await res.json();
        if (d?.usd?.ghs > 5 && d.usd.ghs < 30) { setExchangeRate(d.usd.ghs); return; }
      } catch {}
    };
    fetchRate();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const direction = step > prevStep.current ? 1 : -1;

  const goToStep = (s: number) => {
    prevStep.current = step;
    setStep(s);
  };

  const UNIT_PRICE_USD = 0.10;
  const unitPriceGHS = UNIT_PRICE_USD * (exchangeRate || 11.00);
  const totalGHS = amount * unitPriceGHS;
  const totalUSD = amount * UNIT_PRICE_USD;
  const canProceedStep2 = firstName.trim().length >= 2 && lastName.trim().length >= 2 && contact.trim().length >= 5;

  const verifyPayment = async (ref: string): Promise<string> => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference: ref }),
      });
      const data = await res.json();
      return data.status || 'pending';
    } catch {
      return 'pending';
    }
  };

  const generateSecureReference = (): string => {
    const timestamp = Date.now();
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const randomHex = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return `BK_${timestamp}_${randomHex.substring(0, 12)}`;
  };

  const handlePay = async () => {
    setError('');
    setModalState('processing');

    const ref = generateSecureReference();
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

      localStorage.setItem('pending_payment_ref', ref);

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
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
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
          await new Promise(resolve => setTimeout(resolve, 1500));
          const status = await verifyPayment(ref);
          localStorage.removeItem('pending_payment_ref');

          if (status === 'completed') {
            setModalState('success');
            goToStep(4);
          } else {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const retryStatus = await verifyPayment(ref);
            if (retryStatus === 'completed') {
              setModalState('success');
              goToStep(4);
            } else {
              setModalState('failed');
            }
          }
        },
        onCancel: async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await verifyPayment(ref);
          localStorage.removeItem('pending_payment_ref');

          if (status === 'completed') {
            setModalState('success');
            goToStep(4);
          } else {
            setModalState('form');
            goToStep(3);
          }
        },
        onError: async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const status = await verifyPayment(ref);
          localStorage.removeItem('pending_payment_ref');

          if (status === 'completed') {
            setModalState('success');
            goToStep(4);
          } else {
            setModalState('failed');
          }
        },
      });
    } catch {
      setModalState('failed');
    }
  };

  const handleRetry = () => {
    setModalState('form');
    goToStep(3);
    setError('');
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '40%' : '-40%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={modalState === 'form' ? onClose : undefined}
      />

      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag={modalState === 'form' ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 100 || velocity.y > 300) {
            onClose();
          }
        }}
        className="relative bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: 'min(92vh, 800px)', touchAction: 'none' }}
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1.5 sm:hidden cursor-grab active:cursor-grabbing" />

        <div className="flex items-center justify-between px-5 sm:px-6 pt-3 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-green-700" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-slate-900 leading-tight">Contribute</h2>
              <p className="text-[11px] text-slate-500 font-medium leading-tight truncate max-w-[180px]">{project.title}</p>
            </div>
          </div>
          {modalState === 'form' && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={onClose}
              className="flutter-btn w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </motion.button>
          )}
        </div>

        {modalState !== 'failed' && (
          <div className="px-5 sm:px-6 pb-4 pt-1 shrink-0">
            <StepIndicator current={step} total={4} labels={STEP_LABELS} />
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {modalState === 'processing' && <ProcessingState />}
          {modalState === 'failed' && <FailedState onRetry={handleRetry} onClose={onClose} />}

          {modalState === 'form' && (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {step === 1 && (
                  <AmountStep
                    amount={amount}
                    setAmount={setAmount}
                    totalGHS={totalGHS}
                    totalUSD={totalUSD}
                    unitLabel={project.unit_label}
                    maxUnits={project.target_units}
                    onNext={() => { setError(''); goToStep(2); }}
                  />
                )}
                {step === 2 && (
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
                    onBack={() => goToStep(1)}
                    onNext={() => {
                      if (!canProceedStep2) { setError('Please fill in all fields correctly.'); return; }
                      setError(''); goToStep(3);
                    }}
                    canProceed={canProceedStep2}
                  />
                )}
                {step === 3 && (
                  <ReviewStep
                    amount={amount}
                    unitLabel={project.unit_label}
                    totalGHS={totalGHS}
                    totalUSD={totalUSD}
                    firstName={firstName}
                    lastName={lastName}
                    contact={contact}
                    payMethod={payMethod}
                    projectTitle={project.title}
                    onBack={() => goToStep(2)}
                    onPay={handlePay}
                  />
                )}
              </motion.div>
            </AnimatePresence>
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
      </motion.div>
    </div>
  );
}

function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={i} className="flex items-center flex-1 gap-1">
            <div className="flex items-center gap-1.5 shrink-0">
              <motion.div
                animate={{
                  scale: active ? 1 : 0.9,
                  backgroundColor: done ? '#16a34a' : active ? '#0f172a' : '#f1f5f9',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-6 h-6 rounded-full flex items-center justify-center"
              >
                {done ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <span className={`text-[9px] font-bold ${active ? 'text-white' : 'text-slate-300'}`}>{num}</span>
                )}
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
                active ? 'text-slate-700' : done ? 'text-green-600' : 'text-slate-300'
              }`}>{labels[i]}</span>
            </div>
            {i < total - 1 && (
              <div className="flex-1 h-[2px] rounded-full overflow-hidden bg-slate-100 mx-0.5">
                <motion.div
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProcessingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-14 h-14 text-green-600" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-5 h-5 bg-green-600 rounded-full" />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-[15px] font-bold text-slate-900 mb-1.5">Processing Payment</p>
        <p className="text-sm text-slate-400">Complete the payment on the popup window.</p>
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <div className="w-2 h-2 rounded-full bg-green-600 flutter-dot-1" />
          <div className="w-2 h-2 rounded-full bg-green-600 flutter-dot-2" />
          <div className="w-2 h-2 rounded-full bg-green-600 flutter-dot-3" />
        </div>
        <p className="text-[11px] text-slate-300 mt-3">Do not close this window</p>
      </div>
    </div>
  );
}

function FailedState({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 py-16">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center"
      >
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center"
      >
        <p className="text-lg font-extrabold text-slate-900 mb-1.5">Payment Failed</p>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Something went wrong with your payment. No money has been deducted from your account.
        </p>
      </motion.div>
      <div className="flex gap-3 w-full max-w-xs px-5 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="flutter-btn flex-1 py-[16px] border-2 border-slate-100 text-slate-600 rounded-2xl font-bold text-sm"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRetry}
          className="flutter-btn flex-1 py-[16px] bg-green-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-600/20"
        >
          Try Again
        </motion.button>
      </div>
    </div>
  );
}