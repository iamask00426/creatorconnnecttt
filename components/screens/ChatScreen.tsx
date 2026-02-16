
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { UserData, Creator, Message, Collaboration } from '../../types';
import { SendIcon, PlusIcon, RetryIcon } from '../icons';
import { getChatId, sendMessage, getMessagesStream, uploadChatImage, getCollaborationsStream, finalizeCollaborationWithLink, markChatAsRead } from '../../services/firebase';

interface ChatScreenProps {
    currentUser: UserData;
    chatPartner: Creator;
    onBack: () => void;
    onViewProfile?: (creator: Creator) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ currentUser, chatPartner, onBack, onViewProfile }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const blobUrlsRef = useRef<Set<string>>(new Set());

    // Auto-update logic
    const [activeCollab, setActiveCollab] = useState<Collaboration | null>(null);
    const [detectedLink, setDetectedLink] = useState<string | null>(null);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const chatId = useMemo(() => getChatId(currentUser.uid, chatPartner.uid), [currentUser.uid, chatPartner.uid]);

    useEffect(() => {
        // Mark chat as read when opening
        markChatAsRead(chatId, currentUser.uid);

        // Fetch active collaborations to see if we should monitor for links
        const unsubscribeCollabs = getCollaborationsStream(currentUser.uid, (collabs) => {
            const current = collabs.find(c =>
                c.participantIds.includes(chatPartner.uid) &&
                c.status === 'active'
            );
            setActiveCollab(current || null);
        });

        const unsubscribe = getMessagesStream(chatId, (newMessages) => {
            setMessages(prevMessages => {
                const optimisticMessages = prevMessages.filter(m => m.status && m.id.startsWith('temp_'));
                const serverMessages = newMessages.map(m => m.id);
                const uniqueOptimistic = optimisticMessages.filter(om => !serverMessages.includes(om.id));
                return [...newMessages, ...uniqueOptimistic];
            });
            // Mark as read whenever new messages come in while chat is open
            markChatAsRead(chatId, currentUser.uid);
        });

        return () => {
            unsubscribe();
            unsubscribeCollabs();
            blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            blobUrlsRef.current.clear();
        };
    }, [chatId, currentUser.uid, chatPartner.uid]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (trimmedMessage === "") return;

        setNewMessage("");
        await sendMessage(chatId, {
            text: trimmedMessage,
            senderId: currentUser.uid,
            type: 'text',
        });
    };

    const performImageUpload = async (file: File, tempId: string) => {
        try {
            const mediaUrl = await uploadChatImage(chatId, file);
            await sendMessage(chatId, {
                text: '',
                senderId: currentUser.uid,
                type: 'image',
                mediaUrl: mediaUrl,
            });
            setPendingFiles(prev => {
                const newPending = { ...prev };
                delete newPending[tempId];
                return newPending;
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === tempId ? { ...msg, status: 'error' } : msg
                )
            );
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const tempId = `temp_${Date.now()}`;
        const localUrl = URL.createObjectURL(file);
        blobUrlsRef.current.add(localUrl);

        const optimisticMessage: Message = {
            id: tempId,
            text: '',
            senderId: currentUser.uid,
            timestamp: new Date(),
            type: 'image',
            mediaUrl: localUrl,
            status: 'pending',
        };

        setMessages(prevMessages => [...prevMessages, optimisticMessage]);
        setPendingFiles(prev => ({ ...prev, [tempId]: file }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        await performImageUpload(file, tempId);
    };

    const handleRetryUpload = (tempId: string) => {
        const fileToRetry = pendingFiles[tempId];
        if (!fileToRetry) return;

        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === tempId ? { ...msg, status: 'pending' } : msg
            )
        );

        performImageUpload(fileToRetry, tempId);
    };

    const extractLink = (text: string): string | null => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = text.match(urlRegex);
        return match ? match[0] : null;
    };

    const handleAddLinkToPortfolio = async (link: string) => {
        if (!activeCollab) return;

        const confirmAdd = window.confirm(`🤖 System Assistant:\n\nDo you want to mark "${activeCollab.projectName}" as complete and add this link to your portfolio?\n\nLink: ${link}`);

        if (confirmAdd) {
            setIsFinalizing(true);
            try {
                // Map participants to names
                const nameMap = {
                    [currentUser.uid]: currentUser.displayName,
                    [chatPartner.uid]: chatPartner.displayName
                };

                await finalizeCollaborationWithLink(
                    activeCollab.id,
                    link,
                    activeCollab.participantIds,
                    activeCollab.projectName,
                    nameMap
                );

                await sendMessage(chatId, {
                    text: `✅ **Project Completed!**\n\nThe project "${activeCollab.projectName}" has been added to both portfolios.\nLink: ${link}`,
                    senderId: 'system',
                    type: 'system'
                });

            } catch (error) {
                console.error("Error finalizing:", error);
                alert("Failed to update portfolio.");
            } finally {
                setIsFinalizing(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Glass Header */}
            <header className="flex items-center px-4 py-3 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-slate-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="relative cursor-pointer" onClick={() => onViewProfile?.(chatPartner)}>
                    <img src={chatPartner.photoURL} className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100 hover:ring-2 hover:ring-violet-300 transition-all" alt={chatPartner.displayName} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="ml-3 cursor-pointer" onClick={() => onViewProfile?.(chatPartner)}>
                    <h1 className="text-base font-bold text-slate-900">{chatPartner.displayName}</h1>
                    {/* Added Creator Niche here as requested */}
                    <p className="text-xs text-violet-600 font-bold uppercase tracking-wide">{chatPartner.niche || 'Creator'}</p>
                </div>
            </header>

            <main className="flex-grow p-4 overflow-y-auto space-y-3">
                {messages.map(msg => {
                    const isMe = msg.senderId === currentUser.uid;
                    const isSystem = msg.type === 'system';
                    const linkInMessage = !isSystem && activeCollab && msg.text ? extractLink(msg.text) : null;

                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-4 animate-fade-in-up">
                                <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 max-w-[85%] text-center shadow-sm">
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-2.5 shadow-sm text-sm ${isMe
                                    ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm'
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
                                    } ${msg.status === 'pending' ? 'opacity-70' : ''}`}>
                                    {msg.type === 'image' && msg.mediaUrl && (
                                        <img src={msg.mediaUrl} className="w-full max-w-[200px] rounded-lg object-cover mb-1 border border-white/20" alt="Sent media" />
                                    )}
                                    {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                                </div>

                                {/* Link Action Button */}
                                {linkInMessage && activeCollab && (
                                    <button
                                        onClick={() => handleAddLinkToPortfolio(linkInMessage)}
                                        disabled={isFinalizing}
                                        className="mt-2 flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all animate-fade-in-up"
                                    >
                                        <span>✨ Add to Portfolio</span>
                                    </button>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                            </span>
                            {msg.status === 'error' && isMe && (
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-red-500">Failed</span>
                                    <button onClick={() => handleRetryUpload(msg.id)} className="p-1 text-blue-500 hover:text-blue-700">
                                        <RetryIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="p-4 bg-slate-50/90 backdrop-blur-xl border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-full text-slate-500 bg-white border border-slate-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm">
                        <PlusIcon className="h-6 w-6" />
                    </button>
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={activeCollab ? "Paste project link here..." : "Type a message..."}
                            className="w-full pl-5 pr-4 py-3 text-sm text-slate-800 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-violet-500/30 transform hover:scale-105 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100"
                    >
                        <SendIcon className="h-5 w-5 translate-x-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
