
import React, { useState, useEffect, useMemo } from 'react';
import type { ExploreFilters } from '../../types';
import { creatorNiches } from '../../constants';

interface FilterModalProps {
    onClose: () => void;
    onApply: (filters: ExploreFilters) => void;
    initialFilters: ExploreFilters;
}

const followerRanges = ['<10k', '10k-100k', '100k-1M', '>1M'];

export const FilterModal: React.FC<FilterModalProps> = ({ onClose, onApply, initialFilters }) => {
    const [localFilters, setLocalFilters] = useState<ExploreFilters>(initialFilters);

    const allNiches = useMemo(() => Object.values(creatorNiches).flat(), []);

    const handleNicheChange = (niche: string) => {
        setLocalFilters(prev => {
            const newNiches = prev.niches.includes(niche)
                ? prev.niches.filter(n => n !== niche)
                : [...prev.niches, niche];
            return { ...prev, niches: newNiches };
        });
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        setLocalFilters({
            niches: [],
            followerRange: '',
            location: ''
        });
    };
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const isFilterActive = localFilters.location !== '' || localFilters.followerRange !== '' || localFilters.niches.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end sm:items-center z-[100] p-0 sm:p-4 animate-fade-in">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg animate-slide-in-up shadow-2xl flex flex-col relative" style={{maxHeight: '90vh'}}>
                 <header className="flex items-center justify-between p-4 border-b">
                    <div className="w-8"></div>
                    <h2 className="text-lg font-semibold text-gray-800">Explore</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto space-y-6 px-4 pt-5 pb-4">
                    {/* Location Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                        <input
                            type="text"
                            placeholder="e.g., San Francisco, USA"
                            value={localFilters.location}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    
                    {/* Follower Range Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Total Follower Count</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {followerRanges.map(range => (
                                <button
                                    key={range}
                                    onClick={() => setLocalFilters(prev => ({ ...prev, followerRange: prev.followerRange === range ? '' : range }))}
                                    className={`p-3 rounded-lg text-sm font-medium border transition-colors text-center ${localFilters.followerRange === range ? 'bg-purple-600 border-purple-600 text-white shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Niches Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Niche</h3>
                        <div className="flex flex-wrap gap-2">
                            {allNiches.map(niche => (
                                <button
                                    key={niche}
                                    onClick={() => handleNicheChange(niche)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${localFilters.niches.includes(niche) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 gap-x-4 border-t mt-auto">
                    <button 
                        onClick={handleClear} 
                        disabled={!isFilterActive}
                        className="flex-1 py-3 rounded-xl font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Clear filter
                    </button>
                    <button onClick={handleApply} className="flex-1 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};
