import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaClock, FaBookOpen, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../ProgressBar';
import Button from '../../../Button';
import { fadeInBottom } from '../../../../../constants/motionVariants';
import { useAuth } from '../../../../../hooks/useAuth';
import ReviewModal from '../../../../common/ReviewModal';

// Helper format thời gian (VD: "2 giờ trước", "1 ngày trước")
const formatTimeAgo = (dateString) => {
    if (!dateString) return "Chưa học";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
};

const LearnerCourseCard = ({ course }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // 💥 Tự động tính Status dựa vào progressPercent từ Backend
    const getCalculatedStatus = (progress) => {
        if (progress === 100) return 'completed';
        if (progress > 0) return 'in-progress';
        return 'not-started';
    };

    const currentStatus = getCalculatedStatus(course.progressPercent);

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed': return 'Hoàn thành';
            case 'in-progress': return 'Đang học';
            default: return 'Chưa bắt đầu';
        }
    };

    const handleLearnNow = () => {
        // Điều hướng vào học dựa theo courseId
        navigate(`/learner/${user.id}/study-room/${course.courseId}`);
    };

    return (
        <>
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
                        src={course.courseImage || "https://placehold.co/800x450?text=No+Image"} // Fallback ảnh
                        alt={course.courseName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <button onClick={handleLearnNow} className="w-12 h-12 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                            <FaPlay className="ml-1" />
                        </button>
                    </div>

                    <div className="absolute top-3 left-3">
                        <span className="bg-white text-emerald-600 text-[10px] font-extrabold px-3 py-1 rounded-lg shadow-md border border-emerald-100 uppercase tracking-wider">
                            {getStatusLabel(currentStatus)}
                        </span>
                    </div>

                    <div className="absolute top-3 right-3">
                        <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20">
                            TOEIC {/* Hardcode theo yêu cầu */}
                        </span>
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                        <img
                            src={course.teacherAvatar || "https://i.pravatar.cc/150"} // Fallback avatar
                            alt={course.teacherName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-100"
                        />
                        <span className="text-xs text-slate-500 font-medium">
                            {course.teacherName}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 flex-1 min-h-[3.5rem]" title={course.courseName}>
                        {course.courseName}
                    </h3>

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-end text-xs">
                            <span className="font-bold text-slate-700">
                                {course.progressPercent}% <span className="text-slate-400 font-normal">hoàn thành</span>
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                                <FaBookOpen size={10} /> {course.completedLessons}/{course.totalLessons} bài
                            </span>
                        </div>

                        <ProgressBar
                            value={course.progressPercent}
                            height="h-2"
                            fillColor={course.progressPercent === 100 ? "bg-green-500" : "bg-emerald-500"}
                        />
                    </div>
                </div>

                {/* --- FOOTER AREA --- */}
                <div className="px-5 pb-5 pt-0 mt-auto">
                    <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 flex-1">
                            <FaClock /> {formatTimeAgo(course.lastAccessedAt)}
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsReviewModalOpen(true)}
                                className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-100 transition-colors shadow-sm border border-amber-100"
                                title="Đánh giá khóa học"
                            >
                                <FaStar />
                            </button>

                            <Button
                                variant={currentStatus === 'completed' ? 'secondary' : 'primary'}
                                onClick={handleLearnNow}
                                className="!px-4 !py-2 !text-xs !rounded-xl !shadow-sm whitespace-nowrap"
                            >
                                {currentStatus === 'completed' ? 'Xem lại' : (currentStatus === 'not-started' ? 'Bắt đầu' : 'Học tiếp')}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                courseId={course.courseId}
                courseName={course.courseName}
            />
        </>
    );
};

export default LearnerCourseCard;

