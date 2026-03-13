import React, { useState, useEffect } from 'react';
import type { UserData } from '../../types';
import { updateUserProfile } from '../../services/firebase';
import { CalendarIcon, SparklesIcon, BoltIcon, MessagesIcon } from '../icons';

interface WelcomeTourModalProps {
    currentUser: UserData;
    onUpdateUserData: (data: Partial<UserData>) => void;
    onClose: () => void;
}

export const WelcomeTourModal: React.FC<WelcomeTourModalProps> = ({ currentUser, onUpdateUserData, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation shortly after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = async () => {
        setIsVisible(false);
        setTimeout(async () => {
            onClose();
            if (currentUser && currentUser.hasSeenTour !== true) {
                try {
                    await updateUserProfile(currentUser.uid, { hasSeenTour: true });
                    onUpdateUserData({ hasSeenTour: true });
                } catch (error) {
                    console.error('Failed to update tour status:', error);
                }
            }
        }, 300); // Wait for exit animation
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const slides = [
        {
            title: "Welcome to CreatorCo",
            subtitle: "Your central hub for high-impact networking.",
            icon: <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-8 mx-auto transform -rotate-6"><span className="text-5xl">👋</span></div>,
            description: "We built this platform to help ambitious creators connect, plan, and grow exponentially together."
        },
        {
            title: "Find Your Perfect Match",
            subtitle: "Map-Based Discovery & Smart Filters",
            icon: <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-8 mx-auto transform rotate-3"><SparklesIcon className="w-12 h-12 text-white" /></div>,
            description: "Use the Explore tab to find creators by niche, location, or follower count. Our Idea Matching engine will even suggest video concepts for you both!"
        },
        {
            title: "Plan & Execute",
            subtitle: "The Creator Content Calendar",
            icon: <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-8 mx-auto transform -rotate-3"><CalendarIcon className="w-12 h-12 text-white" /></div>,
            description: "Keep your collaborations on track. Mark off shoot days, edit deadlines, and publishing dates directly on your personal profile calendar."
        },
        {
            title: "Connect Instantly",
            subtitle: "Seamless Messaging & WhatsApp",
            icon: <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 mb-8 mx-auto transform rotate-6"><MessagesIcon active={true} className="w-12 h-12 text-white" /></div>,
            description: "Ditch the cold emails. Drop directly into their DMs or trigger instant WhatsApp notifications to get your collaborations moving."
        }
    ];

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${isVisible ? 'opacity-100 backdrop-blur-md bg-slate-900/60' : 'opacity-0 bg-transparent'}`}>
            <div 
                className={`bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
            >
                {/* Header Actions */}
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                    <button onClick={handleClose} className="p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 backdrop-blur-sm transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex w-full h-1.5 bg-slate-100 mt-2">
                    {slides.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-full flex-1 transition-all duration-500 ${i <= currentSlide ? 'bg-violet-500' : 'bg-transparent'}`}
                        />
                    ))}
                </div>

                {/* Carousel Content */}
                <div className="relative w-full h-[400px] overflow-hidden">
                    {slides.map((slide, i) => (
                        <div 
                            key={i}
                            className={`absolute inset-0 px-8 flex flex-col items-center justify-center text-center transition-all duration-500 transform ${
                                i === currentSlide ? 'opacity-100 translate-x-0' : 
                                i < currentSlide ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                            }`}
                        >
                            {slide.icon}
                            <h2 className="text-2xl font-black text-slate-900 mb-1">{slide.title}</h2>
                            <p className="text-sm font-bold text-violet-600 mb-4">{slide.subtitle}</p>
                            <p className="text-slate-500 leading-relaxed font-medium">{slide.description}</p>
                        </div>
                    ))}
                </div>

                {/* Footer Controls */}
                <div className="px-8 pb-8 flex items-center justify-between">
                    <div className="flex space-x-2 w-1/3">
                        {currentSlide > 0 && (
                            <button onClick={prevSlide} className="font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                Back
                            </button>
                        )}
                    </div>

                    <div className="flex justify-center space-x-1.5 w-1/3">
                        {slides.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-4 bg-violet-500' : 'w-1.5 bg-slate-200'}`} />
                        ))}
                    </div>

                    <div className="flex justify-end w-1/3">
                        <button 
                            onClick={nextSlide}
                            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-black/10"
                        >
                            {currentSlide === slides.length - 1 ? "Let's Go!" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
