import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  FaTimes, FaPaperPlane, FaRobot  } from "react-icons/fa";
import { useChat } from '../../hooks/useChat';

const ChatWidget = () => {
    const { isOpen, toggleChat, closeChat } = useChat();
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([
        { id: 1, text: "Chào bạn! Tôi là trợ lý AI của Echill. Tôi có thể giúp gì cho bạn hôm nay?", sender: 'bot' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Xử lý gửi tin nhắn
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // 1. Thêm tin nhắn của User
        const newUserMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // 2. Giả lập Bot trả lời sau 1.5s
        setTimeout(() => {
            const newBotMsg = {
                id: Date.now() + 1,
                text: "Cảm ơn bạn đã nhắn tin. Hệ thống đã ghi nhận và tư vấn viên sẽ phản hồi sớm nhất!",
                sender: 'bot'
            };
            setMessages(prev => [...prev, newBotMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">

            {/* --- CHAT WINDOW --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-[350px] h-[450px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <FaRobot className="text-white text-lg" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Hỗ trợ trực tuyến</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                                        <span className="text-emerald-100 text-xs">Thường trả lời ngay</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeChat}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user'
                                                ? 'bg-emerald-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                    className="flex-1 bg-gray-100 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- TOGGLE BUTTON (FAB) --- */}
            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50
        ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-white border-2 border-emerald-500'}
    `}
            >
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
                    {/* State 1: Ảnh Mascot (Khi đóng) */}
                    <motion.div
                        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.5 : 1 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" // Ảnh Robot 3D mẫu
                            alt="Support"
                            className="w-full h-full object-cover p-1"
                        />
                    </motion.div>

                    {/* State 2: Icon Đóng (Khi mở) */}
                    <motion.div
                        animate={{ opacity: isOpen ? 1 : 0, rotate: isOpen ? 0 : -90, scale: isOpen ? 1 : 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <FaTimes className="text-white text-2xl" />
                    </motion.div>
                </div>

                {/* Ping Animation: Đổi sang màu xanh cho hợp */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;