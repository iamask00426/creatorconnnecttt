import React from 'react';
import type { UserData } from '../../types';
import { UserCircleIcon } from '../icons';

interface AccountSettingsScreenProps {
    onNavigate: (view: 'settings' | 'edit' | 'personalDetails') => void;
    currentUser: UserData;
}

const SettingsItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    onClick?: () => void;
}> = ({ icon, label, sublabel, onClick }) => (
    <li>
        <button 
            onClick={onClick} 
            className="w-full flex items-center p-4 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
        >
            <span className="mr-4 text-gray-500">{icon}</span>
            <div className="flex-grow">
                <p className="font-medium">{label}</p>
                {sublabel && <p className="text-sm text-gray-500">{sublabel}</p>}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
    </li>
);

export const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ onNavigate, currentUser }) => {
    
    return (
        <div className="p-4 animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={() => onNavigate('settings')} className="mr-4 p-2 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Account</h1>
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">Personal info</h2>
                    <div className="bg-white p-2 rounded-xl shadow-md">
                        <ul className="divide-y divide-gray-100">
                           <SettingsItem 
                                icon={<UserCircleIcon className="h-6 w-6" />}
                                label="Personal Details"
                                sublabel={currentUser.displayName}
                                onClick={() => onNavigate('personalDetails')}
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};