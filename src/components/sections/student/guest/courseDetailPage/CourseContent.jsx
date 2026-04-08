import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaPlayCircle, FaFileAlt, FaLock, FaChevronDown, FaChevronUp, FaListUl, FaClipboardCheck, FaPen } from "react-icons/fa"; // 💥 Import thêm Icon bài Test
import DOMPurify from 'dompurify';

const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const LessonItem = ({ lesson, isRegistered }) => {
    const canWatch = isRegistered || lesson.isPreview;
    const [isExpanded, setIsExpanded] = useState(false);

    // Xử lý khi click vào nút làm bài test
    const handleDoTest = () => {
        if (!lesson.testSetId) return;
        // Chuyển hướng sang trang làm test hoặc mở modal tùy logic của bạn
        alert(`Sẽ chuyển hướng tới bài Test ID: ${lesson.testSetId}`);
        // Ví dụ: navigate(`/course/learning/test/${lesson.testSetId}`);
    };

    return (
        <motion.div
            id={`lesson-${lesson.id}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4"
        >
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-6 py-4 flex justify-between items-center cursor-pointer select-none transition-colors ${canWatch ? 'hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100'}`}
            >
                <div className="flex items-center gap-3 md:gap-4">
                    {canWatch ? (
                        <FaPlayCircle className="text-primary text-xl shrink-0" />
                    ) : (
                        <FaLock className="text-slate-400 text-xl shrink-0" />
                    )}

                    {/* 💥 ĐÃ BỎ CHỮ "BÀI X:", CHỈ HIỂN THỊ TÊN DO BẠN ĐẶT */}
                    <h3 className={`text-base md:text-lg font-bold ${canWatch ? 'text-slate-800' : 'text-slate-500'}`}>
                        {lesson.title}
                    </h3>

                    {lesson.isPreview && !isRegistered && (
                        <span className="hidden sm:inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                            Học thử
                        </span>
                    )}

                    {/* 💥 HIỂN THỊ BADGE NẾU CÓ BÀI TEST */}
                    {lesson.hasTest && (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                            <FaPen size={10} /> Bài Test
                        </span>
                    )}
                </div>

                <div className="text-slate-400 ml-4 shrink-0 transition-transform duration-300">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-slate-100"
                    >
                        <div className="p-6">
                            {lesson.content ? (
                                <div
                                    // Class bây giờ chỉ cần cực kỳ đơn giản, sạch sẽ vì class prose đã lo hết
                                    className="prose prose-slate max-w-none w-full text-[15px] text-slate-600"

                                    // 💥 PHÉP THUẬT NẰM Ở ĐÂY:
                                    // Thay thế toàn bộ khoảng trắng dính chùm (&nbsp;) thành khoảng trắng thật (' ')
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(lesson.content.replace(/&nbsp;/g, ' '))
                                    }}
                                />
                            ) : (
                                <p className="text-slate-500 italic text-[15px]">
                                    Mô tả bài học sẽ được giảng viên cập nhật chi tiết tại đây.
                                </p>
                            )}

                            {canWatch ? (
                                <>
                                    <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-sm mb-6 group">
                                        {lesson.previewVideoUrl ? (
                                            <video
                                                className="absolute top-0 left-0 w-full h-full object-contain bg-black"
                                                src={lesson.previewVideoUrl}
                                                controls
                                                controlsList="nodownload"
                                            >
                                                Trình duyệt của bạn không hỗ trợ thẻ video.
                                            </video>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                                Video đang được cập nhật...
                                            </div>
                                        )}
                                    </div>

                                    {lesson.documents && lesson.documents.length > 0 && (
                                        <div className="mt-6 border-t border-slate-100 pt-5">
                                            <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Tài liệu đính kèm</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {lesson.documents.map(doc => (
                                                    <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 hover:bg-blue-50 text-blue-700 transition border border-blue-100/50 hover:border-blue-200">
                                                        <FaFileAlt size={18} className="text-blue-500 shrink-0" />
                                                        <span className="font-medium text-sm truncate">{doc.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 💥 GIAO DIỆN BÀI TEST */}
                                    {lesson.hasTest && (
                                        <div className="mt-6 border-t border-slate-100 pt-5">
                                            <h4 className="text-xs font-black text-slate-400 mb-3 uppercase tracking-wider">Kiểm tra & Đánh giá</h4>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/50 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                                        <FaClipboardCheck size={20} />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-amber-900 text-[15px]">Bài trắc nghiệm cuối bài</h5>
                                                        <p className="text-sm text-amber-700/80 mt-0.5">Hoàn thành bài test để củng cố kiến thức</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleDoTest}
                                                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-all shadow-sm shrink-0 whitespace-nowrap"
                                                >
                                                    Làm bài ngay
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-slate-50 border border-slate-100 rounded-xl py-6 px-4 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-slate-200/50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                                        <FaLock size={18} />
                                    </div>
                                    <h4 className="text-slate-800 font-bold text-base mb-1">Nội dung bài học bị khóa</h4>
                                    <p className="text-slate-500 text-sm max-w-sm">
                                        Đăng ký khóa học ngay để mở khóa toàn bộ video bài giảng và tài liệu đính kèm.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const CourseContent = ({ lessons, isRegistered }) => {
    if (!lessons || lessons.length === 0) return (
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-center text-slate-500 font-medium">
            Nội dung đang được cập nhật...
        </div>
    );

    // 💥 ÉP SẮP XẾP LẠI MẢNG THEO DISPLAY ORDER TỪ NHỎ ĐẾN LỚN (Đề phòng Backend trả về lộn xộn)
    const sortedLessons = [...lessons].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FaListUl className="text-primary" />
                Nội dung khóa học
            </h2>

            <div className="space-y-4">
                {/* 💥 Dùng mảng đã sắp xếp */}
                {sortedLessons.map((lesson) => (
                    <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        isRegistered={isRegistered}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseContent;