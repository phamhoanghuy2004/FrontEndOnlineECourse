// src/context/ChatContext.jsx
import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../hooks/useAuth';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();

    // ============ UI State ============
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

    // ============ Chat State ============
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // ============ Refs for WebSocket Stability ============
    const activeConversationRef = useRef(null);
    const conversationsRef = useRef([]);

    // Đồng bộ Ref với State
    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    // ============ WebSocket Refs ============
    const stompClientRef = useRef(null);
    const subscriptionMessagesRef = useRef(null);
    const subscriptionSeenRef = useRef(null);

    /**
     * Xử lý New Message (Dùng cho cả Sidebar update và active chat window)
     */
    const handleIncomingMessage = useCallback((newMsg) => {
        // 1. Cập nhật Sidebar (Conversations List)
        setConversations(prev => {
            const index = prev.findIndex(c => c.id.toString() === newMsg.conversationId.toString());

            const currentActiveId = activeConversationRef.current?.id?.toString();
            const isTargetActive = currentActiveId === newMsg.conversationId.toString();

            let targetConv;
            let newList = [...prev];

            if (index !== -1) {
                targetConv = {
                    ...prev[index],
                    lastMessageContent: newMsg.content,
                    lastMessageAt: newMsg.sentAt,
                    unreadCount: isTargetActive ? 0 : (prev[index].unreadCount || 0) + 1
                };
                newList.splice(index, 1);
            } else {
                // Nếu là tin nhắn từ hội thoại chưa có trong list (ví dụ mới tạo)
                // Ta có thể fetch lại list hoặc tạm thời ignore
                return prev;
            }

            return [targetConv, ...newList];
        });

        // 2. Nếu đang mở phòng chat này → Append message
        if (activeConversationRef.current?.id?.toString() === newMsg.conversationId.toString()) {
            setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        }
    }, []);

    /**
     * Xử lý Seen Event
     */
    const handleSeenUpdate = useCallback((seenData) => {
        const conversationId = seenData.conversationId.toString();
        const userId = seenData.userId.toString();
        const newLastSeen = new Date(seenData.lastSeenAt).getTime();

        // 1. Cập nhật activeConversation (nếu đang mở)
        setActiveConversation(current => {
            if (current && current.id.toString() === conversationId) {
                const participant = current.participants.find(p => p.userId.toString() === userId);
                const oldLastSeen = participant?.lastSeenAt ? new Date(participant.lastSeenAt).getTime() : 0;

                if (newLastSeen > oldLastSeen) {
                    return {
                        ...current,
                        participants: current.participants.map(p =>
                            p.userId.toString() === userId
                                ? { ...p, lastSeenAt: seenData.lastSeenAt }
                                : p
                        )
                    };
                }
            }
            return current;
        });

        // 2. Cập nhật danh sách conversations sidebar
        setConversations(prev => prev.map(c => {
            if (c.id.toString() === conversationId) {
                const participant = c.participants.find(p => p.userId.toString() === userId);
                const oldLastSeen = participant?.lastSeenAt ? new Date(participant.lastSeenAt).getTime() : 0;

                if (newLastSeen > oldLastSeen) {
                    return {
                        ...c,
                        participants: c.participants.map(p =>
                            p.userId.toString() === userId
                                ? { ...p, lastSeenAt: seenData.lastSeenAt }
                                : p
                        )
                    };
                }
            }
            return c;
        }));
    }, []);

    // ============ Persistent Global WebSocket Connection ============
    useEffect(() => {
        if (!user?.id) {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        const client = new Client({
            webSocketFactory: () => new SockJS('https://phamhoanghuy-echill-backend.hf.space/ws'),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('[WS] Global Chat Stream Connected');

                // Subscribe một lần duy nhất vào kênh cá nhân
                client.subscribe('/user/queue/messages', (frame) => {
                    handleIncomingMessage(JSON.parse(frame.body));
                });

                client.subscribe('/user/queue/seen', (frame) => {
                    handleSeenUpdate(JSON.parse(frame.body));
                });
            },
            onStompError: (frame) => console.error('[WS] Global Stream Error:', frame),
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [user?.id, handleIncomingMessage, handleSeenUpdate]);

    // Giữ nguyên các hàm helper cho UI
    const sendMessage = useCallback((conversationId, content, messageType = 'TEXT') => {
        if (!stompClientRef.current?.connected) return;
        stompClientRef.current.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({ conversationId, content, messageType }),
        });
    }, []);

    const appendMessage = useCallback((newMsg) => {
        // Thực tế không còn dùng trực tiếp vì handleIncomingMessage đã làm việc này
        // Nhưng giữ lại để tránh break APIs cũ nếu có
        if (activeConversationRef.current?.id?.toString() === newMsg.conversationId.toString()) {
            setMessages(prev => {
                if (prev.some(m => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
            });
        }
    }, []);

    const openChatBox = useCallback((conversation) => {
        setActiveConversation(conversation);
        setIsChatBoxOpen(true);
    }, []);

    return (
        <ChatContext.Provider value={{
            isChatBoxOpen,
            openChatBox,
            closeChatBox: () => setIsChatBoxOpen(false),
            activeConversation,
            setActiveConversation,
            messages,
            setMessages,
            conversations,
            setConversations,
            isLoadingMessages,
            setIsLoadingMessages,
            // stable dummy function for backward compatibility
            connectAndSubscribe: useCallback(() => { }, []),
            sendMessage,
            appendMessage,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
