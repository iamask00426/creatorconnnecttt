
import React, { useState } from 'react';
import type { UserData, Creator } from '../../types';
import { sendCollabRequest } from '../../services/firebase';
import { CalendarIcon } from '../icons';

interface CollabRequestModalProps {
    sender: UserData;
    receiver: Creator;
    onClose: () => void;
}

export const CollabRequestModal: React.FC<CollabRequestModalProps> = ({ sender, receiver, onClose }) => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [dates, setDates] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName || !description || !dates || isSubmitting) {
            setStatus('Please fill all fields.');
            return;
        }
        setIsSubmitting(true);
        setStatus('Sending...');

        try {
            await sendCollabRequest(receiver.uid, {
                senderId: sender.uid,
                senderName: sender.displayName,
                senderPhoto: sender.photoURL,
                projectName,
                description,
                dates, // This will now be YYYY-MM-DD
            });
            setStatus('Request Sent!');
            setTimeout(onClose, 1000);
        } catch (error) {
            console.error("Failed to send collab request:", error);
            setStatus('Failed to send. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md animate-slide-in-up shadow-2xl border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Collaboration Request</h2>
                <p className="text-slate-500 text-sm font-medium mb-6">to <span className="text-slate-900 font-bold">{receiver.displayName}</span></p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Project Name</label>
                        <input 
                            type="text" 
                            value={projectName} 
                            onChange={(e) => setProjectName(e.target.value)} 
                            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-300"
                            placeholder="e.g. Summer Campaign"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Concept / Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows={3} 
                            className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-300 resize-none leading-relaxed"
                            placeholder="Briefly describe the collaboration idea..."
                        ></textarea>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proposed Date</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={dates} 
                                onChange={(e) => setDates(e.target.value)} 
                                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-300 appearance-none relative z-10" 
                            />
                            {/* Icon positioning might need z-index adjustment or pointer-events-none */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20">
                                <CalendarIcon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 bg-white border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="flex-[2] py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white bg-slate-900 shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Request'}
                        </button>
                    </div>
                    
                    {status && (
                        <p className={`text-center text-[10px] font-bold uppercase tracking-wide mt-2 ${status.includes('Failed') || status.includes('fill') ? 'text-red-500' : 'text-green-500'}`}>
                            {status}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};
