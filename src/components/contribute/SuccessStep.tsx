import { useState } from 'react';
import { CheckCircle2, Share2, Copy, Check, MessageCircle, Twitter, Download } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative inline-block mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-0 rounded-full border-2 border-green-300"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute inset-0 rounded-full border-2 border-green-200"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">Thank You, {firstName}!</h3>
            <p className="text-sm text-slate-500">Your contribution has been received.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-6 bg-slate-50 rounded-2xl overflow-hidden"
        >
          <div className="p-5 space-y-4">
            <ReceiptRow label="Contributed" value={`${amount.toLocaleString()} ${unitLabel}`} />
            <div className="border-t border-dashed border-slate-200" />
            <ReceiptRow label="Amount Paid" value={`GH₵${totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} highlight />
            <div className="border-t border-dashed border-slate-200" />
            <ReceiptRow label="Reference" value={reference} mono />
          </div>
          <div className="bg-slate-100/50 px-5 py-3 flex items-center justify-center gap-2">
            <Download className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] text-slate-400 font-medium">Receipt saved</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mt-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 mb-3 text-center">Spread the Word</p>
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={shareNative}
              className="flutter-btn flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-green-600/20"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={shareWhatsApp}
              className="flutter-btn w-12 h-12 bg-[#25D366] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={shareX}
              className="flutter-btn w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20"
            >
              <Twitter className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={copyLink}
              className={`flutter-btn w-12 h-12 border-2 rounded-2xl flex items-center justify-center transition-colors ${
                copied ? 'bg-green-50 border-green-200 text-green-600' : 'border-slate-100 text-slate-400'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="shrink-0 px-5 pb-5 pt-2 safe-bottom">
        <motion.button
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onClose}
          className="flutter-btn w-full py-[18px] border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-[15px] uppercase tracking-wider"
        >
          Done
        </motion.button>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-extrabold tabular-nums ${
        highlight ? 'text-green-700' : mono ? 'text-[10px] font-mono text-slate-500 font-bold' : 'text-slate-900'
      }`}>{value}</span>
    </div>
  );
}
