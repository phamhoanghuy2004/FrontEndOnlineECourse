import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import chatApi from '../../api/chatApi';

const ChatWidget = () => {
    const { 
        isOpen, toggleChat, closeChat,
        activeConversation, setActiveConversation,
        messages, setMessages,
        connectAndSubscribe, sendMessage, appendMessage,
        isLoadingMessages, setIsLoadingMessages
    } = useChat();
    
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef(null);

    // 1. Khi mở chat, nếu chưa có conversation nào active, thử lấy conversation đầu tiên (hoặc gần nhất)
    useEffect(() => {
        if (isOpen && !activeConversation && user) {
            const fetchInitialChat = async () => {
                try {
                    const res = await chatApi.getConversations(user.id);
                    if (res.data && res.data.length > 0) {
                        setActiveConversation(res.data[0]);
                    }
                } catch (err) {
                    console.error("Error fetching initial chat:", err);
                }
            };
            fetchInitialChat();
        }
    }, [isOpen, activeConversation, user, setActiveConversation]);

    // 2. Khi có activeConversation, kết nối WebSocket
    useEffect(() => {
        if (activeConversation?.id) {
            // Load tin nhắn cũ
            const loadMessages = async () => {
                setIsLoadingMessages(true);
                try {
                    const res = await chatApi.getMessages(activeConversation.id, 0, 50);
                    setMessages(res.data.content.reverse());
                } catch (err) {
                    console.error("Error loading messages:", err);
                } finally {
                    setIsLoadingMessages(false);
                }
            };
            loadMessages();

            // Subscribe realtime
            connectAndSubscribe(activeConversation.id, (newMsg) => {
                appendMessage(newMsg);
            });
        }
    }, [activeConversation?.id, connectAndSubscribe, appendMessage, setMessages, setIsLoadingMessages]);

    // 3. Tự động cuộn xuống
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeConversation) return;

        sendMessage(activeConversation.id, inputValue);
        setInputValue("");
    };

    if (!user) return null; // Không hiện widget nếu chưa login

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <FaRobot className="text-white text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Hỗ trợ Học viên</h3>
                                    <span className="text-emerald-100 text-xs">
                                        {activeConversation ? 'Đang kết nối với Giảng viên' : 'Chọn một cuộc trò chuyện'}
                                    </span>
                                </div>
                            </div>
                            <button onClick={closeChat} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto">
                            {!activeConversation ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                    <FaRobot className="text-4xl text-slate-300 mb-2" />
                                    <p className="text-slate-500 text-sm">Chào {user.fullName}! Hãy bắt đầu trò chuyện với giảng viên của bạn.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg) => {
                                        const isMe = msg.senderId === user.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                                                    isMe ? 'bg-emerald-600 text-white rounded-tr-none' 
                                                         : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-slate-100">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={activeConversation ? "Nhập tin nhắn..." : "Vui lòng chọn hội thoại..."}
                                    disabled={!activeConversation}
                                    className="flex-1 bg-slate-100 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || !activeConversation}
                                    className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all ${
                    isOpen ? 'bg-slate-800' : 'bg-white border-2 border-emerald-500'
                }`}
            >
                {isOpen ? (
                    <FaTimes className="text-white text-2xl" />
                ) : (
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                        alt="Chat"
                        className="w-12 h-12 object-contain"
                    />
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;