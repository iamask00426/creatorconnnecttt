import React, { useState, useCallback, ReactNode, ErrorInfo, useEffect } from 'react';
import type { UserData, Creator } from './types.ts';
import { MainApp } from './components/MainApp.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { WelcomeScreens } from './components/WelcomeScreens.tsx';
import { VerificationModal } from './components/modals/VerificationModal.tsx';
import { updateUserProfile, auth, db, getUserByUsername } from './services/firebase.ts';
import { AuthScreen } from './components/AuthScreen.tsx';
import { OnboardingFlow } from './components/OnboardingFlow.tsx';
import { PendingApprovalScreen } from './components/PendingApprovalScreen.tsx';
import { BoltIcon } from './components/icons.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { BlogPage } from './components/BlogPage.tsx';
import { CreatorProfilePage } from './components/screens/CreatorProfilePage.tsx'; // Import for public view

// Base template for new users
const baseNewUser: Partial<UserData> = {
    displayName: 'New Creator',
    email: '',
    photoURL: '',
    niche: 'General',
    followerCount: 0,
    bio: '',
    openToCollab: true,
    location: '',
    instagram: '',
    instagramVerified: false,
    youtube: '',
    tiktok: '',
    twitter: '',
    snapchat: '',
    portfolio: [],
    pastCollaborations: [],
    schedule: [],
    savedProfiles: [],
    createdAt: new Date(),
    lat: 0,
    lng: 0,
    collabs: 0,
    rating: 0,
    ratingCount: 0,
    profileStatus: 'onboarding', // Default for new users
    username: ''
};

// Mock Data for Demo Login (Bypasses verification)
const mockDemoUser: UserData = {
    ...baseNewUser,
    uid: 'mock-user-123',
    displayName: 'Alex Chen',
    email: 'alex.chen@example.com',
    niche: 'Tech Reviewer',
    followerCount: 45200,
    bio: 'Tech enthusiast and digital storyteller based in San Francisco. Exploring the future of creation.',
    location: 'San Francisco, USA',
    instagram: 'alexcreatives',
    instagramVerified: true,
    youtube: 'alexchentech',
    portfolio: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ],
    lat: 37.7749,
    lng: -122.4194,
    collabs: 12,
    rating: 4.9,
    ratingCount: 8,
    profileStatus: 'active'
} as UserData;

interface EBProps {
    children?: ReactNode;
}

interface EBState {
    hasError: boolean;
    errorMessage: string;
    errorStack?: string;
}

class ErrorBoundary extends React.Component<EBProps, EBState> {
    public state: EBState;
    readonly props: Readonly<EBProps>;

    constructor(props: EBProps) {
        super(props);
        this.props = props;
        this.state = { hasError: false, errorMessage: "" };
    }

    static getDerivedStateFromError(error: Error): EBState {
        return { hasError: true, errorMessage: error.message, errorStack: error.stack };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught an error", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full flex flex-col p-8 bg-slate-50 font-mono text-xs overflow-auto z-[99999] relative">
                    <h1 className="text-red-600 font-bold mb-4 text-sm">SYSTEM CRASH</h1>
                    <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm mb-4">
                        <p className="font-bold text-slate-900 mb-2">Error Message:</p>
                        <p className="text-red-500">{this.state.errorMessage}</p>
                    </div>
                    <div className="bg-slate-100 p-4 rounded-xl overflow-auto max-h-40">
                        <pre className="text-[10px] text-slate-500 whitespace-pre-wrap">{this.state.errorStack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 p-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        Reboot System
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const SplashScreen = () => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <div className="relative mb-6">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse"></div>

            {/* Logo Container - Orange Gradient */}
            <div className="w-28 h-28 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-rose-500/30 relative z-10 animate-bounce">
                <BoltIcon className="w-14 h-14 text-white" />
            </div>
        </div>

        {/* Creator Connect Name */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 animate-pulse">
            Creator Connect
        </h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Initializing...
        </p>
    </div>
);

const App: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [authUserId, setAuthUserId] = useState<string | null>(null);
    const [showLanding, setShowLanding] = useState(() => window.location.pathname !== '/dashboard');
    const [showWelcomeScreens, setShowWelcomeScreens] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Global Verification Modal (e.g. triggered from profile)
    const [showVerification, setShowVerification] = useState(false);
    const [showAdmin, setShowAdmin] = useState(() => window.location.pathname === '/admin');

    // Unique Link State
    const [viewingUniqueProfile, setViewingUniqueProfile] = useState<Creator | null>(null);

    // Hash-based blog routing
    const [blogRoute, setBlogRoute] = useState<{ active: boolean; slug?: string }>(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#/blog/')) return { active: true, slug: hash.slice(7) };
        if (hash === '#/blog') return { active: true };
        return { active: false };
    });

    useEffect(() => {
        const checkUniqueLink = async () => {
            const path = window.location.pathname;
            // Ignore standard routes
            if (path === '/' || path === '/dashboard' || path === '/admin' || path.startsWith('/static')) {
                setViewingUniqueProfile(null);
                return;
            }

            // Assume path is /username
            const username = path.substring(1); // Remove leading slash
            if (username) {
                const user = await getUserByUsername(username);
                if (user) {
                    setViewingUniqueProfile(user);
                    setShowLanding(false); // Hide landing if valid profile found
                }
            }
        };

        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/blog/')) setBlogRoute({ active: true, slug: hash.slice(7) });
            else if (hash === '#/blog') setBlogRoute({ active: true });
            else setBlogRoute({ active: false });
        };
        const handlePopState = () => {
            const path = window.location.pathname;
            setShowAdmin(path === '/admin');

            // Re-run unique link check on popstate
            checkUniqueLink();

            // Only show landing if NOT admin, NOT dashboard, and NOT viewing a unique profile (checked above)
            if (path !== '/dashboard' && path !== '/admin' && path === '/') {
                setShowLanding(true);
                setViewingUniqueProfile(null);
            }

            handleHashChange();
        };

        // Check on mount
        checkUniqueLink();

        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setAuthUserId(user.uid);
                // Returning user — navigate to dashboard
                if (window.location.pathname !== '/admin') {
                    window.history.replaceState({}, '', '/dashboard');
                }
                setShowLanding(false);
                setShowWelcomeScreens(false);
            } else {
                setAuthUserId(null);
                setUserData(null);
                setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!authUserId) {
            setIsLoading(false);
            return;
        }

        if (authUserId === 'mock-user-123') {
            setUserData(mockDemoUser);
            setIsLoading(false);
            return;
        }

        const unsubscribeSnapshot = db.collection('users').doc(authUserId).onSnapshot(async (doc) => {
            if (doc.exists) {
                const data = doc.data();

                // DATA SANITIZATION: Convert Timestamps to Dates
                const schedule = (data?.schedule || []).map((event: any) => ({
                    ...event,
                    date: event.date?.toDate ? event.date.toDate() : (new Date(event.date || Date.now()))
                }));

                const createdAt = data?.createdAt?.toDate ? data.createdAt.toDate() : new Date();

                setUserData({
                    savedProfiles: [],
                    ...data,
                    uid: doc.id,
                    schedule,
                    createdAt
                } as UserData);
                setIsLoading(false);
            } else {
                // New User Creation
                const user = auth.currentUser;
                if (user) {
                    const newProfile: UserData = {
                        ...baseNewUser,
                        uid: user.uid,
                        email: user.email || '',
                        displayName: user.displayName || 'New Creator',
                        createdAt: new Date(),
                        profileStatus: 'onboarding' // Set to onboarding initially
                    } as UserData;

                    await updateUserProfile(user.uid, newProfile);
                    // Snapshot will trigger update
                }
            }
        }, (error) => {
            console.error("User data stream error:", error);
            setIsLoading(false);
        });

        return () => unsubscribeSnapshot();
    }, [authUserId]);

    const handleUpdateUserData = useCallback(async (data: Partial<UserData>) => {
        if (!userData) return;

        // Optimistic update
        setUserData(prev => prev ? ({ ...prev, ...data }) : null);

        if (authUserId && authUserId !== 'mock-user-123') {
            try {
                await updateUserProfile(userData.uid, data);
            } catch (error) {
                console.error("Could not save profile changes:", error);
            }
        }
    }, [userData, authUserId]);

    const handleLandingComplete = () => {
        window.history.pushState({}, '', '/dashboard');
        setShowLanding(false);
        setShowWelcomeScreens(true);
    };

    const handleWelcomeComplete = () => {
        setShowWelcomeScreens(false);
        // If no user is logged in (e.g. skipped intro), create a guest user to trigger onboarding
        if (!authUserId) {
            const guestUser: UserData = {
                ...baseNewUser,
                uid: `guest-${Date.now()}`,
                profileStatus: 'onboarding'
            } as UserData;
            setUserData(guestUser);
        }
    };

    const handleVerificationClose = () => {
        setShowVerification(false);
    };

    const handleVerificationSuccess = (verifiedUsername: string) => {
        handleUpdateUserData({
            instagram: verifiedUsername,
            instagramVerified: true
        });
    };

    const handleLogout = () => {
        setUserData(null);
        setAuthUserId(null);
        auth.signOut().catch(e => console.error("Sign out error", e));
        setShowLanding(true);
        setShowWelcomeScreens(false);
    };



    const handleRefreshPending = () => {
        window.location.reload();
    };



    if (isLoading) {
        return <SplashScreen />;
    }

    // Unique Link View - Renders independent of auth state
    if (viewingUniqueProfile) {
        return (
            <div className="bg-slate-50 min-h-screen">
                <CreatorProfilePage
                    currentUser={userData || ({} as UserData)} // Pass empty/generic user if not logged in
                    creator={viewingUniqueProfile}
                    onBack={() => {
                        window.history.pushState({}, '', '/');
                        setViewingUniqueProfile(null);
                        setShowLanding(true);
                    }}
                    onMessage={() => {
                        // Redirect to login or handle open chat if logged in
                        if (!userData) {
                            window.history.pushState({}, '', '/');
                            setViewingUniqueProfile(null);
                            setShowLanding(true);
                        }
                    }}
                    onViewProfile={() => { }} // No-op for public view or implement navigation
                    onUpdateUserData={() => { }} // Read-only view
                />
            </div>
        );
    }

    if (showAdmin) {
        return <AdminDashboard onBack={() => { window.history.pushState({}, '', '/dashboard'); setShowAdmin(false); setShowLanding(false); }} />;
    }

    if (blogRoute.active) {
        return <BlogPage slug={blogRoute.slug} onNavigateHome={() => { window.location.hash = ''; setBlogRoute({ active: false }); }} />;
    }

    // Check if we should show the phone frame (not on landing or welcome screens)
    const isInAppView = !showLanding && !showWelcomeScreens;

    const appContent = (
        <>
            {showWelcomeScreens ? (
                <WelcomeScreens
                    onComplete={handleWelcomeComplete}
                    onStartVerification={() => { }}
                />
            ) : !userData ? (
                <AuthScreen />
            ) : userData.profileStatus === 'onboarding' ? (
                <OnboardingFlow
                    userData={userData}
                    onComplete={handleUpdateUserData}
                />
            ) : userData.profileStatus === 'pending' ? (
                <PendingApprovalScreen
                    userData={userData}
                    onRefresh={handleRefreshPending}
                />
            ) : (
                <MainApp
                    userData={userData}
                    onUpdateUserData={handleUpdateUserData}
                    onLogout={handleLogout}
                    isGlobalModalOpen={showVerification}
                />
            )}

            {userData && !userData.instagramVerified && userData.profileStatus === 'active' && (
                <VerificationModal
                    isOpen={showVerification}
                    onClose={handleVerificationClose}
                    onVerifySuccess={handleVerificationSuccess}
                    initialUsername={userData?.instagram}
                />
            )}
        </>
    );

    return (
        <>
            <ErrorBoundary>
                {showLanding ? (
                    <LandingPage
                        onGetStarted={handleLandingComplete}
                    />
                ) : (
                    <div className="phone-frame-wrapper">
                        <div className="phone-mockup">
                            {appContent}
                        </div>
                    </div>
                )}
            </ErrorBoundary>


        </>
    );
};

export default App;
