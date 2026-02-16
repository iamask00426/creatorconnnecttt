
import React, { useState, useEffect, useMemo } from 'react';
import type { Creator, UserData } from '../../types';
import { fetchAllCreators } from '../../services/firebase';
import { SearchIcon, SparklesIcon, PlusIcon, LocationPinIcon, VideoCameraIcon } from '../icons';
import { MagicMatchModal } from '../modals/MagicMatchModal';
import { ContentIdeaModal } from '../modals/ContentIdeaModal';

interface HomeScreenProps {
    onViewProfile: (creator: Creator) => void;
    currentUser: UserData;
    onUpdateUserData: (data: Partial<UserData>) => void;
}

// Haversine formula to calculate distance between two coordinates in km
const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

const CreatorCard: React.FC<{ creator: Creator; onClick: () => void; index: number; distance?: number }> = ({ creator, onClick, index, distance }) => (
    <div
        onClick={onClick}
        className="cursor-pointer group relative aspect-[4/5] rounded-[2rem] overflow-hidden soft-shadow-md hover:shadow-xl transition-all duration-500 animate-slide-up tap-bounce bg-white"
        style={{ animationDelay: `${index * 50}ms` }}
    >
        <img
            src={creator.photoURL || 'https://picsum.photos/seed/placeholder/400/400'}
            alt={creator.displayName || 'Creator'}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-90"></div>

        <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex justify-between items-end mb-2">
                <div className="inline-flex px-2 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <p className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">{creator.niche || 'General'}</p>
                </div>
            </div>

            <h3 className="text-lg font-black text-white mb-0.5 leading-tight truncate tracking-tight">{creator.displayName || 'Unknown'}</h3>

            <div className="flex items-center text-[10px] text-white/80 font-medium tracking-wide">
                <span className="truncate">{creator.location || 'Unknown Location'}</span>
            </div>
        </div>

        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <PlusIcon className="w-4 h-4 text-white" />
        </div>
    </div>
);

// Fallback images for known cities to make the UI look good without a real image API
const CITY_IMAGES: Record<string, string> = {
    'mumbai': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=300&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80',
    'los angeles': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=300&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?auto=format&fit=crop&w=300&q=80',
    'bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=300&q=80',
    'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=300&q=80'
};

const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80';

export const HomeScreen: React.FC<HomeScreenProps> = ({ onViewProfile, currentUser, onUpdateUserData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLocation, setActiveLocation] = useState('');
    const [creators, setCreators] = useState<Creator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMagicMatchOpen, setIsMagicMatchOpen] = useState(false);
    const [isContentIdeasOpen, setIsContentIdeasOpen] = useState(false);

    // Dynamic Trending Locations
    const [trendingLocs, setTrendingLocs] = useState<{ id: string, name: string, image: string, count: number }[]>([]);

    useEffect(() => {
        const loadCreators = async () => {
            setIsLoading(true);
            try {
                const allCreators = await fetchAllCreators();
                setCreators(allCreators);

                const locationCounts: Record<string, number> = {};

                allCreators.forEach(c => {
                    if (c.location) {
                        // Normalize: Split by comma, trim, lowercase
                        const rawCity = c.location.split(',')[0].trim().toLowerCase();
                        // console.log(`[Trending] Processing: "${c.location}" -> "${rawCity}"`); 
                        if (rawCity) {
                            locationCounts[rawCity] = (locationCounts[rawCity] || 0) + 1;
                        }
                    }
                });

                // console.log("[Trending] Location Counts:", locationCounts);

                // Helper to title case for display
                const toTitleCase = (str: string) => {
                    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                };

                const sortedLocations = Object.entries(locationCounts)
                    .filter(([city]) => CITY_IMAGES.hasOwnProperty(city))
                    .sort(([, countA], [, countB]) => countB - countA)
                    .slice(0, 7)
                    .map(([city, count], index) => ({
                        id: city,
                        name: toTitleCase(city),
                        image: CITY_IMAGES[city],
                        count
                    }));

                setTrendingLocs([
                    { id: 'global', name: 'Global', image: DEFAULT_CITY_IMAGE, count: allCreators.length },
                    ...sortedLocations
                ]);

            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCreators();
    }, []);

    const processedCreators = useMemo(() => {
        let filtered = creators.filter(c => c.uid !== currentUser.uid);

        const query = searchQuery.toLowerCase();
        if (query) {
            filtered = filtered.filter(c => {
                const name = c.displayName || '';
                const niche = c.niche || '';
                return name.toLowerCase().includes(query) || niche.toLowerCase().includes(query);
            });
        }

        if (activeLocation) {
            filtered = filtered.filter(c => {
                const loc = c.location || '';
                return loc.toLowerCase().includes(activeLocation.toLowerCase());
            });
        }

        if (currentUser.lat && currentUser.lng) {
            const withDistance = filtered.map(c => {
                let dist = 99999;
                if (c.lat && c.lng) {
                    dist = getDistanceFromLatLonInKm(currentUser.lat, currentUser.lng, c.lat, c.lng);
                }
                return { ...c, distance: dist };
            });
            return withDistance.sort((a, b) => a.distance - b.distance);
        }

        return filtered.map(c => ({ ...c, distance: undefined }));
    }, [creators, currentUser, searchQuery, activeLocation]);

    const handleOpenMagicMatch = () => {
        if (!creators.length || isLoading) return;
        setIsMagicMatchOpen(true);
    };

    const handleOpenContentIdeas = () => {
        setIsContentIdeasOpen(true);
    };

    return (
        <div className="min-h-full bg-slate-50">
            <header className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-xl px-6 py-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Discover</p>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">For You</h1>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-slate-200 active:scale-90 transition-transform cursor-pointer">
                        <span className="text-slate-900 font-black text-sm">C</span>
                    </div>
                </div>

                <div className="relative group mb-4" data-tour-id="home-search">
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none shadow-soft-sm focus:shadow-soft-md transition-all"
                    />
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
            </header>

            <main className="px-6 py-4 pb-32">
                <div className="mb-8">
                    {/* Fixed alignment: Negative margin to pull to edges, padding to align content */}
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-6 -mx-6">
                        {trendingLocs.map(loc => {
                            const isActive = (loc.name === 'Global' && activeLocation === '') || activeLocation === loc.name;
                            return (
                                <button
                                    key={loc.id}
                                    onClick={() => setActiveLocation(loc.name === 'Global' ? '' : loc.name)}
                                    className={`relative w-32 h-20 flex-shrink-0 rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-300 group shadow-md ${isActive ? 'ring-2 ring-violet-500 ring-offset-2 scale-105' : 'hover:scale-[1.02]'}`}
                                >
                                    <img
                                        src={loc.image}
                                        alt={loc.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-violet-900/40' : 'bg-black/30'}`}></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                        <span className="text-white font-black text-xs uppercase tracking-widest text-center relative z-10">{loc.name}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-5 px-1">
                    <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-wider">
                        {activeLocation ? `In ${activeLocation}` : 'Featured'}
                    </h2>
                    <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{processedCreators.length}</span>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-[2rem] bg-white animate-pulse"></div>)
                    ) : processedCreators.length > 0 ? (
                        processedCreators.map((c, index) => (
                            <CreatorCard
                                key={c.uid}
                                creator={c}
                                index={index}
                                distance={c.distance}
                                onClick={() => onViewProfile(c)}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No creators found here</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Quick Actions Stack */}
            <div className="fixed bottom-28 right-6 z-50 flex flex-col gap-4">
                <button
                    onClick={handleOpenContentIdeas}
                    className="w-14 h-14 rounded-full bg-white text-violet-600 shadow-soft-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                >
                    <VideoCameraIcon className="w-6 h-6" />
                </button>
                <button
                    data-tour-id="magic-match"
                    onClick={handleOpenMagicMatch}
                    disabled={isLoading || !creators.length}
                    className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-soft-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <SparklesIcon className="w-6 h-6 relative z-10" />
                </button>
            </div>

            {isMagicMatchOpen && creators.length > 0 && (
                <MagicMatchModal
                    currentUser={currentUser}
                    onClose={() => setIsMagicMatchOpen(false)}
                    onViewProfile={onViewProfile}
                />
            )}

            {isContentIdeasOpen && (
                <ContentIdeaModal
                    userData={currentUser}
                    onClose={() => setIsContentIdeasOpen(false)}
                    onUpdateUserData={onUpdateUserData}
                />
            )}
        </div>
    );
};
