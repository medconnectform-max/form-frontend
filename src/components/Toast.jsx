import React from 'react';
import { useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <AlertCircle className="w-5 h-5 text-brand-400" />,
};
const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-brand-500/30 bg-brand-500/10',
};

export default function Toast({ toasts, removeToast }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-80">
            <AnimatePresence>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, toast.duration || 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${colors[toast.type]}`}
        >
            <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
                {toast.title && <p className="text-sm font-semibold text-white mb-0.5">{toast.title}</p>}
                <p className="text-sm text-slate-300 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
            </button>
        </motion.div>
    );
}
