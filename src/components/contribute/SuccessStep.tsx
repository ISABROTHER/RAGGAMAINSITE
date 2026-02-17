import { CheckCircle, BookOpen, Share2, X, Copy } from 'lucide-react';
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

export function SuccessStep({
  amount,
  unitLabel,
  totalGHS,
  firstName,
  projectTitle,
  projectSlug,
  reference,
  onClose,
}: SuccessStepProps) {
  const handleShare = async () => {
    const text = `I just contributed ${amount.toLocaleString()} ${unitLabel} to "${projectTitle}" for students in Cape Coast North!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: projectTitle, text, url: window.location.origin + '/projects/' + projectSlug });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {}
    }
  };

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(reference);
    } catch {}
  };

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 pt-4 pb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center mb-6"
        >
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
            Thank you, {firstName}!
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Your contribution of{' '}
            <span className="font-bold text-slate-700">{amount.toLocaleString()} {unitLabel}</span>{' '}
            to <span className="font-bold text-slate-700">{projectTitle}</span> has been received.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600">Contribution Summary</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-green-700 font-medium">Amount</p>
              <p className="text-[12px] font-bold text-green-900">{amount.toLocaleString()} {unitLabel}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-green-700 font-medium">Total Paid</p>
              <p className="text-[12px] font-bold text-green-900">
                GH{'\u20B5'}{totalGHS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="border-t border-dashed border-green-300 my-2" />
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-green-700 font-medium">Reference</p>
              <button
                onClick={handleCopyRef}
                className="flex items-center gap-1.5 group"
              >
                <p className="text-[11px] font-mono font-bold text-green-800 truncate max-w-[160px]">{reference}</p>
                <Copy className="w-3 h-3 text-green-500 group-hover:text-green-700 transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center"
        >
          <p className="text-[13px] text-slate-600 leading-relaxed">
            Every contribution brings us closer to our goal. You are making a real difference in the lives of students in Cape Coast North.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.4 }}
        className="shrink-0 px-5 sm:px-6 pb-5 pt-3 safe-bottom flex gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flutter-btn w-16 h-16 shrink-0 border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="flutter-btn flex-1 py-5 bg-green-600 text-white rounded-2xl font-bold text-base tracking-wide shadow-xl shadow-green-600/25 flex items-center justify-center gap-3 min-h-[60px]"
        >
          <X className="w-4 h-4" />
          Close
        </motion.button>
      </motion.div>
    </div>
  );
}