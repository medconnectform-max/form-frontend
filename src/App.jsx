import { useState, useCallback, useRef, useEffect } from 'react'; // Added useEffect
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Upload } from 'lucide-react';

import Toast from './components/Toast';
import UploadSection from './components/UploadSection';
import EntryCard from './components/EntryCard';
import CarouselNav from './components/CarouselNav';
import SubmitSection from './components/SubmitSection';
import FloatingVerifyButton from './components/FloatingVerifyButton';
import React from 'react';

let toastId = 0;

function getEmailFromEntry(entry) {
    if (!entry) return '';
    const key = Object.keys(entry).find(k => k.toLowerCase().trim().includes('email'));
    return key ? String(entry[key] || '').trim() : '';
}

export default function App() {
    // ── Persistent State Initialization ──────────────────────────
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('medconnect_entries');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved = localStorage.getItem('medconnect_index');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [toasts, setToasts] = useState([]);

    const [verificationMap, setVerificationMap] = useState(() => {
        const saved = localStorage.getItem('medconnect_verification');
        try {
            return saved ? new Map(JSON.parse(saved)) : new Map();
        } catch (e) {
            return new Map();
        }
    });

    // ── Persistence Side Effect ───────────────────────────────────
    useEffect(() => {
        localStorage.setItem('medconnect_entries', JSON.stringify(entries));
        localStorage.setItem('medconnect_index', currentIndex.toString());
        localStorage.setItem('medconnect_verification', JSON.stringify([...verificationMap.entries()]));
    }, [entries, currentIndex, verificationMap]);

    // ── Toasts ────────────────────────────────────────────────────
    const addToast = useCallback((t) => { const id = ++toastId; setToasts(p => [...p, { ...t, id }]); }, []);
    const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

    // ── Data ──────────────────────────────────────────────────────
    const handleDataParsed = useCallback((data) => {
        setEntries(data);
        setCurrentIndex(0);
        setVerificationMap(new Map());
    }, []);

    // ── Mark helpers (auto-advance after marking) ─────────────────
    const markEntry = useCallback((email, value) => {
        if (!email) return;
        setVerificationMap(prev => new Map(prev).set(email, value));
        // Auto-advance to next entry (after a tiny delay so the FAB animates)
        setCurrentIndex(prev => {
            if (prev < entries.length - 1) {
                return prev + 1;
            }
            return prev; // already last entry
        });
    }, [entries.length]);



    // ── Navigation ────────────────────────────────────────────────
    const goPrev = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), []);
    const goNext = useCallback(() => setCurrentIndex(i => Math.min(i + 1, entries.length - 1)), [entries.length]);

    // ── Touch swipe ───────────────────────────────────────────────
    const touchStartX = useRef(null);
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 50) return;
        dx < 0 ? goNext() : goPrev();
    };

    const hasEntries = entries.length > 0;
    const currentEntry = entries[currentIndex];
    const currentEmail = getEmailFromEntry(currentEntry);
    const currentStatus = verificationMap.get(currentEmail); // true | false | undefined
    const isVerified = currentStatus === true;
    const isNotVerified = currentStatus === false;

    // Only "verified=true" ones go in the final email list
    const verifiedEmails = [...verificationMap.entries()]
        .filter(([, v]) => v === true)
        .map(([email]) => email);

    const reviewedCount = verificationMap.size;
    const verifiedCount = verifiedEmails.length;

    const handleVerify = useCallback(() => markEntry(currentEmail, true), [markEntry, currentEmail]);
    const handleNotVerify = useCallback(() => markEntry(currentEmail, false), [markEntry, currentEmail]);

    return (
        <div className="min-h-screen">
            <Toast toasts={toasts} removeToast={removeToast} />

            {/* ── Sticky Header ─────────────────────────────────────── */}
            <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.06]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4 text-brand-400" />
                        </div>
                        <span className="text-sm font-bold text-white truncate">
                            MedConnect <span className="hidden sm:inline text-slate-400 font-normal">Verifier</span>
                        </span>
                    </div>

                    <AnimatePresence>
                        {hasEntries && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-2"
                            >
                                {/* Entry counter */}
                                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                                    <span className="text-xs text-slate-400">Entry</span>
                                    <span className="text-xs font-bold text-white tabular-nums">{currentIndex + 1}</span>
                                    <span className="text-xs text-slate-600">/</span>
                                    <span className="text-xs text-slate-400 tabular-nums">{entries.length}</span>
                                </div>
                                {/* Verified pill */}
                                {verifiedCount > 0 && (
                                    <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-semibold text-emerald-400">{verifiedCount} verified</span>
                                    </div>
                                )}
                                {/* Reviewed */}
                                {reviewedCount > 0 && (
                                    <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                                        <span className="text-xs text-slate-500">{reviewedCount}/{entries.length} reviewed</span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {hasEntries && (
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex-shrink-0 w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <Upload className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    )}
                </div>
            </header>

            {/* ── Main ──────────────────────────────────────────────── */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                        Payment Verification
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">Dashboard</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-md">
                        Upload your registration CSV, review payment proofs, and send verified emails.
                    </p>
                </motion.div>

                {/* Step 1 */}
                <section className="mb-8">
                    <SectionLabel num="01" label="Upload CSV" />
                    <UploadSection onDataParsed={handleDataParsed} addToast={addToast} />
                </section>

                {/* Step 2 */}
                <AnimatePresence>
                    {hasEntries && (
                        <motion.section key="carousel"
                            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 28 }}
                            transition={{ duration: 0.4 }} className="mb-8"
                        >
                            <SectionLabel num="02" label={`Review Entries — ${entries.length} total`} />

                            <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {currentEntry && (
                                        <EntryCard
                                            key={currentIndex}
                                            entry={currentEntry}
                                            index={currentIndex}
                                            isVerified={isVerified}
                                            hasVerifiedState={currentStatus}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            <CarouselNav current={currentIndex} total={entries.length} onPrev={goPrev} onNext={goNext} />

                            {reviewedCount > 0 && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-center text-xs text-slate-500 mt-3">
                                    <span className="text-emerald-400 font-medium">{verifiedCount} verified</span>
                                    {' · '}
                                    <span className="text-red-400 font-medium">{reviewedCount - verifiedCount} rejected</span>
                                    {' · '}
                                    {entries.length - reviewedCount} remaining
                                </motion.p>
                            )}
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Step 3 */}
                <AnimatePresence>
                    {hasEntries && currentIndex === entries.length - 1 && (
                        <motion.section key="submit"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.1 }}
                            className="mb-28 lg:mb-10"
                        >
                            <SectionLabel num="03" label="Send Verified Users" />
                            <SubmitSection verifiedEmails={verifiedEmails} addToast={addToast} />
                        </motion.section>
                    )}
                </AnimatePresence>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="text-center text-xs text-slate-700 mt-10">
                    MedConnect Overseas © {new Date().getFullYear()} — Internal Admin Tool
                </motion.p>
            </main>

            {/* ── Dual FAB ─────────────────────────────────────────── */}
            <AnimatePresence>
                {hasEntries && (
                    <FloatingVerifyButton
                        isVerified={isVerified}
                        hasVerified={currentStatus}
                        onVerify={handleVerify}
                        onNotVerify={handleNotVerify}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function SectionLabel({ num, label }) {
    return (
        <div className="flex items-center gap-2.5 mb-3">
            <span className="text-[10px] font-black text-brand-500 tabular-nums">{num}</span>
            <div className="w-px h-3 bg-white/20" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
        </div>
    );
}
