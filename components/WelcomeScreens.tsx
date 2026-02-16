
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import firebase from "firebase/compat/app";

interface WelcomeScreensProps {
    onComplete: () => void;
    onStartVerification: () => void;
}

// Enhanced Animated Network Illustration
const NetworkIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
        {/* Animated Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-violet-500/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Rotating Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-slate-200/40 rounded-full animate-[spin_20s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] border border-slate-200/60 rounded-full animate-[spin_15s_linear_infinite_reverse]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-violet-500 rounded-full shadow-lg shadow-violet-500/50"></div>
        </div>

        <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Connections */}
            <g stroke="url(#lineGrad)" strokeWidth="1.5" strokeLinecap="round">
                {/* Central Connections */}
                <line x1="200" y1="200" x2="120" y2="140" className="animate-[pulse_3s_ease-in-out_infinite]" />
                <line x1="200" y1="200" x2="280" y2="120" className="animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
                <line x1="200" y1="200" x2="140" y2="280" className="animate-[pulse_3s_ease-in-out_infinite_1s]" />
                <line x1="200" y1="200" x2="260" y2="260" />

                {/* Peripheral Connections */}
                <line x1="120" y1="140" x2="80" y2="180" />
                <line x1="280" y1="120" x2="320" y2="160" />
                <line x1="140" y1="280" x2="100" y2="300" />
            </g>

            {/* Data Packets (Moving dots along lines) */}
            <circle r="3" fill="#8b5cf6" className="animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]">
                <animateMotion path="M200,200 L120,140" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#3b82f6" className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]">
                <animateMotion path="M200,200 L280,120" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#f43f5e" className="animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]">
                <animateMotion path="M140,280 L200,200" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Nodes */}
            <g>
                {/* Center Node */}
                <g className="animate-[bounce_4s_infinite]">
                    <circle cx="200" cy="200" r="28" fill="white" className="drop-shadow-xl" />
                    <circle cx="200" cy="200" r="28" stroke="#f1f5f9" strokeWidth="2" className="animate-pulse" />
                    {/* Bolt Icon in Center */}
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="url(#boltGrad)" transform="translate(188, 188)" />
                </g>

                {/* Satellite Nodes */}
                <g>
                    <circle cx="120" cy="140" r="10" fill="white" className="drop-shadow-lg" />
                    <circle cx="120" cy="140" r="4" fill="#3B82F6" />
                </g>

                <g>
                    <circle cx="280" cy="120" r="12" fill="white" className="drop-shadow-lg" />
                    <circle cx="280" cy="120" r="5" fill="#F59E0B" />
                </g>

                <g>
                    <circle cx="140" cy="280" r="14" fill="white" className="drop-shadow-lg" />
                    <circle cx="140" cy="280" r="6" fill="#10B981" />
                </g>

                <g>
                    <circle cx="260" cy="260" r="9" fill="white" className="drop-shadow-lg" />
                    <circle cx="260" cy="260" r="3" fill="#EC4899" />
                </g>
            </g>

            {/* Floating Elements */}
            <g className="opacity-80">
                <circle cx="80" cy="180" r="6" fill="white" className="animate-[bounce_3s_infinite]" />
                <circle cx="80" cy="180" r="2" fill="#94a3b8" className="animate-[bounce_3s_infinite]" />

                <circle cx="320" cy="160" r="5" fill="white" className="animate-[bounce_4s_infinite_1s]" />
                <circle cx="320" cy="160" r="2" fill="#94a3b8" className="animate-[bounce_4s_infinite_1s]" />

                <circle cx="100" cy="300" r="4" fill="white" className="animate-[bounce_5s_infinite_0.5s]" />
            </g>
        </svg>
    </div>
);

// New component for the 2nd screen overlay - Focused on Creator Collab & Calendar
const PlatformFeaturesOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
        {/* Abstract Background Blurs */}
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-violet-500/30 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-10 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-[80px] animate-pulse delay-1000"></div>

        {/* 1. Collaboration Request Card (Center-Left) */}
        <div className="relative z-20 w-64 transform -translate-x-8 translate-y-4 transition-transform duration-700 hover:scale-105 hover:z-30">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-30 blur animate-pulse"></div>
            <div className="relative bg-white/95 backdrop-blur-2xl p-5 rounded-2xl shadow-2xl border border-white/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Creator Invite</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">2m ago</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white" alt="Creator" />
                        <div className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 leading-tight">Sarah Jenkins</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Travel Photographer</p>
                        <p className="text-[10px] font-bold text-violet-600 mt-0.5">"Bali Content Trip"</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 py-2.5 bg-slate-50 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-400 uppercase tracking-wider border border-slate-100">Ignore</div>
                    <div className="flex-1 py-2.5 bg-slate-900 rounded-lg flex items-center justify-center text-[9px] font-black text-white uppercase tracking-wider shadow-lg shadow-slate-900/20">Let's Go</div>
                </div>
            </div>
        </div>

        {/* 2. Calendar Widget (Floating Top-Right) */}
        <div className="absolute top-[25%] right-[12%] z-10 w-48 animate-[bounce_5s_infinite]">
            <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-white/60 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Upcoming Shoot</span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>

                <div className="flex gap-3 items-center bg-violet-50 p-2 rounded-xl border border-violet-100">
                    <div className="bg-white w-10 h-10 rounded-lg flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
                        <span className="text-[8px] font-bold text-red-500 uppercase leading-none">Oct</span>
                        <span className="text-sm font-black text-slate-900 leading-none">28</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-900 leading-tight">Golden Hour Vlog</p>
                        <p className="text-[9px] font-medium text-slate-500">5:30 PM • Santa Monica</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// New component for the 3rd screen overlay - Brand Focused & Animated
const CommunityOverlay = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {/* Central Energy Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 bg-violet-600/30 rounded-full blur-[40px] animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Orbiting Brand Badges - Ring 1 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] border border-white/10 rounded-full animate-[spin_20s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 animate-[spin_20s_linear_infinite_reverse]">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Fashion</span>
                </div>
            </div>
            <div className="absolute bottom-[15%] left-[5%]">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 animate-[spin_20s_linear_infinite_reverse]">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Tech</span>
                </div>
            </div>
        </div>

        {/* Orbiting Elements - Ring 2 (Reverse) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]">
            <div className="absolute top-1/2 right-0 translate-x-1/2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-lg animate-[spin_15s_linear_infinite]">
                    <img src="https://images.unsplash.com/photo-1529139574466-a302c27e811f?auto=format&fit=crop&w=100&q=80" className="w-full h-full rounded-full object-cover border border-white/50" alt="Brand" />
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 animate-[spin_15s_linear_infinite]">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Lifestyle</span>
                </div>
            </div>
        </div>

        {/* Floating Context Cards (Parallax feel) */}
        <div className="absolute top-[20%] left-[8%] animate-[bounce_5s_infinite]">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 transform -rotate-12 shadow-2xl hover:scale-110 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-black text-slate-900">N</div>
                    <div>
                        <div className="h-1.5 w-16 bg-white/60 rounded-full mb-1.5"></div>
                        <div className="h-1.5 w-10 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <div className="absolute bottom-[25%] right-[8%] animate-[bounce_6s_infinite_1s]">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 transform rotate-6 shadow-2xl hover:scale-110 transition-transform duration-300 cursor-default">
                <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=100&q=80" className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                        <div className="h-1.5 w-14 bg-white/60 rounded-full mb-1.5"></div>
                        <div className="h-1.5 w-20 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const WelcomeScreens: React.FC<WelcomeScreensProps> = ({ onComplete, onStartVerification }) => {
    const [step, setStep] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const screens = [
        {
            layout: 'clean',
            title: "Connect. Create. Grow.",
            description: "Your journey to global collaboration starts here.",
            buttonText: "Get Started",
            buttonStyle: "gradient",
            illustration: <NetworkIllustration />
        },
        {
            layout: 'split',
            title: "Creator Collaborations",
            description: "Connect with like-minded creators and schedule your next masterpiece together.",
            // Updated image to show creative working/studio environment
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
            overlay: <PlatformFeaturesOverlay />,
            buttonText: "Next",
            buttonStyle: "light"
        },
        {
            layout: 'split',
            title: "Partner with Lifestyle Brands",
            description: "Unlock paid collaborations with top-tier fashion, travel, and lifestyle brands.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
            overlay: <CommunityOverlay />,
            buttonText: "Login with Google",
            buttonStyle: "gradient",
            isLast: true
        }
    ];


    const handleNext = async () => {
        setIsTransitioning(true);

        if (step === screens.length - 1) {
            // Last screen - Trigger Google Login
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                await auth.signInWithPopup(provider);
                onComplete();
            } catch (error) {
                console.error("Google Sign In Error", error);
                setIsTransitioning(false); // Re-enable interaction on error
            }
        } else {
            // Normal transition
            setTimeout(() => {
                setStep(step + 1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const currentScreen = screens[step];

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden font-sans">
            {/* Top Section */}
            <div className={`relative flex-shrink-0 transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1) ${currentScreen.layout === 'split' ? 'h-[60%]' : 'h-[55%]'}`}>
                {currentScreen.layout === 'clean' ? (
                    <div className={`w-full h-full flex items-center justify-center p-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="w-full max-w-[320px] aspect-square animate-fade-in-up">
                            {currentScreen.illustration}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-slate-900 transition-opacity duration-500 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}></div>

                        {/* Image */}
                        <img
                            src={currentScreen.image}
                            alt="Welcome"
                            className={`w-full h-full object-cover transition-all duration-[20s] ease-linear scale-110 ${isTransitioning ? 'opacity-0' : 'opacity-100 scale-100'}`}
                            style={{ transform: !isTransitioning ? 'scale(1.15)' : 'scale(1)' }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>

                        {/* Custom Overlay Components (Floating Cards) */}
                        <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                            {currentScreen.overlay}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Content Section */}
            <div className="flex-grow flex flex-col px-8 pb-10 pt-6 bg-white relative z-10 rounded-t-[2.5rem] -mt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className={`flex-grow flex flex-col justify-start space-y-4 transition-all duration-500 ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <h1 className={`font-black text-slate-900 tracking-tight leading-[1.1] ${currentScreen.layout === 'split' ? 'text-3xl pr-4' : 'text-4xl text-center mt-2'}`}>
                        {step === 0 ? (
                            <>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Connect.</span> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Create.</span> <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-rose-600">Grow.</span>
                            </>
                        ) : (
                            currentScreen.title
                        )}
                    </h1>

                    {currentScreen.description && (
                        <p className={`text-slate-500 font-medium leading-relaxed ${currentScreen.layout === 'split' ? 'text-sm pr-6' : 'text-base text-center max-w-xs mx-auto'}`}>
                            {currentScreen.description}
                        </p>
                    )}
                </div>

                <div className="mt-6 space-y-6">
                    {/* Pagination Dots */}
                    <div className="flex gap-2 justify-center">
                        {screens.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === step ? 'w-8 bg-slate-900' : 'w-1.5 bg-slate-200'}`}
                            />
                        ))}
                    </div>

                    {/* Main Action Button */}
                    <button
                        onClick={handleNext}
                        className={`w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 shadow-xl hover:shadow-2xl hover:-translate-y-1 ${currentScreen.buttonStyle === 'gradient'
                            ? 'bg-slate-900 text-white shadow-slate-900/20'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-slate-200/50'
                            }`}
                    >
                        {currentScreen.buttonText}
                    </button>

                    {/* Footer Actions */}
                    <div className="h-4 flex items-center justify-center">
                        {!currentScreen.isLast ? (
                            <button
                                onClick={onComplete}
                                className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
                            >
                                Skip Intro
                            </button>
                        ) : (
                            <button
                                onClick={onComplete}
                                className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
                            >
                                Already have an account?
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

