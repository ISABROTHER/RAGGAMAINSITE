// src/components/DonationModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  X, CheckCircle2,
  Minus, Plus, Loader2, CreditCard, Smartphone, Landmark, Apple
} from 'lucide-react';
import Paystack from '@paystack/inline-js';

export function DonationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [payMethod, setPayMethod] = useState<'MOMO' | 'CARD' | 'BANK' | 'APPLE'>('MOMO');
  
  // --- CURRENCY LOGIC ---
  const pricePerBookGHS = 1.00; 
  const [exchangeRate, setExchangeRate] = useState(15.20); 
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAdjusting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAdjusting = (direction: 'up' | 'down') => {
    stopAdjusting();
    const adjust = () => {
      setSelectedAmount((prev) => {
        if (direction === 'up') return Math.min(200000, prev + 1);
        return Math.max(1, prev - 1);
      });
    };
    adjust();
    intervalRef.current = setInterval(adjust, 70);
  };

  useEffect(() => {
    if (isOpen) {
      setIsFetchingRate(true);
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => res.json())
        .then(data => {
          if (data?.rates?.GHS) setExchangeRate(data.rates.GHS);
          setIsFetchingRate(false)
        })
        .catch(() => setIsFetchingRate(false));
    }
    return () => stopAdjusting();
  }, [isOpen]);

  if (!isOpen) return null;

  const totalGHS = selectedAmount * pricePerBookGHS;
  const totalUSD = totalGHS / (exchangeRate || 15.20);

  const handlePay = () => {
    if (selectedAmount < 1 || !firstName || !lastName || !contactInfo) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      const amountInPesewas = Math.round(totalGHS * 100);
      
      const email = (payMethod === 'MOMO') 
        ? `${contactInfo.replace(/[^0-9]/g, '') || '0000000000'}@momo.com`
        : contactInfo.trim();

      // Skip Paystack selection screen by forcing these channels
      let channels: string[] = ['card'];
      if (payMethod === 'MOMO') channels = ['mobile_money'];
      if (payMethod === 'BANK') channels = ['bank_transfer'];
      if (payMethod === 'CARD') channels = ['card'];
      if (payMethod === 'APPLE') channels = ['apple_pay'];

      const popup = new Paystack();

      popup.newTransaction({
        key: 'pk_test_0384219b0cda58507d42d42605bf6844211579cb',
        email,
        amount: amountInPesewas,
        currency: 'GHS',
        reference: 'BOOK_' + Date.now() + Math.floor(Math.random() * 1000000),
        channels: channels, 
        metadata: {
          custom_fields: [
            { display_name: "Donor", variable_name: "donor", value: `${firstName} ${lastName}` },
            { display_name: "Books", variable_name: "books", value: selectedAmount.toString() }
          ]
        },
        onSuccess: () => {
          setIsProcessing(false);
          setStep(3);
        },
        onCancel: () => setIsProcessing(false),
        onError: () => {
          setIsProcessing(false);
          alert('Payment failed. Please try again.');
        }
      });
    } catch (error) {
      setIsProcessing(false);
      alert('Initialization error.');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setPayMethod('MOMO');
      setSelectedAmount(1);
      setFirstName('');
      setLastName('');
      setContactInfo('');
      setIsProcessing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-red-800 p-5 text-white flex justify-between items-center shrink-0 z-10 shadow-md">
          <div className="text-left">
            <h2 className="text-lg font-black uppercase tracking-tight">Support Project</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-0.5">Impact a generational future</p>
          </div>
          {!isProcessing && (
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto overscroll-contain bg-white">
          {isProcessing ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-red-800 animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-900">Directing to Secure Payment...</p>
            </div>
          ) : (
            <div className="pb-10 sm:pb-0">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-800 text-white font-black text-[10px]">1</span>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Select Number of Books</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[500, 1000, 5000, 10000].map((num) => (
                      <button key={num} onClick={() => setSelectedAmount(num)} className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${selectedAmount === num ? 'border-green-600 bg-green-50 shadow-sm' : 'border-slate-100 bg-white'}`}>
                        {num.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 px-4 py-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-baseline gap-2">
                        <input type="text" inputMode="numeric" value={selectedAmount === 0 ? "" : selectedAmount.toLocaleString()} onChange={(e) => { const val = parseInt(e.target.value.replace(/,/g, '')); setSelectedAmount(isNaN(val) ? 0 : val); }} className="bg-transparent text-2xl font-black text-slate-900 outline-none w-24 text-center sm:text-left focus:ring-0" style={{ fontSize: '18px' }} placeholder="0" />
                        <span className="text-2xl font-black text-slate-900">BOOKS</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onMouseDown={() => startAdjusting('down')} onTouchStart={() => startAdjusting('down')} onMouseUp={stopAdjusting} onTouchEnd={stopAdjusting} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-red-800 shadow-sm active:scale-95"><Minus className="w-6 h-6" /></button>
                        <button onMouseDown={() => startAdjusting('up')} onTouchStart={() => startAdjusting('up')} onMouseUp={stopAdjusting} onTouchEnd={stopAdjusting} className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-red-800 shadow-sm active:scale-95"><Plus className="w-6 h-6" /></button>
                      </div>
                    </div>
                    <input type="range" min="1" max="200000" step="1" value={selectedAmount} onChange={(e) => setSelectedAmount(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-800" />
                  </div>

                  <div className="bg-green-700 p-5 rounded-2xl text-center text-white shadow-lg">
                    <p className="text-lg font-black uppercase tracking-tight">₵{totalGHS.toLocaleString()}</p>
                    <p className="text-[9px] font-bold opacity-70 mt-1 uppercase tracking-widest">≈ ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</p>
                  </div>

                  <button onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm shadow-xl active:scale-[0.98] transition-all">Proceed to Details</button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-800 text-white font-black text-[10px]">2</span>
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Sponsor Details</h3>
                  </div>

                  {/* Enhanced Method Selector with Network Vibing */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button onClick={() => setPayMethod('MOMO')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${payMethod === 'MOMO' ? 'border-yellow-400 bg-yellow-50 text-slate-900' : 'border-slate-100 text-slate-400'}`}>
                      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                        <Smartphone className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-black uppercase">MoMo</span>
                    </button>
                    
                    <button onClick={() => setPayMethod('CARD')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${payMethod === 'CARD' ? 'border-blue-600 bg-blue-50 text-slate-900' : 'border-slate-100 text-slate-400'}`}>
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <CreditCard className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-black uppercase">Visa/Master</span>
                    </button>

                    <button onClick={() => setPayMethod('BANK')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${payMethod === 'BANK' ? 'border-red-600 bg-red-50 text-slate-900' : 'border-slate-100 text-slate-400'}`}>
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white">
                        <Landmark className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-black uppercase">Transfer</span>
                    </button>

                    <button onClick={() => setPayMethod('APPLE')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${payMethod === 'APPLE' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${payMethod === 'APPLE' ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
                        <Apple className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] font-black uppercase">Apple Pay</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">First Name</label>
                        <input type="text" placeholder="e.g. John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-base outline-none focus:ring-2 focus:ring-red-800/20" style={{ fontSize: '16px' }} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Surname</label>
                        <input type="text" placeholder="e.g. Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-base outline-none focus:ring-2 focus:ring-red-800/20" style={{ fontSize: '16px' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                        {payMethod === 'MOMO' ? "Mobile Money Number" : "Email Address for Receipt"}
                      </label>
                      <input 
                        type={payMethod === 'MOMO' ? "tel" : "email"} 
                        placeholder={payMethod === 'MOMO' ? "024XXXXXXX" : "your@email.com"} 
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-base outline-none focus:ring-2 focus:ring-red-800/20 transition-all" 
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setStep(1)} className="order-2 sm:order-1 w-full sm:w-1/3 py-5 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] active:scale-95 transition-all">Back</button>
                    <button onClick={handlePay} className="order-1 sm:order-2 w-full sm:w-2/3 py-5 bg-red-800 text-white rounded-2xl font-black uppercase text-sm shadow-xl active:scale-[0.98] transition-all">
                      Pay via {payMethod === 'MOMO' ? 'MoMo' : payMethod === 'CARD' ? 'Card' : payMethod === 'BANK' ? 'Bank' : 'Apple Pay'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12" /></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">THANK YOU!</h3>
                  <p className="text-sm text-slate-600 font-medium max-w-xs mx-auto mb-8 italic">Your generational support for {selectedAmount.toLocaleString()} books is appreciated.</p>
                  <button onClick={handleClose} className="w-full py-5 border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase text-xs hover:bg-slate-50">Close Window</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}