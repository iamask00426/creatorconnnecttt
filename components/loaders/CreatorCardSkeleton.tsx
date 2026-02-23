import React from 'react';

export const CreatorCardSkeleton: React.FC = () => (
    <div className="relative aspect-[4/5] rounded-[2rem] bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
        {/* Main Image Placeholder */}
        <div className="absolute inset-0 bg-slate-200"></div>

        {/* Gradient Overlay Simulation */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent"></div>

        {/* Text Container at Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4">
            {/* Niche Badge */}
            <div className="mb-2">
                <div className="h-4 w-16 bg-white/20 rounded-full"></div>
            </div>

            {/* Name */}
            <div className="h-6 w-3/4 bg-white/40 rounded-md mb-2"></div>

            {/* Location */}
            <div className="h-3 w-1/2 bg-white/30 rounded-md"></div>
        </div>

        {/* Floating Action Button (Plus) */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20"></div>
    </div>
);