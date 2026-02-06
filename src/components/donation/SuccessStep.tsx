import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessStepProps {
  currency: 'GHS' | 'USD';
  selectedAmount: number;
  totalCost: number;
  onClose: () => void;
}

export function SuccessStep({ currency, selectedAmount, totalCost, onClose }: SuccessStepProps) {
  return (
    <div className="text-center py-6 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-black text-sm">3</span>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Success</h3>
      </div>
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">THANK YOU!</h3>
      <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xs mx-auto mb-8">
        Your contribution of <span className="font-black text-green-700">{currency === 'GHS' ? '₵' : '$'}{totalCost}</span> for {selectedAmount} books has been recorded.
      </p>
      <button onClick={onClose} className="w-full py-4 border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50">Close Window</button>
    </div>
  );
}