
import React from 'react';
import { HomeIcon, ExploreIcon, MessagesIcon, NotificationsIcon, ProfileIcon, BriefcaseIcon } from './icons';

interface BottomNavBarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    notificationCount?: number;
    messageCount?: number;
}

const navItems = [
    { name: 'home', icon: HomeIcon, tourId: 'home-tab' },
    { name: 'explore', icon: ExploreIcon, tourId: 'explore-tab' },
    { name: 'projects', icon: BriefcaseIcon, tourId: 'projects-tab' },
    { name: 'messages', icon: MessagesIcon, tourId: 'messages-tab' },
    { name: 'notifications', icon: NotificationsIcon, tourId: 'notifications-tab' },
    { name: 'profile', icon: ProfileIcon, tourId: 'profile-tab' }
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, notificationCount = 0, messageCount = 0 }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[60] px-6 pb-8 pt-4 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <div className="w-full glass-panel px-3 py-3 rounded-full soft-shadow-lg">
                    <div className="grid grid-cols-6 gap-1 items-center justify-items-center">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.name;
                            const showNotifBadge = item.name === 'notifications' && notificationCount > 0;
                            const showMsgBadge = item.name === 'messages' && messageCount > 0;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    data-tour-id={item.tourId}
                                    className="relative flex flex-col items-center justify-center w-full h-10 tap-bounce group"
                                >
                                    {isActive && (
                                        <div className="absolute inset-x-2 inset-y-0 bg-slate-900 rounded-full transition-all duration-300 shadow-md"></div>
                                    )}

                                    <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        <Icon
                                            active={isActive}
                                            className="w-5 h-5"
                                        />
                                        {/* Notification Badge */}
                                        {showNotifBadge && (
                                            <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white shadow-lg animate-bounce-in">
                                                {notificationCount > 99 ? '99+' : notificationCount}
                                            </span>
                                        )}
                                        {/* Message Badge */}
                                        {showMsgBadge && (
                                            <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-violet-500 text-white text-[10px] font-black rounded-full border-2 border-white shadow-lg animate-bounce-in">
                                                {messageCount > 99 ? '99+' : messageCount}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};
