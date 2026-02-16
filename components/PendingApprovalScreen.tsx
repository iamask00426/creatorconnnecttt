
import React from 'react';
import type { UserData } from '../types';
import { BoltIcon } from './icons';

interface PendingApprovalScreenProps {
    userData: UserData;
    onRefresh: () => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({ userData, onRefresh }) => {
    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center p-8 z-[200] animate-fade-in">
            <div className="w-full max-w-sm text-center">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
                    <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-amber-100 shadow-xl">
                        <div className="w-16 h-16 rounded-full border-t-4 border-amber-400 border-r-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BoltIcon className="w-8 h-8 text-amber-500" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Application Pending</h1>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    Thanks {userData.displayName}! Your profile is currently under review by our team. This usually takes 24-48 hours.
                </p>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg mb-8 text-left space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-700">Account Created</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-700">Details Submitted</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">Profile Verified</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onRefresh}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                        Check Status
                    </button>


                </div>
            </div>
        </div>
    );
};
