import React from 'react';

export const CreatorListSkeleton: React.FC = () => (
    <div className="flex items-center space-x-4 p-3 bg-white rounded-xl shadow-soft-sm animate-fade-in-up">
        <div className="w-16 h-16 rounded-lg skeleton"></div>
        <div className="flex-grow space-y-2">
            <div className="h-4 w-2/3 rounded skeleton"></div>
            <div className="h-3 w-1/3 rounded skeleton"></div>
            <div className="h-2 w-1/4 rounded skeleton"></div>
            <div className="h-2 w-1/2 rounded skeleton mt-1"></div>
        </div>
    </div>
);