import React, { useState, useEffect, useMemo } from 'react';
import { FaBookOpen, FaUserGraduate, FaChartLine, FaStar, FaFilter, FaCalendarAlt, FaTrophy, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import StatsGrid from '../../components/common/teacher/StatsGrid';
import teacherApi from '../../api/teacherApi';
import { toast } from 'react-hot-toast';

const TeacherDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [period, setPeriod] = useState('MONTH');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [coursesRes, topRes] = await Promise.all([
                    teacherApi.getMyCoursesBasic(),
                    teacherApi.getTopCourses()
                ]);
                setMyCourses(coursesRes.data);
                setTopCourses(topRes.data);
                console.log(topCourses.map(c => c.courseId));
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND',
            maximumFractionDigits: 0 
        }).format(value);
    };

    const stats = useMemo(() => [
        { 
            id: 1, 
            label: 'Tổng số khóa học', 
            value: summary?.totalCourses || 0, 
            icon: FaBookOpen, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            link: '/teacher/courses' 
        },
        { 
            id: 2, 
            label: 'Tổng doanh thu', 
            value: formatCurrency(summary?.totalRevenue || 0), 
            icon: FaChartLine, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            id: 3, 
            label: 'Tổng học viên', 
            value: summary?.totalStudents?.toLocaleString() || 0, 
            icon: FaUserGraduate, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50', 
            link: '/teacher/students' 
        },
        { 
            id: 4, 
            label: 'Đánh giá trung bình', 
            value: `${summary?.averageRating || 0}/5.0`, 
            icon: FaStar, 
            color: 'text-yellow-600', 
            bg: 'bg-yellow-50' 
        },
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
                    {/* Course Filter */}
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <StatsGrid stats={stats} columns={4} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
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

                        {/* Period Filter - Relocated here for better context */}
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="label" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '16px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                        formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                        labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#10b981" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Top Selling Courses */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
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
                                    <p className="font-extrabold text-slate-700 text-sm">
                                        {formatCurrency(course.revenue)}
                                    </p>
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

                    <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                        Xem chi tiết báo cáo
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
