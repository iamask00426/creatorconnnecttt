import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'react-qr-code';
import type { Creator } from '../../types';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
    creator?: Creator; // If present, renders the profile picture UI with actions
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose, creator }) => {
    const [showQR, setShowQR] = useState(false);

    if (!imageUrl) return null;

    const profileLink = creator?.username ? `https://creatorconnect.io/${creator.username}` : `https://creatorconnect.io/user/${creator?.uid}`;

    const handleCopyLink = () => {
        if (creator) {
            navigator.clipboard.writeText(profileLink);
            alert("Link copied to clipboard!");
        }
    };

    const handleShare = async () => {
        if (navigator.share && creator) {
            try {
                await navigator.share({
                    title: `${creator.displayName}'s Profile`,
                    url: profileLink
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            handleCopyLink();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-stone-900/95 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            {/* Background Image Blur Removed as requested */}

            <button
                onClick={onClose}
                className="absolute top-12 left-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50 backdrop-blur-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {creator ? (
                <div className="relative z-10 w-full h-full" onClick={e => e.stopPropagation()}>
                    {/* Centered Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="pointer-events-auto flex flex-col items-center w-full">
                            {showQR ? (
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center animate-slide-up max-w-[85%]">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Scan to Connect</h3>
                                    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                        <QRCode value={profileLink} size={220} className="w-full h-auto" />
                                    </div>
                                    <p className="mt-5 text-sm font-bold text-violet-600 text-center tracking-wide">{profileLink.replace('https://', '')}</p>
                                    <button onClick={() => setShowQR(false)} className="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-sm uppercase tracking-widest w-full">Back to Profile</button>
                                </div>
                            ) : (
                                <div className="relative animate-fade-in-up">
                                    {/* The large circular avatar */}
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        referrerPolicy="no-referrer"
                                        className="w-72 h-72 object-cover rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons Container */}
                    {!showQR && (
                        <div className="absolute bottom-12 inset-x-0 w-full flex justify-center gap-7 px-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => alert("Following coming soon!")}>
                                <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                </div>
                                <span className="text-[11px] font-bold text-white/90 tracking-wide mt-1">Following</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={handleShare}>
                                <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </div>
                                <span className="text-[11px] font-bold text-white/90 tracking-wide mt-1">Share</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={handleCopyLink}>
                                <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                </div>
                                <span className="text-[11px] font-bold text-white/90 tracking-wide mt-1">Copy link</span>
                            </div>

                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setShowQR(true)}>
                                <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                </div>
                                <span className="text-[11px] font-bold text-white/90 tracking-wide mt-1">QR code</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative z-10 w-[100vw] h-[100vh] flex items-center justify-center pointer-events-none p-4">
                    <img
                        src={imageUrl}
                        alt="Full View"
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-full object-contain pointer-events-auto animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>,
        document.body
    );
};
