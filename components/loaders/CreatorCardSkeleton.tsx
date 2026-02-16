import React from 'react';

export const CreatorCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl shadow-soft-md overflow-hidden animate-fade-in-up">
        <div className="aspect-[9/12] skeleton"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
             <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full skeleton"></div>
                <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded skeleton"></div>
                    <div className="h-2 w-1/2 rounded skeleton"></div>
                     <div className="h-2 w-1/3 rounded skeleton"></div>
                </div>
            </div>
        </div>
    </div>
);