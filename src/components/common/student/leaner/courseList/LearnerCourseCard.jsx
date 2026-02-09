import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaClock, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../ProgressBar';
import Button from '../../../Button';
import { fadeInBottom } from '../../../../../constants/motionVariants';

const LearnerCourseCard = ({ course }) => {
    const navigate = useNavigate();

    // Helper đơn giản để lấy tên trạng thái tiếng Việt
    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Hoàn thành';
            case 'in-progress': return 'Đang học';
            default: return 'Chưa bắt đầu';
        }
    };

    // Hàm xử lý khi click vào nút
    const handleLearnNow = () => {
        navigate('/courses/1');
    };

    return (
        <motion.div
            layout
            variants={fadeInBottom}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden flex flex-col h-full"
        >
            {/* --- THUMBNAIL AREA --- */}
            <div className="relative h-48 overflow-hidden shrink-0">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay & Play Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <button className="w-12 h-12 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                        <FaPlay className="ml-1" />
                    </button>
                </div>

                {/* --- STATUS BADGE --- */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white text-emerald-600 text-[10px] font-extrabold px-3 py-1 rounded-lg shadow-md border border-emerald-100 uppercase tracking-wider">
                        {getStatusLabel(course.status)}
                    </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20">
                        {course.category}
                    </span>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3">
                    <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-100"
                    />
                    <span className="text-xs text-slate-500 font-medium">
                        {course.instructor.name}
                    </span>
                </div>

                {/* Title */}
                <h3
                    className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 flex-1 min-h-[3.5rem]"
                    title={course.title}
                >
                    {course.title}
                </h3>

                {/* Progress */}
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-end text-xs">
                        <span className="font-bold text-slate-700">
                            {course.progress}% <span className="text-slate-400 font-normal">hoàn thành</span>
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                            <FaBookOpen size={10} /> {course.completedLessons}/{course.totalLessons} bài
                        </span>
                    </div>

                    {/* ProgressBar */}
                    <ProgressBar
                        value={course.progress}
                        height="h-2"
                        fillColor={course.progress === 100 ? "bg-green-500" : "bg-emerald-500"}
                    />
                </div>
            </div>

            {/* --- FOOTER AREA --- */}
            <div className="px-5 pb-5 pt-0 mt-auto">
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <FaClock /> Truy cập: {course.lastAccessed}
                    </div>

                    {/* 2. SỬ DỤNG BUTTON COMPONENT TẠI ĐÂY */}
                    <Button
                        // Chọn variant: 'secondary' cho hoàn thành, 'primary' cho các trạng thái còn lại
                        variant={course.status === 'completed' ? 'secondary' : 'primary'}

                        onClick={handleLearnNow}

                        // Override styles: Ép nhỏ lại cho vừa Card (ghi đè baseStyles to bự của Button gốc)
                        className="!px-4 !py-2 !text-xs !rounded-xl !shadow-sm"
                    >
                        {course.status === 'completed' ? 'Xem lại' : (course.status === 'not-started' ? 'Bắt đầu' : 'Học tiếp')}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default LearnerCourseCard;