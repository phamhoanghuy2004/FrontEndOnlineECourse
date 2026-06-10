import { useState, useEffect } from 'react';
import React from 'react';
import {
    FaArrowLeft, FaSave, FaTrash, FaCheck, FaTimes, FaEdit, FaClock,
    FaPlus, FaLightbulb, FaTag, FaBrain, FaRegCircle, FaCheckCircle,
    FaSpinner, FaBookOpen, FaHeadphones, FaImage, FaCloudUploadAlt, FaTimesCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../Button';
import testApi from '../../../api/testApi';

import { toast } from 'react-toastify';
const TestQuestionManager = ({ testId, onBack, onUpdateSuccess }) => {
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(null);
    const [editStates, setEditStates] = useState({});

    const [uploading, setUploading] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editTestInfo, setEditTestInfo] = useState({
        title: '',
        durationMinutes: 0,
        passScore: 0
    });
    const [isSavingInfo, setIsSavingInfo] = useState(false);

    useEffect(() => {
        if (testId) {
            fetchTestDetails();
        }
    }, [testId]);

    const fetchTestDetails = async () => {
        setIsLoading(true);
        try {
            const response = await testApi.getTestById(testId);
            const data = response.data?.data || response.data;

            // LẤY CÂU HỎI TỪ SECTIONS VÀ TRẢI PHẲNG (FLATTEN) RA
            const allQuestions = (data.sections || []).flatMap(section => section.questions || []);

            // Sắp xếp lại theo orderIndex cho chắc chắn
            allQuestions.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            setTest(data);
            setQuestions(allQuestions);
            setEditTestInfo({
                title: data.title || '',
                durationMinutes: data.durationMinutes || 0,
                passScore: data.passScore || 0
            });

            const initialEditStates = {};
            allQuestions.forEach(q => {
                initialEditStates[q.id] = { ...q };
            });
            setEditStates(initialEditStates);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết bài test:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMediaUpload = async (targetId, type, file) => {
        if (!file) return;
        
        const uploadKey = `${targetId}-${type}`;
        setUploading(uploadKey);
        
        try {
            if (type === 'q-audio') await testApi.uploadQuestionAudio(targetId, file);
            else if (type === 'q-image') await testApi.uploadQuestionImage(targetId, file);
            
            toast.success("Tải lên thành công!");
            fetchTestDetails(); // fetch lại data để có url mới
        } catch (error) {
            console.error("Lỗi khi tải lên file", error);
            toast.error("Lỗi khi tải lên file");
        } finally {
            setUploading(null);
        }
    };

    const handleSaveTestInfo = async () => {
        setIsSavingInfo(true);
        try {
            const response = await testApi.updateTestInfo(testId, editTestInfo);
            const updatedData = response.data?.data || response.data;
            setTest(updatedData);
            setIsEditingInfo(false);
            if (onUpdateSuccess) onUpdateSuccess();
            toast.success("Đã cập nhật thông tin bài test!");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin test:", error);
            toast.error("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSavingInfo(false);
        }
    };

    const handleFieldChange = (questionId, field, value) => {
        setEditStates(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [field]: value
            }
        }));
    };

    const handleAnswerChange = (questionId, index, field, value) => {
        const question = editStates[questionId];
        const newAnswers = [...question.answers];
        newAnswers[index] = { ...newAnswers[index], [field]: value };

        if (field === 'isCorrect' && value === true) {
            newAnswers.forEach((ans, i) => {
                if (i !== index) ans.isCorrect = false;
            });
        }

        handleFieldChange(questionId, 'answers', newAnswers);
    };

    const handleSaveQuestion = async (questionId) => {
        setIsSaving(questionId);
        try {
            const questionData = editStates[questionId];
            await testApi.updateQuestion(questionId, {
                content: questionData.content,
                explanation: questionData.explanation,
                skillType: questionData.skillType,
                tagName: questionData.tagName,
                answers: questionData.answers.map(a => ({
                    id: a.id,
                    content: a.content,
                    isCorrect: a.isCorrect
                }))
            });

            setQuestions(prev => prev.map(q => q.id === questionId ? { ...questionData } : q));
            if (onUpdateSuccess) onUpdateSuccess();
            toast.success("Đã lưu thay đổi câu hỏi!");
        } catch (error) {
            console.error("Lỗi khi lưu câu hỏi:", error);
            toast.error("Lỗi khi lưu thay đổi: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSaving(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
                <p className="text-slate-500 font-medium">Đang tải nội dung bài test...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* Header */}
            <div className="flex flex-col bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                        >
                            <FaArrowLeft />
                        </button>
                        {isEditingInfo ? (
                            <div className="flex flex-col gap-2 min-w-[300px]">
                                <input
                                    className="text-lg font-bold text-slate-800 border-b border-indigo-200 outline-none focus:border-indigo-500 bg-transparent"
                                    value={editTestInfo.title}
                                    onChange={(e) => setEditTestInfo({ ...editTestInfo, title: e.target.value })}
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                    placeholder="Tên bài test"
                                />
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-slate-400" size={12} />
                                        <input
                                            type="number"
                                            className="w-16 text-xs font-bold text-slate-600 outline-none border-b border-slate-200"
                                            value={editTestInfo.durationMinutes}
                                            onChange={(e) => setEditTestInfo({ ...editTestInfo, durationMinutes: parseInt(e.target.value) })}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Phút</span>
                                    </div>
                                    <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                                        <FaCheckCircle className="text-slate-400" size={12} />
                                        <input
                                            type="number"
                                            className="w-16 text-xs font-bold text-slate-600 outline-none border-b border-slate-200"
                                            value={editTestInfo.passScore}
                                            onChange={(e) => setEditTestInfo({ ...editTestInfo, passScore: parseFloat(e.target.value) })}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                        />
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-slate-800 text-lg leading-none">{test?.title}</h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingInfo(true)}
                                        className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors"
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                        <FaClock size={10} /> {test?.durationMinutes} Phút
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                        <FaCheckCircle size={10} /> Target: {test?.passScore}%
                                    </p>
                                    <p className="text-xs text-slate-500 font-bold ml-2">
                                        {questions.length} câu hỏi
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    {isEditingInfo && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditingInfo(false)}
                                className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Hủy
                            </button>
                            <Button
                                onClick={handleSaveTestInfo}
                                disabled={isSavingInfo}
                                className="!py-1.5 !px-4 !text-xs"
                            >
                                {isSavingInfo ? <FaSpinner className="animate-spin" /> : <FaSave size={12} />}
                                Lưu thông tin
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {questions.map((q, idx) => {
                    const editQ = editStates[q.id];
                    const isDirty = JSON.stringify(q) !== JSON.stringify(editQ);

                    return (
                        <div key={q.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            {/* Question Header */}
                            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Câu hỏi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isDirty && (
                                        <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                                            Chưa lưu
                                        </span>
                                    )}
                                    <Button
                                        onClick={() => handleSaveQuestion(q.id)}
                                        disabled={isSaving === q.id || !isDirty}
                                        className={`!py-1.5 !px-3 !text-xs flex items-center gap-2 ${isDirty ? '!bg-indigo-600 !text-white' : '!bg-slate-100 !text-slate-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSaving === q.id ? <FaSpinner className="animate-spin" /> : <FaSave size={12} />}
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="p-6 space-y-6">
                                {/* NẾU CÓ ĐOẠN VĂN DÙNG CHUNG (GROUP) THÌ HIỂN THỊ Ở ĐÂY */}
                                {editQ.group?.sharedContent && (
                                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-sm text-blue-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaBookOpen className="text-blue-500" />
                                            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">Đoạn văn dùng chung</span>
                                        </div>
                                        <p className="whitespace-pre-wrap leading-relaxed">{editQ.group.sharedContent}</p>
                                    </div>
                                )}

                                {/* Content Editor */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Nội dung câu hỏi</label>
                                    <textarea
                                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none min-h-[100px]"
                                        value={editQ.content}
                                        onChange={(e) => handleFieldChange(q.id, 'content', e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) e.stopPropagation(); }}
                                        placeholder="Nhập nội dung câu hỏi..."
                                    />
                                    
                                    <div className="flex gap-2 ml-1 mt-2">
                                        <MediaUploadButton 
                                            icon={<FaHeadphones />} 
                                            url={editQ.audioUrl || q.audioUrl}
                                            isAudio
                                            compact
                                            onUpload={(file) => handleMediaUpload(q.id, 'q-audio', file)}
                                            uploading={uploading === `${q.id}-q-audio`}
                                        />
                                        <MediaUploadButton 
                                            icon={<FaImage />} 
                                            url={editQ.imageUrl || q.imageUrl}
                                            compact
                                            onUpload={(file) => handleMediaUpload(q.id, 'q-image', file)}
                                            uploading={uploading === `${q.id}-q-image`}
                                            onPreviewImage={setSelectedImage}
                                        />
                                    </div>
                                </div>

                                {/* Answers Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {editQ.answers.map((ans, aIdx) => (
                                        <div key={aIdx} className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${ans.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'
                                            }`}>
                                            <button
                                                type="button"
                                                onClick={() => handleAnswerChange(q.id, aIdx, 'isCorrect', !ans.isCorrect)}
                                                className={`mt-1 transition-colors ${ans.isCorrect ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                                            >
                                                {ans.isCorrect ? <FaCheckCircle size={18} /> : <FaRegCircle size={18} />}
                                            </button>
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Đáp án {String.fromCharCode(65 + aIdx)}</label>
                                                <input
                                                    className="w-full bg-transparent border-none p-0 text-sm text-slate-700 font-bold outline-none placeholder:font-normal"
                                                    value={ans.content}
                                                    onChange={(e) => handleAnswerChange(q.id, aIdx, 'content', e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                                    placeholder="Nhập đáp án..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Metadata Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                                    {/* Explanation */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2">
                                            <FaLightbulb className="text-amber-400" /> Giải thích lời giải
                                        </label>
                                        <textarea
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none min-h-[80px]"
                                            value={editQ.explanation || ''}
                                            onChange={(e) => handleFieldChange(q.id, 'explanation', e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) e.stopPropagation(); }}
                                            placeholder="Nhập giải thích cho đáp án đúng..."
                                        />
                                    </div>

                                    {/* Skills & Tags */}
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2">
                                                <FaBrain className="text-indigo-400" /> Kỹ năng
                                            </label>
                                            <select
                                                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                value={editQ.skillType || ''}
                                                onChange={(e) => handleFieldChange(q.id, 'skillType', e.target.value)}
                                            >
                                                <option value="">Chọn kỹ năng</option>
                                                <option value="LISTENING">Listening</option>
                                                <option value="READING">Reading</option>
                                                <option value="SPEAKING">Speaking</option>
                                                <option value="WRITING">Writing</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2">
                                                <FaTag className="text-emerald-400" /> Thẻ (Tag)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    value={editQ.tagName || ''}
                                                    onChange={(e) => handleFieldChange(q.id, 'tagName', e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                                                    placeholder="Ví dụ: Grammar, Vocab..."
                                                />
                                                <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                            <button 
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all backdrop-blur-md"
                            >
                                <FaTimesCircle />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MediaUploadButton = ({ label, icon, url, isAudio, compact, onUpload, uploading, onPreviewImage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showPlayer, setShowPlayer] = useState(false);
    const audioRef = React.useRef(null);

    const toggleAudio = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!showPlayer) {
            setShowPlayer(true);
            return;
        }
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex items-center gap-1.5">
            {/* Preview Section */}
            {url && (
                <div className="flex items-center gap-1">
                    {isAudio ? (
                        <div className="flex items-center bg-emerald-50 rounded-2xl overflow-hidden transition-all duration-300">
                            <button 
                                type="button"
                                onClick={toggleAudio}
                                className={`w-9 h-9 flex items-center justify-center transition-all ${isPlaying ? 'bg-emerald-600 text-white' : 'text-emerald-600 hover:bg-emerald-100'}`}
                                title={isPlaying ? "Dừng" : "Nghe thử"}
                            >
                                {isPlaying ? <div className="w-3 h-3 bg-white rounded-sm" /> : <FaHeadphones size={14} />}
                            </button>
                            
                            <AnimatePresence>
                                {showPlayer && (
                                    <motion.div 
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 140, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="flex items-center gap-2 px-3 overflow-hidden"
                                    >
                                        <input 
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                        <span className="text-[9px] font-bold text-emerald-700 whitespace-nowrap w-8">
                                            {formatTime(currentTime)}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <audio 
                                ref={audioRef} 
                                src={url} 
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={() => setIsPlaying(false)}
                                className="hidden" 
                            />
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => onPreviewImage(url)}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all"
                            title="Xem ảnh"
                        >
                            <FaImage size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* Upload Button */}
            <div className="relative group/btn">
                <input 
                    type="file" 
                    accept={isAudio ? "audio/*" : "image/*"} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    onChange={(e) => onUpload(e.target.files[0])}
                    disabled={uploading}
                />
                <button type="button" className={`flex items-center gap-2 rounded-2xl transition-all border font-black shadow-sm ${compact ? 'p-2.5' : 'px-5 py-2.5 text-xs'} ${
                    url 
                    ? 'bg-white border-emerald-100 text-emerald-600' 
                    : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-emerald-50'
                }`}>
                    {uploading ? (
                        <div className="w-4 h-4 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {!compact && (url ? "Thay đổi" : label)}
                            {compact && (url ? <FaCloudUploadAlt size={14} /> : icon)}
                            {!compact && <FaCloudUploadAlt size={14} className="ml-0.5" />}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TestQuestionManager;