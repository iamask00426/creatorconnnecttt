import React, { useEffect, useState } from 'react';
import { getPublishedBlogPosts, getBlogPostBySlug } from '../services/firebase';
import type { BlogPost } from '../types';

// Simple markdown-like renderer
const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
        // Headings
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">{line.slice(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-white mt-10 mb-4">{line.slice(2)}</h1>;
        // Empty line = spacing
        if (line.trim() === '') return <div key={i} className="h-4" />;
        // Bold and italic inline
        let html = line
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-rose-400 text-sm font-mono">$1</code>');
        return <p key={i} className="text-slate-300 leading-relaxed text-lg mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
    });
};

// Blog listing page
const BlogList: React.FC<{ posts: BlogPost[]; onSelectPost: (slug: string) => void; onBack: () => void }> = ({ posts, onSelectPost, onBack }) => (
    <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Home
                </button>
                <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="text-xl font-black tracking-tight">
                    Creator<span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Connect</span>
                </a>
                <div className="w-16" />
            </div>
        </header>

        {/* Hero */}
        <div className="relative py-20 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-black mb-4">
                    Our <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Blog</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">Stories, tips, and insights for the modern creator community.</p>
            </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </div>
                    <p className="text-lg font-bold text-slate-500">No articles yet</p>
                    <p className="text-slate-600 mt-1">Check back soon for fresh content!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => (
                        <article
                            key={post.id}
                            onClick={() => onSelectPost(post.slug)}
                            className="group cursor-pointer bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/5"
                        >
                            {post.coverImageUrl ? (
                                <div className="aspect-video overflow-hidden">
                                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                </div>
                            )}
                            <div className="p-6">
                                {post.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <h2 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors mb-2 line-clamp-2">{post.title}</h2>
                                {post.excerpt && <p className="text-sm text-slate-400 line-clamp-2 mb-4">{post.excerpt}</p>}
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="font-bold">{post.author}</span>
                                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// Single article view
const BlogArticle: React.FC<{ post: BlogPost; onBack: () => void; onHome: () => void }> = ({ post, onBack, onHome }) => (
    <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/50">
            <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    All Posts
                </button>
                <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} className="text-xl font-black tracking-tight">
                    Creator<span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Connect</span>
                </a>
                <div className="w-16" />
            </div>
        </header>

        {/* Cover Image */}
        {post.coverImageUrl && (
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
            </div>
        )}

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-6 pb-20" style={{ marginTop: post.coverImageUrl ? '-120px' : '40px' }}>
            <div className="relative z-10">
                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">{tag}</span>
                        ))}
                    </div>
                )}
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-10 pb-10 border-b border-zinc-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                        {post.author?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <p className="font-bold text-white">{post.author}</p>
                        <p>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                    </div>
                </div>

                {/* Rendered Content */}
                <div className="prose prose-invert max-w-none">
                    {renderContent(post.content)}
                </div>
            </div>
        </article>
    </div>
);

// Main BlogPage component
export const BlogPage: React.FC<{ slug?: string; onNavigateHome: () => void }> = ({ slug, onNavigateHome }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [singlePost, setSinglePost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            // Load single post
            setLoading(true);
            getBlogPostBySlug(slug).then(post => {
                setSinglePost(post);
                setLoading(false);
            });
        } else {
            // Load all published posts
            const unsubscribe = getPublishedBlogPosts((data) => {
                setPosts(data);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [slug]);

    const handleSelectPost = (postSlug: string) => {
        window.location.hash = `/blog/${postSlug}`;
    };

    const handleBackToList = () => {
        window.location.hash = '/blog';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (slug && singlePost) {
        return <BlogArticle post={singlePost} onBack={handleBackToList} onHome={onNavigateHome} />;
    }

    if (slug && !singlePost) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-center px-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-4">Article Not Found</h1>
                    <p className="text-slate-400 mb-8">The article you're looking for doesn't exist or has been unpublished.</p>
                    <button onClick={handleBackToList} className="px-6 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors">
                        Browse All Articles
                    </button>
                </div>
            </div>
        );
    }

    return <BlogList posts={posts} onSelectPost={handleSelectPost} onBack={onNavigateHome} />;
};
