
import React, { useState, useEffect } from 'react';
import type { UserData, CollabRequest, Collaboration, AppNotification, CalendarEvent, Creator } from '../../types';
import {
    getCollabRequestsStream,
    deleteCollabRequest,
    acceptCollabRequest,
    getCollaborationsStream,
    getNotificationsStream,
    markNotificationRead,
    markAllNotificationsRead,
    finalizeCollaborationWithLink,
    getUser
} from '../../services/firebase';
import { RatingModal } from '../modals/RatingModal';
import { CompleteProjectModal } from '../modals/CompleteProjectModal';
import { StarIcon, NotificationsIcon } from '../icons';

interface NotificationsScreenProps {
    currentUser: UserData;
    onUpdateUserData?: (data: Partial<UserData>) => void;
    onViewProfile?: (creator: Creator) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ currentUser, onUpdateUserData, onViewProfile }) => {
    const [requests, setRequests] = useState<CollabRequest[]>([]);
    const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const [ratingModalInfo, setRatingModalInfo] = useState<{ collab: Collaboration; otherUser: { uid: string; displayName: string } } | null>(null);

    // Complete Modal State
    const [completionModalCollab, setCompletionModalCollab] = useState<Collaboration | null>(null);

    // Optimistic state to store IDs of collaborations rated in this session before DB sync
    const [recentlyRatedIds, setRecentlyRatedIds] = useState<string[]>([]);

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

    useEffect(() => {
        if (!currentUser?.uid) return;

        setIsLoading(true);
        let activeSubscriptions = 3;
        const onDataLoaded = () => {
            activeSubscriptions--;
            if (activeSubscriptions <= 0) {
                setIsLoading(false);
            }
        };

        const unsubscribeRequests = getCollabRequestsStream(currentUser.uid, (newRequests) => {
            setRequests(newRequests);
            onDataLoaded();
        });

        const unsubscribeCollabs = getCollaborationsStream(currentUser.uid, (newCollabs) => {
            setCollaborations(newCollabs);
            onDataLoaded();
        });

        const unsubscribeNotifications = getNotificationsStream(currentUser.uid, (newNotes) => {
            setNotifications(newNotes);
            onDataLoaded();
        });

        return () => {
            unsubscribeRequests();
            unsubscribeCollabs();
            unsubscribeNotifications();
        };
    }, [currentUser?.uid]);

    // Mark all unread notifications as read when the screen is viewed
    useEffect(() => {
        if (!currentUser?.uid) return;
        const hasUnread = notifications.some(n => !n.read);
        if (!hasUnread) return;

        // Short delay so the user can briefly see the unread styling before it clears
        const timer = setTimeout(() => {
            markAllNotificationsRead(currentUser.uid).catch(console.error);
        }, 1500);

        return () => clearTimeout(timer);
    }, [currentUser?.uid, notifications]);

    const handleAccept = async (request: CollabRequest) => {
        if (!currentUser) return;
        try {
            await acceptCollabRequest(currentUser, request);

            // OPTIMISTIC CALENDAR UPDATE (Client Side)
            if (onUpdateUserData) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                const newEvent: CalendarEvent = {
                    id: `collab-${Date.now()}`,
                    title: `Project: ${request.projectName}`,
                    date: tomorrow,
                    type: 'collab',
                    description: `Collaboration with ${request.senderName}.`
                };

                const currentSchedule = currentUser.schedule || [];
                onUpdateUserData({
                    schedule: [...currentSchedule, newEvent]
                });
            }

            setFeedback(`Collaboration with ${request.senderName} has started & added to calendar!`);
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            console.error('Failed to accept request:', error);
            setFeedback('Could not start collaboration. Please try again.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const handleDecline = async (requestId: string, senderName: string) => {
        if (!currentUser?.uid) return;
        try {
            await deleteCollabRequest(currentUser.uid, requestId);
            setFeedback(`Request from ${senderName} has been declined.`);
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            console.error(`Failed to decline request:`, error);
            setFeedback('Could not update request. Please try again.');
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const openCompletionModal = (collab: Collaboration) => {
        setCompletionModalCollab(collab);
    };

    const handleConfirmCompletion = async (link: string) => {
        if (!completionModalCollab) return;

        try {
            // Create a name map for the service
            const partnerNameMap: Record<string, string> = {};
            completionModalCollab.participantIds.forEach(id => {
                partnerNameMap[id] = completionModalCollab.participants[id]?.displayName || 'Partner';
            });

            await finalizeCollaborationWithLink(
                completionModalCollab.id,
                link.trim(),
                completionModalCollab.participantIds,
                completionModalCollab.projectName,
                partnerNameMap
            );

            setFeedback('Collaboration completed and added to your portfolio!');
            setTimeout(() => setFeedback(''), 3000);
        } catch (error) {
            console.error("Failed to update status:", error);
            setFeedback('Could not update status. Please try again.');
        } finally {
            setCompletionModalCollab(null);
        }
    };

    const handleOpenRatingModal = (collab: Collaboration, otherUserUid?: string, otherUserName?: string) => {
        let targetUid = otherUserUid;
        let targetName = otherUserName;

        if (!targetUid) {
            targetUid = collab.participantIds.find(id => id !== currentUser.uid);
            if (targetUid) {
                targetName = collab.participants[targetUid].displayName;
            }
        }

        if (targetUid && targetName) {
            setRatingModalInfo({
                collab,
                otherUser: { uid: targetUid, displayName: targetName }
            });
        }
    };

    const handleRatingSuccess = () => {
        if (ratingModalInfo) {
            // Optimistically update the UI so "Pending" disappears instantly
            setRecentlyRatedIds(prev => [...prev, ratingModalInfo.collab.id]);
        }
    };

    const handleRateBack = (notification: AppNotification) => {
        if (notification.data?.collabId && notification.data?.raterId) {
            const relatedCollab = collaborations.find(c => c.id === notification.data?.collabId);
            if (relatedCollab) {
                handleOpenRatingModal(relatedCollab, notification.data.raterId, notification.data.raterName);
                if (!notification.read) {
                    markNotificationRead(notification.id);
                }
            } else {
                setFeedback("Collaboration details not found. It may have been removed.");
                setTimeout(() => setFeedback(''), 3000);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 animate-fade-in">
            <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 shadow-sm">
                <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
            </div>

            <div className="p-4 space-y-8 pb-24">
                {feedback && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm font-semibold shadow-sm border border-green-200 animate-fade-in-up">
                        {feedback}
                    </div>
                )}

                {ratingModalInfo && (
                    <RatingModal
                        currentUser={currentUser}
                        otherUser={ratingModalInfo.otherUser}
                        collaboration={ratingModalInfo.collab}
                        onClose={() => setRatingModalInfo(null)}
                        onSuccess={handleRatingSuccess}
                    />
                )}

                {completionModalCollab && (
                    <CompleteProjectModal
                        isOpen={!!completionModalCollab}
                        projectName={completionModalCollab.projectName}
                        onClose={() => setCompletionModalCollab(null)}
                        onConfirm={handleConfirmCompletion}
                    />
                )}

                {isLoading ? (
                    <div className="text-center p-16">
                        <div className="w-8 h-8 mx-auto border-4 border-dashed rounded-full animate-spin border-violet-600"></div>
                    </div>
                ) : (
                    <>
                        {/* 1. New Requests */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                New Requests
                            </h2>
                            {requests.length > 0 ? (
                                requests.map(req => (
                                    <div key={req.id} className="p-4 bg-white rounded-2xl shadow-soft-sm border border-slate-100 transition-all hover:shadow-md relative overflow-hidden group">

                                        {/* Visual 'Pending' Blue Tick Badge */}
                                        <div className="absolute top-3 right-3 z-10 animate-fade-in-up">
                                            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full shadow-sm">
                                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-wide">Action Required</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 pt-2">
                                            <img src={req.senderPhoto} className="w-12 h-12 rounded-xl object-cover border border-slate-100 cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all" alt={req.senderName} onClick={() => handleProfileClick(req.senderId)} />
                                            <div className="flex-grow pr-16">
                                                <p className="text-sm text-slate-700 leading-snug"><span className="font-bold text-slate-900">{req.senderName}</span> wants to collaborate on <span className="font-black text-slate-900">"{req.projectName}"</span>.</p>
                                                <div className="mt-2 pl-3 border-l-2 border-violet-100 bg-slate-50 rounded-r-lg p-2">
                                                    <p className="text-xs text-slate-600 italic">"{req.description}"</p>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wide">Dates: {req.dates}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-4 border-t border-slate-50 pt-3">
                                            <button onClick={() => handleDecline(req.id, req.senderName)} className="px-5 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wide">Decline</button>
                                            <button onClick={() => handleAccept(req)} className="px-5 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:scale-105 transition-all shadow-lg shadow-slate-900/10 uppercase tracking-wide">Accept</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 py-6 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold uppercase tracking-wide opacity-60">No new collaboration requests</p>
                                </div>
                            )}
                        </div>

                        {/* 2. Recent Activity */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                Recent Activity
                            </h2>
                            {notifications.length > 0 ? (
                                <div className="space-y-3">
                                    {notifications.map(note => {
                                        const isRating = note.type === 'rating_received';

                                        const relatedCollab = collaborations.find(c => c.id === note.data?.collabId);
                                        const haveIRatedBack = (relatedCollab?.ratedBy || []).includes(currentUser.uid) || (relatedCollab && recentlyRatedIds.includes(relatedCollab.id));

                                        const canRateBack = isRating && relatedCollab && !haveIRatedBack;

                                        return (
                                            <div key={note.id} className={`p-4 rounded-2xl border transition-all hover:shadow-md ${note.read ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-100'}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                        {isRating ? <StarIcon className="w-5 h-5 text-amber-400" fill="#FBBF24" /> : <NotificationsIcon className="w-5 h-5 text-slate-400" />}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{note.message}</p>
                                                        <p className="text-[10px] text-slate-400 mt-2">{note.timestamp.toLocaleDateString()} • {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                                                        {canRateBack && (
                                                            <div className="mt-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between animate-fade-in-up">
                                                                <span className="text-xs font-bold text-slate-700">Would you like to give feedback too?</span>
                                                                <button
                                                                    onClick={() => handleRateBack(note)}
                                                                    className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md hover:scale-105 transition-transform"
                                                                >
                                                                    Rate Back
                                                                </button>
                                                            </div>
                                                        )}
                                                        {isRating && haveIRatedBack && (
                                                            <div className="mt-2 text-[10px] font-bold text-green-600 flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                                You rated them back
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 py-6 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold uppercase tracking-wide opacity-60">No recent alerts</p>
                                </div>
                            )}
                        </div>

                        {/* 3. My Collaborations */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                My Collaborations
                            </h2>
                            {collaborations.length > 0 ? (
                                collaborations.map(collab => {
                                    const otherUserId = collab.participantIds.find(id => id !== currentUser.uid)!;
                                    const otherUser = collab.participants[otherUserId] || { displayName: 'Unknown', photoURL: '' };

                                    const hasRated = (collab.ratedBy || []).includes(currentUser.uid) || recentlyRatedIds.includes(collab.id);
                                    const isCompleted = collab.status === 'completed';

                                    return (
                                        <div key={collab.id} className="p-4 bg-white rounded-2xl shadow-soft-sm border border-slate-100 transition-all hover:shadow-md">
                                            <div className="flex items-center space-x-3">
                                                <img src={otherUser.photoURL || 'https://picsum.photos/seed/unknown/100/100'} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-violet-300 transition-all" alt={otherUser.displayName} onClick={() => handleProfileClick(otherUserId)} />
                                                <div className="flex-grow">
                                                    <p className="text-sm text-slate-700 font-medium">Collaboration on <span className="font-black text-slate-900">"{collab.projectName}"</span> with <span className="font-bold">{otherUser.displayName}</span>.</p>
                                                    <div className="flex items-center mt-2 space-x-2">
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                                            {isCompleted ? 'COMPLETED' : 'ACTIVE'}
                                                        </span>

                                                        {isCompleted && !hasRated && (
                                                            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                                                Pending Rating
                                                            </span>
                                                        )}
                                                        {collab.finalLink && (
                                                            <a href={collab.finalLink} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100 flex items-center gap-1 hover:bg-violet-100">
                                                                Watch Result
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-4 border-t border-slate-50 pt-3">
                                                {!isCompleted ? (
                                                    <button
                                                        onClick={() => openCompletionModal(collab)}
                                                        className="w-full sm:w-auto px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <span>Mark Complete</span>
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                    </button>
                                                ) : (
                                                    hasRated ? (
                                                        <div className="flex items-center space-x-1 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 opacity-75">
                                                            <StarIcon className="w-3 h-3 text-amber-400" fill="#FBBF24" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">You Rated</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleOpenRatingModal(collab)}
                                                            className="w-full sm:w-auto px-4 py-2 text-xs font-black uppercase tracking-widest text-white bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                                        >
                                                            Rate {otherUser.displayName}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-slate-400 py-6 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold uppercase tracking-wide opacity-60">No active projects</p>
                                </div>
                            )}
                        </div>

                        {requests.length === 0 && collaborations.length === 0 && notifications.length === 0 && (
                            <div className="text-center text-slate-400 pt-16">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                <h3 className="mt-2 text-sm font-medium text-slate-900">No activity yet</h3>
                                <p className="mt-1 text-sm text-slate-500">Connect with creators to get started!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
