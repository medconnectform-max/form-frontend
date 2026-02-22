import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export default function CarouselNav({ current, total, onPrev, onNext }) {
    const percent = total > 1 ? (current / (total - 1)) * 100 : 100;

    return (
        <div className="flex flex-col items-center gap-3 mt-5">
            {/* Track */}
            <div className="w-full max-w-xs bg-slate-900/10 rounded-full h-1 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                    animate={{ width: `${percent}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <motion.button
                    onClick={onPrev}
                    disabled={current === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Previous entry"
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center
                     hover:bg-white/10 active:bg-white/15 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                >
                    <ChevronLeft className="w-5 h-5 text-white" />
                </motion.button>

                <div className="flex items-baseline gap-1 min-w-[80px] justify-center select-none">
                    <motion.span
                        key={current}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        className="text-2xl font-extrabold text-white tabular-nums"
                    >
                        {current + 1}
                    </motion.span>
                    <span className="text-slate-500 text-sm font-medium">/ {total}</span>
                </div>

                <motion.button
                    onClick={onNext}
                    disabled={current === total - 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Next entry"
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center
                     hover:bg-white/10 active:bg-white/15 transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                >
                    <ChevronRight className="w-5 h-5 text-white" />
                </motion.button>
            </div>
        </div>
    );
}
