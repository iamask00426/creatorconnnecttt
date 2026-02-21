import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { UserData, PastCollaboration, Creator } from '../../types';
import { creatorNiches } from '../../constants';
import { SettingsScreen } from './SettingsScreen';
import { AccountSettingsScreen } from './AccountSettingsScreen';
import { InstagramOriginalIcon, TiktokIcon, SnapchatIcon, PlusIcon, LocationPinIcon, CameraIcon, YoutubeIcon, TwitterIcon, MyLocationIcon, BoltIcon, StarIcon, PhoneIcon, BookmarkIcon, CalendarIcon } from '../icons';
import { uploadProfileImage, getRatingsStream, getUser, checkUsernameAvailability } from '../../services/firebase';
import { VerificationModal } from '../modals/VerificationModal';
import { PhoneVerificationModal } from '../modals/PhoneVerificationModal';
import { ImageCropperModal } from '../modals/ImageCropperModal';
import { ImageModal } from '../modals/ImageModal';
import { SavedProfilesView } from './SavedProfilesView';
import { CalendarScreen } from './CalendarScreen';

interface ProfileScreenProps {
    userData: UserData;
    onUpdateUserData: (data: Partial<UserData>) => void;
    forceEdit?: boolean;
    onEditFlowEnd?: () => void;
    onLogout: () => void;
    onViewProfile: (creator: Creator) => void; // Added for navigation
}

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center py-1.5">
        <p className="font-black text-lg text-slate-900 tracking-tight">{value}</p>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userData, onUpdateUserData, forceEdit, onEditFlowEnd, onLogout, onViewProfile }) => {
    const [currentView, setCurrentView] = useState<'profile' | 'settings' | 'edit' | 'accountSettings' | 'personalDetails' | 'saved' | 'calendar'>('profile');
    const [editedData, setEditedData] = useState<UserData>(userData);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isPhoneVerificationModalOpen, setIsPhoneVerificationModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [myRatings, setMyRatings] = useState<any[]>([]);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Cropping State
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>('');
    const [cropType, setCropType] = useState<'profile' | 'cover'>('profile');

    // Full Screen Image State
    // Removed duplicate declaration

    // Username Availability State
    const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'checking' | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);

    const checkUsername = useCallback(async (username: string) => {
        if (!username || username === userData.username) {
            setUsernameStatus(null);
            return;
        }
        if (username.length < 3) {
            setUsernameError("Too short");
            setUsernameStatus('taken');
            return;
        }
        if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
            setUsernameError("Invalid chars");
            setUsernameStatus('taken');
            return;
        }

        setUsernameStatus('checking');
        setUsernameError(null);
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameStatus(isAvailable ? 'available' : 'taken');
        if (!isAvailable) setUsernameError("Username taken");
    }, [userData.username]);

    // Debounce username check
    useEffect(() => {
        if (currentView !== 'edit') return;
        const timer = setTimeout(() => {
            if (editedData.username && editedData.username !== userData.username) {
                checkUsername(editedData.username);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [editedData.username, checkUsername, currentView, userData.username]);

    useEffect(() => {
        if (currentView === 'edit') {
            setEditedData(userData);
        }
    }, [currentView, userData]);

    useEffect(() => {
        if (forceEdit) setCurrentView('edit');
    }, [forceEdit]);

    // Fetch Ratings for My Profile
    useEffect(() => {
        const unsubscribe = getRatingsStream(userData.uid, (data) => {
            setMyRatings(data);
        });
        return () => unsubscribe();
    }, [userData.uid]);

    const handleReviewerClick = async (raterId: string) => {
        if (!raterId) return;
        try {
            const user = await getUser(raterId);
            if (user) {
                onViewProfile(user);
            }
        } catch (error) {
            console.error("Failed to load reviewer profile", error);
        }
    };

    const handleSave = () => {
        // Only send editable fields to prevent overwriting server-managed counters (collabs, rating)
        const editableFields: Partial<UserData> = {
            displayName: editedData.displayName,
            username: editedData.username, // Save username
            gender: editedData.gender,
            niche: editedData.niche,
            bio: editedData.bio,
            followerCount: editedData.followerCount,
            location: editedData.location,
            lat: editedData.lat,
            lng: editedData.lng,
            city: editedData.city,
            country: editedData.country,
            instagram: editedData.instagram,
            youtube: editedData.youtube,
            tiktok: editedData.tiktok,
            twitter: editedData.twitter,
            snapchat: editedData.snapchat,
            portfolio: editedData.portfolio,
            pastCollaborations: editedData.pastCollaborations,
            photoURL: editedData.photoURL,
            phoneNumber: editedData.phoneNumber,
            phoneNumberVerified: editedData.phoneNumberVerified,
        };

        // Security Check: If Instagram handle changed, revoke verification status
        if (editedData.instagram !== userData.instagram) {
            if (!editedData.instagramVerified) {
                editableFields.instagramVerified = false;
            }
        }

        // Ensure verified status persists if set
        if (editedData.instagramVerified) {
            editableFields.instagramVerified = true;
        }

        onUpdateUserData(editableFields);
        setCurrentView('profile');
        onEditFlowEnd?.();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setTempImageSrc(reader.result?.toString() || '');
                setCropType(type);
                setIsCropperOpen(true);
            });
            reader.readAsDataURL(file);
            // Clear input so same file can be selected again
            e.target.value = '';
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        if (cropType === 'profile') {
            setEditedData(prev => ({ ...prev, photoURL: croppedImage }));
        } else {
            // Ensure portfolio array exists and replace first item or add it
            const newPortfolio = [...(editedData.portfolio || [])];
            if (newPortfolio.length > 0) {
                newPortfolio[0] = croppedImage;
            } else {
                newPortfolio.push(croppedImage);
            }
            setEditedData(prev => ({ ...prev, portfolio: newPortfolio }));
        }
        setIsCropperOpen(false);
    };

    const detectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                setEditedData(prev => ({ ...prev, lat: latitude, lng: longitude }));
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const country = data.address.country || '';
                    setEditedData(prev => ({
                        ...prev,
                        city,
                        country,
                        location: `${city}${city && country ? ', ' : ''}${country}`
                    }));
                } catch (e) { console.error("Geocoding failed", e); }
            });
        }
    };

    // Updated to accept the verified username
    const handleVerificationSuccess = (verifiedUsername: string) => {
        // Update local edit state immediately so the input field reflects the name
        setEditedData(prev => ({
            ...prev,
            instagram: verifiedUsername,
            instagramVerified: true
        }));

        // Also update backend immediately
        onUpdateUserData({
            instagram: verifiedUsername,
            instagramVerified: true
        });
    };

    const handlePhoneVerifySuccess = (phoneNumber: string) => {
        setEditedData(prev => ({
            ...prev,
            phoneNumber: phoneNumber,
            phoneNumberVerified: true
        }));
    };

    const handleAddCollab = () => {
        const newCollab: PastCollaboration = {
            id: Date.now().toString(),
            title: '',
            partnerName: '',
            description: '',
            // Use a neutral avatar placeholder instead of random scenery to prevent "AI generated" look
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        setEditedData(prev => ({
            ...prev,
            pastCollaborations: [newCollab, ...(prev.pastCollaborations || [])]
        }));
    };

    const handleRemoveCollab = (id: string) => {
        setEditedData(prev => ({
            ...prev,
            pastCollaborations: prev.pastCollaborations?.filter(c => c.id !== id)
        }));
    };

    if (currentView === 'settings') return <SettingsScreen onNavigate={setCurrentView} currentUser={userData} onLogout={onLogout} />;
    if (currentView === 'accountSettings') return <AccountSettingsScreen onNavigate={setCurrentView} currentUser={userData} />;
    if (currentView === 'saved') return <SavedProfilesView savedIds={userData.savedProfiles || []} onViewProfile={onViewProfile} onBack={() => setCurrentView('profile')} />;
    if (currentView === 'calendar') return <CalendarScreen userData={userData} onUpdateUserData={onUpdateUserData} onBack={() => setCurrentView('profile')} />;

    if (currentView === 'edit') {
        return (
            <div className="flex flex-col h-full bg-slate-50 animate-slide-up">
                {isCropperOpen && (
                    <ImageCropperModal
                        imageSrc={tempImageSrc}
                        aspectRatio={cropType === 'profile' ? 1 : 2.5}
                        cropShape={cropType === 'profile' ? 'round' : 'rect'}
                        onCropComplete={handleCropComplete}
                        onClose={() => setIsCropperOpen(false)}
                    />
                )}

                <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-5 py-4 flex justify-between items-center">
                    <button onClick={() => { setCurrentView('profile'); onEditFlowEnd?.(); }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">Cancel</button>
                    <h1 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Edit Profile</h1>
                    <button onClick={handleSave} className="text-[10px] font-black text-violet-600 uppercase tracking-widest px-2 py-1 bg-violet-50 rounded-lg">Save</button>
                </header>

                <div className="flex-grow overflow-y-auto hide-scrollbar p-5 space-y-6 pb-32">
                    {/* Cover Photo Edit Area */}
                    <div className="relative w-full h-40 rounded-3xl overflow-hidden group">
                        <img
                            src={editedData.portfolio?.[0] || 'https://picsum.photos/seed/bg/800/400'}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            alt="Cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <label className="cursor-pointer flex flex-col items-center gap-2 text-white hover:scale-105 transition-transform">
                                <div className="p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                    <CameraIcon className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest">Change Cover</span>
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'cover')} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col items-center -mt-16 relative z-10">
                        <div className="relative group">
                            <img src={editedData.photoURL} referrerPolicy="no-referrer" className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white shadow-2xl bg-white" alt="Profile" />
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-slate-800 transition-colors z-20">
                                <CameraIcon className="w-5 h-5" />
                                <input type="file" className="hidden" onChange={(e) => handleFileSelect(e, 'profile')} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                            <input type="text" value={editedData.displayName} onChange={e => setEditedData({ ...editedData, displayName: e.target.value })} className="w-full text-md font-bold text-slate-900 outline-none bg-transparent" placeholder="Your name" />
                        </div>

                        {/* Unique Link Section */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Unique Link Loop</label>
                            <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-violet-500 transition-colors">
                                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">creatorconnect.io/</span>
                                <input
                                    type="text"
                                    value={editedData.username || ''}
                                    onChange={e => {
                                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''); // Enforce safe chars
                                        setEditedData({ ...editedData, username: val });
                                    }}
                                    className="w-full text-sm font-black text-slate-900 outline-none bg-transparent placeholder-slate-300"
                                    placeholder="username"
                                />
                                {usernameStatus === 'checking' && <div className="animate-spin w-3 h-3 border-2 border-slate-200 border-t-violet-600 rounded-full"></div>}
                                {usernameStatus === 'available' && <div className="text-green-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                                {usernameStatus === 'taken' && <div className="text-red-500 text-[9px] font-black uppercase whitespace-nowrap">{usernameError || 'Taken'}</div>}
                            </div>
                            <p className="text-[8px] text-slate-400 mt-1.5 font-medium ml-1">
                                Share this link to direct brands straight to your profile.
                            </p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Gender</label>
                            <div className="relative">
                                <select
                                    value={editedData.gender || ''}
                                    onChange={e => setEditedData({ ...editedData, gender: e.target.value as UserData['gender'] })}
                                    className="w-full text-md font-bold text-slate-900 outline-none bg-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <PhoneIcon className="w-5 h-5 text-slate-400" />
                            <div className="flex-grow">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                                <div className="flex justify-between items-center">
                                    <input
                                        type="tel"
                                        value={editedData.phoneNumber || ''}
                                        onChange={e => setEditedData({ ...editedData, phoneNumber: e.target.value, phoneNumberVerified: false })}
                                        className="w-full text-sm font-bold text-slate-900 outline-none bg-transparent"
                                        placeholder="+1 234 567 8900"
                                    />
                                    {editedData.phoneNumberVerified ? (
                                        <div className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                            <span>Verified</span>
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsPhoneVerificationModalOpen(true)}
                                            className="text-[9px] font-black text-white bg-slate-900 px-3 py-1.5 rounded-lg shadow-md hover:bg-slate-800 transition-colors uppercase tracking-wide"
                                        >
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Creative Niche</label>
                            <div className="relative">
                                <select
                                    value={editedData.niche}
                                    onChange={e => setEditedData({ ...editedData, niche: e.target.value })}
                                    className="w-full text-md font-bold text-slate-900 outline-none bg-transparent appearance-none cursor-pointer"
                                >
                                    <option value="">Select a Niche</option>
                                    {Object.keys(creatorNiches).map(category => (
                                        <optgroup key={category} label={category}>
                                            {creatorNiches[category].map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        {/* Follower Count Edit Section */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Total Followers</label>
                            <input
                                type="number"
                                value={editedData.followerCount || ''}
                                onChange={e => setEditedData({ ...editedData, followerCount: e.target.value ? parseInt(e.target.value) : 0 })}
                                className="w-full text-md font-bold text-slate-900 outline-none bg-transparent"
                                placeholder="0"
                            />
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Bio</label>
                            <textarea rows={3} value={editedData.bio} onChange={e => setEditedData({ ...editedData, bio: e.target.value })} className="w-full text-xs font-medium text-slate-600 outline-none resize-none bg-transparent leading-relaxed" placeholder="Tell the world about yourself..." />
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                                <button onClick={detectLocation} className="text-[8px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1 hover:bg-violet-50 px-2 py-1 rounded-md transition-colors">
                                    <MyLocationIcon className="w-2.5 h-2.5" /> Detect
                                </button>
                            </div>
                            <input type="text" value={editedData.location} onChange={e => setEditedData({ ...editedData, location: e.target.value })} className="w-full text-xs font-bold text-slate-900 outline-none bg-transparent" placeholder="City, Country" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">Social Handles</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'instagram', icon: InstagramOriginalIcon, label: 'Instagram', color: '' },
                                { id: 'youtube', icon: YoutubeIcon, label: 'YouTube', color: 'text-red-500' },
                                { id: 'tiktok', icon: TiktokIcon, label: 'TikTok', color: 'text-slate-900' },
                                { id: 'twitter', icon: TwitterIcon, label: 'Twitter / X', color: 'text-blue-400' },
                                { id: 'snapchat', icon: SnapchatIcon, label: 'Snapchat', color: 'text-yellow-400' }
                            ].map(social => (
                                <div key={social.id} className="flex flex-col p-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus-within:ring-2 focus-within:ring-violet-500/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <social.icon className={`w-5 h-5 ${social.color}`} />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{social.label}</label>
                                                {social.id === 'instagram' && editedData.instagramVerified && (
                                                    <span className="text-[8px] font-bold text-blue-500 flex items-center gap-1">Verified</span>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={(editedData as any)[social.id] || ''}
                                                onChange={e => setEditedData({ ...editedData, [social.id]: e.target.value })}
                                                className="w-full text-xs font-bold text-slate-900 outline-none bg-transparent"
                                                placeholder={`@${social.id}handle`}
                                            />
                                        </div>
                                    </div>

                                    {social.id === 'instagram' && !editedData.instagramVerified && (
                                        <div className="mt-3 border-t border-slate-50 pt-2 flex justify-end">
                                            <button
                                                onClick={() => setIsVerificationModalOpen(true)}
                                                className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <BoltIcon className="w-3 h-3 text-amber-400" />
                                                Verify Account
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Success Story Gallery</h3>
                            <button onClick={handleAddCollab} className="p-2 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20 active:scale-90 transition-all">
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {editedData.pastCollaborations?.map((collab, idx) => (
                                <div key={collab.id} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm relative group animate-fade-in-up">
                                    <button
                                        onClick={() => handleRemoveCollab(collab.id)}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform z-10"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Project Title</label>
                                            <input
                                                type="text"
                                                value={collab.title}
                                                onChange={e => {
                                                    const newCollabs = [...(editedData.pastCollaborations || [])];
                                                    newCollabs[idx].title = e.target.value;
                                                    setEditedData({ ...editedData, pastCollaborations: newCollabs });
                                                }}
                                                className="w-full text-sm font-black text-slate-900 outline-none border-b border-slate-50 pb-1.5 bg-transparent focus:border-violet-200 transition-colors"
                                                placeholder="e.g. Urban Streetwear Lookbook"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Partner</label>
                                            <input
                                                type="text"
                                                value={collab.partnerName}
                                                onChange={e => {
                                                    const newCollabs = [...(editedData.pastCollaborations || [])];
                                                    newCollabs[idx].partnerName = e.target.value;
                                                    setEditedData({ ...editedData, pastCollaborations: newCollabs });
                                                }}
                                                className="w-full text-[11px] font-bold text-violet-600 outline-none border-b border-slate-50 pb-1.5 bg-transparent focus:border-violet-200 transition-colors"
                                                placeholder="Brand or Creator Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Campaign Details</label>
                                            <textarea
                                                rows={2}
                                                value={collab.description}
                                                onChange={e => {
                                                    const newCollabs = [...(editedData.pastCollaborations || [])];
                                                    newCollabs[idx].description = e.target.value;
                                                    setEditedData({ ...editedData, pastCollaborations: newCollabs });
                                                }}
                                                className="w-full text-[11px] text-slate-600 outline-none resize-none bg-slate-50 p-3 rounded-2xl leading-relaxed"
                                                placeholder="Describe the collaboration outcome..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div >
                {/* Modals */}
                < VerificationModal
                    isOpen={isVerificationModalOpen}
                    onClose={() => setIsVerificationModalOpen(false)}
                    onVerifySuccess={handleVerificationSuccess}
                    initialUsername={editedData.instagram}
                />
                <PhoneVerificationModal
                    isOpen={isPhoneVerificationModalOpen}
                    onClose={() => setIsPhoneVerificationModalOpen(false)}
                    onVerifySuccess={handlePhoneVerifySuccess}
                    initialPhoneNumber={editedData.phoneNumber}
                />
            </div >
        );
    }

    return (
        <div className="animate-slide-up bg-slate-50 min-h-full pb-32">
            {expandedImage && (
                <ImageModal
                    imageUrl={expandedImage}
                    onClose={() => setExpandedImage(null)}
                    creator={expandedImage === userData.photoURL ? userData as Creator : undefined}
                />
            )}

            <header className="relative h-56 overflow-hidden">
                <img
                    src={userData.portfolio?.[0] || 'https://picsum.photos/seed/bg/800/400'}
                    className="w-full h-full object-cover mask-gradient-b cursor-pointer"
                    referrerPolicy="no-referrer"
                    alt="Cover"
                    onClick={() => setExpandedImage(userData.portfolio?.[0] || 'https://picsum.photos/seed/bg/800/400')}
                />
                <div className="absolute top-6 right-6 z-10 flex gap-2">
                    {/* NEW Calendar Button */}
                    <button onClick={() => setCurrentView('calendar')} className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white flex items-center justify-center shadow-xl hover:bg-white/40 transition-all">
                        <CalendarIcon className="w-5 h-5" />
                    </button>

                    <button onClick={() => setCurrentView('saved')} className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white flex items-center justify-center shadow-xl hover:bg-white/40 transition-all">
                        <BookmarkIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentView('settings')} className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white flex items-center justify-center shadow-xl hover:bg-white/40 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="px-5 relative -mt-16 z-20">
                <div className="bg-white rounded-[2.5rem] p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                        <div className="relative z-10">
                            <img
                                src={userData.photoURL}
                                className="relative w-28 h-28 rounded-[2rem] border-[4px] border-white shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform bg-white"
                                referrerPolicy="no-referrer"
                                alt="Me"
                                onClick={() => setExpandedImage(userData.photoURL)}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <button onClick={() => setCurrentView('edit')} className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all">Edit Profile</button>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-0.5 tracking-tight flex items-center gap-2">
                        {userData.displayName}
                        {/* Blue tick removed */}
                    </h1>
                    <p className="text-xs font-black text-violet-600 mb-3 uppercase tracking-wider">{userData.niche}</p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">{userData.bio}</p>

                    {/* Prominent Verification Button on Main Profile View */}
                    {!userData.instagramVerified && (
                        <button
                            onClick={() => setIsVerificationModalOpen(true)}
                            className="w-full mb-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <BoltIcon className="w-4 h-4 text-yellow-300" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verify Identity</span>
                        </button>
                    )}

                    <div className="grid grid-cols-3 bg-slate-50/80 backdrop-blur-sm rounded-[1.75rem] border border-slate-100 p-2 shadow-inner">
                        <Stat label="Total Followers" value={new Intl.NumberFormat('en-US', { notation: 'compact' }).format(userData.followerCount)} />
                        <Stat label="Collabs" value={userData.collabs} />
                        <Stat label="Rating" value={userData.ratingCount > 0 ? userData.rating.toFixed(1) : '-'} />
                    </div>

                </div>

                <div className="mt-10 space-y-10">
                    {/* Rate Card View Section Removed */}

                    <div>
                        <div className="flex justify-between items-center mb-5 px-1">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Portfolio</h2>
                            <button className="text-[9px] font-black text-violet-600 uppercase tracking-widest px-3 py-1 bg-violet-50 rounded-lg">View All</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {userData.portfolio.slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square rounded-[1.75rem] overflow-hidden bg-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setExpandedImage(img)}>
                                    <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {userData.pastCollaborations && userData.pastCollaborations.length > 0 && (
                        <div className="pb-1">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-5 px-1">Past Experience</h2>
                            <div className="space-y-4">
                                {userData.pastCollaborations.map(collab => (
                                    <div key={collab.id} className="bg-white p-4 rounded-[1.75rem] border border-slate-100 flex gap-5 shadow-sm hover:shadow-md transition-all group cursor-default">
                                        <div className="flex -space-x-4 cursor-pointer flex-shrink-0 self-center">
                                            <img
                                                src={userData.photoURL}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm z-0"
                                                alt="Me"
                                                referrerPolicy="no-referrer"
                                                onClick={(e) => { e.stopPropagation(); setExpandedImage(userData.photoURL); }}
                                            />
                                            <img
                                                src={collab.imageUrl || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm z-10"
                                                alt="Partner"
                                                referrerPolicy="no-referrer"
                                                onClick={(e) => { e.stopPropagation(); setExpandedImage(collab.imageUrl); }}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center overflow-hidden">
                                            <h3 className="font-bold text-slate-900 text-sm truncate tracking-tight">{collab.title}</h3>
                                            <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-violet-600"></span>
                                                w/ {collab.partnerName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews / Ratings Section */}
                    <div className="pb-20">
                        <div className="flex items-center justify-between mb-5 px-1">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Reviews</h2>
                            <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{myRatings.length}</span>
                        </div>

                        {myRatings.length > 0 ? (
                            <div className="space-y-4">
                                {myRatings.map((rating) => (
                                    <div key={rating.id} className="bg-white rounded-[1.75rem] p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <div
                                                className="flex items-center gap-2 cursor-pointer group"
                                                onClick={() => handleReviewerClick(rating.raterId)}
                                            >
                                                <img
                                                    src={rating.raterPhoto || 'https://picsum.photos/seed/unknown/100/100'}
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-100 group-hover:border-violet-300 transition-colors"
                                                    referrerPolicy="no-referrer"
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
                            <div className="text-center py-8 bg-white rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400 font-medium">No reviews yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onVerifySuccess={handleVerificationSuccess}
                initialUsername={editedData.instagram}
            />
        </div>
    );
};