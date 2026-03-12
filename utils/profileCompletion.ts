import type { UserData } from '../types';

interface ProfileCompletionStatus {
    isComplete: boolean;
    missingFields: string[];
    filledCount: number;
    totalRequired: number;
}

const SOCIAL_PLATFORMS = ['instagram', 'youtube', 'tiktok', 'twitter', 'snapchat'] as const;
const TOTAL_REQUIRED_FIELDS = 6;

export function getProfileCompletionStatus(userData: UserData): ProfileCompletionStatus {
    const missingFields: string[] = [];
    let filledCount = 0;

    // 1. Display Name
    if (userData.displayName && userData.displayName.trim() !== '' && userData.displayName !== 'New Creator') {
        filledCount++;
    } else {
        missingFields.push('Name');
    }

    // 2. Unique Link (username)
    if (userData.username && userData.username.trim() !== '') {
        filledCount++;
    } else {
        missingFields.push('Unique Link');
    }

    // 3. At least 2 social handles
    const filledSocials = SOCIAL_PLATFORMS.filter(
        platform => !!(userData as any)[platform] && (userData as any)[platform].trim() !== ''
    );
    if (filledSocials.length >= 2) {
        filledCount++;
    } else {
        const needed = 2 - filledSocials.length;
        missingFields.push(`${needed} more Social Handle${needed > 1 ? 's' : ''}`);
    }

    // 4. Total Followers
    if (userData.followerCount && userData.followerCount > 0) {
        filledCount++;
    } else {
        missingFields.push('Total Followers');
    }

    // 5. Bio
    if (userData.bio && userData.bio.trim() !== '') {
        filledCount++;
    } else {
        missingFields.push('Bio');
    }

    // 6. Profile Picture
    const hasValidPhoto = userData.photoURL
        && userData.photoURL.trim() !== ''
        && !userData.photoURL.includes('default')
        && !userData.photoURL.includes('placeholder');
    if (hasValidPhoto) {
        filledCount++;
    } else {
        missingFields.push('Profile Picture');
    }

    return {
        isComplete: filledCount >= TOTAL_REQUIRED_FIELDS,
        missingFields,
        filledCount,
        totalRequired: TOTAL_REQUIRED_FIELDS,
    };
}
