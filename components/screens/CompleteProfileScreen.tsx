import React from 'react';
import type { UserData } from '../../types';
import { getProfileCompletionStatus } from '../../utils/profileCompletion';
import { BoltIcon, CameraIcon } from '../icons';

interface CompleteProfileScreenProps {
    userData: UserData;
    onCompleteProfile: () => void;
}

const FIELD_CONFIG: { key: string; label: string; icon: string }[] = [
    { key: 'name', label: 'Full Name', icon: '👤' },
    { key: 'username', label: 'Unique Link', icon: '🔗' },
    { key: 'socials', label: '2+ Social Handles', icon: '📱' },
    { key: 'followers', label: 'Total Followers', icon: '👥' },
    { key: 'bio', label: 'Bio', icon: '✍️' },
    { key: 'photo', label: 'Profile Picture', icon: '📸' },
];

export const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ userData, onCompleteProfile }) => {
    const status = getProfileCompletionStatus(userData);

    // Determine which fields are filled
    const fieldStatus: Record<string, boolean> = {
        name: !!(userData.displayName && userData.displayName.trim() !== '' && userData.displayName !== 'New Creator'),
        username: !!(userData.username && userData.username.trim() !== ''),
        socials: (['instagram', 'youtube', 'tiktok', 'twitter', 'snapchat'] as const).filter(
            p => !!(userData as any)[p] && (userData as any)[p].trim() !== ''
        ).length >= 2,
        followers: !!(userData.followerCount && userData.followerCount > 0),
        bio: !!(userData.bio && userData.bio.trim() !== ''),
        photo: !!(userData.photoURL && userData.photoURL.trim() !== '' && !userData.photoURL.includes('default') && !userData.photoURL.includes('placeholder')),
    };

    const progressPercent = Math.round((status.filledCount / status.totalRequired) * 100);

    return (
        <div className="fixed inset-0 z-[300] bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex flex-col items-center justify-center overflow-y-auto animate-fade-in">
            {/* Animated Background Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-rose-500/15 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center">
                {/* Header Icon */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-rose-500 blur-2xl opacity-40 rounded-full animate-pulse"></div>
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.75rem] flex items-center justify-center shadow-2xl relative z-10">
                        <BoltIcon className="w-10 h-10 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-black text-white tracking-tight mb-1 text-center">
                    Complete Your Profile
                </h1>
                <p className="text-sm text-slate-400 text-center mb-8 max-w-[280px]">
                    Fill in all required fields to unlock the full Creator Connect experience.
                </p>

                {/* Progress Ring */}
                <div className="relative mb-8">
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                        <circle
                            cx="60" cy="60" r="52" fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 52}`}
                            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-white">{status.filledCount}/{status.totalRequired}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Complete</span>
                    </div>
                </div>

                {/* Checklist */}
                <div className="w-full bg-white/5 backdrop-blur-xl rounded-[1.75rem] border border-white/10 p-5 mb-8 shadow-2xl">
                    <div className="space-y-3">
                        {FIELD_CONFIG.map((field) => {
                            const isChecked = fieldStatus[field.key];
                            return (
                                <div
                                    key={field.key}
                                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 ${isChecked
                                        ? 'bg-green-500/10 border border-green-500/20'
                                        : 'bg-white/5 border border-white/5'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${isChecked
                                        ? 'bg-green-500/20 shadow-lg shadow-green-500/10'
                                        : 'bg-white/10'
                                        }`}>
                                        {isChecked ? (
                                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <span className="text-sm">{field.icon}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs font-bold tracking-wide transition-colors duration-300 ${isChecked ? 'text-green-400' : 'text-slate-300'
                                        }`}>
                                        {field.label}
                                    </span>
                                    {isChecked && (
                                        <span className="ml-auto text-[8px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-md">
                                            Done
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onCompleteProfile}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    <span className="group-hover:translate-x-0.5 transition-transform">Complete Profile Now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>

                <p className="text-[10px] text-slate-600 text-center mt-4 font-medium">
                    You must complete your profile before accessing the app.
                </p>
            </div>
        </div>
    );
};
