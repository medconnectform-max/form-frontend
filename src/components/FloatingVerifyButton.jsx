import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX, Check, X } from 'lucide-react';
import React from 'react';

/**
 * Two FABs fixed at bottom:
 *  - Left:  "Not Verified" (red tint)
 *  - Right: "Verified" (green)
 * Tapping either marks the entry and auto-advances to the next.
 * Hidden on lg+ screens (desktop uses inline toggle inside card if needed — but
 * by request the inline toggle is also removed, so this is the only way to mark).
 */
export default function FloatingVerifyButton({ isVerified, hasVerified, onVerify, onNotVerify }) {
    return (
        <div className="fixed bottom-5 left-0 right-0 flex justify-center gap-3 z-40 px-5 pointer-events-none">

            {/* ── NOT VERIFIED button ─────────────────────────── */}
            <motion.button
                onClick={onNotVerify}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`
          pointer-events-auto flex items-center gap-2.5 px-5 py-3.5 rounded-2xl
          shadow-2xl backdrop-blur-xl border-2 transition-colors duration-300
          flex-1 max-w-[180px] justify-center touch-manipulation
          ${hasVerified === false
                        ? 'bg-red-500/90 border-red-400 shadow-red-500/30'
                        : 'bg-slate-900/80 border-white/15 shadow-slate-900/40 hover:border-red-500/40'
                    }
        `}
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
                <AnimatePresence mode="wait">
                    {hasVerified === false ? (
                        <motion.span key="active-no"
                            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </span>
                            <span className="text-sm font-bold text-white">Not Verified</span>
                        </motion.span>
                    ) : (
                        <motion.span key="idle-no"
                            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <ShieldX className="w-5 h-5 text-red-400/80 flex-shrink-0" />
                            <span className="text-sm font-semibold text-slate-300">Not Verified</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* ── VERIFIED button ─────────────────────────────── */}
            <motion.button
                onClick={onVerify}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`
          pointer-events-auto flex items-center gap-2.5 px-5 py-3.5 rounded-2xl
          shadow-2xl backdrop-blur-xl border-2 transition-colors duration-300
          flex-1 max-w-[180px] justify-center touch-manipulation
          ${isVerified
                        ? 'bg-emerald-500/90 border-emerald-400 shadow-emerald-500/30'
                        : 'bg-slate-900/80 border-white/15 shadow-slate-900/40 hover:border-emerald-500/40'
                    }
        `}
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
                <AnimatePresence mode="wait">
                    {isVerified ? (
                        <motion.span key="active-yes"
                            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </span>
                            <span className="text-sm font-bold text-white">Verified ✓</span>
                        </motion.span>
                    ) : (
                        <motion.span key="idle-yes"
                            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <ShieldCheck className="w-5 h-5 text-emerald-400/80 flex-shrink-0" />
                            <span className="text-sm font-semibold text-slate-300">Verified</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
