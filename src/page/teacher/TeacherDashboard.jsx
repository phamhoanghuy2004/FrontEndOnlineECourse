import { FaBookOpen, FaUserGraduate, FaChartBar, FaGem, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StatsGrid from '../../components/common/teacher/StatsGrid';

const TeacherDashboard = () => {
    // Mock Data
    const stats = [
        { id: 1, label: 'Tổng số khóa học', value: 12, icon: FaBookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/teacher/courses' },
        { id: 2, label: 'Tổng học viên', value: 1250, icon: FaUserGraduate, color: 'text-blue-600', bg: 'bg-blue-100', link: '/teacher/students' },
        { id: 3, label: 'Doanh thu tháng này', value: '15.000.000đ', icon: FaChartBar, color: 'text-purple-600', bg: 'bg-purple-100', link: '/teacher/revenue' },
        { id: 4, label: 'Đánh giá trung bình', value: '4.8/5.0', icon: FaGem, color: 'text-yellow-600', bg: 'bg-yellow-100', link: '#' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            {/* Stats Grid */}
            <StatsGrid stats={stats} columns={4} />

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Thao tác nhanh</h3>
                    <div className="space-y-3">
                        <Link to="/teacher/courses" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition border border-dashed border-slate-200 hover:border-emerald-200 group">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <FaPlus />
                            </div>
                            <span className="font-medium text-slate-700">Tạo khóa học mới</span>
                        </Link>
                        <Link to="/teacher/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition border border-dashed border-slate-200 hover:border-purple-200 group">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <FaPenFancy />
                            </div>
                            <span className="font-medium text-slate-700">Viết bài chia sẻ</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity (Mock) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <FaUserGraduate />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">Nguyễn Văn A đã mua khóa học TOEIC 500+</p>
                                        <p className="text-xs text-slate-400">2 giờ trước</p>
                                    </div>
                                </div>
                                <span className="text-emerald-600 font-bold text-sm">+499.000đ</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quick fix for icon definition error in Quick Actions
import { FaPenFancy } from 'react-icons/fa';

export default TeacherDashboard;
