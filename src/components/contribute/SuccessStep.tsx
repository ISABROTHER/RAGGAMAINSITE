import { useState } from 'react';
import { CheckCircle2, Share2, Copy, Check, MessageCircle, Twitter } from 'lucide-react';

interface SuccessStepProps {
  amount: number;
  unitLabel: string;
  totalGHS: number;
  firstName: string;
  projectTitle: string;
  projectSlug: string;
  reference: string;
  onClose: () => void;
}

export function SuccessStep({ amount, unitLabel, totalGHS, firstName, projectTitle, projectSlug, reference, onClose }: SuccessStepProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/support?project=${projectSlug}`;
  const shareText = `I just contributed ${amount.toLocaleString()} ${unitLabel} to "${projectTitle}" in Cape Coast North! Join me and make a difference.`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: projectTitle, text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="py-6 text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-[bounceIn_0.6s_ease-out]">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full border-2 border-green-200 animate-ping opacity-20" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Thank You, {firstName}!</h3>
        <p className="text-sm text-slate-500">Your contribution has been received.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 mx-auto max-w-xs space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contributed</span>
          <span className="text-sm font-extrabold text-slate-900">{amount.toLocaleString()} {unitLabel}</span>
        </div>
        <div className="border-t border-dashed border-slate-200" />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount Paid</span>
          <span className="text-sm font-extrabold text-green-700">GH₵{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="border-t border-dashed border-slate-200" />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reference</span>
          <span className="text-[10px] font-mono text-slate-500">{reference}</span>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Spread the Word</p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={shareNative}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-500 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={shareWhatsApp}
            className="w-10 h-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={shareX}
            className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </button>
          <button
            onClick={copyLink}
            className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all ${
              copied ? 'bg-green-50 border-green-200 text-green-600' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
      >
        Done
      </button>
    </div>
  );
}
