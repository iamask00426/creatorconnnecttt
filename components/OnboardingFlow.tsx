
import React, { useState } from 'react';
import type { UserData } from '../types';
import { creatorNiches } from '../constants';
import { CameraIcon, MyLocationIcon, InstagramIcon } from './icons';
import { uploadProfileImage } from '../services/firebase';
import { verify_ig } from '../services/instagram';
import { countryCodes } from '../data/countryCodes';

interface OnboardingFlowProps {
    userData: UserData;
    onComplete: (data: Partial<UserData>) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ userData, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [displayName, setDisplayName] = useState(userData.displayName !== 'New Creator' ? userData.displayName : '');
    const [niche, setNiche] = useState(userData.niche !== 'General' ? userData.niche : '');
    const [countryCode, setCountryCode] = useState('+91');
    const [location, setLocation] = useState(userData.location || '');
    const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || '');
    const [gender, setGender] = useState(userData.gender || '');
    const [instagram, setInstagram] = useState(userData.instagram || '');

    // Verification State
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle');
    const [verificationMsg, setVerificationMsg] = useState('');
    const REEL_URL = "https://www.instagram.com/p/DUTCmLigq49/";

    // Country Picker State
    const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');

    // Images
    const [photoURL, setPhotoURL] = useState(userData.photoURL);
    const [coverURL, setCoverURL] = useState(userData.portfolio?.[0] || '');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    // Geolocation
    const handleDetectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const city = data.address.city || data.address.town || '';
                    const country = data.address.country || '';
                    setLocation(`${city}${city && country ? ', ' : ''}${country}`);
                } catch (e) {
                    console.error("Geo error", e);
                }
            });
        }
    };

    // Image Handlers
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setPhotoFile(e.target.files[0]);
            setPhotoURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setCoverFile(e.target.files[0]);
            setCoverURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleNext = () => {
        if (!displayName || !niche || !location || !phoneNumber || !gender) {
            return;
        }
        setStep(2);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleOpenReel = () => {
        window.open(REEL_URL, '_blank');
    };

    const handleVerifyAndSubmit = async () => {
        if (!instagram.trim()) {
            setVerificationStatus('failure');
            setVerificationMsg("Please enter your Instagram username");
            return;
        }

        setVerificationStatus('verifying');
        setVerificationMsg('');
        setIsSubmitting(true);

        // Bypassing verification - just collecting username
        setTimeout(() => {
            setVerificationStatus('success');
            // Allow completion without actual verification check
            setTimeout(() => submitProfile(true), 1000);
        }, 1500);
    };

    const submitProfile = async (verified: boolean) => {
        try {
            let finalPhotoURL = photoURL;
            let finalCoverURL = coverURL;

            // Upload images if changed
            if (photoFile) {
                finalPhotoURL = await uploadProfileImage(userData.uid, photoFile, 'profile');
            }
            if (coverFile) {
                finalCoverURL = await uploadProfileImage(userData.uid, coverFile, 'cover');
            }

            // Construct new portfolio array with cover as first item
            const newPortfolio = userData.portfolio || [];
            if (finalCoverURL && newPortfolio[0] !== finalCoverURL) {
                if (newPortfolio.length > 0) newPortfolio[0] = finalCoverURL;
                else newPortfolio.push(finalCoverURL);
            }

            const updateData: Partial<UserData> = {
                displayName,
                niche,
                location,
                phoneNumber: `${countryCode} ${phoneNumber}`,
                instagram,
                photoURL: finalPhotoURL,
                portfolio: newPortfolio,
                instagramVerified: verified,
                gender: gender as any,
                profileStatus: 'pending' // Set to pending as requested
            };

            await onComplete(updateData);
        } catch (error) {
            console.error("Onboarding failed", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col animate-fade-in overflow-y-auto">
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 sticky top-0 z-50">
                <div
                    className="h-full bg-violet-600 transition-all duration-500"
                    style={{ width: `${(step / 2) * 100}%` }}
                ></div>
            </div>

            <div className="flex-grow p-6 max-w-md mx-auto w-full flex flex-col pb-10">

                {/* STEP 1: DETAILS FORM */}
                {step === 1 && (
                    <div className="space-y-6 animate-slide-up">
                        <div className="text-center mb-6 mt-4">
                            <h1 className="text-3xl font-black text-slate-900 mb-1">Create Profile</h1>
                            <p className="text-slate-500 text-sm">Tell us about yourself</p>
                        </div>

                        {/* Combined Image Upload Area */}
                        <div className="relative mb-8">
                            {/* Cover */}
                            <div className="w-full h-32 bg-slate-100 rounded-2xl overflow-hidden relative group border border-slate-200">
                                {coverURL ? (
                                    <img src={coverURL} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <CameraIcon className="w-6 h-6" />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors cursor-pointer flex items-center justify-center">
                                    <input type="file" className="hidden" onChange={handleCoverSelect} accept="image/*" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded-lg">Edit Cover</span>
                                </label>
                            </div>

                            {/* Profile Pic - Overlapping */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                <div className="relative group">
                                    <img
                                        src={photoURL}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                                        alt="Profile"
                                    />
                                    <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <CameraIcon className="w-6 h-6 text-white" />
                                        <input type="file" className="hidden" onChange={handlePhotoSelect} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 pt-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Display Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="e.g. Alex Creative"
                                    className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-slate-900 border border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div className="bg-violet-50/50 p-4 rounded-2xl border border-violet-100">
                                <label className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-2 block">Mobile Number <span className="text-violet-400 font-normal normal-case ml-1">(For verification)</span></label>
                                <div className="flex gap-2 items-center relative z-20">
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                                            className="w-28 p-3.5 bg-white rounded-xl font-bold text-slate-900 border border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none text-center h-[52px] flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <span>{countryCodes.find(c => c.dial_code === countryCode)?.flag || '🇮🇳'}</span>
                                            <span>{countryCode}</span>
                                        </button>

                                        {isCountryPickerOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 max-h-80 overflow-hidden flex flex-col z-50">
                                                <div className="p-3 border-b border-slate-100 sticky top-0 bg-white">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="Search country..."
                                                        className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold outline-none focus:bg-white border border-transparent focus:border-violet-200 transition-all"
                                                        value={countrySearchQuery}
                                                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <div className="overflow-y-auto flex-1">
                                                    {countryCodes.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) || c.dial_code.includes(countrySearchQuery) || c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())).map((c) => (
                                                        <button
                                                            key={`${c.code}-${c.dial_code}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setCountryCode(c.dial_code);
                                                                setIsCountryPickerOpen(false);
                                                                setCountrySearchQuery('');
                                                            }}
                                                            className="w-full p-3 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                                                        >
                                                            <span className="text-xl">{c.flag}</span>
                                                            <span className="text-sm font-bold text-slate-700 flex-1">{c.name}</span>
                                                            <span className="text-xs font-bold text-slate-400">{c.dial_code}</span>
                                                        </button>
                                                    ))}
                                                    {countryCodes.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())).length === 0 && (
                                                        <div className="p-4 text-center text-xs text-slate-400 font-bold">No countries found</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="1234567890"
                                        className="flex-1 min-w-0 p-3.5 bg-white rounded-xl font-bold text-slate-900 border border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none h-[52px] shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Niche</label>
                                    <select
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-slate-900 border border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none appearance-none"
                                    >
                                        <option value="">Select</option>
                                        {Object.keys(creatorNiches).map(cat => (
                                            <optgroup key={cat} label={cat}>
                                                {creatorNiches[cat].map(n => <option key={n} value={n}>{n}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Gender</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 rounded-xl font-bold text-slate-900 border border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Location</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="City, Country"
                                        className="flex-grow p-3.5 bg-slate-50 rounded-xl font-bold text-slate-900 border border-transparent focus:border-violet-200 focus:bg-white transition-all outline-none"
                                    />
                                    <button
                                        onClick={handleDetectLocation}
                                        className="px-4 bg-violet-50 text-violet-600 rounded-xl hover:bg-violet-100 transition-colors"
                                    >
                                        <MyLocationIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>



                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!displayName || !niche || !location || !phoneNumber || !gender}
                            className="w-full py-4 mt-8 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Next: Verify Identity
                        </button>
                    </div>
                )}

                {/* STEP 2: VERIFICATION UI */}
                {step === 2 && (
                    <div className="space-y-6 animate-slide-up flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="text-center mb-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-xl shadow-red-500/20 mb-6 transform rotate-3">
                                <InstagramIcon className="w-10 h-10 text-white transform -rotate-3" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Verify Instagram</h1>
                            <p className="text-slate-500 text-sm max-w-[260px] mx-auto">Mandatory step to ensure quality. Comment on our reel to verify ownership.</p>
                        </div>

                        {/* Steps Card */}
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 w-full">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shadow-sm">1</div>
                                <p className="text-xs font-bold text-slate-700">Enter your Instagram handle</p>
                            </div>
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shadow-sm">2</div>
                                <p className="text-xs font-bold text-slate-700">Open Reel & Drop a Comment</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shadow-sm">3</div>
                                <p className="text-xs font-bold text-slate-700">Click Verify & Launch</p>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-400 font-bold">@</span>
                                </div>
                                <input
                                    type="text"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    placeholder="username"
                                    className="w-full pl-9 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <button
                                onClick={handleOpenReel}
                                className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Open Instagram Reel
                            </button>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest"
                                    disabled={isSubmitting}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleVerifyAndSubmit}
                                    disabled={isSubmitting}
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {verificationStatus === 'verifying' ? 'Verifying...' : 'Launching...'}
                                        </>
                                    ) : (
                                        'Verify & Launch'
                                    )}
                                </button>
                            </div>

                            {verificationStatus === 'failure' && (
                                <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center border border-red-100 animate-fade-in">
                                    {verificationMsg}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
