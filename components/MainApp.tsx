import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { UserData, Creator, AppNotification, CollabRequest } from '../types';
import { getNotificationsStream, getCollabRequestsStream, getChatsStream } from '../services/firebase';

import { HomeScreen } from './screens/HomeScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CreatorProfilePage } from './screens/CreatorProfilePage';
import { ChatScreen } from './screens/ChatScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { BottomNavBar } from './BottomNavBar';

interface MainAppProps {
    userData: UserData;
    onUpdateUserData: (data: Partial<UserData>) => void;
    onLogout: () => void;
    isGlobalModalOpen?: boolean;
}

export const MainApp: React.FC<MainAppProps> = ({ userData, onUpdateUserData, onLogout, isGlobalModalOpen }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [viewingProfile, setViewingProfile] = useState<Creator | null>(null);
    const [chattingWith, setChattingWith] = useState<Creator | null>(null);

    // Removed local CompleteProfileModal state

    const [forceProfileEdit, setForceProfileEdit] = useState(false);
    const [forceMapView, setForceMapView] = useState(false);

    // Unread badge counts — track notifications and collab requests separately
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const [pendingRequestCount, setPendingRequestCount] = useState(0);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    useEffect(() => {
        if (!userData?.uid) return;

        const unsubNotifs = getNotificationsStream(userData.uid, (notifications) => {
            setUnreadNotifCount(notifications.filter(n => !n.read).length);
        });

        const unsubRequests = getCollabRequestsStream(userData.uid, (requests) => {
            setPendingRequestCount(requests.length);
        });

        const unsubChats = getChatsStream(userData.uid, (chats) => {
            const unread = chats.filter(c => {
                if (!c.lastMessage || c.lastMessage.senderId === userData.uid) return false;
                const myLastRead = c.lastRead?.[userData.uid];
                if (!myLastRead) return true;
                return c.lastMessage.timestamp > myLastRead;
            }).length;
            setUnreadMessageCount(unread);
        });

        return () => {
            unsubNotifs();
            unsubRequests();
            unsubChats();
        };
    }, [userData?.uid]);

    const totalUnreadNotifications = unreadNotifCount + pendingRequestCount;

    // Removed Tour Trigger Logic

    const handleViewProfile = useCallback((creator: Creator) => {
        if (!creator) return;
        setViewingProfile(creator);
    }, []);

    const handleCloseProfile = useCallback(() => {
        setViewingProfile(null);
    }, []);

    const handleStartChat = useCallback((creator: Creator) => {
        if (!creator) return;
        setChattingWith(creator);
    }, []);

    const handleCloseChat = useCallback(() => setChattingWith(null), []);

    // Render the active tab content
    // This stays mounted in the background to preserve state and scroll position
    const renderTabContent = () => {
        switch (activeTab) {
            case 'home': return <HomeScreen currentUser={userData} onViewProfile={handleViewProfile} onUpdateUserData={onUpdateUserData} />;
            case 'explore': return <ExploreScreen currentUser={userData} onViewProfile={handleViewProfile} forceMapView={forceMapView} onMapViewEnd={() => setForceMapView(false)} />;
            case 'projects': return <DashboardScreen currentUser={userData} setActiveTab={setActiveTab} onViewProfile={handleViewProfile} />;
            case 'messages': return <MessagesScreen currentUser={userData} onStartChat={handleStartChat} />;
            case 'notifications': return <NotificationsScreen currentUser={userData} onUpdateUserData={onUpdateUserData} onViewProfile={handleViewProfile} />;
            case 'profile': return (
                <ProfileScreen
                    userData={userData}
                    onUpdateUserData={onUpdateUserData}
                    forceEdit={forceProfileEdit}
                    onEditFlowEnd={() => setForceProfileEdit(false)}
                    onLogout={onLogout}
                    onViewProfile={handleViewProfile}
                />
            );
            default: return <HomeScreen currentUser={userData} onViewProfile={handleViewProfile} onUpdateUserData={onUpdateUserData} />;
        }
    };

    const isOverlayOpen = viewingProfile || chattingWith;
    // We only show nav bar if no overlay is open
    const isNavBarVisible = !isOverlayOpen;

    if (!userData) return <div className="p-10 text-center">Initializing Profile...</div>;

    return (
        <div className="h-full bg-slate-50 flex flex-col relative overflow-hidden font-sans antialiased text-slate-900">

            {/* Main Content Layer - Always rendered to preserve state/scroll */}
            <div
                className={`flex-grow h-full overflow-y-auto hide-scrollbar overscroll-none ${isOverlayOpen ? 'overflow-hidden pointer-events-none' : ''}`}
            >
                {renderTabContent()}
            </div>

            {/* Profile Overlay */}
            {viewingProfile && (
                <div className="absolute inset-0 z-50 bg-slate-50 overflow-y-auto animate-slide-in-up">
                    <CreatorProfilePage
                        currentUser={userData}
                        creator={viewingProfile}
                        onBack={handleCloseProfile}
                        onMessage={handleStartChat}
                        onViewProfile={handleViewProfile}
                        onUpdateUserData={onUpdateUserData}
                    />
                </div>
            )}

            {/* Chat Overlay */}
            {chattingWith && (
                <div className="absolute inset-0 z-50 bg-slate-50 animate-slide-in-up">
                    <ChatScreen
                        currentUser={userData}
                        chatPartner={chattingWith}
                        onBack={handleCloseChat}
                        onViewProfile={handleViewProfile}
                    />
                </div>
            )}

            {isNavBarVisible && <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} notificationCount={totalUnreadNotifications} messageCount={unreadMessageCount} />}
        </div>
    );
};