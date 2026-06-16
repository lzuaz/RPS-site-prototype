"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Paperclip, Image as ImageIcon, X } from "lucide-react";
import SpatialWidget from "./SpatialWidget";
import { createClient } from "@/lib/supabase/client";
import { getChatHistory, sendChatMessage, getChatMessage } from "@/app/actions/chat.actions";
interface StaffChatWidgetProps {
    currentUser: {
        id: string;
        username: string;
        role: string;
    };
    theme?: any;
    boundsRef?: React.RefObject<HTMLDivElement | null>;
    isEditable?: boolean;
}
const ROLE_COLORS: Record<string, string> = {
    admin: "text-sky-400",
    developer: "text-sky-400",
    moderator: "text-amber-400",
    tester: "text-emerald-400",
    player: "text-white/60"
};
export default function StaffChatWidget({ currentUser, theme }: StaffChatWidgetProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [typingUsers, setTypingUsers] = useState<Record<string, any>>({});
    const [showGifInput, setShowGifInput] = useState(false);
    const [gifUrl, setGifUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const presenceChannelRef = useRef<any>(null);
    const supabase = createClient();
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        const loadHistory = async () => {
            const res = await getChatHistory('staff_comms');
            if (res.success && res.messages) {
                setMessages(res.messages);
            }
            setIsLoading(false);
            setTimeout(scrollToBottom, 100);
        };
        loadHistory();
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        const presenceChannel = supabase.channel('staff_comms_presence', {
            config: { presence: { key: currentUser.id } }
        });
        presenceChannelRef.current = presenceChannel;
        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const newState = presenceChannel.presenceState();
                const typers: Record<string, any> = {};
                for (const id in newState) {
                    if (id !== currentUser.id && (newState[id][0] as any)?.isTyping) {
                        typers[id] = newState[id][0];
                    }
                }
                setTypingUsers(typers);
            })
            .subscribe();
        const channel = supabase
            .channel('staff_comms')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_logs', filter: "channel=eq.staff_comms" },
                async (payload) => {
                    const res = await getChatMessage(payload.new.id);
                    if (res.success && res.message) {
                        setMessages(prev => {
                            if (prev.find(m => m.id === res.message.id)) return prev;
                            if (res.message.sender_id !== currentUser.id && 'Notification' in window && Notification.permission === 'granted') {
                                new Notification(`Staff Comms: ${(res.message.sender as any)?.username || 'System'}`, {
                                    body: res.message.message,
                                    icon: '/logo.png' 
                                });
                            }
                            setIsOpen(currentIsOpen => {
                                if (!currentIsOpen && res.message.sender_id !== currentUser.id) {
                                    setUnreadCount(c => c + 1);
                                }
                                return currentIsOpen;
                            });
                            return [...prev, res.message];
                        });
                        setTimeout(scrollToBottom, 100);
                    }
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(presenceChannel);
        };
    }, []);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (presenceChannelRef.current) {
            presenceChannelRef.current.track({ isTyping: true, username: currentUser.username });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                presenceChannelRef.current.track({ isTyping: false, username: currentUser.username });
            }, 2000);
        }
    };
    const handleSend = async (e?: React.FormEvent, type: 'text' | 'gif' | 'file' | 'image' = 'text', payloadUrl?: string, fileName?: string) => {
        if (e) e.preventDefault();
        let content = inputValue;
        let metadata = {};
        if (type === 'text' && !content.trim()) return;
        if (type === 'gif') {
            if (!gifUrl.trim()) return;
            metadata = { type: 'gif', url: gifUrl };
            content = "Sent a GIF";
            setGifUrl("");
            setShowGifInput(false);
        } else if (type === 'file') {
            metadata = { type: 'file', url: payloadUrl, name: fileName };
            content = "Sent an attachment";
        } else if (type === 'image') {
            metadata = { type: 'image', url: payloadUrl, name: fileName };
            content = "Sent an image";
        }
        setInputValue(""); 
        if (presenceChannelRef.current) {
            presenceChannelRef.current.track({ isTyping: false, username: currentUser.username });
        }
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            channel: 'staff_comms',
            message: content,
            metadata,
            created_at: new Date().toISOString(),
            sender_id: currentUser.id,
            sender: currentUser,
            isOptimistic: true
        };
        setMessages(prev => [...prev, tempMessage]);
        setTimeout(scrollToBottom, 50);
        const res = await sendChatMessage('staff_comms', content, metadata);
        if (res.success) {
            setMessages(prev => prev.map(m => m.id === tempId ? res.message : m));
        } else {
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${currentUser.id}/${fileName}`;
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt || '');
        const { error: uploadError } = await supabase.storage
            .from('chat-attachments')
            .upload(filePath, file);
        if (uploadError) {
            alert(`Upload failed: ${uploadError.message}. Did you run the SQL migration for the bucket?`);
            setIsUploading(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage
            .from('chat-attachments')
            .getPublicUrl(filePath);
        await handleSend(undefined, isImage ? 'image' : 'file', publicUrl, file.name);
        setIsUploading(false);
    };
    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setUnreadCount(0);
                        setTimeout(scrollToBottom, 100);
                    }
                }}
                className={`h-10 px-4 rounded-full border flex items-center justify-center gap-2 transition-all duration-300 shadow-xl overflow-hidden
                    ${theme ? theme.glassBg : 'border-white/[0.05] bg-black/40 backdrop-blur-md text-white/50 hover:text-white'}
                `}
            >
                <MessageSquare className={`w-4 h-4 ${theme ? theme.textBase : ''}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:inline ${theme ? theme.textBase : ''}`}>
                    Comms
                </span>
                {unreadCount > 0 && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] font-bold shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse border border-red-400/50">
                        {unreadCount}
                    </span>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-md"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`fixed top-20 md:top-24 right-4 md:right-8 w-[380px] h-[600px] max-h-[80vh] z-[100] flex flex-col rounded-3xl overflow-hidden backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)]
                            ${theme ? theme.cardBg : 'bg-[#050505]/90 border border-white/[0.08]'}
                        `}
                    >
                        <div className={`flex-shrink-0 p-4 border-b flex items-center justify-between ${theme ? theme.glassBg : 'border-white/[0.05] bg-white/[0.02]'}`}>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-sky-400" />
                                <span className={`text-xs font-black uppercase tracking-widest ${theme ? theme.textBase : 'text-white'}`}>Staff Comms</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className={`${theme ? theme.textMuted : 'text-white/40'} hover:opacity-100 transition-colors`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-3"
                >
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest text-white/30">
                            Secure line established.
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => {
                                const isMe = msg.sender_id === currentUser.id;
                                const showHeader = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
                                    >
                                        {showHeader && (
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                <span className={`text-[9px] font-black tracking-widest uppercase ${ROLE_COLORS[msg.sender?.role] || (theme ? theme.textMuted : 'text-white/60')}`}>
                                                    {msg.sender?.username || "Unknown"}
                                                </span>
                                            </div>
                                        )}
                                        <div 
                                            className={`
                                                relative px-4 py-2 text-xs md:text-sm shadow-xl
                                                ${isMe 
                                                    ? 'bg-sky-500/20 border border-sky-500/30 text-sky-50 rounded-2xl rounded-tr-sm' 
                                                    : (theme ? `bg-black/10 border ${theme.borderStrong} ${theme.textBase} rounded-2xl rounded-tl-sm` : 'bg-white/[0.06] border border-white/[0.05] text-white/90 rounded-2xl rounded-tl-sm')
                                                }
                                                ${msg.isOptimistic ? 'opacity-50' : 'opacity-100'}
                                                transition-opacity duration-300
                                            `}
                                        >
                                            {msg.metadata?.type === 'gif' ? (
                                                <img src={msg.metadata.url} alt="GIF" className="max-w-[200px] rounded-lg mt-1" />
                                            ) : msg.metadata?.type === 'image' ? (
                                                <img src={msg.metadata.url} alt={msg.metadata.name} className="max-w-[200px] rounded-lg mt-1 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.metadata.url, '_blank')} />
                                            ) : msg.metadata?.type === 'file' ? (
                                                <a href={msg.metadata.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-300 hover:text-sky-200 underline mt-1">
                                                    <Paperclip className="w-3 h-3" /> {msg.metadata.name}
                                                </a>
                                            ) : (
                                                msg.message
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
                {Object.keys(typingUsers).length > 0 && (
                    <div className={`px-4 pb-2 text-[10px] text-sky-400/80 font-bold uppercase tracking-widest flex items-center gap-2 ${theme ? theme.glassBg : 'bg-[#050505]/90'}`}>
                        <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <span className="w-1.5 h-1.5 bg-sky-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </span>
                        {Object.values(typingUsers).map(u => u.username).join(', ')} typing...
                    </div>
                )}
                <AnimatePresence>
                    {showGifInput && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-[4.5rem] left-4 right-4 p-3 bg-[#111] border border-white/10 rounded-xl shadow-2xl flex gap-2"
                        >
                            <input
                                type="text"
                                value={gifUrl}
                                onChange={(e) => setGifUrl(e.target.value)}
                                placeholder="Paste GIF URL here..."
                                className="flex-1 bg-black/50 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50"
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(undefined, 'gif')}
                            />
                            <button onClick={() => handleSend(undefined, 'gif')} className="px-3 bg-sky-500/20 text-sky-400 rounded-lg text-xs font-bold uppercase hover:bg-sky-500/40">
                                Send
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className={`flex-shrink-0 p-3 border-t ${theme ? theme.glassBg : 'bg-white/[0.02] border-white/[0.05]'}`}>
                    <form onSubmit={(e) => handleSend(e, 'text')} className="relative w-full">
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                            <label className={`p-1.5 cursor-pointer rounded-lg transition-colors ${isUploading ? 'opacity-50' : `hover:bg-white/10 ${theme ? theme.textMuted : 'text-white/40'} hover:opacity-100`}`}>
                                <Paperclip className="w-4 h-4" />
                                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                            </label>
                            <button type="button" onClick={() => setShowGifInput(!showGifInput)} className={`p-1.5 rounded-lg transition-colors ${showGifInput ? 'bg-white/10' : `hover:bg-white/10 ${theme ? theme.textMuted : 'text-white/40'} hover:opacity-100`}`}>
                                <ImageIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={isUploading ? "UPLOADING..." : "TRANSMIT MESSAGE..."}
                            className={`w-full rounded-xl pl-20 pr-12 py-3 text-xs font-medium focus:outline-none focus:border-sky-500/50 transition-all
                                ${theme ? `${theme.inputBg} ${theme.textBase}` : 'bg-black/40 border border-white/10 text-white placeholder-white/30'}
                            `}
                            disabled={isUploading}
                        />
                        <button 
                            type="submit"
                            disabled={!inputValue.trim() || isUploading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-500/20 hover:bg-sky-500/40 text-sky-400 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none z-10"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
                    </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
