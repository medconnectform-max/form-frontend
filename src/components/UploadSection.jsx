import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import React from 'react';

export default function UploadSection({ onDataParsed, addToast }) {
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('idle'); // idle | uploading | processing | done

    const processFile = useCallback((file) => {
        if (!file) return;
        if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
            addToast({ type: 'error', title: 'Invalid File Type', message: 'Only .csv files are accepted.' });
            return;
        }
        setStage('uploading');
        setProgress(0);

        let prog = 0;
        const interval = setInterval(() => {
            prog += Math.random() * 18 + 5;
            if (prog >= 90) { prog = 90; clearInterval(interval); }
            setProgress(Math.min(prog, 90));
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setProgress(100);
            setStage('processing');
            Papa.parse(file, {
                header: true,
                skipEmptyLines: 'greedy',
                trimHeaders: true,
                complete: (results) => {
                    setTimeout(() => {
                        if (!results.data || results.data.length === 0) {
                            addToast({ type: 'error', title: 'Empty CSV', message: 'No entries found in this file.' });
                            setStage('idle'); setProgress(0); return;
                        }
                        setStage('done');
                        onDataParsed(results.data);
                        addToast({ type: 'success', title: 'CSV Loaded!', message: `${results.data.length} entries parsed.` });
                    }, 800);
                },
                error: () => {
                    addToast({ type: 'error', title: 'Parse Error', message: 'Could not parse the CSV file.' });
                    setStage('idle'); setProgress(0);
                },
            });
        }, 1200);
    }, [addToast, onDataParsed]);

    const handleDrop = useCallback((e) => {
        e.preventDefault(); setIsDragging(false);
        processFile(e.dataTransfer.files[0]);
    }, [processFile]);

    const handleFileInput = (e) => { processFile(e.target.files[0]); e.target.value = ''; };
    const isActive = stage !== 'idle' && stage !== 'done';

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto">
            <label htmlFor="csv-upload"
                onDragOver={(e) => { e.preventDefault(); if (!isActive) setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center w-full min-h-[240px]
          rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging ? 'border-brand-400 bg-brand-500/10 scale-[1.01]' : 'border-white/20 hover:border-brand-500/50 hover:bg-white/5'}
          ${isActive ? 'pointer-events-none' : ''}`}
            >
                <AnimatePresence mode="wait">
                    {stage === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 p-8 text-center">
                            <motion.div animate={isDragging ? { scale: 1.15 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                                className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                                <Upload className="w-7 h-7 text-brand-400" />
                            </motion.div>
                            <div>
                                <p className="text-lg font-semibold text-white">{isDragging ? 'Drop your CSV here' : 'Drop CSV file here'}</p>
                                <p className="text-sm text-slate-400 mt-1">or <span className="text-brand-400 font-medium">click to browse</span></p>
                                <p className="text-xs text-slate-500 mt-2">Only .csv files supported</p>
                            </div>
                        </motion.div>
                    )}
                    {stage === 'uploading' && (
                        <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-6 p-8 w-full">
                            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                                <FileText className="w-7 h-7 text-brand-400" />
                            </motion.div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-white">Uploading file...</p>
                                <p className="text-sm text-slate-400 mt-1">{Math.round(progress)}%</p>
                            </div>
                            <div className="w-3/4 bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                                    animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.2 }} />
                            </div>
                        </motion.div>
                    )}
                    {stage === 'processing' && (
                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 p-8">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Loader2 className="w-10 h-10 text-brand-400" />
                            </motion.div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-white">Processing CSV...</p>
                                <p className="text-sm text-slate-400 mt-1">Parsing entries and validating data</p>
                            </div>
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <motion.div key={i} className="w-2 h-2 rounded-full bg-brand-400"
                                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {stage === 'done' && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 p-8">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                                className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            </motion.div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-white">CSV Loaded!</p>
                                <p className="text-sm text-slate-400 mt-1">Scroll down to review entries</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileInput} disabled={isActive} />
            </label>
        </motion.div>
    );
}
