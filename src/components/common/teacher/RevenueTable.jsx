import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RevenueTable = ({ courses }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800">Doanh thu theo khóa học</h3>
                <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Xuất báo cáo</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                            <th className="p-4">Khóa học</th>
                            <th className="p-4">Giá bán</th>
                            <th className="p-4">Học viên</th>
                            <th className="p-4">Tổng doanh thu</th>
                            <th className="p-4 text-right">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {courses.map((course) => (
                            <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-800">
                                    {course.title}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {course.price}
                                </td>
                                <td className="p-4 text-slate-600">
                                    {course.students}
                                </td>
                                <td className="p-4 font-bold text-green-600">
                                    {/* Mock calculation logic */}
                                    {(parseInt(course.price.replace(/\./g, '')) * course.students).toLocaleString('vi-VN')}đ
                                </td>
                                <td className="p-4 text-right">
                                    <Link to={`/teacher/courses/${course.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                                        <FaEye /> Xem
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenueTable;
