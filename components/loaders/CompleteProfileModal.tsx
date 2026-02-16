import React from 'react';
import { ProfileCompleteIcon } from '../icons';

interface CompleteProfileModalProps {
    onComplete: () => void;
    onDismiss: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ onComplete, onDismiss }) => {
    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center z-50 p-6">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm text-center animate-slide-up shadow-2xl border border-slate-100">
                <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner transition-transform hover:scale-110 duration-500">
                    <ProfileCompleteIcon className="h-10 w-10 text-violet-600" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                    Unlock Your Potential
                </h2>
                
                <p className="text-sm text-slate-500 leading-relaxed px-2">
                    Complete your professional profile to start matching with elite creators and discover your next big project.
                </p>
                
                <div className="mt-10 flex flex-col space-y-3">
                    <button
                        onClick={onComplete}
                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-slate-900 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                    >
                        Complete Profile
                    </button>
                    <button
                        onClick={onDismiss}
                        className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};