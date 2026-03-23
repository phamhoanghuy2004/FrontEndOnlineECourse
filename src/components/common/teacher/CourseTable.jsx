import { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';

const CourseTable = ({ courses, onDelete }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedCourseId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedCourseId) {
            onDelete(selectedCourseId);
            setSelectedCourseId(null);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4">Khóa học</th>
                                <th className="p-4">Cấp độ</th>
                                <th className="p-4">Giá</th>
                                <th className="p-4">Học viên</th>
                                <th className="p-4">Đánh giá</th>
                                <th className="p-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={course.imageUrl || course.image} alt={course.name || course.title} className="w-16 h-10 object-cover rounded-md shadow-sm border border-slate-100" />
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">{course.name || course.title}</h4>
                                                <span className="text-xs text-slate-400">{course.lessons?.length || 0} bài học</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${course.level === 'BEGINNER' || course.level === 'BASIC' ? 'bg-green-100 text-green-700 border-green-200' :
                                            course.level === 'INTERMEDIATE' || course.level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            {course.level}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-700">
                                        {course.price}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {course.students}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                            <FaStar /> {course.rating}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/teacher/courses/${course.id}`} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition" title="Xem chi tiết">
                                                <FaEye />
                                            </Link>
                                            <Link to={`/teacher/courses/${course.id}/edit`} className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition" title="Chỉnh sửa">
                                                <FaEdit />
                                            </Link>
                                            <button onClick={() => handleDeleteClick(course.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Xóa">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {courses.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        Không tìm thấy khóa học nào.
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa khóa học?"
                message="Khóa học và toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác."
                confirmText="Xóa khóa học"
                variant="danger"
            />
        </>
    );
};

export default CourseTable;
