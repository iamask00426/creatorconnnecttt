import React from 'react';

export const ChatListSkeleton: React.FC = () => (
    <div className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-soft-sm animate-fade-in-up">
        <div className="w-14 h-14 rounded-full skeleton"></div>
        <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <div className="h-4 w-1/2 rounded skeleton"></div>
                <div className="h-2 w-1/4 rounded skeleton"></div>
            </div>
            <div className="h-3 w-4/5 rounded skeleton"></div>
        </div>
    </div>
);