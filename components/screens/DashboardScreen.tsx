import React, { useState, useEffect } from 'react';
import type { UserData, Collaboration, CollabRequest, Creator } from '../../types';
import { BriefcaseIcon, LockClosedIcon, StarIcon, BoltIcon, UserCircleIcon } from '../icons';
import { getCollaborationsStream, getCollabRequestsStream, getSentCollabRequestsStream, acceptCollabRequest, deleteCollabRequest, getUser } from '../../services/firebase';

interface DashboardScreenProps {
    currentUser: UserData;
    setActiveTab: (tab: string) => void;
    onViewProfile?: (creator: Creator) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentUser, setActiveTab, onViewProfile }) => {
    const [activeCollabs, setActiveCollabs] = useState<Collaboration[]>([]);
    const [receivedRequests, setReceivedRequests] = useState<CollabRequest[]>([]);
    const [sentRequests, setSentRequests] = useState<CollabRequest[]>([]);
    const [viewMode, setViewMode] = useState<'active' | 'pending' | 'sent'>('active');

    useEffect(() => {
        const unsubCollabs = getCollaborationsStream(currentUser.uid, setActiveCollabs);
        const unsubReceived = getCollabRequestsStream(currentUser.uid, setReceivedRequests);
        const unsubSent = getSentCollabRequestsStream(currentUser.uid, setSentRequests);

        return () => {
            unsubCollabs();
            unsubReceived();
            unsubSent();
        };
    }, [currentUser.uid]);

    const handleProfileClick = async (userId: string) => {
        if (!userId || !onViewProfile) return;
        try {
            const user = await getUser(userId);
            if (user) {
                onViewProfile(user);
            }
        } catch (error) {
            console.error("Failed to load user profile", error);
        }
    };

    const handleAccept = async (req: CollabRequest) => {
        await acceptCollabRequest(currentUser, req);
    };

    const handleDecline = async (reqId: string) => {
        await deleteCollabRequest(currentUser.uid, reqId);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-xl px-6 py-6 pb-2 border-b border-slate-100">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workstation</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage Your Collabs</p>

                {/* Tabs */}
                <div className="flex gap-2 mt-6 overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setViewMode('active')}
                        className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'active' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                        Active ({activeCollabs.length})
                    </button>
                    <button
                        onClick={() => setViewMode('pending')}
                        className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'pending' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                        Received ({receivedRequests.length})
                    </button>
                    <button
                        onClick={() => setViewMode('sent')}
                        className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${viewMode === 'sent' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                        Sent ({sentRequests.length})
                    </button>
                </div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto pb-32 space-y-6">

                {/* Content Area */}
                <div className="min-h-[200px]">
                    {viewMode === 'active' && (
                        <div className="space-y-4">
                            {activeCollabs.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <BriefcaseIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-bold text-slate-400">No active projects yet.</p>
                                </div>
                            ) : (
                                activeCollabs.map(collab => (
                                    <div key={collab.id} className="bg-white p-5 rounded-[2rem] soft-shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-slate-900">{collab.projectName}</h3>
                                            <span className="bg-green-100 text-green-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Active</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{collab.description}</p>
                                        <div className="flex -space-x-2">
                                            {collab.participantIds.map(uid => (
                                                <div key={uid} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all" onClick={() => handleProfileClick(uid)}>
                                                    <img src={collab.participants[uid]?.photoURL} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {viewMode === 'pending' && (
                        <div className="space-y-4">
                            {receivedRequests.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <BoltIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-bold text-slate-400">No requests received.</p>
                                </div>
                            ) : (
                                receivedRequests.map(req => (
                                    <div key={req.id} className="bg-white p-5 rounded-[2rem] soft-shadow-sm border border-slate-100 relative overflow-hidden">
                                        <div className="flex gap-4 mb-4">
                                            <img src={req.senderPhoto} alt="" className="w-12 h-12 rounded-xl bg-slate-200 object-cover cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all" onClick={() => handleProfileClick(req.senderId)} />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{req.senderName}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wants to Collab</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-xl mb-4">
                                            <p className="text-xs font-bold text-slate-700 mb-1">{req.projectName}</p>
                                            <p className="text-xs text-slate-500">{req.description}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Date: {req.dates}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleDecline(req.id)}
                                                className="py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wide hover:bg-slate-50"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => handleAccept(req)}
                                                className="py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wide shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-transform"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {viewMode === 'sent' && (
                        <div className="space-y-4">
                            {sentRequests.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <UserCircleIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm font-bold text-slate-400">No requests sent.</p>
                                </div>
                            ) : (
                                sentRequests.map(req => (
                                    <div key={req.id} className="bg-white p-5 rounded-[2rem] soft-shadow-sm border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900 text-sm">{req.projectName}</h4>
                                            <span className="bg-amber-100 text-amber-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Pending</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">{req.description}</p>
                                        <button
                                            onClick={() => handleDecline(req.id)}
                                            className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-500"
                                        >
                                            Cancel Request
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Brand Campaigns (Static/Promo) */}
                <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 mb-6 px-2 flex items-center gap-3">
                        Brand Opportunities
                        <span className="bg-violet-100 text-violet-600 text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">Featured</span>
                    </h3>

                    {/* Reuse existing brand cards logic but simplified */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden soft-shadow-lg mb-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl -mr-8 -mt-8"></div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-black mb-2">Exclusive Campaigns</h2>
                            <p className="text-slate-400 text-xs mb-4">Connect with top-tier brands.</p>
                            <button className="px-6 py-3 bg-white text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
