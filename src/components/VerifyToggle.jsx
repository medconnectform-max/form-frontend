import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function VerifyToggle({ email, isVerified, onToggle }) {
    return (
        <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`
        w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-300
        ${isVerified
                    ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }
      `}
        >
            <div className="flex items-center gap-3">
                <motion.div
                    animate={isVerified
                        ? { scale: 1, backgroundColor: 'rgba(16,185,129,0.2)' }
                        : { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)' }
                    }
                    className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors duration-300"
                    style={{ borderColor: isVerified ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)' }}
                >
                    <ShieldCheck className={`w-5 h-5 transition-colors duration-300 ${isVerified ? 'text-emerald-400' : 'text-slate-500'}`} />
                </motion.div>
                <div className="text-left">
                    <p className={`text-sm font-semibold transition-colors duration-300 ${isVerified ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {isVerified ? 'Payment Verified ✓' : 'Mark as Payment Verified'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[240px]">{email}</p>
                </div>
            </div>

            {/* Toggle pill */}
            <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0
        ${isVerified ? 'bg-emerald-500' : 'bg-white/15'}`}>
                <motion.div
                    animate={{ x: isVerified ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                />
            </div>
        </motion.button>
    );
}
