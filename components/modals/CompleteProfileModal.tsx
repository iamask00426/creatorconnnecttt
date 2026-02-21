import React from 'react';
import { ProfileCompleteIcon } from '../icons';

interface CompleteProfileModalProps {
    onComplete: () => void;
    onDismiss: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ onComplete, onDismiss }) => {
    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex justify-center items-center z-50 p-6 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-10 w-full max-w-sm text-center animate-slide-up shadow-2xl border border-white/40 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-violet-200/50 transition-transform hover:scale-110 duration-500 relative z-10 group">
                    <div className="absolute inset-0 bg-violet-500/20 rounded-3xl blur-xl group-hover:bg-violet-500/30 transition-colors"></div>
                    <ProfileCompleteIcon className="h-10 w-10 text-violet-600 relative z-10" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3 relative z-10">
                    Unlock Your Potential
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed px-2 relative z-10 font-medium">
                    Complete your professional profile to start matching with elite creators and discover your next big project.
                </p>

                <div className="mt-10 flex flex-col space-y-3 relative z-10">
                    <button
                        onClick={onComplete}
                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-slate-900 shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 active:scale-95 transition-all overflow-hidden relative group"
                    >
                        <span className="relative z-10">Complete Profile</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </button>
                    <button
                        onClick={onDismiss}
                        className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 active:bg-slate-100 transition-all"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};