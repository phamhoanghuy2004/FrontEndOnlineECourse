import React from 'react';
import { FaPlayCircle, FaLock } from 'react-icons/fa';

const CourseTOC = ({ lessons }) => {
    if (!lessons || lessons.length === 0) return null;

    const scrollToLesson = (lessonId) => {
        const element = document.getElementById(`lesson-${lessonId}`);
        if (element) {
            // Cuộn mượt và trừ hao phần Header dính ở trên
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="sticky top-28 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Danh sách bài học</h3>
            <ul className="space-y-3">
                {lessons.map((lesson, index) => (
                    <li 
                        key={lesson.id} 
                        onClick={() => scrollToLesson(lesson.id)}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                        <div className="mt-1 flex-shrink-0 text-gray-400 group-hover:text-primary transition-colors">
                            {lesson.isPreview ? <FaPlayCircle /> : <FaLock size={14} />}
                        </div>
                        <div>
                            <p className={`text-sm font-medium line-clamp-2 ${lesson.isPreview ? 'text-gray-800' : 'text-gray-500'}`}>
                                Bài {index + 1}: {lesson.title}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseTOC;