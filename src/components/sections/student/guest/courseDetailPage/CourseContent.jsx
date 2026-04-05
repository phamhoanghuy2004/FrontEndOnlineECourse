import React from 'react';
import { motion } from "framer-motion";
import { FaPlayCircle, FaFileAlt, FaLock } from "react-icons/fa";

const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const CourseContent = ({ lessons, isRegistered }) => {
    if (!lessons || lessons.length === 0) return (
        <div className="p-8 bg-white rounded-3xl shadow-sm text-center text-gray-500">Nội dung đang được cập nhật...</div>
    );

    return (
        <div className="space-y-6">
            {lessons.map((lesson, index) => {
                const canWatch = isRegistered || lesson.isPreview;

                return (
                    <motion.div 
                        id={`lesson-${lesson.id}`} 
                        key={lesson.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        {/* Header Bài học */}
                        <div className={`px-6 py-4 flex justify-between items-center ${canWatch ? 'bg-gradient-to-r from-slate-900 to-slate-800' : 'bg-slate-100'}`}>
                            <h2 className={`text-xl font-bold flex items-center gap-3 ${canWatch ? 'text-white' : 'text-slate-500'}`}>
                                {canWatch ? <FaPlayCircle className="text-primary" /> : <FaLock className="text-slate-400" />}
                                Bài {index + 1}: {lesson.title}
                            </h2>
                            {lesson.isPreview && !isRegistered && (
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Học thử
                                </span>
                            )}
                        </div>

                        {/* Nội dung chữ */}
                        <div className="p-6">
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {lesson.content || "Mô tả bài học sẽ được giảng viên cập nhật chi tiết tại đây."}
                            </p>

                            {/* Khu vực Video Player */}
                            <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-md mb-6 group">
                                {canWatch && lesson.previewVideoUrl ? (
                                    
                                    // 💥 FIX TẠI ĐÂY: DÙNG THẺ <video> THAY VÌ <iframe>
                                    // 💥 Thêm controls để hiện thanh điều khiển
                                    <video
                                        className="absolute top-0 left-0 w-full h-full object-contain"
                                        src={lesson.previewVideoUrl}
                                        controls
                                        controlsList="nodownload" // Tùy chọn: Chặn nút tải xuống mặc định
                                    >
                                        Trình duyệt của bạn không hỗ trợ thẻ video.
                                    </video>

                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm text-white">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                                            <FaLock size={24} className="text-slate-300" />
                                        </div>
                                        <p className="font-semibold text-lg">Nội dung bị khóa</p>
                                        <p className="text-sm text-slate-400 mt-1">Vui lòng đăng ký khóa học để xem video này</p>
                                        <span className="mt-4 px-4 py-1.5 bg-slate-800 rounded-full text-xs font-medium border border-slate-700">
                                            Thời lượng: {formatDuration(lesson.durationSeconds)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Khu vực Tài liệu đính kèm */}
                            {lesson.documents && lesson.documents.length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Tài liệu đính kèm</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {lesson.documents.map(doc => (
                                            canWatch && doc.fileUrl ? (
                                                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition border border-blue-100">
                                                    <FaFileAlt size={20} className="text-blue-500" />
                                                    <span className="font-medium text-sm truncate">{doc.title}</span>
                                                </a>
                                            ) : (
                                                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed">
                                                    <FaLock size={16} />
                                                    <span className="font-medium text-sm truncate">{doc.title}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default CourseContent;