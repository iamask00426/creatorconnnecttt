import React from 'react';
import { Creator } from '../../types';

interface UserDetailModalProps {
    user: Creator;
    onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
    // Helper to format dates
    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        try {
            return date.toDate ? date.toDate().toLocaleDateString() : new Date(date).toLocaleDateString();
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // Helper to render section headers
    const SectionHeader = ({ title }: { title: string }) => (
        <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4 mt-6 first:mt-0">
            {title}
        </h3>
    );

    // Helper to render key-value pairs
    const DetailRow = ({ label, value, isLink = false, href = '', isCopyable = false }: { label: string, value: React.ReactNode, isLink?: boolean, href?: string, isCopyable?: boolean }) => (
        <div className="grid grid-cols-3 gap-4 py-2 hover:bg-slate-50 transition-colors rounded-lg px-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider col-span-1">{label}</span>
            <div className="col-span-2 text-slate-900 font-medium break-words flex items-center gap-2">
                {isLink && href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                        {value}
                    </a>
                ) : (
                    <span className={!value ? "text-slate-400 italic" : ""}>{value || 'Not set'}</span>
                )}
                {isCopyable && value && (
                    <button
                        onClick={() => navigator.clipboard.writeText(String(value))}
                        className="p-1 px-2 text-xs bg-slate-100 text-slate-500 rounded hover:bg-slate-200 ml-auto"
                        title="Copy"
                    >
                        Copy
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <a href={user.photoURL} target="_blank" rel="noopener noreferrer" className="relative group">
                            <img
                                src={user.photoURL || 'https://via.placeholder.com/64'}
                                alt={user.displayName}
                                className="w-16 h-16 rounded-full object-cover border-4 border-slate-50 shadow-md"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </div>
                        </a>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{user.displayName}</h2>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">{user.uid}</p>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${user.profileStatus === 'active' ? 'bg-green-100 text-green-700' : user.profileStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.profileStatus || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full hover:bg-slate-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left Column */}
                    <div className="space-y-8">
                        <div>
                            <SectionHeader title="Full User Profile (Updated)" />
                            <div className="space-y-1">
                                <DetailRow label="UID" value={user.uid} isCopyable />
                                <DetailRow label="Display Name" value={user.displayName} />
                                <DetailRow label="Email" value={user.email} isCopyable />
                                <DetailRow label="Photo URL" value="View Image" isLink href={user.photoURL} />
                                <DetailRow label="Bio" value={user.bio} />
                                <DetailRow label="Date of Birth" value={user.dateOfBirth} />
                                <DetailRow label="Gender" value={user.gender} />
                            </div>
                        </div>

                        <div>
                            <SectionHeader title="Location Details" />
                            <div className="space-y-1">
                                <DetailRow label="Location" value={user.location} />
                                <DetailRow label="City" value={user.city} />
                                <DetailRow label="Country" value={user.country} />
                                <DetailRow label="Latitude" value={user.lat} />
                                <DetailRow label="Longitude" value={user.lng} />
                            </div>
                        </div>

                        <div>
                            <SectionHeader title="Contact Info" />
                            <div className="space-y-1">
                                <DetailRow label="Phone Number" value={user.phoneNumber} isCopyable />
                                <DetailRow label="Phone Verified" value={user.phoneNumberVerified ? '✅ Yes' : '❌ No'} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div>
                            <SectionHeader title="Professional & Stats" />
                            <div className="space-y-1">
                                <DetailRow label="Niche" value={user.niche} />
                                <DetailRow label="Follower Count" value={user.followerCount?.toLocaleString()} />
                                <DetailRow label="Open to Collab" value={user.openToCollab ? 'Yes' : 'No'} />
                                <DetailRow label="Custom Rates" value={user.customRates} />
                                <DetailRow label="Collabs Count" value={user.collabs} />
                                <DetailRow label="Rating" value={user.rating ? `${user.rating.toFixed(1)} / 5.0` : 'N/A'} />
                                <DetailRow label="Rating Count" value={user.ratingCount} />
                                <DetailRow label="Created At" value={formatDate(user.createdAt)} />
                            </div>
                        </div>

                        <div>
                            <SectionHeader title="Social Profiles" />
                            <div className="space-y-1">
                                <DetailRow label="Instagram" value={user.instagram} isLink={!!user.instagram} href={`https://instagram.com/${user.instagram}`} />
                                <DetailRow label="Instagram Verified" value={user.instagramVerified ? '✅ Yes' : 'No'} />
                                <DetailRow label="YouTube" value={user.youtube} isLink={!!user.youtube} href={user.youtube} />
                                <DetailRow label="TikTok" value={user.tiktok} isLink={!!user.tiktok} href={user.tiktok} />
                                <DetailRow label="Twitter" value={user.twitter} isLink={!!user.twitter} href={user.twitter} />
                                <DetailRow label="LinkedIn" value={user.linkedin} isLink={!!user.linkedin} href={user.linkedin} />
                                <DetailRow label="Facebook" value={user.facebook} isLink={!!user.facebook} href={user.facebook} />
                                <DetailRow label="Twitch" value={user.twitch} isLink={!!user.twitch} href={user.twitch} />
                                <DetailRow label="Pinterest" value={user.pinterest} isLink={!!user.pinterest} href={user.pinterest} />
                                <DetailRow label="GitHub" value={user.github} isLink={!!user.github} href={user.github} />
                                <DetailRow label="Snapchat" value={user.snapchat} />
                                <DetailRow label="Portfolio" value={user.portfolio?.join(', ')} isLink={user.portfolio && user.portfolio.length > 0} href={user.portfolio?.[0]} />
                            </div>
                        </div>

                        {user.savedProfiles && user.savedProfiles.length > 0 && (
                            <div>
                                <SectionHeader title={`Saved Profiles (${user.savedProfiles.length})`} />
                                <div className="max-h-32 overflow-y-auto bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    {user.savedProfiles.map((pid, idx) => (
                                        <div key={idx} className="text-xs font-mono text-slate-600 py-1 border-b border-slate-100 last:border-0 pl-2">
                                            {pid}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Full Width Sections */}
                <div className="px-8 pb-8">
                    {user.pastCollaborations && user.pastCollaborations.length > 0 && (
                        <div>
                            <SectionHeader title="Past Collaborations" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.pastCollaborations.map((collab) => (
                                    <div key={collab.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-sm transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900">{collab.title}</h4>
                                            {collab.date && <span className="text-xs text-slate-400 font-mono">{collab.date}</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2">Partner: <span className="font-semibold text-violet-600">{collab.partnerName}</span></p>
                                        <p className="text-sm text-slate-600 mb-2">{collab.description}</p>
                                        {collab.link && (
                                            <a href={collab.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                                                View Project
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                    <a
                        href={`mailto:${user.email}`}
                        className="px-6 py-2.5 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Contact User
                    </a>
                </div>
            </div>
        </div>
    );
};
