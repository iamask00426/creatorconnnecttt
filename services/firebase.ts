
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import type {
    UserData,
    Message,
    Creator,
    CollabRequest,
    Collaboration,
    ChatSummary,
    Rating,
    AppNotification,
    CalendarEvent,
    Feedback,
    BlogPost
} from "../types";

const firebaseConfig = {
    apiKey: "AIzaSyDXg7fFBdJri2lGz1VwmgFzVOG2gDJw924",
    authDomain: "creator-89c0e.firebaseapp.com",
    projectId: "creator-89c0e",
    storageBucket: "creator-89c0e.firebasestorage.app",
    messagingSenderId: "309245509443",
    appId: "1:309245509443:web:e067237a689a9ad9e3f9f6",
    measurementId: "G-7CX6XRRDV6"
};

const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// Enable Offline Persistence
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
    }
});

// Helper for timestamp and arrayUnion since we need it in multiple places
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
const increment = firebase.firestore.FieldValue.increment;

export const fetchAllCreators = async (): Promise<Creator[]> => {
    try {
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return { ...data, uid: doc.id } as Creator;
        });
    } catch (error) {
        console.error("Fetch creators error:", error);
        return [];
    }
};

export const getUser = async (uid: string): Promise<Creator | null> => {
    try {
        const docRef = db.collection('users').doc(uid);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return { ...docSnap.data(), uid: docSnap.id } as Creator;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

// Helper to remove undefined values for Firestore (preserves Dates & nulls)
const sanitizeData = (data: any): any => {
    if (data === undefined) return null; // or undef depending on strategy, but null is safe
    if (data === null) return null;
    if (data instanceof Date) return data;
    if (Array.isArray(data)) return data.map(sanitizeData);
    if (typeof data === 'object') {
        const sanitized: any = {};
        for (const key in data) {
            const val = sanitizeData(data[key]);
            if (val !== undefined) {
                sanitized[key] = val;
            }
        }
        return sanitized;
    }
    return data;
};

// Function to update user profile in Firestore
export const updateUserProfile = async (uid: string, data: Partial<UserData>) => {
    try {
        const userRef = db.collection('users').doc(uid);
        const cleanData = sanitizeData(data);
        await userRef.set(cleanData, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const getUserByUsername = async (username: string): Promise<Creator | null> => {
    try {
        const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { ...doc.data(), uid: doc.id } as Creator;
    } catch (error) {
        console.error("Error fetching user by username:", error);
        return null;
    }
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
        return snapshot.empty;
    } catch (error) {
        console.error("Error checking username availability:", error);
        return false;
    }
};

// Function to delete a user
export const deleteUser = async (uid: string) => {
    try {
        await db.collection('users').doc(uid).delete();
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export const getChatId = (uid1: string, uid2: string) => uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

export const sendMessage = async (chatId: string, message: Partial<Message>) => {
    try {
        const messagesRef = db.collection('chats').doc(chatId).collection('messages');
        const newMessage = { ...message, timestamp: serverTimestamp(), status: 'sent' };
        await messagesRef.add(newMessage);
        await db.collection('chats').doc(chatId).set({
            lastMessage: {
                text: message.type === 'image' ? 'Sent an image' : (message.type === 'system' ? 'System Notification' : message.text),
                timestamp: serverTimestamp(),
                senderId: message.senderId,
            },
            participantIds: chatId.split('_'),
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Send message error:", error);
    }
};

export const getMessagesStream = (chatId: string, callback: (messages: Message[]) => void) => {
    const q = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc');
    return q.onSnapshot((snapshot) => {
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Handle null timestamp during local latency compensation
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
            } as Message;
        });
        callback(messages);
    });
};

export const getChatsStream = (userId: string, callback: (chats: ChatSummary[]) => void) => {
    const q = db.collection('chats').where('participantIds', 'array-contains', userId);
    return q.onSnapshot(async (snapshot) => {
        const results = await Promise.all(snapshot.docs.map(async (chatDoc) => {
            const data = chatDoc.data();
            const partnerId = data.participantIds.find((id: string) => id !== userId);
            let partner = { uid: partnerId, displayName: 'Creator', photoURL: '' } as Creator;
            if (partnerId) {
                const userDoc = await db.collection('users').doc(partnerId).get();
                const userData = userDoc.data();
                if (userDoc.exists && userData) {
                    partner = { ...userData, uid: userDoc.id } as Creator;
                }
            }
            // Parse lastRead timestamps
            const lastRead: { [uid: string]: Date } = {};
            if (data.lastRead) {
                for (const [uid, ts] of Object.entries(data.lastRead)) {
                    lastRead[uid] = (ts as any)?.toDate ? (ts as any).toDate() : new Date(ts as any);
                }
            }

            return {
                id: chatDoc.id,
                participantIds: data.participantIds,
                lastMessage: {
                    ...data.lastMessage,
                    // Handle null timestamp
                    timestamp: data.lastMessage?.timestamp ? data.lastMessage.timestamp.toDate() : new Date(),
                },
                partner,
                lastRead
            } as ChatSummary;
        }));
        results.sort((a, b) => (b.lastMessage?.timestamp?.getTime() || 0) - (a.lastMessage?.timestamp?.getTime() || 0));
        callback(results);
    });
};

export const markChatAsRead = async (chatId: string, userId: string) => {
    try {
        await db.collection('chats').doc(chatId).update({
            [`lastRead.${userId}`]: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error marking chat as read:', error);
    }
};

export const getCollaborationsStream = (userId: string, callback: (collaborations: Collaboration[]) => void) => {
    const q = db.collection('collaborations').where('participantIds', 'array-contains', userId);
    return q.onSnapshot((snapshot) => {
        const collabs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date())
            } as Collaboration;
        });
        callback(collabs);
    });
};

export const uploadChatImage = async (chatId: string, file: File): Promise<string> => {
    const path = `chats/${chatId}/${Date.now()}.jpg`;
    const storageRef = storage.ref(path);
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
};

export const finalizeCollaborationWithLink = async (collabId: string, link: string, participants: string[], projectTitle: string, partnerNameMap: Record<string, string>) => {
    await db.runTransaction(async (transaction) => {
        const collabRef = db.collection('collaborations').doc(collabId);

        // 1. READS MUST COME FIRST
        // Fetch user documents to get current pastCollaborations
        const userDocsData = await Promise.all(participants.map(async (uid) => {
            const userRef = db.collection('users').doc(uid);
            const userDoc = await transaction.get(userRef);
            return { uid, userRef, userDoc };
        }));

        // 2. WRITES
        // Update collaboration status
        transaction.update(collabRef, { status: 'completed', finalLink: link });

        // Update users
        for (const { uid, userRef, userDoc } of userDocsData) {
            if (userDoc.exists) {
                const partnerId = participants.find(p => p !== uid) || 'Partner';

                // Find partner entry to get their photoURL
                const partnerEntry = userDocsData.find(e => e.uid === partnerId);
                const partnerPhoto = partnerEntry?.userDoc.exists
                    ? partnerEntry.userDoc.data()?.photoURL
                    // Use a generic avatar fallback if partner photo is missing to look cleaner
                    : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

                const current = userDoc.data()?.pastCollaborations || [];

                const newCollabEntry = {
                    id: collabId,
                    title: projectTitle,
                    partnerName: partnerNameMap[partnerId] || 'Partner',
                    description: `Project Completed. Watch here: ${link}`,
                    imageUrl: partnerPhoto, // Store partner photo
                    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    link: link // Explicitly save the link field
                };

                transaction.update(userRef, {
                    pastCollaborations: [newCollabEntry, ...current]
                });
            }
        }
    });
};

export const sendCollabRequest = async (receiverId: string, request: any) => {
    const requestsRef = db.collection('requests');
    await requestsRef.add({
        ...request,
        receiverId,
        status: 'pending',
        timestamp: serverTimestamp()
    });
};

export const getCollabRequestsStream = (userId: string, callback: (requests: CollabRequest[]) => void) => {
    const q = db.collection('requests').where('receiverId', '==', userId).where('status', '==', 'pending');
    return q.onSnapshot((snapshot) => {
        const requests = snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data } as CollabRequest;
        });
        callback(requests);
    });
};

export const getSentCollabRequestsStream = (userId: string, callback: (requests: CollabRequest[]) => void) => {
    const q = db.collection('requests').where('senderId', '==', userId).where('status', '==', 'pending');
    return q.onSnapshot((snapshot) => {
        const requests = snapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, ...data } as CollabRequest;
        });
        callback(requests);
    });
};

export const deleteCollabRequest = async (userId: string, requestId: string) => {
    await db.collection('requests').doc(requestId).delete();
};

export const acceptCollabRequest = async (currentUser: UserData, request: CollabRequest) => {
    await db.runTransaction(async (transaction) => {
        // 1. Create the new collaboration document
        const newCollabRef = db.collection('collaborations').doc();
        transaction.set(newCollabRef, {
            id: newCollabRef.id,
            participantIds: [currentUser.uid, request.senderId],
            participants: {
                [currentUser.uid]: { displayName: currentUser.displayName, photoURL: currentUser.photoURL },
                [request.senderId]: { displayName: request.senderName, photoURL: request.senderPhoto }
            },
            projectName: request.projectName,
            description: request.description,
            status: 'active',
            createdAt: serverTimestamp(),
            ratedBy: []
        });

        // 2. Delete the request
        transaction.delete(db.collection('requests').doc(request.id));

        // 3. Increment 'collabs' count for BOTH users AND Add to Calendar
        const currentUserRef = db.collection('users').doc(currentUser.uid);
        const senderUserRef = db.collection('users').doc(request.senderId);

        // Create a calendar event object
        // For simplicity in this automated flow, we set the date to tomorrow or use current time if not parsed
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 1); // Default to tomorrow for planning

        const newCalendarEvent: CalendarEvent = {
            id: `collab-${newCollabRef.id}`,
            title: `Project: ${request.projectName}`,
            date: eventDate,
            type: 'collab',
            description: `Collaboration with ${request.senderName || 'Partner'}. ${request.description || ''}`
        };

        // Since we don't know the Sender's description of us easily without a read, 
        // we'll genericize the sender's event description slightly or mirror it.
        const senderCalendarEvent: CalendarEvent = {
            ...newCalendarEvent,
            description: `Collaboration with ${currentUser.displayName}. ${request.description || ''}`
        };

        transaction.update(currentUserRef, {
            collabs: increment(1),
            schedule: arrayUnion(newCalendarEvent)
        });

        transaction.update(senderUserRef, {
            collabs: increment(1),
            schedule: arrayUnion(senderCalendarEvent)
        });
    });
};

export const updateCollaborationStatus = async (collabId: string, status: 'active' | 'completed') => {
    await db.collection('collaborations').doc(collabId).update({ status });
};

export const submitRatingAndUpdateProfile = async (data: any) => {
    // CRITICAL: All Reads MUST come before Writes in a Firestore Transaction.
    await db.runTransaction(async (transaction) => {
        // --- READ OPERATIONS ---

        // 1. Get User Profile to update rating average
        const userRef = db.collection('users').doc(data.ratedUserId);
        const userDoc = await transaction.get(userRef);

        // 2. Get Rater Profile for notification details
        const raterRef = db.collection('users').doc(data.raterId);
        const raterDoc = await transaction.get(raterRef);

        // --- WRITE OPERATIONS ---

        // 1. Create rating doc
        const ratingRef = db.collection('ratings').doc();
        transaction.set(ratingRef, { ...data, timestamp: serverTimestamp() });

        // 2. Mark collab as rated by this user
        const collabRef = db.collection('collaborations').doc(data.collabId);
        transaction.update(collabRef, { ratedBy: arrayUnion(data.raterId) });

        // 3. Update the profile of the person BEING rated
        if (userDoc.exists) {
            const userData = userDoc.data();
            const currentRating = userData?.rating || 0;
            const currentCount = userData?.ratingCount || 0;

            const newCount = currentCount + 1;
            // Calculate new running average
            // If currentRating is NaN for some reason, default to 0
            const safeCurrentRating = isNaN(currentRating) ? 0 : currentRating;
            const newRating = ((safeCurrentRating * currentCount) + data.ratingValue) / newCount;

            transaction.update(userRef, {
                rating: newRating,
                ratingCount: newCount
            });
        }

        // 4. Create Notification for the Recipient
        const raterName = raterDoc.exists ? raterDoc.data()?.displayName : 'Unknown';
        const raterPhoto = raterDoc.exists ? raterDoc.data()?.photoURL : '';

        const notificationRef = db.collection('notifications').doc();
        transaction.set(notificationRef, {
            userId: data.ratedUserId,
            type: 'rating_received',
            title: 'New Review Received!',
            message: `${raterName} has rated your collaboration.`,
            data: {
                collabId: data.collabId,
                raterId: data.raterId,
                raterName: raterName,
                raterPhoto: raterPhoto
            },
            read: false,
            timestamp: serverTimestamp()
        });
    });
};

// Add this to fetch ratings for a specific user
export const getRatingsStream = (userId: string, callback: (ratings: any[]) => void) => {
    // REMOVED orderBy('timestamp') to prevent "Missing Index" error.
    // Sorting is done client-side.
    const q = db.collection('ratings').where('ratedUserId', '==', userId);

    return q.onSnapshot(async (snapshot) => {
        const ratings = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            // Fetch rater info for display
            let raterName = 'Unknown';
            let raterPhoto = '';
            if (data.raterId) {
                try {
                    const raterDoc = await db.collection('users').doc(data.raterId).get();
                    if (raterDoc.exists) {
                        raterName = raterDoc.data()?.displayName || 'Unknown';
                        raterPhoto = raterDoc.data()?.photoURL || '';
                    }
                } catch (e) {
                    // Ignore errors fetching rater info
                }
            }

            return {
                id: doc.id,
                ...data,
                raterName,
                raterPhoto,
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
            };
        }));

        // Client-side sort descending
        ratings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        callback(ratings);
    });
};

export const getNotificationsStream = (userId: string, callback: (notifications: AppNotification[]) => void) => {
    const q = db.collection('notifications')
        .where('userId', '==', userId)
        // .where('read', '==', false) // Optional: only fetch unread if desired
        .limit(20);

    return q.onSnapshot((snapshot) => {
        const notifications = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
            } as AppNotification;
        });
        // Sort client-side
        notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        callback(notifications);
    });
};

export const markNotificationRead = async (notificationId: string) => {
    await db.collection('notifications').doc(notificationId).update({ read: true });
};

export const markAllNotificationsRead = async (userId: string) => {
    const snapshot = await db.collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();

    if (snapshot.empty) return;

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
    });
    await batch.commit();
};


export const submitFeedback = async (data: any) => {
    await db.collection('feedback').add({ ...data, timestamp: serverTimestamp() });
};

export const uploadProfileImage = async (userId: string, file: File, type: 'profile' | 'cover' | 'collab'): Promise<string> => {
    const path = `users/${userId}/${type}_${Date.now()}.jpg`;
    const storageRef = storage.ref(path);
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
};

// New functions for saving/unsaving profiles
export const toggleSaveProfile = async (currentUserId: string, targetUserId: string, isSaved: boolean) => {
    const userRef = db.collection('users').doc(currentUserId);
    if (isSaved) {
        await userRef.update({
            savedProfiles: arrayRemove(targetUserId)
        });
    } else {
        await userRef.update({
            savedProfiles: arrayUnion(targetUserId)
        });
    }
};

export const getSavedCreators = async (savedIds: string[]): Promise<Creator[]> => {
    if (!savedIds || savedIds.length === 0) return [];
    try {
        const creators = await Promise.all(savedIds.map(async (uid) => {
            const doc = await db.collection('users').doc(uid).get();
            return doc.exists ? { ...doc.data(), uid: doc.id } as Creator : null;
        }));
        return creators.filter((c): c is Creator => c !== null);
    } catch (error) {
        console.error("Error fetching saved creators:", error);
        return [];
    }
};

// Admin Subscriptions
export const subscribeToAllUsers = (callback: (users: Creator[]) => void) => {
    return db.collection('users').onSnapshot(snapshot => {
        const users = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as Creator));
        callback(users);
    });
};

export const subscribeToAllCollabs = (callback: (collabs: Collaboration[]) => void) => {
    return db.collection('collaborations').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const collabs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
            } as Collaboration;
        });
        callback(collabs);
    });
};

export const subscribeToAllFeedback = (callback: (feedback: Feedback[]) => void) => {
    return db.collection('feedback').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        const feedback = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
            } as Feedback;
        });
        callback(feedback);
    });
};
// Data Migration / Reset
export const resetUserDatabase = async (newUsers: Creator[]) => {
    // 1. Delete all existing users
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();

    const batchSize = 500; // Firestore batch limit
    let batch = db.batch();
    let count = 0;

    // Delete existing
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
        if (count >= batchSize) {
            batch.commit();
            batch = db.batch();
            count = 0;
        }
    });

    if (count > 0) {
        await batch.commit();
    }

    // 2. Add new users
    // Reset batch for writes
    batch = db.batch();
    count = 0;

    newUsers.forEach((user) => {
        const docRef = usersRef.doc(user.uid);
        // Ensure critical fields are present
        const userData = {
            ...user,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            rating: 0,
            ratingCount: 0,
            followers: 0,
            following: 0,
            collabs: 0,
            isInstagramVerified: true // Default for seed data as requested
        };
        batch.set(docRef, userData);
        count++;
        if (count >= batchSize) {
            batch.commit();
            batch = db.batch();
            count = 0;
        }
    });

    if (count > 0) {
        await batch.commit();
    }
};

// ======= BLOG FUNCTIONS =======

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = db.collection('blogPosts').doc();
    const data = {
        ...post,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    await docRef.set(data);
    return docRef.id;
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>) => {
    const cleanData = sanitizeData({ ...data, updatedAt: serverTimestamp() });
    await db.collection('blogPosts').doc(id).update(cleanData);
};

export const deleteBlogPost = async (id: string) => {
    await db.collection('blogPosts').doc(id).delete();
};

export const subscribeToAllBlogPosts = (callback: (posts: BlogPost[]) => void) => {
    return db.collection('blogPosts').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
                publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : null,
            } as BlogPost;
        });
        callback(posts);
    });
};

export const getPublishedBlogPosts = (callback: (posts: BlogPost[]) => void) => {
    return db.collection('blogPosts')
        .where('status', '==', 'published')
        .orderBy('publishedAt', 'desc')
        .onSnapshot(snapshot => {
            const posts = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
                    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : null,
                } as BlogPost;
            });
            callback(posts);
        });
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const snapshot = await db.collection('blogPosts')
            .where('slug', '==', slug)
            .where('status', '==', 'published')
            .limit(1)
            .get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
            publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : null,
        } as BlogPost;
    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return null;
    }
};

export const uploadBlogImage = async (file: File): Promise<string> => {
    const path = `blog/${Date.now()}_${file.name}`;
    const storageRef = storage.ref(path);
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
};
