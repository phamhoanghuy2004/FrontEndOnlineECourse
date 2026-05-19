import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaBookOpen, FaUserGraduate, FaChartLine, FaStar, FaFilter, FaTrophy, FaCalendarAlt, FaSearch, FaUser, FaClipboardList, FaUserShield, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import adminApi from '../../api/adminApi';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    // 30 Days ago default
    const defaultFromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultToDate = new Date().toISOString().split('T')[0];

    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [teacherRankings, setTeacherRankings] = useState([]);
    const [courseRankings, setCourseRankings] = useState([]);
    
    // Filters State
    const [teachersFilterList, setTeachersFilterList] = useState([]);
    const [coursesFilterList, setCoursesFilterList] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [fromDate, setFromDate] = useState(defaultFromDate);
    const [toDate, setToDate] = useState(defaultToDate);

    const [loadingSummary, setLoadingSummary] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);
    const [loadingRankings, setLoadingRankings] = useState(true);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value ?? 0);

    // Fetch static filters list once
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await adminApi.getAdminFiltersData();
                setTeachersFilterList(res.data.teachers || []);
                setCoursesFilterList(res.data.courses || []);
            } catch (err) {
                console.error('Error fetching admin filters:', err);
                toast.error('Không thể tải dữ liệu bộ lọc');
            }
        };
        fetchFilters();
    }, []);

    // Fetch system statistics summary once
    useEffect(() => {
        const fetchSummary = async () => {
            setLoadingSummary(true);
            try {
                const res = await adminApi.getAdminSummary();
                setSummary(res.data);
            } catch (err) {
                console.error('Error fetching admin summary:', err);
                toast.error('Không thể tải tổng quan hệ thống');
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }, []);

    // Fetch rankings lists once
    useEffect(() => {
        const fetchRankings = async () => {
            setLoadingRankings(true);
            try {
                const [teacherRes, courseRes] = await Promise.all([
                    adminApi.getTeacherRankings(),
                    adminApi.getCourseRankings()
                ]);
                setTeacherRankings(teacherRes.data || []);
                setCourseRankings(courseRes.data || []);
            } catch (err) {
                console.error('Error fetching rankings:', err);
                toast.error('Không thể tải bảng xếp hạng');
            } finally {
                setLoadingRankings(false);
            }
        };
        fetchRankings();
    }, []);

    // Fetch dynamic revenue chart data upon filter changes
    const fetchRevenueChart = useCallback(async () => {
        setLoadingChart(true);
        try {
            // Convert to Instant ISO strings (UTC) if filters are present
            const startInstant = fromDate ? new Date(`${fromDate}T00:00:00.000Z`).toISOString() : undefined;
            const endInstant = toDate ? new Date(`${toDate}T23:59:59.999Z`).toISOString() : undefined;

            const params = {
                fromDate: startInstant,
                toDate: endInstant,
                teacherId: selectedTeacher || undefined,
                courseId: selectedCourse || undefined
            };

            const res = await adminApi.getAdminRevenueChart(params);
            setChartData(res.data || []);
        } catch (err) {
            console.error('Error fetching revenue chart:', err);
            toast.error('Không thể tải biểu đồ doanh thu');
        } finally {
            setLoadingChart(false);
        }
    }, [fromDate, toDate, selectedTeacher, selectedCourse]);

    useEffect(() => {
        fetchRevenueChart();
    }, [fetchRevenueChart]);

    // Handle teacher selection change (autofilters courses option list)
    const handleTeacherChange = (e) => {
        setSelectedTeacher(e.target.value);
        setSelectedCourse(''); // Reset course filter
    };

    // Filter courses option list dynamically
    const filteredCoursesOptions = useMemo(() => {
        if (!selectedTeacher) return coursesFilterList;
        return coursesFilterList.filter(c => String(c.teacherId) === String(selectedTeacher));
    }, [selectedTeacher, coursesFilterList]);

    // Overall summary card configurations
    const statsCards = useMemo(() => [
        { label: 'Tổng doanh thu', value: formatCurrency(summary?.totalRevenue || 0), icon: FaChartLine, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Khóa học', value: summary?.totalCourses || 0, icon: FaBookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Học viên', value: summary?.totalStudents?.toLocaleString() || 0, icon: FaUserGraduate, color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Giáo viên', value: summary?.totalTeachers || 0, icon: FaChalkboardTeacher, color: 'text-amber-600', bg: 'bg-amber-50' },
    ], [summary]);

    // Leaders rank badge utility
    const rankStyle = (rank) => {
        if (rank === 1) return { badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200', icon: '🥇' };
        if (rank === 2) return { badge: 'bg-slate-100 text-slate-600 border border-slate-200', icon: '🥈' };
        if (rank === 3) return { badge: 'bg-orange-100 text-orange-700 border border-orange-200', icon: '🥉' };
        return { badge: 'bg-slate-50 text-slate-500', icon: `#${rank}` };
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Greeting */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                    Thống kê toàn bộ hệ thống
                </h1>
                <p className="text-slate-500 font-medium">Báo cáo doanh thu, tăng trưởng học viên và hiệu quả kinh doanh</p>
            </div>

            {/* Overall Aggregate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all duration-300"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                            {loadingSummary ? (
                                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
                            ) : (
                                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                            )}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg shadow-${stat.color.split('-')[1]}-200/20`}>
                            <stat.icon size={22} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Dynamic Revenue Trends Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50"
            >
                {/* Chart Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <FaChartLine />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu hệ thống</h3>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lọc chi tiết theo khoảng thời gian và đối tượng</p>
                        </div>
                    </div>

                    {/* Interactive Filter Panel */}
                    <div className="flex flex-wrap items-center gap-4 bg-slate-50/70 p-4 rounded-3xl border border-slate-100">
                        {/* Start Date */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Từ ngày</span>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={e => setFromDate(e.target.value)}
                                    className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đến ngày</span>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm" />
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={e => setToDate(e.target.value)}
                                    className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        {/* Teacher Dropdown */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giáo viên</span>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500 text-xs" />
                                <select
                                    value={selectedTeacher}
                                    onChange={handleTeacherChange}
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none min-w-[150px]"
                                >
                                    <option value="">Tất cả giáo viên</option>
                                    {teachersFilterList.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Course Dropdown */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khóa học</span>
                            <div className="relative">
                                <FaBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-xs" />
                                <select
                                    value={selectedCourse}
                                    onChange={e => setSelectedCourse(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none min-w-[160px] max-w-[220px]"
                                >
                                    <option value="">Tất cả khóa học</option>
                                    {filteredCoursesOptions.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Button */}
                        <button
                            onClick={() => {
                                setFromDate(defaultFromDate);
                                setToDate(defaultToDate);
                                setSelectedTeacher('');
                                setSelectedCourse('');
                            }}
                            className="px-4 py-2 mt-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all text-xs"
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>

                {/* Main Graph View */}
                <div className="h-[360px] w-full">
                    {loadingChart ? (
                        <div className="h-full w-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <FaChartLine size={40} className="mb-2 opacity-25" />
                            <p className="font-semibold text-sm">Không tìm thấy dữ liệu doanh thu trong thời gian này</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAdminRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.08)', padding: '12px' }}
                                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                    labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAdminRevenue)" animationDuration={1000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>

            {/* Double leaderboards side-by-side split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Teacher Rankings */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <FaTrophy />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Xếp hạng giáo viên</h3>
                            <p className="text-xs text-slate-400 font-semibold">Theo tổng doanh thu hệ thống đóng góp</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto min-h-[300px]">
                        {loadingRankings ? (
                            <div className="h-48 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                            </div>
                        ) : teacherRankings.length === 0 ? (
                            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                                <FaUser size={30} className="mb-2 opacity-20" />
                                <p className="text-xs font-semibold">Chưa có giáo viên nào đạt thứ hạng</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-slate-50 pb-3">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Hạng</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Giáo viên</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Lượt bán</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/50">
                                    {teacherRankings.map((teacher) => {
                                        const { badge, icon } = rankStyle(teacher.rank);
                                        return (
                                            <tr key={teacher.teacherId} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold ${badge}`}>
                                                        {icon}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        {teacher.teacherAvatar ? (
                                                            <img src={teacher.teacherAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                                <FaUser className="text-slate-400 text-xs" />
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-bold text-slate-700">{teacher.teacherName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-xs font-bold text-slate-500">{teacher.salesCount?.toLocaleString() || 0}</span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-sm font-extrabold text-emerald-600">{formatCurrency(teacher.revenue)}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>

                {/* 2. Course Rankings */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <FaTrophy />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Xếp hạng khóa học</h3>
                            <p className="text-xs text-slate-400 font-semibold">Theo doanh thu khóa học bán ra</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto min-h-[300px]">
                        {loadingRankings ? (
                            <div className="h-48 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                            </div>
                        ) : courseRankings.length === 0 ? (
                            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                                <FaBookOpen size={30} className="mb-2 opacity-20" />
                                <p className="text-xs font-semibold">Chưa có khóa học nào đạt thứ hạng</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-slate-50 pb-3">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">Hạng</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Khóa học</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Lượt bán</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Đánh giá</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/50">
                                    {courseRankings.map((course) => {
                                        const { badge, icon } = rankStyle(course.rank);
                                        return (
                                            <tr key={course.courseId} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold ${badge}`}>
                                                        {icon}
                                                    </span>
                                                </td>
                                                <td className="py-4 max-w-[200px] truncate">
                                                    <p className="text-sm font-bold text-slate-700 truncate" title={course.courseName}>{course.courseName}</p>
                                                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{course.teacherName}</p>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-xs font-bold text-slate-500">{course.salesCount?.toLocaleString() || 0}</span>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                                                        <FaStar className="text-yellow-400 text-[10px]" /> {course.averageRating?.toFixed(1) || '0.0'}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-sm font-extrabold text-emerald-600">{formatCurrency(course.revenue)}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
