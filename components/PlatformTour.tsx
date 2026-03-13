import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { updateUserProfile } from '../services/firebase';
import type { UserData } from '../types';

interface PlatformTourProps {
    currentUser: UserData;
    onUpdateUserData: (data: Partial<UserData>) => void;
    forceStart?: boolean;
    onTourEnd?: () => void;
}

export const PlatformTour: React.FC<PlatformTourProps> = ({ currentUser, onUpdateUserData, forceStart, onTourEnd }) => {
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Start tour if the user is new/hasn't seen it, or if forcibly started
        if (forceStart || (currentUser && currentUser.hasSeenTour !== true)) {
            // Add a small delay so DOM can paint
            setTimeout(() => setRun(true), 1500);
        }
    }, [currentUser?.hasSeenTour, forceStart]);

    const handleJoyrideCallback = async (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            
            // Only update backend if this wasn't a forcibly restarted tour
            if (!forceStart && currentUser) {
                try {
                    await updateUserProfile(currentUser.uid, { hasSeenTour: true });
                    onUpdateUserData({ hasSeenTour: true });
                } catch (error) {
                    console.error('Failed to update tour status:', error);
                }
            }

            if (onTourEnd) {
                onTourEnd();
            }
        }
    };

    const steps: Step[] = [
        {
            target: 'body',
            placement: 'center',
            content: (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Welcome to CreatorCo! 👋</h2>
                    <p className="text-gray-600 mb-4">Let's take a quick tour to show you around your new networking hub.</p>
                </div>
            ),
            disableBeacon: true,
        },
        {
            target: '.tour-home-tab',
            content: 'This is your Home Dashboard. Here you can see a quick summary of your profile stats and pending tasks.',
            disableBeacon: true,
        },
        {
            target: '.tour-explore-tab',
            content: 'Looking for collaborators? The Explore tab is a map and list of all creators near you or in your niche. You can filter by follower count and location!',
            disableBeacon: true,
        },
        {
            target: '.tour-projects-tab',
            content: 'The Projects tab is your workspace. Here you can find your active collaborations, create new projects, and review feedback.',
            disableBeacon: true,
        },
        {
            target: '.tour-messages-tab',
            content: 'Your Messages live here. Chat directly with your connections to plan your next viral piece of content.',
            disableBeacon: true,
        },
        {
            target: '.tour-notifications-tab',
            content: 'Stay updated on collaboration requests, project updates, and new followers right here.',
            disableBeacon: true,
        },
        {
            target: '.tour-profile-tab',
            content: 'And finally, your Profile. Keep it updated with your latest rates, portfolio links, and bio to attract the best partners!',
            disableBeacon: true,
        }
    ];

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous={true}
            run={run}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            steps={steps}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#8b5cf6', // purple-500
                    backgroundColor: '#ffffff',
                    textColor: '#1e293b',    // slate-800
                },
                buttonNext: {
                    borderRadius: '8px',
                    fontWeight: 'bold',
                },
                buttonBack: {
                    color: '#64748b',
                },
                buttonSkip: {
                    color: '#94a3b8',
                }
            }}
        />
    );
};
