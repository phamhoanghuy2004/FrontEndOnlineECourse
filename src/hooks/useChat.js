import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export const useChat = () => {
    const context = useContext(ChatContext);
    
    // Kiểm tra nếu dùng hook ngoài ChatProvider thì báo lỗi ngay
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    
    return context;
};