import React from 'react';
import { FaPlayCircle, FaLock } from 'react-icons/fa';

const CourseTOC = ({ lessons }) => {
    if (!lessons || lessons.length === 0) return null;

    const scrollToLesson = (lessonId) => {
        const element = document.getElementById(`lesson-${lessonId}`);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // 💥 SẮP XẾP MỤC LỤC THEO ĐÚNG DISPLAY ORDER (Tương tự ở trên)
    const sortedLessons = [...lessons].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return (
        <div className="sticky top-28 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Danh sách bài học</h3>
            <ul className="space-y-3">
                {sortedLessons.map((lesson) => (
                    <li
                        key={lesson.id}
                        onClick={() => scrollToLesson(lesson.id)}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                        title={lesson.title} // Thêm tooltip hiện đầy đủ tên khi hover
                    >
                        <div className="mt-1 flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors">
                            {lesson.isPreview ? <FaPlayCircle /> : <FaLock size={14} />}
                        </div>
                        <div>
                            {/* 💥 BỎ CHỮ BÀI X. DÙNG line-clamp-1 ĐỂ HIỂN THỊ 1 DÒNG DUY NHẤT RỒI CẮT BẰNG DẤU ... */}
                            <p className={`text-sm font-medium line-clamp-1 ${lesson.isPreview ? 'text-gray-800' : 'text-gray-500'}`}>
                                {lesson.title}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseTOC;