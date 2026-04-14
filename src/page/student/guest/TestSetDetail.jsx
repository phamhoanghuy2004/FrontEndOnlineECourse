import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaPlay, FaCheckCircle, FaTimesCircle, FaClock,
    FaTrophy, FaCalendarAlt, FaLock, FaBookOpen, FaSpinner,
    FaArrowLeft
} from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import testApi from '../../../api/testApi';
import { toast } from 'react-toastify';

// Hàm format thời gian
const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "00:00";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Hàm format ngày giờ
const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const TestSetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [testSetData, setTestSetData] = useState(null);
    const [loading, setLoading] = useState(true);

    const STORAGE_SESSION_KEY = `echill_session_${id}`;
    const savedSessionId = localStorage.getItem(STORAGE_SESSION_KEY);
    const hasActiveSession = !!savedSessionId;

    useEffect(() => {
        const fetchTestSetDetail = async () => {
            try {
                setLoading(true);
                const response = await testApi.getTestSetWithHistory(id);
                if (response && response.data) {
                    setTestSetData(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải bộ đề:", error);
                toast.error(error.message || "Không thể tải thông tin bài kiểm tra!");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTestSetDetail();
        }
    }, [id]);

    const handleStartTest = () => {
        navigate(`/test-practice/${id}`, {
            state: {
                testId: id,
                selectedParts: null,
                mode: 'full_test'
            }
        });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-6 pt-28 flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
                <p className="font-medium text-lg">Đang tải dữ liệu bài thi...</p>
            </div>
        );
    }

    if (!testSetData) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 md:p-6 text-center text-slate-500">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <FaBookOpen size={24} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-700 mb-2">Không tìm thấy bài kiểm tra</h2>
                    <p className="text-slate-500 text-sm mb-6">Bài kiểm tra này có thể đã bị xóa hoặc bạn không có quyền truy cập.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center gap-2 mx-auto"
                    >
                        <FaArrowLeft size={12} /> Quay lại
                    </button>
                </div>
            </div>
        );
    }



    const { title, description, year, history, maxAttempts } = testSetData;
    const limit = maxAttempts || 10;
    const attemptCount = history ? history.length : 0;
    const canAttempt = attemptCount < limit;

    return (
        // 💥 FIX 1: Chỉnh lg:h-[calc(100vh-100px)] để trừ hao thanh Header ở trên, giúp không bị cuộn cả trang web
        <div className="max-w-7xl mx-auto p-4 md:p-6 pt-24 md:pt-28 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch lg:h-[calc(100vh-100px)] lg:min-h-[650px]">

            {/* ================= CỘT TRÁI: THÔNG TIN BỘ ĐỀ (Chiếm 5 phần) ================= */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col h-full"
            >
                {/* Background trang trí */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-blue-100 text-slate-500 hover:text-blue-600 rounded-full transition-all shrink-0 border border-slate-100 hover:shadow-sm"
                            title="Quay lại bài học"
                        >
                            <FaArrowLeft size={14} />
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
                                Bài Kiểm Tra {year ? `- ${year}` : ''}
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[11px] font-bold">
                                Đã làm: {attemptCount}/{limit}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 leading-snug shrink-0">
                        {title}
                    </h1>

                    {description && (
                        // 💥 Thêm overflow-y-auto cho phần mô tả lỡ nó dài quá
                        <div
                            className="prose prose-sm prose-slate max-w-none text-slate-600 mb-6 overflow-y-auto pr-2 custom-scrollbar min-h-0"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(description.replace(/&nbsp;/g, ' '))
                            }}
                        />
                    )}

                    {/* Khu vực nút bấm đẩy xuống dưới cùng của Card */}
                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3 shrink-0">
                        {hasActiveSession ? (
                            <button
                                onClick={handleStartTest}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-amber-200 transform transition active:scale-95 flex items-center justify-center gap-3"
                            >
                                <FaClock /> TIẾP TỤC LÀM BÀI
                            </button>
                        ) : canAttempt ? (
                            <button
                                onClick={handleStartTest}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-[15px] shadow-lg shadow-blue-200 transform transition active:scale-95 flex items-center justify-center gap-3"
                            >
                                <FaPlay /> BẮT ĐẦU LÀM BÀI
                            </button>
                        ) : (
                            <div className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold text-[15px] flex items-center justify-center gap-3 cursor-not-allowed">
                                <FaLock /> HẾT LƯỢT LÀM BÀI
                            </div>
                        )}
                        <p className="text-[13px] text-center text-slate-400">
                            Hệ thống sẽ chọn ngẫu nhiên 1 đề thi để đảm bảo tính minh bạch.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ================= CỘT PHẢI: LỊCH SỬ LÀM BÀI (Chiếm 7 phần) ================= */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                // 💥 FIX 2 (QUAN TRỌNG NHẤT): Thêm 'overflow-hidden' vào container cha này
                className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden"
            >
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 shrink-0">
                    <FaBookOpen className="text-primary" /> Lịch sử của bạn
                </h2>

                {attemptCount === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 min-h-0">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-300">
                            <FaTrophy size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có dữ liệu</h3>
                        <p className="text-sm text-slate-500">Bạn chưa làm bài kiểm tra này lần nào.</p>
                    </div>
                ) : (
                    // Cục con flex-1, overflow-y-auto, min-h-0 giờ sẽ hoạt động hoàn hảo vì cha nó có overflow-hidden
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                        {history.map((result, index) => {
                            const isPassed = result.isPassed;
                            return (
                                <div
                                    key={result.id}
                                    onClick={() => navigate(`/test-results/${result.id}/review`)}
                                    className="bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md cursor-pointer transition-all rounded-2xl p-4 md:p-5 relative group"
                                >
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                                    <div className="flex flex-col xl:flex-row justify-between gap-4">
                                        <div className="pl-3 flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">LẦN {attemptCount - index}</span>
                                                <div className="flex items-center gap-1 text-[12px] text-slate-400 font-medium ml-1">
                                                    <FaCalendarAlt /> {formatDate(result.createdAt)}
                                                </div>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-800 line-clamp-2 mt-2 group-hover:text-blue-600 transition-colors">
                                                {result.testTitle}
                                            </h4>
                                            <div className="flex items-center gap-1 text-[13px] text-slate-500 mt-2 bg-slate-50 w-fit px-2 py-1 rounded">
                                                <FaClock className="text-slate-400" /> Thời gian làm bài: <span className="font-semibold text-slate-700">{formatTime(result.timeTakenSeconds)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 xl:pl-6 xl:border-l border-slate-100 pt-4 xl:pt-0 border-t xl:border-t-0 mt-2 xl:mt-0">
                                            <div className="grid grid-cols-2 gap-2 text-center w-full">
                                                {[
                                                    { label: 'Nghe', score: result.listeningScore },
                                                    { label: 'Đọc', score: result.readingScore },
                                                    { label: 'Nói', score: result.speakingScore },
                                                    { label: 'Viết', score: result.writingScore }
                                                ].map((skill, idx) => (
                                                    <div key={idx} className="bg-slate-50 rounded pl-2 pr-2 py-1 flex items-center justify-between min-w-[70px] border border-slate-100">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">{skill.label}</span>
                                                        <span className="text-[13px] font-bold text-slate-700">{skill.score || '0.0'}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col items-center justify-center pl-4 border-l border-slate-100 shrink-0 min-w-[70px]">
                                                <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Tổng</div>
                                                <div className={`text-xl font-black ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {result.totalScore}
                                                </div>
                                                <div className={`mt-1 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold ${isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                    {isPassed ? 'ĐẠT' : 'RỚT'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TestSetDetail;