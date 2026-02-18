import React from 'react';
import type { UserData, Creator } from '../../types';
import { BriefcaseIcon, SparklesIcon, BoltIcon } from '../icons';

interface DashboardScreenProps {
    currentUser: UserData;
    setActiveTab: (tab: string) => void;
    onViewProfile?: (creator: Creator) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = () => {
    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fade-in relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

            {/* Header */}
            <div className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-xl px-6 py-6 pb-4 border-b border-slate-100/50">
                <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-6 h-6 text-slate-900" />
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Brand Hub</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center pb-32">

                {/* Icon Container with Animation */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
                    <div className="w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-slate-900/20 relative z-10 rotate-3 transition-transform hover:rotate-0 duration-500 cursor-pointer group">
                        <BoltIcon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute -right-2 -top-2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-full shadow-lg border-2 border-slate-50">
                            WIP
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    Something Extraordinary<br />is Coming
                </h2>

                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mb-8">
                    We are building a premium marketplace for you to collaborate with world-class brands.
                    <span className="block mt-2 text-violet-600 font-bold">Stay tuned!</span>
                </p>

                {/* Progress Bar Visual */}
                <div className="w-full max-w-[200px] h-1.5 bg-slate-200 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-slate-900 w-[70%] rounded-full animate-[shimmer_2s_infinite]"></div>
                </div>

                <button
                    onClick={() => alert("You've been added to the waitlist!")}
                    className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4" />
                        Notify Me
                    </span>
                </button>

                <p className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Estimated Launch: Q4 2026
                </p>
            </div>
        </div>
    );
};
