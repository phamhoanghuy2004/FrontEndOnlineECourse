// src/context/ChatContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Khởi tạo Context
const ChatContext = createContext();

// 2. Tạo Provider
export const ChatProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Các hàm tiện ích
    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen(prev => !prev);

    return (
        <ChatContext.Provider value={{ isOpen, setIsOpen, openChat, closeChat, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
};

// 3. Hook để dùng nhanh ở các component khác
export const useChat = () => {
    return useContext(ChatContext);
};