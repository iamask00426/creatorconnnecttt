
import React, { useState, useEffect } from 'react';
import type { UserData, Creator } from '../../types';
import { fetchAllCreators } from '../../services/firebase';
import { SparklesIcon, BoltIcon } from '../icons';

interface MagicMatchModalProps {
    currentUser: UserData;
    onClose: () => void;
    onViewProfile: (creator: Creator) => void;
}

export const MagicMatchModal: React.FC<MagicMatchModalProps> = ({ currentUser, onClose, onViewProfile }) => {
    const [scanning, setScanning] = useState(true);
    const [statusText, setStatusText] = useState("Initializing Link...");
    const [matchedCreator, setMatchedCreator] = useState<Creator | null>(null);
    const [displayedScore, setDisplayedScore] = useState(0);
    const [aiReason, setAiReason] = useState("");

    useEffect(() => {
        if (!currentUser) {
            onClose();
            return;
        }

        const runMagicMatch = async () => {
            try {
                const allCreators = await fetchAllCreators();
                const others = (allCreators || []).filter(c => c.uid !== currentUser.uid);

                if (others.length === 0) {
                    setTimeout(() => {
                        setScanning(false);
                        setStatusText("No candidates found.");
                    }, 2000);
                    return;
                }

                // Sequence of simulated real-time analysis
                setTimeout(() => setStatusText("Analyzing Sync Matrix..."), 1200);
                setTimeout(() => setStatusText("Locating Aura Resonance..."), 2800);
                setTimeout(() => setStatusText("Finalizing Connection..."), 4500);

                setTimeout(() => {
                    // Weighted random or niche-based matching logic
                    const nicheMatches = others.filter(o => o.niche === currentUser.niche);
                    const pool = nicheMatches.length > 0 ? nicheMatches : others;
                    const bestMatch = pool[Math.floor(Math.random() * pool.length)];
                    
                    const baseScore = nicheMatches.length > 0 ? 92 : 84;
                    const score = baseScore + Math.floor(Math.random() * 7);

                    setMatchedCreator(bestMatch);
                    setAiReason(`Sync detected! Your focus on **${currentUser.niche || 'innovation'}** creates a natural multiplier with **${bestMatch.displayName}'s** audience engagement patterns.`);
                    
                    setScanning(false);
                    
                    // Score animation
                    let start = 0;
                    const interval = setInterval(() => {
                        start += 3;
                        if (start >= score) {
                            setDisplayedScore(score);
                            clearInterval(interval);
                        } else {
                            setDisplayedScore(start);
                        }
                    }, 30);
                }, 5500);

            } catch (error) {
                console.error("Magic Match sequence failed:", error);
                setScanning(false);
            }
        };
        runMagicMatch();
    }, [currentUser, onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={onClose}></div>
            
            <div className="relative w-full max-w-sm z-10">
                {scanning ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-64 h-64 mb-12">
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-pulse"></div>
                            <div className="absolute inset-10 border border-white/5 rounded-full animate-pulse delay-150"></div>
                            <div className="absolute inset-20 border border-white/5 rounded-full animate-pulse delay-300"></div>
                            <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" style={{ animationDuration: '2s' }}></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-1.5 bg-white/5 rounded-full backdrop-blur-2xl border border-white/10 shadow-2xl">
                                    <img src={currentUser?.photoURL || 'https://picsum.photos/seed/user/100/100'} className="w-24 h-24 rounded-full object-cover border-2 border-white/20" alt="Me" />
                                </div>
                            </div>
                            
                            <div className="absolute top-4 left-10 w-6 h-6 rounded-full bg-violet-500/20 blur-xl animate-bounce"></div>
                        </div>

                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-black text-white tracking-tight">Syncing Creators...</h2>
                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-[0.4em] animate-pulse">{statusText}</p>
                        </div>
                    </div>
                ) : matchedCreator ? (
                    <div className="animate-slide-up">
                        <div className="bg-white rounded-[3.5rem] p-8 shadow-2xl relative overflow-hidden text-center border border-white">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="relative mb-8 mt-4">
                                    <div className="absolute -inset-4 bg-violet-500/10 rounded-full blur-2xl animate-pulse"></div>
                                    <img src={matchedCreator.photoURL} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-2xl border-4 border-slate-50 relative z-10" alt="Match" />
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border-4 border-white shadow-xl z-20">
                                        <span className="text-white font-black text-lg">{displayedScore}%</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-slate-900 mb-1">Aura Match!</h2>
                                <p className="text-slate-400 font-black text-[10px] mb-8 uppercase tracking-widest">Synergy Detected</p>

                                <div className="bg-slate-50 rounded-[2rem] p-6 text-left mb-8 border border-slate-100 shadow-inner">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BoltIcon className="w-3.5 h-3.5 text-violet-600" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">CreatorConnect Insight</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-bold italic">
                                        "{aiReason}"
                                    </p>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Dismiss</button>
                                    <button 
                                        onClick={() => { onViewProfile(matchedCreator); onClose(); }}
                                        className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                                    >
                                        Connect Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-10 text-center animate-slide-up border border-white">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <SparklesIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">Expansion Pending</h3>
                        <p className="text-xs text-slate-500 font-medium mb-8">No compatible sync partners found at this exact frequency.</p>
                        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Close Matrix</button>
                    </div>
                )}
            </div>
        </div>
    );
};
