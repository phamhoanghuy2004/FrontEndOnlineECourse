import React from 'react';
import { FaCheckCircle, FaPlayCircle, FaLock, FaFilePdf, FaClipboardList, FaRedo } from 'react-icons/fa';
import ProgressBar from '../ProgressBar';

const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const CurriculumSidebar = ({ curriculum, activeLessonId, onLessonSelect }) => {
    
    // 💥 ĐÃ TRẢ LẠI Ổ KHÓA CHO BÀI CHƯA HỌC
    const renderStatusIcon = (status, isActive) => {
        if (status === 'COMPLETED') return <FaCheckCircle className="text-emerald-500 text-[1.1rem]" />;
        if (status === 'OUTDATED') return <FaRedo className="text-amber-500 text-[1.1rem]" />;
        if (status === 'IN_PROGRESS' || isActive) return <FaPlayCircle className="text-emerald-600 text-[1.1rem]" />;
        
        // Trạng thái Chưa Học (NOT_STARTED)
        return <FaLock className="text-slate-300 text-sm" />; 
    };

    return (
        <div className="flex flex-col h-full">
            
            {/* HEADER SIDEBAR */}
            <div className="p-6 border-b border-slate-100 bg-white shrink-0">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Nội dung khóa học</h3>
                <div className="flex justify-between items-end text-sm mb-2">
                    <span className="font-bold text-emerald-600">
                        {curriculum.progressPercent}% <span className="font-normal text-slate-400">hoàn thành</span>
                    </span>
                    <span className="text-slate-500 font-medium text-xs">{curriculum.completedLessons}/{curriculum.totalLessons} bài</span>
                </div>
                <ProgressBar 
                    value={curriculum.progressPercent} 
                    height="h-2" 
                    fillColor={curriculum.progressPercent === 100 ? "bg-emerald-500" : "bg-emerald-400"} 
                />
            </div>

            {/* LIST BÀI HỌC CỰC KỲ CLEAN (KHÔNG CÓ NÚT START TRONG NÀY NỮA) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                {curriculum.lessons.map((lesson) => {
                    const isActive = lesson.lessonId === activeLessonId;
                    
                    return (
                        <div
                            key={lesson.lessonId}
                            onClick={() => onLessonSelect(lesson.lessonId)}
                            className={`w-full cursor-pointer text-left p-3.5 rounded-2xl flex items-start gap-3.5 transition-all duration-200
                                ${isActive 
                                    ? 'bg-emerald-50/70 border border-emerald-200 shadow-sm' 
                                    : 'bg-white border border-transparent hover:bg-slate-50 hover:border-slate-100'
                                }
                            `}
                        >
                            {/* Icon Trạng thái */}
                            <div className="mt-0.5 shrink-0 flex items-center justify-center w-5">
                                {renderStatusIcon(lesson.status, isActive)}
                            </div>

                            {/* Thông tin bài học */}
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-[14px] font-bold truncate transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-700'}`} title={lesson.title}>
                                    Bài {lesson.displayOrder}: {lesson.title}
                                </h4>
                                
                                <div className="flex items-center gap-3 mt-1.5">
                                    {lesson.hasVideo && (
                                        <span className="text-[12px] font-medium text-slate-400">
                                            {formatDuration(lesson.durationSeconds)}
                                        </span>
                                    )}

                                    {lesson.status === 'IN_PROGRESS' && lesson.lastWatchedSecond > 0 && (
                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            Đang học
                                        </span>
                                    )}

                                    <div className="flex items-center gap-1.5 ml-auto">
                                        {lesson.hasDocument && <FaFilePdf className="text-slate-300 text-sm" />}
                                        {lesson.hasTest && <FaClipboardList className="text-slate-300 text-sm" />}
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

export default CurriculumSidebar;