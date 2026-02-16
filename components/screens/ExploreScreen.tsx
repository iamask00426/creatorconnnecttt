
import React, { useState, useMemo, useEffect } from 'react';
import type { Creator, ExploreFilters, UserData } from '../../types';
import { fetchAllCreators } from '../../services/firebase';
import { MapView } from './MapView';
import { FilterModal } from '../modals/FilterModal';
import { SearchIcon, FilterIcon } from '../icons';
import { CreatorListSkeleton } from '../loaders/CreatorListSkeleton';

interface ExploreScreenProps {
    onViewProfile: (creator: Creator) => void;
    forceMapView?: boolean;
    onMapViewEnd?: () => void;
    currentUser: UserData;
}

const CreatorListCard: React.FC<{ creator: Creator; onClick: () => void; style: React.CSSProperties }> = ({ creator, onClick, style }) => (
    <div 
        onClick={onClick}
        style={style}
        className="flex items-center space-x-5 p-4 bg-white rounded-[2rem] soft-shadow-sm hover:soft-shadow-md cursor-pointer transition-all animate-fade-in-up active:scale-[0.98]"
    >
        <img src={creator.photoURL || 'https://picsum.photos/seed/placeholder/100/100'} className="w-16 h-16 rounded-2xl object-cover bg-slate-100" alt={creator.displayName || 'Creator'} />
        <div className="flex-grow">
            <h3 className="font-bold text-slate-900 text-base">{creator.displayName || 'Unknown Creator'}</h3>
            <p className="text-xs text-violet-600 font-bold uppercase tracking-wider mt-0.5">{creator.niche || 'General'}</p>
            <p className="text-xs text-slate-400 mt-1">{creator.location || 'Unknown Location'}</p>
        </div>
        {creator.openToCollab && (
            <div className="self-center text-[8px] font-black text-white bg-green-500 px-2 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-green-200">
                OPEN
            </div>
        )}
    </div>
);

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onViewProfile, forceMapView, onMapViewEnd, currentUser }) => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<ExploreFilters>({ niches: [], followerRange: '', location: '' });
    const [creators, setCreators] = useState<Creator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (forceMapView) {
            setViewMode('map');
            onMapViewEnd?.();
        }
    }, [forceMapView, onMapViewEnd]);

    useEffect(() => {
        const loadCreators = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const allCreators = await fetchAllCreators();
                setCreators(allCreators);
            } catch (err) {
                console.error("Failed to load creators:", err);
                setError("Could not load creators. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };
        loadCreators();
    }, []);

    const filteredCreators = useMemo(() => {
        let filtered = creators.filter(c => c.uid !== currentUser.uid);

        filtered = filtered.filter(c => {
            const niche = c.niche || '';
            const location = c.location || '';
            const followers = c.followerCount || 0;

            const nicheMatch = filters.niches.length === 0 || filters.niches.includes(niche);
            const locationMatch = filters.location.trim() === '' || location.toLowerCase().includes(filters.location.toLowerCase());

            const followerMatch = !filters.followerRange || (
                (filters.followerRange === '<10k' && followers < 10000) ||
                (filters.followerRange === '10k-100k' && followers >= 10000 && followers <= 100000) ||
                (filters.followerRange === '100k-1M' && followers > 100000 && followers <= 1000000) ||
                (filters.followerRange === '>1M' && followers > 1000000)
            );

            return nicheMatch && locationMatch && followerMatch;
        });
        
        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(c => {
                const name = c.displayName || '';
                const niche = c.niche || '';
                const loc = c.location || '';
                const query = searchQuery.toLowerCase();
                return name.toLowerCase().includes(query) || niche.toLowerCase().includes(query) || loc.toLowerCase().includes(query);
            });
        }
        
        return filtered;
    }, [filters, searchQuery, creators, currentUser.uid]);

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            <header className="flex-shrink-0 px-6 py-6 pb-2 space-y-4 bg-slate-50/90 backdrop-blur-xl z-20">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Explore</h1>
                    <div className="flex bg-white rounded-full p-1 shadow-sm" data-tour-id="view-toggle">
                        <button 
                            onClick={() => setViewMode('list')} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                        >
                            List
                        </button>
                        <button 
                            onClick={() => setViewMode('map')} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                        >
                            Map
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative flex-grow group">
                        <input
                            type="text"
                            placeholder="Search creators..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-sm font-bold text-slate-900 focus:outline-none shadow-soft-sm focus:shadow-soft-md transition-all"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                            <SearchIcon className="w-4 h-4" />
                        </div>
                    </div>
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="p-3 bg-white rounded-full hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-soft-sm"
                    >
                        <FilterIcon className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="flex-grow relative overflow-hidden">
                {viewMode === 'list' ? (
                     <div className="h-full overflow-y-auto p-6 space-y-4 pb-32">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <CreatorListSkeleton key={i} />)
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-red-500 text-sm font-medium">{error}</p>
                            </div>
                        ) : filteredCreators.length > 0 ? (
                            filteredCreators.map((c, index) => (
                                <CreatorListCard 
                                    key={c.uid} 
                                    creator={c} 
                                    onClick={() => onViewProfile(c)}
                                    style={{ animationDelay: `${index * 50}ms`}} 
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-center bg-white rounded-[2rem] border border-dashed border-slate-200 p-8 mx-2">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No results found</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="absolute inset-0 pb-24">
                        {isLoading ? (
                             <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                 <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                             </div>
                        ) : (
                            <MapView creators={filteredCreators} onViewProfile={onViewProfile} />
                        )}
                    </div>
                )}
            </main>

            {isFilterModalOpen && (
                <FilterModal
                    onClose={() => setIsFilterModalOpen(false)}
                    onApply={setFilters}
                    initialFilters={filters}
                />
            )}
        </div>
    );
};
