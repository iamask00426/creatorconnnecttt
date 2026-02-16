
import React, { useState } from 'react';
import { BoltIcon } from '../icons';

interface CompleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (link: string) => void;
    projectName: string;
}

export const CompleteProjectModal: React.FC<CompleteProjectModalProps> = ({ isOpen, onClose, onConfirm, projectName }) => {
    const [link, setLink] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!link.trim()) {
            setError('Please enter a valid link');
            return;
        }
        onConfirm(link);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100 p-8">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 transform rotate-3">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 leading-tight">Project Complete!</h2>
                    <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed px-2">
                        Share the final link for <strong>"{projectName}"</strong> to update your portfolio.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group text-left">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 mb-1.5 block">Post / Reel Link</label>
                            <input 
                                type="url" 
                                value={link}
                                onChange={(e) => { setLink(e.target.value); setError(''); }}
                                placeholder="https://instagram.com/p/..."
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                                autoFocus
                            />
                            {error && <p className="text-[10px] text-red-500 font-bold mt-2 ml-2">{error}</p>}
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all mt-2"
                        >
                            Confirm Completion
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
        