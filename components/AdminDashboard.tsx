import React, { useEffect, useState, useRef } from 'react';
import {
    updateUserProfile,
    subscribeToAllUsers,
    subscribeToAllCollabs,
    subscribeToAllFeedback,
    resetUserDatabase,
    deleteUser,
    subscribeToAllBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    uploadBlogImage
} from '../services/firebase';
import { SEED_USERS } from '../utils/seedData';
import type { Creator, Collaboration, Feedback, BlogPost } from '../types';
import { UserEditModal } from './modals/UserEditModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type AdminTab = 'overview' | 'users' | 'collabs' | 'feedback' | 'blog';

const COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // Admin Auth State
    const [isAdminAuth, setIsAdminAuth] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [users, setUsers] = useState<Creator[]>([]);
    const [collabs, setCollabs] = useState<Collaboration[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [userFilter, setUserFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const correctUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
        const correctPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';
        if (loginUsername === correctUser && loginPassword === correctPass) {
            setIsAdminAuth(true);
            setLoginError('');
        } else {
            console.log('Login failed. Environment Check:', {
                hasUser: !!correctUser,
                hasPass: !!correctPass,
                userLength: correctUser?.length,
                passLength: correctPass?.length
            });
            setLoginError('Invalid username or password');
            setLoginPassword('');
        }
    };

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<Creator | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Blog State
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [showBlogEditor, setShowBlogEditor] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [blogForm, setBlogForm] = useState({
        title: '', slug: '', excerpt: '', content: '', coverImageUrl: '', author: 'CreatorConnect Team', tags: '', status: 'draft' as 'draft' | 'published'
    });
    const [blogImageUploading, setBlogImageUploading] = useState(false);
    const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
    const [editorFullscreen, setEditorFullscreen] = useState(false);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // Insert markdown at cursor position
    const insertAtCursor = (before: string, after: string = '', placeholder: string = '') => {
        const textarea = contentRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = blogForm.content;
        const selected = text.substring(start, end);
        const insert = selected || placeholder;
        const newText = text.substring(0, start) + before + insert + after + text.substring(end);
        setBlogForm(prev => ({ ...prev, content: newText }));
        // Restore cursor position after state update
        setTimeout(() => {
            textarea.focus();
            const cursorPos = start + before.length + insert.length;
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);
    };

    useEffect(() => {
        const unsubscribeUsers = subscribeToAllUsers((data) => {
            setUsers(data);
            setLoading(false);
        });
        const unsubscribeCollabs = subscribeToAllCollabs((data) => setCollabs(data));
        const unsubscribeFeedback = subscribeToAllFeedback((data) => setFeedback(data));
        const unsubscribeBlog = subscribeToAllBlogPosts((data) => setBlogPosts(data));

        return () => {
            unsubscribeUsers();
            unsubscribeCollabs();
            unsubscribeFeedback();
            unsubscribeBlog();
        };
    }, []);

    // Login gate — MUST be after all hooks
    if (!isAdminAuth) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '40px',
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 900,
                            color: 'white',
                            margin: '0 0 4px',
                            letterSpacing: '-0.5px',
                        }}>Admin Panel</h1>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.5)',
                            margin: 0,
                        }}>Sign in to access the dashboard</p>
                    </div>

                    <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '6px',
                            }}>Username</label>
                            <input
                                type="text"
                                value={loginUsername}
                                onChange={e => setLoginUsername(e.target.value)}
                                placeholder="Enter username"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    background: 'rgba(255,255,255,0.08)',
                                    color: 'white',
                                    fontSize: '15px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'rgba(255,255,255,0.6)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '6px',
                            }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    placeholder="Enter password"
                                    style={{
                                        width: '100%',
                                        padding: '12px 48px 12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        background: 'rgba(255,255,255,0.08)',
                                        color: 'white',
                                        fontSize: '15px',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.4)',
                                        padding: '4px',
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: '10px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#fca5a5',
                                fontSize: '13px',
                                fontWeight: 600,
                            }}>{loginError}</div>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                marginTop: '8px',
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Sign In
                        </button>
                    </form>

                    <button
                        onClick={onBack}
                        style={{
                            display: 'block',
                            width: '100%',
                            marginTop: '16px',
                            padding: '10px',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.4)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                        }}
                    >
                        ← Back to Platform
                    </button>
                </div>
            </div>
        );
    }

    const handleStatusUpdate = async (uid: string, status: 'active' | 'rejected' | 'pending') => {
        if (!uid) return;
        try {
            await updateUserProfile(uid, { profileStatus: status });
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const handleDeleteUser = async (uid: string) => {
        if (!uid) return;
        if (window.confirm("Are you sure you want to DELETE this user? This action cannot be undone.")) {
            try {
                await deleteUser(uid);
                // Optimistic update
                setUsers(prev => prev.filter(u => u.uid !== uid));
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleEditClick = (user: Creator) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleSaveUser = (updatedUser: Creator) => {
        // Optimistic update (real-time listener will also update, but this feels faster)
        setUsers(prev => prev.map(u => u.uid === updatedUser.uid ? updatedUser : u));
    };

    const handleResetDatabase = async () => {
        if (window.confirm("CRITICAL WARNING: This will DELETE ALL USERS and replace them with the seed data. Are you sure?")) {
            setLoading(true);
            try {
                console.log("Calling resetUserDatabase...");
                await resetUserDatabase(SEED_USERS);
                console.log("Reset returned success.");
                alert("Database reset successful. Please refresh the page if data doesn't update immediately.");
            } catch (error) {
                console.error("Reset failed:", error);
                alert("Reset failed. Check console for details.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Blog Handlers
    const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const handleBlogFormChange = (field: string, value: string) => {
        const update: any = { [field]: value };
        if (field === 'title') update.slug = generateSlug(value);
        setBlogForm(prev => ({ ...prev, ...update }));
    };

    const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBlogImageUploading(true);
        try {
            const url = await uploadBlogImage(file);
            setBlogForm(prev => ({ ...prev, coverImageUrl: url }));
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('Failed to upload image.');
        } finally {
            setBlogImageUploading(false);
        }
    };

    const handleSaveBlogPost = async () => {
        if (!blogForm.title.trim() || !blogForm.content.trim()) {
            alert('Title and content are required.');
            return;
        }
        try {
            const postData = {
                title: blogForm.title,
                slug: blogForm.slug || generateSlug(blogForm.title),
                excerpt: blogForm.excerpt,
                content: blogForm.content,
                coverImageUrl: blogForm.coverImageUrl,
                author: blogForm.author,
                status: blogForm.status,
                tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                publishedAt: blogForm.status === 'published' ? new Date() : null,
            };
            if (editingPost) {
                await updateBlogPost(editingPost.id, postData);
            } else {
                await createBlogPost(postData);
            }
            resetBlogEditor();
        } catch (err) {
            console.error('Blog save error:', err);
            alert('Failed to save blog post.');
        }
    };

    const handleEditBlogPost = (post: BlogPost) => {
        setEditingPost(post);
        setBlogForm({
            title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content,
            coverImageUrl: post.coverImageUrl, author: post.author, tags: post.tags.join(', '), status: post.status
        });
        setShowBlogEditor(true);
    };

    const handleDeleteBlogPost = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            await deleteBlogPost(id);
        }
    };

    const handleTogglePublish = async (post: BlogPost) => {
        const newStatus = post.status === 'published' ? 'draft' : 'published';
        await updateBlogPost(post.id, {
            status: newStatus,
            publishedAt: newStatus === 'published' ? new Date() : null,
        });
    };

    const resetBlogEditor = () => {
        setShowBlogEditor(false);
        setEditingPost(null);
        setBlogForm({ title: '', slug: '', excerpt: '', content: '', coverImageUrl: '', author: 'CreatorConnect Team', tags: '', status: 'draft' });
    };

    // Full Data Download
    const handleDownloadAllData = () => {
        try {
            const safeDate = (d: any) => {
                if (!d) return null;
                try { return d.toDate ? d.toDate().toISOString() : new Date(d).toISOString(); } catch { return null; }
            };

            const exportData = {
                exportedAt: new Date().toISOString(),
                platform: 'CreatorConnect',
                summary: {
                    totalUsers: users.length,
                    totalCollaborations: collabs.length,
                    totalFeedback: feedback.length,
                    totalBlogPosts: blogPosts.length,
                },
                users: users.map(u => ({
                    uid: u.uid,
                    displayName: u.displayName || '',
                    email: u.email || '',
                    niche: u.niche || '',
                    gender: (u as any).gender || '',
                    bio: u.bio || '',
                    instagram: u.instagram || '',
                    instagramVerified: u.instagramVerified || false,
                    followerCount: u.followerCount || 0,
                    location: u.location || '',
                    profileStatus: u.profileStatus || '',
                    collabs: u.collabs || 0,
                    rating: u.rating || 0,
                    ratingCount: u.ratingCount || 0,
                    createdAt: safeDate(u.createdAt),
                })),
                collaborations: collabs.map(c => ({
                    id: c.id,
                    projectName: c.projectName || '',
                    description: c.description || '',
                    status: c.status,
                    participantIds: c.participantIds || [],
                    participants: c.participants || {},
                    createdAt: safeDate(c.createdAt),
                })),
                feedback: feedback.map(f => ({
                    id: f.id,
                    type: f.type,
                    message: f.message || '',
                    displayName: f.displayName || '',
                    userId: f.userId || '',
                    userAgent: f.userAgent || '',
                    timestamp: safeDate(f.timestamp),
                })),
                blogPosts: blogPosts.map(b => ({
                    id: b.id,
                    title: b.title || '',
                    slug: b.slug || '',
                    excerpt: b.excerpt || '',
                    content: b.content || '',
                    author: b.author || '',
                    status: b.status,
                    tags: b.tags || [],
                    publishedAt: safeDate(b.publishedAt),
                })),
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ts = new Date().toISOString().slice(0, 10);
            a.href = url;
            a.download = `creatorconnect-data-${ts}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download data. Check console for details.');
        }
    };

    const handleDownloadCSV = () => {
        try {
            const safeDate = (d: any) => {
                if (!d) return '';
                try { return d.toDate ? d.toDate().toISOString() : new Date(d).toISOString(); } catch { return ''; }
            };

            const headers = ['UID', 'Display Name', 'Email', 'Niche', 'Gender', 'Instagram', 'Verified', 'Followers', 'Location', 'Status', 'Collabs', 'Rating', 'Created At'];
            const rows = users.map(u => [
                u.uid || '',
                u.displayName || '',
                u.email || '',
                u.niche || '',
                (u as any).gender || '',
                u.instagram || '',
                u.instagramVerified ? 'Yes' : 'No',
                u.followerCount || 0,
                u.location || '',
                u.profileStatus || '',
                u.collabs || 0,
                u.rating || 0,
                safeDate(u.createdAt),
            ]);
            const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `creatorconnect-users-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('CSV download failed:', err);
            alert('Failed to download CSV. Check console for details.');
        }
    };


    const stats = {
        totalUsers: users.length,
        pendingUsers: users.filter(u => u.profileStatus === 'pending').length,
        activeUsers: users.filter(u => u.profileStatus === 'active').length,
        totalCollabs: collabs.length,
        activeCollabs: collabs.filter(c => c.status === 'active').length,
        totalFeedback: feedback.length
    };

    const filteredUsers = users.filter(u => {
        const matchesFilter = userFilter === 'all' || u.profileStatus === userFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            (u.displayName || '').toLowerCase().includes(searchLower) ||
            (u.email || '').toLowerCase().includes(searchLower) ||
            (u.niche || '').toLowerCase().includes(searchLower) ||
            (u.instagram || '').toLowerCase().includes(searchLower)
        );
        return matchesFilter && matchesSearch;
    });

    // Prepare Chart Data
    const statusData = [
        { name: 'Active', value: stats.activeUsers },
        { name: 'Pending', value: stats.pendingUsers },
        { name: 'Rejected', value: users.filter(u => u.profileStatus === 'rejected').length },
    ].filter(d => d.value > 0);

    const nicheCounts = users.reduce((acc, user) => {
        const niche = user.niche || 'Unknown';
        acc[niche] = (acc[niche] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const nicheData = Object.entries(nicheCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 niches

    const renderSidebar = () => (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xl font-black text-slate-900 tracking-tight">Admin<span className="text-violet-600">Panel</span></span>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {(['overview', 'users', 'collabs', 'feedback', 'blog'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                            ? 'bg-violet-50 text-violet-700 shadow-sm'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <span className="capitalize">{tab}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={onBack}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Exit Admin
                </button>
            </div>
        </aside>
    );

    const renderOverview = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Users</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-black text-slate-900">{stats.totalUsers}</p>
                        <span className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                            {stats.activeUsers} Active
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Collaborations</p>
                    <div className="flex items-end justify-between">
                        <p className="text-4xl font-black text-slate-900">{stats.totalCollabs}</p>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                            {stats.activeCollabs} Active
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Feedback</p>
                    <p className="text-4xl font-black text-slate-900">{stats.totalFeedback}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">User Status Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Top Creator Niches</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={nicheData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {nicheData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {stats.pendingUsers > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-amber-900">Pending Approvals</h3>
                            <p className="text-sm font-medium text-amber-700">There are {stats.pendingUsers} users waiting for verification.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { setActiveTab('users'); setUserFilter('pending'); }}
                        className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-colors"
                    >
                        Review Now
                    </button>
                </div>
            )}

            {/* Data Export Section */}
            <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-4">Data Export</h3>
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-3xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-slate-900 text-base">Download All Platform Data</h4>
                            <p className="text-sm text-slate-600 mt-1">Export users, collaborations, feedback, and blog posts.</p>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                                    {users.length} Users
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    {collabs.length} Collabs
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    {feedback.length} Feedback
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {blogPosts.length} Blog Posts
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownloadCSV}
                                className="px-5 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Users CSV
                            </button>
                            <button
                                onClick={handleDownloadAllData}
                                className="px-5 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Full JSON Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-black text-red-600 mb-4">Danger Zone</h3>
                <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-red-900">Reset Database</h4>
                        <p className="text-sm text-red-700 mt-1">This will delete all current users and replace them with the initial seed data.</p>
                    </div>
                    <button
                        onClick={handleResetDatabase}
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        Reset All Data
                    </button>
                </div>
            </div>

        </div>
    );

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">User Management</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 w-full sm:w-64"
                        />
                        <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto">
                        {(['all', 'pending', 'active', 'rejected'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setUserFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${userFilter === f
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">User</th>
                                <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Gender</th>
                                <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Contact</th>
                                <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(user => (
                                <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.photoURL || 'https://via.placeholder.com/40'}
                                                alt=""
                                                className="w-10 h-10 rounded-full object-cover bg-slate-200"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{user.displayName || 'Unnamed User'}</p>
                                                <p className="text-xs text-slate-500 font-medium">{user.niche || 'No Niche'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                            ${user.profileStatus === 'active' ? 'bg-green-100 text-green-700' :
                                                user.profileStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    user.profileStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-slate-100 text-slate-700'
                                            }`}>
                                            {user.profileStatus || 'unknown'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold text-slate-600 capitalize">{user.gender || '-'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-slate-600">{user.email}</p>
                                            {user.instagram && <p className="text-xs font-bold text-violet-600">@{user.instagram}</p>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-slate-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            {user.profileStatus !== 'active' && (
                                                <button onClick={() => handleStatusUpdate(user.uid, 'active')} className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-green-100">Approve</button>
                                            )}
                                            {user.profileStatus !== 'pending' && (
                                                <button onClick={() => handleStatusUpdate(user.uid, 'pending')} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-amber-100">Pending</button>
                                            )}
                                            {user.profileStatus !== 'rejected' && (
                                                <button onClick={() => handleDeleteUser(user.uid)} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-red-100">Delete</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400 font-bold text-sm">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderCollabs = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Collaborations</h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Project</th>
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {collabs.map(collab => (
                            <tr key={collab.id}>
                                <td className="p-4">
                                    <p className="font-bold text-slate-900">{collab.projectName}</p>
                                    <p className="text-xs text-slate-500">{collab.description}</p>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                            ${collab.status === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                                        {collab.status}
                                    </span>
                                </td>
                                <td className="p-4 text-xs font-bold text-slate-500">
                                    {collab.createdAt ? new Date(collab.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                        {collabs.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-slate-400 font-bold text-sm">No collaborations yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFeedback = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900">User Feedback</h2>
            <div className="grid gap-4">
                {feedback.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold uppercase
                                    ${item.type === 'bug' ? 'bg-red-50 text-red-700' :
                                        item.type === 'feature' ? 'bg-purple-50 text-purple-700' :
                                            'bg-slate-100 text-slate-700'}`}>
                                    {item.type}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-slate-900">{item.displayName}</p>
                        </div>
                        <p className="text-slate-700 text-sm">{item.message}</p>
                        <p className="mt-2 text-xs text-slate-400 font-mono">{item.userAgent}</p>
                    </div>
                ))}
                {feedback.length === 0 && (
                    <div className="p-12 text-center text-slate-400 font-bold bg-slate-100 rounded-3xl border border-dashed border-slate-300">
                        No feedback reports submitted.
                    </div>
                )}
            </div>
        </div>
    );

    const renderBlog = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Blog Management</h2>
                <button
                    onClick={() => { resetBlogEditor(); setShowBlogEditor(true); }}
                    className="px-6 py-2.5 bg-violet-600 text-white font-bold rounded-xl shadow-lg hover:bg-violet-700 transition-colors"
                >
                    + New Post
                </button>
            </div>

            {/* Blog Editor */}
            {showBlogEditor && (
                <div className={`bg-white border border-slate-200 shadow-xl space-y-0 transition-all duration-300 ${editorFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto' : 'rounded-3xl'}`}>
                    {/* Editor Top Bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="ml-2 text-sm font-black text-slate-700">{editingPost ? 'Edit Post' : 'New Post'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium mr-2">
                                {blogForm.content.trim().split(/\s+/).filter(Boolean).length} words · {blogForm.content.length} chars
                            </span>
                            <button onClick={() => setEditorFullscreen(!editorFullscreen)} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors" title={editorFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                                {editorFullscreen ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                )}
                            </button>
                            <button onClick={resetBlogEditor} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className={`${editorFullscreen ? 'max-w-5xl mx-auto' : ''} p-6 space-y-5`}>
                        {/* Title & Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title *</label>
                                <input
                                    type="text" value={blogForm.title}
                                    onChange={e => handleBlogFormChange('title', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-lg font-bold"
                                    placeholder="My Awesome Article"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">URL Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 font-mono">/blog/</span>
                                    <input
                                        type="text" value={blogForm.slug}
                                        onChange={e => handleBlogFormChange('slug', e.target.value)}
                                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-mono text-sm"
                                        placeholder="my-awesome-article"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Excerpt</label>
                            <input
                                type="text" value={blogForm.excerpt}
                                onChange={e => handleBlogFormChange('excerpt', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                placeholder="A short summary that appears in the blog listing..."
                                maxLength={200}
                            />
                            <p className="text-xs text-slate-400 mt-1 text-right">{blogForm.excerpt.length}/200</p>
                        </div>

                        {/* Content Editor with Toolbar */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            {/* Toolbar */}
                            <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1">
                                {/* Text Formatting */}
                                <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 mr-1">
                                    <button onClick={() => insertAtCursor('**', '**', 'bold text')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Bold (Ctrl+B)">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('*', '*', 'italic text')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Italic (Ctrl+I)">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('~~', '~~', 'strikethrough')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Strikethrough">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z" /></svg>
                                    </button>
                                </div>

                                {/* Headings */}
                                <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 mr-1">
                                    <button onClick={() => insertAtCursor('\n# ', '', 'Heading 1')} className="px-2 py-1 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all text-xs font-black" title="Heading 1">H1</button>
                                    <button onClick={() => insertAtCursor('\n## ', '', 'Heading 2')} className="px-2 py-1 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all text-xs font-bold" title="Heading 2">H2</button>
                                    <button onClick={() => insertAtCursor('\n### ', '', 'Heading 3')} className="px-1.5 py-1 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all text-xs font-semibold" title="Heading 3">H3</button>
                                </div>

                                {/* Lists & Structure */}
                                <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 mr-1">
                                    <button onClick={() => insertAtCursor('\n- ', '', 'List item')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Bullet List">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('\n1. ', '', 'List item')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Numbered List">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('\n> ', '', 'Quote text')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Blockquote">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                                    </button>
                                </div>

                                {/* Code & Media */}
                                <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200 mr-1">
                                    <button onClick={() => insertAtCursor('`', '`', 'code')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Inline Code">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('\n```\n', '\n```\n', 'code block')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Code Block">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13 7l-2 10" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('[', '](url)', 'link text')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Insert Link">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('![', '](image-url)', 'alt text')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Insert Image">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                                    </button>
                                </div>

                                {/* Extras */}
                                <div className="flex items-center gap-0.5">
                                    <button onClick={() => insertAtCursor('\n---\n', '', '')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Horizontal Divider">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 11h20v2H2z" /></svg>
                                    </button>
                                    <button onClick={() => insertAtCursor('\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1 | Cell 2 |\n', '', '')} className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900 transition-all" title="Insert Table">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
                                    </button>
                                </div>

                                {/* Spacer + Write/Preview toggle */}
                                <div className="flex-1" />
                                <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                                    <button onClick={() => setEditorMode('write')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorMode === 'write' ? 'bg-violet-100 text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Write</button>
                                    <button onClick={() => setEditorMode('preview')} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorMode === 'preview' ? 'bg-violet-100 text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Preview</button>
                                </div>
                            </div>

                            {/* Editor / Preview Area */}
                            {editorMode === 'write' ? (
                                <textarea
                                    ref={contentRef}
                                    value={blogForm.content}
                                    onChange={e => handleBlogFormChange('content', e.target.value)}
                                    rows={editorFullscreen ? 24 : 16}
                                    className="w-full px-5 py-4 focus:outline-none font-mono text-sm leading-relaxed resize-none bg-white"
                                    placeholder="Start writing your article...&#10;&#10;Use the toolbar above to format your content.&#10;Supports **bold**, *italic*, # headings, lists, and more."
                                    onKeyDown={e => {
                                        if (e.ctrlKey || e.metaKey) {
                                            if (e.key === 'b') { e.preventDefault(); insertAtCursor('**', '**', 'bold'); }
                                            if (e.key === 'i') { e.preventDefault(); insertAtCursor('*', '*', 'italic'); }
                                            if (e.key === 'k') { e.preventDefault(); insertAtCursor('[', '](url)', 'link text'); }
                                        }
                                        if (e.key === 'Tab') {
                                            e.preventDefault();
                                            insertAtCursor('  ', '', '');
                                        }
                                    }}
                                />
                            ) : (
                                <div className={`px-5 py-4 prose max-w-none overflow-y-auto bg-slate-50/50 ${editorFullscreen ? 'min-h-[600px]' : 'min-h-[400px]'}`}>
                                    {blogForm.content ? (
                                        <div className="space-y-1">
                                            {blogForm.content.split('\n').map((line, i) => {
                                                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">{line.slice(4)}</h3>;
                                                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-3">{line.slice(3)}</h2>;
                                                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-slate-900 mt-8 mb-3">{line.slice(2)}</h1>;
                                                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-violet-400 pl-4 py-1 text-slate-600 italic bg-violet-50/50 rounded-r-lg">{line.slice(2)}</blockquote>;
                                                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-700 list-disc">{line.slice(2)}</li>;
                                                if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 text-slate-700 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
                                                if (line === '---') return <hr key={i} className="my-6 border-slate-200" />;
                                                if (line.trim() === '') return <div key={i} className="h-3" />;
                                                const html = line
                                                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                                    .replace(/~~(.+?)~~/g, '<del>$1</del>')
                                                    .replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600 text-sm">$1</code>')
                                                    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-violet-600 underline">$1</a>');
                                                return <p key={i} className="text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 italic">Nothing to preview yet. Switch to Write mode and start typing.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Meta Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cover Image</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {blogImageUploading ? 'Uploading...' : 'Upload'}
                                        <input type="file" accept="image/*" onChange={handleBlogImageUpload} className="hidden" disabled={blogImageUploading} />
                                    </label>
                                    {blogForm.coverImageUrl && <img src={blogForm.coverImageUrl} alt="cover" className="w-16 h-10 rounded-lg object-cover border border-slate-200" />}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Author</label>
                                <input
                                    type="text" value={blogForm.author}
                                    onChange={e => handleBlogFormChange('author', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tags (comma-separated)</label>
                                <input
                                    type="text" value={blogForm.tags}
                                    onChange={e => handleBlogFormChange('tags', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                                    placeholder="travel, creators, tips"
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={blogForm.status === 'published'}
                                        onChange={e => setBlogForm(prev => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))}
                                        className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Publish immediately</span>
                                </label>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${blogForm.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {blogForm.status === 'published' ? '● Live' : '◐ Draft'}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={resetBlogEditor} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button
                                    onClick={handleSaveBlogPost}
                                    className="px-6 py-2.5 bg-violet-600 text-white font-bold rounded-xl shadow-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {editingPost ? 'Update Post' : 'Publish Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Posts List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Post</th>
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="p-4 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {blogPosts.map(post => (
                            <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {post.coverImageUrl && (
                                            <img src={post.coverImageUrl} alt="" className="w-12 h-8 rounded-lg object-cover bg-slate-200" />
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{post.title}</p>
                                            <p className="text-xs text-slate-500 font-mono">/{post.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                        ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="p-4 text-xs font-bold text-slate-500">
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEditBlogPost(post)} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-slate-200">Edit</button>
                                        <button onClick={() => handleTogglePublish(post)} className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg ${post.status === 'published' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                                            {post.status === 'published' ? 'Unpublish' : 'Publish'}
                                        </button>
                                        <button onClick={() => handleDeleteBlogPost(post.id)} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-red-100">Delete</button>
                                        {post.status === 'published' && (
                                            <a href={`#/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-violet-50 text-violet-700 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-violet-100">View</a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {blogPosts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-400 font-bold text-sm">No blog posts yet. Click "+ New Post" to create one.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
            {renderSidebar()}

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full bg-white z-30 border-b border-slate-200 px-4 h-16 flex items-center justify-between">
                <span className="font-black text-lg">Admin<span className="text-violet-600">Panel</span></span>
                <button onClick={onBack} className="p-2 bg-slate-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 h-screen overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'collabs' && renderCollabs()}
                    {activeTab === 'feedback' && renderFeedback()}
                    {activeTab === 'blog' && renderBlog()}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 z-40 pb-safe">
                {(['overview', 'users', 'collabs', 'feedback', 'blog'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`p-2 flex flex-col items-center gap-1 rounded-xl transition-all ${activeTab === tab ? 'text-violet-600' : 'text-slate-400'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{tab}</span>
                    </button>
                ))}
            </nav>

            {/* Edit Modal */}
            {showEditModal && editingUser && (
                <UserEditModal
                    user={editingUser}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};
