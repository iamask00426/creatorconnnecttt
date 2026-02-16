
import React, { useState, useEffect } from 'react';
import type { UserData, Creator } from '../../types';
import { CollabRequestModal } from '../modals/CollabRequestModal';
import { ImageModal } from '../modals/ImageModal';
import { InstagramIcon, TiktokIcon, SnapchatIcon, PlusIcon, YoutubeIcon, TwitterIcon, LockClosedIcon, BoltIcon, StarIcon, BookmarkIcon } from '../icons';
import { getCollaborationsStream, db, getRatingsStream, getUser, toggleSaveProfile } from '../../services/firebase';

interface CreatorProfilePageProps {
    currentUser: UserData;
    creator: Creator; // This acts as the initial data
    onBack: () => void;
    onMessage: (creator: Creator) => void;
    onViewProfile: (creator: Creator) => void;
    onUpdateUserData: (data: Partial<UserData>) => void;
}

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center p-2">
        <p className="font-extrabold text-xl text-slate-900">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

const SocialLink: React.FC<{ handle?: string; platform: string; children: React.ReactNode; }> = ({ handle, platform, children }) => {
    if (!handle) return null;
    const urls: { [key: string]: string } = {
        instagram: 'https://instagram.com/',
        youtube: 'https://www.youtube.com/c/',
        tiktok: 'https://tiktok.com/@',
        twitter: 'https://twitter.com/',
        snapchat: 'https://www.snapchat.com/add/',
    };
    return (
        <a href={`${urls[platform]}${handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-white border border-slate-100 rounded-xl text-slate-600 hover:text-white hover:bg-violet-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
            {children}
        </a>
    );
};

export const CreatorProfilePage: React.FC<CreatorProfilePageProps> = ({ currentUser, creator: initialCreatorData, onBack, onMessage, onViewProfile, onUpdateUserData }) => {
    const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [liveCreator, setLiveCreator] = useState<Creator>(initialCreatorData);
    const [ratings, setRatings] = useState<any[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    
    // Subscribe to live updates for the creator profile to show real-time ratings/collabs
    useEffect(() => {
        if (!initialCreatorData.uid) return;
        
        const unsubscribe = db.collection('users').doc(initialCreatorData.uid)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    setLiveCreator({ ...doc.data(), uid: doc.id } as Creator);
                }
            });
            
        return () => unsubscribe();
    }, [initialCreatorData.uid]);

    useEffect(() => {
        if (currentUser.savedProfiles?.includes(liveCreator.uid)) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [currentUser.savedProfiles, liveCreator.uid]);

    // Check collaboration status to gate features
    useEffect(() => {
        if (!currentUser?.uid || !liveCreator?.uid) return;
        
        const unsubscribe = getCollaborationsStream(currentUser.uid, (collabs) => {
            const hasConnection = collabs.some(c => 
                c.participantIds.includes(liveCreator.uid) && 
                (c.status === 'active' || c.status === 'completed')
            );
            setIsConnected(hasConnection);
        });
        
        return () => unsubscribe();
    }, [currentUser.uid, liveCreator.uid]);

    // Fetch Ratings
    useEffect(() => {
        if (!liveCreator?.uid) return;
        const unsubscribe = getRatingsStream(liveCreator.uid, (data) => {
            setRatings(data);
        });
        return () => unsubscribe();
    }, [liveCreator.uid]);

    const handleReviewerClick = async (raterId: string) => {
        if (!raterId) return;
        // Don't navigate if clicking self
        if (raterId === currentUser.uid) return;

        try {
            const user = await getUser(raterId);
            if (user) {
                onViewProfile(user);
            }
        } catch (error) {
            console.error("Failed to load reviewer profile", error);
        }
    };

    const handleToggleSave = async () => {
        const nextSavedState = !isSaved;
        setIsSaved(nextSavedState); // Optimistic Update

        try {
            await toggleSaveProfile(currentUser.uid, liveCreator.uid, isSaved);
            
            // Update Global State immediately so Saved view updates
            if (onUpdateUserData) {
                const currentSaved = currentUser.savedProfiles || [];
                let newSavedProfiles;
                if (nextSavedState) {
                    newSavedProfiles = [...currentSaved, liveCreator.uid];
                } else {
                    newSavedProfiles = currentSaved.filter(id => id !== liveCreator.uid);
                }
                // Unique check
                newSavedProfiles = [...new Set(newSavedProfiles)];
                onUpdateUserData({ savedProfiles: newSavedProfiles });
            }
        } catch (e) {
            console.error("Failed to toggle save", e);
            setIsSaved(isSaved); // Revert
        }
    };

    const socialPlatforms = [
        { name: 'instagram', icon: <InstagramIcon />, handle: liveCreator.instagram },
        { name: 'youtube', icon: <YoutubeIcon />, handle: liveCreator.youtube },
        { name: 'tiktok', icon: <TiktokIcon />, handle: liveCreator.tiktok },
        { name: 'twitter', icon: <TwitterIcon />, handle: liveCreator.twitter },
        { name: 'snapchat', icon: <SnapchatIcon />, handle: liveCreator.snapchat },
    ];
    
    const isSelf = currentUser.uid === liveCreator.uid;

    return (
        <div className="animate-fade-in bg-slate-50 min-h-full pb-20">
             {expandedImage && (
                <ImageModal imageUrl={expandedImage} onClose={() => setExpandedImage(null)} />
            )}

             <header className="relative h-72 w-full">
                <img 
                    src={liveCreator.portfolio?.[0] || `https://picsum.photos/seed/${liveCreator.uid}/800/200`} 
                    className="w-full h-full object-cover mask-gradient-b cursor-pointer" 
                    alt="Cover" 
                    onClick={() => setExpandedImage(liveCreator.portfolio?.[0] || `https://picsum.photos/seed/${liveCreator.uid}/800/200`)}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>
                
                <button onClick={onBack} className="absolute top-4 left-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors shadow-lg border border-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>

                {!isSelf && (
                    <button 
                        onClick={handleToggleSave} 
                        className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-full transition-all shadow-lg border ${isSaved ? 'bg-violet-600 text-white border-violet-500' : 'bg-white/20 text-white hover:bg-white/30 border-white/20'}`}
                    >
                        <BookmarkIcon filled={isSaved} />
                    </button>
                )}
            </header>
            
            <div className="relative px-5 -mt-20">
                {/* Profile Card Info */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-soft-lg border border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                        <div className="relative -mt-12">
                            <img 
                                src={liveCreator.photoURL} 
                                className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover cursor-pointer hover:scale-105 transition-transform" 
                                alt={liveCreator.displayName} 
                                onClick={() => setExpandedImage(liveCreator.photoURL)}
                            />
                            {liveCreator.openToCollab && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
                                    OPEN
                                </div>
                            )}
                        </div>
                        {!isSelf && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => isConnected ? onMessage(liveCreator) : alert("Message locked: You must have an accepted collaboration request to chat with this creator (Anti-spam).")} 
                                    className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100'}`}
                                >
                                    {isConnected ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    ) : (
                                        <LockClosedIcon className="h-5 w-5" />
                                    )}
                                </button>
                                
                                {!isConnected && (
                                    <button 
                                        onClick={() => setIsCollabModalOpen(true)} 
                                        disabled={!liveCreator.openToCollab}
                                        className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-glow hover:scale-105 transition-all shadow-lg ${!liveCreator.openToCollab ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
                                    >
                                        Connect
                                    </button>
                                )}

                                {isConnected && (
                                    <div className="px-6 py-2.5 text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-xl flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        Connected
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            {liveCreator.displayName}
                            {liveCreator.instagramVerified && <BoltIcon className="w-5 h-5 text-blue-500" />}
                        </h1>
                        <p className="text-sm font-bold text-violet-600 mb-1">{liveCreator.niche}</p>
                        <div className="flex items-center text-xs text-slate-500 font-medium">
                             <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {liveCreator.location}
                        </div>
                    </div>
                    
                    <p className="mt-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                        {liveCreator.bio}
                    </p>

                    <div className="mt-6 grid grid-cols-3 divide-x divide-slate-100 border rounded-2xl border-slate-100 bg-slate-50/50">
                        <Stat label="Followers" value={new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(liveCreator.followerCount)} />
                        <Stat label="Collabs" value={liveCreator.collabs} />
                        <Stat label="Rating" value={(liveCreator.ratingCount || 0) > 0 ? `${liveCreator.rating.toFixed(1)}` : '-'} />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                 <div className="flex items-center gap-4 overflow-x-auto pb-4 px-6 hide-scrollbar">
                    {socialPlatforms.map(p => (
                        p.handle ? (
                            <div key={p.name} className="flex-shrink-0">
                                 <SocialLink handle={p.handle} platform={p.name}>{p.icon}</SocialLink>
                            </div>
                        ) : null
                    ))}
                </div>
            </div>
            
            <div className="px-5 mt-2 space-y-8">
                {/* Portfolio Section */}
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        Portfolio
                        <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{liveCreator.portfolio?.length || 0} items</span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {(liveCreator.portfolio || []).map((url, index) => (
                            <div key={index} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpandedImage(url)}>
                                <img src={url} alt={`Portfolio item ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Past Collaborations Section */}
                {liveCreator.pastCollaborations && liveCreator.pastCollaborations.length > 0 && (
                    <div>
                         <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            Past Collaborations
                            <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{liveCreator.pastCollaborations.length}</span>
                        </h2>
                        <div className="space-y-4">
                            {liveCreator.pastCollaborations.map((collab) => (
                                <div key={collab.id} className="bg-white rounded-2xl p-3 shadow-soft-sm border border-slate-100 flex gap-4">
                                     <div className="flex -space-x-4 cursor-pointer flex-shrink-0 self-center" onClick={() => setExpandedImage(collab.imageUrl)}>
                                         <img 
                                            src={liveCreator.photoURL} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm z-0" 
                                            alt="Creator" 
                                        />
                                        <img 
                                            src={collab.imageUrl || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm z-10" 
                                            alt="Partner" 
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center flex-grow">
                                        <h3 className="font-bold text-slate-900 text-sm">{collab.title}</h3>
                                        <p className="text-xs text-violet-600 font-medium mb-1">with {collab.partnerName}</p>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{collab.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{collab.date}</p>
                                            {collab.link && (
                                                <a 
                                                    href={collab.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-md shadow-slate-900/10"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Watch Video
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Reviews / Ratings Section */}
                <div className="pb-10">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        Reviews
                        <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{ratings.length}</span>
                    </h2>
                    
                    {ratings.length > 0 ? (
                        <div className="space-y-4">
                            {ratings.map((rating) => (
                                <div key={rating.id} className="bg-white rounded-2xl p-4 shadow-soft-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div 
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => handleReviewerClick(rating.raterId)}
                                        >
                                            <img 
                                                src={rating.raterPhoto || 'https://picsum.photos/seed/unknown/100/100'} 
                                                className="w-8 h-8 rounded-full object-cover border border-slate-100 group-hover:border-violet-300 transition-colors" 
                                                alt={rating.raterName} 
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 group-hover:text-violet-600 transition-colors underline decoration-transparent group-hover:decoration-violet-600">{rating.raterName}</p>
                                                <p className="text-[9px] text-slate-400">{rating.timestamp ? rating.timestamp.toLocaleDateString() : 'Recent'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                                            <StarIcon className="w-3 h-3 text-amber-500 mr-1" fill="#F59E0B" />
                                            <span className="text-xs font-bold text-amber-700">{rating.ratingValue}</span>
                                        </div>
                                    </div>
                                    {rating.comment && (
                                        <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-3">"{rating.comment}"</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 font-medium">No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {isCollabModalOpen && <CollabRequestModal sender={currentUser} receiver={liveCreator} onClose={() => setIsCollabModalOpen(false)} />}
        </div>
    );
};
