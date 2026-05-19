import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaBookOpen, FaUserGraduate, FaChartLine, FaStar, FaFilter, FaTrophy, FaTimes, FaCalendarAlt, FaSearch, FaDownload, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import StatsGrid from '../../components/common/teacher/StatsGrid';
import teacherApi from '../../api/teacherApi';
import { toast } from 'react-hot-toast';

/* ─────────────────────────────────────────
   MODAL: Báo cáo chi tiết bán chạy nhất
───────────────────────────────────────── */
const DetailReportModal = ({ onClose }) => {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const [fromDate, setFromDate] = useState(firstDayOfMonth);
    const [toDate, setToDate] = useState(today);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value ?? 0);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        try {
            const res = await teacherApi.getTopCoursesDetail(fromDate || undefined, toDate || undefined);
            setData(res.data);
        } catch {
            toast.error('Không thể tải báo cáo chi tiết');
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate]);

    useEffect(() => { fetchDetail(); }, [fetchDetail]);

    const filtered = data.filter(c =>
        c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = data.reduce((s, c) => s + (c.revenue ?? 0), 0);
    const totalSales   = data.reduce((s, c) => s + (c.salesCount ?? 0), 0);

    const rankStyle = (rank) => {
        if (rank === 1) return { badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200', icon: '🥇' };
        if (rank === 2) return { badge: 'bg-slate-100 text-slate-600 border border-slate-200', icon: '🥈' };
        if (rank === 3) return { badge: 'bg-orange-100 text-orange-700 border border-orange-200', icon: '🥉' };
        return { badge: 'bg-slate-50 text-slate-500', icon: `#${rank}` };
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                />

                {/* Modal */}
                <motion.div
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
                    initial={{ opacity: 0, scale: 0.93, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 30 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 flex-shrink-0">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl">
                                    📊
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-white">Báo cáo chi tiết bán chạy nhất</h2>
                                    <p className="text-white/80 text-sm font-medium mt-0.5">Doanh thu · Lượt bán · Giảng viên</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Date filter */}
                        <div className="mt-5 flex flex-wrap items-end gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-white/80 text-xs font-semibold uppercase tracking-wide">Từ ngày</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={e => setFromDate(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-white rounded-xl text-slate-700 font-semibold text-sm outline-none shadow-sm focus:ring-2 focus:ring-white/50"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-white/80 text-xs font-semibold uppercase tracking-wide">Đến ngày</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm" />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={e => setToDate(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-white rounded-xl text-slate-700 font-semibold text-sm outline-none shadow-sm focus:ring-2 focus:ring-white/50"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={fetchDetail}
                                className="px-5 py-2 bg-white text-emerald-600 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors text-sm flex items-center gap-2"
                            >
                                <FaSearch size={12} /> Lọc
                            </button>
                            <button
                                onClick={() => { setFromDate(''); setToDate(''); }}
                                className="px-5 py-2 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors text-sm"
                            >
                                Tất cả thời gian
                            </button>
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tổng doanh thu</p>
                            <p className="text-xl font-extrabold text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tổng lượt bán</p>
                            <p className="text-xl font-extrabold text-blue-600 mt-1">{totalSales.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Số khóa học</p>
                            <p className="text-xl font-extrabold text-purple-600 mt-1">{data.length}</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="px-6 pt-4 pb-2 flex-shrink-0">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên khóa học hoặc giảng viên..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {loading ? (
                            <div className="h-48 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                                <FaBookOpen size={40} className="mb-3 opacity-20" />
                                <p className="font-medium text-sm">Không có dữ liệu trong khoảng thời gian này</p>
                            </div>
                        ) : (
                            <table className="w-full mt-2">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-12">Hạng</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Khóa học</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Giảng viên</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Lượt bán</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Đánh giá</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filtered.map((course) => {
                                        const { badge, icon } = rankStyle(course.rank);
                                        return (
                                            <motion.tr
                                                key={course.courseId}
                                                className="group hover:bg-emerald-50/50 transition-colors rounded-xl"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <td className="py-3 pr-2">
                                                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold ${badge}`}>
                                                        {icon}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-sm leading-tight">
                                                        {course.courseName}
                                                    </p>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        {course.teacherAvatar ? (
                                                            <img src={course.teacherAvatar} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                <FaUser className="text-emerald-500 text-xs" />
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-semibold text-slate-600">{course.teacherName || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                                                        <FaUserGraduate className="text-blue-300 text-xs" />
                                                        {course.salesCount?.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-yellow-600">
                                                        <FaStar className="text-yellow-400 text-xs" />
                                                        {course.averageRating?.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span className="text-sm font-extrabold text-emerald-600">{formatCurrency(course.revenue)}</span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
const TeacherDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [period, setPeriod] = useState('MONTH');
    const [loading, setLoading] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [coursesRes, topRes] = await Promise.all([
                    teacherApi.getMyCoursesBasic(),
                    teacherApi.getTopCourses()
                ]);
                setMyCourses(coursesRes.data);
                setTopCourses(topRes.data);
            } catch (error) {
                console.error('Error fetching initial dashboard data:', error);
                toast.error('Không thể tải danh sách khóa học');
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [summaryRes, chartRes] = await Promise.all([
                    teacherApi.getSummary(selectedCourse),
                    teacherApi.getRevenueChart(selectedCourse, period)
                ]);
                setSummary(summaryRes.data);
                setChartData(chartRes.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error('Không thể tải dữ liệu thống kê');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [selectedCourse, period]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

    const stats = useMemo(() => [
        { id: 1, label: 'Tổng số khóa học', value: summary?.totalCourses || 0, icon: FaBookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/teacher/courses' },
        { id: 2, label: 'Tổng doanh thu', value: formatCurrency(summary?.totalRevenue || 0), icon: FaChartLine, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 3, label: 'Tổng học viên', value: summary?.totalStudents?.toLocaleString() || 0, icon: FaUserGraduate, color: 'text-purple-600', bg: 'bg-purple-50', link: '/teacher/students' },
        { id: 4, label: 'Đánh giá trung bình', value: `${summary?.averageRating || 0}/5.0`, icon: FaStar, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ], [summary]);

    const periods = [
        { value: 'DAY', label: 'Ngày' },
        { value: 'WEEK', label: 'Tuần' },
        { value: 'MONTH', label: 'Tháng' },
        { value: 'YEAR', label: 'Năm' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header with Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                        Thống kê tổng quan
                    </h1>
                    <p className="text-slate-500 font-medium">Theo dõi hiệu suất giảng dạy và doanh thu của bạn</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                            <FaFilter size={14} />
                        </div>
                        <select
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none text-slate-700 font-semibold min-w-[220px]"
                            value={selectedCourse || ''}
                            onChange={(e) => setSelectedCourse(e.target.value || null)}
                        >
                            <option value="">Tất cả khóa học</option>
                            {myCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <StatsGrid stats={stats} columns={4} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <FaChartLine />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Xu hướng doanh thu</h3>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dữ liệu cập nhật thời gian thực</p>
                            </div>
                        </div>
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 self-start sm:self-center">
                            {periods.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => setPeriod(p.value)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        period === p.value
                                            ? 'bg-white text-emerald-600 shadow-sm border border-slate-100'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                        labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Top Selling Courses */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <FaTrophy />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Bán chạy nhất</h3>
                    </div>

                    <div className="space-y-5 flex-1">
                        {topCourses.map((course, index) => (
                            <div key={course.courseId} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-slate-100 text-slate-600' :
                                        'bg-orange-50 text-orange-700'
                                    }`}>
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">
                                        {course.courseName}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <FaUserGraduate className="text-slate-300" /> {course.studentCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" /> {course.averageRating}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-slate-700 text-sm">{formatCurrency(course.revenue)}</p>
                                </div>
                            </div>
                        ))}

                        {topCourses.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                                <FaBookOpen size={40} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">Chưa có dữ liệu khóa học</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowDetailModal(true)}
                        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-2"
                    >
                        <FaTrophy size={13} />
                        Xem chi tiết báo cáo
                    </button>
                </motion.div>
            </div>

            {/* Detail Report Modal */}
            {showDetailModal && <DetailReportModal onClose={() => setShowDetailModal(false)} />}
        </div>
    );
};

export default TeacherDashboard;
