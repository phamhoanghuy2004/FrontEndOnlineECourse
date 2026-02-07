import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion'; // Đã bỏ AnimatePresence
import { 
    FaSearch, FaPaperPlane, FaPhoneAlt, FaVideo, 
    FaEllipsisV, FaImage, FaPaperclip, FaSmile, FaCheckDouble, FaCircle
} from 'react-icons/fa';

// Import Component Common
import InputField from '../../../components/common/InputField';

// --- MOCK DATA ---
const CONVERSATIONS = [
    { 
        id: 1, 
        name: "Admin Support", 
        role: "Admin", 
        avatar: "https://ui-avatars.com/api/?name=Admin+Support&background=10b981&color=fff", 
        lastMessage: "Vấn đề thanh toán của bạn đã được xử lý.", 
        time: "10:30 AM", 
        unread: 2, 
        online: true 
    },
    { 
        id: 2, 
        name: "Ms. Hoa TOEIC", 
        role: "Instructor", 
        avatar: "https://i.pravatar.cc/150?img=1", 
        lastMessage: "Em nhớ làm bài tập về nhà nhé!", 
        time: "Hôm qua", 
        unread: 0, 
        online: false 
    },
    { 
        id: 3, 
        name: "Mr. David IELTS", 
        role: "Instructor", 
        avatar: "https://i.pravatar.cc/150?img=11", 
        lastMessage: "Great job on the speaking test!", 
        time: "T2", 
        unread: 0, 
        online: true 
    },
];

const INITIAL_CHAT_HISTORY = [
    { id: 1, sender: 'other', text: "Chào bạn, mình là Admin. Bạn cần hỗ trợ gì không?", time: "10:00 AM" },
    { id: 2, sender: 'me', text: "Mình muốn hỏi về khóa học TOEIC 450+ ạ.", time: "10:05 AM" },
    { id: 3, sender: 'other', text: "Khóa đó hiện đang có ưu đãi 20% đó bạn.", time: "10:06 AM" },
    { id: 4, sender: 'other', text: "Vấn đề thanh toán của bạn đã được xử lý.", time: "10:30 AM" },
];

// --- COMPONENT: Chat Message Bubble ---
const MessageBubble = ({ msg, isMe }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
        <div className={`flex max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar (Chỉ hiện cho người khác) */}
            {!isMe && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-slate-100">
                    <img src="https://ui-avatars.com/api/?name=Admin+Support&background=10b981&color=fff" alt="Avatar" className="w-full h-full object-cover" />
                </div>
            )}

            <div>
                {/* Bubble */}
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group
                    ${isMe 
                        ? 'bg-emerald-500 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}
                >
                    {msg.text}
                    
                    {/* Time Tooltip (Hover mới hiện) */}
                    <div className={`absolute bottom-0 text-[9px] opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap mb-1
                        ${isMe ? 'right-full mr-2 text-slate-400' : 'left-full ml-2 text-slate-400'}`}
                    >
                        {msg.time}
                    </div>
                </div>
                
                {/* Status Icon (Chỉ hiện cho mình) */}
                {isMe && (
                    <div className="text-[10px] text-emerald-600 flex justify-end mt-1 gap-1 items-center opacity-70">
                        Đã xem <FaCheckDouble />
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

// --- MAIN PAGE ---
const LearnerChatPage = () => {
    const [activeChatId, setActiveChatId] = useState(1);
    const [messages, setMessages] = useState(INITIAL_CHAT_HISTORY);
    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const activeConversation = CONVERSATIONS.find(c => c.id === activeChatId);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: 'me',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setInputText("");
    };

    return (
        <div className="h-[calc(100vh-140px)] bg-transparent flex gap-6 pb-6">
            
            {/* --- LEFT SIDEBAR: CONVERSATION LIST --- */}
            <div className="w-full md:w-80 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                
                {/* Header Sidebar */}
                <div className="p-5 border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Tin nhắn</h2>
                    <InputField 
                        placeholder="Tìm kiếm..." 
                        icon={FaSearch} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="compact"
                        className="!mb-0 !bg-slate-50 !border-transparent focus:!bg-white focus:!border-emerald-200"
                    />
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    {CONVERSATIONS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((chat) => (
                        <div 
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200
                                ${activeChatId === chat.id 
                                    ? 'bg-emerald-50 border border-emerald-100 shadow-sm' 
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                {chat.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-emerald-900' : 'text-slate-700'}`}>
                                        {chat.name}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                                    {chat.role === 'Admin' && <span className="bg-red-100 text-red-600 px-1 rounded mr-1 text-[9px] font-bold uppercase">Admin</span>}
                                    {chat.lastMessage}
                                </p>
                            </div>

                            {/* Unread Badge */}
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-red-200 shadow-lg">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT MAIN: CHAT WINDOW --- */}
            <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
                
                {/* 1. Chat Header */}
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={activeConversation?.avatar} alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                            {activeConversation?.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                {activeConversation?.name}
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider 
                                    ${activeConversation?.role === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {activeConversation?.role}
                                </span>
                            </h3>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                {activeConversation?.online ? <><FaCircle size={6} className="text-green-500" /> Đang hoạt động</> : 'Truy cập 1 giờ trước'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                        <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors hover:text-emerald-600"><FaPhoneAlt size={14} /></button>
                        <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors hover:text-emerald-600"><FaVideo size={16} /></button>
                        <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors hover:text-slate-600"><FaEllipsisV size={14} /></button>
                    </div>
                </div>

                {/* 2. Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 scroll-smooth">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} isMe={msg.sender === 'me'} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* 3. Input Area */}
                <div className="p-4 bg-white border-t border-slate-50">
                    <form 
                        onSubmit={handleSendMessage}
                        className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all"
                    >
                        {/* Attachments & Emoji (Đã thêm FaSmile) */}
                        <div className="flex gap-1 pb-2 pl-2">
                            <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"><FaPaperclip size={16}/></button>
                            <button type="button" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"><FaImage size={16}/></button>
                            <button type="button" className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-white rounded-lg transition-colors"><FaSmile size={16}/></button>
                        </div>

                        {/* Text Input */}
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
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400 resize-none py-3 max-h-32 min-h-[44px]"
                            rows="1"
                        />

                        {/* Send Button */}
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

            </div>
        </div>
    );
};

export default LearnerChatPage;