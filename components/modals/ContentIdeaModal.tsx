import React, { useState } from 'react';
import type { UserData, CalendarEvent } from '../../types';
import { BoltIcon, LocationPinIcon, CalendarIcon, SparklesIcon } from '../icons';
import { GoogleGenAI, Type } from "@google/genai";

interface ContentIdeaModalProps {
    userData: UserData;
    onClose: () => void;
    onUpdateUserData?: (data: Partial<UserData>) => void;
}

interface ContentIdea {
    title: string;
    hook: string;
    concept: string;
    locationTips: string;
    shootLocation: string;
}

const TEMPLATES = {
    HOOKS: [
        "POV: You're in ${city} and trying to embrace your ${niche} life...",
        "5 Hidden Gems in ${city} for ${niche} Lovers",
        "Stop scrolling if you live in ${city}!",
        "The ${niche} scene in ${city} is severely underrated.",
        "A day in the life of a ${niche} creator in ${city}."
    ],
    CONCEPTS: [
        "A cinematic montage of your daily routine with voiceover about passion.",
        "Interview style: stop a stranger and ask them their favorite spot.",
        "Time-lapse of the city skyline transitioning from day to night.",
        "Behind the scenes of your latest project/work.",
        "Comparing expectations vs reality of living in the city."
    ],
    LOCATIONS: [
        "A busy downtown street crossing",
        "A quiet local cafe with good aesthetics",
        "A rooftop with a view",
        "A local park during golden hour",
        "An iconic landmark in the background"
    ],
    TITLES: [
        "City Vibes",
        "Hidden Gems",
        "Day in the Life",
        "Local Secrets",
        "The Aesthetic"
    ]
};

export const ContentIdeaModal: React.FC<ContentIdeaModalProps> = ({ userData, onClose, onUpdateUserData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusLog, setStatusLog] = useState<string[]>([]);
    const [ideas, setIdeas] = useState<ContentIdea[]>([]);
    const [cityInput, setCityInput] = useState(userData.location || '');
    const [isAskingCity, setIsAskingCity] = useState(true);
    const [savedIdeas, setSavedIdeas] = useState<Set<number>>(new Set());

    // Scheduling State
    const [schedulingIdx, setSchedulingIdx] = useState<number | null>(null);
    const [scheduleDate, setScheduleDate] = useState<string>('');

    // API Key Check for UI - Corrected for Vite
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const isOffline = !apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey.trim() === '';

    // --- Dynamic Offline Generator ---
    const generateMockIdeas = (city: string, niche: string): ContentIdea[] => {
        const cityShort = city.split(',')[0];
        const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

        // generate 3 unique ideas
        return Array.from({ length: 3 }).map(() => {
            const hook = getRandom(TEMPLATES.HOOKS)
                .replace(/\${city}/g, cityShort)
                .replace(/\${niche}/g, niche);

            const concept = getRandom(TEMPLATES.CONCEPTS);
            const location = getRandom(TEMPLATES.LOCATIONS);
            const title = getRandom(TEMPLATES.TITLES);

            return {
                title,
                hook,
                concept,
                shootLocation: location,
                locationTips: "Use natural lighting and stabilize your shots."
            };
        });
    };

    const generateIdeas = async (targetCity: string) => {
        if (!userData || isLoading) return;
        setIsLoading(true);
        setIsAskingCity(false);
        // Reset states for new generation
        setSavedIdeas(new Set());
        setSchedulingIdx(null);

        if (isOffline) {
            setStatusLog(["[OFFLINE] No API Key detected", "[SYSTEM] Activating Offline Generator...", "[SYNC] Creating unique combinations..."]);
            setTimeout(() => {
                const uniqueIdeas = generateMockIdeas(targetCity, userData.niche);
                setIdeas(uniqueIdeas);
                setIsLoading(false);
            }, 1500);
            return;
        }

        setStatusLog(["[AI] Initializing Creative Engine...", `[GEO] Analyzing trend data for: ${targetCity}`, "[SYNC] Matching with niche aesthetics..."]);

        try {
            const ai = new GoogleGenAI({ apiKey });

            // Refined Prompt for Maximum Virality
            const prompt = `
            ROLE: World-Class Viral Content Strategist for Short-Form Video (TikTok/Reels/Shorts).
            TASK: Generate 3 specific, high-potential video concepts for a creator.

            CREATOR PROFILE:
            - Niche: ${userData.niche}
            - Location Context: ${targetCity}
            - Vibe: Professional, Aesthetic, Engaging

            REQUIREMENTS:
            1. LOCATION SPECIFICITY: You must use specific landmarks, streets, or distinct cultural vibes of ${targetCity}.
            2. HOOKS: Must be "Pattern Interrupts" (visual or text) that stop the scroll in 2 seconds.
            3. RELATABILITY: Connect the location to the niche in a unique way.

            OUTPUT JSON STRUCTURE (Array 'ideas'):
            - title: Short, punchy internal name for the concept.
            - hook: The exact text overlay or visual action for the first 3 seconds.
            - concept: Brief, directorial instruction on how to shoot the scene.
            - shootLocation: A SPECIFIC physical spot in ${targetCity} (e.g., "The steps of the Met", "Shibuya Crossing", "Local Coffee Shop").
            - locationTips: Lighting, lens choice (e.g. 0.5x), or angle advice.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', // Using Stable Model
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            ideas: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        hook: { type: Type.STRING },
                                        concept: { type: Type.STRING },
                                        shootLocation: { type: Type.STRING },
                                        locationTips: { type: Type.STRING }
                                    },
                                    required: ["title", "hook", "concept", "shootLocation", "locationTips"]
                                }
                            }
                        },
                        required: ["ideas"]
                    }
                }
            });

            let jsonStr = response.text || '{"ideas":[]}';
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            const result = JSON.parse(jsonStr);
            setIdeas(result.ideas || []);
            setIsLoading(false);
        } catch (error) {
            console.error("Content generation error:", error);
            setStatusLog(prev => [...prev, "[ERROR] Connection interrupted. Generating fallback concepts..."]);

            // Fallback for failed API call
            setTimeout(() => {
                const uniqueIdeas = generateMockIdeas(targetCity, userData.niche);
                setIdeas(uniqueIdeas);
                setIsLoading(false);
            }, 1500);
        }
    };

    const handleStartGeneration = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityInput.trim()) {
            generateIdeas(cityInput.trim());
        }
    };

    const handleInitiateSchedule = (idx: number) => {
        setSchedulingIdx(idx);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduleDate(tomorrow.toISOString().split('T')[0]);
    };

    const handleConfirmSchedule = async (idea: ContentIdea, idx: number) => {
        if (!onUpdateUserData || !scheduleDate) {
            console.error("Cannot schedule: Missing callback or date");
            return;
        }

        // Check for Demo User
        if (userData.uid === 'mock-user-123') {
            alert("This is a demo account. Data will not persist to the database.");
            return;
        }

        try {
            const eventDate = new Date(`${scheduleDate}T10:00:00`);
            const newEvent: CalendarEvent = {
                id: `idea-${Date.now()}`,
                title: `Shoot: ${idea.title}`,
                date: eventDate,
                type: 'content',
                location: idea.shootLocation,
                // Pro Tip added to description as requested
                description: `HOOK: ${idea.hook}\n\nCONCEPT: ${idea.concept}\n\nPRO TIP: ${idea.locationTips}`
            };

            const currentSchedule = userData.schedule || [];

            // Await if possible, but the prop function is void. 
            // The App.tsx implementation handles the async write.
            onUpdateUserData({
                schedule: [...currentSchedule, newEvent]
            });

            console.log("Schedule update requested for:", newEvent);

            setSavedIdeas(prev => new Set(prev).add(idx));
            setSchedulingIdx(null);

            // Visual feedback
            const btn = document.activeElement as HTMLButtonElement;
            if (btn) btn.blur();

        } catch (error) {
            console.error("Failed to add event to calendar", error);
            alert("Failed to save to calendar. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex justify-center items-center z-[150] p-4 animate-fade-in">
            <div className="bg-[#F8FAFC] rounded-[2.5rem] w-full max-w-lg h-[85vh] overflow-hidden shadow-2xl relative flex flex-col border border-white/20 pointer-events-auto">

                {/* Abstract Background Blobs */}
                <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="px-7 py-6 flex justify-between items-center bg-white/60 backdrop-blur-xl border-b border-slate-200/60 z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${isOffline ? 'bg-slate-800 shadow-slate-900/20' : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/20'}`}>
                            {isOffline ? <BoltIcon className="w-5 h-5 text-slate-400" /> : <SparklesIcon className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight leading-none">Content Studio</h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <p className="text-[9px] font-black text-violet-600 uppercase tracking-[0.2em]">{isOffline ? 'Offline Mode' : 'AI Creative Director'}</p>
                                {isOffline && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2.5 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-sm border border-slate-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto hide-scrollbar flex flex-col relative z-10">
                    {isAskingCity ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 animate-slide-up">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100">
                                <LocationPinIcon className="w-10 h-10 text-violet-600" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Location Scouting</h3>
                            <p className="text-sm text-slate-500 font-medium mb-12 max-w-[260px] leading-relaxed">
                                Enter a city or specific place to generate hyper-local content concepts tailored to you.
                            </p>

                            <form onSubmit={handleStartGeneration} className="w-full max-w-xs space-y-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={cityInput}
                                        onChange={(e) => setCityInput(e.target.value)}
                                        placeholder="e.g. Shoreditch, London"
                                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold text-center text-base focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-slate-300 shadow-sm"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!cityInput.trim()}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none hover:shadow-2xl hover:shadow-violet-900/10"
                                >
                                    Generate Ideas
                                </button>
                            </form>
                        </div>
                    ) : isLoading ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                            <div className="relative w-32 h-32 mb-12">
                                <div className="absolute inset-0 border-[6px] border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-t-[6px] border-violet-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BoltIcon className="w-12 h-12 text-violet-600 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Developing Concepts</h3>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 rounded-full mb-8">
                                <span className="w-2 h-2 bg-violet-600 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-violet-700 font-black uppercase tracking-widest">
                                    Tailoring to {userData.niche}
                                </p>
                            </div>

                            <div className="space-y-3 text-left w-full max-w-[260px] mx-auto bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                {statusLog.map((log, i) => (
                                    <div key={i} className="text-[10px] font-bold text-slate-500 flex items-center gap-3 animate-fade-in font-mono">
                                        <span className="text-violet-400">➜</span>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 pb-24 space-y-6 animate-fade-in">
                            {/* Location Context Bar */}
                            <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100/80 backdrop-blur-sm sticky top-0 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                                        <LocationPinIcon className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Context</p>
                                        <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">{cityInput}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setIsAskingCity(true); setIdeas([]); }}
                                    className="text-[10px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Change
                                </button>
                            </div>

                            {ideas.map((idea, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-slate-900/10">
                                            Concept 0{idx + 1}
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 mb-5 leading-tight">{idea.title}</h4>

                                    <div className="space-y-4">
                                        <div className="bg-violet-50/50 p-5 rounded-2xl border border-violet-100/50 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                                            <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-2">The Hook</p>
                                            <p className="text-sm font-bold text-slate-800 italic relative z-10">"{idea.hook}"</p>
                                        </div>

                                        <div className="px-2">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Direction</p>
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{idea.concept}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <LocationPinIcon className="w-3 h-3 text-slate-900" /> Location
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-900 leading-tight">{idea.shootLocation}</p>
                                            </div>
                                            <div className="flex-1 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                                                <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <SparklesIcon className="w-3 h-3 text-amber-500" /> Pro Tip
                                                </p>
                                                <p className="text-[11px] font-bold text-amber-900 leading-tight opacity-90">{idea.locationTips}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {schedulingIdx === idx ? (
                                        <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
                                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-4 text-center">Select Shoot Date</label>
                                            <input
                                                type="date"
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 mb-4 text-center"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setSchedulingIdx(null)}
                                                    className="flex-1 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-xl transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleConfirmSchedule(idea, idx)}
                                                    disabled={!scheduleDate}
                                                    className="flex-[2] py-3.5 bg-violet-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-violet-600/20 active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    Confirm & Add
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleInitiateSchedule(idx)}
                                            disabled={savedIdeas.has(idx)}
                                            className={`w-full mt-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 ${savedIdeas.has(idx)
                                                ? 'bg-green-50 text-green-600 border border-green-200 cursor-default shadow-none'
                                                : 'bg-slate-900 text-white shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20'
                                                }`}
                                        >
                                            {savedIdeas.has(idx) ? (
                                                <>
                                                    <CalendarIcon className="w-4 h-4" />
                                                    Added to Calendar
                                                </>
                                            ) : (
                                                'Plan This Shoot'
                                            )}
                                        </button>
                                    )}
                                </div>
                            ))}

                            <div className="text-center pt-6 pb-2">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                    {isOffline ? 'Offline Mode • Dynamic Generator' : 'Powered by creator connect ai'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};