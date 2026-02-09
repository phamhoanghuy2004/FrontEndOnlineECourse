import { useState } from 'react';
import { FaTrash, FaVideo, FaFileAlt, FaClipboardList, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import InputField from '../InputField';
import Button from '../Button';
import ConfirmationModal from '../ConfirmationModal';

const LessonList = ({ lessons, onChange }) => {
    const [expandedId, setExpandedId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAddLesson = () => {
        const newLesson = {
            id: Date.now(), // Mock ID
            title: 'Bài học mới',
            isPublic: false,
            videoUrl: '',
            documentUrl: '',
            test: null
        };
        onChange([...lessons, newLesson]);
        setExpandedId(newLesson.id);
    };

    const handleDeleteLesson = (id) => {
        setSelectedLessonId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLessonId) {
            onChange(lessons.filter(l => l.id !== selectedLessonId));
            setSelectedLessonId(null);
        }
    };

    const handleUpdateLesson = (id, field, value) => {
        const updatedLessons = lessons.map(l =>
            l.id === id ? { ...l, [field]: value } : l
        );
        onChange(updatedLessons);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Danh sách bài học ({lessons.length})</h3>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddLesson}
                    className="!py-1.5 !px-3 !text-sm"
                >
                    <FaPlus size={12} /> Thêm bài học
                </Button>
            </div>

            <div className="space-y-3">
                {lessons.length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                        Chưa có bài học nào. Nhấn "Thêm bài học" để tạo.
                    </div>
                )}

                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        {/* Header */}
                        <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 transition"
                            onClick={() => toggleExpand(lesson.id)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {index + 1}
                                </span>
                                <span className="font-bold text-slate-700 text-sm">{lesson.title}</span>
                                {lesson.isPublic && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Học thử</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                {lesson.videoUrl && <FaVideo title="Có video" className="text-blue-400" />}
                                {lesson.documentUrl && <FaFileAlt title="Có tài liệu" className="text-orange-400" />}
                                {lesson.test && <FaClipboardList title="Có bài kiểm tra" className="text-purple-400" />}

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                                    className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-md transition ml-2"
                                >
                                    <FaTrash size={12} />
                                </button>
                                {expandedId === lesson.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                            </div>
                        </div>

                        {/* Details Form (Expanded) */}
                        {expandedId === lesson.id && (
                            <div className="p-4 bg-white border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">

                                {/* Title & Trial */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Tên bài học"
                                            value={lesson.title}
                                            onChange={(e) => handleUpdateLesson(lesson.id, 'title', e.target.value)}
                                            placeholder="Nhập tên bài học..."
                                            icon={FaFileAlt}
                                        />
                                    </div>
                                    <div className="flex items-end pb-2">
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={lesson.isPublic}
                                                onChange={(e) => handleUpdateLesson(lesson.id, 'isPublic', e.target.checked)}
                                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Cho phép học thử</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Resources */}
                                <div className="space-y-3">
                                    {/* Video */}
                                    <InputField
                                        label="Link Video"
                                        value={lesson.videoUrl || ''}
                                        onChange={(e) => handleUpdateLesson(lesson.id, 'videoUrl', e.target.value)}
                                        placeholder="https://youtube.com/..."
                                        icon={FaVideo}
                                    />

                                    {/* Document */}
                                    <InputField
                                        label="Link Tài liệu (PDF/DOC)"
                                        value={lesson.documentUrl || ''}
                                        onChange={(e) => handleUpdateLesson(lesson.id, 'documentUrl', e.target.value)}
                                        placeholder="https://drive.google.com/..."
                                        icon={FaFileAlt}
                                    />

                                    {/* Test (Simple Toggle for now, expandable to full test editor) */}
                                    <div className="pt-2 border-t border-slate-50">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!lesson.test}
                                                onChange={(e) => handleUpdateLesson(lesson.id, 'test', e.target.checked ? { title: 'Bài kiểm tra', questions: [] } : null)}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                            />
                                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <FaClipboardList className="text-purple-500" /> Kèm bài kiểm tra
                                            </span>
                                        </label>
                                        {lesson.test && (
                                            <div className="mt-2 ml-6 text-xs text-slate-400 italic">
                                                (Chức năng soạn thảo bài kiểm tra sẽ được cập nhật sau)
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                ))}
            </div>


            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa bài học này?"
                message="Hành động này sẽ xóa bài học và không thể hoàn tác."
                confirmText="Xóa bài học"
                variant="danger"
            />
        </div>
    );
};

export default LessonList;
