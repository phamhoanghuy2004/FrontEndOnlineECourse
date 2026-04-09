import { useState, useEffect } from 'react';
import {
    FaArrowLeft, FaSave, FaTrash, FaCheck, FaTimes, FaEdit, FaClock,
    FaPlus, FaLightbulb, FaTag, FaBrain, FaRegCircle, FaCheckCircle,
    FaSpinner, FaBookOpen
} from 'react-icons/fa';
import Button from '../Button';
import testApi from '../../../api/testApi';

const TestQuestionManager = ({ testId, onBack, onUpdateSuccess }) => {
    const [test, setTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(null);
    const [editStates, setEditStates] = useState({});

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

    const handleSaveTestInfo = async () => {
        setIsSavingInfo(true);
        try {
            const response = await testApi.updateTestInfo(testId, editTestInfo);
            const updatedData = response.data?.data || response.data;
            setTest(updatedData);
            setIsEditingInfo(false);
            if (onUpdateSuccess) onUpdateSuccess();
            alert("Đã cập nhật thông tin bài test!");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin test:", error);
            alert("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
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
            alert("Đã lưu thay đổi câu hỏi!");
        } catch (error) {
            console.error("Lỗi khi lưu câu hỏi:", error);
            alert("Lỗi khi lưu thay đổi: " + (error.response?.data?.message || error.message));
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
        </div>
    );
};

export default TestQuestionManager;