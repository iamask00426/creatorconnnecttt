
// Fix: Provide concrete type definitions and export them.
export interface PastCollaboration {
    id: string;
    title: string;
    partnerName: string;
    description: string;
    imageUrl: string;
    date?: string;
    link?: string; // Added link field
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date; // Store as Date object
    type: 'content' | 'collab' | 'meeting';
    description?: string;
    location?: string; // Added location field
}

export type CreatorProfileStatus = 'onboarding' | 'pending' | 'active' | 'suspended' | 'rejected';

export interface Creator {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    niche: string;
    followerCount: number;
    bio: string;
    openToCollab: boolean;
    location: string;
    instagram: string;
    instagramVerified?: boolean;
    youtube: string;
    tiktok: string;
    twitter: string;
    linkedin: string;
    facebook: string;
    twitch: string;
    pinterest: string;
    github: string;
    snapchat: string;
    portfolio: string[];
    pastCollaborations?: PastCollaboration[];
    customRates?: string; // Added custom rates field
    savedProfiles?: string[]; // Added saved profiles list
    schedule?: CalendarEvent[]; // Added schedule for calendar
    createdAt: Date;
    lat: number;
    lng: number;
    collabs: number;
    rating: number;
    ratingCount: number;
    phoneNumber?: string;
    phoneNumberVerified?: boolean;
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    city?: string;
    country?: string;
    profileStatus?: CreatorProfileStatus; // Added 'onboarding'
    username?: string; // Unique username for custom link
}

export type UserData = Creator;

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: Date;
    type?: 'text' | 'image' | 'system'; // Added 'system'
    mediaUrl?: string;
    status?: 'pending' | 'sent' | 'error';
}

export interface LastMessage {
    text: string;
    timestamp: Date;
    senderId: string;
}

export interface ChatSummary {
    id: string; // chatId
    participantIds: string[];
    lastMessage: LastMessage;
    partner: Creator;
    lastRead?: { [userId: string]: Date };
}


export interface CollabRequest {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoto: string;
    projectName: string;
    description: string;
    dates: string;
    status: 'pending' | 'accepted' | 'declined';
    timestamp: Date;
}

export interface ExploreFilters {
    niches: string[];
    followerRange: string;
    location: string;
}

export interface Collaboration {
    id: string;
    participants: { [uid: string]: { displayName: string; photoURL: string; } };
    participantIds: string[];
    projectName: string;
    description: string;
    status: 'active' | 'completed';
    createdAt: Date;
    ratedBy: string[];
    finalLink?: string; // Added field to store the final project link
}

export interface Rating {
    id: string;
    raterId: string;
    value: number;
    comment: string;
    timestamp: Date;
}

export interface Feedback {
    id: string;
    userId: string;
    displayName: string;
    type: 'bug' | 'feature' | 'general';
    message: string;
    userAgent: string;
    timestamp: Date;
}

export interface AppNotification {
    id: string;
    userId: string; // Recipient
    type: 'rating_received' | 'collab_update' | 'system';
    title: string;
    message: string;
    data?: {
        collabId?: string;
        raterId?: string;
        raterName?: string;
        raterPhoto?: string;
    };
    read: boolean;
    timestamp: Date;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImageUrl: string;
    author: string;
    status: 'draft' | 'published';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
}
