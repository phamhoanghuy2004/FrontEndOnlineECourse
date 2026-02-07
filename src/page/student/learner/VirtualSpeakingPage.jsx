import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaMicrophone, FaMicrophoneSlash, 
    FaPhoneSlash, FaComments, FaLightbulb, FaRobot, FaUser, FaPaperPlane, FaTimes
} from 'react-icons/fa';

// Import Component Common
import Button from '../../../components/common/Button';

// --- MOCK DATA ---
const TOPICS = [
    { 
        id: 1, 
        title: "IELTS Speaking Part 1", 
        description: "Làm quen với các câu hỏi về bản thân, gia đình, sở thích.", 
        level: "Beginner", 
        avatar: "https://img.freepik.com/free-photo/portrait-young-businesswoman-holding-eyeglasses-hand-against-gray-backdrop_23-2148029483.jpg" 
    },
    { 
        id: 2, 
        title: "Debate: AI Technology", 
        description: "Tranh luận về lợi ích và tác hại của AI.", 
        level: "Advanced", 
        avatar: "https://img.freepik.com/free-photo/handsome-young-man-with-new-stylish-haircut_176420-19637.jpg" 
    },
    { 
        id: 3, 
        title: "Roleplay: At the Airport", 
        description: "Đóng vai làm thủ tục check-in và hải quan.", 
        level: "Intermediate", 
        avatar: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg" 
    },
];

const INITIAL_MESSAGES = [
    { id: 1, sender: 'ai', text: "Hello Nguyen Van A! I'm your AI Tutor today." },
    { id: 2, sender: 'ai', text: "We are going to practice IELTS Speaking Part 1. Are you ready to start?" },
];

const HINT_SUGGESTION = "Yes, I'm ready. I'd love to talk about my hobbies."; 

// --- COMPONENT AUDIO WAVE ---
const AudioWave = ({ isActive }) => (
    <div className="flex items-center justify-center gap-1 h-8">
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                animate={isActive ? { height: [5, 25, 5], opacity: 1 } : { height: 4, opacity: 0.3 }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                className="w-1.5 bg-emerald-400 rounded-full"
            />
        ))}
    </div>
);

// --- MAIN PAGE ---
const VirtualSpeakingPage = () => {
    // State
    const [isInSession, setIsInSession] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [messages, setMessages] = useState([]);
    
    // State cho Controls
    const [micOn, setMicOn] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false); 
    const [showHint, setShowHint] = useState(false); 
    const [inputText, setInputText] = useState(""); 

    const chatContainerRef = useRef(null);

    // Auto scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle Join/Leave
    const handleJoinRoom = (topic) => {
        setSelectedTopic(topic);
        setMessages(INITIAL_MESSAGES);
        setIsInSession(true);
    };

    const handleEndCall = () => {
        setIsInSession(false);
        setSelectedTopic(null);
        setMicOn(false);
        setIsChatMode(false);
        setShowHint(false);
    };

    // Hàm gửi tin nhắn
    const sendMessage = (text) => {
        if (!text.trim()) return;

        const newUserMsg = { id: Date.now(), sender: 'user', text: text };
        setMessages(prev => [...prev, newUserMsg]);
        setInputText(""); 
        setShowHint(false); 

        // AI Trả lời giả lập
        setTimeout(() => {
            const newAiMsg = { id: Date.now() + 1, sender: 'ai', text: "That sounds interesting! Can you tell me more?" };
            setMessages(prev => [...prev, newAiMsg]);
        }, 1500);
    };

    // Logic Voice
    const toggleMic = () => {
        if (!micOn) {
            setMicOn(true);
            setTimeout(() => {
                sendMessage("Yes, I am ready. Let's talk about hobbies.");
                setMicOn(false);
            }, 2000);
        } else {
            setMicOn(false);
        }
    };

    // Logic dùng Gợi ý
    const useHint = () => {
        sendMessage(HINT_SUGGESTION);
    };

    return (
        <div className="min-h-screen bg-transparent pb-20">
            <AnimatePresence mode='wait'>
                {!isInSession ? (
                    /* --- 1. LOBBY VIEW (Giữ nguyên) --- */
                    <motion.div 
                        key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Phòng Luyện Nói Ảo 🎙️</h2>
                            <p className="text-slate-500">Chọn một chủ đề hoặc AI Tutor để bắt đầu luyện tập ngay.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TOPICS.map((topic) => (
                                <div key={topic.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={topic.avatar} alt="AI Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-emerald-400 transition-colors" />
                                        <div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${topic.level === 'Beginner' ? 'bg-green-100 text-green-600' : topic.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{topic.level}</span>
                                            <h3 className="text-lg font-bold text-slate-800 mt-1">{topic.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6 flex-1">{topic.description}</p>
                                    <Button onClick={() => handleJoinRoom(topic)} className="w-full !rounded-xl !text-sm">Bắt đầu nói</Button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* --- 2. ACTIVE SESSION VIEW --- */
                    <motion.div 
                        key="room" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-[85vh] flex flex-col gap-4 max-w-5xl mx-auto"
                    >
                        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col relative">
                            
                            {/* A. AI HEADER (Giữ nguyên) */}
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-6 z-10 shadow-sm">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <img src={selectedTopic?.avatar} alt="AI Tutor" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full border-2 border-white">ONLINE</div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-800">{selectedTopic?.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-500 font-medium">AI Tutor is listening...</span>
                                        <AudioWave isActive={micOn} />
                                    </div>
                                </div>
                            </div>

                            {/* B. CHAT HISTORY LIST */}
                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth relative">
                                {messages.map((msg) => {
                                    const isAi = msg.sender === 'ai';
                                    return (
                                        <motion.div 
                                            key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-sm border border-white ${isAi ? 'bg-white' : 'bg-emerald-100'}`}>
                                                    {isAi ? <img src={selectedTopic?.avatar} className="w-full h-full rounded-full object-cover" /> : <FaUser className="text-emerald-600" />}
                                                </div>
                                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${isAi ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' : 'bg-emerald-500 text-white rounded-tr-none shadow-emerald-200'}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                {micOn && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end w-full"><div className="text-xs text-slate-400 italic pr-12">Đang nói...</div></motion.div>)}
                            </div>

                            {/* C. BOTTOM CONTROLS */}
                            <div className="bg-white p-4 border-t border-slate-100 flex items-center justify-between gap-4 relative z-20">
                                
                                {/* Left: Settings (VỊ TRÍ MỚI CỦA HINT POPUP) */}
                                <div className="flex gap-2 relative">
                                    {/* --- POPUP GỢI Ý --- */}
                                    <AnimatePresence>
                                        {showHint && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                // Position absolute: Neo vào nút bấm bên dưới
                                                // bottom-[120%]: Đẩy lên trên nút bấm 1 khoảng
                                                // w-72: Chiều rộng cố định
                                                className="absolute bottom-[120%] left-0 w-80 bg-white border border-yellow-200 rounded-2xl shadow-2xl p-4 z-50 origin-bottom-left"
                                            >
                                                {/* Mũi tên trỏ xuống (Optional Decoration) */}
                                                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-yellow-200 transform rotate-45"></div>

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-yellow-600">
                                                            <FaLightbulb /> Gợi ý trả lời:
                                                        </div>
                                                        <button onClick={() => setShowHint(false)} className="text-slate-400 hover:text-slate-600">
                                                            <FaTimes size={12} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div 
                                                        className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 text-slate-700 text-sm italic cursor-pointer hover:bg-yellow-100 transition-colors group"
                                                        onClick={useHint}
                                                    >
                                                        "{HINT_SUGGESTION}"
                                                        <div className="mt-2 text-[10px] text-yellow-600 font-bold text-right group-hover:underline">
                                                            Nhấn để dùng
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Nút Chat */}
                                    <button 
                                        onClick={() => setIsChatMode(!isChatMode)}
                                        className={`p-3 rounded-xl transition-colors ${isChatMode ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                        title="Chuyển sang chế độ chat"
                                    >
                                        <FaComments />
                                    </button>

                                    {/* Nút Gợi ý */}
                                    <button 
                                        onClick={() => setShowHint(!showHint)}
                                        className={`p-3 rounded-xl transition-colors ${showHint ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                        title="Hiện gợi ý"
                                    >
                                        <FaLightbulb />
                                    </button>
                                </div>

                                {/* Center: MIC or INPUT */}
                                <div className="flex-1 flex justify-center">
                                    {isChatMode ? (
                                        <form 
                                            className="w-full max-w-2xl flex gap-2"
                                            onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
                                        >
                                            <input 
                                                type="text" 
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                placeholder="Nhập câu trả lời của bạn..."
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                autoFocus
                                            />
                                            <button type="submit" className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">
                                                <FaPaperPlane />
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="relative">
                                            {micOn && (<span className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></span>)}
                                            <button 
                                                onClick={toggleMic}
                                                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all transform hover:scale-105 ${micOn ? 'bg-emerald-500 text-white shadow-emerald-300' : 'bg-white text-slate-700 border border-slate-100 hover:border-emerald-200'}`}
                                            >
                                                {micOn ? <FaMicrophone className="animate-pulse" /> : <FaMicrophoneSlash />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Right: End Call */}
                                <div>
                                    <button onClick={handleEndCall} className="px-6 py-3 rounded-xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-colors flex items-center gap-2 text-sm">
                                        <FaPhoneSlash /> <span className="hidden sm:inline">Kết thúc</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VirtualSpeakingPage;