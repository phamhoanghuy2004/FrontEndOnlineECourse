import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContinueLearningCard from "../../../../common/student/leaner/dashboard/ContinueLearningCard";
import Title from "../../../../common/Title";
import { fadeInUp } from "../../../../../constants/motionVariants";
import studyAnalyticsApi from '../../../../../api/studyAnalyticsApi'; 
import { useAuth } from '../../../../../hooks/useAuth';

const ContinueLearningSection = () => {
    const [recentCourse, setRecentCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRecentCourse = async () => {
            try {
                const response = await studyAnalyticsApi.getRecentCourse();
                // ✅ THÀNH CÔNG: Lấy từ response.data
                setRecentCourse(response.data);
            } catch (err) {
                // 🚨 THẤT BẠI: Lấy từ err
                console.error("Lỗi lấy khóa học tiếp nối:", err.message || err.code);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentCourse();
    }, []);

    if (loading) {
        return <div className="animate-pulse h-40 bg-slate-200 rounded-2xl w-full"></div>;
    }

    // 🔴 [GÓC GROWTH HACKING]: RENDER QUẢNG CÁO KHI CHƯA CÓ KHÓA HỌC
    if (!recentCourse) {
        return (
            <section>
                <div className="flex justify-between items-center mb-4">
                    <Title text='Gợi ý cho bạn' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800" />
                </div>
                
                {/* Khối Banner Quảng Cáo (Empty State CTA) */}
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/60 border border-emerald-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    
                    {/* Hiệu ứng bóng mờ Background Gradient */}
                    <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-50 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-teal-50 rounded-full blur-3xl pointer-events-none"></div>
                    
                    {/* Nội dung chính */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">
                            Hành trình vạn dặm bắt đầu từ một bước chân!
                        </h4>
                        <p className="text-sm text-slate-500 mb-6 max-w-md">
                            Bạn chưa có khóa học nào đang học dở. Hãy ghé thăm cửa hàng để tìm cho mình một khóa học phù hợp và nâng cao kỹ năng ngay nhé!
                        </p>
                        
                        {/* 🔴 Nút bấm chuyển hướng sang trang /courses */}
                        <Link 
                            to="/courses" 
                            className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition-all transform hover:-translate-y-1 active:translate-y-0"
                        >
                            Khám phá khóa học ngay
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Nếu ĐÃ CÓ KHÓA HỌC thì render bình thường
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <Title text='Tiếp tục học bài trước' as="h3" variants={fadeInUp} className="text-xl font-bold !text-slate-800" />
                
                {user?.id && (
                    <Link to={`/learner/${user.id}/courses`} className="text-emerald-600 text-sm font-bold hover:underline">
                        Xem tất cả
                    </Link>
                )}
            </div>
            
            {/* TRUYỀN THÊM userId XUỐNG CHO CARD ĐỂ BUILD LINK */}
            <ContinueLearningCard course={recentCourse} userId={user?.id} />
        </section>
    );
};

export default ContinueLearningSection;