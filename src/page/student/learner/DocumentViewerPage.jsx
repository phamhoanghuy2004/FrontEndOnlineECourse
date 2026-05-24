import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    FaArrowLeft, FaSpinner, FaPaperPlane, FaBook,
    FaRobot, FaUser, FaInfoCircle, FaDownload
} from 'react-icons/fa';
import lessonApi from '../../../api/lessonApi';
import { toast } from 'react-toastify';

const DocumentViewerPage = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [documentDetail, setDocumentDetail] = useState(location.state?.doc || null);
    const [loadingDoc, setLoadingDoc] = useState(!documentDetail);

    // Chat state
    const [chatHistory, setChatHistory] = useState([
        {
            sender: 'bot',
            text: 'Xin chào! Tôi là trợ lý học tập AI. Bạn có thể hỏi tôi bất kỳ điều gì liên quan đến tài liệu này.'
        }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);

    const chatEndRef = useRef(null);

    // Fetch document details if not passed via state
    useEffect(() => {
        const fetchDoc = async () => {
            try {
                setLoadingDoc(true);
                const response = await lessonApi.getDocumentDetail(documentId);
                setDocumentDetail(response.data || response);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết tài liệu:", error);
                toast.error("Không thể tải tài liệu. Vui lòng thử lại!");
            } finally {
                setLoadingDoc(false);
            }
        };

        if (!documentDetail && documentId) {
            fetchDoc();
        }
    }, [documentId, documentDetail]);

    // Scroll chat to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, sendingMsg]);

    const handleSendChat = async () => {
        const trimmed = inputMsg.trim();
        if (!trimmed) return;

        setChatHistory(prev => [...prev, { sender: 'user', text: trimmed }]);
        setInputMsg('');
        setSendingMsg(true);

        try {
            const response = await lessonApi.chatWithDocument(documentId, trimmed);
            const aiAnswer = response.data?.data?.answer || response.data?.answer || response.answer || "Không nhận được phản hồi từ AI.";
            setChatHistory(prev => [...prev, { sender: 'bot', text: aiAnswer }]);
        } catch (error) {
            console.error("Lỗi khi chat với AI:", error);
            const errorMsg = error.response?.data?.message || "Lỗi kết nối máy chủ AI.";
            setChatHistory(prev => [...prev, { sender: 'bot', text: `❌ Lỗi: ${errorMsg}` }]);
        } finally {
            setSendingMsg(false);
        }
    };

    if (loadingDoc) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <FaSpinner className="animate-spin text-emerald-500 text-4xl mb-4" />
                <span className="text-slate-600 font-bold">Đang tải tài liệu học tập...</span>
            </div>
        );
    }

    if (!documentDetail) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <span className="text-red-500 font-bold mb-4">Không tìm thấy tài liệu!</span>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-500"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col font-sans overflow-hidden bg-slate-100">

            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
                    >
                        <FaArrowLeft />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-base font-extrabold text-slate-800 truncate flex items-center gap-2">
                            <FaBook className="text-emerald-500 shrink-0 text-sm" />
                            {documentDetail.title}
                        </h1>
                        <span className="text-[11px] text-slate-500 font-medium">Đọc tài liệu và thảo luận cùng AI</span>
                    </div>
                </div>

                <a
                    href={documentDetail.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-sm font-bold transition-all shrink-0"
                >
                    <FaDownload className="text-xs" /> Tải xuống PDF
                </a>
            </div>

            {/* MAIN CONTENT SPLIT LAYOUT */}
            <div className="flex-1 flex flex-row overflow-hidden min-h-0">

                {/* LEFT: PDF VIEWER */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0 p-4">
                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                        {documentDetail.fileUrl ? (
                            <iframe
                                src={`${documentDetail.fileUrl}#toolbar=0&navpanes=0`}
                                title={documentDetail.title}
                                className="w-full flex-1 border-none"
                                style={{ minHeight: 0 }}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
                                <FaInfoCircle className="text-4xl" />
                                <span>Tài liệu không khả dụng để hiển thị trực tuyến.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: AI CHAT ASSISTANT */}
                <div className="w-[400px] bg-white flex flex-col shrink-0 border-l border-slate-200 shadow-lg overflow-hidden">

                    {/* Chat Header */}
                    <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-slate-50 flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shrink-0">
                            <FaRobot className="text-sm" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 leading-tight">AI Assistant</h3>
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                                Llama 3.1 Online
                            </span>
                        </div>
                    </div>

                    {/* Chat History Panel */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 min-h-0">
                        {chatHistory.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="flex items-start gap-2 max-w-[88%]">
                                    {msg.sender === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs mt-0.5">
                                            <FaRobot />
                                        </div>
                                    )}
                                    <div
                                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                            msg.sender === 'user'
                                                ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                                                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.sender === 'user' && (
                                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                                            <FaUser />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {sendingMsg && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-2 max-w-[88%]">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs mt-0.5">
                                        <FaRobot />
                                    </div>
                                    <div className="px-3.5 py-3 rounded-2xl bg-white border border-slate-200 rounded-bl-none shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        <span className="ml-1 text-slate-400 text-xs font-medium">AI đang suy nghĩ...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 border-t border-slate-100 shrink-0 bg-white">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendChat();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                placeholder="Hỏi AI bất kỳ điều gì về tài liệu..."
                                disabled={sendingMsg}
                                className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={sendingMsg || !inputMsg.trim()}
                                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center shadow-md transition-all shrink-0"
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentViewerPage;
