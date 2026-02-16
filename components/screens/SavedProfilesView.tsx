
import React, { useState, useEffect } from 'react';
import type { Creator } from '../../types';
import { getSavedCreators } from '../../services/firebase';
import { CreatorListSkeleton } from '../loaders/CreatorListSkeleton';

interface SavedProfilesViewProps {
    savedIds: string[];
    onViewProfile: (creator: Creator) => void;
    onBack: () => void;
}

export const SavedProfilesView: React.FC<SavedProfilesViewProps> = ({ savedIds, onViewProfile, onBack }) => {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Create a stable key for the effect dependency by COPYING the array before sorting
    // This prevents mutating the prop directly which causes React update issues
    const savedIdsKey = JSON.stringify([...(savedIds || [])].sort());

    useEffect(() => {
        let isMounted = true;

        const loadSaved = async () => {
            if (!savedIds || savedIds.length === 0) {
                if (isMounted) {
                    setCreators([]);
                    setIsLoading(false);
                }
                return;
            }

            if (isMounted) setIsLoading(true);
            
            try {
                const data = await getSavedCreators(savedIds);
                if (isMounted) {
                    setCreators(data);
                }
            } catch (error) {
                console.error("Failed to load saved profiles", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadSaved();

        return () => {
            isMounted = false;
        };
    }, [savedIdsKey]); 

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-slide-up">
            <header className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 shadow-sm flex items-center">
                <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-slate-900">Saved Profiles</h1>
            </header>

            <div className="flex-grow overflow-y-auto p-4 space-y-3 pb-32">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <CreatorListSkeleton key={i} />)
                ) : creators.length > 0 ? (
                    creators.map((c, index) => (
                        <div 
                            key={c.uid}
                            onClick={() => onViewProfile(c)}
                            className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all border border-transparent hover:border-slate-100 active:scale-[0.99] animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms`}} 
                        >
                            <img src={c.photoURL || 'https://picsum.photos/seed/placeholder/100/100'} className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-100" alt={c.displayName || 'Creator'} />
                            <div className="flex-grow">
                                <h3 className="font-bold text-slate-900">{c.displayName}</h3>
                                <p className="text-sm text-violet-700 font-medium">{c.niche}</p>
                                <p className="text-xs text-slate-500">{c.location}</p>
                            </div>
                            <div className="self-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-bold">No profiles saved yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Bookmark creators you want to work with later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
