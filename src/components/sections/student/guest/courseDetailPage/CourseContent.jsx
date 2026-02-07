import React from 'react';
import { FaFileAlt, FaClipboardCheck, FaLock, FaUnlock, FaClock } from "react-icons/fa";

const CourseContent = ({ course, isRegistered }) => {
    // If no lessons, return null or a message
    if (!course.lessons || course.lessons.length === 0) return null;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FaClipboardCheck className="text-primary" /> Nội dung khóa học
                </h3>
                <span className="text-gray-500 text-sm font-medium">{course.lessons.length} bài học</span>
            </div>

            <div className="space-y-4">
                {course.lessons.map((lesson) => (
                    <div
                        key={lesson.id}
                        className={`border border-gray-100 rounded-2xl overflow-hidden transition-all ${lesson.isTrial ? 'bg-white shadow-md' : 'bg-gray-50 opacity-90'
                            }`}
                    >
                        {/* Header of Lesson Item */}
                        <div className={`flex items-center justify-between p-4 ${lesson.isTrial ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.isTrial ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {lesson.isTrial ? <FaUnlock size={14} /> : <FaLock size={14} />}
                                </div>
                                <div>
                                    <h4 className={`font-bold ${lesson.isTrial ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <div className="flex items-center gap-1">
                                            <FaClock size={12} /> {lesson.duration}
                                        </div>
                                        {lesson.isTrial && (
                                            <span className="text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                                                Học thử
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content for Trial Lessons */}
                        {lesson.isTrial && (
                            <div className="px-4 pb-4 pl-[4.5rem]">
                                {/* Video Preview (if available) - condensed */}
                                {lesson.video && (
                                    <div className="mb-3 relative pt-[40%] bg-black rounded-xl overflow-hidden shadow-sm">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={lesson.video}
                                            title={lesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {lesson.document && (
                                        <a href={lesson.document} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors">
                                            <FaFileAlt size={14} /> Tài liệu
                                        </a>
                                    )}
                                    {lesson.test && (
                                        <a href={lesson.test} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100 transition-colors">
                                            <FaClipboardCheck size={14} /> Bài tập
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 2. CTA for locked content - CHỈ HIỂN THỊ KHI KHÔNG CÓ USER */}
            {!isRegistered && (
                <div className="mt-8 text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-600 mb-3">Đăng ký khóa học để mở khóa toàn bộ {course.lessons.length} bài học</p>
                    <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all">
                        Xem chi tiết lộ trình
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseContent;
