import { useEffect, useRef } from 'react';
import { updateUserProfile } from '../services/firebase';
import type { UserData } from '../types';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const SYNC_INTERVAL_MS = 60000; // Sync to Firestore every 60 seconds

export const useTimeTracking = (currentUser: UserData | null) => {
    const totalAccumulatedMs = useRef(0);
    const lastTickTime = useRef<number | null>(null);
    const syncIntervalRef = useRef<number | null>(null);

    // 1. Tick function to accumulate time locally
    useEffect(() => {
        if (!currentUser) return;

        const tick = () => {
            // Only count time if the tab is visible/active
            if (document.visibilityState === 'visible') {
                const now = Date.now();
                if (lastTickTime.current !== null) {
                    const delta = now - lastTickTime.current;
                    // Cap delta at 5 seconds to prevent huge jumps if browser throttles
                    totalAccumulatedMs.current += Math.min(delta, 5000);
                }
                lastTickTime.current = now;
            } else {
                lastTickTime.current = null;
                // Sync immediately when they tab away to not lose data
                syncTime();
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                lastTickTime.current = Date.now();
            } else {
                tick(); // Run one last tick
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        lastTickTime.current = Date.now();
        
        // Track actively every 2 seconds
        const trackInterval = window.setInterval(tick, 2000);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(trackInterval);
            syncTime(); // Sync remaining time when unmounted
        };
    }, [currentUser?.uid]);

    // 2. Sync accumulated time to Firestore
    const syncTime = async () => {
        if (!currentUser || totalAccumulatedMs.current < 5000) {
            // Don't bother syncing less than 5 seconds to save Writes
            return;
        }

        const msToSync = totalAccumulatedMs.current;
        // Optimistically clear so we don't double count while waiting for network
        totalAccumulatedMs.current = 0;

        try {
            await updateUserProfile(currentUser.uid, {
                // We use FieldValue.increment to safely add to existing time
                totalTimeSpentMs: firebase.firestore.FieldValue.increment(msToSync) as unknown as number
            });
            console.log(`[TimeTracking] Synced ${Math.round(msToSync / 1000)}s to Firestore.`);
        } catch (error) {
            console.error('[TimeTracking] Failed to sync time:', error);
            // Put the time back entirely if it failed
            totalAccumulatedMs.current += msToSync;
        }
    };

    // 3. Periodic Sync Interval (e.g., every 60 seconds)
    useEffect(() => {
        if (!currentUser) return;

        syncIntervalRef.current = window.setInterval(syncTime, SYNC_INTERVAL_MS);

        return () => {
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
        };
    }, [currentUser?.uid]);
};
