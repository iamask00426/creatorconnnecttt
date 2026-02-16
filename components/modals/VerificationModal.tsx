
import React, { useState } from 'react';
import { verify_ig } from '../../services/instagram';
import { InstagramIcon } from '../icons';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerifySuccess: (username: string) => void;
    initialUsername?: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerifySuccess, initialUsername = '' }) => {
    const [username, setUsername] = useState(initialUsername);
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const REEL_URL = "https://www.instagram.com/p/DMuTB-iReBA/";

    const handleOpenReel = () => {
        window.open(REEL_URL, '_blank');
    };

    const handleVerify = async () => {
        if (!username.trim()) {
            setStatus('error');
            setErrorMessage('Please enter your username');
            return;
        }

        setStatus('verifying');
        setErrorMessage('');

        try {
            // Call the existing service
            const isVerified = await verify_ig(username, REEL_URL);
            
            if (isVerified) {
                setStatus('success');
                setTimeout(() => {
                    // Pass the verified username back to the parent to auto-fill the profile
                    onVerifySuccess(username);
                    onClose();
                }, 2000);
            } else {
                setStatus('error');
                setErrorMessage("Comment not found. Please ensure you commented on the reel and wait ~15s for Instagram to sync.");
            }
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage("Connection failed. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-8 pt-12 text-center">
                    {/* Header */}
                    <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-xl shadow-red-500/20 mb-6 transform rotate-3">
                        <InstagramIcon className="w-10 h-10 text-white transform -rotate-3" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Verify Your Identity</h2>
                    <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed px-4">Link your Instagram to unlock exclusive brand deals and priority matching.</p>

                    {/* Steps Visualization */}
                    <div className="bg-slate-50 rounded-3xl p-5 mb-8 border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                             {/* Connector Line */}
                             <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-10"></div>

                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">1</div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Go to Reel</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">2</div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Comment</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">3</div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Verify</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="space-y-4">
                        <button 
                            onClick={handleOpenReel}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Open Instagram Link</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </button>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-lg">@</span>
                            </div>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="your_username"
                                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        {status === 'error' && (
                            <div className="bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in-up">
                                <p className="text-[10px] text-red-500 font-bold">{errorMessage}</p>
                            </div>
                        )}
                        
                        {status === 'success' && (
                            <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center justify-center gap-2 text-green-600 font-black text-xs animate-fade-in-up">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Verified Successfully!
                            </div>
                        )}

                        <button 
                            onClick={handleVerify}
                            disabled={status === 'verifying' || status === 'success'}
                            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                                status === 'success' 
                                ? 'bg-green-500 text-white shadow-green-500/20'
                                : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800 active:scale-95'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {status === 'verifying' ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Syncing...
                                </div>
                            ) : status === 'success' ? (
                                'Return to App'
                            ) : (
                                'Verify Now'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
