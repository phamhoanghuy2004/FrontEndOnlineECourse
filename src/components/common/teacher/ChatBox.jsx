import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMinus, FaPaperPlane, FaSmile, FaImage, FaPaperclip } from 'react-icons/fa';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../hooks/useAuth';
import chatApi from '../../../api/chatApi';

const ChatBox = () => {
    const { 
        isChatBoxOpen, closeChatBox, activeConversation, 
        messages, setMessages, appendMessage, 
        connectAndSubscribe, disconnect, sendMessage 
    } = useChat();
    const { user } = useAuth();
    const [inputText, setInputText] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isChatBoxOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isChatBoxOpen, isMinimized]);

    // Load initial messages and connect WS
    useEffect(() => {
        if (isChatBoxOpen && activeConversation) {
            // 1. Fetch old messages
            const fetchMessages = async () => {
                try {
                    const response = await chatApi.getMessages(activeConversation.id, 0, 50);
                    // Tin nhắn từ API đang là mới nhất trước (DESC), cần reverse để hiển thị
                    setMessages([...response.data.content].reverse());
                } catch (error) {
                    console.error("Lỗi khi tải tin nhắn:", error);
                }
            };
            fetchMessages();

            // 2. Connect WebSocket & Subscribe
            connectAndSubscribe(activeConversation.id, (newMsg) => {
                appendMessage(newMsg);
            });
        }

        // Không disconnect ở đây vì có thể user chỉ đóng popup tạm thời
        // Disconnect nên được xử lý ở logout hoặc khi chuyển page lớn
    }, [isChatBoxOpen, activeConversation, connectAndSubscribe, setMessages, appendMessage]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeConversation) return;

        sendMessage(activeConversation.id, inputText);
        setInputText("");
    };

    if (!isChatBoxOpen || !activeConversation) return null;

    const otherMember = activeConversation.participants?.[0] || {};

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[999] overflow-hidden transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[550px]'}`}
            >
                {/* Header */}
                <div className="p-4 bg-emerald-600 text-white flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img 
                                src={otherMember.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember.fullName || 'User')}&background=random&color=fff`} 
                                alt={otherMember.fullName} 
                                className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" 
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-600 rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm truncate max-w-[150px]">{otherMember.fullName}</h3>
                            <p className="text-[10px] text-emerald-100 uppercase tracking-wider font-medium">{otherMember.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FaMinus size={14} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); closeChatBox(); }} 
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg) => {
                                const isMe = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                            isMe ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                                        }`}>
                                            {msg.content}
                                            <div className={`mt-1 text-[9px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-end gap-2">
                            <div className="flex gap-1 mb-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><FaPaperclip size={14}/></button>
                                <button type="button" className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><FaImage size={14}/></button>
                            </div>
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
                                    }
                                }}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 bg-slate-50 border-none rounded-xl p-2.5 text-sm focus:ring-1 focus:ring-emerald-500 resize-none max-h-24 min-h-[40px]"
                                rows="1"
                            />
                            <button 
                                type="submit"
                                disabled={!inputText.trim()}
                                className={`p-3 rounded-xl transition-all shadow-md ${
                                    inputText.trim() ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <FaPaperPlane size={14} />
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatBox;
