import { motion } from 'framer-motion';
import {
    Phone, GraduationCap, BookOpen,
    CreditCard, MessageSquare, Radio, Rss, Clock
} from 'lucide-react';
import PdfViewer from './PdfViewer';

import React from 'react';
const getField = (row, keys) => {
    for (const k of keys) {
        const val = Object.entries(row).find(([key]) =>
            key.toLowerCase().trim().includes(k.toLowerCase())
        );
        if (val && val[1] && String(val[1]).trim()) return String(val[1]).trim();
    }
    return null;
};

function InfoChip({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center gap-1.5 text-slate-500">
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-snug break-words">{value}</p>
        </div>
    );
}

export default function EntryCard({ entry, index, isVerified, hasVerifiedState }) {
    console.log(entry)
    const name = getField(entry, ['full name', 'name']);
    const email = getField(entry, ['email address', 'email']);
    const phone = getField(entry, ['phone number', 'phone', 'mobile']);
    const university = getField(entry, ['university', 'college', 'institution']);
    const semester = getField(entry, ['semester', 'year', 'current semester']);
    const payment = getField(entry, ['mode of payment', 'payment mode', 'bank']);
    const pdfUrl = getField(entry, ['upload proof', 'proof of payment', 'proof']);
    const subscriber = getField(entry, ['subscriber', 'medconnect']);
    const heard = getField(entry, ['how did you hear', 'hear about']);
    const expect = getField(entry, ['expectations', 'expectation']);
    const timestamp = getField(entry, ['timestamp', 'time', 'date']);

    const borderClass = isVerified
        ? 'ring-1 ring-emerald-500/40'
        : hasVerifiedState === false
            ? 'ring-1 ring-red-500/30'
            : '';

    const avatarGradient = isVerified
        ? 'from-emerald-500 to-teal-500'
        : hasVerifiedState === false
            ? 'from-red-500 to-rose-600'
            : 'from-brand-500 to-violet-500';

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className={`glass-card rounded-2xl overflow-hidden ${borderClass}`}
        >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-5 pb-4 bg-gradient-to-r from-brand-900/50 via-violet-900/20 to-transparent border-b border-white/[0.07]">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex-shrink-0
              bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-lg font-bold text-white shadow-lg`}>
                            {name ? name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl font-bold text-white leading-tight truncate">{name || 'Unknown Name'}</h2>
                            <p className="text-sm text-brand-300 mt-0.5 truncate">{email || 'No email'}</p>
                            {isVerified && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 mt-1">
                                    ✓ Payment Verified
                                </span>
                            )}
                            {hasVerifiedState === false && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5 mt-1">
                                    ✗ Not Verified
                                </span>
                            )}
                        </div>
                    </div>
                    {timestamp && (
                        <div className="hidden sm:flex items-center gap-1.5 info-badge flex-shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[11px] truncate max-w-[160px]">{timestamp}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Body — two-column desktop, single-column mobile */}
            <div className="p-4 sm:p-6 pb-28 lg:pb-6">
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">

                    {/* Left — Details */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">Applicant Details</p>
                            <div className="grid grid-cols-2 gap-2">
                                <InfoChip icon={Phone} label="Phone" value={phone} />
                                <InfoChip icon={GraduationCap} label="University" value={university} />
                                <InfoChip icon={BookOpen} label="Semester" value={semester} />
                                <InfoChip icon={CreditCard} label="Payment Via" value={payment} />

                            </div>
                        </div>

                    </div>

                    {/* Right — PDF */}
                    <div className="mt-4 lg:mt-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">Payment Proof</p>
                        <PdfViewer url={pdfUrl} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
