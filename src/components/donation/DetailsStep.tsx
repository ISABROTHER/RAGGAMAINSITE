// src/components/donation/DetailsStep.tsx
import React, { useState } from 'react';
import { User, Phone, ShieldCheck, CreditCard, Apple, Landmark, Smartphone } from 'lucide-react';

interface DetailsStepProps {
  currency: 'GHS' | 'USD';
  selectedAmount: number;
  totalCost: number;
  onBack: () => void;
  onPay: (method: string) => void;
}

export function DetailsStep({ currency, selectedAmount, totalCost, onBack, onPay }: DetailsStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'CARD' | 'BANK' | 'APPLE'>(currency === 'GHS' ? 'MOMO' : 'CARD');

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300 pb-10 sm:pb-0">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-800 text-white font-black text-sm">2</span>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Payment Routing</h3>
      </div>

      <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-3xl">
        <div className="flex justify-between items-center">
          <span className="font-black text-green-700 uppercase text-[10px] tracking-widest">Amount Due</span>
          <span className="text-xl font-black text-green-700">{currency === 'GHS' ? '₵' : '$'}{totalCost.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Gateway</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* MOMO - MTN/TELECEL VIBE */}
          <button onClick={() => setPaymentMethod('MOMO')} className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'MOMO' ? 'border-yellow-400 bg-yellow-50 text-slate-900' : 'border-slate-100 bg-white text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'MOMO' ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Smartphone className="w-3 h-3" />
            </div>
            <span className="text-[8px] font-black uppercase">MoMo</span>
          </button>

          {/* CARD - VISA/MASTER VIBE */}
          <button onClick={() => setPaymentMethod('CARD')} className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'CARD' ? 'border-blue-600 bg-blue-50 text-slate-900' : 'border-slate-100 bg-white text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'CARD' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <CreditCard className="w-3 h-3" />
            </div>
            <span className="text-[8px] font-black uppercase">Card</span>
          </button>

          {/* BANK - TRANSFER VIBE */}
          <button onClick={() => setPaymentMethod('BANK')} className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'BANK' ? 'border-red-600 bg-red-50 text-slate-900' : 'border-slate-100 bg-white text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'BANK' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Landmark className="w-3 h-3" />
            </div>
            <span className="text-[8px] font-black uppercase">Bank</span>
          </button>

          {/* APPLE PAY - ICONIC VIBE */}
          <button onClick={() => setPaymentMethod('APPLE')} className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'APPLE' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'APPLE' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
              <Apple className="w-3 h-3" />
            </div>
            <span className="text-[8px] font-black uppercase">Apple Pay</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Your Name" className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-base outline-none focus:ring-2 focus:ring-red-800/20" style={{ fontSize: '16px' }} />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">
            {paymentMethod === 'MOMO' ? 'MoMo Number' : 'Email Address'}
          </label>
          <div className="relative">
            {paymentMethod === 'MOMO' ? (
              <>
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="tel" placeholder="024 XXX XXXX" className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-base outline-none focus:ring-2 focus:ring-red-800/20" style={{ fontSize: '16px' }} />
              </>
            ) : (
              <>
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" placeholder="receipt@email.com" className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-base outline-none focus:ring-2 focus:ring-red-800/20" style={{ fontSize: '16px' }} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <ShieldCheck className="w-3 h-3 text-green-600" /> 
        Secure {paymentMethod} Protocol Verified
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        <button onClick={onBack} className="order-2 sm:order-1 w-full sm:w-1/3 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] hover:bg-slate-50 transition-all active:scale-95">Back</button>
        <button onClick={() => onPay(paymentMethod)} className="order-1 sm:order-2 w-full sm:w-2/3 py-5 bg-red-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all">
          Pay via {paymentMethod}
        </button>
      </div>
    </div>
  );
} 