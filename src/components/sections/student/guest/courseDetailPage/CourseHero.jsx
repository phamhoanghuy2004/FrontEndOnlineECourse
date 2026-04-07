import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaUserGraduate, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const CourseHero = ({ course }) => {
    const [isSticky, setIsSticky] = useState(false);

    // Dữ liệu giả định (Sau này thay bằng data từ course object)
    const rating = 4.8;
    const reviewCount = "1,250";
    const studentCount = "5,430";
    
    const teacherName = course?.teacherName || "Giảng viên Echill";
    const teacherAvatar = course?.teacherAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&background=random&color=fff`;
    const teacherId = course?.teacherId || '1';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* 1. KHỐI HERO GỐC */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    
                    {/* --- CỘT TRÁI: THÔNG TIN KHÓA HỌC --- */}
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-3 mb-4 h-[24px]">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                                {course?.categoryName}
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                                {course?.level}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                            {course?.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
                            <div className="flex items-center gap-1.5 text-amber-500">
                                <span className="font-extrabold text-slate-800 text-base">{rating}</span>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.floor(rating) ? "text-amber-500" : "text-slate-200"} />
                                    ))}
                                </div>
                                <span className="text-slate-500 underline decoration-dashed underline-offset-4 ml-1">
                                    ({reviewCount} đánh giá)
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <FaUserGraduate className="text-slate-400 text-lg" />
                                <span><strong className="text-slate-800">{studentCount}</strong> học viên</span>
                            </div>
                        </div>
                    </div>

                    {/* --- 💥 CỘT PHẢI: GIẢNG VIÊN (ĐÃ FIX CANH GIỮA HOÀN HẢO) --- */}
                    {/* Đổi items-end thành items-center để 3 thẻ con tự canh giữa với nhau */}
                    <div className="shrink-0 flex flex-col items-center mt-6 md:mt-0">
                        {/* Label màu đen */}
                        <span className="text-[11px] text-slate-900 font-black uppercase tracking-widest mb-4 h-[24px] flex items-center justify-center">
                            Giảng viên hướng dẫn
                        </span>

                        <Link 
                            to={`/teachers/${teacherId}`}
                            className="flex flex-col items-center group"
                            title="Xem hồ sơ giảng viên"
                        >
                            {/* Avatar ở giữa */}
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-primary transition-all shadow-md mb-3">
                                <img src={teacherAvatar} alt={teacherName} className="w-full h-full object-cover" />
                            </div>
                            {/* Tên ở dưới hàng */}
                            <span className="text-lg font-black text-slate-800 group-hover:text-primary transition-colors text-center">
                                {teacherName}
                            </span>
                        </Link>
                    </div>

                </div>
            </div>

            {/* 2. THANH STICKY MỎNG (CÓ TÊN GIẢNG VIÊN) */}
            <AnimatePresence>
                {isSticky && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed top-0 left-0 w-full h-20 bg-white z-[60] border-b border-gray-200 shadow-md px-4 md:px-8 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3 md:gap-5 w-full max-w-[1536px] mx-auto">
                            
                            <Link 
                                to="/courses" 
                                className="flex items-center justify-center min-w-[40px] w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <FaArrowLeft size={16} />
                            </Link>

                            <div className="hidden md:block w-px h-8 bg-slate-200"></div>

                            {/* Info Section */}
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 truncate">
                                <h1 className="text-base md:text-lg font-black text-slate-900 truncate">
                                    {course?.name}
                                </h1>
                                
                                <div className="flex items-center gap-3">
                                    <span className="hidden md:block text-slate-300">|</span>
                                    <div className="flex items-center gap-2">
                                        <img src={teacherAvatar} alt="" className="w-6 h-6 rounded-full border border-slate-200" />
                                        <span className="text-sm font-bold text-slate-600">{teacherName}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                                        {rating} <FaStar size={10} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CourseHero;