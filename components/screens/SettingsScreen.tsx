
import React, { useState } from 'react';
import { UserCircleIcon, NotificationsIcon, QuestionMarkCircleIcon, FeedbackIcon, LogoutIcon } from '../icons';
import { FeedbackModal } from '../modals/FeedbackModal';
import type { UserData } from '../../types';

interface SettingsScreenProps {
    onNavigate: (view: 'profile' | 'accountSettings' | 'personalDetails') => void;
    currentUser: UserData;
    onLogout: () => void;
}

const SettingsItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    isDestructive?: boolean;
}> = ({ icon, label, onClick, isDestructive = false }) => (
    <li>
        <button 
            onClick={onClick} 
            className={`w-full flex items-center p-4 text-left rounded-lg transition-colors ${
                isDestructive 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-slate-700 hover:bg-slate-50'
            }`}
        >
            <span className={`mr-4 ${isDestructive ? 'text-red-500' : 'text-slate-500'}`}>{icon}</span>
            <span className="flex-grow font-medium">{label}</span>
            {!isDestructive && (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            )}
        </button>
    </li>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, currentUser, onLogout }) => {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleComingSoon = () => {
        alert('This feature is coming soon!');
    };

    return (
        <div className="min-h-full bg-slate-50 animate-fade-in">
             <div className="sticky top-0 z-20 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3 shadow-sm flex items-center">
                <button onClick={() => onNavigate('profile')} className="mr-3 p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-slate-900">Settings</h1>
            </div>

            <div className="p-4">
                <div className="bg-white p-2 rounded-xl shadow-md w-full max-w-lg mx-auto border border-slate-100">
                    <ul className="divide-y divide-slate-100">
                        <SettingsItem 
                            icon={<UserCircleIcon className="h-6 w-6" />}
                            label="Account"
                            onClick={() => onNavigate('accountSettings')}
                        />
                        <SettingsItem 
                            icon={<NotificationsIcon />}
                            label="Notifications"
                            onClick={handleComingSoon}
                        />
                        <SettingsItem 
                            icon={<FeedbackIcon className="h-6 w-6" />}
                            label="Send Feedback"
                            onClick={() => setIsFeedbackModalOpen(true)}
                        />
                        <SettingsItem 
                            icon={<QuestionMarkCircleIcon className="h-6 w-6" />}
                            label="Help & Support"
                            onClick={handleComingSoon}
                        />
                        <SettingsItem 
                            icon={<LogoutIcon className="h-6 w-6" />}
                            label="Log Out"
                            onClick={onLogout}
                            isDestructive
                        />
                    </ul>
                </div>
            </div>
             {isFeedbackModalOpen && (
                <FeedbackModal 
                    currentUser={currentUser}
                    onClose={() => setIsFeedbackModalOpen(false)} 
                />
            )}
        </div>
    );
};
