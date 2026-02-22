import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, AlertCircle } from 'lucide-react';
import React from 'react';

export default function PdfViewer({ url }) {
    const [embedFailed, setEmbedFailed] = useState(false);

    if (!url || url.trim() === '') {
        return (
            <div className="flex flex-col items-center justify-center h-40 gap-3 rounded-xl bg-white/5 border border-white/10">
                <AlertCircle className="w-8 h-8 text-slate-500" />
                <p className="text-sm text-slate-500">No payment proof attached</p>
            </div>
        );
    }

    // Detect file types
    const isImage = /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(url);
    const driveId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || url.match(/id=([a-zA-Z0-9_-]+)/)?.[1];

    const getPreviewUrl = () => {
        if (isImage) return url;
        if (driveId) {
            // sz=w1000 provides a high-quality thumbnail of the first page
            return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
        }
        return url;
    };

    const previewUrl = getPreviewUrl();

    if (embedFailed) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 gap-4 rounded-xl bg-white/5 border border-white/10"
            >
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-red-400" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-white">Preview Unavailable</p>
                    <p className="text-xs text-slate-500 mt-1">The file may require authentication or be private.</p>
                </div>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-primary text-sm py-2 px-4"
                >
                    <ExternalLink className="w-4 h-4" />
                    Open Original File
                </a>
            </motion.div>
        );
    }

    return (
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900 group">
            <div className="w-full h-[350px] md:h-[500px] lg:h-[650px] flex items-center justify-center overflow-hidden">
                <img
                    src={previewUrl}
                    alt="Payment Proof"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onError={() => setEmbedFailed(true)}
                />
            </div>

            {/* Overlay controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-[10px] font-medium text-white/70 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                        {isImage ? 'Image Preview' : driveId ? 'Document Preview' : 'File Preview'}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-500 hover:bg-brand-600 
                         text-white px-3 py-1.5 rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Full View
                    </a>
                </div>
            </div>


            {/* Always visible "Open" button for mobile/accessibility */}
            {!driveId && !isImage && (
                <div className="absolute top-2 right-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-black/60 hover:bg-black/80 
                         text-white border border-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open
                    </a>
                </div>
            )}
        </div>
    );
}
