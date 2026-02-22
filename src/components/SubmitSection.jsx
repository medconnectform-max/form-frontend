import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Users } from 'lucide-react';
import React from 'react';

export default function SubmitSection({ verifiedEmails, addToast }) {
    const [loading, setLoading] = useState(false);
    const count = verifiedEmails.length;

    const dev = 'dev';

    const url = dev === 'dev' ? 'https://form-backend-qlqu.onrender.com' : 'http://localhost:5000';
    const handleSubmit = async () => {
        if (count === 0) {
            addToast({ type: 'error', title: 'No Users Selected', message: 'Please verify at least one user before submitting.' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${url}/api/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedEmails: verifiedEmails }),
            });
            const data = await res.json();
            if (data.success) {
                addToast({ type: 'success', title: 'Submitted!', message: `${count} verified user${count > 1 ? 's' : ''} sent.`, duration: 5000 });
            } else {
                throw new Error(data.message || 'Unknown error');
            }
        } catch (err) {
            addToast({ type: 'error', title: 'Submission Failed', message: err.message || 'Could not connect to server.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
          ${count > 0 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}>
                    <Users className={`w-5 h-5 transition-colors duration-300 ${count > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>
                <div>
                    <motion.p key={count} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-bold text-white tabular-nums">{count} verified</motion.p>
                    <p className="text-xs text-slate-500">{count !== 1 ? 'users' : 'user'} selected</p>
                </div>
            </div>

            {count > 0 && (
                <div className="hidden md:flex flex-wrap gap-2 flex-1 max-h-12 overflow-hidden">
                    {verifiedEmails.slice(0, 3).map(email => (
                        <span key={email} className="info-badge truncate max-w-[200px]">{email}</span>
                    ))}
                    {count > 3 && <span className="info-badge">+{count - 3} more</span>}
                </div>
            )}

            <motion.button onClick={handleSubmit} disabled={loading || count === 0}
                whileHover={count > 0 && !loading ? { scale: 1.03 } : {}}
                whileTap={count > 0 && !loading ? { scale: 0.97 } : {}}
                className="btn-primary flex items-center justify-center gap-2.5 text-sm w-full sm:w-auto whitespace-nowrap">
                {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
                ) : (
                    <><Send className="w-4 h-4" />Send Verified Users{count > 0 ? ` (${count})` : ''}</>
                )}
            </motion.button>
        </motion.div>
    );
}
