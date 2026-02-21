
import React, { useState, useEffect } from 'react';
import type { UserData, Creator, ChatSummary } from '../../types';
import { getChatsStream } from '../../services/firebase';
import { formatDistanceToNow } from 'date-fns';
import { ChatListSkeleton } from '../loaders/ChatListSkeleton';

interface MessagesScreenProps {
    currentUser: UserData;
    onStartChat: (creator: Creator) => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ currentUser, onStartChat }) => {
    const [chats, setChats] = useState<ChatSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser.uid) return;

        setIsLoading(true);
        const unsubscribe = getChatsStream(currentUser.uid, (newChats) => {
            setChats(newChats);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser.uid]);

    const formatTimestamp = (date: Date) => {
        try {
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            return date?.toLocaleTimeString() || '';
        }
    };

    const isUnread = (chat: ChatSummary) => {
        if (!chat.lastMessage || chat.lastMessage.senderId === currentUser.uid) return false;
        const myLastRead = chat.lastRead?.[currentUser.uid];
        if (!myLastRead) return true; // Never read = unread
        return chat.lastMessage.timestamp > myLastRead;
    };

    const unreadChats = chats.filter(c => isUnread(c));
    const readChats = chats.filter(c => !isUnread(c));

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 animate-fade-in-up">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
                        {chats.length > 0 && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {unreadChats.length > 0 ? `${unreadChats.length} unread` : 'All caught up ✓'}
                            </p>
                        )}
                    </div>
                    {unreadChats.length > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 rounded-full">
                            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-violet-700 uppercase tracking-wider">{unreadChats.length} New</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto hide-scrollbar pb-28">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => <ChatListSkeleton key={i} />)}
                    </div>
                ) : chats.length > 0 ? (
                    <div className="p-4 space-y-2">
                        {/* Unread Section */}
                        {unreadChats.length > 0 && (
                            <>
                                {unreadChats.map((chat, index) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => onStartChat(chat.partner)}
                                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl cursor-pointer transition-all active:scale-[0.98] border border-violet-200/60 shadow-sm shadow-violet-100/50 hover:shadow-md hover:border-violet-300/60 relative overflow-hidden group"
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        {/* Left accent bar */}
                                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-violet-500 rounded-r-full"></div>

                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0 ml-1">
                                            <img
                                                src={chat.partner.photoURL}
                                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                                                alt={chat.partner.displayName}
                                                referrerPolicy="no-referrer"
                                            />
                                            <span className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-100"></span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow overflow-hidden min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-black text-sm text-slate-900 truncate">{chat.partner.displayName}</h3>
                                                <span className="text-[10px] font-bold text-violet-600 flex-shrink-0 ml-2">{formatTimestamp(chat.lastMessage.timestamp)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-slate-700 truncate flex-grow">{chat.lastMessage.text}</p>
                                                <span className="flex-shrink-0 w-2.5 h-2.5 bg-violet-500 rounded-full shadow-sm shadow-violet-300 animate-pulse"></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Divider between unread and read */}
                                {readChats.length > 0 && (
                                    <div className="flex items-center gap-3 py-3 px-2">
                                        <div className="flex-grow h-px bg-slate-200"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Earlier</span>
                                        <div className="flex-grow h-px bg-slate-200"></div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Read Section */}
                        {readChats.map((chat, index) => (
                            <div
                                key={chat.id}
                                onClick={() => onStartChat(chat.partner)}
                                className="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer transition-all active:scale-[0.98] border border-slate-100 hover:border-slate-200 hover:shadow-sm group"
                                style={{ animationDelay: `${(unreadChats.length + index) * 60}ms` }}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={chat.partner.photoURL}
                                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 group-hover:scale-105 transition-transform"
                                        alt={chat.partner.displayName}
                                        referrerPolicy="no-referrer"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full bg-slate-300 border-2 border-white"></span>
                                </div>

                                {/* Content */}
                                <div className="flex-grow overflow-hidden min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className="font-bold text-sm text-slate-700 truncate">{chat.partner.displayName}</h3>
                                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{formatTimestamp(chat.lastMessage.timestamp)}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate font-medium">{chat.lastMessage.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-24 px-8 animate-fade-in-up">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mb-2">No conversations yet</h3>
                        <p className="text-xs text-slate-400 text-center leading-relaxed font-medium">
                            Find creators you'd love to collab with and start a conversation!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
