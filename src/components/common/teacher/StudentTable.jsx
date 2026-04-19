import { FaCommentDots } from 'react-icons/fa';

const StudentTable = ({ students, onChatClick }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                            <th className="p-4">Học viên</th>
                            <th className="p-4">Khóa học đăng ký</th>
                            <th className="p-4">Ngày đăng ký</th>
                            <th className="p-4">Tiến độ</th>
                            <th className="p-4 text-right">Liên hệ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'User')}&background=random&color=fff`} 
                                            alt={student.name} 
                                            className="w-10 h-10 rounded-full bg-slate-200 object-cover" 
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                                            <span className="text-xs text-slate-400">{student.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-slate-700">
                                    {student.courseName}
                                </td>
                                <td className="p-4 text-slate-600 text-sm">
                                    {student.joinDate}
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="w-full max-w-[120px]">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-slate-600">{student.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${student.progress}%` }}
                                                className={`h-full rounded-full ${student.progress === 100 ? 'bg-green-500' :
                                                        student.progress > 50 ? 'bg-emerald-500' : 'bg-orange-400'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => onChatClick && onChatClick(student.studentId)}
                                        className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition shadow-sm"
                                        title="Chat với học viên"
                                    >
                                        <FaCommentDots />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {students.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    Không tìm thấy học viên nào.
                </div>
            )}
        </div>
    );
};

export default StudentTable;
