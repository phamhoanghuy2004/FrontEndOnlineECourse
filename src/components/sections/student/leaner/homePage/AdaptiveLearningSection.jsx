import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLightbulb, FaPlayCircle, FaShoppingCart, FaClipboardCheck, FaTrophy, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { fadeInUp } from '../../../../../constants/motionVariants';
import Title from '../../../../common/Title';
import courseRecommendApi from '../../../../../api/courseRecommendApi';
import { useAuth } from '../../../../../hooks/useAuth';

const AdaptiveLearningSection = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                setLoading(true);
                const response = await courseRecommendApi.getAdaptiveRecommendation();
                if (response.data) {
                    setData(response.data);
                }
            } catch (err) {
                console.error("Lỗi tải đề xuất học tập:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, []);

    if (loading) {
        return (
            <section>
                <div className="animate-pulse h-48 bg-slate-200 rounded-2xl w-full"></div>
            </section>
        );
    }

    if (!data) return null;

    // ===== TRẠNG THÁI 1: CHƯA LÀM TEST NĂNG LỰC =====
    if (data.status === 'NO_PROFILE') {
        return (
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Title text='Đề xuất học tập' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-[2rem] p-8 shadow-lg shadow-amber-100/50 border border-amber-100 overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 flex-shrink-0">
                            <FaClipboardCheck className="text-white text-2xl" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-lg font-extrabold text-slate-800 mb-1">
                                Khám phá trình độ thực sự của bạn!
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Hãy làm bài test năng lực để hệ thống phân tích lỗ hổng kiến thức và thiết kế lộ trình học tập riêng cho bạn.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/level-test')}
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:from-amber-600 hover:to-orange-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 text-sm"
                        >
                            <FaClipboardCheck /> Làm bài test ngay
                        </button>
                    </div>
                </motion.div>
            </section>
        );
    }

    // ===== TRẠNG THÁI 2: ĐÃ MASTER HẾT - KHÔNG CÒN LỖ HỔNG =====
    if (data.status === 'NO_GAP') {
        return (
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Title text='Đề xuất học tập' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-[2rem] p-8 shadow-lg shadow-emerald-100/50 border border-emerald-100 overflow-hidden"
                >
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center text-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                            <FaTrophy className="text-white text-2xl" />
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-800">
                            Tuyệt vời! Bạn đã nắm vững kiến thức 🎉
                        </h4>
                        <p className="text-sm text-slate-500 max-w-md">
                            Hệ thống không phát hiện lỗ hổng kiến thức nào. Hãy tiếp tục duy trì phong độ xuất sắc này nhé!
                        </p>
                    </div>
                </motion.div>
            </section>
        );
    }

    // ===== TRẠNG THÁI 3: TÌM ĐƯỢC BÀI HỌC ĐỀ XUẤT =====
    if (data.status === 'LESSON_FOUND') {
        return (
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Title text='Đề xuất học tập' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/60 border border-emerald-100 overflow-hidden group hover:shadow-2xl hover:shadow-emerald-100/60 transition-all duration-500"
                >
                    {/* Gradient accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
                    
                    {/* Decorative bg */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity"></div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                                <FaLightbulb className="text-white text-lg" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                                    Cần ôn tập: {data.gapTagName}
                                </span>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Trình độ hiện tại: Level {data.gapCurrentLevel}/{data.gapTargetLevel}
                                </p>
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
                            {/* Course thumbnail */}
                            {data.courseImage && (
                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white">
                                    <img src={data.courseImage} alt={data.courseName} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <p className="text-[11px] text-slate-400 font-medium mb-0.5 truncate">{data.courseName}</p>
                                <h4 className="font-bold text-slate-800 text-base leading-snug mb-2 line-clamp-2">
                                    {data.lessonTitle}
                                </h4>

                                {/* Progress hint */}
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            style={{ width: `${Math.round((data.gapCurrentLevel / data.gapTargetLevel) * 100)}%` }}
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {Math.round((data.gapCurrentLevel / data.gapTargetLevel) * 100)}% hoàn thành
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/learner/${user?.id}/study-room/${data.courseId}`)}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 text-sm"
                            >
                                <FaPlayCircle /> Học ngay
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>
        );
    }

    // ===== TRẠNG THÁI 4: UPSELL - CHƯA CÓ BÀI HỌC, GỢI Ý MUA KHÓA =====
    if (data.status === 'UPSELL') {
        return (
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Title text='Đề xuất học tập' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-[2rem] p-8 shadow-lg shadow-purple-100/50 border border-purple-100 overflow-hidden"
                >
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-fuchsia-200/20 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0">
                            <FaShoppingCart className="text-white text-2xl" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider bg-purple-100 px-2.5 py-1 rounded-full">
                                    Lỗ hổng: {data.gapTagName}
                                </span>
                            </div>
                            <h4 className="text-lg font-extrabold text-slate-800 mb-1">
                                Bạn cần bổ sung kiến thức!
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Hệ thống phát hiện bạn đang yếu kỹ năng <strong className="text-purple-600">{data.gapTagName}</strong> nhưng chưa sở hữu bài học nào phù hợp. Hãy khám phá các khóa học được gợi ý riêng cho bạn!
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/course-recommendations')}
                            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:from-violet-600 hover:to-purple-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 text-sm"
                        >
                            Khám phá khóa học <FaArrowRight />
                        </button>
                    </div>
                </motion.div>
            </section>
        );
    }

    return null;
};

export default AdaptiveLearningSection;
