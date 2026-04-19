import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    FaSearch, FaPaperPlane, FaPhoneAlt, FaVideo, 
    FaEllipsisV, FaImage, FaPaperclip, FaSmile, FaCheckDouble, FaCircle
} from 'react-icons/fa';

import InputField from '../InputField';
import { useAuth } from '../../../hooks/useAuth';
import { useChat } from '../../../context/ChatContext';
import chatApi from '../../../api/chatApi';

// --- COMPONENT: Chat Message Bubble ---
const MessageBubble = ({ msg, isMe, otherParticipant, isLastMessage }) => {
    // Kiểm tra xem tin nhắn đã được đối phương xem chưa
    const isSeen = isMe && otherParticipant?.lastSeenAt && 
                  new Date(otherParticipant.lastSeenAt) >= new Date(msg.sentAt);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`flex max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-slate-100">
                        <img 
                            src={otherParticipant?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.fullName || 'User')}&background=random&color=fff`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}

                <div>
                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group
                        ${isMe 
                            ? 'bg-emerald-500 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}
                    >
                        {msg.content}
                        
                        <div className={`absolute bottom-0 text-[9px] opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap mb-1
                            ${isMe ? 'right-full mr-2 text-slate-400' : 'left-full ml-2 text-slate-400'}`}
                        >
                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                    
                    {/* Chỉ hiển thị trạng thái đã gửi/đã xem ở tin nhắn CUỐI CÙNG của người gửi */}
                    {isMe && isLastMessage && (
                        <div className={`text-[10px] flex justify-end mt-1 gap-1 items-center transition-colors duration-300
                            ${isSeen ? 'text-blue-500 font-bold' : 'text-slate-400 opacity-70'}`}>
                            {isSeen ? (
                                <>Đã xem <FaCheckDouble className="text-blue-500" /></>
                            ) : (
                                <>Đã gửi <FaCheckDouble /></>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- SHARED CHAT MANAGER COMPONENT ---
const ChatManager = ({ 
    sidebarTitle = "Tin nhắn",
    searchPlaceholder = "Tìm kiếm...",
    emptyStateMessage = "Chọn một cuộc trò chuyện để bắt đầu",
    otherRoleBadge = "USER",
    heightClass = "h-[calc(100vh-140px)]"
}) => {
    const { user } = useAuth();
    const { 
        activeConversation, setActiveConversation, 
        messages, setMessages, appendMessage,
        conversations, setConversations,
        connectAndSubscribe, sendMessage,
        isLoadingMessages, setIsLoadingMessages
    } = useChat();

    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const messagesContainerRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // 1. Load conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await chatApi.getConversations(user.id);
                setConversations(response.data);
                if (response.data.length > 0 && !activeConversation) {
                    setActiveConversation(response.data[0]);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách hội thoại:", error);
            }
        };
        if (user?.id) fetchConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.id]); // Chỉ chạy khi đổi user

    // 2. Load messages + WebSocket
    useEffect(() => {
        const conversationId = activeConversation?.id;
        if (conversationId) {
            const fetchMessages = async () => {
                setIsLoadingMessages(true);
                try {
                    const response = await chatApi.getMessages(conversationId, 0, 50);
                    setMessages([...response.data.content].reverse());
                    await chatApi.markSeen(conversationId);
                    setConversations(prev => prev.map(c => 
                        c.id.toString() === conversationId.toString() ? { ...c, unreadCount: 0 } : c
                    ));
                } catch (error) {
                    console.error("Lỗi khi tải tin nhắn:", error);
                } finally {
                    setIsLoadingMessages(false);
                }
            };
            fetchMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversation?.id]); // CRITICAL: Only trigger on ID change

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeConversation) return;

        sendMessage(activeConversation.id, inputText);
        setInputText("");
    };

    const handleSelectConversation = (chat) => {
        setActiveConversation(chat);
    };

    const otherMember = activeConversation?.participants?.[0];

    return (
        <div className={`${heightClass} bg-transparent flex flex-col md:flex-row gap-6 pb-6`}>
            
            {/* --- SIDEBAR --- */}
            <div className="w-full md:w-80 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">{sidebarTitle}</h2>
                    <InputField 
                        placeholder={searchPlaceholder} 
                        icon={FaSearch} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="compact"
                        className="!mb-0 !bg-slate-50 !border-transparent"
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {conversations.filter(c => {
                        const otherArr = c.participants?.[0];
                        return otherArr?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
                    }).map((chat) => {
                        const other = chat.participants?.[0];
                        const isActive = activeConversation?.id?.toString() === chat.id.toString();
                        const hasUnread = chat.unreadCount > 0;

                        return (
                            <div 
                                key={chat.id}
                                onClick={() => handleSelectConversation(chat)}
                                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group relative
                                    ${isActive 
                                        ? 'bg-emerald-50 border border-emerald-100 shadow-sm' 
                                        : 'hover:bg-slate-50 border border-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <img 
                                        src={other?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.fullName || 'User')}&background=random&color=fff`} 
                                        alt={other?.fullName} 
                                        className="w-12 h-12 rounded-full object-cover border border-slate-100" 
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`text-sm truncate ${isActive ? 'text-emerald-900 font-bold' : (hasUnread ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium')}`}>
                                            {other?.fullName}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                            {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-xs truncate flex-1 ${isActive ? 'text-emerald-600 font-medium' : (hasUnread ? 'text-slate-900 font-bold' : 'text-slate-500')}`}>
                                            {chat.lastMessageContent || "Bắt đầu trò chuyện..."}
                                        </p>
                                        {hasUnread && !isActive && (
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full ml-2 shadow-sm shadow-emerald-200"></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- MAIN CHAT WINDOW --- */}
            <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
                {!activeConversation ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-3xl">💬</div>
                        <p>{emptyStateMessage}</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img 
                                        src={otherMember?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember?.fullName || 'User')}&background=random&color=fff`} 
                                        alt="User" 
                                        className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                                    />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                        {otherMember?.fullName}
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider 
                                            ${otherRoleBadge === 'STUDENT' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {otherRoleBadge}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <FaCircle size={6} className="text-green-500" /> Đang trực tuyến
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 text-slate-400">
                                <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors hover:text-emerald-600"><FaPhoneAlt size={14} /></button>
                                <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors hover:text-emerald-600"><FaVideo size={16} /></button>
                                <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors hover:text-slate-600"><FaEllipsisV size={14} /></button>
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div 
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-6 bg-slate-50/50 scroll-smooth"
                        >
                            {isLoadingMessages ? (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Đang tải tin nhắn...</div>
                            ) : (
                                <>
                                    {messages.map((msg, index) => {
                                        const isLastMessage = index === messages.length - 1;
                                        return (
                                            <MessageBubble 
                                                key={msg.id} 
                                                msg={msg} 
                                                isMe={msg.senderId === user.id} 
                                                otherParticipant={otherMember} 
                                                isLastMessage={isLastMessage}
                                            />
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-50">
                            <form 
                                onSubmit={handleSendMessage}
                                className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all shadow-sm"
                            >
                                <div className="flex gap-1 pb-2 pl-2">
                                    <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"><FaPaperclip size={16}/></button>
                                    <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"><FaImage size={16}/></button>
                                    <button type="button" className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-white rounded-lg transition-colors"><FaSmile size={16}/></button>
                                </div>

                                <textarea 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-none py-3 max-h-32 min-h-[44px]"
                                    rows="1"
                                />

                                <div className="pb-1 pr-1">
                                    <motion.button 
                                        whileTap={{ scale: 0.9 }}
                                        type="submit"
                                        className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-md
                                            ${inputText.trim() 
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200' 
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        disabled={!inputText.trim()}
                                    >
                                        <FaPaperPlane size={14} />
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatManager;
